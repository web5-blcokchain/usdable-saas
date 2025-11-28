// import ISeparator from '@/components/common/i-separator
import type { PrivyClientConfig } from '@privy-io/react-auth'
import type { Dispatch, SetStateAction } from 'react'
import { USER_INFO_KEY } from '@/constants/user'
import { usePrivy } from '@privy-io/react-auth'
import { Button, Modal } from 'antd'
import './styles.scss'

export const LoginDialog: FC<{
  openState: [boolean, Dispatch<SetStateAction<boolean>>]
}> = ({
  openState
}) => {
  const { login, authenticated } = usePrivy()
  const { t } = useTranslation()

  const [open, setOpen] = openState
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // 监听认证状态变化，登录成功后关闭对话框
  useEffect(() => {
    if (isLoggingIn && authenticated) {
      setOpen(false)
      setIsLoggingIn(false)
    }
  }, [authenticated, isLoggingIn, setOpen])

  function handlePrivyLogin(method: PrivyClientConfig['loginMethods']) {
    try {
      setIsLoggingIn(true) // 标记正在登录
      login({ loginMethods: method })
    }
    catch (error) {
      setIsLoggingIn(false)
      console.error('Unexpected error during login', error)
    }
  }
  const userLogin = (type: number) => {
    localStorage.setItem(USER_INFO_KEY, 'true')
    switch (type) {
      case 1:
        login({
          loginMethods: ['email']
        })
        return
      case 2:
        handlePrivyLogin(['google'])
    }
  }

  return (
    <Modal
      open={open}
      footer={null}
      width={680}
      maskClosable={false}
      className="login-dialog"
      onCancel={() => setOpen(false)}
    >
      <div className="mx-a max-w-128 w-full py-16">
        <div className="text-center text-8 font-medium">{t('login.login_title')}</div>
        <div className="text-center text-4 text-[#898989]">{t('login.login_content')}</div>

        <div className="fyc flex-col gap-4 py-12 text-center">
          <Button
            type="primary"
            size="large"
            className="w-180px text-black!"
            onClick={() => userLogin(1)}
          >
            <div className="fyc gap-2">
              <div className="i-material-symbols-mail-rounded"></div>
              <div>{t('login.login_with_email')}</div>
            </div>
          </Button>
          <Button
            type="primary"
            size="large"
            className="w-180px text-black!"
            onClick={() => userLogin(2)}
          >
            <div className="fyc gap-2">
              <div className="i-ion-logo-google"></div>
              <div>
                {' '}
                {t('login.sign_in_with_google')}
              </div>
            </div>

          </Button>
        </div>
      </div>
    </Modal>
  )
}
