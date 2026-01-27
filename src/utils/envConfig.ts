export const envConfig = {
  // API 配置
  apiUrl: import.meta.env.VITE_PUBLIC_API_URL,
  imageApiUrl: import.meta.env.VITE_PUBLIC_IMAGE_API_URL,

  // Privy 配置
  privyAppId: import.meta.env.VITE_PUBLIC_PRIVY_APP_ID,

  // Web3 配置
  web3: {
    rpc: import.meta.env.VITE_PUBLIC_WEB3_RPC_URL,
    chainId: import.meta.env.VITE_PUBLIC_WEB3_CHAIN_ID
  },

  // 链配置
  chainId: import.meta.env.VITE_PUBLIC_WEB3_CHAIN_ID,
  chainName: import.meta.env.VITE_APP_CHAIN_NAME,
  chainNameShort: import.meta.env.VITE_APP_CHAIN_NAME_SHORT,

  // 原生货币配置
  nativeCurrency: {
    name: import.meta.env.VITE_APP_CHAIN_COIN_NAME,
    symbol: import.meta.env.VITE_APP_CHAIN_COIN_SYMBOL,
    decimals: Number(import.meta.env.VITE_APP_CHAIN_COIN_DECIMALS) || 18
  },

  // RPC URLs
  rpcUrls: import.meta.env.VITE_PUBLIC_WEB3_RPC_URL,

  // 区块浏览器 URLs
  blockExplorerUrl: import.meta.env.VITE_PUBLIC_WEB_BLOCK_URL,

  // USDC 合约地址
  mockUsdcAddress: import.meta.env.VITE_PUBLIC_MOCK_USDC,
  usdcAddress: import.meta.env.VITE_PUBLIC_ARBITRUM_SEPOLIA_USDC,

  // 合约地址
  rentCustodyAddress: import.meta.env.VITE_PUBLIC_RENT_CUSTODY_CONTRACT,

  // 是否切换正式USDC地址
  checkOfficial: import.meta.env.VITE_PUBLIC_CHECK_OFFICIAL,
  isProd: import.meta.env.VITE_APP_IS_PROD === 'true' // 是否线上环境

}

export type EnvConfig = typeof envConfig

/**
 * 更新全局配置
 * @param updates 需要更新的配置项
 */
export function updateEnvConfig(updates: Partial<EnvConfig>) {
  Object.assign(envConfig, updates)
}

// 挂载到 window 对象以便在控制台调试
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  ;(window as any).envConfig = envConfig
  ;(window as any).updateEnvConfig = updateEnvConfig
}
