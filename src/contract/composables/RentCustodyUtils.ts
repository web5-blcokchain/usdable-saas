import { envConfig } from '@/utils/envConfig'
import { ethers } from 'ethers'
import RentCustodyContractApi from '../abi/RentCustodyContract.json'
import { getContractErrorData } from '../utils/utils'
import { getUsdcContractInstance } from './UsdcUtils'

// 获取合约实例
/**
 * 获取合约实例
 * @param provider
 * @returns
 */
export function getRentCustodyContractInstance(provider: ethers.Signer) {
  const RentCustodyContract = RentCustodyContractApi
  return new ethers.Contract(
    envConfig.rentCustodyAddress,
    RentCustodyContract.abi,
    provider
  )
}

// 获取长链接合约实例
// const initLongContract = async () => {
//     const provider = new ethers.WebSocketProvider(goChain.rpcUrls.default.http?.[0])
//     const contract = new ethers.Contract(envConfig.rentCustodyAddress, RentCustodyContractApi.abi, provider)
//     return contract
// }

/**
 * 向代币合约存款
 * @param contract PropertyTokenFactory合约实例
 * @param data 存款所需数据
 * @returns 交易信息
 */
export async function userPayRent(
  signer: ethers.Signer,
  data: {
    depositId: number
    amount: number
    wallet_address: string
  }
) {
  try {
    const rentCustodycontract = await getRentCustodyContractInstance(signer)
    // 授权给合约
    const usdcContract = await getUsdcContractInstance(signer)
    // 获取代币精度
    const usdtDecimals = await usdcContract.decimals()
    // 获取授权代币地址
    const payAmount = ethers.parseUnits(data.amount.toString(), usdtDecimals)
    const approveTx = await usdcContract.approve(
      envConfig.rentCustodyAddress,
      payAmount
    )
    await approveTx.wait()
    // 直接调用合约方法
    const tx = await rentCustodycontract.depositForHouse(
      data.depositId,
      payAmount
    )
    tx.wait()
    return tx.hash
  }
  catch (e: any) {
    const errorData = getContractErrorData([RentCustodyContractApi], e)
    console.error(e)
    throw errorData
  }
}

// 监听缴费合约事件

export async function listenAndPayRent(
  signer: ethers.Signer,
  data: {
    depositId: number
    amount: number
    wallet_address: string
  }
) {
  const contract = await initLongContract()
  const filter = contract.filters.DepositCreated()
  return new Promise<{ hash: string, tx_id: number }>((resolve, reject) => {
    let txHash: string
    const listener = (...args: any[]) => {
      const eventPayload = args[args.length - 1]
      // 解析合约内容
      const [depositId, amount, depositor] = eventPayload.args
      console.log('DepositCreated:', depositId, amount, depositor)
      if (
        (depositor as string).toLowerCase()
        === data.wallet_address.toLowerCase()
      ) {
        // 接收到事件后，移除监听
        contract.off(filter, listener)
        resolve({
          hash: eventPayload.log.transactionHash || txHash,
          tx_id: Number(depositId.toString())
        })
      }
    }
    // 监听合约事件
    contract.on(filter, listener)

    userPayRent(signer, data)
      .then((hash) => {
        txHash = hash
      })
      .catch((e: any) => {
        contract.off(filter, listener)
        reject(e)
      })
  })
}
async function initLongContract() {
  const provider = new ethers.WebSocketProvider(envConfig.web3.rpc)
  const contract = new ethers.Contract(
    envConfig.rentCustodyAddress,
    RentCustodyContractApi.abi,
    provider
  )
  return contract
}
