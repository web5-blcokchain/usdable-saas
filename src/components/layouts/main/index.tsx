// import { useLocation } from '@tanstack/react-router'
import MainFooter from './footer'
import MainHeader from './header'

const MainLayout: FC = ({
  children
}) => {
  // const { pathname } = useLocation()
  // const isIndex = pathname === '/'

  return (
    <>
      {<MainHeader />}
      <div className="mx-a min-h-screen">
        {children}
      </div>
      {<MainFooter />}
    </>
  )
}

export default MainLayout
