import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_app/lawyerWorkbench/initialReview/$id')({
  component: RouteComponent
})

function RouteComponent() {
  const { t } = useTranslation()
  const back = () => {
    window.history.back()
  }
  return (
    <div className="p-10">
      <div className="w-full">
        <div onClick={back} className="w-fit fcc gap-1 clickable">
          <div className="i-ic:round-arrow-back text-6 text-white"></div>
          <div>{t('register.asset.back')}</div>
        </div>
      </div>
      <div className="mt-10 flex justify-between gap-4 b-1 b-#3341554D rounded-3 b-solid bg-#161B22 px-6 py-16">
        <div>
          <div className="text-8 font-bold">上海花家地园区</div>
          <div className="mt-1 text-#94A3B8">上海市浦东新区张江高科技园区博云路2号</div>
        </div>
        <div className="fyc gap2 text-sm">
          <div className="i-bi:clock-fill bg-#68e2fb"></div>
          <div>提交时间: 2023-11-15 09:32</div>
        </div>
      </div>
      <div>
        <div className="i-mage:file-2-fill text-primary"></div>
        <div>文件审核区</div>
      </div>
    </div>
  )
}
