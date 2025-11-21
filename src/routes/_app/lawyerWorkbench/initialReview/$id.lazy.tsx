import testImage from '@/assets/test/test.png'
import { CommonDialog } from '@/components/common/dialog/common'
import UploadMultifileCard from '@/components/common/upload/uploa-multifile-card'
import { formatNumberNoRound } from '@/utils/number'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Button, Input, Select } from 'antd'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export const Route = createLazyFileRoute('/_app/lawyerWorkbench/initialReview/$id')({
  component: RouteComponent
})

function RouteComponent() {
  const { t } = useTranslation()
  const back = () => {
    window.history.back()
  }

  const [rejectVisible, setRejectVisible] = useState(false)

  return (
    <div className="p-22">
      <div className="w-full">
        <div onClick={back} className="w-fit fcc gap-1 clickable">
          <div className="i-ic:round-arrow-back text-6 text-white"></div>
          <div>{t('register.asset.back')}</div>
        </div>
      </div>
      <div className="mt-10 flex justify-between gap-4 b-1 b-#3341554D rounded-3 b-solid bg-#161B22 px-6 py-16">
        <div>
          <div className="text-8 font-bold">上海花家地园区</div>
          <div className="mt-1 text-#94A3B8">上海市浦东新区张江高科技园区博云路2号</div>
        </div>
        <div className="fyc gap2 text-sm">
          <div className="i-bi:clock-fill bg-#68e2fb"></div>
          <div>
            {t('assete.addAsset.submitTime')}
            : 2023-11-15 09:32
          </div>
        </div>
      </div>
      <div className="mt-8 fyc gap-2 text-xl font-600">
        <div className="i-bxs:file text-primary"></div>
        <div>{t('lawyerWorkbench.initialReview.fileReviewArea')}</div>
      </div>
      <div className="mt-6 b-l-4 b-l-primary px-4 py-1 text-lg font-600">
        {t('lawyerWorkbench.initialReview.mainFiles')}
      </div>
      <div className="mt-4 flex gap-8">
        <div className="w-65%">
          <div className="flex flex-col gap-6">
            <div className="b-1 b-#334155 rounded-3 b-solid bg-#0D1014">
              <div className="flex gap-6 p-6">
                <div className="h-40 w-50 overflow-hidden b-1 b-#374151 rounded-2 b-solid">
                  <img src={testImage} className="size-full object-cover" alt="" />
                </div>
                <div className="flex-1">
                  <div className="fyc justify-between gap-3">
                    <div className="fyc gap-1">
                      <div className="text-lg font-600">{t('lawyerWorkbench.initialReview.fileTypes.propertyCertificate')}</div>
                      <div className="rounded-9999px bg-#00E6FF33 px-2 py-1 text-xs text-primary font-600">{t('lawyerWorkbench.initialReview.required')}</div>
                    </div>
                    <div className="fyc gap-1 rounded-2 bg-#FF4B5033 px-3 py-2 text-sm text-#FF4D4F clickable">
                      <div className="i-mingcute:close-fill text-base"></div>
                      <div>{t('lawyerWorkbench.initialReview.reject')}</div>
                    </div>
                  </div>
                  <div className="grid cols-3 mt-4 gap-4 text-base [&>div>div:first-child]:mb-1.5 [&>div]:b-1 [&>div]:b-#374151 [&>div]:rounded-2 [&>div]:bg-#0E121880 [&>div]:p-3 [&>div>div:first-child]:text-xs [&>div>div:first-child]:text-#94A3B8">
                    <div>
                      <div>{t('lawyerWorkbench.initialReview.fileDetails.certificateNumber')}</div>
                      <div>沪房地浦字(2022)第012345号</div>
                    </div>
                    <div>
                      <div>{t('lawyerWorkbench.initialReview.fileDetails.propertyOwner')}</div>
                      <div>李建国</div>
                    </div>
                    <div>
                      <div>{t('lawyerWorkbench.initialReview.fileDetails.registrationDate')}</div>
                      <div>{dayjs().format('YYYY-MM-DD')}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-9 rounded-b-3 bg-#00FF85"></div>
            </div>
            <div className="b-1 b-#334155 rounded-3 b-solid bg-#0D1014">
              <div className="flex gap-6 p-6">
                <div className="grid cols-2 w-50 gap-2">
                  {
                    [1, 2, 3].map(item => (
                      <div key={item} className="h-20 w-full overflow-hidden b-1 b-#374151 rounded-2 b-solid">
                        <img src={testImage} className="size-full object-cover" alt="" />
                      </div>
                    ))
                  }
                  <div className="h-20 w-full fcc b-1 b-#6B7280 rounded-2 border-dashed text-xs text-#9CA3AF">
                    +2
                    {' '}
                    {t('lawyerWorkbench.initialReview.photoCount')}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="fyc justify-between gap-3">
                    <div className="fyc gap-1">
                      <div className="text-lg font-600">{t('lawyerWorkbench.initialReview.fileTypes.propertyPhotos')}</div>
                      <div className="rounded-9999px bg-#00E6FF33 px-2 py-1 text-xs text-primary font-600">
                        {t('lawyerWorkbench.initialReview.required')}
                        {' '}
                        {'>=3'}
                        {t('lawyerWorkbench.initialReview.photoCount')}
                      </div>
                    </div>
                    <div className="fyc gap-1 rounded-2 bg-#FF4B5033 px-3 py-2 text-sm text-#FF4D4F clickable">
                      <div className="i-mingcute:close-fill text-base"></div>
                      <div>驳回</div>
                    </div>
                  </div>
                  <div className="grid cols-3 mt-4 gap-4 text-base [&>div>div:first-child]:mb-1.5 [&>div]:b-1 [&>div]:b-#374151 [&>div]:rounded-2 [&>div]:bg-#0E121880 [&>div]:p-3 [&>div>div:first-child]:text-xs [&>div>div:first-child]:text-#94A3B8">
                    <div>
                      <div>{t('lawyerWorkbench.initialReview.fileDetails.photoCount')}</div>
                      <div>
                        5
                        {t('lawyerWorkbench.initialReview.photoCount')}
                        {' '}
                        (
                        {t('lawyerWorkbench.initialReview.fileStatus.verified')}
                        )
                      </div>
                    </div>
                    <div>
                      <div>{t('lawyerWorkbench.initialReview.fileDetails.clarity')}</div>
                      <div>{t('lawyerWorkbench.initialReview.fileStatus.verified')}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-9 rounded-b-3 bg-#00FF85"></div>
            </div>
            <div className="b-1 b-#334155 rounded-3 b-solid bg-#0D1014">
              <div className="flex gap-6 p-6">
                <div className="h-40 w-50 overflow-hidden b-1 b-#374151 rounded-2 b-solid">
                  <img src={testImage} className="size-full object-cover" alt="" />
                </div>
                <div className="flex-1">
                  <div className="fyc justify-between gap-3">
                    <div className="fyc gap-1">
                      <div className="text-lg font-600">{t('lawyerWorkbench.initialReview.fileTypes.landUseRightCertificate')}</div>
                      <div className="rounded-9999px bg-#00E6FF33 px-2 py-1 text-xs text-primary font-600">{t('lawyerWorkbench.initialReview.required')}</div>
                    </div>
                    <div className="fyc gap-1 rounded-2 bg-#FF4B5033 px-3 py-2 text-sm text-#FF4D4F clickable">
                      <div className="i-mingcute:close-fill text-base"></div>
                      <div>驳回</div>
                    </div>
                  </div>
                  <div className="grid cols-3 mt-4 gap-4 text-base [&>div>div:first-child]:mb-1.5 [&>div]:b-1 [&>div]:b-#374151 [&>div]:rounded-2 [&>div]:bg-#0E121880 [&>div]:p-3 [&>div>div:first-child]:text-xs [&>div>div:first-child]:text-#94A3B8">
                    <div>
                      <div>{t('lawyerWorkbench.initialReview.fileDetails.usageType')}</div>
                      <div>{t('lawyerWorkbench.initialReview.fileDetails.usageTypeExample', { num: 70 })}</div>
                    </div>
                    <div>
                      <div>{t('lawyerWorkbench.initialReview.fileDetails.certificateCode')}</div>
                      <div>沪房地浦字(2020)第005678号</div>
                    </div>
                    <div>
                      <div>{t('lawyerWorkbench.initialReview.fileDetails.endDate')}</div>
                      <div>{dayjs().add(70, 'year').format('YYYY-MM-DD')}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-9 rounded-b-3 bg-#00FF85"></div>
            </div>
          </div>
          <div className="mt-10 b-l-4 b-l-#00E5FF80 px-4 py-1 text-lg font-600">
            {t('lawyerWorkbench.initialReview.optionalFiles')}
          </div>
          {/* 非必选文件列表 */}
          <div className="mt-5 flex flex-col gap-6">
            <div className="b-1 b-#334155 rounded-3 b-solid bg-#0D1014">
              <div className="flex gap-6 p-6">
                <div className="h-40 w-50 overflow-hidden b-1 b-#374151 rounded-2 b-solid">
                  <img src={testImage} className="size-full object-cover" alt="" />
                </div>
                <div className="flex-1">
                  <div className="fyc justify-between gap-3">
                    <div className="fyc gap-1">
                      <div className="text-lg font-600">{t('lawyerWorkbench.initialReview.fileTypes.purchaseContract')}</div>
                    </div>
                    <div className="fyc gap-1 rounded-2 bg-#FF4B5033 px-3 py-2 text-sm text-#FF4D4F clickable">
                      <div className="i-mingcute:close-fill text-base"></div>
                      <div>驳回</div>
                    </div>
                  </div>
                  <div className="grid cols-3 mt-4 gap-4 text-base [&>div>div:first-child]:mb-1.5 [&>div]:b-1 [&>div]:b-#374151 [&>div]:rounded-2 [&>div]:bg-#0E121880 [&>div]:p-3 [&>div>div:first-child]:text-xs [&>div>div:first-child]:text-#94A3B8">
                    <div>
                      <div>{t('lawyerWorkbench.initialReview.fileDetails.contractNumber')}</div>
                      <div>HT-2022-58741</div>
                    </div>
                    <div>
                      <div>{t('lawyerWorkbench.initialReview.fileDetails.purchaseAmount')}</div>
                      <div>
                        $
                        {formatNumberNoRound(5680000, 6, 0)}
                      </div>
                    </div>
                    <div>
                      <div>{t('lawyerWorkbench.initialReview.fileDetails.signingDate')}</div>
                      <div>{dayjs().format('YYYY-MM-DD')}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-9 rounded-b-3 bg-#00FF85"></div>
            </div>
            <div className="b-1 b-#334155 rounded-3 b-solid bg-#0D1014">
              <div className="flex gap-6 p-6">
                <div className="h-40 w-50 overflow-hidden b-1 b-#374151 rounded-2 b-solid">
                  <img src={testImage} className="size-full object-cover" alt="" />
                </div>
                <div className="flex-1">
                  <div className="fyc justify-between gap-3">
                    <div className="fyc gap-1">
                      <div className="text-lg font-600">{t('lawyerWorkbench.initialReview.fileTypes.purchaseInvoice')}</div>
                    </div>
                    <div className="fyc gap-1 rounded-2 bg-#FF4B5033 px-3 py-2 text-sm text-#FF4D4F clickable">
                      <div className="i-mingcute:close-fill text-base"></div>
                      <div>驳回</div>
                    </div>
                  </div>
                  <div className="grid cols-3 mt-4 gap-4 text-base [&>div>div:first-child]:mb-1.5 [&>div]:b-1 [&>div]:b-#374151 [&>div]:rounded-2 [&>div]:bg-#0E121880 [&>div]:p-3 [&>div>div:first-child]:text-xs [&>div>div:first-child]:text-#94A3B8">
                    <div>
                      <div>{t('lawyerWorkbench.initialReview.fileDetails.invoiceNumber')}</div>
                      <div>0023658941</div>
                    </div>
                    <div>
                      <div>{t('lawyerWorkbench.initialReview.fileDetails.invoiceAmount')}</div>
                      <div>
                        $
                        {formatNumberNoRound(5680000, 6, 0)}
                      </div>
                    </div>
                    <div>
                      <div>{t('lawyerWorkbench.initialReview.fileDetails.invoiceDate')}</div>
                      <div>{dayjs().format('YYYY-MM-DD')}</div>
                    </div>
                  </div>
                  <div className="mt-4 fyc gap-1 text-base text-#FF4D4F">
                    <div className="i-ep:circle-close-filled"></div>
                    <div>{t('lawyerWorkbench.initialReview.fileDetails.verificationFailed')}</div>
                  </div>
                </div>
              </div>
              <div className="h-9 rounded-b-3 bg-#00FF85"></div>
            </div>
            <OptionalFileCard title={t('lawyerWorkbench.initialReview.fileTypes.mortgageFile')} remark={t('lawyerWorkbench.initialReview.upload.remark')} t={t} />
          </div>
        </div>
        <div className="h-fit flex-1 b-1 b-#334155 rounded-3 b-solid bg-#0D1014 px-6 py-7.5">
          <div className="fyc gap-2 text-lg font-600">
            <div className="i-entypo:back-in-time text-#4aa3b6"></div>
            <div>{t('lawyerWorkbench.initialReview.reviewHistory')}</div>
          </div>
          <div className="mt-4 flex flex-col gap-4">
            {
              [1, 2, 3].map((item, index) => (
                <div
                  key={item}
                  className="b-b-1 b-b-#38425280 pb-4 [&:last-child]:b-0 [&:last-child]:pb-0"
                >
                  <div className="fyc justify-between gap-4">
                    <div className="fyc gap2">
                      <img className="size-8 rounded-full" src={(new URL('@/assets/test/img.png', import.meta.url).href)} alt="" />
                      <div>{t('lawyerWorkbench.initialReview.lawyerName', { name: '张明' })}</div>
                    </div>
                    <div>{dayjs().add(-1 * index, 'day').format('YYYY-MM-DD')}</div>
                  </div>
                  <div className="mt-1 text-sm text-#D1D5DB">驳回购房发票</div>
                  <div className="p-4 text-xs text-#94A3B8">金额与购房合同不符，发票金额为¥5,580,000，合同金额为¥5,680,000，请核实。</div>
                </div>
              ))
            }
          </div>

        </div>
      </div>
      <div className="mt-28 fyc justify-end gap-4 pb-10 [&>button]:h-12 [&>button]:min-w-51 [&>button]:px-7 [&>button]:text-base [&>button]:font-600">
        <Button className="b-#00E5FF bg-#00E5FF text-black">{t('lawyerWorkbench.initialReview.submitToEvaluator')}</Button>
        <Button onClick={() => setRejectVisible(true)} className="b-#FF4D4F bg-#FF4D4F text-black">{t('lawyerWorkbench.initialReview.reject')}</Button>
      </div>
      <RejectModal visible={rejectVisible} setVisible={setRejectVisible} t={t} />
    </div>
  )
}

// 非必选文件，未上传组件
function OptionalFileCard({ title, remark, t }: { title: string, remark: string, t: any }) {
  return (
    <div className="b-1 b-#334155 rounded-3 b-solid bg-#0D1014">
      <div className="flex gap-6 p-6">
        <div className="h-40 w-50">
          <UploadFileCard title={t('lawyerWorkbench.initialReview.upload.clickToUploadMortgageFile')} t={t} />
        </div>
        <div className="flex-1">
          <div className="fyc justify-between gap-3">
            <div className="fyc gap-1">
              <div className="text-lg font-600">{title}</div>
              <div className="rounded-9999px bg-#4C566480 px-2 py-1 text-xs text-#9CA3AF font-600">{t('lawyerWorkbench.initialReview.optional')}</div>
            </div>
            <div className="fyc gap-1 rounded-2 bg-#FF4B5033 px-3 py-2 text-sm text-#FF4D4F clickable">
              <div className="i-mingcute:close-fill text-base"></div>
              <div>驳回</div>
            </div>
          </div>
          <div className="grid cols-3 mt-4 gap-4 text-base [&>div>div:first-child]:mb-1.5 [&>div]:b-1 [&>div]:b-#374151 [&>div]:rounded-2 [&>div]:bg-#0E121880 [&>div]:p-3 [&>div>div:first-child]:text-xs [&>div>div:first-child]:text-#94A3B8">
            <div>
              <div>{t('lawyerWorkbench.initialReview.fileDetails.fileStatus')}</div>
              <div className="text-#FFD700">{t('lawyerWorkbench.initialReview.fileStatus.notUploaded')}</div>
            </div>
            <div>
              <div>{t('lawyerWorkbench.initialReview.fileDetails.remark')}</div>
              <div className="text-#9CA3AF">{remark}</div>
            </div>
            <div>
              <div>{t('assete.addAsset.submitTime')}</div>
              <div>{dayjs().format('YYYY-MM-DD')}</div>
            </div>
          </div>
          <div className="mt-4 fyc gap-1 text-base text-#FFD700">
            <div className="i-ant-design:warning-filled"></div>
            <div>{t('lawyerWorkbench.initialReview.fileStatus.pending')}</div>
          </div>
        </div>
      </div>
      <div className="h-9 rounded-b-3 bg-#00FF85"></div>
    </div>
  )
}

// 上传文件组件
function UploadFileCard({ title, t }: { title: string, t: any }) {
  return (
    <UploadMultifileCard
      className={cn(
        'flex gap-3 [&>div>div>div>div]:b-2 [&>div>div>div>div]:rounded-2  [&>div>div>div>div]:border-2   [&>div>div>div>div]:b-#4B5563'
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
          <div className="i-bxs:file-pdf text-10 text-#6c727f"></div>
        </div>
        <div className="w-full overflow-hidden text-center text-sm text-#9CA3AF">{title}</div>
        <div className="w-full overflow-hidden text-center text-xs text-#6B7280">{t('lawyerWorkbench.initialReview.optional')}</div>
      </div>
    </UploadMultifileCard>
  )
}

// 驳回弹窗
function RejectModal({ visible, setVisible, t }: {
  visible: boolean
  setVisible: (visible: boolean) => void
  t: any
}) {
  return (
    <CommonDialog
      style={{
        '--common-dialog-header-background': '#FF4B5033',
        '--common-dialog-body-background': '#20293a',
        '--common-dialog-footer-background': '#1b222f',
        '--common-dialog-padding-y': '1rem'
      } as any}
      title={(
        <div className="fyc gap2 text-base font-bold">
          <div className="i-ep:circle-close-filled text-#ec5b56"></div>
          <div>{t('lawyerWorkbench.initialReview.rejectDialogTitle')}</div>
        </div>
      )}
      open={visible}
      onCancel={() => setVisible(false)}
      closable
      footer={(
        <div className="fyc justify-end gap-3 text-base [&>button]:h-10 [&>button]:px-4">
          <Button onClick={() => setVisible(false)} className="b-#374151 bg-#374151">{t('common.cancel')}</Button>
          <Button onClick={() => setVisible(false)} className="b-#EF494C bg-#EF494C">{t('lawyerWorkbench.initialReview.reject')}</Button>
        </div>
      )}
    >
      <div className="py-6">
        <div className="text-base text-#94A3B8">{t('lawyerWorkbench.initialReview.rejectDialog.reason')}</div>
        <div className="mt-4 text-sm text-#94A3B8">{t('lawyerWorkbench.initialReview.rejectDialog.type')}</div>
        <Select className="mt-2 [&>.ant-select-selector]:!b-#374151 [&>.ant-select-selector]:!bg-#171d28" placeholder={t('lawyerWorkbench.initialReview.rejectDialog.selectReason')} />
        <div className="mt-6 text-sm">{t('lawyerWorkbench.initialReview.rejectDialog.details')}</div>
        <Input.TextArea className="mt-2 b-1 b-#374151 !bg-#171d28" autoSize={{ minRows: 6, maxRows: 6 }} />
      </div>
    </CommonDialog>
  )
}
