import { Button } from "antd"
import { useTranslation } from 'react-i18next'

export function HomeContentEnd() {
  const { t } = useTranslation()

  return <div className="py-24 relative">
    <div className="relative z-2 fcc max-md:flex-col text-14 max-md:text-7 font-600 text-white text-center">
      <div>{t('home.contentEnd.title1')}</div>
      <div className="fcc">
        <div className="ml-4 bg-[linear-gradient(90deg,#00E5FF_0%,#00FF85_100%)] text-transparent bg-clip-text">{t('home.contentEnd.title2')}</div>
        <div>{t('home.contentEnd.title3')}</div>
      </div>
    </div>
    <div className="relative z-2 mt-6 text-xl font-400 text-#8B949E text-center">{t('home.contentEnd.description')}</div>
    <div className="relative z-2 fcc max-md:flex-col mt-12 [&>button]:text-lg [&>button]:font-600 gap-6">
      <Button className="h-15.5 max-md:w-full max-md:h-14 px-10 bg-primary b-primary text-black ">{t('home.contentEnd.button1')}</Button>
      <Button className="h-15.5 max-md:w-full max-md:h-14 px-10 bg-transparent b-primary text-primary ">{t('home.contentEnd.button2')}</Button>
    </div>
    <div className=" absolute bottom-0 left-1/2 transform-translate-x--1/2
      w-full h-114 rounded-full bg-#00FF892E blur-64 z-1 hidden max-md:block
    "></div>
  </div>
}