import { App, ConfigProvider, FloatButton } from 'antd'
import enUS from 'antd/locale/en_US'
import jaJP from 'antd/locale/ja_JP'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import MainFooter from './footer'
import MainHeader from './header'
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/en'
import 'dayjs/locale/ja'

// 定义一个语言映射字典，方便根据你系统里的 lang 状态切换
const localeMap: Record<string, any> = {
  zh: zhCN,
  en: enUS,
  ja: jaJP
}

const dayjsLocaleMap: Record<string, string> = {
  zh: 'zh-cn',
  en: 'en',
  ja: 'ja'
}
const MainLayout: FC = ({ children }) => {
  // const { pathname } = useLocation()
  // const isIndex = pathname === '/'
  // const router = useRouterState()
  // const pathKey = router.location.pathname // 每次路由变化时更新
  const { i18n } = useTranslation()
  useEffect(() => {
    dayjs.locale(dayjsLocaleMap[i18n.language] || 'zh-cn')
  }, [i18n.language])

  return (
    <div className="min-w-1024px bg-black">
      <MainHeader />
      <App>
        <div className="mx-a min-h-screen overflow-hidden text-white">
          <ConfigProvider locale={localeMap[i18n.language] || zhCN}>
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
