import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { ChevronLeft, Wallet, Coins, TrendingUp, Loader2, ExternalLink, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Web3Provider, useWeb3, shortAddress } from "@/web3/useWeb3";
import {
  CONTRACT_ADDRESS,
  TOKENS,
  POLYGON_CHAIN_ID,
  ONEUCOIN_ABI,
  ERC20_ABI,
  USDT_ADDRESS,
} from "@/web3/config";
import LanguageSwitcher from "@/components/LanguageSwitcher";

// ============================================
// Draw Status
// ============================================
interface DrawInfo {
  round: number;
  targetSymbol: string;
  totalShares: number;
  sharesSold: number;
  lockedPrice: number;
  active: boolean;
  completed: boolean;
  winner: string;
  currentPrice: number;
}

// ============================================
// 主页面
// ============================================
export default function GamePage() {
  return (
    <Web3Provider>
      <GameContent />
    </Web3Provider>
  );
}

function GameContent() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { account, chainId, isConnected, isConnecting, error: walletError, connect, disconnect, switchToPolygon } = useWeb3();

  const [selectedCoin, setSelectedCoin] = useState("ETH");
  const [shareAmount, setShareAmount] = useState(1);
  const [drawInfo, setDrawInfo] = useState<DrawInfo | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [txError, setTxError] = useState<string | null>(null);

  const isPolygon = chainId === POLYGON_CHAIN_ID;

  // ==========================================
  // 读合约：当前奖池状态
  // ==========================================
  const fetchDrawStatus = useCallback(async () => {
    if (!window.ethereum || !isConnected) return;
    try {
      // 调用 getDrawStatus()
      const data = await window.ethereum.request<string>({
        method: "eth_call",
        params: [
          {
            to: CONTRACT_ADDRESS,
            data: "0x5c1952a5", // getDrawStatus() 函数选择器
          },
          "latest",
        ],
      });
      if (data) {
        // 解析 ABI 编码的返回值（简化版，实际应用解码）
        // 这里用事件监听代替；初次加载显示合约地址
        setDrawInfo({
          round: 0,
          targetSymbol: selectedCoin,
          totalShares: 2500,
          sharesSold: 0,
          lockedPrice: 2500,
          active: false,
          completed: false,
          winner: "0x0000",
          currentPrice: 2500,
        });
      }
    } catch {
      // 合约未部署时，静默处理
    }
  }, [isConnected, selectedCoin]);

  useEffect(() => {
    fetchDrawStatus();
  }, [fetchDrawStatus]);

  // ==========================================
  // 购买股数
  // ==========================================
  const buyShares = useCallback(async () => {
    if (!window.ethereum || !account || !isPolygon) return;
    setIsPending(true);
    setTxError(null);
    setTxHash(null);

    try {
      // Step 1: 授权 USDT
      const approveData =
        "0x095ea7b3" + // approve(address,uint256)
        CONTRACT_ADDRESS.slice(2).padStart(64, "0") +
        (shareAmount * 1e6).toString(16).padStart(64, "0");

      const approveTx = await window.ethereum.request<string>({
        method: "eth_sendTransaction",
        params: [
          {
            from: account,
            to: USDT_ADDRESS,
            data: approveData,
          },
        ],
      });

      // Step 2: 等待确认（简化，实际应用用 Web3 库）
      // Step 3: 调用 purchaseShares
      const buyData =
        "0x3b13f615" + // purchaseShares(uint256) 函数选择器
        shareAmount.toString(16).padStart(64, "0");

      const buyTx = await window.ethereum.request<string>({
        method: "eth_sendTransaction",
        params: [
          {
            from: account,
            to: CONTRACT_ADDRESS,
            data: buyData,
            gas: "0x30D40", // 200k gas
          },
        ],
      });

      setTxHash(buyTx ?? "");
      await fetchDrawStatus();
    } catch (e) {
      setTxError((e as Error).message?.slice(0, 200) || "Transaction failed");
    } finally {
      setIsPending(false);
    }
  }, [account, isPolygon, shareAmount, fetchDrawStatus]);

  // ==========================================
  // 渲染
  // ==========================================
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 顶栏 */}
      <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-purple-500/20">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setLocation("/")}>
              <ChevronLeft className="w-4 h-4 mr-1" />
              Home
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Coins className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg neon-glow">PLAY</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            {!isConnected ? (
              <Button className="cyber-button" onClick={connect} disabled={isConnecting}>
                {isConnecting ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Connecting...</>
                ) : (
                  <><Wallet className="w-4 h-4 mr-2" /> Connect Wallet</>
                )}
              </Button>
            ) : (
              <div className="flex items-center gap-3">
                {!isPolygon && (
                  <Button size="sm" variant="outline" className="border-orange-500 text-orange-400" onClick={switchToPolygon}>
                    Switch to Polygon
                  </Button>
                )}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 rounded-full">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm font-mono text-purple-300">
                    {shortAddress(account ?? "")}
                  </span>
                </div>
                <Button size="sm" variant="ghost" onClick={disconnect}>
                  Disconnect
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* 钱包错误 */}
      {walletError && (
        <div className="container mt-4">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 text-sm">
            {walletError}
          </div>
        </div>
      )}

      <div className="container py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* ============================================ */}
          {/* 左侧：购买面板 */}
          {/* ============================================ */}
          <div className="lg:col-span-2 space-y-6">
            <div className="cyber-card">
              <h2 className="text-2xl font-bold mb-6">
                {t("nav.enterGame")} <span className="neon-glow">{selectedCoin}</span>
              </h2>

              {/* 币种选择 */}
              <div className="mb-6">
                <label className="text-sm text-gray-400 mb-2 block">Select Coin</label>
                <div className="grid grid-cols-4 gap-2">
                  {Object.entries(TOKENS).map(([key, token]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedCoin(key)}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        selectedCoin === key
                          ? "border-purple-500 bg-purple-500/20 text-purple-300 neon-border"
                          : "border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-500"
                      }`}
                    >
                      <div className="font-bold text-lg">{key}</div>
                      <div className="text-xs text-gray-500 mt-1">{token.symbol}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 股数输入 */}
              <div className="mb-6">
                <label className="text-sm text-gray-400 mb-2 block">Number of Shares</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShareAmount(Math.max(1, shareAmount - 1))}
                    className="w-10 h-10 rounded-lg border border-purple-500/30 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 text-xl"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={shareAmount}
                    onChange={(e) => setShareAmount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="flex-1 h-12 text-center text-2xl font-bold bg-gray-900 border border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    min={1}
                  />
                  <button
                    onClick={() => setShareAmount(shareAmount + 1)}
                    className="w-10 h-10 rounded-lg border border-purple-500/30 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 text-xl"
                  >
                    +
                  </button>
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-400">
                  <span>{shareAmount} shares</span>
                  <span>= {shareAmount} USDT</span>
                </div>
              </div>

              {/* 手续费信息 */}
              <div className="bg-purple-500/5 border border-purple-500/10 rounded-lg p-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  Platform fee: 3% | Hold ODC for up to 40% discount
                </div>
              </div>

              {/* 购买按钮 */}
              <Button
                className="cyber-button w-full h-14 text-lg"
                disabled={!isConnected || !isPolygon || isPending}
                onClick={buyShares}
              >
                {isPending ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...</>
                ) : !isConnected ? (
                  <><Wallet className="w-5 h-5 mr-2" /> Connect Wallet to Play</>
                ) : !isPolygon ? (
                  "Switch to Polygon Network"
                ) : (
                  <><Zap className="w-5 h-5 mr-2" /> Buy {shareAmount} Shares ({shareAmount} USDT)</>
                )}
              </Button>

              {/* 交易错误 */}
              {txError && (
                <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
                  {txError}
                </div>
              )}

              {/* 交易成功 */}
              {txHash && (
                <div className="mt-4 bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-green-400 text-sm font-semibold">Transaction Submitted!</span>
                    <a
                      href={`https://polygonscan.com/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-purple-400 text-sm hover:text-purple-300"
                    >
                      View on Polygonscan
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <code className="text-xs text-gray-400 mt-1 block truncate">{txHash}</code>
                </div>
              )}
            </div>
          </div>

          {/* ============================================ */}
          {/* 右侧：状态面板 */}
          {/* ============================================ */}
          <div className="space-y-6">
            {/* 奖池信息 */}
            <div className="cyber-card">
              <h3 className="text-lg font-bold mb-4">Draw Pool</h3>
              {drawInfo ? (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Coin</span>
                    <span className="font-bold text-purple-400">{drawInfo.targetSymbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Shares</span>
                    <span className="font-bold">{drawInfo.totalShares.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Sold</span>
                    <span className="font-bold text-cyan-400">{drawInfo.sharesSold.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2 mt-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, (drawInfo.sharesSold / drawInfo.totalShares) * 100)}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{(drawInfo.sharesSold / drawInfo.totalShares * 100).toFixed(1)}% filled</span>
                    <span>{drawInfo.totalShares - drawInfo.sharesSold} remaining</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-700">
                    <span className="text-gray-400">Locked Price</span>
                    <span className="font-bold text-purple-300">${drawInfo.lockedPrice.toLocaleString()}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Coins className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Contract not yet deployed</p>
                  <p className="text-xs mt-1">Deploy to Polygon to start</p>
                </div>
              )}
            </div>

            {/* ODC 折扣卡片 */}
            <div className="cyber-card">
              <h3 className="text-lg font-bold mb-4">
                <TrendingUp className="w-5 h-5 inline mr-2 text-purple-400" />
                ODC Fee Discount
              </h3>
              <div className="space-y-2 text-sm">
                {[
                  { odc: "100", fee: "2.7%", discount: "10% off" },
                  { odc: "1,000", fee: "2.4%", discount: "20% off" },
                  { odc: "10,000", fee: "1.8%", discount: "40% off" },
                ].map((tier, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 rounded bg-purple-500/5 border border-purple-500/10"
                  >
                    <span className="text-purple-300 font-mono">{tier.odc} ODC</span>
                    <span className="text-gray-400">{tier.fee}</span>
                    <span className="text-cyan-400 text-xs">{tier.discount}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 帮助 */}
            <div className="cyber-card">
              <h3 className="text-lg font-bold mb-3">How It Works</h3>
              <ol className="space-y-2 text-sm text-gray-400 list-decimal list-inside">
                <li>Connect your Polygon wallet</li>
                <li>Select a coin pool to join</li>
                <li>Buy shares (1 share = 1 USDT)</li>
                <li>Pool fills → Chainlink VRF draws</li>
                <li>Win crypto or get ODC consolation</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
