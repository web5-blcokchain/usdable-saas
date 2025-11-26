import { Button } from "antd"
import { useTranslation } from 'react-i18next'

export function HomeContent() {
  const { t } = useTranslation()

  const [headerHeight, setHeaderHeight] = useState(0)
  useEffect(() => {
    const reloadContentWidth = () => {
      setHeaderHeight(document.getElementById('other-header')?.offsetHeight || 0)
    }
    window.addEventListener('resize', reloadContentWidth)
    reloadContentWidth()
    return () => window.removeEventListener('resize', reloadContentWidth)
  }, [])

  return (
    <div
      style={{ minHeight: `calc(100vh - ${headerHeight}px)` }}
      className="main-content fccc bg-transparent text-white px-4"
    >
      <div className="text-center text-20 font-600 leading-25 max-md:hidden">
        <div>{t('home.homeContent.titleDesktop1')}</div>
        <div className="text-primary">{t('home.homeContent.titleDesktop2')}</div>
      </div>
      <div className="text-center text-10 font-600 leading-12.5 hidden max-md:block 
      ">
        <div>{t('home.homeContent.titleMobile1')}</div>
        <div className="bg-[linear-gradient(90deg,#00E5FF_0%,#00FF85_100%)] bg-clip-text text-transparent">{t('home.homeContent.titleMobile2')}</div>
      </div>
      <div className="mt-8 max-md:mt-7 text-center text-7.5 max-md:text-base font-400">
        {t('home.homeContent.description1')} <br />
        {t('home.homeContent.description2')}
        <br />
        {t('home.homeContent.description3')}
      </div>
      <div className="mt-8 max-md:mt-12 fcc gap-4 max-md:grid max-md:cols-1 max-md:w-full max-md:[&>button]:!w-full">
        <Button className="h-12.5 min-w-38 b-primary bg-primary px-8 text-base text-black font-600">{t('home.homeContent.button1')}</Button>
        <Button className="h-12.5 min-w-38 b-primary bg-transparent px-8 text-base text-primary font-600">{t('home.homeContent.button2')}</Button>
      </div>
    </div>
  )
}