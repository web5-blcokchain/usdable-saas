import { createLazyFileRoute } from '@tanstack/react-router'
import './index.lazy.scss'
import { HomeContent } from '@/components/home/homeContent'
import { HomeCoreValue } from '@/components/home/coreValue'
import { HomeChainProcess } from '@/components/home/chainProcess'
import { HomePlatformRole } from '@/components/home/platformRole'
import { HomeChainTransparency } from '@/components/home/chainTransparency'
import { HomePlatformAdvantages } from '@/components/home/platformAdvantages'
import { HomeContentEnd } from '@/components/home/contentEnd'

export const Route = createLazyFileRoute('/_app/')({
  component: RouteComponent
})

function RouteComponent() {


  return (
    <div>
      <HomeContent />
      <div className='[&>div]:px-26 max-md:[&>div]:px-4'>
        {/* 核心价值 */}
        <HomeCoreValue />
        {/* RWA 上链标准流程 */}
        <HomeChainProcess />
        {/* 平台角色 */}
        <HomePlatformRole />
        {/* 资产上链透明度 */}
        <HomeChainTransparency />
        {/* 平台优势 */}
        <HomePlatformAdvantages />
        <HomeContentEnd />
      </div>
    </div>
  )
}
