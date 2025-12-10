import assetsApi from '@/api/assetsApi'
import * as lawyerWorkbenchApi from '@/api/lawyerWorkbenchApi'
import { CommonDialog } from '@/components/common/dialog/common'
import { formatNumberNoRound } from '@/utils/number'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Input, Spin, Upload } from 'antd'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

// 待线下执行案件 => 执行案件操作弹窗
export function ExecuteCaseDialog({
  visible,
  setvisible
}: {
  visible: boolean
  setvisible: (visible: boolean) => void
}) {
  const { t } = useTranslation()
  return (
    <CommonDialog
      open={visible}
      style={
        {
          '--common-dialog-footer-background': '#171b21',
          '--common-dialog-body-background': '#171b21',
          '--common-dialog-header-background': '#171b21'
        } as any
      }
      width={446}
      onCancel={() => setvisible(false)}
      title={(
        <div className="text-xl">
          {t('lawyerWorkbench.executeCaseDialog.title')}
        </div>
      )}
      closable={false}
      footer={(
        <div className="fyc justify-end gap-3">
          <Button
            className="h-8 b-#0A192F rounded-2 bg-#0A192F px-6 text-sm text-#D1D5DB"
            onClick={() => setvisible(false)}
          >
            {t('common.cancel')}
          </Button>
          <Button
            className="h-8 b-#00E5FF rounded-2 bg-#00E5FF px-6 text-sm text-black"
            onClick={() => setvisible(false)}
          >
            {t('common.confirm')}
          </Button>
        </div>
      )}
    >
      <div className="bg-#171b21 py-6">
        <div className="text-base text-#9CA3AF">
          {t('lawyerWorkbench.executeCaseDialog.uploadInstruction')}
        </div>
        <div className="mt-4 text-sm text-#9CA3AF">
          {t('lawyerWorkbench.executeCaseDialog.uploadLabel')}
        </div>
        <Upload
          directory
          className=""
          accept=".pdf,.png,.jpg,.jpeg"
          showUploadList={false}
          beforeUpload={(_file) => {}}
        >
          <Button className="mt-4 h-8 bg-white px-3 text-sm text-black">
            {t('lawyerWorkbench.executeCaseDialog.selectFile')}
          </Button>
        </Upload>
      </div>
    </CommonDialog>
  )
}

// 待认领案件（初审阶段) => 确认认领弹窗
export function ConfirmClaimDialog({
  visible,
  setvisible,
  data,
  reloadTable
}: {
  visible: boolean
  setvisible: (visible: boolean) => void
  data: lawyerWorkbenchApi.PendingCaseList
  reloadTable: () => void
}) {
  const { t } = useTranslation()
  const { mutateAsync: claimSubmission, isPending: claimSubmissionLoading }
    = useMutation({
      mutationKey: ['claimSubmission'],
      mutationFn: async (data: {
        /**
         * 资产提交id
         */
        submission_id: number
      }) => {
        return await lawyerWorkbenchApi.claimSubmission(data)
      }
    })
  const handleConfirm = useCallback(async () => {
    await claimSubmission({ submission_id: data?.id }).then((res) => {
      if (res.code === 1) {
        toast.success(t('lawyerWorkbench.confirmClaimDialog.confirmSuccess'))
        setvisible(false)
        reloadTable()
      }
    })
  }, [claimSubmission, data?.id, setvisible])
  return (
    <CommonDialog
      open={visible}
      style={
        {
          '--common-dialog-footer-background': '#171b21',
          '--common-dialog-body-background': '#171b21',
          '--common-dialog-header-background': '#171b21'
        } as any
      }
      width={446}
      onCancel={() => setvisible(false)}
      title={(
        <div className="text-xl">
          {t('lawyerWorkbench.confirmClaimDialog.title')}
        </div>
      )}
      closable={false}
      footer={(
        <div className="fyc justify-end gap-3">
          <Button
            className="h-8 b-#0A192F rounded-2 bg-#0A192F px-6 text-sm text-#D1D5DB"
            onClick={() => setvisible(false)}
          >
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleConfirm}
            loading={claimSubmissionLoading}
            className="h-8 b-#00E5FF rounded-2 bg-#00E5FF px-6 text-sm text-black"
          >
            {t('common.confirm')}
          </Button>
        </div>
      )}
    >
      <div className="bg-#171b21 py-6">
        <div className="text-base text-#9CA3AF">
          {t('lawyerWorkbench.confirmClaimDialog.confirmMessage', {
            id: data?.code
          })}
        </div>
      </div>
    </CommonDialog>
  )
}

// 待线下执行案件 => 确认认领弹窗
export function PendingOfflineExecutionDialog({
  visible,
  setvisible,
  data,
  reloadTable
}: {
  visible: boolean
  setvisible: (visible: boolean) => void
  data: lawyerWorkbenchApi.CaseListData
  reloadTable: () => void
}) {
  const { t } = useTranslation()
  const [remark, setRemark] = useState('')
  const { mutateAsync: claimSubmission, isPending: claimSubmissionLoading }
    = useMutation({
      mutationKey: ['claimSubmission'],
      mutationFn: async () => {
        return await lawyerWorkbenchApi.claimOfflineSubmission({
          submission_id: data?.id,
          remark
        })
      }
    })
  const handleConfirm = useCallback(async () => {
    await claimSubmission().then((res) => {
      if (res.code === 1) {
        toast.success(
          t('lawyerWorkbench.pendingOfflineExecutionDialog.success')
        )
        setvisible(false)
        reloadTable()
      }
    })
  }, [claimSubmission, data?.id, setvisible])
  return (
    <CommonDialog
      open={visible}
      style={
        {
          '--common-dialog-footer-background': '#171b21',
          '--common-dialog-body-background': '#171b21',
          '--common-dialog-header-background': '#171b21'
        } as any
      }
      width={446}
      onCancel={() => setvisible(false)}
      title={(
        <div className="text-xl">
          {t('lawyerWorkbench.pendingOfflineExecutionDialog.title')}
        </div>
      )}
      closable={false}
      footer={(
        <div className="fyc justify-end gap-3">
          <Button
            className="h-8 b-#0A192F rounded-2 bg-#0A192F px-6 text-sm text-#D1D5DB"
            onClick={() => setvisible(false)}
          >
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleConfirm}
            loading={claimSubmissionLoading}
            className="h-8 b-#00E5FF rounded-2 bg-#00E5FF px-6 text-sm text-black"
          >
            {t('common.confirm')}
          </Button>
        </div>
      )}
    >
      <div className="bg-#171b21 py-6">
        <div className="text-base text-#9CA3AF">
          {t('lawyerWorkbench.pendingOfflineExecutionDialog.confirmMessage', {
            code: data?.code
          })}
        </div>
        <div>
          <div className="mb-2 mt-4">
            {t('lawyerWorkbench.pendingOfflineExecutionDialog.remark')}
          </div>
          <Input
            value={remark}
            onChange={e => setRemark(e?.currentTarget?.value)}
            placeholder={t(
              'lawyerWorkbench.pendingOfflineExecutionDialog.remarkPlaceholder'
            )}
          />
        </div>
      </div>
    </CommonDialog>
  )
}

// 待确权案件（线下确认阶段） => 确认签章弹窗
export function ConfirmSignDialog({
  visible,
  setvisible
}: {
  visible: boolean
  setvisible: (visible: boolean) => void
}) {
  const { t } = useTranslation()
  return (
    <CommonDialog
      open={visible}
      style={
        {
          '--common-dialog-footer-background': '#171b21',
          '--common-dialog-body-background': '#171b21',
          '--common-dialog-header-background': '#171b21'
        } as any
      }
      width={446}
      onCancel={() => setvisible(false)}
      title={(
        <div className="text-xl">
          {t('lawyerWorkbench.confirmSignDialog.title')}
        </div>
      )}
      closable={false}
      footer={(
        <div className="fyc justify-end gap-3">
          <Button
            className="h-8 b-#0A192F rounded-2 bg-#0A192F px-6 text-sm text-#D1D5DB"
            onClick={() => setvisible(false)}
          >
            {t('common.cancel')}
          </Button>
          <Button
            className="h-8 b-#00E5FF rounded-2 bg-#00E5FF px-6 text-sm text-black"
            onClick={() => setvisible(false)}
          >
            {t('common.confirm')}
          </Button>
        </div>
      )}
    >
      <div className="bg-#171b21 py-6">
        <div className="text-base text-#9CA3AF">
          {t('lawyerWorkbench.confirmSignDialog.confirmMessage', {
            id: 'PROP20231103'
          })}
        </div>
        <div className="mt-4 text-sm text-#9CA3AF">
          {t('lawyerWorkbench.confirmSignDialog.uploadLabel')}
        </div>
        <Upload
          directory
          className=""
          accept=".pdf,.png,.jpg,.jpeg"
          showUploadList={false}
          beforeUpload={(_file) => {}}
        >
          <Button className="mt-4 h-8 bg-white px-3 text-sm text-black">
            {t('lawyerWorkbench.confirmSignDialog.selectFile')}
          </Button>
        </Upload>
      </div>
    </CommonDialog>
  )
}

// 已完成案件 => 查看详情弹窗
export function CompletedCaseDetailDialog({
  visible,
  setvisible,
  data
}: {
  visible: boolean
  setvisible: (visible: boolean) => void
  data: lawyerWorkbenchApi.CaseListData
}) {
  const { t } = useTranslation()
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
    queryKey: ['getAssetInfo', data?.id],
    queryFn: async () => {
      const res = await assetsApi.getAssetInfo(`${data?.id}`)
      return res.data
    },
    enabled: !!data?.id
  })
  // 通过url打开一个新窗口
  const openFileInNewTab = (url: string) => {
    window.open(url, '_blank')
  }

  const lawyerInfo = useMemo(() => {
    const len = assetInfo?.law_info?.length || 0
    return len > 0 ? assetInfo?.law_info?.[len - 1] : null
  }, [assetInfo])
  const evaluationInfo = useMemo(() => {
    const len = assetInfo?.appraiser_report_info?.length || 0
    return len > 0 ? assetInfo?.appraiser_report_info?.[len - 1] : null
  }, [assetInfo])
  return (
    <CommonDialog
      open={visible}
      style={
        {
          '--common-dialog-footer-background': '#171b21',
          '--common-dialog-body-background': '#171b21',
          '--common-dialog-header-background': '#171b21'
        } as any
      }
      className="[&>div>div>.ant-modal-footer]:!b-0"
      width={766}
      closable
      onCancel={() => setvisible(false)}
      title={(
        <div>
          <div className="text-xl">
            {t('lawyerWorkbench.completedCaseDetailDialog.title')}
          </div>
          <div className="mt-1 text-base text-#9CA3AF">
            {t('lawyerWorkbench.completedCaseDetailDialog.assetNumber')}
            :
            ASSET-9876
          </div>
        </div>
      )}
      footer={false}
    >
      <Spin spinning={isPending}>
        <div className="py-6 text-white">
          <div className="flex gap-6">
            <div className="flex-1">
              <img
                className="szie-full h-64"
                src={new URL('@/assets/test/test.png', import.meta.url).href}
                alt=""
              />
            </div>
            <div className="min-w-54 b b-#30363D rounded-2 bg-#1E2328 p-5">
              <div className="text-lg font-600">
                {t('lawyerWorkbench.completedCaseDetailDialog.assetSummary')}
              </div>
              <div className="mt-4 flex flex-col gap-3 [&>div>div:first-child]:mb-1 [&>div>div:first-child]:text-sm [&>div>div:last-child]:text-base [&>div>div:first-child]:text-#9CA3AF">
                <div>
                  <div>
                    {t('lawyerWorkbench.completedCaseDetailDialog.assetType')}
                  </div>
                  <div>
                    {assetHouseTypeData?.find(
                      item => item.value === Number(assetInfo?.properties?.property_type || '')
                    )?.label || '-'}
                  </div>
                </div>
                <div>
                  <div>
                    {t(
                      'lawyerWorkbench.completedCaseDetailDialog.appraisalValue'
                    )}
                  </div>
                  <div>
                    $
                    {formatNumberNoRound(assetInfo?.properties?.appraisement || 0, 6, 0)}
                  </div>
                </div>
                <div>
                  <div>
                    {t('lawyerWorkbench.completedCaseDetailDialog.location')}
                  </div>
                  <div>{assetInfo?.properties.address || '-'}</div>
                </div>
                <div>
                  <div>
                    {t(
                      'lawyerWorkbench.completedCaseDetailDialog.submissionTime'
                    )}
                  </div>
                  <div>{dayjs((assetInfo?.submission?.create_date || 0) * 1000).format('YYYY-MM-DD HH:mm')}</div>
                </div>
                <div>
                  <div>
                    {t('lawyerWorkbench.completedCaseDetailDialog.status')}
                  </div>
                  <div className="text-#FACC15">{t(`common.assetStatus.${data?.status}`)}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <div className="text-lg font-600">
              {t('lawyerWorkbench.completedCaseDetailDialog.assetDetails')}
            </div>
            <div className="mt-4 b b-#30363D rounded-2 bg-#1E2328 p-5 text-400 text-base text-#D1D5DB">
              {assetInfo?.properties?.property_description || '-'}
            </div>
          </div>
          <div className="grid cols-2 mt-8 gap-6">
            {/* 律师 */}
            <div>
              <div className="text-lg font-600">
                {t('lawyerWorkbench.completedCaseDetailDialog.lawyerInfo')}
              </div>
              <div className="mt-4 b b-#30363D rounded-2 bg-#1E2328 p-5">
                <div className="fyc gap-4">
                  <div className="size-16 fcc overflow-hidden b-2 b-#00E5FF rounded-full">
                    <img
                      className="size-full"
                      src={
                        new URL('@/assets/test/test.png', import.meta.url).href
                      }
                      alt=""
                    />
                  </div>
                  <div className="fol gap-1">
                    <div className="text-base">
                      {lawyerInfo?.law_name || '-'}
&nbsp;
                      {t('lawyerWorkbench.offlineExecution.lawyer')}
                    </div>
                    <div className="text-sm text-#9CA3AF">
                      {lawyerInfo?.lawyer_name || '-'}
                    </div>
                    <div className="fyc gap-1 text-sm text-#00FF85">
                      <div className="i-ep:success-filled"></div>
                      <div>{t('lawyerWorkbench.completedCaseDetailDialog.lawyerLicenseVerified')}</div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 fol gap-2 text-base [&>div]:fyc [&>div]:justify-between [&>div]:gap-2 [&>div>div:first-child]:text-#9CA3AF">
                  <div>
                    <div>{t('register.lawOffice.licenseNo')}</div>
                    <div>{lawyerInfo?.lawyer_license_no || '-'}</div>
                  </div>
                  <div>
                    <div>{t('register.lawOffice.specialization')}</div>
                    <div>{lawyerInfo?.specialty || '-'}</div>
                  </div>
                  <div>
                    <div>{t('register.lawOffice.yearsOfPractice')}</div>
                    <div>
                      {lawyerInfo?.lawyer_practice_years || '-'}
                      {t('common.year')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* 评估报告 */}
            <div>
              <div className="text-lg font-600">
                {t(
                  'lawyerWorkbench.completedCaseDetailDialog.evaluationReportSummary'
                )}
              </div>
              <div className="mt-4 b b-#30363D rounded-2 bg-#1E2328 p-5">
                <div className="fol gap-2 text-base [&>div]:fol [&>div]:justify-between [&>div]:gap-2 [&>div>div:first-child]:text-#9CA3AF">
                  <div>
                    <div>
                      {t(
                        'lawyerWorkbench.completedCaseDetailDialog.evaluationAgency'
                      )}
                    </div>
                    <div>{evaluationInfo?.appraiser_company || '-'}</div>
                  </div>
                  <div>
                    <div>
                      {t(
                        'lawyerWorkbench.completedCaseDetailDialog.evaluationDate'
                      )}
                    </div>
                    <div>
                      {dayjs(
                        typeof evaluationInfo?.appraise_date === 'string'
                          ? evaluationInfo?.appraise_date
                          : (evaluationInfo?.appraise_date || 0) * 1000
                      ).format('YYYY-MM-DD')}
                    </div>
                  </div>
                  <div>
                    <div>
                      {t(
                        'lawyerWorkbench.completedCaseDetailDialog.reportNumber'
                      )}
                    </div>
                    <div>{evaluationInfo?.asset_code || '-'}</div>
                  </div>
                  <div>
                    <div>
                      {t(
                        'lawyerWorkbench.completedCaseDetailDialog.evaluationMethod'
                      )}
                    </div>
                    <div>{evaluationInfo?.appraise_method || '-'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 text-lg font-600">
            {t('lawyerWorkbench.completedCaseDetailDialog.relatedDocuments')}
          </div>
          <div className="grid cols-3 mt-4 gap-4 pb-10">
            {assetInfo?.files.map(item => (
              item.file_urls.fileUrls.map((fileUrl, index) => (
                <div
                  key={fileUrl}
                  onClick={() => openFileInNewTab(fileUrl)}
                  className="fyc gap-3 b b-#30363D rounded-2 bg-#1E2328 p-4 clickable"
                >
                  <div className="size-12 fcc rounded-1 bg-#00E2FF1A">
                    <div className="i-mdi:file text-4 text-primary"></div>
                  </div>
                  <div>
                    <div className="text-base">
                      {item?.file_info?.display_name || ''}
                      {' '}
                      {index + 1}
                    </div>
                  </div>
                </div>
              ))
            ))}
          </div>
        </div>
      </Spin>
    </CommonDialog>
  )
}
