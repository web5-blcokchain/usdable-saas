import UploadMultifileCard from '@/components/common/upload/uploa-multifile-card'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Button, Checkbox, Input } from 'antd'

export const Route = createLazyFileRoute(
  '/_app/lawyerWorkbench/offlineExecution/$id'
)({
  component: RouteComponent
})

// 律师线下执行页
function RouteComponent() {
  const { t } = useTranslation()
  const back = () => {
    window.history.back()
  }

  const dataCategoryList = [
    { title: t('lawyerWorkbench.offlineExecution.propertyName'), value: '上海·花家地园区 3-1-402' },
    { title: t('lawyerWorkbench.offlineExecution.certificateNumber'), value: '沪房权证 2024-123456' },
    { title: t('lawyerWorkbench.offlineExecution.ownerName'), value: '张三' },
    { title: t('lawyerWorkbench.offlineExecution.contactInfo'), value: '+86 138-0000-0000' },
    { title: t('lawyerWorkbench.offlineExecution.appointmentTime'), value: '2025-11-01 10:00' },
    { title: t('lawyerWorkbench.offlineExecution.location'), value: '浦东新区不动产登记中心·2号窗口' }
  ]

  const fileNameList = [
    { title: t('lawyerWorkbench.offlineExecution.receipt'), content: t('lawyerWorkbench.offlineExecution.issuedByRegistry') },
    { title: t('lawyerWorkbench.offlineExecution.mortgageCertificate'), content: t('lawyerWorkbench.offlineExecution.obtainedAfterMortgage') },
    { title: t('lawyerWorkbench.offlineExecution.sealedContract'), content: t('lawyerWorkbench.offlineExecution.withSignatures') },
    { title: t('lawyerWorkbench.offlineExecution.ownerIdCopy'), content: t('lawyerWorkbench.offlineExecution.idOrPassport') },
    { title: t('lawyerWorkbench.offlineExecution.feeInvoice'), content: t('lawyerWorkbench.offlineExecution.fees') },
    { title: t('lawyerWorkbench.offlineExecution.offlinePhotos'), content: t('lawyerWorkbench.offlineExecution.windowProcess') }
  ]

  return (
    <div className="px-22 py-13">
      <div className="w-full">
        <div onClick={back} className="w-fit fcc gap-1 clickable">
          <div className="i-ic:round-arrow-back text-6 text-white"></div>
          <div>{t('lawyerWorkbench.offlineExecution.back')}</div>
        </div>
      </div>
      <div className="mt-6 text-sm text-#9CA3AF">
        <div className="mb-1 text-2xl text-white font-600">上海花家地园区</div>
        <div>
          {t('lawyerWorkbench.offlineExecution.taskNumber')}
          ：TASK-2025-04-001 ·
          {t('lawyerWorkbench.offlineExecution.taskType')}
          ：
          {t('lawyerWorkbench.offlineExecution.mortgageRegistration')}
        </div>
        <div>
          {t('lawyerWorkbench.offlineExecution.createdAt')}
          {' '}
          2025-10-31
        </div>
      </div>
      <div className="mt-6 rounded-2 bg-#161B22 p-6">
        <div className="text-xl">{t('lawyerWorkbench.offlineExecution.propertyOwner')}</div>
        <div className="grid cols-2 mt-4 gap-4">
          {
            dataCategoryList.map((item, index) => (
              <div key={index} className="flex flex-col">
                <div className="text-sm text-#9CA3AF">{item.title}</div>
                <div className="text-base text-white">{item.value}</div>
              </div>
            ))
          }
        </div>
      </div>
      {/* 办理文件上传  */}
      <div className="mt-6 rounded-2 bg-#161B22 p-6">
        <div className="fyc justify-between gap-3">
          <div className="text-xl font-600">
            {t('lawyerWorkbench.offlineExecution.fileUpload')}
            {' '}
            (
            {t('lawyerWorkbench.offlineExecution.fileUploadStatus')}
            )
          </div>
          <div className="b-1 b-#60A5FA px-3 py-1 text-sm text-#60A5FA">{t('lawyerWorkbench.offlineExecution.missingRequiredFiles')}</div>
        </div>
        <div className="mt-4 flex flex-col gap-4">
          {
          // 生成6个
            fileNameList.map((item, index) => (
              <div key={index} className="b-1 b-#374151 rounded-2 p-4">
                <div className="fyc justify-between gap-4">
                  <div>
                    <div className="text-base">{item.title}</div>
                    <div className="mt-1 text-xs text-#9CA3AF">{item.content}</div>
                  </div>
                  <div className="rounded-1.5 bg-#374151 px-2 py-1 text-sm">{t('lawyerWorkbench.offlineExecution.pendingUpload')}</div>
                </div>
                <UploadMultifileCard
                  className={cn(
                    'flex gap-3 [&>div>div>div>div]:b-2 [&>div>div>div>div]:b-#4B5563 mt-2 '
                  )}
                  fileType="image/png,image/jpg,application/pdf"
                  fileUrl={[]}
                  maxLength={1}
                  width="100%"
                  height="9rem"
                  // loading={uploadFileLoading}
                  removeFile={(_index) => {
                  // setFileUrl(fileUrl.filter((_, i) => i !== index))
                  }}
                  beforeUpload={(_file) => {
                  // beforeUpload(file)
                  }}
                >
                  <div className="py-3">
                    <div className="text-sm text-#9CA3AF">{t('lawyerWorkbench.offlineExecution.uploadPlaceholder')}</div>
                  </div>
                </UploadMultifileCard>
              </div>
            ))
          }
        </div>
      </div>
      {/* 线下办理备注 */}
      <div className="mt-6 rounded-2 bg-#161B22 p-6">
        <div className="text-xl font-600">{t('lawyerWorkbench.offlineExecution.offlineRemarks')}</div>
        {/* 遇见\n换行 */}
        <Input.TextArea
          className="multiline-placeholder mt-5 b-1 b-#374151"
          autoSize={{ minRows: 5, maxRows: 5 }}
          placeholder={t('lawyerWorkbench.offlineExecution.offlineRemarksPlaceholder')}
        >
        </Input.TextArea>
      </div>
      {/* 异常/阻塞上报 (可选) */}
      <div className="mt-6 rounded-2 bg-#161B22 p-6">
        <div className="text-xl font-600">{t('lawyerWorkbench.offlineExecution.exceptionReporting')}</div>
        <Input.TextArea
          className="mt-5 b-1 b-#374151"
          autoSize={{ minRows: 5, maxRows: 5 }}
          placeholder={t('lawyerWorkbench.offlineExecution.exceptionReportingPlaceholder')}
        >
        </Input.TextArea>
        <div className="mt-2 text-xs text-#9CA3AF">{t('lawyerWorkbench.offlineExecution.notificationText')}</div>
      </div>
      {/* 联系人与协作 */}
      <div className="mt-6 rounded-2 bg-#161B22 p-6">
        <div className="text-xl font-600">{t('lawyerWorkbench.offlineExecution.collaboration')}</div>
        <div className="mt-4 flex flex-col gap-3 text-base [&>div]:fyc [&>div]:justify-between [&>div>div:first-child]:text-#9CA3AF">
          <div>
            <div>{t('lawyerWorkbench.offlineExecution.lawyer')}</div>
            <div>张三 · 139****8888</div>
          </div>
          <div>
            <div>{t('lawyerWorkbench.offlineExecution.complianceSpecialist')}</div>
            <div>李四 · 139****8888</div>
          </div>
          <div>
            <div>{t('lawyerWorkbench.offlineExecution.assetParty')}</div>
            <div>王五 · 139****8888</div>
          </div>
          <div>
            <div>{t('lawyerWorkbench.offlineExecution.intermediary')}</div>
            <div>王二麻子 · 139****8888</div>
          </div>
        </div>
      </div>
      {/* 提交声明 */}
      <div className="mt-6 rounded-2 bg-#161B22 p-6">
        <div className="text-xl font-600">{t('lawyerWorkbench.offlineExecution.submissionDeclaration')}</div>
        <Checkbox className="mt-4 text-xs">{t('lawyerWorkbench.offlineExecution.declarationText')}</Checkbox>
        <div className="mt-4 flex flex-col gap-3 [&>button]:h-12 [&>button]:w-full [&>button]:text-base [&>button]:text-white">
          <Button className="b-#059669 bg-#059669">{t('lawyerWorkbench.offlineExecution.submit')}</Button>
          <Button className="b-#CA8A04 bg-#CA8A04">{t('lawyerWorkbench.offlineExecution.save')}</Button>
          <Button className="b-#DC2626 bg-#DC2626">{t('lawyerWorkbench.offlineExecution.reject')}</Button>
        </div>
        <div className="mt-4 text-xs text-#9CA3AF">{t('lawyerWorkbench.offlineExecution.submissionNotice')}</div>
      </div>
    </div>
  )
}
