import type { AssetInfo } from '@/api/assetsApi'
import type {
  SubmitReportModel
} from '@/api/evaluationApi'
import type { Dayjs } from 'dayjs'
import { uploadFile } from '@/api/common'
import {
  getAssessmentMethod,
  getReportDetail,
  submitReport
} from '@/api/evaluationApi'
import { CommonDialog } from '@/components/common/dialog/common'
import UploadMultifileCard from '@/components/common/upload/uploa-multifile-card'
import { FileContent } from '@/routes/_app/assete/addAssete/-components/addAsseteSecond'
import { formatNumberNoRound } from '@/utils/number'
import { cn } from '@/utils/style'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import {
  Button,
  DatePicker,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Select,
  Spin
} from 'antd'
import { useForm, useWatch } from 'antd/es/form/Form'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import './uploadReportDialog.scss'

export function UploadReportDialog({
  visible,
  setVisible,
  data
}: {
  visible: boolean
  setVisible: (visible: boolean) => void
  data: AssetInfo
}) {
  const { t, i18n } = useTranslation()
  const [formData] = useForm()
  const report_files = useWatch<string[]>('report_file_urls', formData)
  const [errorFormItem, setErrorFormItem] = useState<string[]>([])
  const navigate = useNavigate()
  // 提交失败处理字段
  const onFinishFailed = (errorInfo: any) => {
    let errorList = [] as string[]
    ;(errorInfo.errorFields as any[]).forEach((res: any) => {
      errorList = errorList.concat(res.name)
    })
    setErrorFormItem(errorList)
    console.log('❌ 验证失败:', errorInfo, errorList)
    toast.error(t('common.formDataError'))
  }

  // 获取草稿详情
  const { data: reportDetail, isFetching: getReportDetailLoading } = useQuery({
    queryKey: ['getReportDetail', visible, data?.submission?.id],
    queryFn: async () => {
      const res = await getReportDetail({ submission_id: data?.submission?.id })
      return res.data
    },
    retry: 0,
    enabled: !!data?.submission?.id && visible
  })

  // 草稿详情赋值
  useEffect(() => {
    if (reportDetail) {
      formData.setFieldsValue({
        appraiser_name: reportDetail?.appraiser_name || '',
        appraiser_company: reportDetail?.appraiser_company || '',
        appraise_date: reportDetail?.appraise_date
          ? dayjs(
              typeof reportDetail?.appraise_date === 'string'
                ? reportDetail?.appraise_date
                : reportDetail?.appraise_date * 1000
            )
          : undefined,
        appraise_method: reportDetail?.appraise_method
          ? Number(reportDetail?.appraise_method)
          : undefined,
        appraise_value_cny: reportDetail?.appraise_value_cny,
        appraise_summary: reportDetail?.appraise_summary,
        report_file_urls: reportDetail?.report_files
      })
    }
  }, [reportDetail, formData])

  // 获取评估类型
  const { data: evaluationMethodList } = useQuery({
    queryKey: ['getAssessmentMethod', visible],
    queryFn: async () => {
      const res = await getAssessmentMethod()
      return res.data
    },
    select: (data) => {
      return (
        data?.map((item) => {
          return {
            value: item.id,
            label: (
              <div>
                {i18n.language === 'zh'
                  ? item.name_zh_cn
                  : i18n.language === 'en'
                    ? item.name_en
                    : item.name_ja}
              </div>
            )
          }
        }) || []
      )
    },
    enabled: visible
  })

  const watchedValue = useWatch('appraise_value_cny', formData)
  // 关闭弹窗
  const closeDialog = () => {
    setVisible(false)
    // 清除表单内容
    formData.resetFields()
  }
  // 图片弹窗
  const [showImage, setShowImage] = useState({
    visible: false,
    url: [] as string[]
  })
  // 从URL截取文件名和后缀
  const getFileNameAndType = (url: string) => {
    const fileName = url.split('/').pop()
    const fileType = fileName?.split('.').pop()
    return { fileName, fileType }
  }

  // 文件上传
  const { mutateAsync: uploadIdCardFileMutate, isPending: uploadFileLoading }
    = useMutation({
      mutationKey: ['uploadFile'],
      mutationFn: async (data: { file: File }) => {
        const formData = new FormData()
        formData.append('file', data.file)
        return uploadFile(formData)
      }
    })
  async function uploadIdCardFile(data: File) {
    await uploadIdCardFileMutate({ file: data }).then((res) => {
      if (res.code === 1) {
        formData.setFieldValue('report_file_urls', [
          ...(formData.getFieldValue('report_file_urls') || []),
          res.data?.file?.full_url
        ])
      }
    })
  }
  function removeImageUrl(url: string) {
    // 只删除第一个相同的
    const index = report_files.indexOf(url)
    const files
      = index === -1
        ? report_files
        : [...report_files.slice(0, index), ...report_files.slice(index + 1)]
    formData.setFieldValue('report_file_urls', files)
  }

  // 生成评估报告
  const { mutateAsync: submitReportMutate, isPending: generateReportLoading }
    = useMutation({
      mutationKey: ['generateReport'],
      mutationFn: async (data: SubmitReportModel) => {
        return submitReport(data)
      }
    })
  async function sumbitGenerateReport(type: 1 | 0) {
    const checkForm = await formData
      .validateFields()
      .then(() => {
        return true
      })
      .catch(() => {
        toast.error(t('common.formDataError'))
        return false
      })
    // 手动调用表单检测
    if (type === 1 && !checkForm) {
      return
    }
    // 是否草稿 传1为是 0为否 不传则为提交报告
    const date = (formData.getFieldValue('appraise_date') as Dayjs).format(
      'YYYY-MM-DD'
    )
    return await submitReportMutate({
      submission_id: data.submission?.id,
      appraiser_name: formData.getFieldValue('appraiser_name'),
      appraiser_company: formData.getFieldValue('appraiser_company'),
      appraise_date: date,
      appraise_method: formData.getFieldValue('appraise_method'),
      appraise_value_cny: formData.getFieldValue('appraise_value_cny'),
      appraise_summary: formData.getFieldValue('appraise_summary'),
      report_file_urls: formData.getFieldValue('report_file_urls'),
      is_draft: type === 1 ? '1' : undefined
    }).then((res) => {
      if (type === 0 && res.code === 1) {
        toast.success(t('evaluation.info.uploadReportDialog.saveDraftSuccess'))
      }
      return res
    })
  }

  // 提交评估报告
  // const {
  //   mutateAsync: submitReportFinalMutate,
  //   isPending: submitReportLoading,
  // } = useMutation({
  //   mutationKey: ['submitReport'],
  //   mutationFn: async (data: { report_id: string | number }) => {
  //     return submitReportFinal(data)
  //   },
  // })
  const toSubmitReportFinal = async () => {
    // 先保存草稿
    sumbitGenerateReport(1).then((res) => {
      if (res?.code === 1) {
        setConfirmDialogVisible(false)
        toast.success(
          t('evaluation.info.uploadReportDialog.submitReportSuccess')
        )
        setTimeout(() => {
          navigate({ to: '/evaluation' })
        }, 100)
      }
    })
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
        className={cn(
          'login-dialog [&>div>.ant-modal-content]:!bg-#171b21 b-1 b-solid  b-#1E293B',
          'rounded-2 '
        )}
        centered
        closable
        title={(
          <div className=" ">
            <div className="text-600 text-xl">
              {t('evaluation.info.uploadReportDialog.title')}
            </div>
            <div className="mt-1.5 text-base text-#9CA3AF">
              {t('evaluation.info.assetNumber')}
              ：
              {data?.submission?.code}
              &nbsp;|&nbsp;
              {t('evaluation.info.uploadReportDialog.propertyName')}
              ：
              {data?.properties?.name}
            </div>
          </div>
        )}
        footer={false}
      >
        <Spin spinning={getReportDetailLoading}>
          <div className="upload-report-form mt-7">
            <Form
              onFinish={handleConfirm}
              form={formData}
              className="space-y-4"
              layout="vertical"
              onFinishFailed={onFinishFailed}
            >
              <div className="grid cols-2 gap-x-4">
                <Form.Item
                  required
                  label={t('evaluation.info.uploadReportDialog.appraiserName')}
                  name="appraiser_name"
                  rules={[
                    {
                      required: true,
                      message: t(
                        'evaluation.info.uploadReportDialog.appraiserNameRequired'
                      )
                    }
                  ]}
                >
                  <Input
                    className="w-full"
                    placeholder={t(
                      'evaluation.info.uploadReportDialog.appraiserNamePlaceholder'
                    )}
                  />
                </Form.Item>
                <Form.Item
                  required
                  label={t(
                    'evaluation.info.uploadReportDialog.evaluationAgency'
                  )}
                  name="appraiser_company"
                  rules={[
                    {
                      required: true,
                      message: t(
                        'evaluation.info.uploadReportDialog.evaluationAgencyRequired'
                      )
                    }
                  ]}
                >
                  <Input
                    className="w-full"
                    placeholder={t(
                      'evaluation.info.uploadReportDialog.evaluationAgencyPlaceholder'
                    )}
                  />
                </Form.Item>
                <Form.Item
                  required
                  label={t('evaluation.info.uploadReportDialog.evaluationDate')}
                  name="appraise_date"
                  rules={[
                    {
                      required: true,
                      message: t(
                        'evaluation.info.uploadReportDialog.evaluationDateRequired'
                      )
                    }
                  ]}
                >
                  <DatePicker
                    className="[&>div>input]:!bg-transparent"
                    placeholder={t(
                      'evaluation.info.uploadReportDialog.evaluationDatePlaceholder'
                    )}
                  />
                </Form.Item>
                <Form.Item
                  required
                  label={t(
                    'evaluation.info.uploadReportDialog.evaluationMethod'
                  )}
                  name="appraise_method"
                  rules={[
                    {
                      required: true,
                      message: t(
                        'evaluation.info.uploadReportDialog.evaluationMethodRequired'
                      )
                    }
                  ]}
                >
                  <Select
                    className="[&>div>input]:!bg-transparent"
                    options={evaluationMethodList}
                    placeholder={t(
                      'evaluation.info.uploadReportDialog.evaluationMethodPlaceholder'
                    )}
                  />
                </Form.Item>
                <Form.Item
                  required
                  label={t(
                    'evaluation.info.uploadReportDialog.evaluationPrice'
                  )}
                  name="appraise_value_cny"
                  rules={[
                    {
                      required: true,
                      message: t(
                        'evaluation.info.uploadReportDialog.evaluationPriceRequired'
                      )
                    }
                  ]}
                >
                  <InputNumber
                    controls={false}
                    className="w-full"
                    addonAfter={`≈$${
                      !watchedValue
                        ? 0
                        : formatNumberNoRound(watchedValue * 10000, 6, 0)
                    }`}
                    min={0.01}
                    placeholder={t(
                      'evaluation.info.uploadReportDialog.evaluationPricePlaceholder'
                    )}
                  />
                </Form.Item>
              </div>
              <Form.Item
                required
                label={t(
                  'evaluation.info.uploadReportDialog.evaluationConclusion'
                )}
                name="appraise_summary"
                rules={[
                  {
                    required: true,
                    message: t(
                      'evaluation.info.uploadReportDialog.evaluationConclusionRequired'
                    )
                  }
                ]}
              >
                <Input.TextArea
                  className="w-full"
                  rows={5}
                  style={{ resize: 'none' }}
                  placeholder={t(
                    'evaluation.info.uploadReportDialog.evaluationConclusionPlaceholder'
                  )}
                />
              </Form.Item>
              <Form.Item
                shouldUpdate={false}
                required
                label={t('evaluation.info.uploadReportDialog.uploadReportFile')}
                name="report_file_urls"
                rules={[
                  {
                    required: true,
                    message: t(
                      'evaluation.info.uploadReportDialog.uploadReportFileRequired'
                    )
                  }
                ]}
                getValueFromEvent={() => {
                  // 阻止 Form 自动更新
                  return formData.getFieldValue('report_file_urls')
                }}
              >
                <div>
                  <div className="mt-2 text-sm text-#8B949E">
                    {t('evaluation.info.uploadReportDialog.fileSupport')}
                  </div>
                  <div className="file-card-full mt-4">
                    <UploadMultifileCard
                      className={cn(
                        'flex gap-3 [&>div>div>div>div]:b-2 [&>div>div>div>div]:b-#30363D',
                        `${
                          errorFormItem.includes('evaluationConclusion')
                            ? '[&>div>div>div>div]:b-#dc4446'
                            : '[&>div>div>div>div]:b-#30363D'
                        }`
                      )}
                      fileType="image/png,image/jpg"
                      fileUrl={[]}
                      maxLength={1}
                      width="100%"
                      height="auto"
                      loading={uploadFileLoading}
                      beforeUpload={(file) => {
                        uploadIdCardFile(file)
                      }}
                    >
                      <div className="py-3">
                        <div className="fcc pb-2">
                          <img
                            className="h-8"
                            src={
                              new URL(
                                '@/assets/images/register/cloud.png',
                                import.meta.url
                              ).href
                            }
                            alt=""
                          />
                        </div>
                        <div className="mt3 w-full overflow-hidden text-center text-base text-#9CA3AF">
                          {t('evaluation.info.uploadReportDialog.dragHere')}
                        </div>
                        <div className="mt-1 w-full overflow-hidden text-center text-base text-#00E5FF">
                          {t('evaluation.info.uploadReportDialog.clickUpload')}
                        </div>
                      </div>
                    </UploadMultifileCard>
                  </div>
                  <div className="mt-4 fol gap-2">
                    {Array.isArray(report_files)
                      && report_files?.map(file => (
                        <FileContent
                          key={file}
                          fileName={getFileNameAndType(file).fileName || ''}
                          fileType={getFileNameAndType(file).fileType || ''}
                          showImage={() =>
                            setShowImage({ visible: true, url: [file] })}
                          removeImg={() => {
                            removeImageUrl(file)
                          }}
                        />
                      ))}
                  </div>
                </div>
              </Form.Item>
              <Form.Item>
                <div className="mt-15 fyc justify-end gap-3 pb-30 [&>button]:h-10.5 [&>button]:px-5 [&>button]:text-base">
                  <Button
                    onClick={closeDialog}
                    className="b-#30363D bg-transparent"
                  >
                    {t('evaluation.info.uploadReportDialog.cancel')}
                  </Button>
                  <Button
                    onClick={() => sumbitGenerateReport(0)}
                    loading={generateReportLoading}
                    className="b-#00E5FF bg-transparent text-#00E5FF"
                  >
                    {t('evaluation.info.uploadReportDialog.saveDraft')}
                  </Button>
                  <Button
                    htmlType="submit"
                    className="b-#00E5FF bg-#00E5FF text-black"
                  >
                    {t('evaluation.info.uploadReportDialog.submitReport')}
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </div>
        </Spin>
      </CommonDialog>
      <Modal
        open={confirmDialogVisible}
        onCancel={() => setConfirmDialogVisible(false)}
        maskClosable={false}
        width={446}
        className={cn(
          'login-dialog [&>div>.ant-modal-content]:!bg-#171b21 b-1 b-solid  b-#1E293B',
          'rounded-2 '
        )}
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
            <Button
              onClick={() => toSubmitReportFinal()}
              loading={generateReportLoading}
              className="b-#00E5FF bg-#00E5FF text-black"
            >
              {t('evaluation.info.uploadReportDialog.confirmSubmit')}
            </Button>
          </div>
        )}
      >
        <div>{t('evaluation.info.uploadReportDialog.confirmSubmitDesc')}</div>
      </Modal>
      {/* 显示图片浮窗 */}
      <div className="hidden">
        <Image.PreviewGroup
          preview={{
            visible: showImage.visible,
            scaleStep: 0.5,
            onVisibleChange: (value) => {
              setShowImage({ visible: value, url: showImage.url })
            }
          }}
        >
          {showImage.url.map(url => (
            <Image key={url} src={url} />
          ))}
        </Image.PreviewGroup>
      </div>
    </div>
  )
}
