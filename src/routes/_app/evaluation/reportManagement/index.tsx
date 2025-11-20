import { createFileRoute } from '@tanstack/react-router'
import { Button, Input } from 'antd'

export const Route = createFileRoute('/_app/evaluation/reportManagement/')({
  component: RouteComponent
})

function RouteComponent() {
  return (
    <div className="px-22 py-13 text-base max-md:px-4">
      <div className="fyc justify-between gap-4">
        <div>
          <div className="text-8 font-600">报告管理</div>
          <div className="mt-2 text-#9CA3AF">可追溯的报告管理与历史记录</div>
        </div>
        <Button className="text-blac h-10.5 b-#00E5FF bg-#00E5FF px-6 font-600">上传报告</Button>
      </div>
      <Input
        placeholder="搜索报告编号、资产名称"
        addonBefore={
          <div className="i-weui:search-filled text-6 text-#9ea3ae"></div>
        }
      />
    </div>
  )
}
