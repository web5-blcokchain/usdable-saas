import { App, ConfigProvider, FloatButton } from 'antd'
import enUS from 'antd/locale/en_US'
import jaJP from 'antd/locale/ja_JP'
import zhCN from 'antd/locale/zh_CN'
import MainFooter from './footer'
import MainHeader from './header'

const MainLayout: FC = ({ children }) => {
  // const { pathname } = useLocation()
  // const isIndex = pathname === '/'
  // const router = useRouterState()
  // const pathKey = router.location.pathname // 每次路由变化时更新
  const { i18n } = useTranslation()

  return (
    <div className="min-w-1024px bg-black">
      <MainHeader />
      <App>
        <div className="mx-a min-h-screen overflow-hidden text-white">
          <ConfigProvider
            locale={
              i18n.language === 'zh'
                ? zhCN
                : i18n.language === 'en'
                  ? enUS
                  : jaJP
            }
          >
            {/* <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={pathKey}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
              >
                 <Outlet />
              </motion.div>
            </AnimatePresence> */}
            {children}
          </ConfigProvider>
          <FloatButton.BackTop
            className="my-backtop"
            target={() => document.querySelector('.app-content') as HTMLElement}
          >
            <div className="backtop-btn size-12 fcc rounded-full bg-#737373">
              <div className="text-balck i-carbon:back-to-top text-xl"></div>
            </div>
          </FloatButton.BackTop>
        </div>
      </App>
      <MainFooter />
    </div>
  )
}

export default MainLayout
