import type { AssetFile, AssetInfo } from '@/api/assetsApi'
import assetsApi from '@/api/assetsApi'
import * as evaluationApi from '@/api/evaluationApi'
import { CommonDialog } from '@/components/common/dialog/common'
import { downloadFile } from '@/utils/file'
import { addHttpsPrefix } from '@/utils/url'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  createLazyFileRoute,
  useNavigate,
  useParams
} from '@tanstack/react-router'
import { Button, Image, Input, Spin } from 'antd'
import dayjs from 'dayjs'
import { UploadReportDialog } from './-components/uploadReportDialog'

export const Route = createLazyFileRoute('/_app/evaluation/info/$id')({
  component: RouteComponent
})

function RouteComponent() {
  const { id: assetId } = useParams({
    from: '/_app/evaluation/info/$id'
  }) as { id: string }
  const back = () => {
    window.history.back()
  }
  const { t } = useTranslation()

  // 资产详情
  const { data: assetInfo, isPending } = useQuery({
    queryKey: ['getEvaluationDetail', assetId],
    queryFn: async () => {
      const res = await assetsApi.getAssetInfo(assetId)
      return res.data
    },
    enabled: !!assetId
  })

  // 图片弹窗
  const [imgVisible, setImgVisible] = useState({
    value: false,
    images: [] as string[]
  })
  // 驳回弹窗
  const [rejectVisible, setRejectVisible] = useState({
    value: false,
    data: {} as AssetInfo
  })
  // 上传评估报告弹窗
  const [uploadReportVisible, setUploadReportVisible] = useState(false)
  const downloadReport = useCallback((assetInfo: AssetFile) => {
    downloadFile({
      downLoadUrl: assetInfo?.file_urls?.fileUrls,
      filename: assetInfo?.file_info?.display_name || '',
      t
    })
  }, [t])

  return (
    <div className="px-22 pb-13">
      <div className="mt-6">
        <div onClick={back} className="mb-8 w-fit fcc gap-1 clickable">
          <div className="i-ic:round-arrow-back text-5 text-white"></div>
          <div className="text-xl font-600">{t('evaluation.info.back')}</div>
        </div>
        {isPending
          ? (
              <Spin spinning={isPending} className="h-200 fcc"></Spin>
            )
          : (
              <div>
                <div className="text-10">{assetInfo?.properties?.name}</div>
                <div className="mt-1 text-base text-#9CA3AF">
                  {t('assete.info.assetCode')}
                  ：
                  <span className="text-white">{assetInfo?.submission?.code}</span>
                  {' '}
              &nbsp;|&nbsp;
                  {t('assete.info.address')}
                  ：
                  {assetInfo?.properties?.address}
                </div>
                <div className="mt-9 text-xl">{t('evaluation.info.assetInfo')}</div>
                <div className="grid cols-3 mt-6 gap-6">
                  {assetInfo?.files?.map(item => (
                    <div key={item.id} className="rounded-3 bg-#161B22 p-5 pb-10">
                      <div className="flex justify-between gap-3">
                        <div>
                          <div className="text-lg text-white">
                            {item?.file_info?.display_name}
                          </div>
                          <div className="text-sm text-#9CA3AF">
                            {item?.file_info?.is_required
                              ? t('evaluation.info.required')
                              : t('evaluation.info.optional')}
                            {t('evaluation.info.fileNumber')}
                            ：
                          </div>
                          <div className="text-sm text-#9CA3AF">
                            {item?.file_info?.id}
                          </div>
                        </div>
                        <div
                          className={cn(
                            'px-3 py-1 rounded-9999px b-1 b-solid w-fit h-fit fyc gap-1',
                            item?.file_urls?.fileUrls?.length > 0
                              ? 'bg-#00FF8733 b-#00FF844D text-#00FF85 '
                              : 'bg-#EB45451A b-#EB45451A text-#F87171'
                          )}
                        >
                          <div className="i-ep:success-filled text-4"></div>
                          <div className="text-sm">
                            {' '}
                            {item?.file_urls?.fileUrls?.length > 0
                              ? t('evaluation.info.qualified')
                              : t('evaluation.info.unqualified')}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 overflow-hidden b b-#374151 rounded-2 b-solid bg-#1F2937">
                        {item?.file_urls?.fileUrls?.length > 0
                          ? (
                              <img
                                className="aspect-[5/3] min-h-48 w-full"
                                src={addHttpsPrefix(item?.file_urls?.fileUrls?.[0])}
                                alt=""
                              />
                            )
                          : (
                              <div className="aspect-[5/3] size-full fccc gap-2 p-4">
                                <div className="i-tabler:camera-filled bg-#6d727f text-10"></div>
                                <div className="text-sm text-#9CA3AF">
                                  {item?.file_info?.display_name}
                                  {t('evaluation.info.missing')}
                                </div>
                                <div className="text-xs text-#6B7280">
                                  {t('evaluation.info.needProvide')}
                                </div>
                              </div>
                            )}
                      </div>
                      <div className="mt-5 flex justify-between">
                        <div className="text-sm text-#9CA3AF">
                          {t('evaluation.info.uploadDate')}
                          ：
                          {dayjs(
                            typeof item?.file_info?.update_date === 'string'
                              ? item?.file_info?.update_date
                              : item?.file_info?.update_date * 1000
                          ).format('YYYY-MM-DD')}
                        </div>
                        <div className="fyc gap-2 [&>div]:clickable">
                          <div
                            className="i-fa6-solid:eye text-sm text-#69e2fc"
                            onClick={() => {
                              setImgVisible({
                                value: true,
                                images:
                              item?.file_urls?.fileUrls || ([] as string[])
                              })
                            }}
                          >
                          </div>
                          <div
                            onClick={() =>
                              downloadReport(item)}
                            className="i-flowbite:download-solid text-lg text-#9ea3ae"
                          >
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-10 fyc justify-end gap-4 text-center [&>button]:h-12.5 [&>button]:min-w-46 [&>button]:px-8">
                  <Button
                    disabled={!assetInfo?.properties.id}
                    className="b-#374151 bg-#1E2328"
                    onClick={() => {
                      setRejectVisible({
                        value: true,
                        data: assetInfo as AssetInfo
                      })
                    }}
                  >
                    {t('evaluation.info.rejectAsset')}
                  </Button>
                  <Button
                    className="b-#00E5FF bg-#00E5FF text-black"
                    onClick={() => {
                      setUploadReportVisible(true)
                    }}
                  >
                    {t('evaluation.info.uploadReport')}
                  </Button>
                </div>
              </div>
            )}
      </div>
      {/* 显示图片浮窗 */}
      <div className="hidden">
        <Image.PreviewGroup
          preview={{
            visible: imgVisible.value,
            scaleStep: 0.5,
            onVisibleChange: (value) => {
              setImgVisible({ value, images: imgVisible.images })
            }
          }}
        >
          {imgVisible.images.map(url => (
            <Image key={url} src={addHttpsPrefix(url)} />
          ))}
        </Image.PreviewGroup>
      </div>

      {/* 驳回弹窗 */}
      <RejectDialog
        visible={rejectVisible.value}
        setVisible={value =>
          setRejectVisible(pre => ({
            value,
            data: pre.data
          }))}
        data={rejectVisible.data}
      />
      {/* 上传评估报告弹窗 */}
      <UploadReportDialog
        visible={uploadReportVisible}
        setVisible={setUploadReportVisible}
        data={assetInfo as AssetInfo}
      />
    </div>
  )
}

function RejectDialog({
  visible,
  setVisible,
  data
}: {
  visible: boolean
  setVisible: (visible: boolean) => void
  data: AssetInfo
}) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { mutateAsync: rejectSubmission, isPending: rejectSubmissionPending }
    = useMutation({
      mutationKey: ['rejectSubmission'],
      mutationFn: async (data: {
        submission_id: string | number
        reject_reason: string
      }) => {
        return await evaluationApi.rejectSubmission(data)
      }
    })

  const [rejectReason, setRejectReason] = useState('')
  // 驳回资料
  function toRejectSubmission() {
    rejectSubmission({
      submission_id: data.submission.id,
      reject_reason: rejectReason
    }).then((res) => {
      if (res.code === 1) {
        setVisible(false)
        toast.success(t('evaluation.infoDialog.rejectAssetSuccess'))
        setTimeout(() => {
          navigate({ to: '/evaluation' })
        }, 100)
      }
    })
  }

  return (
    <CommonDialog
      open={visible}
      onCancel={() => setVisible(false)}
      maskClosable={false}
      width={446}
      className={cn(
        'login-dialog [&>div>.ant-modal-content]:!bg-#171b21 b-1 b-solid  b-#1E293B',
        'rounded-2 '
      )}
      centered
      closable
      title={(
        <div className=" ">
          <div className="text-600 text-xl">
            {t('evaluation.info.rejectDialogTitle')}
          </div>
          <div className="mt-1.5 text-base text-#9CA3AF">
            {t('evaluation.info.rejectDialogDesc')}
          </div>
        </div>
      )}
      footer={false}
    >
      <div className="mt-6 text-base">
        <div className="fyc gap-3">
          <div className="text-#9CA3AF">{t('evaluation.info.assetNumber')}</div>
          <div>{data?.submission?.code}</div>
        </div>
        <div className="mt-3 text-#D1D5DB">
          {t('evaluation.info.detailedExplanation')}
        </div>
        <div className="mt-3">
          <Input.TextArea
            value={rejectReason}
            onChange={e => setRejectReason(e.currentTarget?.value)}
            autoSize={{ minRows: 6, maxRows: 6 }}
            placeholder={t('evaluation.info.rejectDialogPlaceholder')}
          />
        </div>
        <div className="grid cols-2 gap-3 pb-6 pt-33 [&>button]:h-12.5">
          <Button
            onClick={() => setVisible(false)}
            className="b-#30363D bg-transparent text-#D1D5DB"
          >
            {t('common.cancel')}
          </Button>
          <Button
            onClick={toRejectSubmission}
            loading={rejectSubmissionPending}
            className="b-#EF4444 bg-#EF4444"
          >
            {t('evaluation.info.reject')}
          </Button>
        </div>
      </div>
    </CommonDialog>
  )
}
