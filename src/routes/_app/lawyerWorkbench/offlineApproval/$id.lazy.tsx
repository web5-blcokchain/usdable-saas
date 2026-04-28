import type {
  SubmitOfflineMaterialsModel,
  ViewOfflineMaterialsData
} from '@/api/lawyerWorkbenchApi'
import assetsApi from '@/api/assetsApi'
import { uploadFile } from '@/api/common'
import {
  getViewOfflineMaterials,
  submitOfflineMaterials
} from '@/api/lawyerWorkbenchApi'
import UploadMultifileCard from '@/components/common/upload/uploa-multifile-card'
import { useCommonStore } from '@/stores/common'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  createLazyFileRoute,
  useNavigate,
  useParams
} from '@tanstack/react-router'
import { Button, Checkbox, DatePicker, Form, Input } from 'antd'
import dayjs from 'dayjs'
import './index.scss'

export const Route = createLazyFileRoute(
  '/_app/lawyerWorkbench/offlineApproval/$id'
)({
  component: RouteComponent
})

// 律师线下执行页
function RouteComponent() {
  const { t } = useTranslation()
  const { id: assetId } = useParams({
    from: '/_app/lawyerWorkbench/offlineApproval/$id'
  }) as { id: string }
  const back = () => {
    window.history.back()
  }
  const [formData]
    = Form.useForm<
      Omit<SubmitOfflineMaterialsModel, 'submission_id' | 'status'>
    >()
  const { caseListData } = useCommonStore()
  const navigate = useNavigate()
  useEffect(() => {
    if (!caseListData || !assetId) {
      navigate({ to: '/lawyerWorkbench' })
    }
    if (caseListData) {
      formData.setFieldValue('owner_name', caseListData.proposer)
      formData.setFieldValue('contact_method', caseListData.proposer_mobile)
    }
  }, [caseListData, assetId, navigate])
  const owner_name = Form.useWatch('owner_name', formData)
  const contact_method = Form.useWatch('contact_method', formData)
  const [readStatement, setReadStatement] = useState(false)
  // 获取资产信息
  const { data: assetInfo, isPending } = useQuery({
    queryKey: ['getAssetInfo', assetId],
    queryFn: async () => {
      const data = await assetsApi.getAssetInfo(assetId)
      return data.data
    },
    enabled: !!assetId
  })

  // 获取资产线下执行信息
  const { data: viewOfflineMaterialsData, isPending: isViewPending } = useQuery(
    {
      queryKey: ['getViewOfflineMaterials', assetId],
      queryFn: async () => {
        const data = await getViewOfflineMaterials({ submission_id: assetId })
        return data.data
      },
      enabled: !!assetId
    }
  )
  // 读取文件内容
  function getFileValue(data: ViewOfflineMaterialsData, key: string): string {
    const item = data?.files?.find(f => f.key === key)
    return item?.files?.[0] ?? ''
  }

  // 初始化表单数据
  useEffect(() => {
    if (viewOfflineMaterialsData) {
      const data = viewOfflineMaterialsData
      const newFormData = {
        // 异常/阻塞上报
        anomaly_report: data?.notes?.anomaly_report ?? '',

        // 预约时间（number → string）
        appointment_time: data?.property?.appointment_time_text
          ? dayjs(data?.property?.appointment_time_text)
          : undefined,

        // 合规专员
        compliance_specialist_name:
          data?.contacts?.compliance_specialist?.name ?? '',
        compliance_specialist_phone:
          data?.contacts?.compliance_specialist?.phone ?? '',

        // 业主联系方式（contact_method）
        contact_method: data?.property?.contact_method ?? '',

        // 文件部分（根据 files[].key 取值）
        contract_with_seal: getFileValue(data, 'contract_with_seal'),
        expense_invoice: getFileValue(data, 'expense_invoice'),
        offline_processing_photos: getFileValue(
          data,
          'offline_processing_photos'
        ),
        other_rights_certificate: getFileValue(
          data,
          'other_rights_certificate'
        ),
        owner_id_copy: getFileValue(data, 'owner_id_copy'),
        registration_acceptance_receipt: getFileValue(
          data,
          'registration_acceptance_receipt'
        ),

        // 中介
        intermediary_name: data?.contacts?.intermediary?.name ?? '',
        intermediary_phone: data?.contacts?.intermediary?.phone ?? '',

        // 律师
        lawyer_name: data?.contacts?.lawyer?.name ?? '',
        lawyer_phone: data?.contacts?.lawyer?.phone ?? '',

        // 线下办理备注
        offline_processing_notes: data?.notes?.offline_processing_notes ?? '',

        // 业主名称
        owner_name: data?.property?.owner_name ?? '',

        // 办理地点
        processing_location: data?.property?.processing_location ?? '',

        // 权属证号
        property_certificate_number:
          data?.property?.property_certificate_number ?? '',

        // 状态（这里把数字转 string）
        status: data.status != null ? String(data.status) : undefined,

        // 提交资产 ID
        submission_id:
          data?.submission_id != null ? String(data.submission_id) : undefined
      }
      formData.setFieldsValue(newFormData as any)
    }
  }, [viewOfflineMaterialsData])

  const dataCategoryList = useMemo(() => {
    return [
      {
        title: t('lawyerWorkbench.offlineExecution.propertyName'),
        value: assetInfo?.properties?.name || '-'
      },
      {
        title: t('lawyerWorkbench.offlineExecution.certificateNumber'),
        value: (
          <Form.Item
            required
            name="property_certificate_number"
            rules={[
              {
                required: true,
                message: t(
                  'lawyerWorkbench.offlineExecution.certificateNumberError'
                )
              }
            ]}
          >
            <Input
              placeholder={t(
                'lawyerWorkbench.offlineExecution.certificateNumberPlaceholder'
              )}
            >
            </Input>
          </Form.Item>
        )
      },
      {
        title: t('lawyerWorkbench.offlineExecution.ownerName'),
        value: owner_name || '-'
      },
      {
        title: t('lawyerWorkbench.offlineExecution.contactInfo'),
        value: contact_method || '-'
      },
      {
        title: t('lawyerWorkbench.offlineExecution.appointmentTime'),
        value: (
          <Form.Item
            required
            name="appointment_time"
            rules={[
              {
                required: true,
                message: t(
                  'lawyerWorkbench.offlineExecution.appointmentTimeError'
                )
              }
            ]}
          >
            <DatePicker className="!w-50% [&>div>input]:!bg-transparent" />
          </Form.Item>
        )
      },
      {
        title: t('lawyerWorkbench.offlineExecution.location'),
        value: (
          <Form.Item
            required
            name="processing_location"
            rules={[
              {
                required: true,
                message: t('lawyerWorkbench.offlineExecution.locationError')
              }
            ]}
          >
            <Input
              placeholder={t(
                'lawyerWorkbench.offlineExecution.locationPlaceholder'
              )}
            >
            </Input>
          </Form.Item>
        )
      }
    ]
  }, [assetInfo, t, contact_method, owner_name])

  const fileNameList = [
    {
      title: t('lawyerWorkbench.offlineExecution.receipt'),
      content: t('lawyerWorkbench.offlineExecution.issuedByRegistry'),
      name: 'registration_acceptance_receipt'
    },
    {
      title: t('lawyerWorkbench.offlineExecution.mortgageCertificate'),
      content: t('lawyerWorkbench.offlineExecution.obtainedAfterMortgage'),
      name: 'other_rights_certificate'
    },
    {
      title: t('lawyerWorkbench.offlineExecution.sealedContract'),
      content: t('lawyerWorkbench.offlineExecution.withSignatures'),
      name: 'contract_with_seal'
    },
    {
      title: t('lawyerWorkbench.offlineExecution.ownerIdCopy'),
      content: t('lawyerWorkbench.offlineExecution.idOrPassport'),
      name: 'owner_id_copy'
    },
    {
      title: t('lawyerWorkbench.offlineExecution.feeInvoice'),
      content: t('lawyerWorkbench.offlineExecution.fees'),
      name: 'expense_invoice'
    },
    {
      title: t('lawyerWorkbench.offlineExecution.offlinePhotos'),
      content: t('lawyerWorkbench.offlineExecution.windowProcess'),
      name: 'offline_processing_photos'
    }
  ]

  const registration_acceptance_receipt = Form.useWatch(
    'registration_acceptance_receipt',
    formData
  )
  const other_rights_certificate = Form.useWatch(
    'other_rights_certificate',
    formData
  )
  const contract_with_seal = Form.useWatch('contract_with_seal', formData)
  const owner_id_copy = Form.useWatch('owner_id_copy', formData)
  const expense_invoice = Form.useWatch('expense_invoice', formData)
  const offline_processing_photos = Form.useWatch(
    'offline_processing_photos',
    formData
  )

  // 获取文件url
  function getFileUrl(formName: string) {
    switch (formName) {
      case 'registration_acceptance_receipt':
        return registration_acceptance_receipt
          ? [registration_acceptance_receipt]
          : []
      case 'other_rights_certificate':
        return other_rights_certificate ? [other_rights_certificate] : []
      case 'contract_with_seal':
        return contract_with_seal ? [contract_with_seal] : []
      case 'owner_id_copy':
        return owner_id_copy ? [owner_id_copy] : []
      case 'expense_invoice':
        return expense_invoice ? [expense_invoice] : []
      case 'offline_processing_photos':
        return offline_processing_photos ? [offline_processing_photos] : []
      default:
        return []
    }
  }

  // 查看上传文件是否是图片
  function isFileOrImg(formName: string) {
    const file = getFileUrl(formName)?.[0]
    return ['.png', '.jpg', '.jpge'].includes(file)
  }

  // 文件是否上传全部
  const isUploadAll = useMemo(() => {
    return fileNameList.every(item => getFileUrl(item.name).length > 0)
  }, [
    registration_acceptance_receipt,
    other_rights_certificate,
    contract_with_seal,
    owner_id_copy,
    expense_invoice,
    offline_processing_photos
  ])

  // 文件上传
  const { mutateAsync: uploadIdCardFileMutate } = useMutation({
    mutationKey: ['uploadFile'],
    mutationFn: async (data: { file: File }) => {
      const formData = new FormData()
      formData.append('file', data.file)
      return uploadFile(formData)
    }
  })
  const [uploadFileLoading, setUploadFileLoading] = useState([] as string[])
  async function uploadIdCardFile(data: File, formName: string) {
    setUploadFileLoading(prev => [...prev, formName])
    await uploadIdCardFileMutate({ file: data })
      .then((res) => {
        if (res.code === 1) {
          formData.setFieldValue(formName as any, res.data?.file?.full_url)
        }
      })
      .finally(() => {
        setUploadFileLoading(prev => prev.filter(item => item !== formName))
      })
  }

  // 表单验证失败名字列表
  const [errorFormItem, setErrorFormItem] = useState<string[]>([])
  const onFinishFailed = (errorInfo: any) => {
    let errorList = [] as string[]
    ;(errorInfo.errorFields as any[]).forEach((res: any) => {
      errorList = errorList.concat(res.name)
    })
    setErrorFormItem(errorList)
    console.log('❌ 验证失败:', errorInfo, errorList)
    toast.error(t('common.formDataError'))
  }
  const { mutateAsync: submitOfflineMaterialsAsync, isPending: sumbitLoading }
    = useMutation({
      mutationKey: ['submitOfflineMaterials'],
      mutationFn: async (data: SubmitOfflineMaterialsModel) => {
        return await submitOfflineMaterials(data)
      }
    })

  const [stashLoading, setStashLoading] = useState(false)
  // 暂存表单内容
  async function stashForm() {
    setStashLoading(true)
    // 手动检测表单内容是否完整
    const checkForm = await formData
      .validateFields()
      .then(() => {
        return Promise.resolve(true)
      })
      .catch(() => {
        toast.error(t('common.formDataError'))
        return Promise.resolve(true)
      })
    // 手动调用表单检测
    if (!checkForm) {
      setStashLoading(false)
      return
    }
    await sumbitForm(0).finally(() => {
      setStashLoading(false)
    })
  }

  // 提交表单
  async function sumbitForm(status?: 0 | 1) {
    const data = formData.getFieldsValue()
    if (!readStatement) {
      toast.warning(t('lawyerWorkbench.offlineExecution.agreeDeclarationError'))
      return
    }
    await submitOfflineMaterialsAsync({
      ...data,
      appointment_time: data?.appointment_time
        ? dayjs(data?.appointment_time).format('YYYY-MM-DD')
        : undefined,
      status: status === undefined ? '1' : status.toString(),
      submission_id: assetId
    }).then((res) => {
      if (res.code === 1) {
        toast.success(
          status === 0
            ? t('lawyerWorkbench.offlineExecution.saveSuccess')
            : t('lawyerWorkbench.offlineExecution.submitSuccess')
        )
        if (!status) {
          navigate({ to: '/lawyerWorkbench' })
        }
      }
    })
  }
  if (isPending || isViewPending) {
    ;<Waiting for={!isPending} className="h-100 fccc" />
  }

  return (
    <Form
      onFinishFailed={onFinishFailed}
      onFinish={() => sumbitForm()}
      form={formData}
    >
      <div className="px-22 py-13">
        <div className="w-full">
          <div onClick={back} className="w-fit fcc gap-1 clickable">
            <div className="i-ic:round-arrow-back text-5 text-white"></div>
            <div className="text-xl">
              {t('lawyerWorkbench.offlineExecution.back')}
            </div>
          </div>
        </div>
        <div className="mt-6 text-sm text-#9CA3AF">
          <div className="mb-1 text-2xl text-white font-600">
            {assetInfo?.properties?.name}
          </div>
          <div>
            {t('lawyerWorkbench.offlineExecution.taskNumber')}
            ：
            {assetInfo?.submission?.code}
            {/* ·{t('lawyerWorkbench.offlineExecution.taskType')}：
          {t('lawyerWorkbench.offlineExecution.mortgageRegistration')} */}
          </div>
          <div>
            {t('lawyerWorkbench.offlineExecution.createdAt')}
            {' '}
            {dayjs((assetInfo?.submission?.update_date || 0) * 1000).format(
              'YYYY-MM-DD'
            )}
          </div>
        </div>
        <div className="mt-6 rounded-2 bg-#161B22 p-6">
          <div className="text-xl">
            {t('lawyerWorkbench.offlineExecution.propertyOwner')}
          </div>
          <div className="grid cols-2 mt-4 gap-4">
            {dataCategoryList.map((item, index) => (
              <div key={index} className="flex flex-col">
                <div className="text-sm text-#9CA3AF">{item.title}</div>
                <div className="mt-2 text-base text-white">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
        {/* 办理文件上传  */}
        <div className="mt-6 rounded-2 bg-#161B22 p-6">
          <div className="fyc justify-between gap-3">
            <div className="text-xl font-600">
              {t('lawyerWorkbench.offlineExecution.fileUpload')}
              {' '}
              (
              {t('lawyerWorkbench.offlineExecution.fileUploadStatus', {
                num: fileNameList.filter(
                  item => getFileUrl(item.name).length > 0
                ).length,
                max: fileNameList.length
              })}
              )
            </div>
            {!isUploadAll && (
              <div className="b-1 b-#60A5FA px-3 py-1 text-sm text-#60A5FA">
                {t('lawyerWorkbench.offlineExecution.missingRequiredFiles')}
              </div>
            )}
          </div>
          <div className="mt-4 flex flex-col gap-4">
            {
              // 生成6个
              fileNameList.map((item, index) => (
                <div key={index} className="b-1 b-#374151 rounded-2 p-4">
                  <div className="fyc justify-between gap-4">
                    <div>
                      <div className="text-base">{item.title}</div>
                      <div className="mt-1 text-xs text-#9CA3AF">
                        {item.content}
                      </div>
                    </div>
                    <div
                      className={cn(
                        'rounded-1.5 px-2 py-1 text-sm transition-all-300',
                        getFileUrl(item.name).length > 0
                          ? 'bg-#10B981'
                          : 'bg-#374151'
                      )}
                    >
                      {getFileUrl(item.name).length > 0
                        ? t('lawyerWorkbench.offlineExecution.uploaded')
                        : t('lawyerWorkbench.offlineExecution.pendingUpload')}
                    </div>
                  </div>
                  <Form.Item
                    name={item.name}
                    getValueFromEvent={() => {
                      // 阻止 Form 自动更新
                      return formData.getFieldValue(item.name as any)
                    }}
                    rules={[
                      {
                        required: true,
                        message: t(
                          'lawyerWorkbench.offlineExecution.uploadError'
                        )
                      }
                    ]}
                  >
                    <UploadMultifileCard
                      className={cn(
                        'flex gap-3 [&>div>div>div>div]:b-2 mt-2 ',
                        `${
                          errorFormItem.includes(item.name)
                            ? '[&>div>div>div>div]:b-#dc4446'
                            : '[&>div>div>div>div]:b-#4B5563'
                        }`
                      )}
                      fileType="image/png,image/jpg,application/pdf"
                      fileUrl={getFileUrl(item.name)}
                      maxLength={1}
                      width="100%"
                      height={
                        getFileUrl(item.name).length === 0
                          ? '9rem'
                          : isFileOrImg(item.name)
                            ? '20rem'
                            : '6rem'
                      }
                      loading={uploadFileLoading.includes(item.name)}
                      removeFile={(_index) => {
                        formData.setFieldValue(item.name as any, '')
                      }}
                      beforeUpload={(file) => {
                        uploadIdCardFile(file, item.name)
                      }}
                    >
                      <div className="py-3">
                        <div className="text-sm text-#9CA3AF">
                          {t(
                            'lawyerWorkbench.offlineExecution.uploadPlaceholder'
                          )}
                        </div>
                      </div>
                    </UploadMultifileCard>
                  </Form.Item>
                </div>
              ))
            }
          </div>
        </div>
        {/* 线下办理备注 */}
        <div className="mt-6 rounded-2 bg-#161B22 p-6">
          <div className="flex">
            <div className="mr-1 text-xl font-600">
              {t('lawyerWorkbench.offlineExecution.offlineRemarks')}
            </div>
            <div className="text-xl text-red-500">*</div>
          </div>
          {/* 遇见\n换行 */}
          <Form.Item
            rules={[
              {
                required: true,
                message: t(
                  'lawyerWorkbench.offlineExecution.offlineRemarksError'
                )
              }
            ]}
            name="offline_processing_notes"
          >
            <Input.TextArea
              className="multiline-placeholder mt-5 b-1 b-#374151"
              autoSize={{ minRows: 5, maxRows: 5 }}
              placeholder={t(
                'lawyerWorkbench.offlineExecution.offlineRemarksPlaceholder'
              )}
            >
            </Input.TextArea>
          </Form.Item>
        </div>
        {/* 异常/阻塞上报 (可选) */}
        <div className="mt-6 rounded-2 bg-#161B22 p-6">
          <div className="text-xl font-600">
            {t('lawyerWorkbench.offlineExecution.exceptionReporting')}
          </div>
          <Form.Item name="anomaly_report">
            <Input.TextArea
              className="mt-5 b-1 b-#374151"
              autoSize={{ minRows: 5, maxRows: 5 }}
              placeholder={t(
                'lawyerWorkbench.offlineExecution.exceptionReportingPlaceholder'
              )}
            >
            </Input.TextArea>
          </Form.Item>
          <div className="mt-2 text-xs text-#9CA3AF">
            {t('lawyerWorkbench.offlineExecution.notificationText')}
          </div>
        </div>
        {/* 联系人与协作 */}
        <div className="mt-6 rounded-2 bg-#161B22 p-6">
          <div className="text-xl font-600">
            {t('lawyerWorkbench.offlineExecution.collaboration')}
          </div>
          <div className="mt-4 flex flex-col gap-3 text-base [&>div]:fyc [&>div]:justify-between [&>div>div:first-child]:text-#9CA3AF">
            <div>
              <div>{t('lawyerWorkbench.offlineExecution.lawyer')}</div>
              <div className="fcc gap-2">
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: t(
                        'lawyerWorkbench.offlineExecution.lawyerNameError'
                      )
                    }
                  ]}
                  name="lawyer_name"
                >
                  <Input
                    placeholder={t(
                      'lawyerWorkbench.offlineExecution.namePlaceholder'
                    )}
                  >
                  </Input>
                </Form.Item>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: t(
                        'lawyerWorkbench.offlineExecution.lawyerPhoneError'
                      )
                    }
                  ]}
                  name="lawyer_phone"
                >
                  <Input
                    placeholder={t(
                      'lawyerWorkbench.offlineExecution.contactPlaceholder'
                    )}
                  >
                  </Input>
                </Form.Item>
              </div>
            </div>
            <div>
              <div>
                {t('lawyerWorkbench.offlineExecution.complianceSpecialist')}
              </div>
              <div className="fcc gap-2">
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: t(
                        'lawyerWorkbench.offlineExecution.complianceSpecialistNameError'
                      )
                    }
                  ]}
                  name="compliance_specialist_name"
                >
                  <Input
                    placeholder={t(
                      'lawyerWorkbench.offlineExecution.namePlaceholder'
                    )}
                  >
                  </Input>
                </Form.Item>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: t(
                        'lawyerWorkbench.offlineExecution.complianceSpecialistPhoneError'
                      )
                    }
                  ]}
                  name="compliance_specialist_phone"
                >
                  <Input
                    placeholder={t(
                      'lawyerWorkbench.offlineExecution.contactPlaceholder'
                    )}
                  >
                  </Input>
                </Form.Item>
              </div>
            </div>
            <div>
              <div>{t('lawyerWorkbench.offlineExecution.assetParty')}</div>
              <div className="fcc gap-2">
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: t(
                        'lawyerWorkbench.offlineExecution.ownerNameError'
                      )
                    }
                  ]}
                  name="owner_name"
                >
                  <Input
                    placeholder={t(
                      'lawyerWorkbench.offlineExecution.namePlaceholder'
                    )}
                  >
                  </Input>
                </Form.Item>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: t(
                        'lawyerWorkbench.offlineExecution.ownerContactError'
                      )
                    }
                  ]}
                  name="contact_method"
                >
                  <Input
                    placeholder={t(
                      'lawyerWorkbench.offlineExecution.contactPlaceholder'
                    )}
                  >
                  </Input>
                </Form.Item>
              </div>
            </div>
            <div>
              <div>{t('lawyerWorkbench.offlineExecution.intermediary')}</div>
              <div className="fcc gap-2">
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: t(
                        'lawyerWorkbench.offlineExecution.intermediaryNameError'
                      )
                    }
                  ]}
                  name="intermediary_name"
                >
                  <Input
                    placeholder={t(
                      'lawyerWorkbench.offlineExecution.namePlaceholder'
                    )}
                  >
                  </Input>
                </Form.Item>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: t(
                        'lawyerWorkbench.offlineExecution.intermediaryPhoneError'
                      )
                    }
                  ]}
                  name="intermediary_phone"
                >
                  <Input
                    placeholder={t(
                      'lawyerWorkbench.offlineExecution.contactPlaceholder'
                    )}
                  >
                  </Input>
                </Form.Item>
              </div>
            </div>
          </div>
        </div>
        {/* 提交声明 */}
        <div className="mt-6 rounded-2 bg-#161B22 p-6">
          <div className="text-xl font-600">
            {t('lawyerWorkbench.offlineExecution.submissionDeclaration')}
          </div>
          <Checkbox
            checked={readStatement}
            onChange={e => setReadStatement(e.target?.checked)}
            className="mt-4 text-xs"
          >
            {t('lawyerWorkbench.offlineExecution.declarationText')}
          </Checkbox>
          <div className="mt-4 flex flex-col gap-3 [&>button]:h-12 [&>button]:w-full [&>button]:text-base [&>button]:text-white">
            <Button
              loading={sumbitLoading && !stashLoading}
              htmlType="submit"
              className="b-#059669 bg-#059669"
            >
              {t('lawyerWorkbench.offlineExecution.submit')}
            </Button>
            <Button
              loading={stashLoading}
              onClick={stashForm}
              className="b-#CA8A04 bg-#CA8A04"
            >
              {t('lawyerWorkbench.offlineExecution.save')}
            </Button>
            {/* <Button className="b-#DC2626 bg-#DC2626">
              {t('lawyerWorkbench.offlineExecution.reject')}
            </Button> */}
          </div>
          <div className="mt-4 text-xs text-#9CA3AF">
            {t('lawyerWorkbench.offlineExecution.submissionNotice')}
          </div>
        </div>
      </div>
    </Form>
  )
}
