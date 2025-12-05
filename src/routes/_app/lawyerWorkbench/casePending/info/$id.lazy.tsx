import type { TimelineItemProps } from 'antd/lib'
import { createLazyFileRoute, Link } from '@tanstack/react-router'
import { Button, Card, Input, Timeline } from 'antd'

export const Route = createLazyFileRoute(
  '/_app/lawyerWorkbench/casePending/info/$id'
)({
  component: RouteComponent
})

function RouteComponent() {
  const { t } = useTranslation()

  const stepData = [
    {
      title: t('lawyerWorkbench.offlineConfirmation.materialPreparation'),
      content: t(
        'lawyerWorkbench.offlineConfirmation.materialPreparationContent'
      ),
      endTime: '2025-10-28 15:30'
    },
    {
      title: t('lawyerWorkbench.offlineConfirmation.windowSubmission'),
      content: t('lawyerWorkbench.offlineConfirmation.windowSubmissionContent'),
      endTime: ''
    },
    {
      title: t('lawyerWorkbench.offlineConfirmation.informationVerification'),
      content: t(
        'lawyerWorkbench.offlineConfirmation.informationVerificationContent'
      ),
      endTime: ''
    },
    {
      title: t('lawyerWorkbench.offlineConfirmation.sealConfirmation'),
      content: t('lawyerWorkbench.offlineConfirmation.sealConfirmationContent'),
      endTime: ''
    },
    {
      title: t('lawyerWorkbench.offlineConfirmation.completion'),
      content: t('lawyerWorkbench.offlineConfirmation.completionContent'),
      endTime: ''
    }
  ]

  const stepIcon = (step: number, status: number) => {
    switch (status) {
      case 0:
        return (
          <div className="size-8 rounded-full bg-#00E5FF">
            <div className="i-uil:check size-8 bg-white"></div>
          </div>
        )
      case 1:
        return (
          <div className="size-8 fcc rounded-full bg-#00FF85">
            <div className="i-icon-park-outline:loading-one size-5 bg-white"></div>
          </div>
        )
      default:
        return (
          <div className="size-8 fcc b-1 b-#4B5563 rounded-full bg-#161B22 text-xs text-#E5E7EB font-400">
            {step + 1}
          </div>
        )
    }
  }

  const timeLine: TimelineItemProps[] = useMemo(() => {
    return stepData.map((item, index) => {
      return {
        dot: stepIcon(
          index,
          item.endTime ? 0 : index > 0 && !!stepData[index - 1].endTime ? 1 : 2
        ),
        children: (
          <div className="b b-#30363D rounded-2 bg-#161B22 p-4">
            <div
              className={cn(
                'text-lg font-600',
                item.endTime || (index > 0 && !!stepData[index - 1].endTime)
                  ? 'text-white'
                  : 'text-#6B7280'
              )}
            >
              {item.title}
            </div>
            <div
              className={cn(
                'text-sm mt-2',
                item.endTime || (index > 0 && !!stepData[index - 1].endTime)
                  ? 'text-#9CA3AF'
                  : 'text-#6B7280'
              )}
            >
              {item.content}
            </div>
            {item.endTime && (
              <div className="mt-2 text-xs text-#00E5FF font-400">
                {t('lawyerWorkbench.offlineConfirmation.completionTime')}
                :
                {' '}
                {item.endTime}
              </div>
            )}
            {index > 0 && !!stepData[index - 1].endTime && (
              <div className="mt-1 text-xs text-#00FF85 font-400">
                {t('lawyerWorkbench.offlineConfirmation.currentStep')}
                : Step
                {index + 1}
                /
                {stepData.length}
              </div>
            )}
          </div>
        )
      } as TimelineItemProps
    })
  }, [stepData])

  return (
    <div className="px-22 py-13 text-white">
      {/* 返回 */}
      <Link
        to="/lawyerWorkbench/casePending"
        className="w-fit fcc gap-1 clickable"
      >
        <div className="i-ic:round-arrow-back text-6 text-white"></div>
        <span>返回案件列表</span>
      </Link>

      {/* 标题 */}
      <h2 className="mb-1 mt-7 text-2xl font-600">
        上海花园苑二区 · 线下执行中
      </h2>
      <p className="text-base text-#8B949E font-400">任务号：2025-XXX-001</p>

      {/* 案件信息 */}
      <Card className="mb-8 mt-8 border border-[#30363D] bg-[#0D1117] text-#E5E7EB">
        <div className="text-xl text-white font-600">案件信息</div>
        <div className="grid grid-cols-3 mt-6 gap-4">
          <div>
            <div className="mb-1 text-#8B949E">房产地址</div>
            <div>上海 · 花园苑二区 3—1—402</div>
          </div>
          <div>
            <div className="mb-1 text-#8B949E">产权证号</div>
            <div>沪房权证 2024-123456</div>
          </div>
          <div>
            <div className="mb-1 text-#8B949E">资产方</div>
            <div>张三</div>
          </div>
        </div>
      </Card>

      {/* 线下执行流程 */}
      <Card className="mt-8 border border-[#30363D] bg-[#0D1117] text-#D1D5DB">
        <div className="mb-6 text-xl font-600">线下执行流程</div>
        <Timeline items={timeLine}></Timeline>
      </Card>

      {/* 异常/阻碍上报 */}
      <Card className="mb-6 mt-16 border border-[#30363D] bg-[#0D1117] text-gray-300">
        <div className="mb-3 flex items-center gap-2">
          <div className="i-mdi:alert text-xl text-red-400" />
          <span className="text-lg font-bold">异常/阻碍上报</span>
        </div>

        <p className="mb-3 text-gray-400">
          说明：如窗口拒绝受理等材料相关情况，可在此上报异常情况
        </p>

        <Input.TextArea
          rows={5}
          placeholder="请输入异常情况..."
          className="border border-[#2a2d33] text-white !bg-#161B22"
          autoSize={{ minRows: 3, maxRows: 5 }}
        />

        <Button className="mt-4 h-10 w-full rounded border-none bg-red-600 text-base text-white hover:bg-red-700">
          提交异常报告
        </Button>
      </Card>

      {/* 联系人信息 */}
      <Card className="border border-[#2a2d33] bg-[#111418] text-gray-300">
        <div className="mb-3 flex items-center gap-2">
          <div className="i-mdi:account-box text-xl text-[#00E4FF]" />
          <span className="text-lg font-bold">联系人信息</span>
        </div>

        <div>
          <div className="flex justify-between border-b border-[#2a2d33] py-4">
            <span>资产方</span>
            <span>张三 139xxxx898</span>
          </div>
          <div className="flex justify-between py-4">
            <span>律师</span>
            <span>王工 137xxxx2233</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
