import { ConfigProvider } from 'antd'
import enUS from 'antd/locale/en_US'
import jaJP from 'antd/locale/ja_JP'
import zhCN from 'antd/locale/zh_CN'
import MainFooter from './footer'
import MainHeader from './header'

const MainLayout: FC = ({
  children
}) => {
  // const { pathname } = useLocation()
  // const isIndex = pathname === '/'
  // const router = useRouterState()
  // const pathKey = router.location.pathname // 每次路由变化时更新
  const { i18n } = useTranslation()

  return (
    <>
      <MainHeader />
      <div className="mx-a min-h-screen min-w-1024px">
        {/* <AnimatePresence mode="wait">
          <motion.div
            key={pathKey}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          > */}
        <ConfigProvider locale={
          i18n.language === 'zh' ? zhCN : i18n.language === 'en' ? enUS : jaJP
        }
        >
          {children}
        </ConfigProvider>
        {/* </motion.div>
        </AnimatePresence> */}

      </div>
      <MainFooter />
    </>
  )
}

export default MainLayout
