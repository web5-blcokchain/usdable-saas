import type { UserRegisterModel } from '@/api/apiMyInfoApi'
import apiMyInfoApi from '@/api/apiMyInfoApi'
import { getLocation, uploadFile } from '@/api/common'
import companyIcom from '@/assets/images/compony.png'
import fileIcon from '@/assets/images/register/file-blue.png'
import lawyerIcon from '@/assets/images/register/lawyer.png'
import UploadMultifileCard from '@/components/common/upload/uploa-multifile-card'
import { USER_AGREE } from '@/enums/common'
import { USER_AUDIT_STATUS } from '@/enums/user'
import { useUserStore } from '@/stores/user'
import { envConfig } from '@/utils/envConfig'
import { getToken } from '@/utils/user'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Button, Checkbox, Divider, Form, Input, Select } from 'antd'
import { useWatch } from 'antd/es/form/Form'
import { RegisterStatus } from './registerStatus'

// 律师事务所注册
export function LawOfficeRegister({ back }: { back: () => void }) {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [isSuccess, setIsSuccess] = useState(false)
  const [registerStatus, setRegisterStatus] = useState(1)
  const [errorMessage, setErrorMessage] = useState(
    '未找到工商登记记录，请检查公司名称或营业执照号'
  )
  const navigate = useNavigate()

  // 生成执业年限
  const subjectTypeList = Array.from({ length: 20 }, (_, i) => {
    return {
      value: i + 1,
      label: <div>{`${i + 1}${t('common.year')}${i === 19 ? '+' : ''}`}</div>
    }
  })

  // 获取专业领域类型 specialize
  const { data: entitySpecialtyList, isFetching: entitySpecialtyListLoading }
    = useQuery({
      queryKey: ['getEntityTypeSpecialty'],
      queryFn: async () => {
        const data = await apiMyInfoApi.getEntityTypeSpecialty()
        return data.data
      },
      select: (data) => {
        return data?.map(item => ({
          value: item.id,
          label: (
            <div>
              {i18n.language === 'en'
                ? item.name_en
                : i18n.language === 'zh'
                  ? item.name_zh_cn
                  : item.name_ja}
            </div>
          )
        }))
      }
    })
  // 获取国家列表
  const { data: countryList, isFetching: locationDataLoading } = useQuery({
    queryKey: ['getLocation'],
    queryFn: async () => {
      const data = await getLocation({
        level: 2
      })
      return data.data
    },
    select(data) {
      // 处理数据,
      const newData
        = data?.map(item => ({
          value: item.id,
          label: item.name
        })) || ([] as any[])
      return newData
    }
  })

  const { userData } = useUserStore()
  // 用户注册
  const { mutateAsync: userResgiter, isPending: isRegistering } = useMutation({
    mutationKey: ['userRegitser'],
    mutationFn: async (values: UserRegisterModel) => {
      // 判断用户是否是被拒后，再次申请
      return userData?.user?.audit_status !== USER_AUDIT_STATUS.REJECT
        ? apiMyInfoApi.regitser(values)
        : apiMyInfoApi.resubmitRegister(values)
    }
  })

  // 表单提交
  const onFinish = async (values: any) => {
    const data = {
      ...values,
      type: '5',
      token: getToken() || '',
      agree_compliance_promise: values.agree_compliance_promise
        ? USER_AGREE.YES
        : USER_AGREE.NO,
      agree_asset_compliance: values.agree_asset_compliance
        ? USER_AGREE.YES
        : USER_AGREE.NO,
      agree_aml_statement: values.agree_aml_statement
        ? USER_AGREE.YES
        : USER_AGREE.NO,
      agree_service_terms: values.agree_service_terms
        ? USER_AGREE.YES
        : USER_AGREE.NO
    }

    await userResgiter({
      ...data
    }).then((res) => {
      if (res.code === 1) {
        setIsSuccess(true)
        setRegisterStatus(0)
        setErrorMessage('')
      }
    })
  }

  const [errorFormItem, setErrorFormItem] = useState<string[]>([])
  // 表单验证失败
  const onFinishFailed = (errorInfo: any) => {
    let errorList = [] as string[]
    ;(errorInfo.errorFields as any[]).forEach((res: any) => {
      errorList = errorList.concat(res.name)
    })
    setErrorFormItem(errorList)
    console.log('❌ 验证失败:', errorInfo, errorList)
    toast.error(t('common.formDataError'))
  }

  // 文件上传
  const { mutateAsync: uploadIdCardFileMutate } = useMutation({
    mutationKey: ['uploadFile'],
    mutationFn: async (data: { file: File }) => {
      const formData = new FormData()
      formData.append('file', data.file)
      return uploadFile(formData)
    }
  })
  const [uploadFileLoading, setUploadFileLoading] = useState([] as number[])
  const firmLicenseFile = useWatch('firm_license_file', form)
  const lawyerLicenseFile = useWatch('lawyer_license_file', form)
  const businessLicenseFile = useWatch('bar_membership_file', form)

  // 文件上传
  async function uploadIdCardFile(data: File, name: string, index: number) {
    setUploadFileLoading(prev => [...prev, index])
    await uploadIdCardFileMutate({ file: data })
      .then((res) => {
        if (res.code === 1) {
          form.setFieldValue(name, res.data?.file.full_url)
        }
      })
      .finally(() => {
        setUploadFileLoading(prev => prev.filter(item => item !== index))
      })
  }

  // 判断是否为图片
  const fileIsUrl = (url: string) => {
    return url && url.includes(envConfig.imageApiUrl)
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
          <div className="i-ic:round-arrow-back text-5 text-white"></div>
          <div className="text-xl">{t('register.lawOffice.back')}</div>
        </div>
      </div>
      <div className="text-center text-12 font-600 leading-18 max-md:text-3xl">
        {t('register.lawOffice.title')}
      </div>
      <div className="mt-10 w-full b-2 b-#31363c rounded-lg b-solid bg-#161B2199 p-12 max-md:px-4">
        <div className="fyc gap-3 text-lg font-600">
          <img src={companyIcom} className="h-6" alt="" />
          <div>{t('register.lawOffice.basicInfo')}</div>
        </div>
        <Form
          form={form}
          layout="vertical"
          className="mt-6"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <div className="grid cols-2 gap-x-6 max-md:cols-1 max-md:gap-0">
            {/* 律所名字 */}
            <Form.Item
              required
              name="lawyer_name"
              label={t('register.lawOffice.officeName')}
              rules={[
                {
                  required: true,
                  message: (
                    <div>{t('register.lawOffice.officeNamePlaceholder')}</div>
                  )
                }
              ]}
            >
              <Input
                className="h-12.5 b-#374151 bg-#1E2328"
                placeholder={t('register.lawOffice.officeNamePlaceholder')}
              />
            </Form.Item>
            {/* 注册国家地址 */}
            <Form.Item
              required
              name="country"
              label={t('register.lawOffice.registrationAddress')}
              rules={[
                {
                  required: true,
                  message: t(
                    'register.lawOffice.registrationAddressPlaceholder'
                  )
                }
              ]}
            >
              <Select
                placeholder={t(
                  'register.lawOffice.registrationAddressPlaceholder'
                )}
                options={countryList}
                loading={locationDataLoading}
              />
            </Form.Item>
          </div>
          {/* 律所执业许可证号 */}
          <Form.Item
            required
            name="practice_license_number"
            label={t('register.lawOffice.licenseNumber')}
            rules={[
              {
                required: true,
                message: t('register.lawOffice.licenseNumberPlaceholder')
              }
            ]}
          >
            <div className="relative">
              <Input
                className="h-12.5 b-#374151 bg-#1E2328"
                placeholder={t('register.lawOffice.licenseNumberPlaceholder')}
              >
              </Input>
              {/* <Button className="absolute right-3 top-1/2 transform-translate-y--50% b-#00E6FF33 bg-#00E6FF33 px-3 py-1 text-3 text-#00E5FF">验证</Button> */}
            </div>
          </Form.Item>
          {/* 律所联系方式 */}
          <div className="grid cols-2 gap-x-6 max-md:cols-1 max-md:gap-0">
            <Form.Item
              required
              name="lawyer_phone"
              label={t('register.lawOffice.contact')}
              rules={[
                {
                  required: true,
                  message: t('register.lawOffice.contactPlaceholder')
                }
              ]}
            >
              <Input
                className="h-12.5 b-#374151 bg-#1E2328"
                placeholder={t('register.lawOffice.contactPlaceholder')}
              />
            </Form.Item>
          </div>
          <Divider className="my-9 max-md:my-6" />
          <div className="mb-6 fyc gap-3 text-lg font-600">
            <img src={lawyerIcon} className="h-6" alt="" />
            <div>{t('register.lawOffice.leadLawyerInfo')}</div>
          </div>
          <div className="grid cols-2 gap-x-6 max-md:grid-cols-1 max-md:gap-0">
            {/* 律师姓名 */}
            <Form.Item
              required
              name="nickname"
              label={t('register.lawOffice.lawyerName')}
              rules={[
                {
                  required: true,
                  message: t('register.lawOffice.lawyerNamePlaceholder')
                }
              ]}
            >
              <Input
                className="h-12.5 b-#374151 bg-#1E2328"
                placeholder={t('register.lawOffice.lawyerNamePlaceholder')}
              />
            </Form.Item>
            {/* 律师执业证号 */}
            <Form.Item
              required
              name="lawyer_license_no"
              label={t('register.lawOffice.licenseNo')}
              rules={[
                {
                  required: true,
                  message: t('register.lawOffice.licenseNoPlaceholder')
                }
              ]}
            >
              <Input
                className="h-12.5 b-#374151 bg-#1E2328"
                placeholder={t('register.lawOffice.licenseNoPlaceholder')}
              />
            </Form.Item>
            {/* 律师执业年限 */}
            <Form.Item
              required
              name="lawyer_practice_years"
              label={t('register.lawOffice.yearsOfPractice')}
              rules={[
                {
                  required: true,
                  message: t('register.lawOffice.yearsOfPracticePlaceholder')
                }
              ]}
            >
              <Select
                placeholder={t('register.lawOffice.yearsOfPracticePlaceholder')}
                options={subjectTypeList}
              />
            </Form.Item>
            {/* 专业领域 */}
            <Form.Item
              required
              name="specialty"
              label={t('register.lawOffice.specialization')}
              rules={[
                {
                  required: true,
                  message: t('register.lawOffice.specializationPlaceholder')
                }
              ]}
            >
              <Select
                placeholder={t('register.lawOffice.specializationPlaceholder')}
                options={entitySpecialtyList}
                loading={entitySpecialtyListLoading}
              />
            </Form.Item>
            {/* 律师手机号 */}
            <Form.Item
              required
              name="mobile"
              label={t('register.lawOffice.phone')}
              rules={[
                {
                  required: true,
                  message: t('register.asset.phonePlaceholder')
                }
              ]}
            >
              <Input
                className="h-12.5 b-#374151 bg-#1E2328"
                placeholder={t('register.asset.phonePlaceholder')}
              />
            </Form.Item>
            {/* 律师邮箱 */}
            <Form.Item
              required
              name="email"
              label={t('register.lawOffice.email')}
              rules={[
                {
                  required: true,
                  message: t('register.asset.emailPlaceholder')
                }
              ]}
            >
              <Input
                className="h-12.5 b-#374151 bg-#1E2328"
                placeholder={t('register.asset.emailPlaceholder')}
              />
            </Form.Item>
          </div>
          <Divider className="my-9 max-md:my-6" />
          <div className="mb-6 fyc gap-3 text-lg font-600">
            <img src={fileIcon} className="h-6" alt="" />
            <div>{t('register.lawOffice.uploadCredentials')}</div>
          </div>
          <Form.Item required>
            <div className="fccc gap-6 [&>div]:w-full">
              {/* 律师事务所执照扫描件 */}
              <Form.Item
                name="firm_license_file"
                rules={[
                  {
                    required: true,
                    message: t('register.lawOffice.uploadOfficeLicenseError')
                  }
                ]}
              >
                <UploadMultifileCard
                  className={cn(
                    'flex gap-3 [&>div>div>div>div]:b-2',
                    `${errorFormItem.includes('certificates') && !form.getFieldValue('certificates')?.[0] ? '[&>div>div>div>div]:b-#dc4446' : '[&>div>div>div>div]:b-#30363D'}`
                  )}
                  fileType="image/png,image/jpg,application/pdf"
                  fileUrl={fileIsUrl(firmLicenseFile) ? [firmLicenseFile] : []}
                  maxLength={1}
                  width="100%"
                  height="auto"
                  loading={uploadFileLoading.includes(0)}
                  removeFile={(_index) => {
                    form.setFieldValue('firm_license_file', [])
                  }}
                  beforeUpload={(file) => {
                    uploadIdCardFile(file, 'firm_license_file', 0)
                  }}
                >
                  <div className="w-full px-6.5">
                    <div className="mb-4 fccc gap-2">
                      <img
                        className="h-10"
                        src={
                          new URL(
                            '@/assets/images/register/compony-grey.png',
                            import.meta.url
                          ).href
                        }
                        alt=""
                      />
                      <div className="fcc gap-1 text-sm text-#8B949E">
                        <span>{t('register.lawOffice.officeLicense')}</span>
                        <span className="text-#EF4444">*</span>
                      </div>
                    </div>
                    <div className="w-full rounded-2 bg-#1E242880 px-3 py-10">
                      <div className="fcc pb-2">
                        <img
                          className="h-10"
                          src={
                            new URL(
                              '@/assets/images/register/cloud.png',
                              import.meta.url
                            ).href
                          }
                          alt=""
                        />
                      </div>
                      <div className="w-full overflow-hidden text-center text-sm text-#9CA3AF">
                        {t('register.lawOffice.uploadOfficeLicense')}
                      </div>
                      <div className="w-full overflow-hidden text-center text-xs text-#6B7280">
                        {t('register.lawOffice.fileSupport')}
                      </div>
                    </div>
                  </div>
                </UploadMultifileCard>
              </Form.Item>
              {/* 主办律师执业证扫描件 */}
              <Form.Item
                name="lawyer_license_file"
                rules={[
                  {
                    required: true,
                    message: t('register.lawOffice.uploadLawyerLicenseError')
                  }
                ]}
              >
                <UploadMultifileCard
                  className={cn(
                    'flex gap-3 [&>div>div>div>div]:b-2',
                    `${errorFormItem.includes('certificates') && !form.getFieldValue('certificates')?.[1] ? '[&>div>div>div>div]:b-#dc4446' : '[&>div>div>div>div]:b-#30363D'}`
                  )}
                  fileType="image/png,image/jpg,application/pdf"
                  fileUrl={
                    fileIsUrl(lawyerLicenseFile) ? [lawyerLicenseFile] : []
                  }
                  maxLength={1}
                  width="100%"
                  height="auto"
                  loading={uploadFileLoading.includes(1)}
                  removeFile={(_index) => {
                    form.setFieldValue('lawyer_license_file', '')
                  }}
                  beforeUpload={(file) => {
                    uploadIdCardFile(file, 'lawyer_license_file', 1)
                  }}
                >
                  <div className="w-full px-6.5">
                    <div className="mb-4 fccc gap-2">
                      <img
                        className="h-10"
                        src={
                          new URL(
                            '@/assets/images/register/userCard.png',
                            import.meta.url
                          ).href
                        }
                        alt=""
                      />
                      <div className="fcc gap-1 text-sm text-#8B949E">
                        <span>{t('register.lawOffice.leadLawyerLicense')}</span>
                        <span className="text-#EF4444">*</span>
                      </div>
                    </div>
                    <div className="w-full rounded-2 bg-#1E242880 px-3 py-10">
                      <div className="fcc pb-2">
                        <img
                          className="h-10"
                          src={
                            new URL(
                              '@/assets/images/register/cloud.png',
                              import.meta.url
                            ).href
                          }
                          alt=""
                        />
                      </div>
                      <div className="w-full overflow-hidden text-center text-sm text-#9CA3AF">
                        {t('register.lawOffice.uploadLawyerLicense')}
                      </div>
                      <div className="w-full overflow-hidden text-center text-xs text-#6B7280">
                        {t('register.lawOffice.fileSupport')}
                      </div>
                    </div>
                  </div>
                </UploadMultifileCard>
              </Form.Item>
              {/* 所属律师协会会员证明 */}
              <Form.Item
                name="bar_membership_file"
                rules={[
                  {
                    required: true,
                    message: t('register.lawOffice.barAssociationProof')
                  }
                ]}
              >
                <UploadMultifileCard
                  className={cn(
                    'flex gap-3 [&>div>div>div>div]:b-2',
                    `${errorFormItem.includes('certificates') && !form.getFieldValue('certificates')?.[2] ? '[&>div>div>div>div]:b-#dc4446' : '[&>div>div>div>div]:b-#30363D'}`
                  )}
                  fileType="image/png,image/jpg,application/pdf"
                  fileUrl={
                    fileIsUrl(businessLicenseFile) ? [businessLicenseFile] : []
                  }
                  maxLength={1}
                  width="100%"
                  height="auto"
                  loading={uploadFileLoading.includes(2)}
                  removeFile={(_index) => {
                    form.setFieldValue('bar_membership_file', '')
                  }}
                  beforeUpload={(file) => {
                    uploadIdCardFile(file, 'bar_membership_file', 2)
                  }}
                >
                  <div className="w-full px-6.5">
                    <div className="mb-4 fccc gap-2">
                      <img
                        className="h-10"
                        src={
                          new URL(
                            '@/assets/images/register/thorn.png',
                            import.meta.url
                          ).href
                        }
                        alt=""
                      />
                      <div className="fcc gap-1 text-sm text-#8B949E">
                        <span>
                          {t('register.lawOffice.barAssociationProof')}
                        </span>
                        <span className="text-#EF4444">*</span>
                      </div>
                    </div>
                    <div className="w-full rounded-2 bg-#1E242880 px-3 py-10">
                      <div className="fcc pb-2">
                        <img
                          className="h-10"
                          src={
                            new URL(
                              '@/assets/images/register/cloud.png',
                              import.meta.url
                            ).href
                          }
                          alt=""
                        />
                      </div>
                      <div className="w-full overflow-hidden text-center text-sm text-#9CA3AF">
                        {t('register.lawOffice.uploadBarProof')}
                      </div>
                      <div className="w-full overflow-hidden text-center text-xs text-#6B7280">
                        {t('register.lawOffice.fileSupport')}
                      </div>
                    </div>
                  </div>
                </UploadMultifileCard>
              </Form.Item>
            </div>
          </Form.Item>
          <div className="fyc gap-3 text-6">
            <div className="i-ep:success-filled text-6 text-#69e2fc"></div>
            <div>{t('register.lawOffice.complianceCommitment')}</div>
          </div>
          <div className="mt-6 rounded-2 bg-#1E242880 p-6">
            <div className="mb-3 text-base">
              {t('register.lawOffice.complianceCommitment')}
            </div>
            {/* 合规承诺 */}
            <Form.Item
              valuePropName="checked"
              name="agree_compliance_promise"
              className="mb-1"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error(
                            t('register.lawOffice.readServiceAgreement')
                          )
                        )
                }
              ]}
            >
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
            {/* 是否同意《资产上链合规声明》 */}
            <Form.Item
              valuePropName="checked"
              name="agree_asset_compliance"
              className="mb-1"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error(t('register.lawOffice.agreeTermsError'))
                        )
                }
              ]}
            >
              <div className="fyc">
                <Checkbox className="text-sm text-#D1D5DB">
                  {t('register.lawOffice.agreeNotarization')}
                </Checkbox>
                <span className="text-sm text-#EF4444">*</span>
              </div>
            </Form.Item>
            {/* 反洗钱承诺 */}
            <Form.Item
              valuePropName="checked"
              className="mb-1"
              name="agree_aml_statement"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error(
                            t('register.asset.amlCommitmentPlaceholder')
                          )
                        )
                }
              ]}
            >
              <Checkbox className="text-sm text-#D1D5DB">
                {t('register.asset.agreeAML')}
                <span className="text-#00E5FF">
                  《
                  {t('register.asset.amlCommitment')}
                  》
                </span>
              </Checkbox>
            </Form.Item>
            {/* 平台注册服务协议 */}
            <Form.Item
              valuePropName="checked"
              name="agree_service_terms"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error(
                            t(
                              'register.asset.pleaseAgreePlatformRegistrationServiceAgreement'
                            )
                          )
                        )
                }
              ]}
            >
              <Checkbox className="text-sm text-#D1D5DB">
                {t('register.asset.agreeAML')}
                <span className="text-#00E5FF">
                  《
                  {t('register.asset.platformRegistrationServiceAgreement')}
                  》
                </span>
              </Checkbox>
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
              <Button
                loading={isRegistering}
                type="primary"
                htmlType="submit"
                className="h-10.5 px-4 text-base text-black"
              >
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
          text: t('register.asset.enterLawyerTaskCenter'),
          onClick: () => {
            navigate({ to: '/evaluation' })
          }
        }}
      />
    </div>
  )
}
