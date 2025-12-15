import { envConfig } from '@/utils/envConfig'
import { ethers } from 'ethers'
import MockUsdcAbi from '../abi/MockUSDC.json'
import UsdcAbi from '../abi/SimpleERC20.json'

// 获取合约实例
/**
 * 获取合约实例
 * @param provider
 * @returns
 */
export function getUsdcContractInstance(provider: ethers.Signer) {
  const isCheck = envConfig?.checkOfficial === 'true' || envConfig?.checkOfficial === true
  const usdcContract = isCheck ? UsdcAbi : MockUsdcAbi
  const contractAddress = isCheck ? envConfig.usdcAddress : envConfig.mockUsdcAddress
  return new ethers.Contract(contractAddress, usdcContract.abi, provider)
}
