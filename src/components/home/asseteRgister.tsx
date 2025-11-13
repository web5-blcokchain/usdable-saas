import type { RuleObject } from 'antd/es/form'
import componyIcon from '@/assets/images/compony-green.png'
import userIcon from '@/assets/images/user.png'
import { Button, Checkbox, Form, Input, Radio } from 'antd'
import UploadMultifileCard from '../common/upload/uploa-multifile-card'
import { RegisterStatus } from './registerStatus'

// 资产方注册
export function AsseteRgister({ back }: { back: () => void }) {
  const [form] = Form.useForm()
  const { t } = useTranslation()
  const type = Form.useWatch<number>('type', form)
  const [isSuccess, setIsSuccess] = useState(false)
  const [registerStatus, setRegisterStatus] = useState(1)
  const [errorMessage, setErrorMessage] = useState('未找到工商登记记录，请检查公司名称或营业执照号')

  const onFinish = (_values: any) => {
    // console.log('✅ 表单通过验证:', values)
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
    // console.log('❌ 验证失败:', errorInfo, errorList)
  }

  const fileValidator = (_: RuleObject, value: string[]) => {
    const file = value || []
    if (!file[0]) {
      return Promise.reject(new Error('请上传身份证正面'))
    }
    else if (!file[1]) {
      return Promise.reject(new Error('请上传身份证反面'))
    }
    return Promise.resolve()
  }

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
        <Form form={form} layout="vertical" className="" onFinish={onFinish} onFinishFailed={onFinishFailed}>
          <Form.Item required name="type">
            <Radio.Group defaultValue={0} className="mt-4 w-full flex gap-x-6 max-md:grid max-md:grid-cols-1 max-md:gap-6">
              {
                [0, 1].map(item => (
                  <div key={item} onClick={() => form.setFieldValue('type', item)} className="flex flex-1 items-start justify-between gap-4 b-1 b-#374151 rounded-2 b-solid px-5 py-6 clickable">
                    <div className="fcc flex-1 gap-1.5">
                      <div className="size-12 fcc b-1 b-#374151 rounded-2 b-solid bg-#0D1117">
                        <img className="h-7" src={item === 0 ? userIcon : componyIcon} alt="" />
                      </div>
                      <div className="leading-full h-full w-full flex-1">
                        <div className="text-lg font-500">
                          {item === 0 ? t('register.asset.individual') : t('register.asset.enterprise')}
                          {t('register.asset.user')}
                        </div>
                        <div className="mt-1.5 text-sm text-#9CA3AF">{item === 0 ? t('register.asset.individualDesc') : t('register.asset.enterpriseDesc')}</div>
                      </div>
                    </div>
                    <Radio className="[&>span>.ant-radio-inner]:!b-2 [&>span>.ant-radio-inner]:!b-#6B7280 [&>span>.ant-radio-inner]:!bg-transparent" value={item} />
                  </div>
                ))
              }
            </Radio.Group>
          </Form.Item>
          <div className="grid grid-cols-2 gap-x-6 max-md:grid-cols-1 max-md:gap-0">
            <Form.Item required name="name" label={t('register.asset.name')} rules={[{ required: true, message: t('register.asset.namePlaceholder') }]}>
              <Input className="h-12.5 b-#374151 bg-#1E2328" placeholder={t('register.asset.namePlaceholder')} />
            </Form.Item>
            <Form.Item required name="email" label={t('register.asset.email')} rules={[{ required: true, message: t('register.asset.emailPlaceholder') }]}>
              <Input className="h-12.5 b-#374151 bg-#1E2328" placeholder={t('register.asset.emailPlaceholder')} />
            </Form.Item>
            <Form.Item
              required
              name="phone"
              label={t('register.asset.phone')}
              rules={
                [{ required: true, message: t('register.asset.phonePlaceholder') }, { pattern: /^\d*$/, message: t('register.asset.phoneErrorPlaceholder') }]
              }
            >
              <Input className="h-12.5 b-#374151 bg-#1E2328" placeholder={t('register.asset.phonePlaceholder')} />
            </Form.Item>
            <Form.Item required name="cardNumber" label={t('register.asset.idNumber')} rules={[{ required: true, message: t('register.asset.idNumberPlaceholder') }]}>
              <Input className="h-12.5 b-#374151 bg-#1E2328" placeholder={t('register.asset.idNumberPlaceholder')} />
            </Form.Item>
            {
              type === 1 && (
                <Form.Item required name="creditCode" label={t('register.asset.creditCode')} rules={[{ required: true, message: t('register.asset.creditCodePlaceholder') }]}>
                  <Input className="h-12.5 b-#374151 bg-#1E2328" placeholder={t('register.asset.creditCodePlaceholder')} />
                </Form.Item>

              )
            }
            {
              type === 1 && (
                <Form.Item required name="legalPersonName" label={t('register.asset.legalPersonName')} rules={[{ required: true, message: t('register.asset.legalPersonNamePlaceholder') }]}>
                  <Input className="h-12.5 b-#374151 bg-#1E2328" placeholder={t('register.asset.legalPersonNamePlaceholder')} />
                </Form.Item>
              )
            }
          </div>
          <Form.Item
            required
            name="userCard"
            label={t('register.asset.idNumber')}
            rules={[
            // 内容为数组，且必须为两个
              { validator: fileValidator }
            ]}
          >
            <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
              <UploadMultifileCard
                className={cn(
                  'flex gap-3 [&>div>div>div>div]:b-2',
                  `${(errorFormItem.includes('userCard') && !form.getFieldValue('userCard')?.[0]) ? '[&>div>div>div>div]:b-#dc4446' : '[&>div>div>div>div]:b-#30363D'}`
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
                  <div className="w-full overflow-hidden text-center text-sm text-#9CA3AF">{t('register.asset.uploadIdFront')}</div>
                  <div className="w-full overflow-hidden text-center text-xs text-#6B7280">{t('register.asset.fileSupport')}</div>
                </div>
              </UploadMultifileCard>
              <UploadMultifileCard
                className={cn(
                  'flex gap-3 [&>div>div>div>div]:b-2',
                  `${(errorFormItem.includes('userCard') && !form.getFieldValue('userCard')?.[0]) ? '[&>div>div>div>div]:b-#dc4446' : '[&>div>div>div>div]:b-#30363D'}`
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
                  <div className="w-full overflow-hidden text-center text-sm text-#9CA3AF">{t('register.asset.uploadIdBack')}</div>
                  <div className="w-full overflow-hidden text-center text-xs text-#6B7280">{t('register.asset.fileSupport')}</div>
                </div>
              </UploadMultifileCard>
            </div>
          </Form.Item>
          <Form.Item valuePropName="checked" name="agreementFirst" className="mb-1" rules={[{ required: true, message: t('register.asset.complianceDeclarationPlaceholder') }]}>
            <Checkbox className="text-sm text-#D1D5DB">
              {t('register.asset.agreeCompliance')}
              <span className="text-#00E5FF">
                《
                {t('register.asset.complianceDeclaration')}
                》
              </span>
            </Checkbox>
          </Form.Item>
          <Form.Item valuePropName="checked" name="agreementSecond" rules={[{ required: true, message: t('register.asset.amlCommitmentPlaceholder') }]}>
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
              <Button type="primary" htmlType="submit" className="h-10.5 px-4 text-base text-black">
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
          }
        }}
      />
    </div>
  )
}
