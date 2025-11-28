import { OtherFooter } from './footer'
import { OtherHeader } from './header'

export const OtherLayout: FC = ({
  children
}) => {
  return (
    <>
      <OtherHeader />
      <div className="min-h-100vh w-full overflow-hidden" id="other-layout">
        {children}
      </div>
      <OtherFooter />
    </>
  )
}
