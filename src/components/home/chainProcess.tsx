import { useTranslation } from 'react-i18next'

// RWA 上链标准流程
export function HomeChainProcess() {
  const { t } = useTranslation()

  const processSteps = t('home.chainProcess.steps', {
    returnObjects: true
  }) as { title: string; desc: string }[]

  return <div className="fccc pt-25.5 max-md:py-20 pb-24 overflow-hidden relative move-content-2">
    <div className="relative z-2 text-10 max-md:text-7 leading-12.5 max-md:leading-10 font-600 text-center">
      {t('home.chainProcess.title')}
    </div>
    <div className="relative z-2  mt-4 relative text-base text-#8B949E font-400 text-center ">
      <div className="max-md:hidden">{t('home.chainProcess.descriptionDesktop')}</div>
      <div className="hidden max-md:block">{t('home.chainProcess.descriptionMobile')}</div>
      <div className="max-md:hidden absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-1 bg-[linear-gradient(90deg,#00E5FF_0%,#00FF85_100%)]"></div>
    </div>
    <div className="relative z-2  scrollbar-hidden mt-20 max-md:mt-16 grid cols-6 gap-4 max-md:flex max-md:overflow-x-auto max-md:w-full max-md:snap-x max-md:snap-mandatory">
      {processSteps.map((step, index) => (
        <div key={index} className="w-full fccc snap-start max-md:min-w-full max-md:p-6
        max-md:b-1 max-md:b-#00E5FF4D rounded-3 max-md:bg-#0F172A
        [&>div:first-child]:hover:bg-primary [&>div]:transition-all-300
        [&>div:first-child]:hover:text-black [&>div:last-child>div:first-child]:hover:text-primary">
          <div className="size-16 rounded-full bg-#161B22 text-xl font-bold text-primary fcc
          max-md:!text-white max-md:bg-primary">{index + 1}</div>
          <div className="mt-4 px-6 py-4 text-center bg-#161B22 flex-1 rounded-2 max-md:w-full max-md:bg-transparent">
            <div className="text-white max-md:!text-white text-base font-600 transition-all-300">{step.title}</div>
            <div className="text-#8B949E text-sm font-400 mt-2 ">{step.desc}</div>
          </div>
        </div>
      ))}
    </div>
    <div className=" hidden max-md:block absolute bottom--25% left--20% size-80 rounded-full bg-#00FF893A blur-64 z-1">
    </div>
    <div className=" hidden max-md:block absolute top-25% right--25% size-80 rounded-full bg-#00E2FF3A blur-64 z-1">
    </div>
  </div>
}