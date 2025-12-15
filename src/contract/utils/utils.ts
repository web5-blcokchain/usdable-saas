import type { EIP1193Provider } from '@privy-io/react-auth'
import { ContractError } from '@/enums/contract'
import { ethers } from 'ethers'

export async function getNameToContract(e: EIP1193Provider, address: string, abiFile: any) {
  const ethProvider = e || window.ethereum
  const provider = new ethers.BrowserProvider(ethProvider)
  const signer = await provider.getSigner()
  const propertyContract = new ethers.Contract(
    address,
    abiFile,
    signer
  )
  return propertyContract
}

export interface ContractErrorData {
  /**
   * 异常信息
   */
  errorMsg: string
  /**
   * 错误码
   */
  errorCode: ContractError
}

/**
 * 获取错误信息
 * @param contract 涉及合约列表
 * @param e 异常信息
 * @returns 返回合约错误信息
 */
export function getContractErrorData(contract: any[], e: ethers.CallExceptionError): ContractErrorData {
  let errorMsg = ''
  const defaultError = {
    errorMsg: 'payment.errors.transaction_failed',
    errorCode: ContractError.Error_Fail
  }
  try {
    contract.find((abi) => {
      const iface = new ethers.Interface(abi)
      const errorData = iface.parseError(e.data || '')
      errorMsg = errorData?.name || ''
      return !!errorMsg
    })
    if (errorMsg) {
      return {
        errorMsg,
        errorCode: ContractError.Error_User_Custom
      }
    }
    else {
      return defaultError
    }
  }
  catch {
    const errorContent = (e.message || '').toLowerCase()

    if (!errorContent) { // 交易执行失败
      return defaultError
    }
    if (errorContent.includes('rejected')) { // 用户取消操作
      return {
        errorMsg: 'payment.errors.rejected',
        errorCode: ContractError.Error_Cancle
      }
    }
    else if (errorContent.includes('insufficient funds')) { // 余额不足
      return {
        errorMsg: 'payment.errors.insufficient_eth',
        errorCode: ContractError.Error_Insufficient_Balance
      }
    }
    else {
      return defaultError
    }
  }
}
