import { useTranslation } from 'react-i18next'

// 平台优势
export function HomePlatformAdvantages() {
  const { t } = useTranslation()

  const dataList = t('home.platformAdvantages.advantages', {
    returnObjects: true
  }) as {
    title: string;
    content: string;
    list: string[];
    icon: string;
  }[]

  // 图标类名
  const iconClasses = [
    "i-fa-solid:shield-alt",
    "i-fa6-solid:users",
    "i-fa6-solid:gears"
  ]

  // 添加图标到数据列表
  const dataListWithIcons = dataList.map((item, index) => ({
    ...item,
    icon: iconClasses[index]
  }))

  return <div className="fccc pt-25.5 max-md:py-20 pb-24 bg-#161B22 move-content-4">
    <div className="text-10 max-md:text-7 leading-12.5 max-md:leading-10 font-600">
      {t('home.platformAdvantages.title')}
    </div>
    <div className="relative text-base text-#8B949E font-400 max-md:hidden">
      {t('home.platformAdvantages.description')}
      <div className="max-md:hidden absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-1 bg-[linear-gradient(90deg,#00E5FF_0%,#00FF85_100%)]"></div>
    </div>
    <div className="mt-20 max-md:mt-16 grid cols-3 max-md:cols-1 gap-8">
      {
        dataListWithIcons.map((item, index) => (
          <div key={index} className="p-8 rounded-2 b-1 b-#1F2937 max-md:b-#00E5FF4D bg-#0D1117 max-md:bg-#0F172A ">
            <div className="size-16 rounded-2 bg-#00E6FF33 fcc text-primary">
              <div className={item.icon}></div>
            </div>
            <div className="mt-6 font-600 text-2xl text-white">{item.title}</div>
            <div className="mt-4 text-#8B949E text-base font-400">{item.content}</div>
            <div className="mt-6 fol gap-2.5">
              {
                item.list.map((listItem, listIndex) => (
                  <div key={listIndex} className="text-#8B949E text-sm font-400 fyc gap-2">
                    <div className="i-ep:success-filled bg-#75fb92"></div>
                    <div>{listItem}</div>
                  </div>
                ))
              }
            </div>
          </div>
        ))
      }
    </div>
  </div>
}