import { useTranslation } from 'react-i18next'

// 平台角色
export function HomePlatformRole() {
  const { t } = useTranslation()

  const dataList = t('home.platformRole.roles', {
    returnObjects: true
  }) as {
    title: string;
    content: string[];
  }[]

  // 图标类名
  const iconClasses = [
    "i-fa6-solid:building",
    "i-fa6-solid:gavel",
    "i-heroicons:calculator-16-solid",
    "i-fa6-solid:file-signature",
    "i-flowbite:server-solid"
  ]

  // 图片URL
  const imageUrls = [
    new URL(`@/assets/images/home/platformRole-1.png`, import.meta.url).href,
    new URL(`@/assets/images/home/platformRole-2.png`, import.meta.url).href,
    new URL(`@/assets/images/home/platformRole-3.png`, import.meta.url).href,
    new URL(`@/assets/images/home/platformRole-4.png`, import.meta.url).href,
    new URL(`@/assets/images/home/platformRole-5.png`, import.meta.url).href
  ]

  // 添加图标和图片到数据列表
  const dataListWithIconsAndImages = dataList.map((item, index) => ({
    ...item,
    icon: iconClasses[index],
    img: imageUrls[index]
  }))

  return (
    <div className="fccc pt-25.5 max-md:py-20 pb-24 bg-#161B22">
      <div className="text-10 max-md:text-7 leading-12.5 max-md:leading-10 font-600">
        {t('home.platformRole.title')}
      </div>
      <div className="relative text-base text-#8B949E font-400">
        {t('home.platformRole.description')}
        <div className="max-md:hidden absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-1 bg-[linear-gradient(90deg,#00E5FF_0%,#00FF85_100%)]"></div>
      </div>
      <div className="w-full grid grid-cols-5 max-md:cols-1 gap-6 mt-20 max-md:mt-16">
        {dataListWithIconsAndImages.map((item, index) => (
          <div key={index} className="bg-#1F242D rounded-2 overflow-hidden transition-all-300 hover:translate-y--10px
          max-md:hover:translate-y--0
          ">
            <div className="h-40 hidden max-md:block">
              <img className="h-40 w-full object-cover" src={item.img} alt="" />
            </div>
            <div className="max-md:p-6 fol h-full">
              <div className="fcc w-full h-40  bg-#23505b text-10 text-primary 
            max-md:size-12 max-md:rounded-full max-md:text-6 ">
                <div className={item.icon}></div>
              </div>
              <div className="flex-1 p-6 max-md:p-0 pb-18 bg-#0e1116 max-md:bg-transparent ">
                <div className="text-xl font-600 max-md:mt-4">{item.title}</div>
                <div className="fol gap-1.5 mt-3">
                  {
                    item.content.map((content, contentIndex) => (
                      <div key={contentIndex} className="fyc gap-1  max-md:hidden">
                        <div className="i-lucide:check text-#75fb92 text-sm"></div>
                        <div className="text-sm text-#8B949E font-400">{content}</div>
                      </div>
                    ))
                  }
                  <div className="max-md:block hidden text-base text-#9CA3AF font-400">{item.content.join('、')}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}