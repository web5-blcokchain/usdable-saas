import MainFooter from './footer'
import MainHeader from './header'

const MainLayout: FC = ({
  children
}) => {
  // const { pathname } = useLocation()
  // const isIndex = pathname === '/'
  // const router = useRouterState()
  // const pathKey = router.location.pathname // 每次路由变化时更新

  return (
    <>
      <MainHeader />
      <div className="mx-a min-h-screen">
        {/* <AnimatePresence mode="wait">
          <motion.div
            key={pathKey}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          > */}
        {children}
        {/* </motion.div>
        </AnimatePresence> */}

      </div>
      <MainFooter />
    </>
  )
}

export default MainLayout
