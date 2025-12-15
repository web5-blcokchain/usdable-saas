import { addHttpsPrefix } from '@/utils/url'
import { useTranslation } from 'react-i18next'

// 平台角色
export function HomePlatformRole() {
  const { t } = useTranslation()

  const dataList = t('home.platformRole.roles', {
    returnObjects: true
  }) as {
    title: string
    content: string[]
  }[]

  // 图标类名
  const iconClasses = [
    'i-fa6-solid:building',
    'i-fa6-solid:gavel',
    'i-heroicons:calculator-16-solid',
    'i-fa6-solid:file-signature',
    'i-flowbite:server-solid'
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
    <div className="fccc bg-#161B22 pb-24 pt-25.5 max-md:py-20">
      <div className="text-10 font-600 leading-12.5 max-md:text-7 max-md:leading-10">
        {t('home.platformRole.title')}
      </div>
      <div className="relative text-base text-#8B949E font-400">
        {t('home.platformRole.description')}
        <div className="absolute left-1/2 h-1 w-24 bg-[linear-gradient(90deg,#00E5FF_0%,#00FF85_100%)] -bottom-4 max-md:hidden -translate-x-1/2"></div>
      </div>
      <div className="grid grid-cols-5 mt-20 w-full gap-6 max-md:cols-1 max-md:mt-16">
        {dataListWithIconsAndImages.map((item, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2 bg-#1F242D transition-all-300 hover:translate-y--10px max-md:hover:translate-y--0"
          >
            <div className="hidden h-40 max-md:block">
              <img className="h-40 w-full object-cover" src={addHttpsPrefix(item.img)} alt="" />
            </div>
            <div className="h-full fol max-md:p-6">
              <div className="h-40 w-full fcc bg-#23505b text-10 text-primary max-md:size-12 max-md:rounded-full max-md:text-6">
                <div className={item.icon}></div>
              </div>
              <div className="flex-1 bg-#0e1116 p-6 pb-18 max-md:bg-transparent max-md:p-0">
                <div className="text-xl font-600 max-md:mt-4">{item.title}</div>
                <div className="mt-3 fol gap-1.5">
                  {
                    item.content.map((content, contentIndex) => (
                      <div key={contentIndex} className="fyc gap-1 max-md:hidden">
                        <div className="i-lucide:check text-sm text-#75fb92"></div>
                        <div className="text-sm text-#8B949E font-400">{content}</div>
                      </div>
                    ))
                  }
                  <div className="hidden text-base text-#9CA3AF font-400 max-md:block">{item.content.join('、')}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
