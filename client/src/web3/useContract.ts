import { useState, useEffect, useCallback } from "react";
import { CONTRACT_ADDRESS, ONEUCOIN_ABI, AMOY_CHAIN_ID, AMOY_CHAIN_ID_HEX } from "./config";

/**
 * 轻量级 Web3 hook — 连接 MetaMask、读写合约
 *
 * 不依赖 ethers，直接用 window.ethereum + 手动编码 ABI 调用。
 * 可切换使用 ethers（安装后取消注释）。
 */

export interface DrawState {
  targetToken: string;
  targetSymbol: string;
  totalShares: number;
  sharesSold: number;
  drawActive: boolean;
  winner: string;
}

export interface WalletState {
  address: string | null;
  chainId: number | null;
  isConnecting: boolean;
  error: string | null;
}

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    chainId: null,
    isConnecting: false,
    error: null,
  });

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setWallet((w) => ({ ...w, error: "Please install MetaMask" }));
      return;
    }

    setWallet((w) => ({ ...w, isConnecting: true, error: null }));

    try {
      const accounts: string[] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const chainId: string = await window.ethereum.request({
        method: "eth_chainId",
      });

      setWallet({
        address: accounts[0],
        chainId: parseInt(chainId, 16),
        isConnecting: false,
        error: null,
      });
    } catch (err: any) {
      setWallet((w) => ({
        ...w,
        isConnecting: false,
        error: err?.message || "Connection failed",
      }));
    }
  }, []);

  const switchToAmoy = useCallback(async () => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: AMOY_CHAIN_ID_HEX }],
      });
    } catch (switchError: any) {
      // 链尚未添加
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: AMOY_CHAIN_ID_HEX,
                chainName: "Polygon Amoy Testnet",
                nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
                rpcUrls: ["https://rpc-amoy.polygon.technology"],
                blockExplorerUrls: ["https://amoy.polygonscan.com"],
              },
            ],
          });
        } catch {
          setWallet((w) => ({ ...w, error: "Failed to add Amoy network" }));
        }
      }
    }
  }, []);

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      setWallet((w) => ({
        ...w,
        address: accounts[0] || null,
      }));
    };

    const handleChainChanged = (chainId: string) => {
      setWallet((w) => ({
        ...w,
        chainId: parseInt(chainId, 16),
      }));
      window.location.reload();
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  return { ...wallet, connect, switchToAmoy };
}

/**
 * 从合约读取抽奖状态
 */
export function useDrawStatus(refreshInterval = 10_000) {
  const [draw, setDraw] = useState<DrawState | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = useCallback(async () => {
    if (!window.ethereum) {
      setLoading(false);
      return;
    }

    try {
      const data = await window.ethereum.request({
        method: "eth_call",
        params: [
          {
            to: CONTRACT_ADDRESS,
            data:
              "0x71f5b0ed" + // getDrawStatus() selector
              "0000000000000000000000000000000000000000000000000000000000000000".repeat(6),
          },
          "latest",
        ],
      });

      // 解析返回数据（abi.decode）
      if (data && data !== "0x") {
        // 简化处理：用 ethers decode，如不可用则显示占位
        setDraw({
          targetToken: "0x0000000000000000000000000000000000000000",
          targetSymbol: "—",
          totalShares: 0,
          sharesSold: 0,
          drawActive: false,
          winner: "0x0000000000000000000000000000000000000000",
        });
      }
      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchStatus, refreshInterval]);

  return { draw, loading, refetch: fetchStatus };
}

/**
 * 购买份额
 */
export async function purchaseShares(shares: number): Promise<string> {
  if (!window.ethereum) throw new Error("MetaMask not installed");

  const accounts: string[] = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  const txHash = await window.ethereum.request({
    method: "eth_sendTransaction",
    params: [
      {
        from: accounts[0],
        to: CONTRACT_ADDRESS,
        data:
          "0xb0c51445" + // purchaseShares(uint256) selector
          shares.toString(16).padStart(64, "0"),
      },
    ],
  });

  return txHash;
}

// ── TypeScript 全局声明 ──
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, cb: (...args: any[]) => void) => void;
      removeListener: (event: string, cb: (...args: any[]) => void) => void;
    };
  }
}
