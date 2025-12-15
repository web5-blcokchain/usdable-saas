import type { AssetFile } from '@/api/assetsApi'
import type {
  rejectSubmissionModel
} from '@/api/lawyerWorkbenchApi'
import assetsApi from '@/api/assetsApi'
import {
  lawyerRejectSubmission,
  submitToAppraiser
} from '@/api/lawyerWorkbenchApi'
import { CommonDialog } from '@/components/common/dialog/common'
import { NoContent } from '@/components/common/NoContent'
import { IS_REQUIRED, REVIEW_STATUS } from '@/enum/common'
import { addHttpsPrefix } from '@/utils/url'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  createLazyFileRoute,
  useNavigate,
  useParams
} from '@tanstack/react-router'
import { Button, Form, Image, Input } from 'antd'
import { useForm } from 'antd/es/form/Form'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export const Route = createLazyFileRoute(
  '/_app/lawyerWorkbench/initialReview/$id'
)({
  component: RouteComponent
})

function RouteComponent() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const back = () => {
    window.history.back()
  }

  const [rejectVisible, setRejectVisible] = useState(false)
  const { id: assetId } = useParams({
    from: '/_app/lawyerWorkbench/initialReview/$id'
  }) as {
    id: string
  }
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
      navigate({ to: '/lawyerWorkbench' })
    }
  }, [assetId])

  const [form] = useForm()
  // 驳回资料
  const { mutateAsync: rejectSubmissionAsync } = useMutation({
    mutationKey: ['rejectSubmission'],
    mutationFn: async (data: rejectSubmissionModel) => {
      return lawyerRejectSubmission(data)
    }
  })
  async function rejectSubmission(reject_reason: string) {
    const formData = form.getFieldsValue()
    const reject_files
      = Object.keys(formData)?.map((key) => {
        return {
          file_id: Number(key),
          reject_reason: formData[key]
        }
      }) || {}
    const data = {
      reject_reason,
      submission_id: Number(assetId),
      reject_files
    }
    await rejectSubmissionAsync(data).then((res) => {
      if (res.code === 1) {
        toast.success(t('evaluation.infoDialog.rejectAssetSuccess'))
        setRejectVisible(false)
        setTimeout(() => {
          navigate({ to: '/lawyerWorkbench' })
        }, 100)
      }
    })
  }

  // 提交至评估方
  const {
    mutateAsync: submitToAppraiserAsync,
    isPending: submitToAppraiserPending
  } = useMutation({
    mutationKey: ['submitToAppraiser'],
    mutationFn: async () => {
      return submitToAppraiser({
        submission_id: Number(assetId),
        remark: ''
      })
    },
    onSuccess(res) {
      if (res.code === 1) {
        toast.success(t('common.submitSuccess'))
        setRejectVisible(false)
        setTimeout(() => {
          navigate({ to: '/lawyerWorkbench' })
        }, 100)
      }
    }
  })

  if (isPending) {
    return <Waiting for={!isPending} className="h-100 fccc" />
  }

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
          <div className="text-8 font-bold">{assetInfo?.properties?.name}</div>
          <div className="mt-1 text-#94A3B8">
            {assetInfo?.properties?.address}
          </div>
        </div>
        <div className="fyc gap2 text-sm">
          <div className="i-bi:clock-fill bg-#68e2fb"></div>
          <div>
            {t('assete.addAsset.submitTime')}
            :
            {' '}
            {dayjs((assetInfo?.submission?.create_date || 0) * 1000).format(
              'YYYY-MM-DD HH:mm'
            )}
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
        <Form form={form} className="w-65%">
          <div className="w-full">
            <div className="flex flex-col gap-6">
              {assetInfo?.files
                ?.filter(
                  item => item?.file_info?.is_required === IS_REQUIRED.YES
                )
                .map((item, index) => (
                  <FileCard key={item?.id} data={item} index={index} />
                ))}
              {assetInfo?.files?.filter(
                item => item?.file_info?.is_required === IS_REQUIRED.YES
              )?.length === 0 && <NoContent />}
            </div>
            <div className="mt-10 b-l-4 b-l-#00E5FF80 px-4 py-1 text-lg font-600">
              {t('lawyerWorkbench.initialReview.optionalFiles')}
            </div>
            {/* 非必选文件列表 */}
            <div className="mt-5 flex flex-col gap-6">
              {assetInfo?.files
                ?.filter(
                  item => item?.file_info?.is_required === IS_REQUIRED.NO
                )
                .map((item, index) => (
                  <FileCard key={item?.id} data={item} index={index} />
                ))}
              {assetInfo?.files?.filter(
                item => item?.file_info?.is_required === IS_REQUIRED.NO
              )?.length === 0 && <NoContent />}
            </div>
          </div>
        </Form>
        <div className="h-fit flex-1 b-1 b-#334155 rounded-3 b-solid bg-#0D1014 px-6 py-7.5">
          <div className="fyc gap-2 text-lg font-600">
            <div className="i-entypo:back-in-time text-#4aa3b6"></div>
            <div>{t('lawyerWorkbench.initialReview.reviewHistory')}</div>
          </div>
          <div className="mt-4 flex flex-col gap-4">
            {assetInfo?.audit_logs.map(item => (
              <div
                key={item.id}
                className="b-b-1 b-b-#38425280 pb-4 [&:last-child]:b-0 [&:last-child]:pb-0"
              >
                <div className="fyc justify-between gap-4">
                  <div className="fyc gap2">
                    <div>
                      {t('lawyerWorkbench.initialReview.lawyerName', {
                        name: item.auditor_name
                      })}
                    </div>
                  </div>
                  <div>
                    {dayjs((item.update_date || 0) * 1000).format('YYYY-MM-DD')}
                  </div>
                </div>
                <div className="mt-1 text-sm text-#D1D5DB">
                  {item.reject_reason}
                </div>
                <div className="p-4 text-xs text-#94A3B8">{item.remark}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-28 fyc justify-end gap-4 pb-10 [&>button]:h-12 [&>button]:min-w-51 [&>button]:px-7 [&>button]:text-base [&>button]:font-600">
        <Button
          onClick={() => submitToAppraiserAsync()}
          loading={submitToAppraiserPending}
          className="b-#00E5FF bg-#00E5FF text-black"
        >
          {t('lawyerWorkbench.initialReview.submitToEvaluator')}
        </Button>
        <Button
          onClick={() => setRejectVisible(true)}
          className="b-#FF4D4F bg-#FF4D4F text-black"
        >
          {t('lawyerWorkbench.initialReview.reject')}
        </Button>
      </div>
      <RejectModal
        rejectSubmission={rejectSubmission}
        visible={rejectVisible}
        setVisible={setRejectVisible}
        t={t}
      />
    </div>
  )
}

// 驳回弹窗
function RejectModal({
  visible,
  setVisible,
  t,
  rejectSubmission
}: {
  visible: boolean
  setVisible: (visible: boolean) => void
  t: any
  rejectSubmission: (data: string) => Promise<void>
}) {
  const [rejectReason, setRejectReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const handleSubmit = async () => {
    setIsSubmitting(true)
    await rejectSubmission(rejectReason).finally(() => {
      setIsSubmitting(false)
    })
  }

  return (
    <CommonDialog
      style={
        {
          '--common-dialog-header-background': '#FF4B5033',
          '--common-dialog-body-background': '#20293a',
          '--common-dialog-footer-background': '#1b222f',
          '--common-dialog-padding-y': '1rem'
        } as any
      }
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
          <Button
            onClick={() => setVisible(false)}
            className="b-#374151 bg-#374151"
          >
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!rejectReason}
            loading={isSubmitting}
            className="b-#EF494C bg-#EF494C"
          >
            {t('lawyerWorkbench.initialReview.reject')}
          </Button>
        </div>
      )}
    >
      <div className="py-6">
        <div className="text-base text-#94A3B8">
          {t('lawyerWorkbench.initialReview.rejectDialog.reason')}
        </div>
        <div className="mt-4 text-sm">
          {t('lawyerWorkbench.initialReview.rejectDialog.details')}
        </div>
        <Input.TextArea
          onChange={e => setRejectReason(e.target.value)}
          className="mt-2 b-1 b-#374151 !bg-#171d28"
          autoSize={{ minRows: 6, maxRows: 6 }}
        />
      </div>
    </CommonDialog>
  )
}

// 文件内容显示
function FileCard({ data, index }: { data: AssetFile, index: number }) {
  const { t } = useTranslation()
  const [visibleFormItem, setVisibleFormItem] = useState(false)
  return (
    <div className="b-1 b-#334155 rounded-3 b-solid bg-#0D1014">
      <div className="flex gap-6 p-6">
        {data?.file_urls?.fileUrls?.length > 0
          ? (
              <div className="grid cols-2 w-50 gap-2">
                {data?.file_urls?.fileUrls?.slice(0, 2).map(file => (
                  <div
                    key={file}
                    className="h-20 w-full overflow-hidden b-1 b-#374151 rounded-2 b-solid [&>div]:!size-full"
                  >
                    <ImagePreview
                      file={file}
                      fileUrls={data?.file_urls?.fileUrls}
                    />
                  </div>
                ))}
                {data?.file_urls?.fileUrls?.length > 2 && (
                  <div className="h-20 w-full fcc b-1 b-#6B7280 rounded-2 border-dashed text-xs text-#9CA3AF">
                    +
                    {(data?.file_urls?.fileUrls?.length || 2) - 2}
                    {' '}
                    {t('lawyerWorkbench.initialReview.photoCount')}
                  </div>
                )}
              </div>
            )
          : (
              <div className="h-40 w-50 fccc select-none gap-4 b b-white rounded b-dashed py-6 clickable-99 max-md:!w-full">
                <div className="py-3">
                  <div className="fcc pb-2">
                    <div className="i-bxs:file-blank text-10 text-#6c727f"></div>
                  </div>
                  <div className="w-full overflow-hidden text-center text-sm text-#9CA3AF">
                    {data?.file_info?.display_name}
                  </div>
                </div>
              </div>
            )}
        <div className="flex-1">
          <div className="fyc justify-between gap-3">
            <div className="fyc gap-1">
              <div className="text-lg font-600">
                {`${index + 1}. ${data?.file_info?.display_name}`}
              </div>
              <div className="rounded-9999px bg-#00E6FF33 px-2 py-1 text-xs text-primary font-600">
                {t('lawyerWorkbench.initialReview.required')}
              </div>
            </div>
            {data?.file_info?.is_required === IS_REQUIRED.YES && (
              <div
                onClick={() => setVisibleFormItem(prev => !prev)}
                className="fyc gap-1 rounded-2 bg-#FF4B5033 px-3 py-2 text-sm text-#FF4D4F clickable"
              >
                <div className="i-mingcute:close-fill text-base"></div>
                <div>{t('lawyerWorkbench.initialReview.reject')}</div>
              </div>
            )}
          </div>
          <div className="grid mt-4 gap-4 text-base">
            {visibleFormItem && (
              <Form.Item name={data.template_file_id} className="my-0">
                <Input.TextArea autoSize={{ minRows: 2, maxRows: 6 }} />
              </Form.Item>
            )}
          </div>
          {data?.file_urls?.fileUrls?.length === 0 && (
            <div className="mt-4 fyc gap-1 text-base text-#FFD700">
              <div className="i-ant-design:warning-filled"></div>
              <div>{t('lawyerWorkbench.initialReview.fileStatus.pending')}</div>
            </div>
          )}
          {data?.file_urls?.status === REVIEW_STATUS.REJECTED && (
            <div className="mt-4 fyc gap-1 text-base text-#FF4D4F">
              <div className="i-ep:circle-close-filled"></div>
              <div>{data?.file_urls?.remake}</div>
            </div>
          )}
        </div>
      </div>
      <div
        className={cn(
          'h-9 rounded-b-3 bg-#00FF85',
          data?.file_urls?.fileUrls?.length === 0 && '!bg-#FFD700',
          data?.file_urls?.status === REVIEW_STATUS.REJECTED && '!bg-#FF4D4F'
        )}
      >
      </div>
    </div>
  )
}

function ImagePreview({
  fileUrls,
  file
}: {
  fileUrls: string[]
  file: string
}) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="size-full object-cover [&>div]:!size-full">
      <Image
        className="object-cover !size-full"
        src={addHttpsPrefix(file)}
        preview={{ visible: false }}
        onClick={() => setVisible(true)}
      />
      <div style={{ display: 'none' }}>
        <Image.PreviewGroup
          preview={{ visible, onVisibleChange: vis => setVisible(vis) }}
        >
          {fileUrls.map((fileItem, index) => (
            <Image key={fileItem + index} className="size-full object-cover" src={addHttpsPrefix(fileItem)} />
          ))}
        </Image.PreviewGroup>
      </div>
    </div>
  )
}
