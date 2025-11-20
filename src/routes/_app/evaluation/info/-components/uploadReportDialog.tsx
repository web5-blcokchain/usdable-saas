import { CommonDialog } from '@/components/common/dialog/common'
import UploadMultifileCard from '@/components/common/upload/uploa-multifile-card'
import { formatNumberNoRound } from '@/utils/number'
import { cn } from '@/utils/style'
import { Button, DatePicker, Form, Input, InputNumber, Modal, Select } from 'antd'
import { useForm, useWatch } from 'antd/es/form/Form'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import './uploadReportDialog.scss'

export function UploadReportDialog({
  visible,
  setVisible,
  data
}: {
  visible: boolean
  setVisible: (visible: boolean) => void
  data: any
}) {
  const { t } = useTranslation()
  const [formData] = useForm()

  useEffect(() => {
  }, [data])

  const evaluationMethodList = [
    { value: '1', label: t('evaluation.info.uploadReportDialog.methodOptions.method1') },
    { value: '2', label: t('evaluation.info.uploadReportDialog.methodOptions.method2') },
    { value: '3', label: t('evaluation.info.uploadReportDialog.methodOptions.method3') }
  ]

  const watchedValue = useWatch('evaluationPrice', formData)
  const closeDialog = () => {
    setVisible(false)
    // 清除表单内容
    formData.resetFields()
  }

  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false)
  const handleConfirm = () => {
    setVisible(false)
    setTimeout(() => {
      setConfirmDialogVisible(true)
    }, 300)
  }

  return (
    <div>
      <CommonDialog
        open={visible}
        onCancel={() => closeDialog()}
        maskClosable={false}
        width={894}
        className={cn('login-dialog [&>div>.ant-modal-content]:!bg-#171b21 b-1 b-solid  b-#1E293B', 'rounded-2 ')}
        centered
        closable
        title={(
          <div className=" ">
            <div className="text-600 text-xl">{t('evaluation.info.uploadReportDialog.title')}</div>
            <div className="mt-1.5 text-base text-#9CA3AF">
              {t('evaluation.info.assetNumber')}
              ：PROP-2023-0589 |
              {t('evaluation.info.uploadReportDialog.propertyName')}
              ：上海花家地
            </div>
          </div>
        )}
        footer={false}
      >
        <div className="upload-report-form mt-7">
          <Form onFinish={handleConfirm} form={formData} className="space-y-4" layout="vertical">
            <div className="grid cols-2 gap-x-4">
              <Form.Item label={t('evaluation.info.uploadReportDialog.appraiserName')} name="appraiserName">
                <Input className="w-full" placeholder={t('evaluation.info.uploadReportDialog.appraiserNamePlaceholder')} />
              </Form.Item>
              <Form.Item label={t('evaluation.info.uploadReportDialog.evaluationAgency')} name="evaluationAgency">
                <Input className="w-full" placeholder={t('evaluation.info.uploadReportDialog.evaluationAgencyPlaceholder')} />
              </Form.Item>
              <Form.Item label={t('evaluation.info.uploadReportDialog.evaluationDate')} name="evaluationData">
                <DatePicker placeholder={t('evaluation.info.uploadReportDialog.evaluationDatePlaceholder')} />
              </Form.Item>
              <Form.Item label={t('evaluation.info.uploadReportDialog.evaluationMethod')} name="evaluationMethod">
                <Select options={evaluationMethodList} placeholder={t('evaluation.info.uploadReportDialog.evaluationMethodPlaceholder')} />
              </Form.Item>
              <Form.Item label={t('evaluation.info.uploadReportDialog.evaluationPrice')} name="evaluationPrice">
                <InputNumber controls={false} className="w-full" addonAfter={`≈$${!watchedValue ? 0 : formatNumberNoRound(watchedValue * 10000, 6, 0)}`} placeholder={t('evaluation.info.uploadReportDialog.evaluationPricePlaceholder')} />
              </Form.Item>
            </div>
            <Form.Item label={t('evaluation.info.uploadReportDialog.evaluationConclusion')} name="evaluationConclusion">
              <Input.TextArea className="w-full" rows={5} style={{ resize: 'none' }} placeholder={t('evaluation.info.uploadReportDialog.evaluationConclusionPlaceholder')} />
            </Form.Item>
            <Form.Item label={t('evaluation.info.uploadReportDialog.uploadReportFile')} name="evaluationConclusion">
              <div>
                <div className="mt-2 text-sm text-#8B949E">{t('evaluation.info.uploadReportDialog.fileSupport')}</div>
                <div className="file-card-full mt-4">
                  <UploadMultifileCard
                    className={cn(
                      'flex gap-3 [&>div>div>div>div]:b-2 [&>div>div>div>div]:b-#30363D'
                    )}
                    fileType="image/png,image/jpg"
                    fileUrl={[]}
                    maxLength={1}
                    width="100%"
                    height="auto"
                    // loading={uploadFileLoading}
                    removeFile={(_index) => {
                    // setFileUrl(fileUrl.filter((_, i) => i !== index))
                    }}
                    beforeUpload={(_file) => {
                    // beforeUpload(file)
                    }}
                  >
                    <div className="py-3">
                      <div className="fcc pb-2">
                        <img className="h-8" src={new URL('@/assets/images/register/cloud.png', import.meta.url).href} alt="" />
                      </div>
                      <div className="mt3 w-full overflow-hidden text-center text-base text-#9CA3AF">{t('evaluation.info.uploadReportDialog.dragHere')}</div>
                      <div className="mt-1 w-full overflow-hidden text-center text-base text-#00E5FF">{t('evaluation.info.uploadReportDialog.clickUpload')}</div>
                    </div>
                  </UploadMultifileCard>
                </div>

              </div>
            </Form.Item>
            <Form.Item>
              <div className="mt-15 fyc justify-end gap-3 pb-30 [&>button]:h-10.5 [&>button]:px-5 [&>button]:text-base">
                <Button onClick={closeDialog} className="b-#30363D bg-transparent">{t('evaluation.info.uploadReportDialog.cancel')}</Button>
                <Button className="b-#00E5FF bg-transparent text-#00E5FF">{t('evaluation.info.uploadReportDialog.saveDraft')}</Button>
                <Button htmlType="submit" className="b-#00E5FF bg-#00E5FF text-black">{t('evaluation.info.uploadReportDialog.submitReport')}</Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </CommonDialog>
      <Modal
        open={confirmDialogVisible}
        onCancel={() => setConfirmDialogVisible(false)}
        maskClosable={false}
        width={446}
        className={cn('login-dialog [&>div>.ant-modal-content]:!bg-#171b21 b-1 b-solid  b-#1E293B', 'rounded-2 ')}
        centered
        closable={false}
        title={(
          <div className="text-lg font-600">
            {t('evaluation.info.uploadReportDialog.confirmSubmitTitle')}
          </div>
        )}
        footer={(
          <div className="fyc justify-end gap-3">
            <Button
              onClick={() => {
                setConfirmDialogVisible(false)
                setTimeout(() => {
                  setVisible(true)
                }, 300)
              }}
              className="b-#30363D bg-transparent"
            >
              {t('evaluation.info.uploadReportDialog.confirmCancel')}
            </Button>
            <Button onClick={() => setConfirmDialogVisible(false)} className="b-#00E5FF bg-#00E5FF text-black">{t('evaluation.info.uploadReportDialog.confirmSubmit')}</Button>
          </div>
        )}
      >
        <div>{t('evaluation.info.uploadReportDialog.confirmSubmitDesc')}</div>
      </Modal>
    </div>
  )
}
