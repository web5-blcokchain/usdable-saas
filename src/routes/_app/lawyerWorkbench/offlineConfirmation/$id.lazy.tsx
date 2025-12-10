import type { TimelineItemProps } from 'antd/lib'
import { getPendingOfflineDetail } from '@/api/lawyerWorkbenchApi'
import { NoContent } from '@/components/common/NoContent'
import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute, Link, useParams } from '@tanstack/react-router'
import { Timeline } from 'antd'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

export const Route = createLazyFileRoute(
  '/_app/lawyerWorkbench/offlineConfirmation/$id'
)({
  component: RouteComponent
})

function RouteComponent() {
  const { t } = useTranslation()
  const { id: caseId } = useParams({
    from: '/_app/lawyerWorkbench/offlineConfirmation/$id'
  }) as { id: string }

  const { data: pendingOfflineDetailData, isPending } = useQuery({
    queryKey: ['pendingOfflineDetail', caseId],
    queryFn: async () => {
      const res = await getPendingOfflineDetail({
        submission_id: Number(caseId)
      })
      return res.data
    },
    enabled: !!caseId
  })

  const asseteData = useMemo(() => {
    return [
      {
        title: t('lawyerWorkbench.offlineConfirmation.propertyAddress'),
        value: pendingOfflineDetailData?.case_info?.property_address || '-'
      },
      // {
      //   title: t(
      //     'lawyerWorkbench.offlineConfirmation.propertyCertificateNumber'
      //   ),
      //   value: '沪房权证 2024-123456',
      // },
      {
        title: t('lawyerWorkbench.offlineConfirmation.assetParty'),
        value: pendingOfflineDetailData?.contacts?.asset_owner?.name || '-'
      },
      {
        title: t('lawyerWorkbench.offlineConfirmation.contactNumber'),
        value: pendingOfflineDetailData?.contacts?.asset_owner?.phone || '-'
      },
      // {
      //   title: t('lawyerWorkbench.offlineConfirmation.serviceWindow'),
      //   value: pendingOfflineDetailData?.service_window?.name || '-',
      // },
      {
        title: t('lawyerWorkbench.completedCaseDetailDialog.submissionTime'),
        value: pendingOfflineDetailData?.case_info?.create_time || '-'
      }
    ]
  }, [pendingOfflineDetailData])

  const stepData = useMemo(() => {
    return (
      pendingOfflineDetailData?.process_steps?.map(item => ({
        title: t(
          `lawyerWorkbench.offlineConfirmation.status.${item.type || '-1'}`
        ),
        endTime: item?.create_date
          ? dayjs((item?.create_date || 0) * 1000).format('YYYY-MM-DD HH:mm')
          : ''
      })) || []
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

  const timeLine: TimelineItemProps[] = useMemo(() => {
    return stepData.map((item, index) => {
      return {
        dot: stepIcon(
          index,
          item.endTime ? 0 : index > 0 && !!stepData[index - 1].endTime ? 1 : 2
        ),
        children: (
          <div className="pl-6">
            <div
              className={cn(
                'text-base',
                item.endTime || (index > 0 && !!stepData[index - 1].endTime)
                  ? 'text-white'
                  : 'text-#6B7280'
              )}
            >
              {item.title}
            </div>
            {/* <div
              className={cn(
                'text-sm mt-1',
                item.endTime || (index > 0 && !!stepData[index - 1].endTime)
                  ? 'text-#9CA3AF'
                  : 'text-#6B7280'
              )}
            >
              {item.content}
            </div> */}
            {item.endTime && (
              <div className="mt-1 text-xs text-#00E5FF font-400">
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

  if (isPending) {
    return <Waiting for={!isPending} className="h-100 fcc" />
  }

  return (
    <div className="px-22 py-13">
      <div className="w-full">
        <Link
          to="/lawyerWorkbench/casePending"
          className="w-fit fcc gap-1 clickable"
        >
          <div className="i-ic:round-arrow-back text-6 text-white"></div>
          <div>{t('lawyerWorkbench.offlineConfirmation.backToList')}</div>
        </Link>
      </div>
      <div className="mt-2">
        <div className="fyc gap-2 text-10 font-600">
          <div>{pendingOfflineDetailData?.case_info?.property_name || '-'}</div>
          <div className="text-#00E5FF">
            {t(`lawyerWorkbench.casePending.status.${pendingOfflineDetailData?.case_info?.status || 0}`)}
          </div>
        </div>
        <div className="mt-1 text-sm text-#9CA3AF">
          {/* {' '}
          {t('lawyerWorkbench.offlineConfirmation.task')} */}
          {pendingOfflineDetailData?.case_info?.case_code || '-'}
        </div>
      </div>
      <div className="mt-8 rounded-3 bg-#161B22 p-6">
        <div className="fyc gap-2">
          <div className="text-xl font-600">
            {t('lawyerWorkbench.offlineConfirmation.caseInfo')}
          </div>
          <div className="rounded-9999px bg-#00E6FF33 px-2 py-1 text-xs text-#00E5FF font-600">
            {t('lawyerWorkbench.offlineConfirmation.basicInfo')}
          </div>
        </div>
        <div className="grid cols-3 mt-4 gap-4">
          {asseteData.map((item, index) => (
            <div key={index} className="">
              <div className="text-sm text-#9CA3AF">{item.title}</div>
              <div className="mt-1 text-base text-white">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 rounded-3 bg-#161B22 p-6">
        <div className="text-xl font-600">
          {t('lawyerWorkbench.offlineConfirmation.offlineExecutionProcess')}
        </div>
        <div className="mt-9">
          <Timeline items={timeLine}></Timeline>
          {stepData.length === 0 && <NoContent />}
        </div>
      </div>
    </div>
  )
}
