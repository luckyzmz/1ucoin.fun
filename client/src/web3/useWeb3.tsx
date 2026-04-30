/**
 * useWeb3 — 轻量级钱包连接 Hook
 *
 * 使用 window.ethereum（MetaMask 等），无需额外依赖。
 * 如果你安装了 ethers，把 `provider.getSigner()` 改成 `provider.getSigner()` 即可获得 signer。
 */

import { useState, useEffect, useCallback, createContext, useContext } from "react";

export interface Web3State {
  account: string | null;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

interface Web3ContextType extends Web3State {
  connect: () => Promise<void>;
  disconnect: () => void;
  switchToPolygon: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | null>(null);

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Web3State>({
    account: null,
    chainId: null,
    isConnected: false,
    isConnecting: false,
    error: null,
  });

  // 检查已有连接
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window === "undefined" || !window.ethereum) return;
      try {
        const accounts = await window.ethereum.request<string[]>({
          method: "eth_accounts",
        });
        if (accounts && accounts.length > 0) {
          const chainId = await window.ethereum.request<string>({
            method: "eth_chainId",
          });
          setState({
            account: accounts[0],
            chainId: parseInt(chainId ?? "0", 16) || null,
            isConnected: true,
            isConnecting: false,
            error: null,
          });
        }
      } catch {
        // 静默处理
      }
    };
    checkConnection();
  }, []);

  // 监听钱包事件
  useEffect(() => {
    if (typeof window === "undefined" || !window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        setState((s) => ({ ...s, account: null, isConnected: false }));
      } else {
        setState((s) => ({ ...s, account: accounts[0], isConnected: true }));
      }
    };

    const handleChainChanged = (chainId: string) => {
      setState((s) => ({ ...s, chainId: parseInt(chainId, 16) || null }));
    };

    const handleDisconnect = () => {
      setState((s) => ({ ...s, account: null, isConnected: false }));
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);
    window.ethereum.on("disconnect", handleDisconnect);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
      window.ethereum.removeListener("disconnect", handleDisconnect);
    };
  }, []);

  // 连接钱包
  const connect = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      setState((s) => ({ ...s, error: "未检测到钱包。请安装 MetaMask。" }));
      return;
    }
    setState((s) => ({ ...s, isConnecting: true, error: null }));
    try {
      const accounts = await window.ethereum.request<string[]>({
        method: "eth_requestAccounts",
      });
      const chainId = await window.ethereum.request<string>({
        method: "eth_chainId",
      });
      setState({
        account: accounts?.[0] ?? null,
        chainId: parseInt(chainId ?? "0", 16) || null,
        isConnected: true,
        isConnecting: false,
        error: null,
      });
    } catch (e) {
      setState((s) => ({
        ...s,
        isConnecting: false,
        error: (e as Error).message || "连接被拒绝",
      }));
    }
  }, []);

  const disconnect = useCallback(() => {
    setState({
      account: null,
      chainId: null,
      isConnected: false,
      isConnecting: false,
      error: null,
    });
  }, []);

  const switchToPolygon = useCallback(async () => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x89" }], // Polygon 主网
      });
    } catch (e) {
      const err = e as { code?: number };
      // 4902 = chain 未添加
      if (err.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x89",
              chainName: "Polygon Mainnet",
              nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
              rpcUrls: ["https://polygon-rpc.com/"],
              blockExplorerUrls: ["https://polygonscan.com/"],
            },
          ],
        });
      }
    }
  }, []);

  return (
    <Web3Context.Provider
      value={{ ...state, connect, disconnect, switchToPolygon }}
    >
      {children}
    </Web3Context.Provider>
  );
}

/** 全局声明 */
declare global {
  interface Window {
    ethereum?: {
      request: <T>(args: { method: string; params?: unknown[] }) => Promise<T>;
      on: (event: string, cb: (...args: unknown[]) => void) => void;
      removeListener: (event: string, cb: (...args: unknown[]) => void) => void;
    };
  }
}

export const useWeb3 = () => {
  const ctx = useContext(Web3Context);
  if (!ctx) throw new Error("useWeb3 must be used within Web3Provider");
  return ctx;
};

/** 地址缩写 */
export const shortAddress = (addr: string) =>
  addr.slice(0, 6) + "..." + addr.slice(-4);
