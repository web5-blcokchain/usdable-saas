import type { Chain } from 'viem/chains'
import { envConfig as Env } from '@/utils/envConfig'
import { PrivyProvider } from '@privy-io/react-auth'

// 定义本地Hardhat网络
export const goChain: Chain = {
  id: Number.parseInt(Env.web3.chainId),
  name: 'GoChain Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'GO',
    symbol: 'GO'
  },
  rpcUrls: {
    default: { http: [Env.web3.rpc] }
  }
}

export const AppPrivyProvider: FC = ({ children }) => {
  const { t } = useTranslation()
  return (
    <PrivyProvider
      appId={Env.privyAppId}
      config={{
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'all-users'
          }
        },
        loginMethods: ['email', 'google'],
        supportedChains: [goChain],
        defaultChain: goChain,
        appearance: {
          // loginMessage:'hello word'
          showWalletLoginFirst: false,
          landingHeader: t('privy.login_header')
        }
      }}

    >
      {children}
    </PrivyProvider>
  )
}
