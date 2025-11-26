import { Progress } from "antd"
import dayjs from "dayjs"
import { useTranslation } from 'react-i18next'

//资产上链透明度
export function HomeChainTransparency() {
  const { t } = useTranslation()

  const dataList = t('home.chainTransparency.features', {
    returnObjects: true
  }) as { title: string; content: string }[]

  // 为图标添加对应的className
  const iconClasses = [
    "i-garden:number-fill-16",
    "i-bi:clock-fill",
    "i-ph:arrows-left-right-bold"
  ]

  // 添加图标到数据列表
  const dataListWithIcons = dataList.map((item, index) => ({
    ...item,
    icon: <div className={iconClasses[index]}></div>
  }))

  return <div className="fccc pt-25.5 max-md:py-20 pb-24 bg-black move-content-3">
    <div className="text-10 max-md:text-7 leading-12.5 max-md:leading-10 font-600 text-center">
      {t('home.chainTransparency.title')}
    </div>
    <div className="relative text-base text-#8B949E font-400">
      {t('home.chainTransparency.description')}
      <div className="max-md:hidden absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-1 bg-[linear-gradient(90deg,#00E5FF_0%,#00FF85_100%)]"></div>
    </div>
    <div className="mt-20 max-md:mt-16 grid cols-3 max-md:cols-1 gap-8">
      {
        dataListWithIcons.map((item, index) => {
          return <div key={index} className="p-8 rounded-2 bg-#161B22 max-md:bg-#0F172A b-1 b-#1F2937  max-md:b-#00E5FF4D
      ">
            <div className="size-14 max-md:text-5 rounded-2 max-md:rounded-full bg-#00E6FF33 text-primary text-6 fcc">
              {item.icon}
            </div>
            <div className="mt-4">
              <div className="text-xl font-600 ">{item.title}</div>
              <div className="mt-4 text-base text-#8B949E font-400">{item.content}</div>
            </div>
          </div>
        })
      }
    </div>
    <div className="w-full p-6 mt-16 bg-#161B22 rounded-2 max-md:b-1 max-md:b-#00E5FF4D max-md:bg-#0F172A overflow-hidden ">
      <div className="fyc justify-between max-md:flex-col max-md:items-start w-full gap-4 max-md:gap-1">
        <div>
          <div className="text-2xl font-600">{t('home.chainTransparency.assetShowcase.title')}</div>
          <div className="mt-2.5 max-md:mt-0.5 text-base text-#8B949E font-400">{t('home.chainTransparency.assetShowcase.description')}</div>
        </div>
        <div className="px-2 py-1 rounded-9999px text-#00FF85 text-sm font-400 bg-#00FF8733 max-md:bg-#00E6FF33 max-md:text-primary">{t('home.chainTransparency.assetShowcase.status')}</div>
      </div>
      <div className="flex max-md:flex-col gap-8 max-md:gap-6 mt-8">
        <div className="flex-1 max-md:flex-auto">
          <div className="w-full h-64">
            <img className="size-full rounded-2 object-cover" src={(new URL('@/assets/images/home/chain-componey.png', import.meta.url).href)} alt="" />
          </div>

          <div className="mt-4 fyc justify-between gap-4 max-md:hidden">
            <div className="font-600 text-xl">{t('home.chainTransparency.assetShowcase.propertyInfo.name')}</div>
            <div className="text-sm text-primary font-400">{t('home.chainTransparency.assetShowcase.propertyInfo.id')}</div>
          </div>
          <div className="max-md:hidden mt-6 grid cols-2  gap-4
          [&>div>div:first-child]:text-#8B949E text-sm font-400
           [&>div>div:last-child]:text-white [&>div>div:last-child]:mt-1
          ">
            <div>
              <div>{t('home.chainTransparency.assetShowcase.propertyInfo.type')}</div>
              <div>{t('home.chainTransparency.assetShowcase.propertyInfo.typeValue')}</div>
            </div>
            <div>
              <div>{t('home.chainTransparency.assetShowcase.propertyInfo.valuation')}</div>
              <div>{t('home.chainTransparency.assetShowcase.propertyInfo.valuationValue')}</div>
            </div>
            <div>
              <div>{t('home.chainTransparency.assetShowcase.propertyInfo.area')}</div>
              <div>{t('home.chainTransparency.assetShowcase.propertyInfo.areaValue')}</div>
            </div>
            <div>
              <div>{t('home.chainTransparency.assetShowcase.propertyInfo.onChainDate')}</div>
              <div>{dayjs().format('YYYY-MM-DD')}</div>
            </div>
          </div>
        </div>
        <div className=" flex-1 fol gap-6 max-md:hidden">
          <div className="p-4 rounded-2 bg-#0D1117 text-#8B949E font-400">
            <div className="text-sm ">{t('home.chainTransparency.assetShowcase.onChainInfo.hashTitle')}</div>
            <div className="p-3 mt-3 rounded-2 text-xs bg-#161B22">{t('home.chainTransparency.assetShowcase.onChainInfo.hashValue')}</div>
          </div>
          <div className="p-4 rounded-2 bg-#0D1117 text-#8B949E font-400">
            <div>{t('home.chainTransparency.assetShowcase.onChainInfo.distributionTitle')}</div>
            <div className="fyc justify-between mt-3">
              <div className="text-sm text-white">{t('home.chainTransparency.assetShowcase.onChainInfo.expectedReturn')}</div>
              <div className="text-base text-#00FF85 font-bold">{t('home.chainTransparency.assetShowcase.onChainInfo.expectedReturnValue')}</div>
            </div>
            <Progress strokeColor={{
              '0%': '#00E5FF',
              '100%': '#00FF85',
            }} className="" percent={70} showInfo={false} />
            <div className="fyc justify-between mt-2 text-xs text-#8B949E">
              <div>{t('home.chainTransparency.assetShowcase.onChainInfo.distributedIncome')}</div>
              <div>{t('home.chainTransparency.assetShowcase.onChainInfo.distributedIncomeValue')}</div>
            </div>
          </div>
          <div className="p-4 rounded-2 bg-#0D1117 text-white font-400">
            <div className="text-#8B949E">{t('home.chainTransparency.assetShowcase.progress.title')}</div>
            <div className="fyc justify-between mt-3 text-xs font-400">
              <div >{t('home.chainTransparency.assetShowcase.progress.step1')}</div>
              <div>{dayjs().add(-3 * 3, 'day').format('YYYY-MM-DD')}</div>
            </div>
            <Progress strokeColor={'#00E5FF'} className="" percent={100} showInfo={false} />
            <div className="fyc justify-between mt-3 text-xs font-400">
              <div >{t('home.chainTransparency.assetShowcase.progress.step2')}</div>
              <div>{dayjs().add(-3 * 2, 'day').format('YYYY-MM-DD')}</div>
            </div>
            <Progress strokeColor={'#00E5FF'} className="" percent={100} showInfo={false} />
            <div className="fyc justify-between mt-3 text-xs font-400">
              <div >{t('home.chainTransparency.assetShowcase.progress.step3')}</div>
              <div>{dayjs().add(-3, 'day').format('YYYY-MM-DD')}</div>
            </div>
            <Progress strokeColor={'#00E5FF'} className="" percent={100} showInfo={false} />
            <div className="fyc justify-between mt-3 text-xs font-400">
              <div >{t('home.chainTransparency.assetShowcase.progress.step4')}</div>
              <div>{dayjs().format('YYYY-MM-DD')}</div>
            </div>
            <Progress strokeColor={'#00FF85'} className="" percent={70} showInfo={false} />
          </div>

        </div>
        <div className="hidden max-md:block">
          <div className="mt-4 text-#9CA3AF text-sm font-400">{t('home.chainTransparency.assetShowcase.mobileInfo.nameLabel')}</div>
          <div className="mt-1 text-base font-600">{t('home.chainTransparency.assetShowcase.mobileInfo.nameValue')}</div>
          <div className="mt-4 text-#9CA3AF text-sm font-400">{t('home.chainTransparency.assetShowcase.mobileInfo.valueLabel')}</div>
          <div className="mt-1 text-base font-600">{t('home.chainTransparency.assetShowcase.mobileInfo.valueValue')}</div>
          <div className="mt-4 text-#9CA3AF text-sm font-400">{t('home.chainTransparency.assetShowcase.mobileInfo.hashLabel')}</div>
          <div className="px3 py-2 bg-#1E293B text-sm font-400">{t('home.chainTransparency.assetShowcase.mobileInfo.hashValue')}</div>
          <div className="mt-4 text-#9CA3AF text-sm font-400">{t('home.chainTransparency.assetShowcase.mobileInfo.dateLabel')}</div>
          <div className="mt-1 text-base font-600">{t('home.chainTransparency.assetShowcase.mobileInfo.dateValue')}</div>
        </div>
        <div className=" cols-2 gap-4 hidden max-md:grid
        [&>div]:rounded-2 [&>div]:bg-#1E293B [&>div]:text-center [&>div]:p-4
        [&>div>div:first-child]:text-#9CA3AF [&>div>div:first-child]:text-sm font-400
         [&>div>div:last-child]:text-base [&>div>div:last-child]:font-bold [&>div>div:last-child]:mt-1
        ">
          <div>
            <div>{t('home.chainTransparency.assetShowcase.mobileInfo.tokenTotal')}</div>
            <div>{t('home.chainTransparency.assetShowcase.mobileInfo.tokenTotalValue')}</div>
          </div>
          <div>
            <div>{t('home.chainTransparency.assetShowcase.mobileInfo.currentPrice')}</div>
            <div>{t('home.chainTransparency.assetShowcase.mobileInfo.currentPriceValue')}</div>
          </div>
          <div>
            <div>{t('home.chainTransparency.assetShowcase.mobileInfo.annualReturn')}</div>
            <div>{t('home.chainTransparency.assetShowcase.mobileInfo.annualReturnValue')}</div>
          </div>
          <div>
            <div>{t('home.chainTransparency.assetShowcase.mobileInfo.holders')}</div>
            <div>{t('home.chainTransparency.assetShowcase.mobileInfo.holdersValue')}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
}