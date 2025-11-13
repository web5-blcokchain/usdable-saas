import type { MenuProps } from 'antd'
import logo from '@/assets/images/logo.png'
import { useUserStore } from '@/stores/user'
import { Link } from '@tanstack/react-router'
import { Button, Dropdown } from 'antd'

export default function MainHeader() {
  const { userData } = useUserStore()
  const { t } = useTranslation()

  return (
    <header className="sticky left-0 top-0 z-99 bg-#0c0f13">
      <div className="fyc justify-between px-10 py-6">
        <div className="fyc gap-2">
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
                  <div>已登录</div>
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
