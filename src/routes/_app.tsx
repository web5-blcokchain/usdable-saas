import { loadRpcConfig } from '@/api/common'
import MainLayout from '@/components/layouts/main'
import { OtherLayout } from '@/components/layouts/other'
import { useRouteGuard } from '@/hooks/route-guard'
import { envConfig, updateEnvConfig } from '@/utils/envConfig'
import { createFileRoute, Outlet, useRouterState } from '@tanstack/react-router'
import ReactDOM from 'react-dom'
import { ToastContainer } from 'react-toastify'

export const Route = createFileRoute('/_app')({
  component: AppLayoutComponent
})

function AppLayoutComponent() {
  // 使用路由守卫
  useRouteGuard()
  const router = useRouterState()
  const pathKey = router.location.pathname // 每次路由变化时更新

  // 获取RPC节点
  useEffect(() => {
    loadRpcConfig().then((res) => {
      const { test_rpc, main_rpc } = res
      updateEnvConfig({
        rpcUrls: [envConfig.isProd ? main_rpc : test_rpc],
        web3: {
          ...envConfig.web3,
          rpc: envConfig.isProd ? main_rpc : test_rpc
        }
      })
    })
  }, [])

  return (
    <div className="app-content h-100vh overflow-y-scroll">
      <PortalToast />
      <div className="bg-background text-text">
        {pathKey !== '/' && (
          <MainLayout>
            <Outlet />
          </MainLayout>
        )}
        {pathKey === '/' && (
          <OtherLayout>
            <Outlet />
          </OtherLayout>
        )}
      </div>
    </div>
  )
}

const PortalToast: FC = () => {
  return ReactDOM.createPortal(
    <ToastContainer position="top-center" hideProgressBar />,
    document.body
  )
}
