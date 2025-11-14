import { createLazyFileRoute } from '@tanstack/react-router'
import { Alert } from 'antd'

export const Route = createLazyFileRoute('/_app/assete/info/$id')({
  component: RouteComponent
})

function RouteComponent() {
  return (
    <div className="px-22 py-8 max-md:px-4">
      <div>
        <Alert
          icon={<div></div>}
          message="Warning"
          description="This is a warning notice about copywriting."
          type="warning"
          showIcon
          closable
        />
      </div>
    </div>
  )
}
