import type { ColumnsType } from 'antd/es/table'
import icAuction from '@/assets/icon/assete/ic_auction.png'
import { CommonTable } from '@/components/common/common-table'
import { CommonDialog } from '@/components/common/dialog/common'
import { formatNumberNoRound } from '@/utils/number'
import { createLazyFileRoute, Link } from '@tanstack/react-router'
import { Select } from 'antd'
import dayjs from 'dayjs'
import './index.lazy.scss'

export const Route = createLazyFileRoute('/_app/lawyerWorkbench/')({
  component: RouteComponent
})

// 律师工作台
function RouteComponent() {
  const caseTypeList = [
    { title: '待初审案件', num: 12, icon: <img src={icAuction} className="w-5" /> },
    { title: '待线下确认案件', num: 8, icon: <div className="i-ep:success-filled"></div> },
    { title: '已完成案件', num: 24, icon: <div className="i-fa-solid:flag-checkered"></div> },
    { title: '拍卖任务', num: 6, icon: <img src={icAuction} className="w-5" /> }
  ]
  const [allDialogVisible, setAllDialogVisible] = useState(false)
  const [tableType, setTableType] = useState(0)

  const showTableAllDialog = (type: number) => {
    setAllDialogVisible(true)
    setTableType(type)
  }
  const DialogContent = useMemo(() => {
    switch (tableType) {
      case 0:
        return PendingInitialReviewTable
      case 1:
        return PendingOfflineExecutionTable
      case 2:
        return CompletedCasesTable
      case 3:
        return PendingClaimCasesTable
      case 4:
        return PendingRightConfirmationTable
      case 5:
        return PendingAuctionExecutionTable
      default:
        return CompletedAuctionTable
    }
  }, [tableType])

  return (
    <div className="lawyer-workbench px-22 py-13 pb-24">
      <div className="rounded-3 bg-#161B22 p-4">
        <div className="text-lg font-600">快捷筛选</div>
        <div
          className="grid cols-3 mt-4 gap-3 pb-4 [&>div>div:first-child]:mb-1"
          style={{
            '--input-border-color': '#334155',
            '--input-bg-color': '#1f2328'
          } as any}
        >
          <div>
            <div>国家</div>
            {/* 全部 */}
            <Select placeholder="请选择国家" />
          </div>
          <div>
            <div>时间范围</div>
            {/* 全部时间 */}
            <Select placeholder="请选择时间范围" />
          </div>
          <div>
            <div>案件状态</div>
            {/* 全部状态 */}
            <Select placeholder="请选择案件状态" />
          </div>
        </div>
      </div>
      <div className="grid cols-4 mt-10.5 gap-6">
        {
          caseTypeList.map((item, index) => {
            return (
              <div key={index} className="fyc justify-between gap-3 rounded-3 bg-#161B22 px-6 py-11">
                <div>
                  <div className="text-xs text-#9CA3AF">{item.title}</div>
                  <div className="mt-1 text-7.5 font-bold">{item.num}</div>
                </div>
                <div className="h-13.5 w-11.5 fcc b-1 b-#00E5FF rounded-2 b-solid bg-#0A192F text-xl text-#00E5FF">
                  {item.icon}
                </div>
              </div>
            )
          })
        }
      </div>
      <div className="grid cols-2 mt-8 gap-6">
        <div className="flex justify-between gap-3 rounded-3 bg-#161B22 p-6">
          <div>
            <div className="text-xs text-#9CA3AF">待认领案件（初审）</div>
            <div className="mt-1 text-7.5 font-bold">2</div>
            <div className="mt-4 text-xs text-#00E5FF clickable">查看详情</div>
          </div>
          <div className="h-13.5 w-12 fcc b-1 b-#00E5FF rounded-2 b-solid bg-#0A192F text-xl text-#00E5FF">
            <div className="i-fa-solid:hand-holding translate-y--20%"></div>
          </div>
        </div>
        <div className="flex justify-between gap-3 rounded-3 bg-#161B22 p-6">
          <div>
            <div className="text-xs text-#9CA3AF">待确权案件（线下确认）</div>
            <div className="mt-1 text-7.5 font-bold">2</div>
            <div className="mt-4 text-xs text-#00E5FF clickable">查看详情</div>
          </div>
          <div className="h-13.5 w-12 fcc b-1 b-#00E5FF rounded-2 b-solid bg-#0A192F text-xl text-#00E5FF">
            <img className="w-5 transform-translate-x-10%" src={(new URL('@/assets/images/register/userSign-main.png', import.meta.url).href)} alt="" />
          </div>
        </div>
      </div>
      <div className="mt-11 flex flex-col gap-8">
        {/* 待初审案件 */}
        <PendingInitialReviewTable openDialog={() => showTableAllDialog(0)} />
        {/* 待线下执行案件 */}
        <PendingOfflineExecutionTable openDialog={() => showTableAllDialog(1)} />
        {/* 已完成案件 */}
        <CompletedCasesTable openDialog={() => showTableAllDialog(2)} />
        {/* 待认领案件（初审阶段） */}
        <PendingClaimCasesTable openDialog={() => showTableAllDialog(3)} />
        {/* 待确权案件（线下确认阶段） */}
        <PendingRightConfirmationTable openDialog={() => showTableAllDialog(4)} />
        {/* 待执行拍卖案件 */}
        <PendingAuctionExecutionTable openDialog={() => showTableAllDialog(5)} />
        {/* 已完成拍卖案件 */}
        <CompletedAuctionTable openDialog={() => showTableAllDialog(6)} />
      </div>
      {/* 展示所有的案件分类全部列表弹窗 */}
      <TableAllDialog visible={allDialogVisible} setVisible={setAllDialogVisible} component={DialogContent} title="案件列表" />
    </div>
  )
}

// 待初审案件
function PendingInitialReviewTable({
  pagination,
  openDialog
}: {
  pagination?: boolean
  openDialog?: () => void
}) {
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
      title: '案件编号',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '房产名称',
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: '申请人',
      dataIndex: 'user',
      key: 'user'
    },
    {
      title: '提交日期',
      dataIndex: 'createTime',
      key: 'createTime',
      render: text => <div>{dayjs(text).format('YYYY-MM-DD')}</div>
    },
    {
      title: '地区',
      dataIndex: 'province',
      key: 'province'
    },
    {
      title: '操作',
      key: 'status',
      render: (_, record) => (
        <Link to="/lawyerWorkbench/initialReview/$id" params={{ id: record.id }}>
          <div className="clickable">审核</div>
        </Link>
      )
    }
  ]
  return (
    <div>
      <div className="fyc justify-between gap-3">
        <div className="text-xl">待初审案件</div>
        {!pagination && <div onClick={openDialog} className="text-xs text-#E5E7EB clickable">查看全部</div>}
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
function PendingOfflineExecutionTable({
  pagination,
  openDialog
}: {
  pagination?: boolean
  openDialog?: () => void
}) {
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
      title: '案件编号',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '房产名称',
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: '申请人',
      dataIndex: 'user',
      key: 'user'
    },
    {
      title: '预约日期',
      dataIndex: 'createTime',
      key: 'createTime',
      render: text => <div>{dayjs(text).format('YYYY-MM-DD')}</div>
    },
    {
      title: '地区',
      dataIndex: 'province',
      key: 'province'
    },
    {
      title: '操作',
      key: 'status',
      render: () => <div className="clickable">执行</div>
    }
  ]
  return (
    <div>
      <div className="fyc justify-between gap-3">
        <div className="text-xl">待线下执行案件</div>
        {!pagination && <div onClick={openDialog} className="text-xs text-#E5E7EB clickable">查看全部</div>}
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
function CompletedCasesTable({
  pagination,
  openDialog
}: {
  pagination?: boolean
  openDialog?: () => void
}) {
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
      title: '案件编号',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '房产名称',
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: '申请人',
      dataIndex: 'user',
      key: 'user'
    },
    {
      title: '完成日期',
      dataIndex: 'createTime',
      key: 'createTime',
      render: text => <div>{dayjs(text).format('YYYY-MM-DD')}</div>
    },
    {
      title: '地区',
      dataIndex: 'province',
      key: 'province'
    },
    {
      title: '操作',
      key: 'status',
      render: () => <div className="clickable">查看</div>
    }
  ]
  return (
    <div>
      <div className="fyc justify-between gap-3">
        <div className="text-xl">已完成案件</div>
        {!pagination && <div onClick={openDialog} className="text-xs text-#E5E7EB clickable">查看全部</div>}
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
function PendingClaimCasesTable({
  pagination,
  openDialog
}: {
  pagination?: boolean
  openDialog?: () => void
}) {
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
      title: '案件编号',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '房产名称',
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: '申请人',
      dataIndex: 'user',
      key: 'user'
    },
    {
      title: '上传日期',
      dataIndex: 'createTime',
      key: 'createTime',
      render: text => <div>{dayjs(text).format('YYYY-MM-DD')}</div>
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: () => (
        <div className="h-fit w-fit rounded-2 bg-#EB45451A px-2 py-1 text-xs text-#F87171">
          待认领
        </div>
      )
    },
    {
      title: '操作',
      key: 'status',
      render: () => <div className="clickable">认领初审</div>
    }
  ]
  return (
    <div>
      <div className="fyc justify-between gap-3">
        <div className="text-xl">待认领案件（初审阶段）</div>
        {!pagination && <div onClick={openDialog} className="text-xs text-#E5E7EB clickable">查看全部</div>}
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
function PendingRightConfirmationTable({
  pagination,
  openDialog
}: {
  pagination?: boolean
  openDialog?: () => void
}) {
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
      title: '案件编号',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '房产名称',
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: '评估方',
      dataIndex: 'user',
      key: 'user'
    },
    {
      title: '提交日期',
      dataIndex: 'createTime',
      key: 'createTime',
      render: text => <div>{dayjs(text).format('YYYY-MM-DD')}</div>
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: () => (
        <div className="h-fit w-fit rounded-2 bg-#EB45451A px-2 py-1 text-xs text-#F87171">
          待确权
        </div>
      )
    },
    {
      title: '操作',
      key: 'status',
      render: () => <div className="clickable">签章确权</div>
    }
  ]
  return (
    <div>
      <div className="fyc justify-between gap-3">
        <div className="text-xl">待确权案件（线下确认阶段）</div>
        {!pagination && <div onClick={openDialog} className="text-xs text-#E5E7EB clickable">查看全部</div>}
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
function PendingAuctionExecutionTable({
  pagination,
  openDialog
}: {
  pagination?: boolean
  openDialog?: () => void
}) {
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
      title: '案件编号',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '房产名称',
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: '提交人',
      dataIndex: 'user',
      key: 'user'
    },
    {
      title: '提交日期',
      dataIndex: 'createTime',
      key: 'createTime',
      render: text => <div>{dayjs(text).format('YYYY-MM-DD')}</div>
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <div className={cn('w-fit h-fit px-2 py-1 rounded-2 text-xs ', status === 2 ? 'bg-#EB45451A text-#F87171' : 'bg-#3B7FF51A text-#60A5FA')}>
          {status === 2 ? '待执行' : '执行中'}
        </div>
      )
    },
    {
      title: '操作',
      key: 'status',
      render: status => (
        <div className="fyc gap-3">
          <div className="clickable">
            {
              status === 2 ? '领取任务' : '上传合同'
            }
          </div>
          <div>查看详情</div>
        </div>
      )
    }
  ]
  return (
    <div>
      <div className="fyc justify-between gap-3">
        <div className="text-xl">待执行拍卖案件</div>
        {!pagination && <div onClick={openDialog} className="text-xs text-#E5E7EB clickable">查看全部</div>}
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
function CompletedAuctionTable({
  pagination,
  openDialog
}: {
  pagination?: boolean
  openDialog?: () => void
}) {
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
      title: '案件编号',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '房产名称',
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: '拍卖成交价',
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
      title: '拍卖日期',
      dataIndex: 'createTime',
      key: 'createTime',
      render: text => <div>{dayjs(text).format('YYYY-MM-DD')}</div>
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <div className={cn('w-fit h-fit px-2 py-1 rounded-2 text-xs ', status === 4 ? 'bg-#EB45451A text-#F87171' : 'bg-#3B7FF51A text-#60A5FA')}>
          {status === 4 ? '分配中' : '已完成分配'}
        </div>
      )
    },
    {
      title: '操作',
      key: 'status',
      render: () => <div className="clickable">查看详情</div>
    }
  ]
  return (
    <div>
      <div className="fyc justify-between gap-3">
        <div className="text-xl">已完成拍卖案件</div>
        {!pagination && <div onClick={openDialog} className="text-xs text-#E5E7EB clickable">查看全部</div>}
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

// 展示所有的案件分类全部列表弹窗
function TableAllDialog({
  visible,
  setVisible,
  component: Component,
  title
}: {
  visible: boolean
  setVisible: (visible: boolean) => void
  component: React.ComponentType<any>
  title: string
}) {
  return (
    <CommonDialog
      style={{
        '--common-dialog-body-background': '#0e1014'
      } as any}
      width={1200}
      footer={false}
      closable
      title={title}
      open={visible}
      onCancel={() => setVisible(false)}
    >
      <div className="py-6">
        <Component pagination />
      </div>
    </CommonDialog>
  )
}
