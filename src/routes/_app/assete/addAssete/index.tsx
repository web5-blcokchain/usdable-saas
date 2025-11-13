import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/assete/addAssete/')({
  component: RouteComponent
})

function RouteComponent() {
  const back = () => {
    window.history.back()
  }

  const assetTypeList = [
    {
      icon: (new URL('@/assets/images/compony.png', import.meta.url).href),
      title: '资产',
      content: '住宅、商业地产等不动产',
      status: 1
    },
    {
      icon: (new URL('@/assets/icon/assete/creditor-rights.png', import.meta.url).href),
      title: '债权',
      content: '贷款、债券等债权类资产',
      status: 0
    },
    {
      icon: (new URL('@/assets/icon/assete/box.png', import.meta.url).href),
      title: '商品',
      content: '实物商品、库存等有形资产',
      status: 1
    },
    {
      icon: (new URL('@/assets/icon/assete/line-graph.png', import.meta.url).href),
      title: '基金份额',
      content: '证券投资基金等份额资产',
      status: 0
    }
  ]
  // const [selectedAssetType, setSelectedAssetType] = useState(0)

  return (
    <div className="bg-#000000 px-22 pb-15 pt-8 max-md:px-4">
      <div onClick={back} className="w-fit fcc gap-1 clickable">
        <div className="i-ic:round-arrow-back text-6 text-white"></div>
        <div className="text-2xl">上传新资产</div>
      </div>
      <div className="mt-8 rounded-3 bg-#161B22 p-6">
        <div>选择资产类型</div>
        <div>
          {
            assetTypeList.map((item, index) => (
              <div key={index} className="mt-6 fcc">
                <div className="size-16 fcc rounded-full bg-#0D1117">
                  <img className="h-8" src={item.icon} alt="" />
                </div>
                <div>{item.title}</div>
                <div>{item.content}</div>
                <div>
                  <div></div>
                  <div>已选择</div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}
