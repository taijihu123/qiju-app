// 环境区分（调试用）
export const isDev = process.env.NODE_ENV === 'development';

// 不同环境的接口地址
export const API_CONFIG = {
  dev: 'http://127.0.0.1:8888/api', // 使用127.0.0.1代替localhost，解决模拟器无法访问问题
  prod: 'https://api.qiju.example.com/api'
};

// 当前环境的接口地址
// 使用云服务器的API地址，与后端服务匹配
export const BASE_API = 'http://8.159.143.90';
// 优先使用环境变量中的API地址，否则使用默认配置
// export const BASE_API = process.env.VITE_API_BASE_URL || (isDev ? API_CONFIG.dev : API_CONFIG.prod);

// 区块链API配置
export const BLOCKCHAIN_API_BASE_URL = process.env.BLOCKCHAIN_API_BASE_URL || 'http://8.159.143.90:3000/api';

// 区块链节点配置
export const ETH_RPC_URL = process.env.VITE_ETH_RPC_URL || 'https://rpc.ankr.com/eth/d53b1a04a2bc05a78bdb69a2f8dca18e5f5425db6c41f6addde0e0824635f3b7';
export const SEPOLIA_RPC_URL = process.env.VITE_SEPOLIA_RPC_URL || 'https://rpc.ankr.com/eth_sepolia/d53b1a04a2bc05a78bdb69a2f8dca18e5f5425db6c41f6addde0e0824635f3b7';
