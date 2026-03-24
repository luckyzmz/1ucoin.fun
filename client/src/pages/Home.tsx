import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, Coins, Users, TrendingUp, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

/**
 * 1ucoin.fun 首页
 * 设计风格：赛博朋克 + Web3 游戏美学
 * 核心元素：霓虹紫色、深色背景、发光效果、几何图形
 */

export default function Home() {
  const { t } = useTranslation();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const coins = [
    { name: "BTC", symbol: "Bitcoin", color: "from-orange-500 to-orange-600" },
    { name: "ETH", symbol: "Ethereum", color: "from-blue-500 to-blue-600" },
    { name: "BNB", symbol: "Binance", color: "from-yellow-500 to-yellow-600" },
    { name: "SOL", symbol: "Solana", color: "from-purple-500 to-purple-600" },
    { name: "XMR", symbol: "Monero", color: "from-orange-600 to-red-600" },
    { name: "LTC", symbol: "Litecoin", color: "from-gray-400 to-gray-500" },
    { name: "BCH", symbol: "Bitcoin Cash", color: "from-green-500 to-green-600" },
    { name: "AAVE", symbol: "Aave", color: "from-blue-600 to-blue-700" },
  ];

  const features = [
    {
      icon: Zap,
      title: t("features.lowEntry.title"),
      description: t("features.lowEntry.desc"),
    },
    {
      icon: Shield,
      title: t("features.transparent.title"),
      description: t("features.transparent.desc"),
    },
    {
      icon: TrendingUp,
      title: t("features.lowFees.title"),
      description: t("features.lowFees.desc"),
    },
    {
      icon: Coins,
      title: t("features.rewards.title"),
      description: t("features.rewards.desc"),
    },
  ];

  const stats = [
    { label: t("hero.stats.coins"), value: "8+" },
    { label: t("hero.stats.entry"), value: "1 USDT" },
    { label: t("hero.stats.gas"), value: "< 0.01 USDT" },
    { label: t("hero.stats.users"), value: "100万+" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* 导航栏 */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-purple-500/20">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl neon-glow">1UCOIN</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="hover:text-purple-400 transition">
              {t("nav.features")}
            </a>
            <a href="#coins" className="hover:text-purple-400 transition">
              {t("nav.coins")}
            </a>
            <a href="#roadmap" className="hover:text-purple-400 transition">
              {t("nav.roadmap")}
            </a>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Button className="cyber-button hidden sm:flex">
              {t("nav.enterGame")}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </nav>

      {/* 英雄区 */}
      <section
        className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden"
        style={{
          backgroundImage: `url('https://d2xsxph8kpxj0f.cloudfront.net/89394975/Y6tjXu4d9qFSwmg69sWuLL/hero-bg-W56Dg9ZtNoFUT4FmLaLYN9.webp')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      >
        {/* 深色遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />

        {/* 网格背景 */}
        <div className="absolute inset-0 grid-bg opacity-20" />

        {/* 内容 */}
        <div className="relative container mx-auto px-4 z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* 左侧文本 */}
            <div className="animate-slideInLeft">
              <div className="inline-block mb-6 px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-full">
                <span className="text-purple-300 text-sm font-semibold">
                  {t("hero.badge")}
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
                <span className="neon-glow">{t("hero.title1")}</span>
                <br />
                {t("hero.title2")}
              </h1>

              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                {t("hero.description")}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="cyber-button text-lg h-12">
                  {t("hero.startButton")}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 text-lg h-12"
                >
                  {t("hero.whitepaper")}
                </Button>
              </div>

              {/* 统计数据 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
                {stats.map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-2xl font-bold text-purple-400 mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 右侧图像 */}
            <div className="animate-slideInUp hidden md:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 blur-3xl rounded-full" />
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/89394975/Y6tjXu4d9qFSwmg69sWuLL/coin-showcase-ckbe9TPKfbaw9KyFXPnh2t.webp"
                  alt="Cryptocurrency Showcase"
                  className="relative w-full rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 向下箭头 */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-purple-400" />
        </div>
      </section>

      {/* 功能特性区 */}
      <section id="features" className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              {t("features.title")} <span className="neon-glow">1ucoin</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {t("features.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="cyber-card group"
                  style={{
                    animation: `slideInUp 0.6s ease-out ${idx * 0.1}s both`,
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                      <p className="text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 币种展示区 */}
      <section id="coins" className="relative py-20 md:py-32 bg-slate-900/50 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              {t("coins.title")} <span className="neon-glow-cyan">{t("coins.subtitle")}</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {t("coins.description")}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {coins.map((coin, idx) => (
              <div
                key={idx}
                className="cyber-card-coin group cursor-pointer"
                style={{
                  animation: `slideInUp 0.6s ease-out ${idx * 0.08}s both`,
                }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${coin.color} mb-4 flex items-center justify-center font-bold text-2xl text-white shadow-lg group-hover:shadow-2xl transition-all`}>
                    {coin.name[0]}
                  </div>
                  <h3 className="font-bold text-lg mb-1">{coin.name}</h3>
                  <p className="text-sm text-gray-400">{coin.symbol}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 工作流程区 */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              {t("howItWorks.title")} <span className="neon-glow">{t("howItWorks.subtitle")}</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "1", titleKey: "howItWorks.step1.title", descKey: "howItWorks.step1.desc" },
              { step: "2", titleKey: "howItWorks.step2.title", descKey: "howItWorks.step2.desc" },
              { step: "3", titleKey: "howItWorks.step3.title", descKey: "howItWorks.step3.desc" },
              { step: "4", titleKey: "howItWorks.step4.title", descKey: "howItWorks.step4.desc" },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="cyber-card text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <span className="font-bold text-xl text-white">{item.step}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{t(item.titleKey)}</h3>
                  <p className="text-sm text-gray-400">{t(item.descKey)}</p>
                </div>
                {idx < 3 && (
                  <div className="hidden md:flex absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-purple-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ODC 代币区 */}
      <section className="relative py-20 md:py-32 bg-slate-900/50 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                <span className="neon-glow">{t("odc.title")}</span>
                <br />
                {t("odc.subtitle")}
              </h2>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                {t("odc.description")}
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <span>{t("odc.feature1")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <span>{t("odc.feature2")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <span>{t("odc.feature3")}</span>
                </div>
              </div>

              <Button className="cyber-button mt-8">
                {t("odc.learnMore")}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="relative hidden md:block">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 blur-3xl rounded-full" />
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/89394975/Y6tjXu4d9qFSwmg69sWuLL/gaming-interface-Jx6uxNaNJsoFVRKKyqG2JS.webp"
                alt="ODC Token"
                className="relative w-full rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 路线图区 */}
      <section id="roadmap" className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              {t("roadmap.title")} <span className="neon-glow">{t("roadmap.subtitle")}</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              { quarter: t("roadmap.q3.quarter"), items: t("roadmap.q3.items", { returnObjects: true }) as string[] },
              { quarter: t("roadmap.q4.quarter"), items: t("roadmap.q4.items", { returnObjects: true }) as string[] },
              { quarter: t("roadmap.q1.quarter"), items: t("roadmap.q1.items", { returnObjects: true }) as string[] },
              { quarter: t("roadmap.q2.quarter"), items: t("roadmap.q2.items", { returnObjects: true }) as string[] },
            ].map((item, idx) => (
              <div key={idx} className="cyber-card">
                <h3 className="text-2xl font-bold mb-4 text-purple-400">
                  {item.quarter}
                </h3>
                <ul className="space-y-2">
                  {item.items.map((subitem: string, sidx: number) => (
                    <li key={sidx} className="flex items-center gap-2 text-gray-300">
                      <span className="w-2 h-2 bg-cyan-400 rounded-full" />
                      {subitem}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 区 */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10" />
        <div className="absolute inset-0 grid-bg opacity-5" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            {t("cta.title")}
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            {t("cta.description")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="cyber-button text-lg h-12 px-8">
              {t("cta.startButton")}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 text-lg h-12 px-8"
            >
              {t("cta.joinCommunity")}
            </Button>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="relative border-t border-purple-500/20 bg-slate-900/50 py-12 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Coins className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold neon-glow">1UCOIN</span>
              </div>
              <p className="text-sm text-gray-400">
                {t("footer.description")}
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">{t("footer.product")}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-purple-400 transition">{t("footer.platform")}</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">{t("footer.token")}</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">{t("footer.whitepaper")}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">{t("footer.community")}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-purple-400 transition">{t("footer.discord")}</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">{t("footer.twitter")}</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">{t("footer.telegram")}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">{t("footer.legal")}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-purple-400 transition">{t("footer.privacy")}</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">{t("footer.terms")}</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">{t("footer.disclaimer")}</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-purple-500/20 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-gray-400">
              {t("footer.copyright")}
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-purple-400 transition">
                {t("footer.github")}
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition">
                {t("footer.polygon")}
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition">
                {t("footer.quickswap")}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
