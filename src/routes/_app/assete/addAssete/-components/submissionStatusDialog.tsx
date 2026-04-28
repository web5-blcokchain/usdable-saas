import { useNavigate } from '@tanstack/react-router'
import { Button, Modal } from 'antd'
import { useTranslation } from 'react-i18next'

export function SubmissionStatusStatus({
  visible,
  setVisible,
  type,
  asseteInfo,
  errorMessage
}: {
  visible: boolean
  setVisible: (visible: boolean) => void
  type: number
  asseteInfo: { code: string, createTime: string }
  errorMessage?: string
}) {
  return type
    ? (
        <SuccessDialog
          setVisible={setVisible}
          visible={visible}
          asseteId={asseteInfo.code}
          createTime={asseteInfo.createTime}
        />
      )
    : (
        <ErrorDialog
          setVisible={setVisible}
          visible={visible}
          asseteId={asseteInfo.code}
          createTime={asseteInfo.createTime}
          errorMessage={errorMessage || ''}
        />
      )
}

export function SuccessDialog({
  visible,
  setVisible,
  asseteId,
  createTime
}: {
  visible: boolean
  setVisible: (visible: boolean) => void
  asseteId: string
  createTime: string
}) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const close = useCallback(() => {
    setVisible(false)
    navigate({ to: '/assete' })
  }, [setVisible])

  return (
    <Modal
      closable={false}
      open={visible}
      onCancel={() => setVisible(false)}
      maskClosable={false}
      width={420}
      title={(
        <div className="flex justify-end">
          <div
            onClick={close}
            className="i-material-symbols:close-rounded cursor-pointer text-6 text-white"
          >
          </div>
        </div>
      )}
      className={cn('login-dialog [&>div>.ant-modal-content]:!bg-#0D1117')}
      centered
      footer={() => <div></div>}
    >
      <div className="w-full fccc">
        <div className="size-24 fcc b-1 b-#00FF85 rounded-full b-solid bg-#00FF891A">
          <div className="i-lucide:check text-10 text-#00FF85"></div>
        </div>
        <div className="mt-4.5 text-center text-10 leading-15">
          {t('assete.addAsset.success.title')}
        </div>
        <div className="mt-2 text-center text-sm text-#D1D5DB">
          {t('assete.addAsset.success.description')}
        </div>
        <div className="mt-8 w-full b-1 b-#00E6FF33 rounded-2 b-solid bg-#00000080 p-6 text-base text-#9CA3AF">
          <div className="fyc justify-between gap-2">
            <div>{t('assete.addAsset.assetCode')}</div>
            <div className="flex-1 truncate text-right text-#00E5FF font-bold">
              {asseteId}
            </div>
          </div>
          <div className="mt-4 fyc justify-between gap-2">
            <div>{t('assete.addAsset.submitTime')}</div>
            <div className="flex-1 truncate text-right text-white">
              {' '}
              {createTime}
            </div>
          </div>
        </div>
        <Button
          onClick={close}
          className="mt-8 h-12.5 w-full b-#FFFFFF4D text-base"
        >
          {t('assete.addAsset.backToHome')}
        </Button>
      </div>
    </Modal>
  )
}

export function ErrorDialog({
  visible,
  setVisible,
  asseteId,
  createTime,
  errorMessage
}: {
  visible: boolean
  setVisible: (visible: boolean) => void
  asseteId: string
  createTime: string
  errorMessage: string
}) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const close = useCallback(() => {
    setVisible(false)
    navigate({ to: '/assete' })
  }, [setVisible])

  return (
    <Modal
      closable={false}
      open={visible}
      onCancel={() => setVisible(false)}
      maskClosable={false}
      width={420}
      title={(
        <div className="flex justify-end">
          <div
            onClick={close}
            className="i-material-symbols:close-rounded cursor-pointer text-6 text-white"
          >
          </div>
        </div>
      )}
      className={cn('login-dialog [&>div>.ant-modal-content]:!bg-#0D1117')}
      centered
      footer={() => <div></div>}
    >
      <div className="w-full fccc">
        <div className="size-24 fcc b-1 b-#FF3A3A rounded-full b-solid">
          <div className="i-mingcute:close-fill text-10 text-#FF3A3A"></div>
        </div>
        <div className="mt-4.5 text-center text-10 leading-15">
          {t('assete.addAsset.error.title')}
        </div>
        <div className="mt-2 text-center text-sm text-#D1D5DB">
          {errorMessage}
        </div>
        <div className="mt-8 w-full b-1 b-#00E6FF33 rounded-2 b-solid bg-#00000080 p-6 text-base text-#9CA3AF">
          <div className="fyc justify-between gap-2">
            <div>{t('assete.addAsset.assetCode')}</div>
            <div className="flex-1 truncate text-right text-#00E5FF font-bold">
              {asseteId}
            </div>
          </div>
          <div className="mt-4 fyc justify-between gap-2">
            <div>{t('assete.addAsset.submitTime')}</div>
            <div className="flex-1 truncate text-right text-white">
              {' '}
              {createTime}
            </div>
          </div>
        </div>
        <Button
          onClick={() => {
            setVisible(false)
            navigate({ to: '/assete' })
          }}
          className="mt-8 h-12.5 w-full b-#00E5FF bg-#00E2FF1A text-base text-#00E5FF"
        >
          {t('assete.addAsset.error.viewDetails')}
        </Button>
        <Button
          onClick={() => {
            setVisible(false)
            navigate({ to: '/assete' })
          }}
          className="mt-4 h-12.5 w-full b-#FFFFFF4D text-base"
        >
          {t('assete.addAsset.backToHome')}
        </Button>
      </div>
    </Modal>
  )
}
