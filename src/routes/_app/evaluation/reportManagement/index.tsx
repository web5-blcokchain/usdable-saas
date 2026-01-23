import type { ColumnsType } from 'antd/es/table'
import * as evaluationApi from '@/api/evaluationApi'
import { CommonTable } from '@/components/common/common-table'
import { SUBMISSION_STATUS } from '@/enums/common'
import { downloadFile } from '@/utils/file'
import { cn } from '@/utils/style'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Input } from 'antd'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import './index.scss'

export const Route = createFileRoute('/_app/evaluation/reportManagement/')({
  component: RouteComponent
})

function RouteComponent() {
  const { t } = useTranslation()

  const [pageInfo, setPageInfo] = useState({
    page: 1,
    pageSize: 10,
    keyword: ''
  })

  const { data, isFetching } = useQuery({
    queryKey: ['getReportList', pageInfo],
    queryFn: async () => {
      const res = await evaluationApi.getReportList(pageInfo)
      return res.data
    }
  })

  const dataStatusContent = (status: SUBMISSION_STATUS) => {
    let data = ''
    // 已完成
    if (SUBMISSION_STATUS.APPROVED === status) {
      data = 'bg-#00FF8733 text-#00FF85' // 已驳回
    }
    else if (SUBMISSION_STATUS.PENDING === status) {
      data = 'bg-#CD647833 text-#CF6679' // 待认领
    }
    return (
      <div
        className={cn(
          data,
          'rounded-9999px px-2 py-1 text-xs font-400 w-fit fcc gap-1'
        )}
      >
        <div
          className={cn(
            status !== SUBMISSION_STATUS.APPROVED && 'i-ep:success-filled',
            status === SUBMISSION_STATUS.PENDING && 'i-ix:namur-failure-filled'
          )}
        >
        </div>
        <div>
          {t(
            status === SUBMISSION_STATUS.PENDING
              ? 'common.submissionStatusPending'
              : 'common.submissionStatusApproved'
          )}
        </div>
      </div>
    )
  }

  const columns: ColumnsType<evaluationApi.AppraiserReportList> = [
    {
      title: t('evaluation.reportManagement.table.reportId'),
      dataIndex: 'report_code',
      key: 'report_code',
      render: text => (
        <div>
          <div className="text-#9CA3AF">
            {t('evaluation.reportManagement.table.reportId')}
          </div>
          <div className="mt-1.5 font-bold">{text}</div>
        </div>
      )
    },
    {
      title: t('evaluation.reportManagement.table.assetName'),
      dataIndex: 'asset_name',
      key: 'asset_name',
      render: text => (
        <div>
          <div className="mb-1.5 text-#9CA3AF">
            {t('evaluation.reportManagement.table.assetName')}
          </div>
          <div>{text}</div>
        </div>
      )
    },
    {
      title: t('evaluation.reportManagement.table.status'),
      dataIndex: 'status',
      key: 'status',
      render: text => (
        <div>
          <div className="mb-1.5 text-#9CA3AF">
            {t('evaluation.reportManagement.table.status')}
          </div>
          <div>{dataStatusContent(text)}</div>
        </div>
      )
    },
    {
      title: t('evaluation.reportManagement.table.submitTime'),
      dataIndex: 'submit_time',
      key: 'submit_time',
      render: text => (
        <div>
          <div className="mb-1.5 text-#9CA3AF">
            {t('evaluation.reportManagement.table.submitTime')}
          </div>
          <div className="text-#D1D5DB">
            {dayjs(typeof text === 'string' ? text : text * 1000).format(
              'YYYY-MM-DD HH:mm:ss'
            )}
          </div>
        </div>
      )
    },
    {
      title: t('evaluation.reportManagement.table.action'),
      key: 'action',
      render: (_, record) => (
        <div className="fcc gap-4 text-base text-#9CA3AF [&>div]:fcc [&>div]:clickable [&>div]:gap-1">
          <div
            onClick={() =>
              downloadFile({
                downLoadUrl: record?.files,
                t
              })}
          >
            <div className="i-flowbite:download-solid"></div>
            <div>{t('evaluation.reportManagement.table.download')}</div>
          </div>
        </div>
      )
    }
  ]

  return (
    <div className="reportManagement px-22 py-13 text-base max-md:px-4">
      <div className="fyc justify-between gap-4">
        <div>
          <div className="text-8 font-600">
            {t('evaluation.reportManagement.title')}
          </div>
          <div className="mt-2 text-#9CA3AF">
            {t('evaluation.reportManagement.description')}
          </div>
        </div>
      </div>
      <Input
        className="mt-8 [&>span>input]:h-12.5 [&>span>input]:b-l-0 [&>span>.ant-input-group-addon]:bg-#171b21 [&>span>input]:bg-#171b21 [&>span>.ant-input-outlined:focus]:b-l-1! [&>span>.ant-input-outlined:hover]:b-l-1!"
        placeholder={t('evaluation.reportManagement.searchPlaceholder')}
        addonBefore={
          <div className="i-weui:search-filled text-4 text-#9ea3ae"></div>
        }
        onKeyUp={(e) => {
          if (e.key === 'Enter') {
            setPageInfo({
              ...pageInfo,
              keyword: e.currentTarget?.value
            })
          }
        }}
      />
      <div className="mt-8">
        <CommonTable
          tableProps={{ loading: isFetching }}
          data={data?.list}
          columns={columns}
          pagination={{
            total: data?.count || 0,
            current: pageInfo.page,
            pageSize: pageInfo.pageSize,
            onChange: (page, pageSize) => {
              setPageInfo({
                ...pageInfo,
                page,
                pageSize
              })
            }
          }}
        />
      </div>
    </div>
  )
}
