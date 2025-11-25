import type { FormInstance, RuleObject } from 'antd/es/form'
import componyIcon from '@/assets/images/compony.png'
import componyIcom from '@/assets/images/register/compony-grey.png'
import fileIcon from '@/assets/images/register/file.png'
import userCardIcon from '@/assets/images/register/userCard.png'
import signTextIcom from '@/assets/images/register/userSign-text.png'
import signIcom from '@/assets/images/register/userSign.png'
import { screenToTop } from '@/utils'
import { Button, Checkbox, DatePicker, Form, Input, Select } from 'antd'
import FormItem from 'antd/es/form/FormItem'
import { AnimatePresence, motion } from 'framer-motion'
import UploadMultifileCard from '../common/upload/uploa-multifile-card'
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
  const [step, setStep] = useState(0)
  const [isSuccess, setIsSuccess] = useState(false)
  const [registerStatus, setRegisterStatus] = useState(1)
  const [errorMessage, setErrorMessage] = useState('机构资质审核失败')

  const onFinish = (values: any) => {
    console.log('✅ 表单通过验证:', values)
    setIsSuccess(true)
    setRegisterStatus(1)
    setErrorMessage('')
  }

  useEffect(() => {
    return () => {
      setIsSuccess(false)
    }
  }, [])

  return (
    <div className="mt-6 fccc px-66 pb-53 max-md:px-4">

      <AnimatePresence mode="wait">
        {step === 0 && (
          <AnimationComponent animKey="firstStep" className="w-full">
            <FirstStep
              form={firstForm}
              back={back}
              onFinish={() => {
                setStep(1)
                screenToTop()
              }}
            />
          </AnimationComponent>
        )}
        {step === 1 && (
          <AnimationComponent animKey="secondStep" className="w-full">
            <SecondStep form={secondForm} back={() => setStep(0)} onFinish={onFinish} />
          </AnimationComponent>
        )}
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
          text: '进入资产上传中心',
          onClick: () => {
          // TODO 跳转进入资产上传中心
          }
        }}
      />
    </div>
  )
}

// 第一个表单
function FirstStep({ form, back, onFinish }: { form: FormInstance<any>, back: () => void, onFinish: (values?: any) => void }) {
  const { t } = useTranslation()
  const subjectTypeList = [
    {
      value: '1',
      label: '主体类型1'
    },
    {
      value: '2',
      label: '主体类型2'
    }
  ]

  const changeCity = (val: string, index: number) => {
    const city = (form.getFieldValue('city') as string || ',,').split(',')
    city[index] = val
    form.setFieldValue('city', city.join(','))
  }

  const cityRule = (_rule: RuleObject, value: string) => {
    const city = value?.split(',') || []

    if (!city[0]) {
      return Promise.reject(t('register.evaluator.selectCountryPlaceholder'))
    }
    if (!city[1]) {
      return Promise.reject(t('register.evaluator.selectProvincePlaceholder'))
    }
    if (!city[2]) {
      return Promise.reject(t('register.evaluator.selectCityPlaceholder'))
    }
    return Promise.resolve()
  }
  return (
    <div>
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
            <Form.Item
              required
              label={t('register.evaluator.companyName')}
              name="componyName"
              rules={[{ required: true, message: t('register.evaluator.companyName') }]}
            >
              <Input placeholder={t('register.evaluator.businessLicenseMatch')} />
            </Form.Item>
            <Form.Item
              required
              label={t('register.evaluator.entityType')}
              name="type"
              rules={[{ required: true, message: t('register.evaluator.selectEntityTypepPlaceholder') }]}
            >
              <Select
                placeholder={t('register.evaluator.selectEntityTypepPlaceholder')}
                options={subjectTypeList}
              />
            </Form.Item>
            <Form.Item
              required
              label={t('register.asset.creditCode')}
              name="creditCode"
              rules={[{ required: true, message: t('register.asset.creditCodePlaceholder') }]}
            >
              <Input
                placeholder={t('register.asset.creditCodePlaceholder')}
              />
            </Form.Item>
            <Form.Item
              required
              label={t('register.evaluator.contactName')}
              name="contactName"
              rules={[{ required: true, message: t('register.evaluator.enterContactNamePlaceholder') }]}
            >
              <Input
                placeholder={t('register.evaluator.enterContactNamePlaceholder')}
              />
            </Form.Item>
            <Form.Item
              required
              label={t('register.asset.phone')}
              name="phone"
              rules={[{ required: true, message: t('register.asset.phonePlaceholder') }]}
            >
              <Input
                placeholder={t('register.asset.phonePlaceholder')}
              />
            </Form.Item>
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
          <Form.Item
            required
            label={t('register.evaluator.country')}
            name="country"
            rules={[
              { validator: cityRule }
            ]}
          >
            <div className="grid grid-cols-3 gap-3">
              <Select
                placeholder={t('register.evaluator.country')}
                onChange={val => changeCity(val, 0)}
                options={subjectTypeList}
              />
              <Select
                placeholder={t('register.evaluator.province')}
                onChange={val => changeCity(val, 1)}
                options={subjectTypeList}
              />
              <Select
                placeholder={t('register.evaluator.city')}
                onChange={val => changeCity(val, 2)}
                options={subjectTypeList}
              />
            </div>
          </Form.Item>
          <Form.Item label={t('register.evaluator.address')} name="address">
            <Input
              placeholder={t('register.evaluator.enterAddressPlaceholder')}
            />
          </Form.Item>
          <div className="grid grid-cols-2 gap-6">
            <Form.Item
              required
              label={t('register.evaluator.establishmentYear')}
              name="date"
              rules={[{ required: true, message: t('register.evaluator.selectEstablishmentYearPlaceholder') }]}
            >
              <DatePicker placeholder={t('register.evaluator.selectEstablishmentYearPlaceholder')} className="h-12.5 w-full b-#374151 bg-#1E2328 [&>div>input]:!bg-transparent" />
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
export function SecondStep({ form, back, onFinish }: { form: FormInstance<any>, back: () => void, onFinish: (values: any) => void }) {
  const { t } = useTranslation()
  const [errorFormItem, setErrorFormItem] = useState<string[]>([])
  const onFinishFailed = (errorInfo: any) => {
    let errorList = [] as string[];
    (errorInfo.errorFields as any[]).forEach((res: any) => {
      errorList = errorList.concat(res.name)
    })
    setErrorFormItem(errorList)
    console.log('❌ 验证失败:', errorInfo, errorList)
  }

  return (
    <div>
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
        <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}>
          <FormItem name="businessLicense" rules={[{ required: true, message: <div>{t('register.evaluator.uploadBusinessLicense')}</div> }]}>
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
                  `${(errorFormItem.includes('businessLicense')) ? '[&>div>div>div>div]:b-#dc4446' : '[&>div>div>div>div]:b-#30363D'}`
                )}
                fileType="image/png,image/jpg,application/pdf"
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
                  <div className="text-center text-sm text-#9CA3AF">{t('register.evaluator.uploadSignedAML')}</div>
                  <div className="text-center text-xs text-#6B7280">{t('register.evaluator.businessLicense')}</div>
                </div>
              </UploadMultifileCard>
            </div>
          </FormItem>
          <FormItem name="certificate1" rules={[{ required: true, message: t('register.evaluator.uploadChiefAppraiserCert') }]}>
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
                  `${(errorFormItem.includes('certificate1')) ? '[&>div>div>div>div]:b-#dc4446' : '[&>div>div>div>div]:b-#30363D'}`
                )}
                fileType="image/png,image/jpg,application/pdf"
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
                  <div className="fcc pb-3">
                    <img src={userCardIcon} className="h-9" alt="" />
                  </div>
                  <div className="text-center text-sm text-#9CA3AF">{t('register.evaluator.uploadSignedAML')}</div>
                  <div className="text-center text-xs text-#6B7280">{t('register.evaluator.chiefAppraiserCert')}</div>
                </div>
              </UploadMultifileCard>
            </div>
          </FormItem>
          <FormItem name="certificate2" rules={[{ required: true, message: t('register.evaluator.uploadAppraisalCert') }]}>
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
                  `${(errorFormItem.includes('certificate2')) ? '[&>div>div>div>div]:b-#dc4446' : '[&>div>div>div>div]:b-#30363D'}`
                )}
                fileType="image/png,image/jpg,application/pdf"
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
                    <img src={fileIcon} className="h-9" alt="" />
                  </div>
                  <div className="text-center text-sm text-#9CA3AF">{t('register.evaluator.uploadSignedAML')}</div>
                  <div className="text-center text-xs text-#6B7280">{t('register.evaluator.appraisalCert')}</div>
                </div>
              </UploadMultifileCard>
            </div>
          </FormItem>
          <div className="upload-card mb-6">
            <div>
              <span className="mr-1 text-4 text-white font-bold">{t('register.evaluator.amlStatement')}</span>
              <span className="text-#EF4444">*</span>
            </div>
            <div className="mb-4 mt-1 text-sm text-#6B7280">
              {t('register.evaluator.amlStatement')}
            </div>
            <Form.Item valuePropName="checked" name="agreement" className="mb-1" rules={[{ required: true, message: t('register.evaluator.readAMLTerms') }]}>
              <Checkbox className="text-sm text-#D1D5DB">
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
            <FormItem name="declaration" rules={[{ required: true, message: t('register.evaluator.uploadAMLStatement') }]}>
              <UploadMultifileCard
                className={cn(
                  'flex gap-3 [&>div>div>div>div]:b-2',
                  `${(errorFormItem.includes('declaration')) ? '[&>div>div>div>div]:b-#dc4446' : '[&>div>div>div>div]:b-#30363D'}`
                )}
                fileType="image/png,image/jpg,application/pdf"
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
                    <img src={signIcom} className="h-9" alt="" />
                  </div>
                  <div className="text-center text-sm text-#9CA3AF">{t('register.evaluator.uploadSignedAML')}</div>
                </div>
              </UploadMultifileCard>
            </FormItem>
          </div>
          <FormItem name="userSign" rules={[{ required: true, message: t('register.evaluator.signServiceAgreement') }]}>
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
          </FormItem>
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
                    <img src={componyIcom} className="h-9" alt="" />
                  </div>
                  <div className="text-center text-sm text-#9CA3AF">{t('register.evaluator.uploadSignedAML')}</div>
                </div>
              </UploadMultifileCard>
            </div>
          </FormItem>
          <Form.Item>
            <div className="text-end">
              <Button type="primary" htmlType="submit" className="h-10.5 px-4 text-base text-black">
                {t('register.evaluator.submit')}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>

    </div>
  )
}
