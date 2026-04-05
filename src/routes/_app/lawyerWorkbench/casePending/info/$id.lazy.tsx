import type { PROCESS_STEP } from '@/enums/lawyerWorkbench'
import type { TimelineItemProps } from 'antd/lib'
import {
  getPendingOfflineDetail,
  submitOfflineIssue,
  updateOfflineStep
} from '@/api/lawyerWorkbenchApi'
import { NoContent } from '@/components/common/NoContent'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  createLazyFileRoute,
  Link,
  useNavigate,
  useParams
} from '@tanstack/react-router'
import { Button, Card, Input, Spin, Timeline } from 'antd'
import dayjs from 'dayjs'

export const Route = createLazyFileRoute(
  '/_app/lawyerWorkbench/casePending/info/$id'
)({
  component: RouteComponent
})

function RouteComponent() {
  const { t } = useTranslation()
  const { id: caseId } = useParams({
    from: '/_app/lawyerWorkbench/casePending/info/$id'
  }) as { id: string }
  const navigate = useNavigate()

  useEffect(() => {
    if (!caseId) {
      navigate({ to: '/lawyerWorkbench' })
    }
  }, [caseId])

  const {
    data: pendingOfflineDetailData,
    isPending,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ['pendingOfflineDetail', caseId],
    queryFn: async () => {
      const res = await getPendingOfflineDetail({
        submission_id: Number(caseId)
      })
      return res.data
    },
    enabled: !!caseId
  })
  const stepData = useMemo(() => {
    return (
      Array.from({ length: 5 }, (_, i) => i).map((item) => {
        const data = pendingOfflineDetailData?.process_steps.find(
          step => step.type === item + 1
        )
        return {
          title: t(`lawyerWorkbench.offlineConfirmation.status.${item}`),
          endTime: data?.create_date
            ? dayjs((data?.create_date || 0) * 1000).format('YYYY-MM-DD HH:mm')
            : ''
        }
      }) || []
    )
  }, [pendingOfflineDetailData, t])

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

  // 修改案件处理步骤
  const {
    mutateAsync: updateOfflineStepMutate,
    isPending: updateOfflineStepLoading
  } = useMutation({
    mutationKey: ['updateOfflineStep'],
    mutationFn: (data: { status: PROCESS_STEP }) => {
      return updateOfflineStep({
        id: Number(pendingOfflineDetailData?.case_info?.id),
        status: data.status
      })
    },
    onSuccess() {
      toast.success(t('common.submitSuccess'))
      refetch()
    }
  })

  // 时间线
  const timeLine: TimelineItemProps[] = useMemo(() => {
    const maxStep = Math.max(
      ...(pendingOfflineDetailData?.process_steps?.map(
        item => item.type || -1
      ) || []),
      0
    )
    return stepData.map((item, index) => {
      return {
        dot: stepIcon(index, maxStep > index ? 0 : maxStep === index ? 1 : 2),
        children: (
          <div className="flex justify-between gap-2 b b-#30363D rounded-2 bg-#161B22 p-4">
            <div>
              <div
                className={cn(
                  'text-lg font-600',
                  maxStep >= index ? 'text-white' : 'text-#6B7280'
                )}
              >
                {item.title}
              </div>
              {maxStep > index && (
                <div className="mt-2 text-xs text-#00E5FF font-400">
                  {t('lawyerWorkbench.offlineConfirmation.completionTime')}
                  :
                  {' '}
                  {item.endTime || '-'}
                </div>
              )}
              {maxStep === index && (
                <div className="mt-1 text-xs text-#00FF85 font-400">
                  {t('lawyerWorkbench.offlineConfirmation.currentStep')}
                  : Step
                  {index + 1}
                  /
                  {stepData.length}
                </div>
              )}
            </div>
            {maxStep === index && (
              <Button
                loading={updateOfflineStepLoading}
                onClick={() => updateOfflineStepMutate({ status: index + 1 })}
                className="h-8 b-#00FF85 bg-#00FF85 px-4.5 text-base text-black font-600 hover:!b-#00FF85 hover:!bg-transparent hover:!text-#00FF85"
              >
                申请推进步骤
              </Button>
            )}
          </div>
        )
      } as TimelineItemProps
    })
  }, [stepData])

  // 手机号隐藏，展示前三位和后三位
  const hidePhone = (phone: string) => {
    if (!phone) {
      return '-'
    }
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
  }

  // 提交异常
  const [errorContent, setErrorContent] = useState('')
  const { mutateAsync: submitOfflineIssueData, isPending: isSubmitPending }
    = useMutation({
      mutationKey: ['submitOfflineIssue', caseId],
      mutationFn: async () => {
        return await submitOfflineIssue({
          id: Number(pendingOfflineDetailData?.case_info.id || 0),
          remark: errorContent
        })
      },
      onSuccess: (res) => {
        if (res?.code === 1) {
          toast.success(t('lawyerWorkbench.offlineExecution.submitSuccess'))
        }
      }
    })

  if (isPending) {
    return <Waiting for={!isPending} className="h-100 fccc" />
  }

  return (
    <Spin spinning={isFetching}>
      <div className="px-22 py-13 text-white">
        {/* 返回 */}
        <Link to="/lawyerWorkbench" className="w-fit fcc gap-1 clickable">
          <div className="i-ic:round-arrow-back text-6 text-white"></div>
          <span>{t('lawyerWorkbench.offlineConfirmation.backToList')}</span>
        </Link>

        {/* 标题 */}
        <h2 className="mb-1 mt-7 text-2xl font-600">
          {pendingOfflineDetailData?.case_info?.property_name || ''}
          {' '}
          ·
          {' '}
          {t('lawyerWorkbench.offlineConfirmation.executing')}
        </h2>
        <p className="text-base text-#8B949E font-400">
          {t('lawyerWorkbench.casePending.taskNumber')}
          ：
          {pendingOfflineDetailData?.case_info?.case_code || '-'}
        </p>

        {/* 案件信息 */}
        <Card className="mb-8 mt-8 border border-[#30363D] bg-[#0D1117] text-#E5E7EB">
          <div className="text-xl text-white font-600">
            {t('lawyerWorkbench.offlineConfirmation.caseInfo')}
          </div>
          <div className="grid grid-cols-3 mt-6 gap-4">
            <div>
              <div className="mb-1 text-#8B949E">
                {t('lawyerWorkbench.offlineConfirmation.propertyAddress')}
              </div>
              <div>
                {pendingOfflineDetailData?.case_info?.property_address || '-'}
              </div>
            </div>
            {/* <div>
            <div className="mb-1 text-#8B949E">产权证号</div>
            <div>{'-'}</div>
          </div> */}
            <div>
              <div className="mb-1 text-#8B949E">
                {t('lawyerWorkbench.offlineConfirmation.assetParty')}
              </div>
              <div>
                {pendingOfflineDetailData?.contacts?.asset_owner?.name || '-'}
              </div>
            </div>
          </div>
        </Card>

        {/* 线下执行流程 */}
        <Card className="mt-8 border border-[#30363D] bg-[#0D1117] text-#D1D5DB">
          <div className="mb-6 text-xl font-600">
            {t('lawyerWorkbench.offlineConfirmation.offlineExecutionProcess')}
          </div>
          <Timeline items={timeLine}></Timeline>
          {stepData.length === 0 && <NoContent />}
        </Card>

        {/* 异常/阻碍上报 */}
        <Card className="mb-6 mt-16 border border-[#30363D] bg-[#0D1117] text-gray-300">
          <div className="mb-3 flex items-center gap-2">
            <div className="i-mdi:alert text-xl text-red-400" />
            <span className="text-lg font-bold">
              {t('lawyerWorkbench.casePending.exceptionReport')}
            </span>
          </div>

          <p className="mb-3 text-gray-400">
            {t('lawyerWorkbench.casePending.exceptionReportDesc')}
          </p>

          <Input.TextArea
            rows={5}
            placeholder={t(
              'lawyerWorkbench.casePending.exceptionReportPlaceholder'
            )}
            value={errorContent}
            onChange={e => setErrorContent(e.currentTarget?.value)}
            className="border border-[#2a2d33] text-white !bg-#161B22"
            autoSize={{ minRows: 3, maxRows: 5 }}
          />

          <Button
            onClick={() => submitOfflineIssueData?.()}
            loading={isSubmitPending}
            className="mt-4 h-10 w-full rounded border-none bg-red-600 text-base text-white hover:bg-red-700"
          >
            {t('lawyerWorkbench.casePending.submitExceptionReport')}
          </Button>
        </Card>

        {/* 联系人信息 */}
        <Card className="border border-[#2a2d33] bg-[#111418] text-gray-300">
          <div className="mb-3 flex items-center gap-2">
            <div className="i-mdi:account-box text-xl text-[#00E4FF]" />
            <span className="text-lg font-bold">
              {t('lawyerWorkbench.casePending.contactPersonInfo')}
            </span>
          </div>

          <div>
            <div className="flex justify-between border-b border-[#2a2d33] py-4">
              <span>{t('lawyerWorkbench.offlineConfirmation.assetParty')}</span>
              <span>
                {pendingOfflineDetailData?.contacts?.asset_owner?.name || '-'}
                {' '}
                {hidePhone(
                  pendingOfflineDetailData?.contacts?.asset_owner?.phone || ''
                )}
              </span>
            </div>
            <div className="flex justify-between py-4">
              <span>{t('lawyerWorkbench.offlineExecution.lawyer')}</span>
              <span>
                {pendingOfflineDetailData?.contacts?.lawyer?.name || '-'}
                {' '}
                ``
                {' '}
                {hidePhone(
                  pendingOfflineDetailData?.contacts?.lawyer?.phone || ''
                )}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </Spin>
  )
}
