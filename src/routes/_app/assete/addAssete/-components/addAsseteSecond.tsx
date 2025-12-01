import type { Field } from '@/api/assetsApi'
import type { FormInstance } from 'antd'
import assetsApi from '@/api/assetsApi'
import { uploadFile } from '@/api/common'
import UploadMultifileCard from '@/components/common/upload/uploa-multifile-card'
import { INPUT_FORMAT_TYPE } from '@/enum/common'
import { formatNumberNoRound } from '@/utils/number'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, DatePicker, Form, Image, Input, InputNumber, Spin } from 'antd'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

/**
 * 添加资产第二步表单组件
 * @param form 表单实例
 * @param onFinish 提交表单回调函数
 * @param backStep 返回上一步回调函数
 * @param saveDraft 保存草稿回调函数
 * @returns JSX.Element
 */
export function AddAsseteSecond({ form, onFinish, backStep, saveDraft }: {
  form: FormInstance<any>
  onFinish: (data: any, templateId?: number, status?: boolean) => Promise<any>
  backStep: () => void
  saveDraft: () => void
}) {
  const { t } = useTranslation()

  // 资产模板列表
  const { data: assetTemplates, isFetching: assetTemplatesLoading } = useQuery({
    queryKey: ['getAssetTemplates'],
    queryFn: async () => {
      const data = await assetsApi.getAssetTemplates([1])
      return data.data?.list
    }
  })

  interface UploadType {
    label: string
    value: string
    required: boolean
    fileFormat: string[]
    fileFormatText: string
    index: number
    fields: Field[]
    id: number
  }
  // 上传类型列表
  const uploadTypeList = useMemo(() => {
    const fileTypeList = assetTemplates?.template_files?.map((file, index) => {
      return {
        label: file.display_name || '',
        value: file.file_code || '',
        required: !!file.is_required,
        fileFormat: ['image/png', 'image/jpg', 'application/pdf'],
        fileFormatText: t('assete.addAsset.fileFormat.imagePdf'),
        index,
        fields: file.fields,
        id: file.id || 0
      }
    })
    return fileTypeList || []
  }, [assetTemplates, t])

  const { mutateAsync: uploadIdCardFileMutate } = useMutation({
    mutationKey: ['uploadFile'],
    mutationFn: async (data: { file: File }) => {
      const formData = new FormData()
      formData.append('file', data.file)
      return uploadFile(formData)
    }
  })
  const [uploadFileLoading, setUploadFileLoading] = useState([] as string[])
  // 文件上传
  async function uploadIdCardFile(data: File, uploadType: UploadType) {
    setUploadFileLoading(prev => [...prev, uploadType.value])
    await uploadIdCardFileMutate({ file: data }).then((res) => {
      if (res.code === 1) {
        form.setFieldValue(uploadType.value, [
          ...(form.getFieldValue(uploadType.value) || []),
          {
            url: res.data?.file.full_url,
            size: res.data?.file.size,
            type: res.data?.file.suffix,
            name: res.data?.file.name,
            id: uploadType.id
          }
        ])
      }
    }).finally(() => {
      setUploadFileLoading(prev => prev.filter(item => item !== uploadType.value))
    })
  }
  const [fileDialog, setFileDialog] = useState({
    visible: false,
    url: ''
  })

  const [errorFormItem, setErrorFormItem] = useState<string[]>([])
  const [, forceUpdate] = useState(0)
  const onFinishFailed = (errorInfo: any) => {
    let errorList = [] as string[];
    (errorInfo.errorFields as any[]).forEach((res: any) => {
      errorList = errorList.concat(res.name)
    })
    setErrorFormItem(errorList)
    console.log('❌ 验证失败:', errorInfo, errorList)
  }

  /**
   * 提取大括号中的关键字内容
   * @param text 输入文本
   * @returns 匹配到的关键字数组或null
   */
  function extractFirstBraces(text: string) {
    const regex = /\{\{(.*?)\}\}/g
    const matches = []
    let match

    // eslint-disable-next-line no-cond-assign
    while ((match = regex.exec(text)) !== null) {
      matches.push(match[1].trim()) // 去掉前后空格
    }
    return matches.length > 0 ? matches : null
  }

  /**
   * 根据数据类型解析数据
   * @param data 数据
   * @param dataType 数据类型
   * @returns 解析后的数据
   */
  const dataParseToType = (data: any, dataType: INPUT_FORMAT_TYPE) => {
    let fileData: any
    if ([INPUT_FORMAT_TYPE.STRING, INPUT_FORMAT_TYPE.TEXT].includes(dataType)) {
      fileData = data
    }
    else if ([INPUT_FORMAT_TYPE.INT, INPUT_FORMAT_TYPE.DECIMAL].includes(dataType)) {
      fileData = Number(data)
    }
    else if (INPUT_FORMAT_TYPE.DATE === dataType) {
      fileData = dayjs(data).format('YYYY-MM-DD')
    }
    else if (INPUT_FORMAT_TYPE.DATETIME === dataType) {
      fileData = dayjs(data).format('YYYY-MM-DD HH:mm:ss')
    }
    return fileData
  }

  const [sumbitLoading, setSumbitLoading] = useState(false)
  const formDataToSubmit = (data: any) => {
    const newData = {} as { [key: string]: any }
    Object.keys(data).forEach((key: string) => {
      const newKey = !Array.isArray(data[key]) ? extractFirstBraces(key) : null
      if (newKey) {
        const [fileCode, dataType, fatherKey] = newKey
        const fileData = dataParseToType(data[key], dataType as INPUT_FORMAT_TYPE)

        const field = {
          [fileCode]: fileData
        }
        if (newData[fatherKey]) {
          newData[fatherKey].fields = {
            ...newData[fatherKey].fields,
            ...field
          }
        }
        else {
          newData[fatherKey] = {
            fields: {
              ...field
            }
          }
        }
      }
      else {
        if (newData[key]) {
          newData[key] = {
            ...newData[key],
            template_file_id: 1,
            file_urls: data[key]
          }
        }
        else {
          const id = data[key]?.[0]?.id || 0
          newData[key] = {
            template_file_id: id,
            file_urls: data[key]?.map((file: any) => file.url) || [],
            fields: []
          }
        }
      }
    })
    return newData
  }
  // 处理数据
  const processData = () => {
    setSumbitLoading(true)
    const data = form.getFieldsValue()
    let newData = {} as { [key: string]: any }
    try {
      newData = formDataToSubmit(data)
    }
    catch (error) {
      console.log('❌ 表单处理数据时出错:', error)
      setSumbitLoading(false)
    }
    onFinish(Object.keys(newData).map(key => newData[key]), assetTemplates?.id, true).finally(() => {
      setSumbitLoading(false)
    })
  }

  const [saveDraftLoading, setSaveDraftLoading] = useState(false)
  // 保存草稿
  const toSaveDraft = async () => {
    setSaveDraftLoading(true)
    try {
      saveDraft()
    }
    finally {
      setSaveDraftLoading(false)
    }
  }

  return (
    <div className="bg-#000000 px-22 pb-15 pt-8 max-md:px-4">
      <div onClick={backStep} className="w-fit fcc gap-1 clickable">
        <div className="i-ic:round-arrow-back text-6 text-white"></div>
        <div className="text-2xl font-600">{t('assete.addAsset.previousStep')}</div>
      </div>
      <Spin spinning={assetTemplatesLoading} className={cn(assetTemplatesLoading)}>
        <Form
          className="mt-16"
          form={form}
          onFinish={processData}
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
                    shouldUpdate={false}
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
                        `${errorFormItem.includes(item.value) ? '[&>div>div>div>div]:b-#dc4446' : '[&>div>div>div>div]:b-#30363D'}`
                      )}
                      fileType="image/png,image/jpg"
                      fileUrl={[]}
                      maxLength={1}
                      width="100%"
                      height="auto"
                      loading={uploadFileLoading.includes(item.value)}
                      isMultipleFiles
                      removeFile={(_index) => {
                        form.setFieldValue([item.value], [])
                        forceUpdate(x => x + 1)
                      }}
                      beforeUpload={(file) => {
                        uploadIdCardFile(file, item)
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
                    (Array.isArray(form.getFieldValue(item.value)) && form.getFieldValue(item.value).length > 0) && (
                      <div>
                        {form.getFieldValue(item.value).map((file: any, index: number) => {
                          return (
                            <FileContent
                              fileName={file?.name}
                              key={file?.id || index}
                              fileSize={file?.size}
                              fileType={file?.type}
                              showImage={() => {
                                setFileDialog({ visible: true, url: file?.url })
                              }}
                              removeImg={() => {
                                form.setFieldValue([item.value], (form.getFieldValue(item.value) as any[]).filter((item) => {
                                  return file.id !== item.id
                                }))
                                forceUpdate(x => x + 1)
                              }}
                            />
                          )
                        })}
                        <div className="grid cols-2 mt-4 gap-6">
                          {
                            item.fields.map((field) => {
                            // 输入值的格式类型'STRING','TEXT','INT','DECIMAL','DATE','DATETIME','BOOL','ENUM','MULTI_ENUM','FILE','ADDRESS','JSON'
                              return (
                                <Form.Item
                                  key={field.field_key + field.data_type}
                                  label={field.label}
                                  name={`${field.field_key}{{${field.field_key}}}{{${field.data_type}}}{{${item.value}}}`}
                                  required={!!field.required}
                                  rules={[
                                    { required: !!field.required, message: t('common.inputPlaceholder') + field.label }
                                  ]}
                                >
                                  {
                                    [INPUT_FORMAT_TYPE.STRING, INPUT_FORMAT_TYPE.TEXT].includes(field.data_type) && <Input className="h-12.5 w-full b-#374151 !bg-black [&>div>input]:!bg-transparent" />
                                  }
                                  {
                                    [INPUT_FORMAT_TYPE.INT, INPUT_FORMAT_TYPE.DECIMAL].includes(field.data_type) && <InputNumber controls={false} className="w-full b-#374151 !h-12.5 !bg-black [&>input]:!h-full [&>div>input]:!bg-transparent" />
                                  }
                                  {
                                    [INPUT_FORMAT_TYPE.DATE, INPUT_FORMAT_TYPE.DATETIME].includes(field.data_type) && <DatePicker className="w-full b-#374151 !h-12.5 !bg-black [&>input]:!h-full [&>div>input]:!bg-transparent" />
                                  }
                                </Form.Item>
                              )
                            })
                          }
                        </div>
                      </div>
                    )
                  }
                </div>
              ))
            }
          </div>
          <div className="mt-16 fyc justify-end gap-4">
            {/* 保存草稿 */}
            <Button loading={saveDraftLoading} className="h-12.5 b-#00E5FF80 bg-black px-8 text-base text-#00E5FF" onClick={toSaveDraft}>{t('assete.addAsset.saveDraft')}</Button>
            {/* 提交审核 */}
            <Button loading={sumbitLoading} className="h-12.5 px-8 text-base text-black font-600" type="primary" htmlType="submit">{t('assete.addAsset.submitForReview')}</Button>
          </div>
        </Form>
      </Spin>

      {/* 显示图片浮窗 */}
      <Image
        width={200}
        style={{ display: 'none' }}
        src={fileDialog.url}
        preview={{
          visible: fileDialog.visible,
          scaleStep: 0.5,
          src: fileDialog.url,
          onVisibleChange: (value) => {
            setFileDialog({ visible: value, url: fileDialog.url })
          }
        }}
      />

    </div>
  )
}

// 文件内容
export function FileContent({ fileName, fileSize, fileType, showImage, removeImg }: { fileName: string, fileSize?: number, fileType: string, showImage: (url: string) => void, removeImg?: (id: number) => void }) {
  // const { t } = useTranslation();
  // 文件大小转换,最小为kb
  // debugger
  const fileSizeConvert = (fileSize: number) => {
    return (fileSize / 1024 / 1024) > 0 ? (fileSize / 1024 / 1024) : (fileSize / 1024 / 1024 / 1024)
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
              {(fileSize / 1024 / 1024 / 1024) < 0 ? 'KB' : 'MB'}
            </div>
          )}
        </div>
      </div>
      <div className="fyc gap-2 text-4 text-#9ea3ae">
        <div onClick={() => showFile()} className="i-fa6-solid:eye clickable"></div>
        {removeImg && <div onClick={() => removeImg(0)} className="i-mdi:delete clickable"></div>}
      </div>
    </div>
  )
}
