import { createLazyFileRoute } from '@tanstack/react-router'
import { Button } from 'antd'

export const Route = createLazyFileRoute('/_app/userInfo/')({
  component: RouteComponent
})

function RouteComponent() {
  const back = () => {
    window.history.back()
  }
  return (
    <div className="px-22 py-8 text-white">
      <div className="fyc justify-between">
        <div>
          <div className="text-10 font-600">个人资料</div>
          <div className="text-base text-#9CA3AF font-400">编辑您的个人信息和偏好设置</div>
        </div>
        <div>
          <Button className="b-#2D333B bg-#1E2328 text-sm" onClick={back}>返回</Button>
          <Button className="b-#2D333B bg-#1E2328 text-sm text-#E5E7EB">保存修改</Button>
        </div>
      </div>
      <div className="mt-8 rounded-3 bg-#0D1117 p-6">

      </div>
    </div>
  )
}
