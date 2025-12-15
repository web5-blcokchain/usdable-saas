import type { AssetFile, AuditLog, SubmitAssetInfo } from '@/api/assetsApi'
import assetsApi from '@/api/assetsApi'
import { uploadFile } from '@/api/common'
import cloudIcon from '@/assets/images/register/cloud.png'
import UploadMultifileCard from '@/components/common/upload/uploa-multifile-card'
import { ASSET_AUDITOR_ROLE, ASSET_SUBMISSION_STATUS } from '@/enum/asset'
import { REVIEW_STATUS } from '@/enum/common'
import { getFileExtension } from '@/utils/file'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  createLazyFileRoute,
  useNavigate,
  useParams
} from '@tanstack/react-router'
import {
  Alert,
  Button,
  Collapse,
  Image,
  Input,
  InputNumber,
  Select,
  Spin
} from 'antd'
import dayjs from 'dayjs'
import { formatNumberNoRound } from '../../../../utils/number'
import { FileContent } from '../addAssete/-components/addAsseteSecond'
import './$id.lazy.scss'

export const Route = createLazyFileRoute('/_app/assete/info/$id')({
  component: RouteComponent
})

function RouteComponent() {
  const { Panel } = Collapse
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id: assetId } = useParams({ from: '/_app/assete/info/$id' }) as {
    id: string
  }

  // 获取资产房屋类型数据
  const { data: assetHouseTypeData } = useQuery({
    queryKey: ['getAssetHouseType'],
    queryFn: async () => {
      const res = await assetsApi.getAssetHouseType()
      return res.data
    },
    select: (data) => {
      return data?.map(item => ({
        label: item.name,
        value: item.id
      }))
    }
  })
  const { data: assetInfo, isPending } = useQuery({
    queryKey: ['getAssetInfo', assetId],
    queryFn: async () => {
      const data = await assetsApi.getAssetInfo(assetId)
      return data.data
    },
    enabled: !!assetId
  })

  useEffect(() => {
    if (!assetId) {
      navigate({ to: '/assete' })
    }
  }, [assetId, navigate])

  const [showImage, setShowImage] = useState({
    visible: false,
    url: [] as string[]
  })
  const [isSwitchModify, setIsSwitchModify] = useState(false)

  // 获取最后一条审核失败警告
  const assetAuditLog = useMemo(() => {
    const arr = assetInfo?.audit_logs || []
    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i].status === REVIEW_STATUS.REJECTED)
        return arr[i]
    }
    return undefined
  }, [assetInfo])

  // 获取审核人姓名
  const getAuditorName = (data: AuditLog | undefined) => {
    const lastAuditLog = data
    if (!lastAuditLog?.auditor_name)
      return {}
    switch (lastAuditLog.auditor_role) {
      case ASSET_AUDITOR_ROLE.ASSET_OWNER:
        return {
          name: t('common.identity.assetParty', {
            name: lastAuditLog?.auditor_name
          }),
          position: t('common.identity.assetPartyContent')
        }
      case ASSET_AUDITOR_ROLE.LAWYER:
        return {
          name: t('common.identity.lawyer', {
            name: lastAuditLog?.auditor_name
          }),
          position: t('common.identity.lawyerContent')
        }
      case ASSET_AUDITOR_ROLE.ASSESSOR:
        return {
          name: t('common.identity.evaluator', {
            name: lastAuditLog?.auditor_name
          }),
          position: t('common.identity.evaluatorContent')
        }
      case ASSET_AUDITOR_ROLE.PLATFORM_ADMIN:
        return {
          name: t('common.identity.platformAdmin', {
            name: lastAuditLog?.auditor_name
          }),
          position: t('common.identity.platformAdminContent')
        }
      default:
        return {
          name: lastAuditLog?.auditor_name,
          position: ''
        }
    }
  }

  // 将审核的文件分类
  const classifyFiles = useMemo(() => {
    const data = {
      pending: [] as AssetFile[],
      approved: [] as AssetFile[],
      rejected: [] as AssetFile[]
    }
    assetInfo?.files.forEach((file) => {
      switch (file.file_urls.status) {
        case REVIEW_STATUS.PENDING:
          data.pending.push(file)
          break
        case REVIEW_STATUS.APPROVED:
          data.approved.push(file)
          break
        case REVIEW_STATUS.REJECTED:
          data.rejected.push(file)
          break
      }
    })
    return data
  }, [assetInfo])

  const [correctionAssetData, setCorrectionAssetData]
    = useState<SubmitAssetInfo>({} as any)
  // 监听资产信息,更新资产信息
  useEffect(() => {
    if (assetInfo) {
      setCorrectionAssetData({
        asset_type_id: assetInfo?.submission.asset_type_id,
        basic_info: {
          ...assetInfo?.properties,
          annual_return_max: Number(
            assetInfo?.properties?.annual_return_max || ''
          ),
          annual_return_min: Number(
            assetInfo?.properties?.annual_return_min || ''
          ),
          area: Number(assetInfo?.properties?.area || ''),
          city: Number(assetInfo?.properties?.city || ''),
          expected_annual_return: Number(
            assetInfo?.properties?.expected_annual_return || ''
          ),
          latitude: Number(assetInfo?.properties?.latitude || ''),
          longitude: Number(assetInfo?.properties?.longitude || ''),
          monthly_rent: Number(assetInfo?.properties?.monthly_rent || ''),
          property_type: Number(assetInfo?.properties?.property_type || '')
        },
        country_id: assetInfo?.submission.country_id,
        submission_id: assetId,
        template_id: assetInfo?.submission.template_id,
        files: assetInfo?.files.map((file) => {
          let fields = {} as any
          file.fields.forEach((field) => {
            fields = {
              ...fields,
              [field.field_key as any]: field.value
            }
          })
          return {
            fields,
            file_urls:
              file.file_urls.status !== REVIEW_STATUS.REJECTED
                ? file.file_urls.fileUrls
                : [],
            template_file_id: file.template_file_id
          }
        })
      })
    }
  }, [assetInfo, assetId])

  const asseteBasicInformation = useMemo(() => {
    const assetType = assetHouseTypeData?.find(
      item =>
        item.value === Number(correctionAssetData.basic_info?.property_type)
    )
    return [
      {
        title: 'assete.info.houseName',
        value: correctionAssetData.basic_info?.name,
        name: 'name',
        disable: false
      },
      {
        title: 'assete.info.address',
        value: correctionAssetData.basic_info?.address,
        name: 'address',
        disable: false
      },
      {
        title: 'assete.info.houseType',
        value: assetType?.label,
        name: 'property_type',
        disable: false
      },
      {
        title: 'assete.info.assetCode',
        value: assetInfo?.submission?.code,
        name: 'code',
        disable: true
      },
      {
        title: 'assete.info.appraisalPrice',
        value: assetInfo?.properties?.price,
        name: 'evaluationPrice',
        disable: true
      },
      {
        title: 'assete.info.area',
        value: `${correctionAssetData.basic_info?.area}`,
        name: 'area',
        disable: false
      },
      {
        title: 'assete.info.ownership',
        value: assetInfo?.submission?.assets_user_name || '--',
        name: 'owner',
        disable: true
      },
      {
        title: 'assete.info.submitDate',
        value: assetInfo?.properties?.created_date
          ? dayjs(assetInfo?.properties?.created_date * 1000).format(
              'YYYY-MM-DD HH:mm:ss'
            )
          : '',
        name: 'submissionDate',
        disable: true
      }
    ]
  }, [correctionAssetData, assetInfo, assetHouseTypeData])

  // 修改资产信息
  function changeCorrectionAssetData(data: any, key: string) {
    setCorrectionAssetData((pre) => {
      return {
        ...pre,
        basic_info: {
          ...pre.basic_info,
          [key]: data
        }
      }
    })
  }

  // 不合格资产文件列表
  function rejectedFiles(template_file_id: number) {
    return correctionAssetData?.files?.find(
      file => file.template_file_id === template_file_id
    )
  }

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
  async function uploadIdCardFile(data: File, template_file_id: number) {
    setUploadFileLoading(prev => [...prev, template_file_id])
    await uploadIdCardFileMutate({ file: data })
      .then((res) => {
        if (res.code === 1) {
          const urls = [
            ...(correctionAssetData.files.find(
              file => file.template_file_id === template_file_id
            )?.file_urls || []),
            res.data?.file.full_url
          ] as string[]
          setCorrectionAssetData((pre) => {
            // 替换template_file_id对应的文件urls
            return {
              ...pre,
              files: pre.files.map((file) => {
                if (file.template_file_id === template_file_id) {
                  return {
                    ...file,
                    file_urls: urls
                  }
                }
                return file
              })
            }
          })
        }
      })
      .finally(() => {
        setUploadFileLoading(prev =>
          prev.filter(item => item !== template_file_id)
        )
      })
  }
  function removeImage(url: string, template_file_id: number) {
    setCorrectionAssetData((pre) => {
      // 替换template_file_id对应的文件urls
      return {
        ...pre,
        files: pre.files.map((file) => {
          if (file.template_file_id === template_file_id) {
            return {
              ...file,
              file_urls: file.file_urls.filter(data => data !== url)
            }
          }
          return file
        })
      }
    })
  }

  const { mutateAsync: saveAssetInfo, isPending: saveAssetInfoIsPending }
    = useMutation({
      mutationKey: ['saveAssetInfo'],
      mutationFn: async (data: SubmitAssetInfo) => {
        const res = await assetsApi.saveAssetInfo(data)
        return res
      }
    })
  function updateAsset() {
    saveAssetInfo(correctionAssetData).then((res) => {
      if (res.code === 1) {
        toast.success(t('assete.addAsset.success.title'))
      }
    })
  }

  const back = () => {
    window.history.back()
  }
  if (isPending) {
    return <Spin spinning={isPending} className="h-100 w-full fcc" />
  }

  return (
    <div className="px-22 py-8 max-md:px-4">
      <div onClick={back} className="mb-8 w-fit fcc gap-1 clickable">
        <div className="i-ic:round-arrow-back text-6 text-white"></div>
        <div className="text-2xl font-600">{t('assete.info.auditDetail')}</div>
      </div>
      {/* 资产驳回理由 */}
      {assetInfo?.submission?.status === ASSET_SUBMISSION_STATUS.REJECTED && (
        <Alert
          className="[&>div>.ant-alert-message]:mb-1"
          icon={<div className="i-ic:round-warning bg-#ec5b56 text-7"></div>}
          message={(
            <div className="text-base text-white font-600">
              {assetAuditLog?.reject_reason}
            </div>
          )}
          description={
            <div className="text-sm text-#D1D5DB">{assetAuditLog?.remark}</div>
          }
          type="error"
          showIcon
          closable
        />
      )}
      {/* 资产信息 */}
      <div className="mt-6 b b-#334155 rounded-3 b-solid bg-#2E384880 p-6 backdrop-blur-4">
        <div className="flex flex-col gap-4 b-b-1 b-#374151 b-solid pb-6">
          <div className="fyc justify-between gap-4">
            <div className="fyc gap-4">
              <div className="text-3xl font-bold">
                {assetInfo?.properties?.name}
              </div>
              <Button
                onClick={() => setIsSwitchModify(res => !res)}
                className="h-10.5 fcc b-1 b-#00E5FF4D b-solid bg-#0A246480 px-4 text-base text-#00E5FF"
              >
                <div className="i-mage:edit-fill text-4"></div>
                <span>{t('assete.info.editInfo')}</span>
              </Button>
            </div>
            {assetInfo?.submission?.status
              === ASSET_SUBMISSION_STATUS.REJECTED && (
              <div className="fcc gap-4 b b-#FF4C4F4D rounded-9999px b-solid bg-#FF4B5033 px-4 py-3">
                <div className="i-si:warning-fill text-4 text-#ec5b56"></div>
                <div className="fcc gap-1 text-base text-#FF4D4F">
                  {assetAuditLog?.reject_reason}
                </div>
              </div>
            )}
          </div>
          <div className="grid cols-3 mt-4 gap-6">
            <div className="fyc gap-4">
              <div className="h-13 w-11 fcc rounded-2 bg-#0A246480">
                <div className="i-iconoir:barcode bg-#68e2fb text-5"></div>
              </div>
              <div>
                <div className="text-sm text-#8A94A6">
                  {t('assete.info.assetNumber')}
                </div>
                <div className="text-base font-bold">
                  {assetInfo?.submission?.code}
                </div>
              </div>
            </div>
            <div className="fyc gap-4">
              <div className="h-13 w-11 fcc rounded-2 bg-#0A246480">
                <div className="i-bi:clock-fill bg-#68e2fb text-5"></div>
              </div>
              <div>
                <div className="text-sm text-#8A94A6">
                  {t('assete.info.submitTime')}
                </div>
                <div className="text-base font-bold">
                  {dayjs().format('YYYY-MM-DD HH:mm:ss')}
                </div>
              </div>
            </div>
            <div className="fyc gap-4">
              <div className="h-13 w-11 fcc rounded-2 bg-#0A246480">
                <div className="i-fa6-solid:user-check bg-#68e2fb text-5"></div>
              </div>
              <div>
                <div className="text-sm text-#8A94A6">
                  {t('assete.info.auditor')}
                </div>
                <div className="text-base font-bold">
                  {getAuditorName(
                    assetInfo?.audit_logs?.[assetInfo?.audit_logs?.length - 1]
                  )?.name || '--'}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pb-16 pt-6">
          <div className="text-xl font-600">
            {t('assete.info.assetBasicInfo')}
          </div>
          <div className="grid cols-2 mt-6 gap-x-10 gap-y-6 [&>div>div:first-child]:mb-1.5 [&>div>div:first-child]:text-sm [&>div>div:last-child]:text-base [&>div>div:first-child]:text-#8A94A6 [&>div>div:last-child]:text-#E5E7EB [&>div>div:last-child]:font-bold">
            {asseteBasicInformation.map(item => (
              <div key={item.name}>
                <div>{t(item.title)}</div>
                {isSwitchModify && !item.disable
                  ? (['area'].includes(item.name)
                      ? (
                          <InputNumber
                            onChange={e => changeCorrectionAssetData(e, item.name)}
                            controls={false}
                            defaultValue={Number(item.value || '')}
                            className="h-12.5 w-full b-#374151 bg-#1E2328 [&>.ant-input-number-input-wrap]:h-full! [&>.ant-input-number-input-wrap>input]:!h-full"
                          >
                          </InputNumber>
                        )
                      : item.name === 'property_type'
                        ? (
                            <Select
                              options={assetHouseTypeData}
                              onChange={e => changeCorrectionAssetData(e, item.name)}
                              defaultValue={item.value || ''}
                              placeholder={t('assete.addAsset.propertyTypePlaceholder')}
                            />
                          )
                        : (
                            <Input
                              onChange={e =>
                                changeCorrectionAssetData(e.target.value, item.name)}
                              defaultValue={item.value || ''}
                              className="h-12.5 b-#374151 bg-#1E2328"
                            >
                            </Input>
                          )
                    )
                  : (
                      <div>
                        {item.name === 'evaluationPrice'
                          ? `$${formatNumberNoRound(
                            Number(item.value || ''),
                            6,
                            2
                          )}`
                          : item.name === 'area'
                            ? `${item.value}㎡`
                            : item.value}
                      </div>
                    )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* 资产文件 */}
      <div className="mt-8 flex gap-8">
        <div className="flex-[68]">
          {/* 合格文件 */}
          <Collapse
            expandIconPosition="end"
            className="b-#1b1f28 bg-#1b1f28 p-2 [&>div]:flex-1 [&>div>.ant-collapse-content]:bg-#1b1f28 [&>div>.ant-collapse-header]:items-center!"
            expandIcon={val => (
              <div
                className={cn(
                  'i-mingcute:up-fill !text-5 bg-#75fb92 transition-all-300 ',
                  val.isActive && 'rotate-180'
                )}
              >
              </div>
            )}
          >
            <Panel
              className=""
              header={(
                <div className="fyc gap-4">
                  <div className="h-13 w-11 fcc rounded-2 bg-#334155">
                    <div className="i-ep:success-filled bg-#75fb92 text-5"></div>
                  </div>
                  <div className="text-xl font-600">
                    {t('assete.info.qualifiedFiles')}
                  </div>
                  <div className="rounded-9999px bg-#334155 px-3 py-1 text-xs text-#00FF85">
                    {t('common.item', { num: classifyFiles.approved.length })}
                  </div>
                </div>
              )}
              key="1"
            >
              {classifyFiles.approved.length > 0
                ? (
                    classifyFiles.approved.map(file => (
                      <FileContent
                        key={file.id}
                        fileName={file.file_info.display_name}
                        fileType={getFileExtension(
                          file?.file_urls?.fileUrls[0] || ''
                        )}
                        showImage={() => {
                          setShowImage({
                            visible: true,
                            url: file.file_urls.fileUrls
                          })
                        }}
                      />
                    ))
                  )
                : (
                    <div className="text-center text-base text-#D1D5DB">
                      {t('common.noContent')}
                    </div>
                  )}
            </Panel>
          </Collapse>

          {/* 不合格文件 */}
          <Collapse
            defaultActiveKey={classifyFiles.rejected.length > 0
              ? ['1']
              : []}
            expandIconPosition="end"
            className="mt-8 b-#1b1f28 bg-#1b1f28 p-2 [&>div]:flex-1 [&>div>.ant-collapse-content]:bg-#1b1f28 [&>div>.ant-collapse-header]:items-center!"
            expandIcon={val => (
              <div
                className={cn(
                  'i-mingcute:up-fill !text-5 bg-#FF4D4F transition-all-300 ',
                  val.isActive && 'rotate-180'
                )}
              >
              </div>
            )}
          >
            <Panel
              key="1"
              className=""
              header={(
                <div className="fyc gap-4">
                  <div className="h-13 w-11 fcc rounded-2 bg-#FF4B5033">
                    <div className="i-famicons:close-circle bg-#ec5b56 text-5"></div>
                  </div>
                  <div className="text-xl font-600">
                    {t('assete.info.unqualifiedFiles')}
                  </div>
                  <div className="rounded-9999px bg-#FF4B5033 px-3 py-1 text-xs text-#FF4D4F">
                    {t('common.item', { num: classifyFiles.rejected.length })}
                  </div>
                </div>
              )}
            >
              <div className="fol gap-4">
                {classifyFiles.rejected.length > 0
                  ? (
                      classifyFiles.rejected.map((item) => {
                        return (
                          <div key={item.id}>
                            {/* <div className="mb-4 fyc justify-between gap-3">
                          <div className="flex-1 truncate text-sm text-#FF4D4F" title={t('assete.info.filePreviewTip')}>{t('assete.info.filePreviewTip')}</div>
                          <div className="fyc gap-1 text-sm text-#00E5FF clickable">
                            <div className="i-ph:magnifying-glass-plus-fill"></div>
                            <div>{t('assete.info.viewErrorDetail')}</div>
                          </div>
                        </div> */}
                            {rejectedFiles(
                              item?.template_file_id || 0
                            )?.file_urls.map((file, _index) => (
                              <FileContent
                                key={file}
                                fileName={`${item?.file_info?.display_name}-${
                                  _index + 1
                                }`}
                                fileType={getFileExtension(file)}
                                showImage={() => {
                                  setShowImage({ visible: true, url: [file] })
                                }}
                                removeImg={() => {
                                  removeImage(file, item.template_file_id)
                                }}
                              />
                            ))}
                            <div className="mt-4 b b-#FF4C4F4D rounded-2 b-solid bg-#0A24634D p-5">
                              <div className="fyc justify-between">
                                <div className="text-lg">
                                  {item?.file_info?.display_name}
                                </div>
                                {/* <div className="rounded-9999px bg-#FF4B5033 px-3 py-1 text-xs text-#FF4D4F">
                            {}
                          </div> */}
                              </div>
                              <div className="mb-5 mt-4 flex b b-#FF4B5033 rounded-2 b-solid bg-#FF4E4E1A p-4">
                                <div className="h-fit fyc gap-1">
                                  <div className="i-ic:round-warning fcc bg-#ec5b56 text-4"></div>
                                  <div className="text-base">
                                    {t('assete.info.errorReason')}
                                    :
                                  </div>
                                </div>
                                <div className="flex-1 text-base text-#FF4D4F">
                                  {item?.file_urls?.remake}
                                </div>
                              </div>
                              <UploadMultifileCard
                                className={cn(
                                  'flex gap-3 [&>div>div>div>div]:b-2 [&>div>div>div>div]:b-#6C728080'
                                )}
                                fileType="image/png,image/jpg,application/pdf"
                                fileUrl={[]}
                                maxLength={1}
                                width="100%"
                                height="auto"
                                loading={uploadFileLoading.includes(
                                  item.template_file_id
                                )}
                                beforeUpload={(_file) => {
                                  uploadIdCardFile(_file, item.template_file_id)
                                }}
                              >
                                <div className="py-3">
                                  <div className="fcc pb-2">
                                    <img src={cloudIcon} className="h-9" alt="" />
                                  </div>
                                  <div className="text-center text-sm text-#9CA3AF">
                                    {t('assete.info.dragFilesHere')}
                                  </div>
                                  <div className="fcc">
                                    <Button className="my-4 h-10 b-#0A2463 bg-#0A2463 px-6 text-base">
                                      <div className="i-bxs:file-pdf text-4 text-white"></div>
                                      <div>{t('assete.info.selectFiles')}</div>
                                    </Button>
                                  </div>
                                  <div className="text-center text-xs text-#6B7280">
                                    {t('common.fileFormat', {
                                      format: 'PDF, JPG, PNG, DOC',
                                      size: '10MB'
                                    })}
                                  </div>
                                </div>
                              </UploadMultifileCard>
                            </div>
                          </div>
                        )
                      })
                    )
                  : (
                      <div className="text-center text-base text-#D1D5DB">
                        {t('common.noContent')}
                      </div>
                    )}
              </div>
            </Panel>
          </Collapse>

          {/* 待审核弹窗 */}
          <Collapse
            expandIconPosition="end"
            className="mt-8 b-#1b1f28 bg-#1b1f28 p-2 [&>div]:flex-1 [&>div>.ant-collapse-content]:bg-#1b1f28 [&>div>.ant-collapse-header]:items-center!"
            expandIcon={val => (
              <div
                className={cn(
                  'i-mingcute:up-fill !text-5 bg-#fbe890 transition-all-300 ',
                  val.isActive && 'rotate-180'
                )}
              >
              </div>
            )}
          >
            <Panel
              className=""
              header={(
                <div className="fyc gap-4">
                  <div className="h-13 w-11 fcc rounded-2 bg-#FFD70033">
                    <div className="i-icon-park-solid:audit bg-#FFD700 text-5"></div>
                  </div>
                  <div className="text-xl font-600">
                    {t('assete.info.pendingAuditFiles')}
                  </div>
                  <div className="rounded-9999px bg-#FFD70033 px-3 py-1 text-xs text-#FFD700">
                    {t('common.item', { num: classifyFiles.pending.length })}
                  </div>
                </div>
              )}
              key="1"
            >
              {classifyFiles.pending.length > 0
                ? (
                    classifyFiles.pending.map(file => (
                      <FileContent
                        key={file.id}
                        fileName={file.file_info.display_name}
                        fileType={getFileExtension(
                          file?.file_urls?.fileUrls[0] || ''
                        )}
                        showImage={() => {
                          setShowImage({
                            visible: true,
                            url: file.file_urls.fileUrls
                          })
                        }}
                      />
                    ))
                  )
                : (
                    <div className="text-center text-base text-#D1D5DB">
                      {t('common.noContent')}
                    </div>
                  )}
            </Panel>
          </Collapse>
        </div>
        <div className="flex-[32]">
          {/* 审核备注 */}
          <div className="rounded-3 bg-#2E384880 p-6 backdrop-blur-4">
            <div className="fyc gap-1.5">
              <div className="h-13 w-11 fcc rounded-2 bg-#0A246480">
                <div className="i-mynaui:message-solid bg-#68e2fb text-5"></div>
              </div>
              <div className="text-xl font-600">
                {t('assete.info.auditRemark')}
              </div>
            </div>
            {assetInfo?.audit_logs.map((log, _index) => (
              <div
                key={log.id}
                className="mt-4 b b-#00E6FF33 rounded-2 b-solid bg-#0A24634D p-5"
              >
                <div className="fyc gap-3">
                  <div className="size-10 fcc b-2 b-#00E5FF rounded-full b-solid">
                    <div className="i-mynaui:user-solid text-6"></div>
                  </div>
                  <div>
                    <div className="text-base font-500">
                      {getAuditorName(log)?.name}
                    </div>
                    <div className="text-xs text-#9CA3AF">
                      {getAuditorName(log)?.position}
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-base text-#D1D5DB">{log?.remark}</div>
                <div className="mt-4 fyc justify-between gap-2 b-t-1 b-t-#38425280 b-t-solid pt-5">
                  <div className="truncate text-xs text-#6B7280">
                    {log?.audit_time
                      && dayjs(log?.audit_time * 1000).format(
                        'YYYY-MM-DD HH:mm:ss'
                      )}
                  </div>
                  {/* <div className="w-fit fyc gap-1 text-sm text-#00E5FF clickable">
                  <div className="i-stash:arrow-reply-solid"></div>
                  <div>回复</div>
                </div> */}
                </div>
              </div>
            ))}
          </div>
          {/* 审核进度 */}
          <div className="mt-8 rounded-3 bg-#2E384880 p-6 backdrop-blur-4">
            <div className="fyc gap-1.5">
              <div className="h-13 w-11 fcc rounded-2 bg-#0A246480">
                <div className="i-akar-icons:history bg-#9ea3ae text-5"></div>
              </div>
              <div className="text-xl font-600">
                {t('assete.info.auditProgress')}
              </div>
            </div>
            <div className="mt-4">
              {assetInfo?.audit_logs.map((item) => {
                if (item.status < 0)
                  return null
                return (
                  <div className="flex gap-4" key={item.id}>
                    <div className="fccc">
                      <div className="size-8 fcc rounded-full bg-#00FF85">
                        <div className="i-iconamoon:check text-4"></div>
                      </div>
                      <div className="h-20 w-0.5 bg-#394150"></div>
                    </div>
                    <div>
                      <div className="text-base font-500">
                        {item.status <= 2
                          ? t(`assete.info.progress.${item.status}.title`)
                          : item.reject_reason}
                      </div>
                      <div className="text-sm text-#9CA3AF">
                        {dayjs().format('YYYY-MM-DD HH:mm:ss')}
                      </div>
                      <div className="mt-1 text-base text-#D1D5DB">
                        {item.status <= 2
                          ? t(
                              `assete.info.progress.${item.status}.description`,
                              { name: item?.auditor_name }
                            )
                          : item.remark}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-40 flex justify-end">
        {assetInfo?.submission?.status === ASSET_SUBMISSION_STATUS.REJECTED
          ? (
              <Button
                loading={saveAssetInfoIsPending}
                onClick={updateAsset}
                className="h-10.5 b-#00E5FF bg-#00E5FF px-11 text-base text-#0D1117 font-600"
              >
                {t('assete.info.submitForReaudit')}
              </Button>
            )
          : null}
      </div>
      {/* 显示图片浮窗 */}
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
  )
}
