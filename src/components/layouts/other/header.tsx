import logo from '@/assets/images/logo.png'
import { Link } from '@tanstack/react-router'
import { Button } from 'antd'

export function OtherHeader() {
  const navList = ['首页', '核心价值', 'RWA 上链流程', '资产上链透明度', '平台优势']
  const [selectNav, setSelectNav] = useState(0)
  const changeSelectNav = (index: number) => {
    setSelectNav(index)
  }

  return (
    <header className="sticky top-0 z-99 w-full fyc justify-between bg-black px-22 py-3" id="other-header">
      <div className="fyc gap-14">
        <img className="h-14" src={logo} alt="" />
        <div className="fcc gap-12 text-base font-400">
          {
            navList.map((item, index) => (
              <div onClick={() => changeSelectNav(index)} key={index} className={cn('clickable', selectNav === index ? 'text-primary' : 'text-white')}>
                {item}
              </div>
            ))
          }
        </div>
      </div>
      <div>
        <Link to="/register">
          <Button className="h-10 b-#00E5FF rounded-1.5 bg-#00E5FF px-4 text-base text-#0A0A0A font-400">开始使用</Button>
        </Link>
      </div>
    </header>
  )
}
