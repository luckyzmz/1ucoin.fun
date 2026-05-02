import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Wallet, ArrowRight, Coins, Star, Activity, ExternalLink, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWallet, useDrawStatus, purchaseShares } from "@/web3/useContract";
import { AMOY_CHAIN_ID, CONTRACT_ADDRESS, SUPPORTED_TOKENS } from "@/web3/config";
import LiveTicker from "@/components/LiveTicker";

/**
 * Game — 1ucoin.fun dApp 主页面
 *
 * 连接钱包 → 选择币种 → 购买份额 → 等待抽签
 */

export default function Game() {
  const { t } = useTranslation();
  const wallet = useWallet();
  const { draw: contractDraw, loading: drawLoading, refetch: refetchDraw } = useDrawStatus();
  const [shares, setShares] = useState(1);
  const [txPending, setTxPending] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const isAmoy = wallet.chainId === AMOY_CHAIN_ID;

  // ── 购买份额 ──
  async function handlePurchase() {
    if (!wallet.address) {
      await wallet.connect();
      return;
    }
    if (!isAmoy) {
      await wallet.switchToAmoy();
      return;
    }

    setTxPending(true);
    setTxHash(null);
    try {
      const hash = await purchaseShares(shares);
      setTxHash(hash);
      refetchDraw();
    } catch (err: any) {
      console.error("Purchase failed:", err);
    } finally {
      setTxPending(false);
    }
  }

  // ── 模拟的当前奖池（合约未部署时） ──
  const demoDraw = {
    targetSymbol: "BTC",
    totalShares: 62,
    sharesSold: 45,
    drawActive: true,
    winner: null as string | null,
  };

  const draw = contractDraw?.drawActive
    ? contractDraw
    : demoDraw;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 顶部导航 */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-purple-500/20">
        <div className="container flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl neon-glow">1UCOIN</span>
          </a>

          <div className="flex items-center gap-4">
            {!wallet.address ? (
              <Button
                onClick={wallet.connect}
                disabled={wallet.isConnecting}
                className="cyber-button"
              >
                <Wallet className="w-4 h-4 mr-2" />
                {wallet.isConnecting ? "Connecting..." : t("game.connectWallet")}
              </Button>
            ) : !isAmoy ? (
              <Button onClick={wallet.switchToAmoy} className="bg-yellow-500 hover:bg-yellow-600">
                <AlertCircle className="w-4 h-4 mr-2" />
                Switch to Amoy
              </Button>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-xs px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full">
                  Amoy
                </span>
                <span className="text-sm text-gray-400">
                  {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                </span>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* LiveTicker */}
      <div className="pt-16">
        <LiveTicker />
      </div>

      {/* 主内容区 */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* ── 左：当前奖池 ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* 当前抽奖卡片 */}
            <div className="cyber-card relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-xs font-semibold animate-pulse">
                  LIVE
                </span>
              </div>

              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Activity className="w-6 h-6 text-purple-400" />
                {t("game.currentDraw")}
              </h2>

              {/* 币种 + 进度 */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-orange-500/30">
                    {draw.targetSymbol[0]}
                  </div>
                  <div>
                    <h3 className="text-3xl font-black">{draw.targetSymbol}</h3>
                    <p className="text-gray-400 text-sm">
                      {draw.drawActive ? t("game.roundActive") : t("game.roundEnded")}
                    </p>
                  </div>
                </div>

                {/* 进度条 */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">
                      {t("game.sharesSold")}: {draw.sharesSold}/{draw.totalShares}
                    </span>
                    <span className="text-purple-400 font-semibold">
                      {draw.totalShares > 0
                        ? Math.round((draw.sharesSold / draw.totalShares) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full transition-all duration-700"
                      style={{
                        width: `${
                          draw.totalShares > 0
                            ? (draw.sharesSold / draw.totalShares) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {/* 购买区 */}
                <div className="bg-slate-900/50 rounded-lg p-4 border border-purple-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-400">{t("game.pricePerShare")}</span>
                    <span className="font-bold text-lg text-purple-300">1 USDT</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      className="border-purple-500/50 text-purple-300"
                      onClick={() => setShares(Math.max(1, shares - 1))}
                      disabled={shares <= 1}
                    >
                      -
                    </Button>
                    <input
                      type="number"
                      min={1}
                      max={draw.totalShares - draw.sharesSold}
                      value={shares}
                      onChange={(e) => {
                        const v = parseInt(e.target.value) || 1;
                        setShares(
                          Math.max(1, Math.min(v, draw.totalShares - draw.sharesSold))
                        );
                      }}
                      className="w-20 text-center bg-transparent border border-purple-500/30 rounded-lg py-2 text-white font-bold text-lg"
                    />
                    <Button
                      variant="outline"
                      className="border-purple-500/50 text-purple-300"
                      onClick={() =>
                        setShares(
                          Math.min(shares + 1, draw.totalShares - draw.sharesSold)
                        )
                      }
                      disabled={shares >= draw.totalShares - draw.sharesSold}
                    >
                      +
                    </Button>

                    <Button
                      className="cyber-button flex-1 ml-2"
                      onClick={handlePurchase}
                      disabled={txPending || !draw.drawActive}
                    >
                      {txPending ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <ArrowRight className="w-4 h-4 mr-2" />
                      )}
                      {txPending
                        ? t("game.pending")
                        : `${t("game.buy")} ${shares} ${t("game.shares")}`}
                    </Button>
                  </div>

                  <p className="text-xs text-gray-500 mt-2">
                    {t("game.total")}: {shares} USDT
                  </p>
                </div>

                {/* 交易结果 */}
                {txHash && (
                  <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <p className="text-green-400 text-sm flex items-center gap-2">
                      <ExternalLink className="w-3 h-3" />
                      TX: {txHash.slice(0, 10)}...{txHash.slice(-8)}
                    </p>
                  </div>
                )}

                {/* 获奖者 */}
                {draw.winner && draw.winner !== "0x0000000000000000000000000000000000000000" && (
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <p className="text-yellow-400 flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      {t("game.winner")}: {draw.winner.slice(0, 6)}...{draw.winner.slice(-4)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── 右：信息面板 ── */}
          <div className="space-y-6">
            {/* 支持的币种 */}
            <div className="cyber-card">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Coins className="w-5 h-5 text-yellow-400" />
                {t("game.supportedCoins")}
              </h3>
              <div className="space-y-3">
                {SUPPORTED_TOKENS.map((token) => (
                  <div
                    key={token.symbol}
                    className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg border border-purple-500/10 hover:border-purple-500/30 transition"
                  >
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-br ${token.color} flex items-center justify-center text-white font-bold text-sm`}
                    >
                      {token.symbol[0]}
                    </div>
                    <div>
                      <p className="font-semibold">{token.symbol}</p>
                      <p className="text-xs text-gray-400">{token.name}</p>
                    </div>
                    <span className="ml-auto text-xs text-purple-400">{t("game.lottery")}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 规则说明 */}
            <div className="cyber-card">
              <h3 className="font-bold text-lg mb-4">{t("game.rules")}</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 bg-purple-500/20 rounded-full flex items-center justify-center text-xs text-purple-400 mt-0.5">1</span>
                  {t("game.rule1")}
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 bg-purple-500/20 rounded-full flex items-center justify-center text-xs text-purple-400 mt-0.5">2</span>
                  {t("game.rule2")}
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 bg-purple-500/20 rounded-full flex items-center justify-center text-xs text-purple-400 mt-0.5">3</span>
                  {t("game.rule3")}
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 bg-purple-500/20 rounded-full flex items-center justify-center text-xs text-purple-400 mt-0.5">4</span>
                  {t("game.rule4")}
                </li>
              </ul>
            </div>

            {/* 合约信息 */}
            <div className="cyber-card">
              <h3 className="font-bold text-lg mb-4">{t("game.contract")}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">{t("game.network")}</span>
                  <span className="text-purple-400">Polygon Amoy</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Chain ID</span>
                  <span className="text-purple-400">80002</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">{t("game.fee")}</span>
                  <span className="text-purple-400">5%</span>
                </div>
                <div className="pt-2 border-t border-purple-500/20">
                  <p className="text-gray-500 text-xs truncate">
                    Contract: {CONTRACT_ADDRESS}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* neon-glow style */}
      <style>{`
        .neon-glow {
          text-shadow: 0 0 10px rgba(168, 85, 247, 0.5),
                       0 0 20px rgba(168, 85, 247, 0.3);
        }
        .cyber-card {
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(168, 85, 247, 0.2);
          border-radius: 12px;
          padding: 24px;
          backdrop-filter: blur(12px);
        }
        .cyber-button {
          background: linear-gradient(135deg, #a855f7, #06b6d4);
          color: white;
          font-weight: 600;
          border: none;
          transition: all 0.3s;
        }
        .cyber-button:hover {
          box-shadow: 0 0 20px rgba(168, 85, 247, 0.4);
          transform: translateY(-1px);
        }
        .cyber-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
      `}</style>
    </div>
  );
}
