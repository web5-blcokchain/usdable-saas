import type { FormInstance } from 'antd'
import UploadMultifileCard from '@/components/common/upload/uploa-multifile-card'
import { formatNumberNoRound } from '@/utils/number'
import { Button, DatePicker, Form, Image, Input, Select } from 'antd'
import { useWatch } from 'antd/es/form/Form'
import { useTranslation } from 'react-i18next'
import { SubmissionStatusStatus } from './submissionStatusDialog'

/**
 * @param param0 表单实例，提交表单，返回上一步，保存草稿
 * @returns
 */
export function AddAsseteSecond({ form, onFinish, backStep, saveDraft }: {
  form: FormInstance<any>
  onFinish: () => void
  backStep: () => void
  saveDraft: () => void
}) {
  const { t } = useTranslation()

  const uploadTypeList = [
    {
      label: t('assete.addAsset.uploadType.householdRegister'), // 房产证扫描件
      value: 'householdRegister',
      required: true,
      fileFormat: ['image/png', 'image/jpg', 'application/pdf'],
      fileFormatText: t('assete.addAsset.fileFormat.imagePdf')
    },
    {
      label: t('assete.addAsset.uploadType.householdRegisterPhoto'), // 房产照片
      value: 'householdRegisterPhoto',
      required: true,
      fileFormat: ['image/jpg', 'image/png'],
      fileFormatText: t('assete.addAsset.fileFormat.image')
    },
    {
      label: t('assete.addAsset.uploadType.landUseRightCertificate'), // 土地使用权证
      value: 'landUseRightCertificate',
      required: true,
      fileFormat: ['image/jpg', 'image/png', 'application/pdf'],
      fileFormatText: t('assete.addAsset.fileFormat.imagePdf')
    },
    {
      label: t('assete.addAsset.uploadType.purchaseContract'), // 购房合同
      value: 'purchaseContract',
      required: false,
      fileFormat: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      fileFormatText: t('assete.addAsset.fileFormat.doc')
    },
    {
      label: t('assete.addAsset.uploadType.purchaseInvoice'), // 购房发票
      value: 'purchaseInvoice',
      required: false,
      fileFormat: ['image/jpg', 'image/png', 'application/pdf'],
      fileFormatText: t('assete.addAsset.fileFormat.imagePdf')
    },
    {
      label: t('assete.addAsset.uploadType.mortgageFile'), // 抵押文件（如有）
      value: 'mortgageFile',
      required: true,
      fileFormat: ['image/jpg', 'image/png', 'application/pdf'],
      fileFormatText: t('assete.addAsset.fileFormat.imagePdf')
    }
  ]

  const householdRegister = useWatch('householdRegister', form)
  const householdRegisterPhoto = useWatch('householdRegisterPhoto', form)
  const landUseRightCertificate = useWatch('landUseRightCertificate', form)
  const [errorFormItem, setErrorFormItem] = useState<string[]>([])
  const onFinishFailed = (errorInfo: any) => {
    let errorList = [] as string[];
    (errorInfo.errorFields as any[]).forEach((res: any) => {
      errorList = errorList.concat(res.name)
    })
    setErrorFormItem(errorList)
    console.log('❌ 验证失败:', errorInfo, errorList)
  }
  // 图片弹窗
  const [visible, setVisible] = useState(false)
  const [sumbitDialogVisible, setSumbitDialogVisible] = useState(false)

  useEffect(() => {
    return () => {
      setSumbitDialogVisible(false)
    }
  }, [])

  return (
    <div className="bg-#000000 px-22 pb-15 pt-8 max-md:px-4">
      <div onClick={backStep} className="w-fit fcc gap-1 clickable">
        <div className="i-ic:round-arrow-back text-6 text-white"></div>
        <div className="text-2xl font-600">{t('assete.addAsset.previousStep')}</div>
      </div>
      <Form
        className="mt-16"
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="vertical"
      >
        <div className="flex flex-col gap-8">
          {
            uploadTypeList.map(item => (
              <div key={item.value} className="b-1 b-#334155 rounded-3 b-solid bg-#161B22 p-6">
                <div className="fyc justify-between">
                  <div className="fyc gap-1 text-xl font-600">
                    <span>{item.label}</span>
                    {item.required && <span className="text-#EF4444">*</span>}
                  </div>
                  <div className="rexr-#9CA3AF text-xs">
                    {t('assete.addAsset.supportedFormat')}
                    {' '}
                    {item.fileFormatText}
                  </div>
                </div>
                <Form.Item
                  className="mt-4"
                  required
                  name={item.value}
                  rules={[
                    // 内容为数组，且必须为两个
                    { required: item.required, message: t('assete.addAsset.uploadPlaceholder') + item.label }
                  ]}
                >
                  <UploadMultifileCard
                    className={cn(
                      'flex gap-3 [&>div>div>div>div]:b-2',
                      `${(errorFormItem.includes(item.value) && !form.getFieldValue('userCard')?.[0]) ? '[&>div>div>div>div]:b-#dc4446' : '[&>div>div>div>div]:b-#30363D'}`
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
                        <img className="h-10" src={new URL('@/assets/images/register/cloud.png', import.meta.url).href} alt="" />
                      </div>
                      <div className="fcc gap-1 text-base">
                        <span className="text-#9CA3AF">{t('assete.addAsset.dragHere')}</span>
                        <span className="text-#D1D5DB">{t('assete.addAsset.clickUpload')}</span>
                      </div>
                    </div>
                  </UploadMultifileCard>
                </Form.Item>
                {
                  (householdRegister && (householdRegister as string[] || []).length > 0) && item.value === 'householdRegister' && (
                    <HouseholdRegisterContent file={{ fileName: 'householdRegister.pdf', fileSize: 12000, fileType: 'pdf' }} showImage={() => { setVisible(true) }} removeImg={() => { }} />
                  )
                }
                {
                  (householdRegisterPhoto && (householdRegisterPhoto as string[] || []).length > 0) && item.value === 'householdRegisterPhoto' && (
                    <HouseholdRegisterPhotoContent file={{ fileName: 'householdRegisterPhoto.png', fileSize: 12000, fileType: 'png' }} showImage={() => { setVisible(true) }} removeImg={() => { }} />
                  )
                }
                {
                  (landUseRightCertificate && (landUseRightCertificate as string[] || []).length > 0) && item.value === 'landUseRightCertificate' && (
                    <LandUseRightCertificateContent file={{ fileName: 'landUseRightCertificate.png', fileSize: 12000, fileType: 'png' }} showImage={() => { setVisible(true) }} removeImg={() => { }} />
                  )
                }
              </div>
            ))
          }
        </div>
        <div className="mt-16 fyc justify-end gap-4">
          {/* 保存草稿 */}
          <Button className="h-12.5 b-#00E5FF80 bg-black px-8 text-base text-#00E5FF" onClick={saveDraft}>{t('assete.addAsset.saveDraft')}</Button>
          {/* 提交审核 */}
          <Button className="h-12.5 px-8 text-base text-black font-600" type="primary" htmlType="submit">{t('assete.addAsset.submitForReview')}</Button>
        </div>
      </Form>
      {/* 显示图片浮窗 */}
      <Image
        width={200}
        style={{ display: 'none' }}
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"
        preview={{
          visible,
          scaleStep: 0.5,
          src: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          onVisibleChange: (value) => {
            setVisible(value)
          }
        }}
      />
      {/* 提交成功弹窗口 */}
      <SubmissionStatusStatus
        visible={sumbitDialogVisible}
        setVisible={setSumbitDialogVisible}
        type={0}
        asseteInfo={{ code: 'ASSET-20230615-8742', createTime: '2023-11-15 14:32:45' }}
        errorMessage={t('assete.addAsset.submitError')}
      />
    </div>
  )
}

// 文件内容
export function FileContent({ fileName, fileSize, fileType, showImage, removeImg }: { fileName: string, fileSize?: number, fileType: string, showImage: (url: string) => void, removeImg?: (id: number) => void }) {
  // const { t } = useTranslation();
  // 文件大小转换,最小为kb
  const fileSizeConvert = (fileSize: number) => {
    return (fileSize / 1024) > 0 ? (fileSize / 1024) : (fileSize / 1024 / 1024)
  }

  // 展示文件(pdf打开网址，图片在页面打开显示)
  const showFile = () => {
    if (fileType === 'pdf') {
      window.open(fileName, '_blank')
    }
    else {
      showImage(fileName)
    }
  }

  return (
    <div className="fyc justify-between gap-3 b-1 b-#1F2937 rounded-2 b-solid bg-#00000080 p-4">
      <div className="flex gap-3">
        {
          fileType === 'pdf'
            ? (
                <div className="i-bxs:file-pdf text-7 text-#ed742f"></div>
              )
            : (['png', 'jpg', 'jpeg'].includes(fileType)
                ? <div className="i-bxs:file-image text-7 text-#75fb92"> </div>
                : <div className="w-i-mdi:file h-5 text-primary"></div>)
        }
        <div className="flex flex-col justify-center">
          <div className="text-base">{fileName.split('/').pop()}</div>
          {fileSize && (
            <div className="text-xs text-#9CA3AF">
              {' '}
              {formatNumberNoRound(fileSizeConvert(fileSize), 2, 0)}
              {' '}
              {(fileSize / 1024) > 0 ? 'KB' : 'MB'}
            </div>
          )}
        </div>
      </div>
      <div className="fyc gap-2 text-4 text-#9ea3ae [&>div]:clickable">
        <div onClick={() => showFile()} className="i-fa6-solid:eye"></div>
        {removeImg && <div onClick={() => removeImg(0)} className="i-mdi:delete"></div>}
      </div>
    </div>
  )
}

function HouseholdRegisterContent({ file, showImage, removeImg }:
{
  file: { fileName: string, fileSize: number, fileType: string }
  showImage: (url: string) => void
  removeImg: (id: number) => void
}) {
  const { t } = useTranslation()
  return (
    <div className="file-content">
      <FileContent fileName={file.fileName} fileSize={file.fileSize} fileType={file.fileType} showImage={showImage} removeImg={removeImg} />
      <div className="grid cols-2 mt-4 gap-6">
        {/* 文件编号 */}
        <Form.Item label={t('assete.addAsset.fileCode')} name="householdRegisterFileCode">
          <Input placeholder={t('assete.addAsset.fileCodePlaceholder')} />
        </Form.Item>
        {/* 发证日期 */}
        <Form.Item label={t('assete.addAsset.issueDate')} required name="householdRegisterFileStartCode">
          <DatePicker className="h-12.5 w-full b-#374151 bg-#1E2328 [&>div>input]:!bg-transparent" placeholder={t('assete.addAsset.issueDatePlaceholder')} />
        </Form.Item>
      </div>
      {/* 发证机关 */}
      <Form.Item label={t('assete.addAsset.issuingAuthority')} name="householdRegisterFileIssuingAuthority">
        <Input placeholder={t('assete.addAsset.issuingAuthorityPlaceholder')} />
      </Form.Item>
      {/* 文件状态 */}
      <Form.Item label={t('assete.addAsset.fileStatus')} name="householdRegisterFileStatus">
        <Select placeholder={t('assete.addAsset.fileStatusPlaceholder')} />
      </Form.Item>
      {/* 备注说明 */}
      <Form.Item label={t('assete.addAsset.remarks')} name="householdRegisterFileRemark">
        <Input.TextArea placeholder={t('assete.addAsset.remarksPlaceholder')} />
      </Form.Item>
    </div>
  )
}

function LandUseRightCertificateContent({ file, showImage, removeImg }:
{
  file: { fileName: string, fileSize: number, fileType: string }
  showImage: (url: string) => void
  removeImg: (id: number) => void
}) {
  const { t } = useTranslation()
  return (
    <div className="file-content">
      <FileContent fileName={file.fileName} fileSize={file.fileSize} fileType={file.fileType} showImage={showImage} removeImg={removeImg} />
      <div className="grid cols-2 mt-4 gap-6">
        {/* 证书编号 */}
        <Form.Item label={t('assete.addAsset.certificateCode')} name="landUseRightCertificateFileCode">
          <Input placeholder={t('assete.addAsset.certificateCodePlaceholder')} />
        </Form.Item>
        {/* 发证日期 */}
        <Form.Item label={t('assete.addAsset.issueDate')} required name="landUseRightCertificateFileStartCode">
          <DatePicker className="h-12.5 w-full b-#374151 bg-#1E2328 [&>div>input]:!bg-transparent" placeholder={t('assete.addAsset.issueDatePlaceholder')} />
        </Form.Item>
        {/* 发证机关 */}
        <Form.Item label={t('assete.addAsset.issuingAuthority')} name="landUseRightCertificateFileIssuingAuthority">
          <Input placeholder={t('assete.addAsset.issuingAuthorityPlaceholder')} />
        </Form.Item>
        {/* 使用年限 */}
        <Form.Item label={t('assete.addAsset.usageYears')} name="landUseRightCertificateFileUsageYears">
          <Input placeholder={t('assete.addAsset.usageYearsPlaceholder')} />
        </Form.Item>
      </div>
      {/* 文件状态 */}
      <Form.Item label={t('assete.addAsset.fileStatus')} name="landUseRightCertificateFileStatus">
        <Select placeholder={t('assete.addAsset.fileStatusPlaceholder')} />
      </Form.Item>
      {/* 备注说明 */}
      <Form.Item label={t('assete.addAsset.remarks')} name="landUseRightCertificateFileRemark">
        <Input.TextArea placeholder={t('assete.addAsset.remarksPlaceholder')} />
      </Form.Item>
    </div>
  )
}

function HouseholdRegisterPhotoContent({ file, showImage, removeImg }:
{
  file: { fileName: string, fileSize: number, fileType: string }
  showImage: (url: string) => void
  removeImg: (id: number) => void
}) {
  const { t } = useTranslation()
  return (
    <div className="file-content">
      <FileContent fileName={file.fileName} fileSize={file.fileSize} fileType={file.fileType} showImage={showImage} removeImg={removeImg} />
      <div className="grid cols-2 mt-4 gap-6">
        {/* 照片编号 */}
        <Form.Item label={t('assete.addAsset.photoCode')} name="householdRegisterPhotoFileCode">
          <Input placeholder={t('assete.addAsset.photoCodePlaceholder')} />
        </Form.Item>
        {/* 拍摄日期 */}
        <Form.Item label={t('assete.addAsset.shootingDate')} required name="householdRegisterPhotoFileStartCode">
          <DatePicker className="h-12.5 w-full b-#374151 bg-#1E2328 [&>div>input]:!bg-transparent" placeholder={t('assete.addAsset.shootingDatePlaceholder')} />
        </Form.Item>
      </div>
      {/* 拍摄位置 */}
      <Form.Item label={t('assete.addAsset.shootingLocation')} name="householdRegisterPhotoFileIssuingAuthority">
        <Input placeholder={t('assete.addAsset.shootingLocationPlaceholder')} />
      </Form.Item>
      {/* 照片状态 */}
      <Form.Item label={t('assete.addAsset.photoStatus')} name="householdRegisterPhotoFileStatus">
        <Select placeholder={t('assete.addAsset.photoStatusPlaceholder')} />
      </Form.Item>
      {/* 备注说明 */}
      <Form.Item label={t('assete.addAsset.remarks')} name="householdRegisterPhotoFileRemark">
        <Input.TextArea placeholder={t('assete.addAsset.remarksPlaceholder')} />
      </Form.Item>
    </div>
  )
}
