import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { ChevronLeft, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import i18n from '@/i18n/config';

/**
 * 白皮书详情页面 - 价格结算机制详解
 * 展示 1ucoin 的核心创新：动态锁定 + 溢价分享机制
 */

interface ScenarioData {
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  lockPrice: number;
  currentPrice: number;
  priceChange: number;
  winnerReward: string;
  winnerRewardEn: string;
  platformProfit: string;
  platformProfitEn: string;
  icon: React.ReactNode;
  color: string;
}

export default function Whitepaper() {
  const [, setLocation] = useLocation();
  const [language, setLanguage] = useState(i18n.language);

  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguage(i18n.language);
    };
    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const isZh = language === 'zh';

  const scenarios: ScenarioData[] = [
    {
      title: '币价上升（溢价）',
      titleEn: 'Price Appreciation',
      description: '当抽奖满额时，币价已上升。赢家获得等值 USDT，平台获得手续费和溢价利润。',
      descriptionEn: 'When the draw is full, the coin price has risen. Winners get equivalent USDT, and the platform profits from fees and premium.',
      lockPrice: 2500,
      currentPrice: 2550,
      priceChange: 50,
      winnerReward: '2425 USDT（2500 - 3% 手续费）',
      winnerRewardEn: '$2,425 USDT ($2,500 - 3% Fee)',
      platformProfit: '75 USDT（手续费）+ 50 USDT（溢价）= 125 USDT',
      platformProfitEn: '$75 USDT (Fee) + $50 USDT (Premium) = $125 USDT',
      icon: <TrendingUp className="w-8 h-8" />,
      color: 'from-green-500 to-emerald-600',
    },
    {
      title: '币价下跌（贬价）',
      titleEn: 'Price Depreciation',
      description: '当抽奖满额时，币价已下跌。赢家获得真实币种，平台获得手续费和贬价利润。',
      descriptionEn: 'When the draw is full, the coin price has fallen. Winners get real coins, and the platform profits from fees and depreciation.',
      lockPrice: 2500,
      currentPrice: 2450,
      priceChange: -50,
      winnerReward: '0.97 ETH（1 ETH - 3% 手续费）',
      winnerRewardEn: '0.97 ETH (1 ETH - 3% Fee)',
      platformProfit: '75 USDT（手续费）+ 50 USDT（贬价）= 125 USDT',
      platformProfitEn: '$75 USDT (Fee) + $50 USDT (Depreciation) = $125 USDT',
      icon: <TrendingDown className="w-8 h-8" />,
      color: 'from-orange-500 to-red-600',
    },
    {
      title: '币价不变',
      titleEn: 'Price Stable',
      description: '当抽奖满额时，币价保持不变。赢家获得等值 USDT，平台获得手续费。',
      descriptionEn: 'When the draw is full, the coin price remains stable. Winners get equivalent USDT, and the platform gets the fee.',
      lockPrice: 2500,
      currentPrice: 2500,
      priceChange: 0,
      winnerReward: '2425 USDT（2500 - 3% 手续费）',
      winnerRewardEn: '$2,425 USDT ($2,500 - 3% Fee)',
      platformProfit: '75 USDT（手续费）',
      platformProfitEn: '$75 USDT (Fee)',
      icon: <DollarSign className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-600',
    },
  ];

  const faqs = [
    {
      q: '如果币价在抽奖过程中剧烈波动怎么办？',
      qEn: 'What if the coin price fluctuates dramatically during the draw?',
      a: '我们使用 Chainlink Price Feeds 获取实时价格数据。锁定价格在抽奖开始时记录，结算价格在抽奖满额时记录。所有价格数据都来自去中心化预言机，完全透明且无法篡改。',
      aEn: 'We use Chainlink Price Feeds to get real-time price data. The locked price is recorded when the draw starts, and the settlement price is recorded when the draw is full. All price data comes from decentralized oracles, completely transparent and tamper-proof.',
    },
    {
      q: '平台如何在贬价时获利？',
      qEn: 'How does the platform profit when prices depreciate?',
      a: '我们采用对称结算制：币价下跌时，赢家获得真实币种（扣除 3% 手续费），平台获得手续费和贬价差价。例如 ETH 从 2500 跌到 2450，平台获得 75 USDT 手续费 + 50 USDT 贬价利润。',
      aEn: 'We use symmetric settlement: when prices fall, winners get real coins (minus 3% fee), and the platform gets the fee plus depreciation profit. For example, if ETH drops from $2,500 to $2,450, the platform gets $75 fee + $50 depreciation profit.',
    },
    {
      q: '为什么手续费从 5% 降到 3%？',
      qEn: 'Why was the fee reduced from 5% to 3%?',
      a: '新的对称结算制让平台可以从价差中获利，所以我们降低了手续费以提高用户竞争力。无论币价如何波动，平台都能通过手续费和价差获得稳定利润。',
      aEn: 'The new symmetric settlement allows the platform to profit from price differences, so we lowered fees to improve competitiveness. Regardless of price movements, the platform gets stable profits from fees and spreads.',
    },
    {
      q: '如何查看历史抽奖的价格数据？',
      qEn: 'How can I view historical draw price data?',
      a: '所有抽奖记录都存储在 Polygon 区块链上，用户可以通过区块链浏览器查询完整的交易历史、价格数据和结算信息。',
      aEn: 'All draw records are stored on the Polygon blockchain. Users can query complete transaction history, price data, and settlement information through blockchain explorers.',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 返回按钮 */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation('/')}
            className="flex items-center gap-2 hover:text-primary"
          >
            <ChevronLeft className="w-4 h-4" />
            {isZh ? '返回首页' : 'Back to Home'}
          </Button>
        </div>
      </div>

      {/* 页面内容 */}
      <div className="container py-16">
        {/* 标题部分 */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-500 to-cyan-500 bg-clip-text text-transparent">
            {isZh ? '价格结算机制详解' : 'Price Settlement Mechanism'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            {isZh
              ? '了解 1ucoin 如何通过动态锁定和溢价分享，为用户提供公平透明的价格结算方案。'
              : 'Learn how 1ucoin provides fair and transparent price settlement through dynamic locking and premium sharing.'}
          </p>
        </div>

        {/* 核心概念部分 */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8">{isZh ? '核心概念' : 'Core Concepts'}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: isZh ? '锁定价格' : 'Locked Price',
                desc: isZh
                  ? '抽奖开始时，从 Chainlink 记录的币种价格'
                  : 'The coin price recorded from Chainlink when the draw starts',
                icon: '🔒',
              },
              {
                title: isZh ? '结算价格' : 'Settlement Price',
                desc: isZh
                  ? '抽奖满额时，从 Chainlink 获取的当前币种价格'
                  : 'The current coin price obtained from Chainlink when the draw is full',
                icon: '📊',
              },
              {
                title: isZh ? '价差' : 'Price Difference',
                desc: isZh
                  ? '结算价格与锁定价格的差值，决定溢价或贬价'
                  : 'The difference between settlement and locked prices, determining premium or depreciation',
                icon: '📈',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent hover:border-primary/50 transition-colors"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 三个场景演示 */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8">{isZh ? '三个场景演示' : 'Three Scenarios'}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {scenarios.map((scenario, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-lg border border-primary/20 bg-card hover:border-primary/50 transition-all duration-300"
              >
                {/* 背景渐变 */}
                <div className={`absolute inset-0 bg-gradient-to-br ${scenario.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                <div className="relative p-6 space-y-4">
                  {/* 标题和图标 */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{isZh ? scenario.title : scenario.titleEn}</h3>
                      <p className="text-sm text-muted-foreground">
                        {isZh ? scenario.description : scenario.descriptionEn}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${scenario.color} text-white`}>
                      {scenario.icon}
                    </div>
                  </div>

                  {/* 价格信息 */}
                  <div className="space-y-2 pt-4 border-t border-border">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{isZh ? '锁定价格' : 'Locked Price'}:</span>
                      <span className="font-semibold">${scenario.lockPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{isZh ? '结算价格' : 'Settlement Price'}:</span>
                      <span className="font-semibold">${scenario.currentPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{isZh ? '价差' : 'Difference'}:</span>
                      <span className={`font-semibold ${scenario.priceChange > 0 ? 'text-green-500' : scenario.priceChange < 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
                        {scenario.priceChange > 0 ? '+' : ''}{scenario.priceChange}
                      </span>
                    </div>
                  </div>

                  {/* 收益信息 */}
                  <div className="space-y-3 pt-4 border-t border-border">
                    <div>
                      <p className="text-xs font-semibold text-primary mb-1">{isZh ? '赢家获得' : 'Winner Gets'}:</p>
                      <p className="text-sm font-mono bg-muted/50 p-2 rounded">
                        {isZh ? scenario.winnerReward : scenario.winnerRewardEn}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-primary mb-1">{isZh ? '平台收益' : 'Platform Profit'}:</p>
                      <p className="text-sm font-mono bg-muted/50 p-2 rounded">
                        {isZh ? scenario.platformProfit : scenario.platformProfitEn}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 计算公式 */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8">{isZh ? '详细计算公式' : 'Calculation Formula'}</h2>
          <div className="bg-card border border-primary/20 rounded-lg p-8 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">{isZh ? '基础参数' : 'Basic Parameters'}</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-mono bg-muted/50 px-2 py-1 rounded">P_lock</span>
                  <span className="ml-2 text-muted-foreground">
                    {isZh ? '= 抽奖开始时的币价' : '= Coin price at draw start'}
                  </span>
                </p>
                <p>
                  <span className="font-mono bg-muted/50 px-2 py-1 rounded">P_current</span>
                  <span className="ml-2 text-muted-foreground">
                    {isZh ? '= 抽奖满额时的币价' : '= Coin price at draw full'}
                  </span>
                </p>
                <p>
                  <span className="font-mono bg-muted/50 px-2 py-1 rounded">ΔP</span>
                  <span className="ml-2 text-muted-foreground">
                    {isZh ? '= P_current - P_lock （价差）' : '= P_current - P_lock (Price difference)'}
                  </span>
                </p>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="text-lg font-semibold mb-3">{isZh ? '赢家收益计算' : 'Winner Reward Calculation'}</h3>
              <div className="bg-muted/30 p-4 rounded font-mono text-sm space-y-2">
                <p>{isZh ? '如果 ΔP > 0 (币价上升)：' : 'If ΔP > 0 (Price Appreciation):'}</p>
                <p className="ml-4">
                  赢家收益 = P_lock × (1 - 3%) = P_lock × 0.97 (USDT)
                </p>
                <p className="mt-4">{isZh ? '如果 ΔP ≤ 0 (币价下跌)：' : 'If ΔP ≤ 0 (Price Depreciation):'}</p>
                <p className="ml-4">
                  赢家收益 = 1 个币种 × (1 - 3%) = 0.97 个币种
                </p>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="text-lg font-semibold mb-3">{isZh ? '平台收益计算' : 'Platform Profit Calculation'}</h3>
              <div className="bg-muted/30 p-4 rounded font-mono text-sm space-y-2">
                <p>{isZh ? '如果 ΔP > 0 (币价上升)：' : 'If ΔP > 0 (Price Appreciation):'}</p>
                <p className="ml-4">
                  平台收益 = 交易手续费 + ΔP（溢价利润）
                </p>
                <p className="mt-4">{isZh ? '如果 ΔP ≤ 0 (币价下跌)：' : 'If ΔP ≤ 0 (Price Depreciation):'}</p>
                <p className="ml-4">
                  平台收益 = 交易手续费 + |ΔP|（贬价利润）
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 平台风险管理 */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8">{isZh ? '平台风险管理' : 'Platform Risk Management'}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: isZh ? '手续费储备' : 'Fee Reserves',
                desc: isZh
                  ? '每笔交易 5% 的手续费进入风险储备金，用于覆盖贬价风险'
                  : '5% transaction fee goes to risk reserves to cover depreciation risks',
                icon: '💰',
              },
              {
                title: isZh ? 'ODC 交易费' : 'ODC Trading Fees',
                desc: isZh
                  ? 'ODC 交易产生的费用也进入储备金，增强风险承受能力'
                  : 'ODC trading fees also go to reserves, strengthening risk capacity',
                icon: '🪙',
              },
              {
                title: isZh ? 'VIP 服务费' : 'VIP Service Fees',
                desc: isZh
                  ? 'VIP 用户的额外费用为风险管理提供额外资金'
                  : 'Additional VIP fees provide extra funding for risk management',
                icon: '👑',
              },
              {
                title: isZh ? '链上透明' : 'On-Chain Transparency',
                desc: isZh
                  ? '所有资金流向都记录在区块链上，用户可随时审计'
                  : 'All fund flows are recorded on blockchain for user audits',
                icon: '🔍',
              },
            ].map((item, idx) => (
              <div key={idx} className="p-6 rounded-lg border border-border bg-muted/30 hover:border-primary/50 transition-colors">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 用户保护 */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8">{isZh ? '用户保护' : 'User Protection'}</h2>
          <div className="space-y-4">
            {[
              {
                title: isZh ? 'Chainlink VRF 公平性' : 'Chainlink VRF Fairness',
                desc: isZh
                  ? '使用可验证随机函数确保每次抽签完全公平，不可预测，不可篡改'
                  : 'Use verifiable random functions to ensure every draw is completely fair, unpredictable, and tamper-proof',
              },
              {
                title: isZh ? '链上可验证' : 'On-Chain Verification',
                desc: isZh
                  ? '所有交易、价格数据、抽签结果都记录在 Polygon 区块链上，用户可随时查询'
                  : 'All transactions, price data, and draw results are recorded on Polygon blockchain for user verification',
              },
              {
                title: isZh ? '实时价格透明' : 'Real-Time Price Transparency',
                desc: isZh
                  ? '锁定价格和结算价格都来自 Chainlink 预言机，完全透明无法篡改'
                  : 'Both locked and settlement prices come from Chainlink oracles, completely transparent and tamper-proof',
              },
              {
                title: isZh ? '智能合约审计' : 'Smart Contract Audit',
                desc: isZh
                  ? '所有智能合约都经过专业审计，确保代码安全和资金安全'
                  : 'All smart contracts are professionally audited to ensure code and fund security',
              },
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-lg border border-primary/20 bg-primary/5">
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 常见问题 */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8">{isZh ? '常见问题' : 'Frequently Asked Questions'}</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group p-6 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors cursor-pointer"
              >
                <summary className="flex items-center justify-between font-semibold select-none">
                  <span>{isZh ? faq.q : faq.qEn}</span>
                  <span className="transform group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-muted-foreground">{isZh ? faq.a : faq.aEn}</p>
              </details>
            ))}
          </div>
        </section>

        {/* 总结 */}
        <section className="mb-20">
          <div className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-cyan-500/10 border border-primary/20 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">{isZh ? '为什么选择 1ucoin？' : 'Why Choose 1ucoin?'}</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>
                  {isZh
                    ? '公平透明：所有价格数据来自 Chainlink，链上可验证'
                    : 'Fair & Transparent: All price data from Chainlink, on-chain verifiable'}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>
                  {isZh
                    ? '用户保护：币价下跌时平台承担风险，币价上升时用户获得溢价补偿'
                    : 'User Protection: Platform absorbs risk on depreciation, users get premium compensation on appreciation'}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>
                  {isZh
                    ? '低门槛参与：仅需 1 USDT 即可参与主流币种抽奖'
                    : 'Low Entry: Only $1 USDT to participate in mainstream coin draws'}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>
                  {isZh
                    ? '双重奖励：赢家获得真实币种，非赢家获得 ODC 代币'
                    : 'Dual Rewards: Winners get real coins, non-winners get ODC tokens'}
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* 返回按钮 */}
        <div className="flex justify-center">
          <Button size="lg" onClick={() => setLocation('/')} className="gap-2">
            <ChevronLeft className="w-4 h-4" />
            {isZh ? '返回首页' : 'Back to Home'}
          </Button>
        </div>
      </div>
    </div>
  );
}
