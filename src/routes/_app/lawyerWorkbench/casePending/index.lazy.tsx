import type {
  PendingCaseListData
} from '@/api/lawyerWorkbenchApi'
import type { ColumnsType } from 'antd/es/table'
import {
  getPendingOfflineList
} from '@/api/lawyerWorkbenchApi'
import { CommonTable } from '@/components/common/common-table'
import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute, Link } from '@tanstack/react-router'
import { Tag } from 'antd'
import dayjs from 'dayjs'

export const Route = createLazyFileRoute('/_app/lawyerWorkbench/casePending/')({
  component: RouteComponent
})

function RouteComponent() {
  const { t } = useTranslation()
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    pageSize: 10
  })
  const { data, isFetching: isLoading } = useQuery({
    queryKey: ['pendingOfflineList', pageInfo],
    queryFn: async () => {
      const res = await getPendingOfflineList(pageInfo)
      return res.data
    }
  })

  const statusColorMap = ['#414755', 'orange', 'green', 'red']

  const columns: ColumnsType<PendingCaseListData> = [
    {
      title: t('lawyerWorkbench.caseId'),
      dataIndex: 'case_code',
      key: 'case_code',
      render: (text: string) => (
        <span className="text-4 text-base">{text}</span>
      )
    },
    {
      title: t('lawyerWorkbench.offlineConfirmation.propertyAddress'),
      key: 'address',
      render: (_: any, record) => (
        <div>
          <div className="text-4 text-base">{record?.property_name}</div>
          <div className="text-xs text-#8B949E font-400">
            {record?.property_address}
          </div>
        </div>
      )
    },
    {
      title: t('lawyerWorkbench.offlineConfirmation.currentStep'),
      key: 'step',
      render: (_: any, record) => (
        <div>
          <span className="text-#09B2E9 font-600">
            {t('lawyerWorkbench.casePending.step', {
              step: t(`common.number.${(record?.status || 0) + 1}`)
            })}
          </span>
          <span className="text-#8B949E"> | </span>
          <span className="text-white">
            {t(`lawyerWorkbench.casePending.status.${record?.status || 0}`)}
          </span>
        </div>
      )
    },
    {
      title: t('lawyerWorkbench.casePending.applicationStatus'),
      key: 'status',
      render: (_: any, record) => (
        <Tag
          color={statusColorMap[record?.status || 0]}
          className="h-fit w-fit rounded-2 px-2 py-1 text-xs font-600"
        >
          {t(`lawyerWorkbench.casePending.status.${record?.status || 0}`)}
        </Tag>
      )
    },
    {
      title: t('assete.table.updateTime'),
      dataIndex: 'update_time',
      key: 'update_time',
      render: (text: string) => (
        <div className="text-sm text-#8B949E font-400">
          {dayjs(text).format('YYYY-MM-DD HH:mm')}
        </div>
      )
    },
    {
      title: t('lawyerWorkbench.action'),
      key: 'action',
      render: (_, record) => (
        <Link
          to="/lawyerWorkbench/offlineConfirmation/$id"
          params={{ id: record.submission_id?.toString() || '' }}
          className="text-sm text-primary"
        >
          {t('lawyerWorkbench.casePending.enterProcessing')}
        </Link>
      )
    }
  ]

  return (
    <div className="px-22 py-13">
      <div className="text-8 font600">
        {t('lawyerWorkbench.casePending.title')}
      </div>
      <div className="mt-1 text-base text-#8B949E font-400">
        {t('lawyerWorkbench.casePending.description')}
      </div>
      <div className="mt-7">
        <CommonTable
          tableProps={{ loading: isLoading }}
          data={data?.list}
          columns={columns}
          className="mt-4 overflow-hidden b-t-0 rounded-b-2 text-#E5E7EB"
          pagination={{
            current: pageInfo.page,
            pageSize: pageInfo.pageSize,
            total: data?.count || 0,
            onChange: (page, pageSize) => {
              setPageInfo({
                page,
                pageSize
              })
            }
          }}
          tableConfig={
            {
              borderColor: '#1f2122'
            } as any
          }
        />
      </div>
    </div>
  )
}
