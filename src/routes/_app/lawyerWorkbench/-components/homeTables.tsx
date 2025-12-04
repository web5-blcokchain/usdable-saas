import type { SearchParams } from '@/api/lawyerWorkbenchApi'
import type { ColumnsType } from 'antd/es/table'
import * as lawyerWorkbenchApi from '@/api/lawyerWorkbenchApi'
import { CommonTable } from '@/components/common/common-table'
import { ASSET_STATUS } from '@/enum/asset'
import { formatNumberNoRound } from '@/utils/number'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
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
  // 1为待初审 6为待线下认领 7线下已认领 8 已提交线下资料
  status: number
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
        status
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

// 待认领案件（初审阶段）
export function PendingClaimCasesTable({
  pagination,
  openDialog,
  openConfirmClaimDialog,
  searchParams
}: {
  pagination?: boolean
  openDialog?: () => void
  openConfirmClaimDialog?: (data: any) => void
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
          onClick={() =>
            openConfirmClaimDialog && openConfirmClaimDialog(record)}
          className="clickable"
        >
          {t('lawyerWorkbench.claimForReview')}
        </div>
      )
    }
  ]
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
      <CaseTable
        key="PendingClaimCasesTable"
        pagination={pagination}
        searchParams={searchParams}
        columns={columns}
        status={1}
      />
    </div>
  )
}

// 待线下执行案件
export function PendingOfflineExecutionTable({
  pagination,
  openDialog,
  searchParams
}: // openExecuteCase
{
  pagination?: boolean
  openDialog?: () => void
  searchParams?: SearchParams
  // openExecuteCase?: (data: any) => void
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
        <div className="fyc gap-2">
          <Link
            to="/lawyerWorkbench/offlineExecution/$id"
            params={{ id: `${record.id}` }}
          >
            <div className="c lickable">
              {t('lawyerWorkbench.offlineExecutionText')}
            </div>
          </Link>
          <Link
            to="/lawyerWorkbench/offlineConfirmation/$id"
            params={{ id: `${record.id}` }}
          >
            <div>{t('lawyerWorkbench.view')}</div>
          </Link>
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
        status={6}
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
      data = 'bg-#00FF8733 text-#00FF85'// 律师确认中
    }
    else if (
      [ASSET_STATUS.LAWYER_REJECTED, ASSET_STATUS.ASSESSOR_REJECTED].includes(
        status
      )
    ) {
      data = 'bg-#CD647833 text-#CF6679'// 驳回
    }
    else if (
      [
        ASSET_STATUS.ASSESSOR_CLAIMED,
        ASSET_STATUS.LAWYER_CLAIMED_OFFLINE,
        ASSET_STATUS.LAWYER_UPLOADED_MATERIALS
      ].includes(status)
    ) {
      data = 'bg-#2E2F1F text-#FFDD00'// 待评估
    }
    else {
      data = 'bg-#00FF8733 text-#00FF85' // 已上链
    }

    return (
      <div
        className={cn(
          data,
          'h-fit w-fit rounded-2 px-2 py-1 text-xs'
        )}
      >
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
      dataIndex: 'create_time',
      key: 'create_time',
      render: text => <div>{dayjs(text).format('YYYY-MM-DD')}</div>
    },
    {
      title: t('lawyerWorkbench.status'),
      dataIndex: 'status',
      key: 'status',
      render: status => (
        dataStatusContent(status)
      )
    },
    {
      title: t('lawyerWorkbench.action'),
      key: 'action',
      render: (_, record) => (
        <Link
          to="/lawyerWorkbench/offlineConfirmation/$id"
          params={{ id: `${record.id}` }}
        >
          <div className="clickable">{t('lawyerWorkbench.signAndConfirm')}</div>
        </Link>
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
        status={7}
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
  openCaseDetailDialog?: (data: any) => void
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
        status={8}
      />
    </div>
  )
}

// 待执行拍卖案件
export function PendingAuctionExecutionTable({
  pagination,
  openDialog,
  openAuctionDetailDialog
}: {
  pagination?: boolean
  openDialog?: () => void
  openAuctionDetailDialog?: (data: any) => void
}) {
  const { t } = useTranslation()
  const data = [
    {
      id: '#CAS20230567',
      address: '北京朝阳区',
      user: '李华',
      createTime: '2025-05-06',
      province: '北京',
      status: 2
    },
    {
      id: '#CAS20230566',
      address: '北京朝阳区',
      user: '李华',
      createTime: '2025-05-06',
      province: '北京',
      status: 3
    },
    {
      id: '#CAS20230565',
      address: '北京朝阳区',
      user: '李华',
      createTime: '2025-05-06',
      province: '北京',
      status: 3
    }
  ]
  const pageInfo = {
    pageSize: 10,
    total: 100,
    show: true
  }
  const columns: ColumnsType<(typeof data)[0]> = [
    {
      title: t('lawyerWorkbench.caseId'),
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: t('lawyerWorkbench.propertyName'),
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: t('lawyerWorkbench.submitter'),
      dataIndex: 'user',
      key: 'user'
    },
    {
      title: t('lawyerWorkbench.submitDate'),
      dataIndex: 'createTime',
      key: 'createTime',
      render: text => <div>{dayjs(text).format('YYYY-MM-DD')}</div>
    },
    {
      title: t('lawyerWorkbench.status'),
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <div
          className={cn(
            'w-fit h-fit px-2 py-1 rounded-2 text-xs ',
            status === 2
              ? 'bg-#EB45451A text-#F87171'
              : 'bg-#3B7FF51A text-#60A5FA'
          )}
        >
          {status === 2
            ? t('lawyerWorkbench.pendingExecution')
            : t('lawyerWorkbench.executing')}
        </div>
      )
    },
    {
      title: t('lawyerWorkbench.action'),
      key: 'action',
      render: (_, record) => (
        <div className="fyc gap-3">
          <div className="clickable">
            {record.status === 2
              ? t('lawyerWorkbench.claimTask')
              : t('lawyerWorkbench.uploadContract')}
          </div>
          <div
            className="clickable"
            onClick={() =>
              openAuctionDetailDialog && openAuctionDetailDialog(record.status)}
          >
            {t('lawyerWorkbench.viewDetails')}
          </div>
        </div>
      )
    }
  ]
  return (
    <div>
      <div className="fyc justify-between gap-3">
        <div className="text-xl">{t('lawyerWorkbench.auctionTasks')}</div>
        {!pagination && (
          <div onClick={openDialog} className="text-xs text-#E5E7EB clickable">
            {t('lawyerWorkbench.viewAll')}
          </div>
        )}
      </div>
      <CommonTable
        data={data}
        columns={columns}
        className="mt-4 overflow-hidden b-t-0 rounded-b-2 text-#E5E7EB"
        pagination={pagination ? pageInfo : false}
        tableConfig={
          {
            borderColor: '#1f2122'
          } as any
        }
      />
    </div>
  )
}

// 已完成拍卖案件
export function CompletedAuctionTable({
  pagination,
  openDialog,
  openCaseDetailDialog
}: {
  pagination?: boolean
  openDialog?: () => void
  openCaseDetailDialog?: (data: any) => void
}) {
  const { t } = useTranslation()
  const data = [
    {
      id: '#CAS20230567',
      address: '北京朝阳区',
      user: '李华',
      createTime: '2025-05-06',
      province: '北京',
      status: 4,
      price: 12500000
    },
    {
      id: '#CAS20230566',
      address: '北京朝阳区',
      user: '李华',
      createTime: '2025-05-06',
      province: '北京',
      status: 5,
      price: 12500000
    },
    {
      id: '#CAS20230565',
      address: '北京朝阳区',
      user: '李华',
      createTime: '2025-05-06',
      province: '北京',
      status: 5,
      price: 12500000
    }
  ]
  const pageInfo = {
    pageSize: 10,
    total: 100,
    show: true
  }
  const columns: ColumnsType<(typeof data)[0]> = [
    {
      title: t('lawyerWorkbench.caseId'),
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: t('lawyerWorkbench.propertyName'),
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: t('lawyerWorkbench.auctionPrice'),
      dataIndex: 'price',
      key: 'price',
      render: text => (
        <div>
          $
          {formatNumberNoRound(text, 6, 0)}
        </div>
      )
    },
    {
      title: t('lawyerWorkbench.auctionDate'),
      dataIndex: 'createTime',
      key: 'createTime',
      render: text => <div>{dayjs(text).format('YYYY-MM-DD')}</div>
    },
    {
      title: t('lawyerWorkbench.status'),
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <div
          className={cn(
            'w-fit h-fit px-2 py-1 rounded-2 text-xs ',
            status === 4
              ? 'bg-#EB45451A text-#F87171'
              : 'bg-#3B7FF51A text-#60A5FA'
          )}
        >
          {status === 4
            ? t('lawyerWorkbench.allocating')
            : t('lawyerWorkbench.allocationCompleted')}
        </div>
      )
    },
    {
      title: t('lawyerWorkbench.action'),
      key: 'action',
      render: (_, record) => (
        <div
          className="clickable"
          onClick={() => openCaseDetailDialog && openCaseDetailDialog(record)}
        >
          查看详情
        </div>
      )
    }
  ]
  return (
    <div>
      <div className="fyc justify-between gap-3">
        <div className="text-xl">
          {t('lawyerWorkbench.completedAuctionCases')}
        </div>
        {!pagination && (
          <div onClick={openDialog} className="text-xs text-#E5E7EB clickable">
            {t('lawyerWorkbench.viewAll')}
          </div>
        )}
      </div>
      <CommonTable
        data={data}
        columns={columns}
        className="mt-4 overflow-hidden b-t-0 rounded-b-2 text-#E5E7EB"
        pagination={pagination ? pageInfo : false}
        tableConfig={
          {
            borderColor: '#1f2122'
          } as any
        }
      />
    </div>
  )
}
