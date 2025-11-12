import { Button, Modal } from "antd"
import successIcon from '@/assets/images/register/success.png'
import { useTranslation } from 'react-i18next'

export function RegisterStatus({ visible, setVisible, className, type, back, successButton, errorMessage }:
  {
    visible: boolean,
    setVisible: (visible: boolean) => void,
    className?: string,
    type: number,
    back: () => void,
    successButton: {
      text: string,
      onClick: () => void
    },
    errorMessage: string,
  }) {
  return (
    type === 1 ? <RegisterSuccess visible={visible} className={className} back={back} successButton={successButton} /> :
      <RegisterError visible={visible} className={className} errorMessage={errorMessage} setVisible={setVisible} />
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
      <div className="p-4 fccc">
        <div className="size-20 b-2 b-solid b-#00E5FF fcc rounded-full ">
          <img src={successIcon} className="h-10" alt="" />
        </div>
        <div className="mt-4.5 text-10 leading-15 text-white font-600">{t('register.status.success')}</div>
        <div className="text-lg mt-2 text-#D1D5DB">{t('register.status.accountActivated')}</div>
        <div className="mt-6 b b-solid b-#00FF85 rounded-9999px px-4 py-2 gap-2 fcc">
          <div className="i-qlementine-icons:success-16 text-4 text-#00FF85 "></div>
          <div className="text-#00FF85">{t('register.status.enterpriseVerified')}</div>
        </div>
        <div className="fyc gap-4 mt-8 ">
          <Button onClick={back} className="bg-#000000 b-#374151 w-45 h-13.5 text-4 font-600" >{t('register.status.backToHome')}</Button>
          <Button className="bg-#00E5FF b-#00E5FF80 text-black w-45 h-13.5 text-4 font-600" onClick={successButton.onClick}>{successButton.text}</Button>
        </div>
      </div>
    </Modal>
  )
}


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
      <div className="p-4 fccc">
        <div className="size-20 b-2 b-solid b-#00E5FF fcc rounded-full ">
          <div className="i-ic:round-warning bg-#00E5FF text-8 fcc" ></div>
        </div>
        <div className="mt-4.5 text-10 leading-15 text-white font-600">{t('register.status.failed')}</div>
        <div className="text-base mt-2 text-#8B949E">{errorMessage}</div>
        <div className="fyc gap-4 mt-8 w-full">
          <Button onClick={() => setVisible(false)} className="w-full bg-#000000 b-#374151 w-45 h-13.5 text-4 font-600" >{t('register.status.retry')}</Button>
        </div>
        <div className="text-center text-#00FF85 text-base mt-7.5">
          <span className="clickable">{t('register.status.appeal')}</span>
        </div>

      </div>
    </Modal>
  )
}
