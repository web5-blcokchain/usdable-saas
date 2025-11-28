import type { UserRegisterModel } from '@/api/apiMyInfoApi'
import type { FormInstance } from 'antd/es/form'
import apiMyInfoApi from '@/api/apiMyInfoApi'
import { getLocation, uploadFile } from '@/api/common'
import componyIcon from '@/assets/images/compony.png'
import componyIcom from '@/assets/images/register/compony-grey.png'
import fileIcon from '@/assets/images/register/file.png'
import userCardIcon from '@/assets/images/register/userCard.png'
import signIcom from '@/assets/images/register/userSign.png'
import UploadMultifileCard from '@/components/common/upload/uploa-multifile-card'
import { useUserStore } from '@/stores/user'
import { screenToTop } from '@/utils'
import { envConfig } from '@/utils/envConfig'
import { getToken } from '@/utils/user'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Button, Checkbox, DatePicker, Form, Input, Select } from 'antd'
import { useWatch } from 'antd/es/form/Form'
import FormItem from 'antd/es/form/FormItem'
import { AnimatePresence, motion } from 'framer-motion'
import { RegisterStatus } from './registerStatus'

function AnimationComponent({ animKey, children, className }: { animKey: string, children: React.ReactNode, className?: string }) {
  return (
    <motion.div
      key={animKey}
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// 评估机构注册
export function EvaluatorRegister({ back }: { back: () => void }) {
  const [firstForm] = Form.useForm()
  const [secondForm] = Form.useForm()
  const [step, setStep] = useState(0) // 显示第几个表单
  const [isSuccess, setIsSuccess] = useState(false)
  const [registerStatus, setRegisterStatus] = useState(0)
  const [errorMessage, setErrorMessage] = useState('机构资质审核失败')
  const { userData } = useUserStore()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const { mutateAsync: userResgiter } = useMutation({
    mutationKey: ['userRegitser'],
    mutationFn: async (values: UserRegisterModel) => {
      return userData?.user?.audit_status !== 2 ? apiMyInfoApi.regitser(values) : apiMyInfoApi.resubmitRegister(values)
    }
  })

  /**
   * 表单提交
   * @param values
   */
  const onFinish = async (values: any) => {
    await userResgiter({
      ...values,
      type: '4',
      token: getToken() || '',
      agree_asset_compliance: '1'
    }).then((res) => {
      if (res.code === 1) {
        setIsSuccess(true)
        setRegisterStatus(0)
        setErrorMessage('')
      }
    })
  }

  const [sumbitData, setSumbitData] = useState<UserRegisterModel>({})

  const formStep = async (step: number, values: any) => {
    switch (step) {
      case 0: {
        // 处理表单数据
        const data = {
          ...values,
          year: values.year.$y
        }
        setSumbitData(data)
        // 跳转到第二步,并滚动到顶部
        setStep(1)
        screenToTop({
          top: 0,
          behavior: 'smooth'
        })
      } break
      case 1: {
        const data = {
          ...values,
          agree_aml_statement: values.agree_aml_statement ? 1 : 0,
          service_agreement_status: values.service_agreement_status ? 1 : 0
        }
        await onFinish({
          ...sumbitData,
          ...data
        })
      } break
      default:
        return null
    }
  }

  useEffect(() => {
    return () => {
      setIsSuccess(false)
    }
  }, [])

  return (
    <div className="mt-6 fccc px-66 pb-53 max-md:px-4">

      <AnimatePresence mode="wait">
        <AnimationComponent animKey="firstStep" className="w-full">
          <FirstStep
            className={step === 0 ? 'block' : 'hidden'}
            form={firstForm}
            back={back}
            onFinish={(value) => {
              formStep(0, value)
            }}
          />
        </AnimationComponent>
        <AnimationComponent animKey="secondStep" className="w-full">
          <SecondStep
            className={step === 1 ? 'block' : 'hidden'}
            form={secondForm}
            back={() => setStep(0)}
            onFinish={async (value) => {
              await formStep(1, value)
            }}
          />
        </AnimationComponent>
      </AnimatePresence>
      <RegisterStatus
        visible={isSuccess}
        setVisible={setIsSuccess}
        type={registerStatus}
        errorMessage={errorMessage}
        back={() => {
          setIsSuccess(false)
          back()
        }}
        successButton={{
          text: t('register.asset.enterEvaluationTaskCenter'),
          onClick: () => {
            // TODO 跳转进入资产上传中心
            navigate({ to: '/evaluation' })
          }
        }}
      />
    </div>
  )
}

// 第一个表单
function FirstStep({ form, back, onFinish, className }: {
  form: FormInstance<any>
  back: () => void
  onFinish: (values?: any) => void
  className?: string
}) {
  const { t, i18n } = useTranslation()

  interface LocationData {
    value: number
    label: string
  }
  // 地区数据
  const [locationData, setLocationData] = useState({
    country: [] as LocationData[],
    province: [] as LocationData[],
    city: [] as LocationData[]
  })
  const [selectPid, setSelectPid] = useState({
    country: 0,
    province: 0,
    selectedLocation: 0
  })

  // 获取地区数据
  const { isFetching: locationDataLoading } = useQuery({
    queryKey: ['getLocation', selectPid],
    queryFn: async () => {
      const data = await getLocation({
        level: selectPid.selectedLocation + 2,
        parent_id: selectPid.selectedLocation === 1
          ? selectPid.country
          : (
              selectPid.selectedLocation === 2 ? selectPid.province : undefined
            )
      })
      // 处理数据,
      const newData = data?.data?.map(item => ({
        value: item.id,
        label: item.name
      })) || [] as LocationData[]
      console.log(newData)

      setLocationData((pre) => {
        if (selectPid.selectedLocation === 0) {
          return {
            ...pre,
            country: newData
          }
        }
        else if (selectPid.selectedLocation === 1) {
          return {
            ...pre,
            province: newData
          }
        }
        else {
          return {
            ...pre,
            city: newData
          }
        }
      })
      return data.data
    }
  })
  // 修改地区
  const changeCity = (val: number, index: number) => {
    if (index === 0) {
      setSelectPid(pre => ({
        ...pre,
        country: val,
        selectedLocation: 1
      }))
      form.setFieldValue('province', '')
      form.setFieldValue('city', '')
    }
    else if (index === 1) {
      setSelectPid(pre => ({
        ...pre,
        province: val,
        selectedLocation: 2
      }))
      form.setFieldValue('city', '')
    }
  }

  // 获取主体类型
  const { data: entityTypeList, isLoading: entityTypeListLoading } = useQuery({
    queryKey: ['getEntityType'],
    queryFn: async () => {
      const data = await apiMyInfoApi.getEntityType()
      return data.data
    },
    select: (data) => {
      return data?.map(item => ({
        value: item.id,
        label: (
          <div>
            {i18n.language === 'en'
              ? item.name_en
              : (
                  i18n.language === 'zh' ? item.name_zh_cn : item.name_ja
                )}
          </div>
        )
      }))
    }
  })

  return (
    <div className={className}>
      <div className="w-full">
        <div onClick={back} className="w-fit fcc gap-1 clickable">
          <div className="i-ic:round-arrow-back text-6 text-white"></div>
          <div>{t('register.lawOffice.back')}</div>
        </div>
      </div>
      <div className="text-center text-12 font-600 leading-18 max-md:text-3xl">{t('register.evaluator.title')}</div>
      <div className="mt-10 w-full b-2 b-#31363c rounded-lg b-solid bg-#161B2199 p-12 max-md:p-4">
        <div className="mb-6 fyc gap-3">
          <img className="h-6" src={componyIcon} alt="" />
          <div className="text-lg font-600">{t('register.evaluator.basicInfo')}</div>
        </div>
        <Form onFinish={onFinish} form={form} layout="vertical" className="">
          <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1 max-md:gap-0">
            {/* 机构名称 */}
            <Form.Item
              required
              label={t('register.evaluator.companyName')}
              name="nickname"
              rules={[{ required: true, message: t('register.evaluator.companyName') }]}
            >
              <Input placeholder={t('register.evaluator.businessLicenseMatch')} />
            </Form.Item>
            {/* 主体类型 */}
            <Form.Item
              required
              label={t('register.evaluator.entityType')}
              name="entity_type_id"
              rules={[{ required: true, message: t('register.evaluator.selectEntityTypepPlaceholder') }]}
            >
              <Select
                placeholder={t('register.evaluator.selectEntityTypepPlaceholder')}
                options={entityTypeList}
                loading={entityTypeListLoading}
              />
            </Form.Item>
            {/* 统一社会信用代码 */}
            <Form.Item
              required
              label={t('register.asset.creditCode')}
              name="uscc"
              rules={[{ required: true, message: t('register.asset.creditCodePlaceholder') }]}
            >
              <Input
                placeholder={t('register.asset.creditCodePlaceholder')}
              />
            </Form.Item>
            {/* 联系人姓名 */}
            <Form.Item
              required
              label={t('register.evaluator.contactName')}
              name="contact_name"
              rules={[{ required: true, message: t('register.evaluator.enterContactNamePlaceholder') }]}
            >
              <Input
                placeholder={t('register.evaluator.enterContactNamePlaceholder')}
              />
            </Form.Item>
            {/* 联系人电话 */}
            <Form.Item
              required
              label={t('register.asset.phone')}
              name="mobile"
              rules={[{ required: true, message: t('register.asset.phonePlaceholder') }]}
            >
              <Input
                placeholder={t('register.asset.phonePlaceholder')}
              />
            </Form.Item>
            {/* 联系人邮箱 */}
            <Form.Item
              required
              label={t('register.evaluator.email')}
              name="email"
              rules={[
                { required: true, message: t('register.evaluator.enterEmailPlaceholder') },
                { pattern: /^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i, message: t('register.evaluator.enterEmailErrorPlaceholder') }
              ]}
            >
              <Input
                placeholder={t('register.evaluator.enterEmailPlaceholder')}
              />
            </Form.Item>
          </div>
          {/* 国家/省份/城市 */}
          <Form.Item
            required
            label={t('register.evaluator.country')}
            name="country"
          >
            <div className="grid grid-cols-3 gap-3">
              <Form.Item
                name="country"
                rules={[{ required: true, message: t('register.evaluator.selectCountryPlaceholder') }]}
              >
                <Select
                  placeholder={t('register.evaluator.country')}
                  loading={locationDataLoading && selectPid.selectedLocation === 0}
                  onChange={val => changeCity(val, 0)}
                  options={locationData.country}
                />
              </Form.Item>
              <Form.Item
                name="province"
                rules={[{ required: true, message: t('register.evaluator.selectProvincePlaceholder') }]}
              >
                <Select
                  placeholder={t('register.evaluator.province')}
                  loading={locationDataLoading && selectPid.selectedLocation === 1}
                  onChange={val => changeCity(val, 1)}
                  options={locationData.province}
                />
              </Form.Item>
              <Form.Item
                name="city"
                rules={[{ required: true, message: t('register.evaluator.selectCityPlaceholder') }]}
              >
                <Select
                  placeholder={t('register.evaluator.city')}
                  loading={locationDataLoading && selectPid.selectedLocation === 2}
                  onChange={val => changeCity(val, 2)}
                  options={locationData.city}
                />
              </Form.Item>
            </div>
          </Form.Item>
          {/* 办公地址 */}
          <Form.Item label={t('register.evaluator.address')} name="address">
            <Input
              placeholder={t('register.evaluator.enterAddressPlaceholder')}
            />
          </Form.Item>
          <div className="grid grid-cols-2 gap-6">
            {/* 成立年份 */}
            <Form.Item
              required
              label={t('register.evaluator.establishmentYear')}
              name="year"
              rules={[{ required: true, message: t('register.evaluator.selectEstablishmentYearPlaceholder') }]}
            >
              <DatePicker picker="year" placeholder={t('register.evaluator.selectEstablishmentYearPlaceholder')} className="h-12.5 w-full b-#374151 bg-#1E2328 [&>div>input]:!bg-transparent" />
            </Form.Item>
          </div>
          <Form.Item>
            <div className="text-end">
              <Button type="primary" htmlType="submit" className="h-10.5 px-4 text-base text-black">
                {t('register.evaluator.next')}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

// 第二个表单
export function SecondStep({ form, back, onFinish, className }: {
  form: FormInstance<any>
  back: () => void
  onFinish: (values: any) => Promise<void>
  className?: string
}) {
  const { t } = useTranslation()
  const [errorFormItem, setErrorFormItem] = useState<string[]>([])
  const officePhotos = useWatch('officePhotos', form)
  const antiMoneyLaunderingStatement = useWatch('anti_money_laundering_statement', form)
  const evaluationQualificationCertificate = useWatch('evaluation_qualification_certificate', form)
  const chiefAppraiserCertificate = useWatch('chief_appraiser_certificate', form)
  const businessLicense = useWatch('business_license', form)

  const { mutateAsync: uploadIdCardFileMutate } = useMutation({
    mutationKey: ['uploadFile'],
    mutationFn: async (data: { file: File }) => {
      const formData = new FormData()
      formData.append('file', data.file)
      return uploadFile(formData)
    }
  })
  const [uploadFileLoading, setUploadFileLoading] = useState([] as number[])

  // 文件上传
  async function uploadIdCardFile(data: File, name: string, index: number) {
    setUploadFileLoading(prev => [...prev, index])
    await uploadIdCardFileMutate({ file: data }).then((res) => {
      if (res.code === 1) {
        form.setFieldValue(name, res.data?.file.full_url)
      }
    }).finally(() => {
      setUploadFileLoading(prev => prev.filter(item => item !== index))
    })
  }

  // 判断是否为图片
  const fileIsUrl = (url: string) => {
    return url && url.includes(envConfig.imageApiUrl)
  }

  // 验证表单失败列表
  const onFinishFailed = (errorInfo: any) => {
    let errorList = [] as string[];
    (errorInfo.errorFields as any[]).forEach((res: any) => {
      errorList = errorList.concat(res.name)
    })
    setErrorFormItem(errorList)
    console.log('❌ 验证失败:', errorInfo, errorList)
  }

  const [sumbitLoading, setSumbitLoading] = useState(false)
  async function sumbitForm(values: any) {
    setSumbitLoading(true)
    await onFinish(values).finally(() => {
      setSumbitLoading(false)
    })
  }

  return (
    <div className={className}>
      <div className="w-full">
        <div onClick={back} className="w-fit fcc gap-1 clickable">
          <div className="i-ic:round-arrow-back text-6 text-white"></div>
          <div>{t('register.evaluator.back')}</div>
        </div>
      </div>
      <div className="mt-10 w-full b-2 b-#31363c rounded-lg b-solid bg-#161B2199 p-12 max-md:p-4">
        <div className="mb-6 fyc gap-3">
          <div className="text-lg font-600">{t('register.evaluator.uploadCredentials')}</div>
        </div>
        <Form form={form} onFinish={sumbitForm} onFinishFailed={onFinishFailed}>
          {/* 机构营业执照 */}
          <FormItem name="business_license" rules={[{ required: true, message: <div>{t('register.evaluator.uploadBusinessLicense')}</div> }]}>
            <div className="upload-card">
              <div>
                <span className="mr-1 text-4 text-white font-bold">{t('register.evaluator.businessLicense')}</span>
                <span className="text-#EF4444">*</span>
              </div>
              <div className="mb-4 mt-1 text-sm text-#6B7280">
                {t('register.evaluator.businessLicense')}
              </div>
              <UploadMultifileCard
                className={cn(
                  'flex gap-3 [&>div>div>div>div]:b-2',
                  `${(errorFormItem.includes('business_license')) ? '[&>div>div>div>div]:b-#dc4446' : '[&>div>div>div>div]:b-#30363D'}`
                )}
                fileType="image/png,image/jpg,application/pdf"
                fileUrl={fileIsUrl(businessLicense) ? [businessLicense] : []}
                maxLength={1}
                width="100%"
                height="auto"
                loading={uploadFileLoading.includes(0)}
                removeFile={(_index) => {
                  form.setFieldValue(`business_license`, '')
                }}
                beforeUpload={(file) => {
                  uploadIdCardFile(file, `business_license`, 0)
                }}
              >
                <div className="py-3">
                  <div className="fcc pb-2">
                    <img className="h-8" src={new URL('@/assets/images/register/cloud.png', import.meta.url).href} alt="" />
                  </div>
                  <div className="text-center text-sm text-#9CA3AF">{t('register.evaluator.uploadSignedAML')}</div>
                  <div className="text-center text-xs text-#6B7280">{t('register.evaluator.businessLicense')}</div>
                </div>
              </UploadMultifileCard>
            </div>
          </FormItem>
          {/* 主评估师资格证书 */}
          <FormItem name="chief_appraiser_certificate" rules={[{ required: true, message: t('register.evaluator.uploadChiefAppraiserCert') }]}>
            <div className="upload-card">
              <div>
                <span className="mr-1 text-4 text-white font-bold">{t('register.evaluator.chiefAppraiserCert')}</span>
                <span className="text-#EF4444">*</span>
              </div>
              <div className="mb-4 mt-1 text-sm text-#6B7280">
                {t('register.evaluator.businessLicense')}
              </div>
              <UploadMultifileCard
                className={cn(
                  'flex gap-3 [&>div>div>div>div]:b-2',
                  `${(errorFormItem.includes('chief_appraiser_certificate')) ? '[&>div>div>div>div]:b-#dc4446' : '[&>div>div>div>div]:b-#30363D'}`
                )}
                fileType="image/png,image/jpg,application/pdf"
                fileUrl={fileIsUrl(chiefAppraiserCertificate) ? [chiefAppraiserCertificate] : []}
                maxLength={1}
                width="100%"
                height="auto"
                loading={uploadFileLoading.includes(1)}
                removeFile={(_index) => {
                  form.setFieldValue(`chief_appraiser_certificate`, '')
                }}
                beforeUpload={(file) => {
                  uploadIdCardFile(file, `chief_appraiser_certificate`, 1)
                }}
              >
                <div className="py-3">
                  <div className="fcc pb-3">
                    <img src={userCardIcon} className="h-9" alt="" />
                  </div>
                  <div className="text-center text-sm text-#9CA3AF">{t('register.evaluator.uploadSignedAML')}</div>
                  <div className="text-center text-xs text-#6B7280">{t('register.evaluator.chiefAppraiserCert')}</div>
                </div>
              </UploadMultifileCard>
            </div>
          </FormItem>
          {/* 评估资质证书 */}
          <FormItem name="evaluation_qualification_certificate" rules={[{ required: true, message: t('register.evaluator.uploadAppraisalCert') }]}>
            <div className="upload-card">
              <div>
                <span className="mr-1 text-4 text-white font-bold">{t('register.evaluator.appraisalCert')}</span>
                <span className="text-#EF4444">*</span>
              </div>
              <div className="mb-4 mt-1 text-sm text-#6B7280">
                {t('register.evaluator.businessLicense')}
              </div>
              <UploadMultifileCard
                className={cn(
                  'flex gap-3 [&>div>div>div>div]:b-2',
                  `${(errorFormItem.includes('evaluation_qualification_certificate')) ? '[&>div>div>div>div]:b-#dc4446' : '[&>div>div>div>div]:b-#30363D'}`
                )}
                fileType="image/png,image/jpg,application/pdf"
                fileUrl={fileIsUrl(evaluationQualificationCertificate) ? [evaluationQualificationCertificate] : []}
                maxLength={1}
                width="100%"
                height="auto"
                loading={uploadFileLoading.includes(2)}
                removeFile={(_index) => {
                  form.setFieldValue(`evaluation_qualification_certificate`, '')
                }}
                beforeUpload={(file) => {
                  uploadIdCardFile(file, `evaluation_qualification_certificate`, 2)
                }}
              >
                <div className="py-3">
                  <div className="fcc pb-2">
                    <img src={fileIcon} className="h-9" alt="" />
                  </div>
                  <div className="text-center text-sm text-#9CA3AF">{t('register.evaluator.uploadSignedAML')}</div>
                  <div className="text-center text-xs text-#6B7280">{t('register.evaluator.appraisalCert')}</div>
                </div>
              </UploadMultifileCard>
            </div>
          </FormItem>
          {/* 反洗钱声明 */}
          <div className="upload-card mb-6">
            <div>
              <span className="mr-1 text-4 text-white font-bold">{t('register.evaluator.amlStatement')}</span>
              <span className="text-#EF4444">*</span>
            </div>
            <div className="mb-4 mt-1 text-sm text-#6B7280">
              {t('register.evaluator.amlStatement')}
            </div>

            <Form.Item
              valuePropName="checked"
              name="agree_aml_statement"
              className="mb-1"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(new Error(t('register.evaluator.readAMLTerms')))
                }
              ]}
            >
              <Checkbox defaultChecked={form.getFieldValue(`agree_asset_compliance`)} className="text-sm text-#D1D5DB">
                {t('register.evaluator.agreeAMLTerms')}
                {' '}
                <span className="text-#00E5FF">
                  《
                  {t('register.evaluator.amlTerms')}
                  》
                </span>
                {t('register.evaluator.followLaws')}
              </Checkbox>
            </Form.Item>
            <FormItem name="anti_money_laundering_statement" rules={[{ required: true, message: t('register.evaluator.uploadAMLStatement') }]}>
              <UploadMultifileCard
                className={cn(
                  'flex gap-3 [&>div>div>div>div]:b-2',
                  `${(errorFormItem.includes('anti_money_laundering_statement')) ? '[&>div>div>div>div]:b-#dc4446' : '[&>div>div>div>div]:b-#30363D'}`
                )}
                fileType="image/png,image/jpg,application/pdf"
                fileUrl={fileIsUrl(antiMoneyLaunderingStatement) ? [antiMoneyLaunderingStatement] : []}
                maxLength={1}
                width="100%"
                height="auto"
                loading={uploadFileLoading.includes(3)}
                removeFile={(_index) => {
                  form.setFieldValue(`anti_money_laundering_statement`, '')
                }}
                beforeUpload={(file) => {
                  uploadIdCardFile(file, `anti_money_laundering_statement`, 3)
                }}
              >
                <div className="py-3">
                  <div className="fcc pb-2">
                    <img src={signIcom} className="h-9" alt="" />
                  </div>
                  <div className="text-center text-sm text-#9CA3AF">{t('register.evaluator.uploadSignedAML')}</div>
                </div>
              </UploadMultifileCard>
            </FormItem>
          </div>
          {/* 服务协议签署 */}
          {/* <FormItem name="office_photo" rules={[{ required: true, message: t('register.evaluator.signServiceAgreement') }]}>
            <div className="upload-card">
              <div>
                <span className="text-4 text-white font-bold">
                  {t('register.evaluator.serviceAgreement')}
                  {' '}
                </span>
                <span className="text-#EF4444">*</span>
              </div>
              <div className="mb-4 mt-1 text-sm text-#6B7280">
                {t('register.evaluator.serviceAgreement')}
              </div>
              <div className="rounded-2 bg-#0D1117 p-4">
                <div className="text-4 text-#D1D5DB">{t('register.evaluator.serviceAgreementTitle')}</div>
                <div className="mt-3 text-3 text-#9CA3AF">{t('register.evaluator.serviceAgreementContent')}</div>
              </div>
              <Button className="mt-4 h-12 w-full fcc gap-2 bg-#00FF85 text-black">
                <img src={signTextIcom} className="w-5" alt="" />
                <span>{t('register.evaluator.onlineSign')}</span>
              </Button>
            </div>
          </FormItem> */}
          {/* 办公室照片 */}
          <FormItem name="officePhotos">
            <div className="upload-card">
              <div>
                <span className="text-4 text-white font-bold">{t('register.evaluator.officePhotos')}</span>
              </div>
              <div className="mb-4 mt-1 text-sm text-#6B7280">
                {t('register.evaluator.officePhotosDesc')}
              </div>
              <UploadMultifileCard
                className={cn(
                  'flex gap-3 [&>div>div>div>div]:b-2',
                  `${(errorFormItem.includes('officePhotos')) ? '[&>div>div>div>div]:b-#dc4446' : '[&>div>div>div>div]:b-#30363D'}`
                )}
                fileType="image/png,image/jpg,application/pdf"
                fileUrl={fileIsUrl(officePhotos) ? [officePhotos] : []}
                maxLength={1}
                width="100%"
                height="auto"
                loading={uploadFileLoading.includes(4)}
                removeFile={(_index) => {
                  form.setFieldValue(`officePhotos`, '')
                }}
                beforeUpload={(file) => {
                  uploadIdCardFile(file, `officePhotos`, 4)
                }}
              >
                <div className="py-3">
                  <div className="fcc pb-2">
                    <img src={componyIcom} className="h-9" alt="" />
                  </div>
                  <div className="text-center text-sm text-#9CA3AF">{t('register.evaluator.uploadSignedAML')}</div>
                </div>
              </UploadMultifileCard>
            </div>
          </FormItem>
          <Form.Item
            className="mb-2"
            valuePropName="checked"
            name="service_agreement_status"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(new Error(t('register.asset.amlCommitmentPlaceholder')))
              }
            ]}
          >
            <div>
              <div className="w-full fyc justify-between text-sm text-primary">
                <Checkbox defaultChecked={form.getFieldValue(`service_agreement_status`)} className="text-sm text-#D1D5DB">
                  {t('register.asset.agreeAML')}
                  <span className="text-#00E5FF">
                    {t('register.evaluator.serviceAgreementTitle')}
                  </span>
                </Checkbox>
                <div className="clickable">{t('register.asset.readAMLTerms')}</div>
              </div>
              {/* 最多两行，超出显示... */}
              <div className="[-webkit-box-orient:vertical] [-webkit-line-clamp:2] [display:-webkit-box] mt-3 overflow-hidden text-sm text-#6B7280">
                {t('register.asset.amlTerms')}
              </div>
            </div>
          </Form.Item>
          <Form.Item
            valuePropName="checked"
            name="agree_asset_compliance"
            className="mb-1"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(new Error(t('register.asset.complianceDeclarationPlaceholder')))
              }
            ]}
          >
            <Checkbox defaultChecked={form.getFieldValue(`agreementFirst`)} className="text-sm text-#D1D5DB">
              {t('register.asset.agreeCompliance')}
              <span className="text-#00E5FF">
                《
                {t('register.asset.complianceDeclaration')}
                》
              </span>
            </Checkbox>
          </Form.Item>
          <Form.Item>
            <div className="text-end">
              <Button loading={sumbitLoading} type="primary" htmlType="submit" className="h-10.5 px-4 text-base text-black">
                {t('register.evaluator.submit')}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>

    </div>
  )
}
