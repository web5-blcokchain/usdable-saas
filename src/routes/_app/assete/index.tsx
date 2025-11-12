import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/assete/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/assete/"!</div>
}
