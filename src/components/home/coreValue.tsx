import { useTranslation } from 'react-i18next'

export function HomeCoreValue() {
  const { t } = useTranslation()

  // 获取核心价值数据
  const coreValues = t('home.coreValue.values', {
    returnObjects: true
  }) as {
    title: string;
    description?: string;
    description1?: string;
    description2?: string;
    tags?: string[];
  }[]

  return <div className="fccc pt-25.5 max-md:py-20 pb-24 bg-#161B22 move-content-1">
    <div className="relative text-10 max-md:text-7 leading-12.5 max-md:leading-10 font-600">
      {t('home.coreValue.title')}
      <div className="max-md:hidden absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-1 bg-[linear-gradient(90deg,#00E5FF_0%,#00FF85_100%)]"></div>
    </div>
    <div className="mt-20 max-md:mt-16 w-full grid cols-3 max-md:cols-1 gap-8 [&>div]:p-8 [&>div]:rounded-2 
    [&>div]:bg-#0D1117 [&>div]:b-1 [&>div]:border-#1F2937 max-md:[&>div]:b-#00E5FF4D
    max-md:[&>div]:bg-#0F172A">
      <div>
        <div className="size-16 rounded-2 bg-#00E6FF33 fcc text-primary">
          <div className="i-ci:arrows-reload-01 text-6"></div>
        </div>
        <div className="mt-6 text-2xl font-600">{coreValues[0].title}</div>
        <div className="mt-4 text-base text-#8B949E font-400">{coreValues[0].description}</div>
        <div className="mt-6 grid cols-3 max-xl:cols-2 max-md:cols-3 gap-2 [&>div]:px-2 
        [&>div]:py-1 [&>div]:rounded-9999px [&>div]:bg-#161B22 max-md:[&>div]:bg-#1E293B
        text-#8B949E max-md:text-#D1D5DB [&>div]:px-2 text-sm font-400 h-fit text-center">
          {coreValues[0].tags?.map((tag, index) => (
            <div key={index} className='fcc'>{tag}</div>
          ))}
        </div>
      </div>
      <div>
        <div className="size-16 rounded-2 bg-#00E6FF33 fcc text-primary">
          <div className="i-fa-solid:shield-alt text-6"></div>
        </div>
        <div className="mt-6 text-2xl font-600">{coreValues[1].title}</div>
        <div className="mt-4 text-base text-#8B949E font-400">{coreValues[1].description1}</div>
        <div className="mt-6 text-base text-#8B949E font-400">{coreValues[1].description2}</div>
      </div>
      <div>
        <div className="size-16 rounded-2 bg-#00E6FF33 fcc text-primary">
          <div className="i-fa-solid:coins text-6"></div>
        </div>
        <div className="mt-6 text-2xl font-600">{coreValues[2].title}</div>
        <div className="mt-4 text-base text-#8B949E font-400">{coreValues[2].description}</div>
        <div className="mt-6 text-base text-#8B949E font-400">{coreValues[2].description2}</div>
      </div>
    </div>
  </div>
}