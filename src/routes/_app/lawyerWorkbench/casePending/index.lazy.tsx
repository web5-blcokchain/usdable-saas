import type { ColumnsType } from 'antd/es/table'
import { CommonTable } from '@/components/common/common-table'
import { createLazyFileRoute, Link } from '@tanstack/react-router'
import { Tag } from 'antd'
import dayjs from 'dayjs'

export const Route = createLazyFileRoute('/_app/lawyerWorkbench/casePending/')({
  component: RouteComponent
})

function RouteComponent() {
  const pageInfo = {
    pageSize: 10,
    total: 100
  }
  const data = [
    {
      id: '1',
      caseNo: '#CASE2025-0234',
      name: '上海花园苑二区',
      address: '浦东新区 · 张江高科技园区',
      step: '第二步',
      stepDesc: '窗口递交',
      status: '无申请',
      statusColor: '#5c677d',
      updateTime: '2025-03-15 14:30'
    },
    {
      id: '2',
      caseNo: '#CASE2025-0235',
      name: '广州珠江新城',
      address: '天河区 · 沾村街道',
      step: '第一步',
      stepDesc: '材料准备',
      status: '已驳回',
      statusColor: 'red',
      updateTime: '2025-03-14 09:15'
    },
    {
      id: '3',
      caseNo: '#CASE2025-0233',
      name: '北京朝阳区 CBD',
      address: '朝阳区 · 国贸中心',
      step: '第三步',
      stepDesc: '审核中',
      status: '处理中',
      statusColor: 'orange',
      updateTime: '2025-03-12 16:45'
    },
    {
      id: '4',
      caseNo: '#CASE2025-0232',
      name: '深圳南山科技园',
      address: '南山区 · 粤海街道',
      step: '第五步',
      stepDesc: '终审',
      status: '已通过',
      statusColor: 'green',
      updateTime: '2025-03-10 11:20'
    },
    {
      id: '5',
      caseNo: '#CASE2025-0231',
      name: '杭州西湖区',
      address: '西湖区 · 灵隐街道',
      step: '第二步',
      stepDesc: '窗口递交',
      status: '无申请',
      statusColor: '#5c677d',
      updateTime: '2025-03-08 09:05'
    }
  ]
  const columns: ColumnsType<(typeof data)[0]> = [
    {
      title: '案件编号',
      dataIndex: 'caseNo',
      key: 'caseNo',
      render: (text: string) => <span className="text-400 text-base">{text}</span>
    },
    {
      title: '房产地址',
      key: 'address',
      render: (_: any, record) => (
        <div>
          <div className="text-400 text-base">{record.name}</div>
          <div className="text-xs text-#8B949E font-400">{record.address}</div>
        </div>
      )
    },
    {
      title: '当前步骤',
      key: 'step',
      render: (_: any, record) => (
        <div>
          <span className="text-#09B2E9 font-600">
            {record.step}
          </span>
          <span className="text-#8B949E"> | </span>
          <span className="text-white">{record.stepDesc}</span>
        </div>
      )
    },
    {
      title: '申请状态',
      key: 'status',
      render: (_: any, record) => (
        <Tag
          color={record.statusColor}
          className="h-fit w-fit rounded-2 px-2 py-1 text-xs font-600"
        >
          {record.status}
        </Tag>
      )
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      render: (text: string) => <div className="text-sm text-#8B949E font-400">{dayjs(text).format('YYYY-MM-DD HH:mm')}</div>
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Link to="/lawyerWorkbench/casePending/info/$id" params={{ id: '1' }} className="text-sm text-primary">进入处理</Link>
      )
    }
  ]

  return (
    <div className="px-22 py-13">
      <div className="text-8 font600">案件待办</div>
      <div className="mt-1 text-base text-#8B949E font-400">
        管理您负责的所有法律案件进度和详情
      </div>
      <div className="mt-7">
        <CommonTable
          data={data}
          columns={columns}
          className="mt-4 overflow-hidden b-t-0 rounded-b-2 text-#E5E7EB"
          pagination={pageInfo}
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
