/**
 * 1ucoin.fun Web3 配置 — Polygon Amoy 测试网
 *
 * 部署后更新 CONTRACT_ADDRESS 等实际地址
 */

// ══════════════════════════════════════════════════
//  网络配置
// ══════════════════════════════════════════════════

export const AMOY_CHAIN_ID = 80002;
export const AMOY_CHAIN_ID_HEX = "0x13882";

export const AMOY_NETWORK = {
  chainId: AMOY_CHAIN_ID_HEX,
  chainName: "Polygon Amoy Testnet",
  nativeCurrency: {
    name: "MATIC",
    symbol: "MATIC",
    decimals: 18,
  },
  rpcUrls: ["https://rpc-amoy.polygon.technology"],
  blockExplorerUrls: ["https://amoy.polygonscan.com"],
};

// ══════════════════════════════════════════════════
//  合约地址（部署后更新）
// ══════════════════════════════════════════════════

/** OneUCoin v3 主合约 */
export const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";

/** 测试用 USDT（6 decimals） */
export const MOCK_USDT = "0x0000000000000000000000000000000000000000";

/** 测试用 ODC 治理代币（18 decimals） */
export const MOCK_ODC = "0x0000000000000000000000000000000000000000";

// ══════════════════════════════════════════════════
//  基础设施地址（Amoy 测试网，不需要改）
// ══════════════════════════════════════════════════

export const QUICKSWAP_ROUTER = "0xa5E0829Caced8fFDD4De3c43696ef9D3796786BA";

export const PRICE_FEEDS = {
  BTC: "0x007A22900a3B98143368Bd5906f8E17e9867581b",
  ETH: "0x0715A7794a1dc8e42615F059dD6e406A6594651A",
};

export const VRF_COORDINATOR = "0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed";

// ══════════════════════════════════════════════════
//  代币列表（用于前端展示）
// ══════════════════════════════════════════════════

export interface TokenConfig {
  symbol: string;
  name: string;
  priceFeed: string;
  decimals: number;
  color: string;
  /** 测试网没有真实代币，用 MockERC20 模拟 */
  mockAddress?: string;
}

export const SUPPORTED_TOKENS: TokenConfig[] = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    priceFeed: PRICE_FEEDS.BTC,
    decimals: 8,
    color: "from-orange-500 to-orange-600",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    priceFeed: PRICE_FEEDS.ETH,
    decimals: 18,
    color: "from-blue-500 to-blue-600",
  },
];

// ══════════════════════════════════════════════════
//  合约 ABI（精简版，仅包含前端需要的函数）
// ══════════════════════════════════════════════════

export const ONEUCOIN_ABI = [
  // ── 状态查询 ──
  "function getDrawStatus() external view returns (address _targetToken, string _targetSymbol, uint256 _totalShares, uint256 _sharesSold, bool _drawActive, address _winner)",
  "function totalShares() external view returns (uint256)",
  "function sharesSold() external view returns (uint256)",
  "function drawActive() external view returns (bool)",
  "function winner() external view returns (address)",
  "function targetToken() external view returns (address)",
  "function targetSymbol() external view returns (string)",
  "function randomResult() external view returns (uint256)",
  "function userShares(address) external view returns (uint256)",
  "function usdt() external view returns (address)",
  "function odc() external view returns (address)",
  "function SHARE_PRICE() external view returns (uint256)",
  "function FEE_PERCENTAGE() external view returns (uint256)",
  // ── 写操作 ──
  "function purchaseShares(uint256 _shares) external",
  "function startDraw(address _targetToken, string memory _targetSymbol, address _priceFeed) external",
  "function emergencyStop() external",
  // ── 事件 ──
  "event DrawStarted(address targetToken, string targetSymbol, uint256 totalShares)",
  "event SharePurchased(address user, uint256 shares)",
  "event DrawEnded(address winner, uint256 amount)",
  "event ODCdistributed(address user, uint256 odcAmount)",
  "event Swapped(address token, uint256 usdtAmount, uint256 tokenAmount)",
];

export const ERC20_ABI = [
  "function decimals() external view returns (uint8)",
  "function symbol() external view returns (string)",
  "function balanceOf(address) external view returns (uint256)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function mint(address to, uint256 amount) external",
];
