/**
 * 1ucoin.fun — Web3 配置文件
 *
 * 将部署完成后更新以下地址：
 * - CONTRACT_ADDRESS: 你的 1ucoin_v3.sol 部署后的地址
 * - 各代币地址已在下方预填 Polygon 主网地址
 */

// ============================================
// 网络配置
// ============================================
export const POLYGON_CHAIN_ID = 137; // Polygon 主网
export const POLYGON_MUMBAI_CHAIN_ID = 80001; // Polygon Mumbai 测试网

/**
 * 切换至此网络（如果当前不在）
 */
export const POLYGON_MAINNET = {
  chainId: `0x${POLYGON_CHAIN_ID.toString(16)}`,
  chainName: "Polygon Mainnet",
  nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
  rpcUrls: ["https://polygon-rpc.com/"],
  blockExplorerUrls: ["https://polygonscan.com/"],
};

export const POLYGON_MUMBAI = {
  chainId: `0x${POLYGON_MUMBAI_CHAIN_ID.toString(16)}`,
  chainName: "Polygon Mumbai",
  nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
  rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
  blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
};

// ============================================
// 合约地址
// ============================================

// ⚠️ 部署后替换为你的实际合约地址
export const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";

// Polygon 上的主流代币地址
export const TOKENS: Record<string, { address: string; symbol: string; priceFeed: string }> = {
  BTC: {
    symbol: "WBTC",
    address: "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6",           // WBTC on Polygon
    priceFeed: "0xDE31F8bFBD8c84b5360CFACCa3539B938dd78AE6",         // BTC/USD
  },
  ETH: {
    symbol: "WETH",
    address: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",           // WETH on Polygon
    priceFeed: "0xF9680D99D6C9589e2a93a78A04A279e509205945",         // ETH/USD
  },
  BNB: {
    symbol: "BNB",
    address: "0x3BA4c387f786bFEE076A58914F5Bd38d668B42c3",           // BNB on Polygon
    priceFeed: "0x82a6c51CF3e43021AC56c175425bd31288e5e449",         // BNB/USD (approximate)
  },
  SOL: {
    symbol: "SOL",
    address: "0x7dff46370e9ea5f0bad3c4e29711ad50062ea7a4",           // SOL on Polygon
    priceFeed: "0x10C8264C0935b3B9870013e057f330Ff3e9C56dC",         // SOL/USD (approximate)
  },
  LTC: {
    symbol: "LTC",
    address: "0x8e0a809f1f413f1d259a62220d0b5bfb887066b4",           // LTC on Polygon (approximate)
    priceFeed: "0xEB3e9F3d1E9ECbE0b2a2b12713a9bb7Fd2a827C9",        // LTC/USD (approximate)
  },
};

// QuickSwap Router v2 (Polygon)
export const QUICKSWAP_ROUTER = "0xa5E0829Caced8fFDD4De3c43696ef9D3796786BA";

// USDT on Polygon
export const USDT_ADDRESS = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";

// ============================================
// 合约 ABI（从 1ucoin_v3.sol 生成）
// ⚠️ 完整部署后可用 Hardhat 导出完整 ABI
// ============================================
export const ONEUCOIN_ABI = [
  // 读函数
  "function drawActive() external view returns (bool)",
  "function drawCompleted() external view returns (bool)",
  "function drawRound() external view returns (uint256)",
  "function targetToken() external view returns (address)",
  "function targetSymbol() external view returns (string)",
  "function totalShares() external view returns (uint256)",
  "function sharesSold() external view returns (uint256)",
  "function lockedPrice() external view returns (uint256)",
  "function winner() external view returns (address)",
  "function userShares(address) external view returns (uint256)",
  "function getDrawStatus() external view returns (uint256,address,string,uint256,uint256,uint256,bool,bool,address)",
  "function getCurrentPrice() external view returns (uint256,uint256)",
  "function getEffectiveFeeFor(address) external view returns (uint256)",
  "function getParticipantCount() external view returns (uint256)",

  // 写函数
  "function purchaseShares(uint256 _shares) external",

  // 事件
  "event DrawStarted(uint256 indexed round, address indexed targetToken, string targetSymbol, uint256 totalShares, uint256 lockedPrice)",
  "event SharePurchased(uint256 indexed round, address indexed user, uint256 shares, uint256 costUsdt)",
  "event DrawFulfilled(uint256 indexed round, address indexed winner, uint256 randomNumber, uint256 lockedPrice, uint256 currentPrice, string settlementType)",
  "event PrizeDistributedUsdt(uint256 indexed round, address indexed winner, uint256 amount)",
  "event PrizeDistributedToken(uint256 indexed round, address indexed winner, address token, uint256 amount)",
  "event FeeCollected(uint256 indexed round, address feeToken, uint256 amount)",
  "event ODCGiven(address indexed user, uint256 amount)",
  "event WinnerSelected(uint256 indexed round, address indexed winner, uint256 randomNumber)",
];

// ERC20 ABI（最小化）
export const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  "function decimals() external view returns (uint8)",
  "function symbol() external view returns (string)",
];
