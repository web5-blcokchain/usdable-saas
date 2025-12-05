import type { MenuProps } from 'antd'
import apiMyInfoApi from '@/api/apiMyInfoApi'
import logo from '@/assets/images/logo.png'
import { LoginDialog } from '@/components/dialog/login'
import { USER_INFO_KEY } from '@/constants/user'
import { USER_AUDIT_STATUS, USER_TYPE } from '@/enum/user'
import { UserCode } from '@/enums/user'
import { eventBus } from '@/hooks/EventBus'
import { useMessageStore } from '@/stores/message'
import { useUserStore } from '@/stores/user'
import { showToastOnce } from '@/utils/toast'
import { clearToken, getToken, setToken } from '@/utils/user'
import { usePrivy, useUser } from '@privy-io/react-auth'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { Badge, Button, Dropdown, Menu } from 'antd'

export default function MainHeader() {
  const { userData } = useUserStore()
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { authenticated, user, getAccessToken, logout } = usePrivy()

  // 用户登出
  async function handleLogout(isShowToast?: boolean) {
    logout().finally(() => {
      clearUserData()
      clearToken()
      clearRegisterData()
      setCode(UserCode.NotExist)
      isShowToast && toast.success(t('common.logoutSuccess'))
      setTimeout(() => {
        navigate({
          to: '/register'
        })
      }, 100)
    })
  }
  const menuList: MenuProps['items'] = useMemo(() => {
    return [
      {
        key: 'profile',
        icon: <div className="i-carbon:user-avatar-filled text-#D1D5DB"></div>,
        label: (
          <div className="w-40.5 fyc gap-2 py-2 text-sm text-#D1D5DB">
            <div>{t('header.profile')}</div>
          </div>
        ),
        onClick: () => {
          navigate({
            to: '/user/info'
          })
        }
      },
      {
        key: 'setting',
        icon: <div className="i-tdesign:setting-1-filled text-#D1D5DB"></div>,
        label: (
          <div className="w-40.5 fyc gap-2 py-2 text-sm text-#D1D5DB">
            <div>{t('header.accountSettings')}</div>
          </div>
        ),
        onClick: () => {
          navigate({
            to: '/user/setting'
          })
        }
      },
      {
        key: 'report',
        icon: <div className="i-mdi:file text-#D1D5DB"></div>,
        label: (
          <div className="w-40.5 fyc gap-2 py-2 text-sm text-#D1D5DB">
            <div>{t('header.reportManagement')}</div>
          </div>
        ),
        onClick: () => {
          navigate({
            to: '/evaluation/reportManagement'
          })
        }
      },
      {
        key: 'case',
        icon: <div className="i-ix:work-case-filled text-#D1D5DB"></div>,
        label: (
          <div className="w-40.5 fyc gap-2 py-2 text-sm text-#D1D5DB">
            <div>{t('header.case')}</div>
          </div>
        ),
        onClick: () => {
          navigate({
            to: '/lawyerWorkbench/casePending'
          })
        }
      },
      {
        key: 'logout',
        icon: <div className="i-ic:outline-logout text-#FF3A3A"></div>,
        label: (
          <div className="w-40.5 fyc gap-2 py-2 text-sm text-#FF3A3A">
            <div>{t('header.logout')}</div>
          </div>
        ),
        onClick: () => {
          handleLogout(true)
        }
      }
    ].filter(item =>
      item.key === 'report'
        ? userData?.user?.type === USER_TYPE.ASSESS
        : item.key === 'case'
          ? userData?.user?.type === USER_TYPE.LAWYER
          : true
    )
  }, [userData])

  const [logoutLoading, setLogoutLoading] = useState(false)
  const {
    clearUserData,
    refreshUserInfo,
    setCode,
    setUserData,
    getUserInfo,
    clearRegisterData
  } = useUserStore()
  const [openLoginDialog, setOpenLoginDialog] = useState(false)
  const isFirst = useRef(true)

  const [errorList, setErrorList] = useState<any[]>([])
  // 获取用户信息
  const { mutateAsync, isPending: isLoading } = useMutation({
    mutationKey: ['getUserInfo'],
    gcTime: 2000,
    mutationFn: async () => {
      const res = await apiMyInfoApi.getUserInfo()
      const code = _get(res, 'code')
      setCode(code)
      const data = res?.data || {}
      setUserData(data)
      isFirst.current = false
      const hasLogin = !localStorage.getItem(USER_INFO_KEY)
        ? false
        : JSON.parse(localStorage.getItem(USER_INFO_KEY) || '')
      if (hasLogin) {
        //  查看是否是用户在点击登陆之后获取的用户信息，是=》记录登陆日志
        localStorage.setItem(USER_INFO_KEY, 'false')
      }
      // 判断用户是否注册
      const hasError = errorList.some(
        item =>
          item.message === t('login.register_message')
          && item.time > Date.now() - 5000
      )
      if (
        (res?.code !== 1
          || res.data?.user?.audit_status !== USER_AUDIT_STATUS.PASS)
        && !hasError
      ) {
        toast.warning(t('login.register_message'))
        navigate({ to: '/register' })
      }
      if (hasError) {
        setErrorList((pre) => {
          return pre.map((item) => {
            if (
              item.message === t('login.register_message')
              && item.time > Date.now() - 5000
            ) {
              return { ...item, time: Date.now() }
            }
            else {
              return item
            }
          })
        })
      }
      else {
        setErrorList(pre => [
          ...pre,
          { message: t('login.register_message'), time: Date.now() }
        ])
      }
      return data
    }
  })

  // 仅在使用组件登录的时候，登出函数
  const noAuthenticatedHandleLogout = () => {
    setLogoutLoading(true)
    logout().then(() => {
      setLogoutLoading(false)
      navigate({
        to: '/register'
      })
    })
  }

  useEffect(() => {
    // 监听是否需要重新获取用户信息
    if (refreshUserInfo > 0) {
      mutateAsync()
    }
  }, [refreshUserInfo])

  function parseJwt(token: string) {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')

    const decoded = Buffer.from(base64, 'base64').toString('utf-8')
    return JSON.parse(decoded)
  }
  // 判断token是否过期
  function isTokenExpired(token: string) {
    const { exp } = parseJwt(token)
    const now = Math.floor(Date.now() / 1000)
    return now > exp
  }

  // 监听用户信息变化，用户是否登录成功
  useEffect(() => {
    if (!authenticated)
      return

    Promise.all([
      mutateAsync(),
      getAccessToken().then((token) => {
        if (!token)
          return
        setToken(token, 2)
      })
    ]).then(() => {
      if (openLoginDialog) {
        setOpenLoginDialog(false)
      }
    })
  }, [authenticated, user, mutateAsync])

  const { refreshUser } = useUser()

  const lastCheckTime = useRef(0)
  // 监测用户token是否过期
  const checkToken = async () => {
    try {
      const token = getToken()
      // 判断token是否过期，并且该函数在5s只触发一次
      if (
        (!token || isTokenExpired(token))
        && Date.now() - lastCheckTime.current > 5000
      ) {
        lastCheckTime.current = Date.now()
        await refreshUser()
        const newToken = await getAccessToken()
        if (newToken) {
          // 获取新token，成功刷新用户信息
          await getUserInfo()
          setToken(newToken, 2)
        }
        else {
          // 获取失败退出登陆
          handleLogout()
          showToastOnce(t('common.token_expired'), 'warning')
        }
      }
      else if (!token) {
        handleLogout()
        showToastOnce(t('common.token_expired'), 'warning')
      }
    }
    catch (error) {
      console.log('获取token失败', error)
      // 重新获取token失败，重新登录
      handleLogout()
      showToastOnce(t('common.token_expired'), 'warning')
    }
  }
  useEffect(() => {
    // 全局事件总线监听token失效
    eventBus.on('tokenExpired', checkToken)
  }, [])

  const linkIdentityHome = useMemo(() => {
    const isRegister
      = !!userData?.user?.id
        && userData?.user?.audit_status === USER_AUDIT_STATUS.PASS
    if (!isRegister)
      return '/register'
    switch (userData?.user?.type) {
      case USER_TYPE.ASSET:
        return '/assete'
      case USER_TYPE.ASSESS:
        return '/evaluation'
      case USER_TYPE.LAWYER:
        return '/lawyerWorkbench'
      default:
        return '/register'
    }
  }, [userData])

  const { unReadCount, getUnReadMessageCount } = useMessageStore()
  useEffect(() => {
    getUnReadMessageCount()
  }, [getUnReadMessageCount])

  return (
    <header className="sticky left-0 top-0 z-99 bg-#0c0f13">
      <div className="fyc justify-between px-22 py-3">
        <div className="fyc gap-2">
          <Link to={linkIdentityHome}>
            {' '}
            <img className="h-14" src={logo} alt="" />
          </Link>
        </div>
        <div className="fyc gap-3">
          <Waiting for={!isLoading}>
            {!userData?.user?.id
              ? (
                  !authenticated && (
                    <LoginButton
                      isLoading={isLoading}
                      setOpenLoginDialog={setOpenLoginDialog}
                    />
                  )
                )
              : (
                  <div className="fyc">
                    <Link to="/user/message">
                      <Badge count={unReadCount}>
                        <div className="i-mdi:bell text-4.5 text-#9da3ae"></div>
                      </Badge>
                    </Link>
                    <Dropdown
                      open={open}
                      onOpenChange={setOpen}
                      dropdownRender={() => (
                        <Menu
                          className="b-1 b-#2D333B b-solid bg-#161B22! p-0!"
                          items={menuList}
                        >
                        </Menu>
                      )}
                    >
                      <div className="ml-4 fyc gap-2">
                        <div className="size-10 overflow-hidden b-2 b-#00E5FF80 rounded-full b-solid">
                          <img
                            className="size-full object-cover"
                            src={
                              userData?.user?.avatar
                              || new URL('@/assets/test/avatar.png', import.meta.url)
                                .href
                            }
                            alt=""
                          />
                        </div>
                        <div className="">{userData?.user?.nickname ?? 'User'}</div>
                        <div
                          className={cn(
                            'i-mingcute:down-line text-#9ea3ae text-4  transition-all-300',
                            open && 'transform-rotate-180 '
                          )}
                        >
                        </div>
                      </div>
                    </Dropdown>
                  </div>
                )}
            {authenticated && !userData?.user?.id && (
              <Button
                loading={logoutLoading}
                className="border-1 border-#00E5FF bg-primary bg-none text-black"
                onClick={noAuthenticatedHandleLogout}
              >
                {t('header.logout')}
              </Button>
            )}
          </Waiting>
          <LanguageSelect />
        </div>
      </div>
      {/* 登录弹窗 */}
      <LoginDialog openState={[openLoginDialog, setOpenLoginDialog]} />
    </header>
  )
}

/**
 * 多语言选择
 * @returns {JSX.Element}
 */
export function LanguageSelect() {
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

function LoginButton({
  isLoading,
  setOpenLoginDialog
}: {
  isLoading: boolean
  setOpenLoginDialog: (open: boolean) => void
}) {
  const { ready } = usePrivy()
  const { t } = useTranslation()

  return (
    <>
      <Waiting for={ready}>
        <Button
          loading={isLoading}
          onClick={() => setOpenLoginDialog(true)}
          className="border-1 border-#00E5FF bg-none text-#00E5FF"
        >
          {t('header.login')}
        </Button>
      </Waiting>
    </>
  )
}
