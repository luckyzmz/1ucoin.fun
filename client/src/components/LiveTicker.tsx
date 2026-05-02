import { useEffect, useState, useRef } from "react";
import { Activity, TrendingUp, Users, Clock, Coins } from "lucide-react";

/**
 * LiveTicker — 实时滚动信息条
 *
 * 展示合约状态、价格、最近事件，如新闻跑马灯自动滚动。
 * 测试网阶段从合约读取数据，读取失败则显示模拟数据。
 */

interface TickerItem {
  icon: React.ReactNode;
  text: string;
  highlight?: boolean;
}

interface DrawState {
  active: boolean;
  symbol: string;
  totalShares: number;
  sharesSold: number;
  winner: string | null;
}

// ── 模拟数据（合约未部署时展示） ──
const MOCK_EVENTS: TickerItem[] = [
  {
    icon: <TrendingUp className="w-4 h-4 text-green-400" />,
    text: "BTC $67,420 ↑2.4%",
    highlight: true,
  },
  {
    icon: <TrendingUp className="w-4 h-4 text-green-400" />,
    text: "ETH $3,210 ↑1.8%",
  },
  {
    icon: <Activity className="w-4 h-4 text-purple-400" />,
    text: 'Lottery pool: BTC round active — 45/62 shares sold',
    highlight: true,
  },
  {
    icon: <Users className="w-4 h-4 text-cyan-400" />,
    text: "Last winner: 0x1234...abcd won 0.87 BTC",
    highlight: true,
  },
  {
    icon: <Coins className="w-4 h-4 text-yellow-400" />,
    text: "ODC reward: 1 USDT = 1 ODC — 100M total supply",
  },
  {
    icon: <Clock className="w-4 h-4 text-blue-400" />,
    text: "Next draw: ETH pool opening soon",
  },
  {
    icon: <Activity className="w-4 h-4 text-pink-400" />,
    text: "Gas fee < $0.01 on Polygon Amoy testnet",
  },
  {
    icon: <TrendingUp className="w-4 h-4 text-orange-400" />,
    text: "SOL $172 ↑5.1% — new pool request trending",
  },
];

function LiveTickerItem({ item }: { item: TickerItem }) {
  return (
    <span
      className={`inline-flex items-center gap-2 mx-6 whitespace-nowrap text-sm ${
        item.highlight ? "text-purple-200 font-semibold" : "text-gray-300"
      }`}
    >
      {item.icon}
      {item.text}
    </span>
  );
}

export default function LiveTicker() {
  const [items, setItems] = useState<TickerItem[]>(MOCK_EVENTS);
  const scrollRef = useRef<HTMLDivElement>(null);

  // ── 尝试从合约读取实时数据 ──
  useEffect(() => {
    let mounted = true;

    async function fetchContractState() {
      try {
        // 动态导入 ethers，避免未安装时报错
        const { JsonRpcProvider, Contract } = await import("ethers");
        const { CONTRACT_ADDRESS, ONEUCOIN_ABI } = await import("@/web3/config");

        if (CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
          // 合约未部署，保持模拟数据
          return;
        }

        const provider = new JsonRpcProvider("https://rpc-amoy.polygon.technology");
        const contract = new Contract(CONTRACT_ADDRESS, ONEUCOIN_ABI, provider);

        const status = await contract.getDrawStatus();
        const draw: DrawState = {
          active: status._drawActive,
          symbol: status._targetSymbol,
          totalShares: Number(status._totalShares),
          sharesSold: Number(status._sharesSold),
          winner: status._winner,
        };

        if (!mounted) return;

        const liveItems: TickerItem[] = [];

        if (draw.active) {
          liveItems.push({
            icon: <Activity className="w-4 h-4 text-purple-400 animate-pulse" />,
            text: `${draw.symbol} Lottery LIVE — ${draw.sharesSold}/${draw.totalShares} shares sold`,
            highlight: true,
          });
        }

        if (draw.winner && draw.winner !== "0x0000000000000000000000000000000000000000") {
          liveItems.push({
            icon: <Users className="w-4 h-4 text-cyan-400" />,
            text: `Latest winner: ${draw.winner.slice(0, 6)}...${draw.winner.slice(-4)} — ${draw.symbol}`,
            highlight: true,
          });
        }

        // 合并实时数据与静态信息
        setItems([...liveItems, ...MOCK_EVENTS.slice(0, 6 - liveItems.length)]);
      } catch {
        // 合约读取失败（未部署 / RPC 不可用），保持模拟数据
      }
    }

    fetchContractState();
    const interval = setInterval(fetchContractState, 15_000); // 15s 刷新
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="w-full bg-slate-900/80 border-y border-purple-500/20 overflow-hidden backdrop-blur-sm">
      <div className="flex items-center h-9">
        {/* 左侧标签 */}
        <div className="flex-shrink-0 px-3 h-full flex items-center bg-purple-500/20 border-r border-purple-500/30">
          <Activity className="w-3.5 h-3.5 text-purple-400 mr-1.5" />
          <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
            Live
          </span>
        </div>

        {/* 滚动内容 — CSS 动画驱动的跑马灯 */}
        <div className="flex-1 overflow-hidden relative">
          <div
            ref={scrollRef}
            className="flex items-center h-full animate-ticker"
            onMouseEnter={() => {
              if (scrollRef.current) {
                scrollRef.current.style.animationPlayState = "paused";
              }
            }}
            onMouseLeave={() => {
              if (scrollRef.current) {
                scrollRef.current.style.animationPlayState = "running";
              }
            }}
          >
            {/* 第一组 */}
            {items.map((item, i) => (
              <LiveTickerItem key={`a-${i}`} item={item} />
            ))}
            {/* 第二组 — 实现无缝循环 */}
            {items.map((item, i) => (
              <LiveTickerItem key={`b-${i}`} item={item} />
            ))}
          </div>
        </div>

        {/* 右侧渐变遮罩 */}
        <div className="flex-shrink-0 w-8 h-full bg-gradient-to-l from-slate-900/80 to-transparent pointer-events-none" />
      </div>

      {/* ticker 动画注入 */}
      <style>{`
        @keyframes ticker-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-ticker {
          animation: ticker-scroll 40s linear infinite;
          display: inline-flex;
          width: max-content;
        }
      `}</style>
    </div>
  );
}
