import type { UserRegisterModel } from '@/api/apiMyInfoApi'
import apiMyInfoApi from '@/api/apiMyInfoApi'
import { uploadFile } from '@/api/common'
import componyIcon from '@/assets/images/compony-green.png'
import userIcon from '@/assets/images/user.png'
import UploadMultifileCard from '@/components/common/upload/uploa-multifile-card'
import { USER_AGREE } from '@/enum/common'
import { ASSET_TYPE, USER_AUDIT_STATUS } from '@/enum/user'
import { useUserStore } from '@/stores/user'
import { envConfig } from '@/utils/envConfig'
import { getToken } from '@/utils/user'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Button, Checkbox, Form, Input, Radio } from 'antd'
import { RegisterStatus } from './registerStatus'

interface UserForm {
  p_type: string
  nickname: string
  email: string
  mobile: string
  id_number: string
  uscc?: string
  legal_rep_name?: string
  id_card_front_url: string
  id_card_back_url: string
}
// 资产方注册
export function AsseteRgister({ back }: { back: () => void }) {
  const [form] = Form.useForm<UserForm>()
  const { t } = useTranslation()
  const type = Form.useWatch<number>('p_type', form)
  const [isSuccess, setIsSuccess] = useState(false)
  const [registerStatus, setRegisterStatus] = useState(0)
  const [errorMessage, setErrorMessage] = useState('Error')
  const idCardFrontUrl = Form.useWatch<string>('id_card_front_url', form)
  const idCardBackUrl = Form.useWatch<string>('id_card_back_url', form)
  const { userData } = useUserStore()
  const navigate = useNavigate()

  const { mutateAsync: userResgiter, isPending: isLoading } = useMutation({
    mutationKey: ['userRegitser'],
    mutationFn: async (values: UserRegisterModel) => {
      return userData?.user?.audit_status !== USER_AUDIT_STATUS.REJECT ? apiMyInfoApi.regitser(values) : apiMyInfoApi.resubmitRegister(values)
    }
  })

  const { mutateAsync: uploadIdCardFileMutate } = useMutation({
    mutationKey: ['uploadFile'],
    mutationFn: async (data: { file: File }) => {
      const formData = new FormData()
      formData.append('file', data.file)
      return uploadFile(formData)
    }
  })

  const [uploadFileLoading, setUploadFileLoading] = useState([] as number[])
  async function uploadIdCardFile(data: File, index: number) {
    setUploadFileLoading(prev => [...prev, index])
    await uploadIdCardFileMutate({ file: data }).then((res) => {
      if (res.code === 1) {
        if (index === 0)
          form.setFieldValue(`id_card_front_url`, res.data?.file.full_url)
        else form.setFieldValue(`id_card_back_url`, res.data?.file.full_url)
      }
    }).finally(() => {
      setUploadFileLoading(prev => prev.filter(item => item !== index))
    })
  }

  const fileIsUrl = (url: string) => {
    return url && url.includes(envConfig.imageApiUrl)
  }

  const onFinish = (values: any) => {
    const data = values
    const sumbitData = {
      ...data,
      nickname: [data.nickname],
      id_card_back_url: `https:${idCardBackUrl}`,
      id_card_front_url: `https:${idCardFrontUrl}`,
      type: '3',
      token: getToken() || '',
      agree_asset_compliance: USER_AGREE.YES,
      agree_aml_statement: USER_AGREE.YES
    }
    userResgiter(sumbitData).then((res) => {
      if (res.code === 1) {
        setIsSuccess(true)
        setRegisterStatus(0)
        setErrorMessage('')
      }
    })
  }

  const [errorFormItem, setErrorFormItem] = useState<string[]>([])
  const onFinishFailed = (errorInfo: any) => {
    let errorList = [] as string[];
    (errorInfo.errorFields as any[]).forEach((res: any) => {
      errorList = errorList.concat(res.name)
    })
    setErrorFormItem(errorList)
    // console.log('❌ 验证失败:', errorInfo, errorList)
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
          <div>{t('register.asset.back')}</div>
        </div>
      </div>
      <div className="text-12 font-600 leading-18 max-md:text-3xl">{t('register.asset.title')}</div>
      <div className="mt-10 w-full b-2 b-#31363c rounded-lg b-solid bg-#161B2199 p-12 max-md:p-4">
        <div className="text-lg font-600">{t('register.asset.accountType')}</div>
        <Form initialValues={{ p_type: ASSET_TYPE.PERSON }} form={form} layout="vertical" className="" onFinish={onFinish} onFinishFailed={onFinishFailed}>
          {/* 账户类型 1为个人  2为企业 */}
          <Form.Item required name="p_type">
            <Radio.Group className="mt-4 w-full flex gap-x-6 max-md:grid max-md:grid-cols-1 max-md:gap-6">
              {
                [ASSET_TYPE.PERSON, ASSET_TYPE.COMPANY].map(item => (
                  <div key={item} onClick={() => form.setFieldValue('p_type', item)} className="flex flex-1 items-start justify-between gap-4 b-1 b-#374151 rounded-2 b-solid px-5 py-6 clickable">
                    <div className="fcc flex-1 gap-4">
                      <div className="size-12 fcc b-1 b-#374151 rounded-2 b-solid bg-#0D1117">
                        <img className="h-7" src={item === ASSET_TYPE.PERSON ? userIcon : componyIcon} alt="" />
                      </div>
                      <div className="leading-full h-full w-full flex-1">
                        <div className="text-lg font-500">
                          {item === 1 ? t('register.asset.individual') : t('register.asset.enterprise')}
                          {t('register.asset.user')}
                        </div>
                        <div className="mt-1.5 text-sm text-#9CA3AF">{item === 1 ? t('register.asset.individualDesc') : t('register.asset.enterpriseDesc')}</div>
                      </div>
                    </div>
                    <Radio className="[&>span>.ant-radio-inner]:!b-2 [&>span>.ant-radio-inner]:!b-#6B7280 [&>span>.ant-radio-inner]:!bg-transparent" value={item} />
                  </div>
                ))
              }
            </Radio.Group>
          </Form.Item>
          <div className="grid grid-cols-2 gap-x-6 max-md:grid-cols-1 max-md:gap-0">
            {/* 姓名 */}
            <Form.Item required name="nickname" label={t('register.asset.name')} rules={[{ required: true, message: t('register.asset.namePlaceholder') }]}>
              <Input className="h-12.5 b-#374151 bg-#1E2328" placeholder={t('register.asset.namePlaceholder')} />
            </Form.Item>
            {/* 邮箱 */}
            <Form.Item required name="email" label={t('register.asset.email')} rules={[{ required: true, message: t('register.asset.emailPlaceholder') }]}>
              <Input className="h-12.5 b-#374151 bg-#1E2328" placeholder={t('register.asset.emailPlaceholder')} />
            </Form.Item>
            {/* 手机号 */}
            <Form.Item
              required
              name="mobile"
              label={t('register.asset.phone')}
              rules={
                [{ required: true, message: t('register.asset.phonePlaceholder') }, { pattern: /^\d*$/, message: t('register.asset.phoneErrorPlaceholder') }]
              }
            >
              <Input className="h-12.5 b-#374151 bg-#1E2328" placeholder={t('register.asset.phonePlaceholder')} />
            </Form.Item>
            <Form.Item required name="id_number" label={t('register.asset.idNumber')} rules={[{ required: true, message: t('register.asset.idNumberPlaceholder') }]}>
              <Input className="h-12.5 b-#374151 bg-#1E2328" placeholder={t('register.asset.idNumberPlaceholder')} />
            </Form.Item>
            {
              //  社会统一信用代码
              type === 2 && (
                <Form.Item required name="uscc" label={t('register.asset.creditCode')} rules={[{ required: true, message: t('register.asset.creditCodePlaceholder') }]}>
                  <Input className="h-12.5 b-#374151 bg-#1E2328" placeholder={t('register.asset.creditCodePlaceholder')} />
                </Form.Item>

              )
            }
            {
              // 法定代表人姓名
              type === 2 && (
                <Form.Item required name="legal_rep_name" label={t('register.asset.legalPersonName')} rules={[{ required: true, message: t('register.asset.legalPersonNamePlaceholder') }]}>
                  <Input className="h-12.5 b-#374151 bg-#1E2328" placeholder={t('register.asset.legalPersonNamePlaceholder')} />
                </Form.Item>
              )
            }
          </div>
          <Form.Item
            required
            label={t('register.asset.idFrontAndBack')}
          >
            <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
              <Form.Item
                name="id_card_front_url"
                rules={[
                  { required: true, message: t('register.asset.idFrontError') }
                ]}
              >
                <div className="h-full">
                  <UploadMultifileCard
                    className={cn(
                      'flex gap-3 [&>div>div>div>div]:b-2',
                      `${(errorFormItem.includes('id_card_front_url') && !idCardFrontUrl) ? '[&>div>div>div>div]:b-#dc4446' : '[&>div>div>div>div]:b-#30363D'}`
                    )}
                    loading={uploadFileLoading.includes(0)}
                    fileType="image/png,image/jpg"
                    fileUrl={fileIsUrl(idCardFrontUrl) ? [idCardFrontUrl] : []}
                    maxLength={1}
                    width="100%"
                    height="9.5rem"
                    removeFile={() => {
                      form.setFieldValue('id_card_front_url', '')
                    }}
                    beforeUpload={(file) => {
                      uploadIdCardFile(file, 0)
                    }}
                  >
                    <div className="py-3">
                      <div className="fcc pb-2">
                        <img className="!h-8" src={new URL('@/assets/images/register/cloud.png', import.meta.url).href} alt="" />
                      </div>
                      <div className="w-full overflow-hidden text-center text-sm text-#9CA3AF">{t('register.asset.uploadIdFront')}</div>
                      <div className="w-full overflow-hidden text-center text-xs text-#6B7280">{t('register.asset.fileSupport')}</div>
                    </div>
                  </UploadMultifileCard>
                </div>
              </Form.Item>
              <Form.Item
                name="id_card_back_url"
                rules={[
                  { required: true, message: t('register.asset.idBackError') }
                ]}
              >
                <UploadMultifileCard
                  className={cn(
                    'flex gap-3 [&>div>div>div>div]:b-2',
                    `${(errorFormItem.includes('id_card_back_url') && !idCardBackUrl) ? '[&>div>div>div>div]:b-#dc4446' : '[&>div>div>div>div]:b-#30363D'}`
                  )}
                  loading={uploadFileLoading.includes(1)}
                  fileUrl={fileIsUrl(idCardBackUrl) ? [idCardBackUrl] : []}
                  fileType="image/png,image/jpg"
                  maxLength={1}
                  width="100%"
                  height="9.5rem"
                  removeFile={() => {
                    form.setFieldValue('id_card_back_url', '')
                  }}
                  beforeUpload={(file) => {
                    uploadIdCardFile(file, 1)
                  }}
                >
                  <div className="py-3">
                    <div className="fcc pb-2">
                      <img className="!h-8" src={new URL('@/assets/images/register/cloud.png', import.meta.url).href} alt="" />
                    </div>
                    <div className="w-full overflow-hidden text-center text-sm text-#9CA3AF">{t('register.asset.uploadIdBack')}</div>
                    <div className="w-full overflow-hidden text-center text-xs text-#6B7280">{t('register.asset.fileSupport')}</div>
                  </div>
                </UploadMultifileCard>
              </Form.Item>
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
            <Checkbox className="text-sm text-#D1D5DB">
              {t('register.asset.agreeCompliance')}
              <span className="text-#00E5FF">
                《
                {t('register.asset.complianceDeclaration')}
                》
              </span>
            </Checkbox>
          </Form.Item>
          <Form.Item
            valuePropName="checked"
            name="agree_aml_statement"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(new Error(t('register.asset.amlCommitmentPlaceholder')))
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
          <Form.Item>
            <div className="text-end">
              <Button loading={isLoading} type="primary" htmlType="submit" className="h-10.5 px-4 text-base text-black">
                {t('register.asset.submit')}
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
            navigate({ to: '/assete' })
          }
        }}
      />
    </div>
  )
}
