import type { MenuProps } from 'antd'
import logo from '@/assets/images/logo.png'
import { useUserStore } from '@/stores/user'
import { Link, useNavigate } from '@tanstack/react-router'
import { Badge, Button, Dropdown, Menu } from 'antd'

export default function MainHeader() {
  const { userData } = useUserStore()
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const menu = (
    <Menu className="b-1 b-#2D333B b-solid bg-#161B22! p-0!">
      <Menu.Item>
        <Link to="/userInfo">
          <div className="w-40.5 fyc gap-2 py-2 text-sm text-#D1D5DB">
            <div className="i-carbon:user-avatar-filled"></div>
            <div>{t('header.profile')}</div>
          </div>
        </Link>
      </Menu.Item>
      <Menu.Item>
        <div className="w-40.5 fyc gap-2 py-2 text-sm text-#D1D5DB">
          <div className="i-tdesign:setting-1-filled"></div>
          <div>{t('header.accountSettings')}</div>
        </div>
      </Menu.Item>
      {/* 评估方才显示 */}
      <Menu.Item>
        <div onClick={() => navigate({ to: '/evaluation/reportManagement' })} className="w-40.5 fyc gap-2 py-2 text-sm text-#D1D5DB">
          <div className="i-mdi:file"></div>
          <div>{t('header.reportManagement')}</div>
        </div>
      </Menu.Item>
      <Menu.Item className="b-t-1 b-t-#2D333B rounded-t-0!">
        <div className="w-40.5 fyc gap-2 py-2 text-sm text-#FF3A3A">
          <div className="i-ic:outline-logout"></div>
          <div>{t('header.logout')}</div>
        </div>
      </Menu.Item>
    </Menu>
  )

  return (
    <header className="sticky left-0 top-0 z-99 bg-#0c0f13">
      <div className="fyc justify-between px-20 py-3">
        <div className="fyc gap-2">
          {/* TODO 在登录后跳转到自己管理页的首页 */}
          <Link to="/">
            {' '}
            <img className="h-14" src={logo} alt="" />
          </Link>
          {/* <div className='text-4'>
        资产
      </div> */}
        </div>
        <div className="fyc gap-3">
          {
            !userData.id
              ? (
                  <div>
                    <Button className="border-1 border-#00E5FF bg-none text-#00E5FF">
                      {t('header.login')}
                    </Button>
                  </div>
                )
              : (
                  <div className="fyc">
                    <Badge count={5}>
                      <div className="i-mdi:bell text-4.5 text-#9da3ae"></div>
                    </Badge>
                    <Dropdown open={open} onOpenChange={setOpen} overlay={menu}>
                      <div className="ml-4 fyc gap-2">
                        <div className="size-10 overflow-hidden b-2 b-#00E5FF80 rounded-full b-solid">
                          <img className="size-full object-cover" src={(new URL('@/assets/test/test.png', import.meta.url).href)} alt="" />
                        </div>
                        <div className="">User1</div>
                        <div className={cn(
                          'i-mingcute:down-line text-#9ea3ae text-4  transition-all-300',
                          open && 'transform-rotate-180 '
                        )}
                        >
                        </div>
                      </div>
                    </Dropdown>

                  </div>
                )
          }
          <LanguageSelect />
        </div>

      </div>
    </header>
  )
}

function LanguageSelect() {
  const lang = useUserStore(state => state.language)
  const setLang = useUserStore(state => state.setLanguage)

  useEffect(() => {
    const handleLanguageChange = () => {
      setLang(i18n.language)
    }

    // 监听语言变化事件
    i18n.on('languageChanged', handleLanguageChange)

    // 清理事件监听
    return () => {
      i18n.off('languageChanged', handleLanguageChange)
    }
  }, [setLang])

  const items: MenuProps['items'] = [
    {
      label: (
        <div
          onClick={() => {
            setLang('zh')
            i18n.changeLanguage('zh')
          }}
        >
          中文
        </div>
      ),
      key: 'zh'
    },
    {
      label: (
        <div
          onClick={() => {
            setLang('en')
            i18n.changeLanguage('en')
          }}
        >
          English
        </div>
      ),
      key: 'en'
    },
    {
      label: (
        <div
          onClick={() => {
            setLang('jp')
            i18n.changeLanguage('jp')
          }}
        >
          日本語
        </div>
      ),
      key: 'jp'
    }
  ]

  return (
    <Dropdown menu={{ items }} placement="bottomRight">
      <div className="fyc gap-1">
        <div className="i-majesticons-globe-line size-5 bg-white"></div>
        <div className="w-max cursor-pointer text-4 text-white">
          {lang === 'zh' ? '中文' : lang === 'en' ? 'English' : '日本語'}
        </div>
        {/* <div className="i-ic-round-keyboard-arrow-down size-5 bg-white"></div> */}
      </div>
    </Dropdown>
  )
}
