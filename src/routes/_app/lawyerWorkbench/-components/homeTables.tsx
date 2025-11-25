import type { ColumnsType } from 'antd/es/table'
import { CommonTable } from '@/components/common/common-table'
import { formatNumberNoRound } from '@/utils/number'
import { Link } from '@tanstack/react-router'
import dayjs from 'dayjs'

// 待初审案件
export function PendingInitialReviewTable({
  pagination,
  openDialog
}: {
  pagination?: boolean
  openDialog?: () => void
}) {
  const { t } = useTranslation()
  const pageInfo = {
    pageSize: 10,
    total: 100,
    show: true
  }
  const data = [
    {
      id: '#CAS20230567',
      address: '北京朝阳区',
      user: '李华',
      createTime: '2025-05-06',
      province: '北京'
    },
    {
      id: '#CAS20230566',
      address: '北京朝阳区',
      user: '李华',
      createTime: '2025-05-06',
      province: '北京'
    },
    {
      id: '#CAS20230565',
      address: '北京朝阳区',
      user: '李华',
      createTime: '2025-05-06',
      province: '北京'
    }
  ]

  const columns: ColumnsType<typeof data[0]> = [
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
      title: t('lawyerWorkbench.applicant'),
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
      title: t('lawyerWorkbench.region'),
      dataIndex: 'province',
      key: 'province'
    },
    {
      title: t('lawyerWorkbench.action'),
      key: 'action',
      render: (_, record) => (
        <Link to="/lawyerWorkbench/initialReview/$id" params={{ id: record.id }}>
          <div className="clickable">{t('lawyerWorkbench.review')}</div>
        </Link>
      )
    }
  ]
  return (
    <div>
      <div className="fyc justify-between gap-3">
        <div className="text-xl">{t('lawyerWorkbench.pendingInitialReview')}</div>
        {!pagination && <div onClick={openDialog} className="text-xs text-#E5E7EB clickable">{t('lawyerWorkbench.viewAll')}</div>}
      </div>
      <CommonTable
        data={data}
        columns={columns}
        className="mt-4 overflow-hidden b-t-0 rounded-b-2 text-#E5E7EB"
        pagination={pagination ? pageInfo : false}
        tableConfig={{
          borderColor: '#1f2122'
        } as any}
      />
    </div>
  )
}

// 待线下执行案件
export function PendingOfflineExecutionTable({
  pagination,
  openDialog
  // openExecuteCase
}: {
  pagination?: boolean
  openDialog?: () => void
  // openExecuteCase?: (data: any) => void
}) {
  const { t } = useTranslation()
  const data = [
    {
      id: '#CAS20230567',
      address: '北京朝阳区',
      user: '李华',
      createTime: '2025-05-06',
      province: '北京'
    },
    {
      id: '#CAS20230566',
      address: '北京朝阳区',
      user: '李华',
      createTime: '2025-05-06',
      province: '北京'
    },
    {
      id: '#CAS20230565',
      address: '北京朝阳区',
      user: '李华',
      createTime: '2025-05-06',
      province: '北京'
    }
  ]
  const pageInfo = {
    pageSize: 10,
    total: 100,
    show: true
  }

  const columns: ColumnsType<typeof data[0]> = [
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
      title: t('lawyerWorkbench.applicant'),
      dataIndex: 'user',
      key: 'user'
    },
    {
      title: t('lawyerWorkbench.reservationDate'),
      dataIndex: 'createTime',
      key: 'createTime',
      render: text => <div>{dayjs(text).format('YYYY-MM-DD')}</div>
    },
    {
      title: t('lawyerWorkbench.region'),
      dataIndex: 'province',
      key: 'province'
    },
    {
      title: t('lawyerWorkbench.action'),
      key: 'action',
      render: (_, record) => (
        <div className="fyc gap-2">
          <Link to="/lawyerWorkbench/offlineExecution/$id" params={{ id: record.id }}>
            <div className="c lickable">{t('lawyerWorkbench.offlineProcessingExecution')}</div>
          </Link>
          {/* <div>{t('lawyerWorkbench.view')}</div> */}
        </div>
      )
    }
  ]
  return (
    <div>
      <div className="fyc justify-between gap-3">
        <div className="text-xl">{t('lawyerWorkbench.pendingOfflineConfirmation')}</div>
        {!pagination && <div onClick={openDialog} className="text-xs text-#E5E7EB clickable">{t('lawyerWorkbench.viewAll')}</div>}
      </div>
      <CommonTable
        data={data}
        columns={columns}
        className="mt-4 overflow-hidden b-t-0 rounded-b-2 text-#E5E7EB"
        pagination={pagination ? pageInfo : false}
        tableConfig={{
          borderColor: '#1f2122'
        } as any}
      />
    </div>
  )
}

// 已完成案件
export function CompletedCasesTable({
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
      province: '北京'
    },
    {
      id: '#CAS20230566',
      address: '北京朝阳区',
      user: '李华',
      createTime: '2025-05-06',
      province: '北京'
    },
    {
      id: '#CAS20230565',
      address: '北京朝阳区',
      user: '李华',
      createTime: '2025-05-06',
      province: '北京'
    }
  ]
  const pageInfo = {
    pageSize: 10,
    total: 100,
    show: true
  }
  const columns: ColumnsType<typeof data[0]> = [
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
      title: t('lawyerWorkbench.applicant'),
      dataIndex: 'user',
      key: 'user'
    },
    {
      title: t('lawyerWorkbench.completionDate'),
      dataIndex: 'createTime',
      key: 'createTime',
      render: text => <div>{dayjs(text).format('YYYY-MM-DD')}</div>
    },
    {
      title: t('lawyerWorkbench.region'),
      dataIndex: 'province',
      key: 'province'
    },
    {
      title: t('lawyerWorkbench.action'),
      key: 'action',
      render: (_, record) => <div className="clickable" onClick={() => openCaseDetailDialog && openCaseDetailDialog(record)}>{t('lawyerWorkbench.view')}</div>
    }
  ]
  return (
    <div>
      <div className="fyc justify-between gap-3">
        <div className="text-xl">{t('lawyerWorkbench.completedCases')}</div>
        {!pagination && <div onClick={openDialog} className="text-xs text-#E5E7EB clickable">{t('lawyerWorkbench.viewAll')}</div>}
      </div>
      <CommonTable
        data={data}
        columns={columns}
        className="mt-4 overflow-hidden b-t-0 rounded-b-2 text-#E5E7EB"
        pagination={pagination ? pageInfo : false}
        tableConfig={{
          borderColor: '#1f2122'
        } as any}
      />
    </div>
  )
}

// 待认领案件（初审阶段）
export function PendingClaimCasesTable({
  pagination,
  openDialog,
  openConfirmClaimDialog
}: {
  pagination?: boolean
  openDialog?: () => void
  openConfirmClaimDialog?: (data: any) => void
}) {
  const { t } = useTranslation()
  const data = [
    {
      id: '#CAS20230567',
      address: '北京朝阳区',
      user: '李华',
      createTime: '2025-05-06',
      province: '北京',
      status: 0
    },
    {
      id: '#CAS20230566',
      address: '北京朝阳区',
      user: '李华',
      createTime: '2025-05-06',
      province: '北京',
      status: 0
    },
    {
      id: '#CAS20230565',
      address: '北京朝阳区',
      user: '李华',
      createTime: '2025-05-06',
      province: '北京',
      status: 0
    }
  ]
  const pageInfo = {
    pageSize: 10,
    total: 100,
    show: true
  }
  const columns: ColumnsType<typeof data[0]> = [
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
      title: t('lawyerWorkbench.applicant'),
      dataIndex: 'user',
      key: 'user'
    },
    {
      title: t('lawyerWorkbench.uploadDate'),
      dataIndex: 'createTime',
      key: 'createTime',
      render: text => <div>{dayjs(text).format('YYYY-MM-DD')}</div>
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
      render: (_, record) => <div onClick={() => openConfirmClaimDialog && openConfirmClaimDialog(record)} className="clickable">{t('lawyerWorkbench.claimForReview')}</div>
    }
  ]
  return (
    <div>
      <div className="fyc justify-between gap-3">
        <div className="text-xl">{t('lawyerWorkbench.pendingClaimInitialReview')}</div>
        {!pagination && <div onClick={openDialog} className="text-xs text-#E5E7EB clickable">{t('lawyerWorkbench.viewAll')}</div>}
      </div>
      <CommonTable
        data={data}
        columns={columns}
        className="mt-4 overflow-hidden b-t-0 rounded-b-2 text-#E5E7EB"
        pagination={pagination ? pageInfo : false}
        tableConfig={{
          borderColor: '#1f2122'
        } as any}
      />
    </div>
  )
}

// 待确权案件（线下确认阶段）
export function PendingRightConfirmationTable({
  pagination,
  openDialog
}: {
  pagination?: boolean
  openDialog?: () => void
}) {
  const { t } = useTranslation()
  const data = [
    {
      id: '#CAS20230567',
      address: '北京朝阳区',
      user: '李华',
      createTime: '2025-05-06',
      province: '北京',
      status: 1
    },
    {
      id: '#CAS20230566',
      address: '北京朝阳区',
      user: '李华',
      createTime: '2025-05-06',
      province: '北京',
      status: 1
    },
    {
      id: '#CAS20230565',
      address: '北京朝阳区',
      user: '李华',
      createTime: '2025-05-06',
      province: '北京',
      status: 1
    }
  ]
  const pageInfo = {
    pageSize: 10,
    total: 100,
    show: true
  }
  const columns: ColumnsType<typeof data[0]> = [
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
      title: t('lawyerWorkbench.applicant'),
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
      render: () => (
        <div className="h-fit w-fit rounded-2 bg-#EB45451A px-2 py-1 text-xs text-#F87171">
          {t('lawyerWorkbench.pendingConfirmation')}
        </div>
      )
    },
    {
      title: t('lawyerWorkbench.action'),
      key: 'action',
      render: (_, record) => (
        <Link to="/lawyerWorkbench/offlineConfirmation/$id" params={{ id: record.id }}>
          <div className="clickable">{t('lawyerWorkbench.signAndConfirm')}</div>
        </Link>
      )
    }
  ]
  return (
    <div>
      <div className="fyc justify-between gap-3">
        <div className="text-xl">{t('lawyerWorkbench.pendingRightConfirmation')}</div>
        {!pagination && <div onClick={openDialog} className="text-xs text-#E5E7EB clickable">{t('lawyerWorkbench.viewAll')}</div>}
      </div>
      <CommonTable
        data={data}
        columns={columns}
        className="mt-4 overflow-hidden b-t-0 rounded-b-2 text-#E5E7EB"
        pagination={pagination ? pageInfo : false}
        tableConfig={{
          borderColor: '#1f2122'
        } as any}
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
  const columns: ColumnsType<typeof data[0]> = [
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
        <div className={cn('w-fit h-fit px-2 py-1 rounded-2 text-xs ', status === 2 ? 'bg-#EB45451A text-#F87171' : 'bg-#3B7FF51A text-#60A5FA')}>
          {status === 2 ? t('lawyerWorkbench.pendingExecution') : t('lawyerWorkbench.executing')}
        </div>
      )
    },
    {
      title: t('lawyerWorkbench.action'),
      key: 'action',
      render: (_, record) => (
        <div className="fyc gap-3">
          <div className="clickable">
            {
              record.status === 2 ? t('lawyerWorkbench.claimTask') : t('lawyerWorkbench.uploadContract')
            }
          </div>
          <div className="clickable" onClick={() => openAuctionDetailDialog && openAuctionDetailDialog(record.status)}>{t('lawyerWorkbench.viewDetails')}</div>
        </div>
      )
    }
  ]
  return (
    <div>
      <div className="fyc justify-between gap-3">
        <div className="text-xl">{t('lawyerWorkbench.auctionTasks')}</div>
        {!pagination && <div onClick={openDialog} className="text-xs text-#E5E7EB clickable">{t('lawyerWorkbench.viewAll')}</div>}
      </div>
      <CommonTable
        data={data}
        columns={columns}
        className="mt-4 overflow-hidden b-t-0 rounded-b-2 text-#E5E7EB"
        pagination={pagination ? pageInfo : false}
        tableConfig={{
          borderColor: '#1f2122'
        } as any}
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
  const columns: ColumnsType<typeof data[0]> = [
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
        <div className={cn('w-fit h-fit px-2 py-1 rounded-2 text-xs ', status === 4 ? 'bg-#EB45451A text-#F87171' : 'bg-#3B7FF51A text-#60A5FA')}>
          {status === 4 ? t('lawyerWorkbench.allocating') : t('lawyerWorkbench.allocationCompleted')}
        </div>
      )
    },
    {
      title: t('lawyerWorkbench.action'),
      key: 'action',
      render: (_, record) => <div className="clickable" onClick={() => openCaseDetailDialog && openCaseDetailDialog(record)}>查看详情</div>
    }
  ]
  return (
    <div>
      <div className="fyc justify-between gap-3">
        <div className="text-xl">{t('lawyerWorkbench.completedAuctionCases')}</div>
        {!pagination && <div onClick={openDialog} className="text-xs text-#E5E7EB clickable">{t('lawyerWorkbench.viewAll')}</div>}
      </div>
      <CommonTable
        data={data}
        columns={columns}
        className="mt-4 overflow-hidden b-t-0 rounded-b-2 text-#E5E7EB"
        pagination={pagination ? pageInfo : false}
        tableConfig={{
          borderColor: '#1f2122'
        } as any}
      />
    </div>
  )
}
