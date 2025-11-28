import successIcon from '@/assets/images/register/success.png'
import { Button, Modal } from 'antd'
import { useTranslation } from 'react-i18next'

export function RegisterStatus({ visible, setVisible, className, type, back, successButton, errorMessage }:
{
  visible: boolean
  setVisible: (visible: boolean) => void
  className?: string
  type: number
  back: () => void
  successButton: {
    text: string
    onClick: () => void
  }
  errorMessage: string
}) {
  return (
    type === 0
      ? <RegisterLoading visible={visible} className={className} back={back} />
      : type === 1
        ? <RegisterSuccess visible={visible} className={className} back={back} successButton={successButton} />
        : <RegisterError visible={visible} className={className} errorMessage={errorMessage} setVisible={setVisible} />
  )
}

export function RegisterSuccess({ visible, className, back, successButton }:
{ visible: boolean, className?: string, back: () => void, successButton: { text: string, onClick: () => void } }) {
  const { t } = useTranslation()
  return (
    <Modal
      closable={false}
      open={visible}
      onCancel={close}
      maskClosable={false}
      className={cn('login-dialog [&>div>.ant-modal-content]:!bg-#0D1117', className)}
      centered
      footer={() => (<div></div>)}
    >
      <div className="fccc p-4">
        <div className="size-20 fcc b-2 b-#00E5FF rounded-full b-solid">
          <img src={successIcon} className="h-10" alt="" />
        </div>
        <div className="mt-4.5 text-10 text-white font-600 leading-15">{t('register.status.success')}</div>
        <div className="mt-2 text-lg text-#D1D5DB">{t('register.status.accountActivated')}</div>
        <div className="mt-6 fcc gap-2 b b-#00FF85 rounded-9999px b-solid px-4 py-2">
          <div className="i-qlementine-icons:success-16 text-4 text-#00FF85"></div>
          <div className="text-#00FF85">{t('register.status.enterpriseVerified')}</div>
        </div>
        <div className="mt-8 fyc gap-4">
          <Button onClick={back} className="h-13.5 w-45 b-#374151 bg-#000000 text-4 font-600">{t('register.status.backToHome')}</Button>
          <Button className="h-13.5 w-45 b-#00E5FF80 bg-#00E5FF text-4 text-black font-600" onClick={successButton.onClick}>{successButton.text}</Button>
        </div>
      </div>
    </Modal>
  )
}

// TODO 失败窗口什么时候弹出
export function RegisterError({ visible, className, errorMessage, setVisible }: { visible: boolean, className?: string, errorMessage: string, setVisible: (visible: boolean) => void }) {
  const { t } = useTranslation()
  return (
    <Modal
      closable={false}
      open={visible}
      onCancel={close}
      maskClosable={false}
      className={cn('login-dialog [&>div>.ant-modal-content]:!bg-#0D1117', className)}
      centered
      footer={() => (<div></div>)}
    >
      <div className="fccc p-4">
        <div className="size-20 fcc b-2 b-#00E5FF rounded-full b-solid">
          <div className="i-ic:round-warning fcc bg-#00E5FF text-8"></div>
        </div>
        <div className="mt-4.5 text-10 text-white font-600 leading-15">{t('register.status.failed')}</div>
        <div className="mt-2 text-base text-#8B949E">{errorMessage}</div>
        <div className="mt-8 w-full fyc gap-4">
          <Button onClick={() => setVisible(false)} className="h-13.5 w-45 w-full b-#374151 bg-#000000 text-4 font-600">{t('register.status.retry')}</Button>
        </div>
        <div className="mt-7.5 text-center text-base text-#00FF85">
          <span className="clickable">{t('register.status.appeal')}</span>
        </div>

      </div>
    </Modal>
  )
}

// 注册成功但未审核
export function RegisterLoading({ visible, className, back }:
{ visible: boolean, className?: string, back: () => void }) {
  const { t } = useTranslation()
  return (
    <Modal
      closable={false}
      open={visible}
      onCancel={close}
      maskClosable={false}
      className={cn('login-dialog [&>div>.ant-modal-content]:!bg-#0D1117', className)}
      centered
      footer={() => (<div></div>)}
    >
      <div className="fccc p-4">
        <div className="size-20 fcc b-2 b-#00E5FF rounded-full b-solid">
          <img src={successIcon} className="h-10" alt="" />
        </div>
        <div className="mt-4.5 text-10 text-white font-600 leading-15">{t('register.status.success')}</div>
        <div className="mt-2 text-lg text-#D1D5DB">{t('register.status.pending')}</div>
        <div className="mt-8 fyc gap-4">
          <Button onClick={back} className="h-13.5 w-45 b-#374151 bg-#000000 text-4 font-600">{t('register.status.backToHome')}</Button>
        </div>
      </div>
    </Modal>
  )
}
