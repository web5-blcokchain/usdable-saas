import type { SearchParams } from '@/api/lawyerWorkbenchApi'
import type { ColumnsType } from 'antd/es/table'
import * as lawyerWorkbenchApi from '@/api/lawyerWorkbenchApi'
import { CommonTable } from '@/components/common/common-table'
import { ASSET_STATUS } from '@/enum/asset'
import { PENDING_CASE_STATUS } from '@/enum/lawyerWorkbench'
import { useCommonStore } from '@/stores/common'
import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import dayjs from 'dayjs'

// 1为待初审 6为待线下认领 7线下已认领 8 已提交线下资料
export function CaseTable({
  pagination,
  searchParams,
  columns,
  status
}: {
  pagination?: boolean
  searchParams?: SearchParams
  columns: ColumnsType<any>
  status: PENDING_CASE_STATUS
}) {
  const [pageInfo, setPageInfo] = useState({
    pageSize: 10,
    page: 1
  })

  // 获取待认领案件（初审阶段）列表
  const { data, isFetching } = useQuery({
    queryKey: ['pendingClaimCases', searchParams, pageInfo, status],
    queryFn: async () => {
      const res = await lawyerWorkbenchApi.getCaseList({
        ...pageInfo,
        status,
        country_id: searchParams?.country_id || undefined,
        start_date: searchParams?.start_date || undefined,
        end_date: searchParams?.end_date || undefined,
        keyword: searchParams?.keyword || undefined
      })
      return res.data
    }
  })
  return (
    <CommonTable
      data={data?.list}
      columns={columns}
      tableProps={{ loading: isFetching }}
      className="mt-4 overflow-hidden b-t-0 rounded-b-2 text-#E5E7EB"
      pagination={
        pagination
          ? {
              pageSize: pageInfo.pageSize,
              total: data?.count || 0,
              current: pageInfo.page,
              onChange: page => setPageInfo({ ...pageInfo, page })
            }
          : false
      }
      tableConfig={
        {
          borderColor: '#1f2122'
        } as any
      }
    />
  )
}

// 待认领案件(初审阶段)
export function PendingClaimCasesTable({
  pagination,
  openDialog,
  openConfirmClaimDialog,
  searchParams
}: {
  pagination?: boolean
  openDialog?: () => void
  openConfirmClaimDialog: (data: lawyerWorkbenchApi.PendingCaseList) => void
  searchParams?: SearchParams
}) {
  const { t } = useTranslation()
  const [pageInfo, setPageInfo] = useState({
    pageSize: 10,
    page: 1
  })
  const columns: ColumnsType<lawyerWorkbenchApi.PendingCaseList> = [
    {
      title: t('lawyerWorkbench.caseId'),
      dataIndex: 'code',
      key: 'code'
    },
    {
      title: t('lawyerWorkbench.propertyName'),
      dataIndex: 'asset_name',
      key: 'asset_name'
    },
    {
      // TODO
      title: t('lawyerWorkbench.applicant'),
      dataIndex: 'user',
      key: 'user'
    },
    {
      title: t('lawyerWorkbench.uploadDate'),
      dataIndex: 'update_time',
      key: 'update_time',
      render: text => <div>{dayjs(text ?? '').format('YYYY-MM-DD')}</div>
    },
    {
      title: t('lawyerWorkbench.status'),
      dataIndex: 'status',
      key: 'status',
      render: () => (
        <div className="h-fit w-fit rounded-2 bg-#EB45451A px-2 py-1 text-xs text-#F87171">
          {t('lawyerWorkbench.pendingClaim')}
        </div>
      )
    },
    {
      title: t('lawyerWorkbench.action'),
      key: 'action',
      render: (_, record) => (
        <div
          onClick={() => openConfirmClaimDialog(record)}
          className="clickable"
        >
          {t('lawyerWorkbench.claim')}
        </div>
      )
    }
  ]
  const { data, isFetching: countIsFetching } = useQuery({
    queryKey: ['pendingClaimCasesCount', searchParams, pageInfo],
    queryFn: async () => {
      const res = await lawyerWorkbenchApi.getPendingCaseList({
        ...pageInfo,
        country_id: searchParams?.country_id || undefined,
        start_date: searchParams?.start_date || undefined,
        end_date: searchParams?.end_date || undefined,
        keyword: searchParams?.keyword || undefined
      })
      return res.data
    }
  })
  return (
    <div>
      <div className="fyc justify-between gap-3">
        <div className="text-xl">
          {t('lawyerWorkbench.pendingClaimInitialReview')}
        </div>
        {!pagination && (
          <div onClick={openDialog} className="text-xs text-#E5E7EB clickable">
            {t('lawyerWorkbench.viewAll')}
          </div>
        )}
      </div>
      <CommonTable
        data={data?.list}
        columns={columns}
        tableProps={{ loading: countIsFetching }}
        className="mt-4 overflow-hidden b-t-0 rounded-b-2 text-#E5E7EB"
        pagination={
          pagination
            ? {
                pageSize: pageInfo.pageSize,
                total: data?.count || 0,
                current: pageInfo.page,
                onChange: page => setPageInfo({ ...pageInfo, page })
              }
            : false
        }
        tableConfig={
          {
            borderColor: '#1f2122'
          } as any
        }
      />
    </div>
  )
}

// 待初审案件
export function PendingInitialReviewTable({
  pagination,
  openDialog,
  searchParams
}: {
  pagination?: boolean
  openDialog?: () => void
  searchParams?: SearchParams
}) {
  const { t } = useTranslation()
  const columns: ColumnsType<lawyerWorkbenchApi.PendingCaseList> = [
    {
      title: t('lawyerWorkbench.caseId'),
      dataIndex: 'code',
      key: 'code'
    },
    {
      title: t('lawyerWorkbench.propertyName'),
      dataIndex: 'asset_name',
      key: 'asset_name'
    },
    {
      // TODO
      title: t('lawyerWorkbench.applicant'),
      dataIndex: 'user',
      key: 'user'
    },
    {
      title: t('lawyerWorkbench.submitDate'),
      dataIndex: 'update_time',
      key: 'update_time',
      render: text => <div>{dayjs(text ?? '').format('YYYY-MM-DD')}</div>
    },
    {
      title: t('lawyerWorkbench.status'),
      dataIndex: 'status',
      key: 'status',
      render: () => (
        <div className="h-fit w-fit rounded-2 bg-#EB45451A px-2 py-1 text-xs text-#F87171">
          {t('lawyerWorkbench.pendingClaim')}
        </div>
      )
    },
    {
      title: t('lawyerWorkbench.action'),
      key: 'action',
      render: (_, record) => (
        <Link
          to="/lawyerWorkbench/initialReview/$id"
          params={{ id: `${record.id}` }}
          className="clickable"
        >
          {t('lawyerWorkbench.review')}
        </Link>
      )
    }
  ]
  return (
    <div>
      <div className="fyc justify-between gap-3">
        <div className="text-xl">
          {t('lawyerWorkbench.pendingInitialReview')}
        </div>
        {!pagination && (
          <div onClick={openDialog} className="text-xs text-#E5E7EB clickable">
            {t('lawyerWorkbench.viewAll')}
          </div>
        )}
      </div>
      <CaseTable
        key="PendingOfflineExecutionTable"
        pagination={pagination}
        searchParams={searchParams}
        columns={columns}
        status={PENDING_CASE_STATUS.PENDING_INITIAL}
      />
    </div>
  )
}

// 待线下执行案件
export function PendingOfflineExecutionTable({
  pagination,
  openDialog,
  searchParams,
  openClaimDialog
}: // openExecuteCase
{
  pagination?: boolean
  openDialog?: () => void
  searchParams?: SearchParams
  openClaimDialog: (data: lawyerWorkbenchApi.CaseListData) => void
}) {
  const { t } = useTranslation()
  const columns: ColumnsType<lawyerWorkbenchApi.CaseListData> = [
    {
      title: t('lawyerWorkbench.caseId'),
      dataIndex: 'code',
      key: 'code'
    },
    {
      title: t('lawyerWorkbench.propertyName'),
      dataIndex: 'asset_name',
      key: 'asset_name'
    },
    {
      title: t('lawyerWorkbench.applicant'),
      dataIndex: 'user',
      key: 'user'
    },
    {
      title: t('lawyerWorkbench.reservationDate'),
      dataIndex: 'update_time',
      key: 'update_time',
      render: text => <div>{dayjs(text).format('YYYY-MM-DD')}</div>
    },
    {
      title: t('lawyerWorkbench.region'),
      dataIndex: 'district',
      key: 'district'
    },
    {
      title: t('lawyerWorkbench.action'),
      key: 'action',
      render: (_, record) => (
        <div className="fyc gap-2">
          <div onClick={() => openClaimDialog(record)} className="clickable">
            {t('lawyerWorkbench.execute')}
          </div>
        </div>
      )
    }
  ]

  return (
    <div>
      <div className="fyc justify-between gap-3">
        <div className="text-xl">
          {t('lawyerWorkbench.pendingOfflineConfirmation')}
        </div>
        {!pagination && (
          <div onClick={openDialog} className="text-xs text-#E5E7EB clickable">
            {t('lawyerWorkbench.viewAll')}
          </div>
        )}
      </div>
      <CaseTable
        key="PendingOfflineExecutionTable"
        pagination={pagination}
        searchParams={searchParams}
        columns={columns}
        status={PENDING_CASE_STATUS.PENDING_OFFLINE}
      />
    </div>
  )
}

// 待确权案件（线下确认阶段）
export function PendingRightConfirmationTable({
  pagination,
  openDialog,
  searchParams
}: {
  pagination?: boolean
  openDialog?: () => void
  searchParams?: SearchParams
}) {
  const { t } = useTranslation()
  const dataStatusContent = (status: ASSET_STATUS) => {
    let data = ''
    if (status < 2) {
      data = 'bg-#00FF8733 text-#00FF85' // 律师确认中
    }
    else if (
      [ASSET_STATUS.LAWYER_REJECTED, ASSET_STATUS.ASSESSOR_REJECTED].includes(
        status
      )
    ) {
      data = 'bg-#CD647833 text-#CF6679' // 驳回
    }
    else if (
      [
        ASSET_STATUS.ASSESSOR_CLAIMED,
        ASSET_STATUS.LAWYER_CLAIMED_OFFLINE,
        ASSET_STATUS.LAWYER_UPLOADED_MATERIALS
      ].includes(status)
    ) {
      data = 'bg-#2E2F1F text-#FFDD00' // 待评估
    }
    else {
      data = 'bg-#00FF8733 text-#00FF85' // 已上链
    }

    return (
      <div className={cn(data, 'h-fit w-fit rounded-2 px-2 py-1 text-xs')}>
        {t(
          `common.assetStatus.${
            ASSET_STATUS.DRAFT <= status
            && ASSET_STATUS.ASSET_ON_CHAIN >= status
              ? status
              : 'other'
          }`
        )}
      </div>
    )
  }

  const { setCaseListData } = useCommonStore()
  const navigate = useNavigate()
  const toCasePendingInfo = (record: lawyerWorkbenchApi.CaseListData) => {
    setCaseListData(record)
    navigate({
      to: '/lawyerWorkbench/offlineApproval/$id',
      params: { id: `${record.id}` }
    })
  }

  const columns: ColumnsType<lawyerWorkbenchApi.CaseListData> = [
    {
      title: t('lawyerWorkbench.caseId'),
      dataIndex: 'code',
      key: 'code'
    },
    {
      title: t('lawyerWorkbench.propertyName'),
      dataIndex: 'asset_name',
      key: 'asset_name'
    },
    {
      title: t('lawyerWorkbench.applicant'),
      dataIndex: 'user',
      key: 'user'
    },
    {
      title: t('lawyerWorkbench.submitDate'),
      dataIndex: 'update_time',
      key: 'update_time',
      render: text => <div>{dayjs(text).format('YYYY-MM-DD')}</div>
    },
    {
      title: t('lawyerWorkbench.status'),
      dataIndex: 'status',
      key: 'status',
      render: status => dataStatusContent(status)
    },
    {
      title: t('lawyerWorkbench.action'),
      key: 'action',
      render: (_, record) => (
        <div className="fcc gap-2">
          <div onClick={() => toCasePendingInfo(record)} className="clickable">
            {t('lawyerWorkbench.SignatureSeal')}
          </div>
          <Link
            to="/lawyerWorkbench/casePending/info/$id"
            params={{ id: `${record.id}` }}
          >
            <div className="clickable">
              {t('lawyerWorkbench.checkProgress')}
            </div>
          </Link>
        </div>
      )
    }
  ]
  return (
    <div>
      <div className="fyc justify-between gap-3">
        <div className="text-xl">
          {t('lawyerWorkbench.pendingRightConfirmation')}
        </div>
        {!pagination && (
          <div onClick={openDialog} className="text-xs text-#E5E7EB clickable">
            {t('lawyerWorkbench.viewAll')}
          </div>
        )}
      </div>
      <CaseTable
        key="PendingRightConfirmationTable"
        pagination={pagination}
        searchParams={searchParams}
        columns={columns}
        status={PENDING_CASE_STATUS.OFFLINE_CLAIMED}
      />
    </div>
  )
}

// 已完成案件
export function CompletedCasesTable({
  pagination,
  openDialog,
  openCaseDetailDialog,
  searchParams
}: {
  pagination?: boolean
  openDialog?: () => void
  openCaseDetailDialog?: (data: lawyerWorkbenchApi.CaseListData) => void
  searchParams?: SearchParams
}) {
  const { t } = useTranslation()

  const columns: ColumnsType<lawyerWorkbenchApi.CaseListData> = [
    {
      title: t('lawyerWorkbench.caseId'),
      dataIndex: 'code',
      key: 'code'
    },
    {
      title: t('lawyerWorkbench.propertyName'),
      dataIndex: 'asset_name',
      key: 'asset_name'
    },
    {
      title: t('lawyerWorkbench.applicant'),
      dataIndex: 'user',
      key: 'user'
    },
    {
      title: t('lawyerWorkbench.completionDate'),
      dataIndex: 'create_time',
      key: 'create_time',
      render: text => <div>{dayjs(text).format('YYYY-MM-DD')}</div>
    },
    {
      title: t('lawyerWorkbench.region'),
      dataIndex: 'district',
      key: 'district'
    },
    {
      title: t('lawyerWorkbench.action'),
      key: 'action',
      render: (_, record) => (
        <div
          className="clickable"
          onClick={() => openCaseDetailDialog && openCaseDetailDialog(record)}
        >
          {t('lawyerWorkbench.view')}
        </div>
      )
    }
  ]
  return (
    <div>
      <div className="fyc justify-between gap-3">
        <div className="text-xl">{t('lawyerWorkbench.completedCases')}</div>
        {!pagination && (
          <div onClick={openDialog} className="text-xs text-#E5E7EB clickable">
            {t('lawyerWorkbench.viewAll')}
          </div>
        )}
      </div>
      <CaseTable
        key="PendingClaimCasesTable"
        pagination={pagination}
        searchParams={searchParams}
        columns={columns}
        status={PENDING_CASE_STATUS.COMPLETED}
      />
    </div>
  )
}
