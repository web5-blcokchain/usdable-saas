import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_app/lawyerWorkbench/')({
  component: RouteComponent
})

function RouteComponent() {
  return <div>Hello "/_app/lawyerWorkbench/"!</div>
}
