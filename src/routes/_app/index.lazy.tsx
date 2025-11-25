import { createLazyFileRoute } from '@tanstack/react-router'
import { Button } from 'antd'
import './index.lazy.scss'

export const Route = createLazyFileRoute('/_app/')({
  component: RouteComponent
})

function RouteComponent() {
  const [headerHeight, setHeaderHeight] = useState(0)
  useEffect(() => {
    const header = document.getElementById('other-header')
    if (header) {
      setHeaderHeight(header.offsetHeight)
    }
  }, [])

  return (
    <div
      style={{ minHeight: `calc(100vh - ${headerHeight}px)` }}
      className="main-content fccc bg-transparent text-white"
    >
      <div className="text-center text-20 font-600 leading-25">
        <div>让每一套房产，都能在</div>
        <div className="text-primary">链上拥有可信的身份</div>
      </div>
      <div className="mt-8 text-center text-7.5 font-400">
        从资产上传、法律审核、评估确权到节点上链、投资人认购与分红，
        <br />
        RWA 全流程在一个平台里完成。
      </div>
      <div className="mt-8 fcc gap-4">
        <Button className="h-12.5 min-w-38 b-primary bg-primary px-8 text-base text-black font-600">开始上链</Button>
        <Button className="h-12.5 min-w-38 b-primary bg-transparent px-8 text-base text-primary font-600">了解更多</Button>
      </div>
    </div>
  )
}
