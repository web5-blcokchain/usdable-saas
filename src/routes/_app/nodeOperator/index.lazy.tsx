import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_app/nodeOperator/')({
  component: RouteComponent
})

function RouteComponent() {
  return <div>Hello "/_app/nodeOperator/"!</div>
}
