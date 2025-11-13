import BigNumber from 'bignumber.js'
import { envConfig } from '../envConfig'

export function toPlainString18(num: number | string, minDecimals: number = 18) {
  if (!Number(num))
    return '0'
  const bn = new BigNumber(num)

  // 获取原始小数位数
  const decimals = bn.decimalPlaces() || 0

  // 要保留的小数位数，不超过18位，且不少于原始小数位数
  const keepDecimals = Math.min(decimals, minDecimals)

  // toFixed(keepDecimals) 会自动四舍五入并返回字符串，不会用科学计数法
  return bn.toFixed(keepDecimals, BigNumber.ROUND_DOWN)
}

// 跳转到区块链浏览器查看交易hash
export function toBlockchainByHash(hash: string) {
  window.open(`${envConfig.blockExplorerUrl}/tx/${hash}`, '_blank')
}

export function toBlockchainByContact(address: string) {
  window.open(`${envConfig.blockExplorerUrl}/address/${address}`, '_blank')
}
