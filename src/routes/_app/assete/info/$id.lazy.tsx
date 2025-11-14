import cloudIcon from '@/assets/images/register/cloud.png'
import UploadMultifileCard from '@/components/common/upload/uploa-multifile-card'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Alert, Button, Collapse, Input, InputNumber, Modal } from 'antd'
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

  const [visible, setVisible] = useState(false)
  const [asseteBasicInformation, _setAssteBasicInformation] = useState([
    { title: 'assete.info.houseName', value: '上海花家地园区', name: 'name' },
    { title: 'assete.info.address', value: '上海浦东兴趣张江科技园科技88号', name: 'address' },
    { title: 'assete.info.houseType', value: '住宅', name: 'type' },
    { title: 'assete.info.assetCode', value: '提案-20230615-8742', name: 'code' },
    { title: 'assete.info.appraisalPrice', value: 58000, name: 'evaluationPrice' },
    { title: 'assete.info.area', value: '128㎡', name: 'area' },
    { title: 'assete.info.ownership', value: '张伟', name: 'owner' },
    { title: 'assete.info.submitDate', value: dayjs().format('YYYY-MM-DD HH:mm:ss'), name: 'submissionDate' }
  ])
  const [isSwitchModify, setIsSwitchModify] = useState(false)

  const back = () => {
    window.history.back()
  }
  return (
    <div className="px-22 py-8 max-md:px-4">
      <div onClick={back} className="mb-8 w-fit fcc gap-1 clickable">
        <div className="i-ic:round-arrow-back text-6 text-white"></div>
        <div className="text-2xl font-600">{t('assete.info.auditDetail')}</div>
      </div>
      <Alert
        className="[&>div>.ant-alert-message]:mb-1"
        icon={<div className="i-ic:round-warning bg-#ec5b56 text-7"></div>}
        message={<div className="text-base text-white font-600">资产确权审核未通过</div>}
        description={<div className="text-sm text-#D1D5DB">您提交的资产确权申请存在1项问题，请查看下方详情并补充材料</div>}
        type="error"
        showIcon
        closable
      />
      <div className="mt-6 b b-#334155 rounded-3 b-solid bg-#2E384880 p-6 backdrop-blur-4">
        <div className="flex flex-col gap-4 b-b-1 b-#374151 b-solid pb-6">
          <div className="fyc justify-between gap-4">
            <div className="fyc gap-4">
              <div className="text-3xl font-bold">上海花家地园区</div>
              <Button onClick={() => setIsSwitchModify(res => !res)} className="h-10.5 fcc b-1 b-#00E5FF4D b-solid bg-#0A246480 px-4 text-base text-#00E5FF">
                <div className="i-mage:edit-fill text-4"></div>
                <span>{t('assete.info.editInfo')}</span>
              </Button>
            </div>
            <div className="fcc gap-4 b b-#FF4C4F4D rounded-9999px b-solid bg-#FF4B5033 px-4 py-3">
              <div className="i-si:warning-fill text-4 text-#ec5b56"></div>
              <div className="fcc gap-1 text-base text-#FF4D4F">
                <span>部分资料不合格</span>
                <div className="i-cil:arrow-right text-4 text-#ec5b56"></div>
                <span>待补件</span>
              </div>
            </div>
          </div>
          <div className="grid cols-3 mt-4 gap-6">
            <div className="fyc gap-4">
              <div className="h-13 w-11 fcc rounded-2 bg-#0A246480">
                <div className="i-iconoir:barcode bg-#68e2fb text-5"></div>
              </div>
              <div>
                <div className="text-sm text-#8A94A6">{t('assete.info.assetNumber')}</div>
                <div className="text-base font-bold">提案-20230615-8742</div>
              </div>
            </div>
            <div className="fyc gap-4">
              <div className="h-13 w-11 fcc rounded-2 bg-#0A246480">
                <div className="i-bi:clock-fill bg-#68e2fb text-5"></div>
              </div>
              <div>
                <div className="text-sm text-#8A94A6">{t('assete.info.submitTime')}</div>
                <div className="text-base font-bold">{dayjs().format('YYYY-MM-DD HH:mm:ss')}</div>
              </div>
            </div>
            <div className="fyc gap-4">
              <div className="h-13 w-11 fcc rounded-2 bg-#0A246480">
                <div className="i-fa6-solid:user-check bg-#68e2fb text-5"></div>
              </div>
              <div>
                <div className="text-sm text-#8A94A6">{t('assete.info.auditor')}</div>
                <div className="text-base font-bold">张明律师</div>
              </div>
            </div>
          </div>
        </div>
        <div className="pb-16 pt-6">
          <div className="text-xl font-600">资产基础信息</div>
          <div className="grid cols-2 mt-6 gap-x-10 gap-y-6 [&>div>div:first-child]:mb-1.5 [&>div>div:first-child]:text-sm [&>div>div:last-child]:text-base [&>div>div:first-child]:text-#8A94A6 [&>div>div:last-child]:text-#E5E7EB [&>div>div:last-child]:font-bold">
            {
              asseteBasicInformation.map((item, index) => (
                <div key={index}>
                  <div>{t(item.title)}</div>
                  {
                    isSwitchModify
                      ? (
                          ['evaluationPrice', 'area'].includes(item.name)
                            ? (
                                <InputNumber
                                  controls={false}
                                  defaultValue={item.value}
                                  className="h-12.5 w-full b-#374151 bg-#1E2328 [&>.ant-input-number-input-wrap]:h-full! [&>.ant-input-number-input-wrap>input]:!h-full"
                                >
                                </InputNumber>
                              )
                            : <Input defaultValue={item.value} className="h-12.5 b-#374151 bg-#1E2328"></Input>
                        )
                      : (
                          <div>
                            {item.name === 'evaluationPrice'
                              ? `$${formatNumberNoRound(item.value, 6, 2)}`
                              : (
                                  item.name === 'area' ? `${item.value}㎡` : item.value
                                )}
                          </div>
                        )
                  }
                </div>
              ))
            }
          </div>
        </div>
      </div>
      <div className="mt-8 flex gap-8">
        <div className="flex-[68]">
          <Collapse
            expandIconPosition="end"
            className="b-#1b1f28 bg-#1b1f28 p-2 [&>div]:flex-1 [&>div>.ant-collapse-content]:bg-#1b1f28 [&>div>.ant-collapse-header]:items-center!"
            expandIcon={val => (
              <div className={cn('i-mingcute:up-fill !text-5 bg-#75fb92 transition-all-300 ', val.isActive && 'rotate-180')}></div>
            )}
          >
            <Panel
              className=""
              header={(
                <div className="fyc gap-4">
                  <div className="h-13 w-11 fcc rounded-2 bg-#334155"><div className="i-ep:success-filled bg-#75fb92 text-5"></div></div>
                  <div className="text-xl font-600">{t('assete.info.qualifiedFiles')}</div>
                  <div className="rounded-9999px bg-#334155 px-3 py-1 text-xs text-#00FF85">{t('common.item', { num: 3 })}</div>
                </div>
              )}
              key="1"
            >
              <FileContent fileName="合格文件1" fileSize={1.2} fileType="pdf" showImage={() => { }} />
            </Panel>
          </Collapse>

          <Collapse
            defaultActiveKey={['1']}
            expandIconPosition="end"
            className="mt-8 b-#1b1f28 bg-#1b1f28 p-2 [&>div]:flex-1 [&>div>.ant-collapse-content]:bg-#1b1f28 [&>div>.ant-collapse-header]:items-center!"
            expandIcon={val => (
              <div className={cn('i-mingcute:up-fill !text-5 bg-#FF4D4F transition-all-300 ', val.isActive && 'rotate-180')}></div>
            )}
          >
            <Panel
              className=""
              header={(
                <div className="fyc gap-4">
                  <div className="h-13 w-11 fcc rounded-2 bg-#FF4B5033"><div className="i-famicons:close-circle bg-#ec5b56 text-5"></div></div>
                  <div className="text-xl font-600">{t('assete.info.unqualifiedFiles')}</div>
                  <div className="rounded-9999px bg-#FF4B5033 px-3 py-1 text-xs text-#FF4D4F">{t('common.item', { num: 1 })}</div>
                </div>
              )}
              key="1"
            >
              <div className="mb-4 fyc justify-between gap-3">
                <div className="flex-1 truncate text-sm text-#FF4D4F" title={t('assete.info.filePreviewTip')}>{t('assete.info.filePreviewTip')}</div>
                <div className="fyc gap-1 text-sm text-#00E5FF clickable">
                  <div className="i-ph:magnifying-glass-plus-fill"></div>
                  <div>{t('assete.info.viewErrorDetail')}</div>
                </div>
              </div>
              <FileContent fileName="合格文件1.pdf" fileType="pdf" showImage={() => { }} />
              <div className="mt-4 b b-#FF4C4F4D rounded-2 b-solid bg-#0A24634D p-5">
                <div className="fyc justify-between">
                  <div className="text-lg">{t('assete.info.propertyAddressNote')}</div>
                  <div className="rounded-9999px bg-#FF4B5033 px-3 py-1 text-xs text-#FF4D4F">地址不一致</div>
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
                    地址不一致，需上传盖章说明文件。房产证地址与实际地址存在差异，需补充物业或当地派出所出具的地址变更说明文件，并加盖公章。
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
                      <img src={cloudIcon} className="h-9" alt="" />
                    </div>
                    <div className="text-center text-sm text-#9CA3AF">{t('assete.info.dragFilesHere')}</div>
                    <div className="fcc">
                      <Button className="my-4 h-10 b-#0A2463 bg-#0A2463 px-6 text-base">
                        <div className="i-bxs:file-pdf text-4 text-white"></div>
                        <div>{t('assete.info.selectFiles')}</div>
                      </Button>
                    </div>
                    <div className="text-center text-xs text-#6B7280">
                      {t('common.fileFormat', { format: 'PDF, JPG, PNG, DOC', size: '10MB' })}
                    </div>
                  </div>
                </UploadMultifileCard>
              </div>
            </Panel>
          </Collapse>

          <Collapse
            expandIconPosition="end"
            className="mt-8 b-#1b1f28 bg-#1b1f28 p-2 [&>div]:flex-1 [&>div>.ant-collapse-content]:bg-#1b1f28 [&>div>.ant-collapse-header]:items-center!"
            expandIcon={val => (
              <div className={cn('i-mingcute:up-fill !text-5 bg-#fbe890 transition-all-300 ', val.isActive && 'rotate-180')}></div>
            )}
          >
            <Panel
              className=""
              header={(
                <div className="fyc gap-4">
                  <div className="h-13 w-11 fcc rounded-2 bg-#FFD70033"><div className="i-ic:round-warning bg-#FFD700 text-5"></div></div>
                  <div className="text-xl font-600">{t('assete.info.pendingSupplementFiles')}</div>
                  <div className="rounded-9999px bg-#FFD70033 px-3 py-1 text-xs text-#FFD700">{t('common.item', { num: 3 })}</div>
                </div>
              )}
              key="1"
            >
              <div className="flex justify-between gap-4 b b-#FFD7004D rounded-2 b-solid bg-#0A24634D p-4">
                <div className="fyc flex-1 gap-4">
                  <div className="size-20 fcc rounded-2 bg-#2E384880">
                    {
                      ''.endsWith('.pdf')
                        ? (
                            <div className="i-bxs:file-pdf text-7 text-#ed742f"></div>
                          )
                        : <div className="i-bxs:file-image text-7 text-#75fb92"></div>
                    }
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="text-base font-600">土地使用权证明</div>
                    <div className="text-sm text-#D1D5DB">提交的土地使用权证明文件模糊，关键信息无法辨认，请重新上传清晰的扫描件或照片。</div>
                    <div className="w-fit fyc gap-1 text-sm text-#FFD700 clickable">
                      <div className="i-flowbite:upload-solid text-lg"></div>
                      <div>{t('assete.info.uploadAgain')}</div>
                    </div>
                  </div>
                </div>
                <div className="h-fit rounded-1 bg-#FFD70033 px2 py1 text-xs text-#FFD700">文件模糊</div>
              </div>
            </Panel>
          </Collapse>
        </div>
        <div className="flex-[32]">
          <div className="rounded-3 bg-#2E384880 p-6 backdrop-blur-4">
            <div className="fyc gap-1.5">
              <div className="h-13 w-11 fcc rounded-2 bg-#0A246480">
                <div className="i-mynaui:message-solid bg-#68e2fb text-5"></div>
              </div>
              <div className="text-xl font-600">审核备注</div>
            </div>
            <div className="mt-4 b b-#00E6FF33 rounded-2 b-solid bg-#0A24634D p-5">
              <div className="fyc gap-3">
                <div className="size-10 fcc b-2 b-#00E5FF rounded-full b-solid">
                  <div className="i-mynaui:user-solid text-6"></div>
                </div>
                <div>
                  <div className="text-base font-500">张明律师</div>
                  <div className="text-xs text-#9CA3AF">高级资产确权律师</div>
                </div>
              </div>
              <div className="mt-3 text-base text-#D1D5DB">
                资料基本完整，但产权地址需补充说明。房产证地址与实际地址存在差异，需补充物业或当地派出所出具的地址变更说明文件，并加盖公章。土地使用权证明文件模糊，建议重新扫描或拍摄清晰照片后上传。抵押信息证明文件缺失，需补充最新的不动产登记查询证明。
              </div>
              <div className="mt-4 fyc justify-between gap-2 b-t-1 b-t-#38425280 b-t-solid pt-5">
                <div className="truncate text-xs text-#6B7280">{dayjs().format('YYYY-MM-DD HH:mm:ss')}</div>
                <div className="w-fit fyc gap-1 text-sm text-#00E5FF clickable">
                  <div className="i-stash:arrow-reply-solid"></div>
                  <div>回复</div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 rounded-3 bg-#2E384880 p-6 backdrop-blur-4">
            <div className="fyc gap-1.5">
              <div className="h-13 w-11 fcc rounded-2 bg-#0A246480">
                <div className="i-akar-icons:history bg-#9ea3ae text-5"></div>
              </div>
              <div className="text-xl font-600">审核进度</div>
            </div>
            <div className="mt-4">
              {
                [0, 1].map(item => (
                  <div className="flex gap-4" key={item}>
                    <div className="fccc">
                      <div className="size-8 fcc rounded-full bg-#00FF85">
                        <div className="i-iconamoon:check text-4"></div>
                      </div>
                      <div className="h-20 w-0.5 bg-#394150"></div>
                    </div>
                    <div>
                      <div className="text-base font-500">律师审核完成</div>
                      <div className="text-sm text-#9CA3AF">{dayjs().format('YYYY-MM-DD HH:mm:ss')}</div>
                      <div className="mt-1 text-base text-#D1D5DB">资产确权律师张明已完成审核</div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
      <div className="mt-40 flex justify-end">
        <Button className="h-10.5 b-#00E5FF bg-#00E5FF px-11 text-base text-#0D1117 font-600">
          {t('assete.info.submitForReaudit')}
        </Button>
      </div>

      <ErrorDialog visible={visible} setVisible={setVisible} message="提交失败，请检查网络连接或稍后重试" />
    </div>
  )
}

function ErrorDialog({ visible, setVisible, message }: { visible: boolean, setVisible: (visible: boolean) => void, message: string }) {
  const { t } = useTranslation()
  return (
    <Modal
      closable={false}
      open={visible}
      onCancel={close}
      maskClosable={false}
      width={420}
      className={cn('login-dialog [&>div>.ant-modal-content]:!bg-#0D1117 b-1 b-solid b-#00E5FF80 shadow-[0_0_10px_0_#00E5FF80] ', 'rounded-2')}
      centered
      footer={() => (<div></div>)}
    >
      <div className="fccc gap-4">
        <div className="size-16 fcc rounded-full bg-#FF3C1E33">
          <div className="i-mingcute:close-fill text-9 text-#FF3A3A"></div>
        </div>
        <div className="text-xl font-600">{t('common.submitError')}</div>
        <div className="text-base text-#9CA3AF">{message}</div>
        <Button onClick={() => setVisible(false)} className="h-10 w-full bg-#00E5FF text-base text-black font-600">
          {t('common.confirm')}
        </Button>
      </div>
    </Modal>
  )
}
