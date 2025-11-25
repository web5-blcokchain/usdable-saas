import type { RuleObject } from 'antd/es/form'
import companyIcom from '@/assets/images/compony.png'
import fileIcon from '@/assets/images/register/file-blue.png'
import lawyerIcon from '@/assets/images/register/lawyer.png'
import { Button, Checkbox, Divider, Form, Input, Select } from 'antd'
import UploadMultifileCard from '../common/upload/uploa-multifile-card'
import { RegisterStatus } from './registerStatus'

// 律师事务所注册
export function LawOfficeRegister({ back }: { back: () => void }) {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [isSuccess, setIsSuccess] = useState(false)
  const [registerStatus, setRegisterStatus] = useState(1)
  const [errorMessage, setErrorMessage] = useState('未找到工商登记记录，请检查公司名称或营业执照号')
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

  const onFinish = (values: any) => {
    console.log('✅ 表单通过验证:', values)
    setIsSuccess(true)
    setRegisterStatus(1)
    setErrorMessage('')
  }

  const [errorFormItem, setErrorFormItem] = useState<string[]>([])
  const onFinishFailed = (errorInfo: any) => {
    let errorList = [] as string[];
    (errorInfo.errorFields as any[]).forEach((res: any) => {
      errorList = errorList.concat(res.name)
    })
    setErrorFormItem(errorList)
    console.log('❌ 验证失败:', errorInfo, errorList)
  }

  const fileValidator = (_: RuleObject, value: string[]) => {
    const file = value || []
    if (!file[0]) {
      return Promise.reject(t('register.lawOffice.uploadOfficeLicenseError'))
    }
    else if (!file[1]) {
      return Promise.reject(t('register.lawOffice.uploadLawyerLicenseError'))
    }
    if (!file[2]) {
      return Promise.reject(t('register.lawOffice.uploadBarProofError'))
    }
    return Promise.resolve()
  }

  useEffect(() => {
    return () => {
      setIsSuccess(false)
    }
  }, [])

  return (
    <div className="mt-6 fccc px-66 pb-53 max-md:px-4">
      <div className="w-full">
        <div onClick={back} className="w-fit fcc gap-1 clickable">
          <div className="i-ic:round-arrow-back text-6 text-white"></div>
          <div>{t('register.lawOffice.back')}</div>
        </div>
      </div>
      <div className="text-center text-12 font-600 leading-18 max-md:text-3xl">{t('register.lawOffice.title')}</div>
      <div className="mt-10 w-full b-2 b-#31363c rounded-lg b-solid bg-#161B2199 p-12 max-md:px-4">
        <div className="fyc gap-3 text-lg font-600">
          <img src={companyIcom} className="h-6" alt="" />
          <div>{t('register.lawOffice.basicInfo')}</div>
        </div>
        <Form form={form} layout="vertical" className="mt-6" onFinish={onFinish} onFinishFailed={onFinishFailed}>
          <div className="grid cols-2 gap-x-6 max-md:cols-1 max-md:gap-0">
            <Form.Item
              required
              name="name"
              label={t('register.lawOffice.officeName')}
              rules={[{
                required: true,
                message: <div>{t('register.lawOffice.officeNamePlaceholder')}</div>
              }]}
            >
              <Input className="h-12.5 b-#374151 bg-#1E2328" placeholder={t('register.lawOffice.officeNamePlaceholder')} />
            </Form.Item>
            <Form.Item required name="address" label={t('register.lawOffice.registrationAddress')} rules={[{ required: true, message: t('register.lawOffice.registrationAddressPlaceholder') }]}>
              <Select
                placeholder={t('register.lawOffice.registrationAddressPlaceholder')}
                options={subjectTypeList}
              />
            </Form.Item>
          </div>
          <Form.Item required name="licenseNumber" label={t('register.lawOffice.licenseNumber')} rules={[{ required: true, message: t('register.lawOffice.licenseNumberPlaceholder') }]}>
            <div className="relative">
              <Input className="h-12.5 b-#374151 bg-#1E2328" placeholder={t('register.lawOffice.licenseNumberPlaceholder')}></Input>
              <Button className="absolute right-3 top-1/2 transform-translate-y--50% b-#00E6FF33 bg-#00E6FF33 px-3 py-1 text-3 text-#00E5FF">验证</Button>
            </div>
          </Form.Item>
          <div className="grid cols-2 gap-x-6 max-md:cols-1 max-md:gap-0">
            <Form.Item required name="contact" label={t('register.lawOffice.contact')} rules={[{ required: true, message: t('register.lawOffice.contactPlaceholder') }]}>
              <Input className="h-12.5 b-#374151 bg-#1E2328" placeholder={t('register.lawOffice.contactPlaceholder')} />
            </Form.Item>
          </div>
          <Divider className="my-9 max-md:my-6" />
          <div className="mb-6 fyc gap-3 text-lg font-600">
            <img src={lawyerIcon} className="h-6" alt="" />
            <div>{t('register.lawOffice.leadLawyerInfo')}</div>
          </div>
          <div className="grid cols-2 gap-x-6 max-md:grid-cols-1 max-md:gap-0">
            <Form.Item required name="lawyeName" label={t('register.lawOffice.lawyerName')} rules={[{ required: true, message: t('register.lawOffice.lawyerNamePlaceholder') }]}>
              <Input className="h-12.5 b-#374151 bg-#1E2328" placeholder={t('register.lawOffice.lawyerNamePlaceholder')} />
            </Form.Item>
            <Form.Item required name="lawyeLicenseNumber" label={t('register.lawOffice.licenseNo')} rules={[{ required: true, message: t('register.lawOffice.licenseNoPlaceholder') }]}>
              <Input className="h-12.5 b-#374151 bg-#1E2328" placeholder={t('register.lawOffice.licenseNoPlaceholder')} />
            </Form.Item>
            <Form.Item required name="lawyeLicenseAge" label={t('register.lawOffice.yearsOfPractice')} rules={[{ required: true, message: t('register.lawOffice.yearsOfPracticePlaceholder') }]}>
              <Select
                placeholder={t('register.lawOffice.yearsOfPracticePlaceholder')}
                options={subjectTypeList}
              />
            </Form.Item>
            <Form.Item required name="lawyeLicenseType" label={t('register.lawOffice.specialization')} rules={[{ required: true, message: t('register.lawOffice.specializationPlaceholder') }]}>
              <Select
                placeholder={t('register.lawOffice.specializationPlaceholder')}
                options={subjectTypeList}
              />
            </Form.Item>
            <Form.Item required name="lawyePhone" label={t('register.lawOffice.phone')} rules={[{ required: true, message: t('register.asset.phonePlaceholder') }]}>
              <Input className="h-12.5 b-#374151 bg-#1E2328" placeholder={t('register.asset.phonePlaceholder')} />
            </Form.Item>
            <Form.Item required name="lawyeEmail" label={t('register.lawOffice.email')} rules={[{ required: true, message: t('register.asset.emailPlaceholder') }]}>
              <Input className="h-12.5 b-#374151 bg-#1E2328" placeholder={t('register.asset.emailPlaceholder')} />
            </Form.Item>
          </div>
          <Divider className="my-9 max-md:my-6" />
          <div className="mb-6 fyc gap-3 text-lg font-600">
            <img src={fileIcon} className="h-6" alt="" />
            <div>{t('register.lawOffice.uploadCredentials')}</div>
          </div>
          <Form.Item
            required
            name="certificates"
            rules={[{
              // 自定义验证
              validator: fileValidator
            }]}
          >
            <div className="fccc gap-6 [&>div]:w-full">
              <UploadMultifileCard
                className={cn(
                  'flex gap-3 [&>div>div>div>div]:b-2',
                  `${(errorFormItem.includes('certificates') && !form.getFieldValue('certificates')?.[0]) ? '[&>div>div>div>div]:b-#dc4446' : '[&>div>div>div>div]:b-#30363D'}`
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
                <div className="w-full px-6.5">
                  <div className="mb-4 fccc gap-2">
                    <img className="h-10" src={new URL('@/assets/images/register/compony-grey.png', import.meta.url).href} alt="" />
                    <div className="fcc gap-1 text-sm text-#8B949E">
                      <span>{t('register.lawOffice.officeLicense')}</span>
                      <span className="text-#EF4444">*</span>
                    </div>
                  </div>
                  <div className="w-full rounded-2 bg-#1E242880 px-3 py-10">
                    <div className="fcc pb-2">
                      <img className="h-10" src={new URL('@/assets/images/register/cloud.png', import.meta.url).href} alt="" />
                    </div>
                    <div className="w-full overflow-hidden text-center text-sm text-#9CA3AF">{t('register.lawOffice.uploadOfficeLicense')}</div>
                    <div className="w-full overflow-hidden text-center text-xs text-#6B7280">{t('register.lawOffice.fileSupport')}</div>
                  </div>
                </div>
              </UploadMultifileCard>
              <UploadMultifileCard
                className={cn(
                  'flex gap-3 [&>div>div>div>div]:b-2',
                  `${(errorFormItem.includes('certificates') && !form.getFieldValue('certificates')?.[1]) ? '[&>div>div>div>div]:b-#dc4446' : '[&>div>div>div>div]:b-#30363D'}`
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
                <div className="w-full px-6.5">
                  <div className="mb-4 fccc gap-2">
                    <img className="h-10" src={new URL('@/assets/images/register/userCard.png', import.meta.url).href} alt="" />
                    <div className="fcc gap-1 text-sm text-#8B949E">
                      <span>{t('register.lawOffice.leadLawyerLicense')}</span>
                      <span className="text-#EF4444">*</span>
                    </div>
                  </div>
                  <div className="w-full rounded-2 bg-#1E242880 px-3 py-10">
                    <div className="fcc pb-2">
                      <img className="h-10" src={new URL('@/assets/images/register/cloud.png', import.meta.url).href} alt="" />
                    </div>
                    <div className="w-full overflow-hidden text-center text-sm text-#9CA3AF">{t('register.lawOffice.uploadLawyerLicense')}</div>
                    <div className="w-full overflow-hidden text-center text-xs text-#6B7280">{t('register.lawOffice.fileSupport')}</div>
                  </div>
                </div>
              </UploadMultifileCard>
              <UploadMultifileCard
                className={cn(
                  'flex gap-3 [&>div>div>div>div]:b-2',
                  `${(errorFormItem.includes('certificates') && !form.getFieldValue('certificates')?.[2]) ? '[&>div>div>div>div]:b-#dc4446' : '[&>div>div>div>div]:b-#30363D'}`
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
                <div className="w-full px-6.5">
                  <div className="mb-4 fccc gap-2">
                    <img className="h-10" src={new URL('@/assets/images/register/thorn.png', import.meta.url).href} alt="" />
                    <div className="fcc gap-1 text-sm text-#8B949E">
                      <span>{t('register.lawOffice.barAssociationProof')}</span>
                      <span className="text-#EF4444">*</span>
                    </div>
                  </div>
                  <div className="w-full rounded-2 bg-#1E242880 px-3 py-10">
                    <div className="fcc pb-2">
                      <img className="h-10" src={new URL('@/assets/images/register/cloud.png', import.meta.url).href} alt="" />
                    </div>
                    <div className="w-full overflow-hidden text-center text-sm text-#9CA3AF">{t('register.lawOffice.uploadBarProof')}</div>
                    <div className="w-full overflow-hidden text-center text-xs text-#6B7280">{t('register.lawOffice.fileSupport')}</div>
                  </div>
                </div>
              </UploadMultifileCard>
            </div>
          </Form.Item>
          <div className="fyc gap-3 text-6">
            <div className="i-ep:success-filled text-6 text-#69e2fc"></div>
            <div>{t('register.lawOffice.complianceCommitment')}</div>
          </div>
          <div className="mt-6 rounded-2 bg-#1E242880 p-6">
            <div className="mb-3 text-base">{t('register.lawOffice.complianceCommitment')}</div>
            <Form.Item valuePropName="checked" name="agreementFirst" className="mb-1" rules={[{ required: true, message: t('register.lawOffice.readServiceAgreement') }]}>
              <div className="fyc">
                <Checkbox className="text-sm text-#D1D5DB">
                  {t('register.lawOffice.agreeTerms')}
                  <span className="text-#00E5FF">
                    《
                    {t('register.lawOffice.legalServiceAgreement')}
                    》
                  </span>
                </Checkbox>
                <span className="text-sm text-#EF4444">*</span>
              </div>
            </Form.Item>
            <Form.Item valuePropName="checked" name="agreementSecond" className="mb-0" rules={[{ required: true, message: t('register.lawOffice.agreeTermsError') }]}>
              <div className="fyc">
                <Checkbox className="text-sm text-#D1D5DB">{t('register.lawOffice.agreeNotarization')}</Checkbox>
                <span className="text-sm text-#EF4444">*</span>
              </div>
            </Form.Item>
          </div>
          <div className="mt-6 b b-#00FF844D rounded-2 b-solid bg-#00FF891A p-6">
            <div className="fyc gap-2 text-4 text-white font-500">
              <div className="i-akar-icons:info-fill text-4 text-#75fb92"></div>
              <div>{t('register.lawOffice.registrationNotice')}</div>
            </div>
            <div className="ml-6 mt-2 text-sm text-#8B949E">
              <p>{t('register.lawOffice.notice1')}</p>
              <p>{t('register.lawOffice.notice2')}</p>
              <p>{t('register.lawOffice.notice3')}</p>
            </div>
          </div>
          <Form.Item className="mt-32">
            <div className="text-end">
              <Button type="primary" htmlType="submit" className="h-10.5 px-4 text-base text-black">
                {t('register.lawOffice.submit')}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
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
          text: t('register.asset.enterAssetCenter'),
          onClick: () => {
            // TODO 跳转进入资产上传中心
          }
        }}
      />
    </div>
  )
}
