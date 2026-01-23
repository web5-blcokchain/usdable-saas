import type { CaseListResponse } from '@/api/evaluationApi'
import assetsApi from '@/api/assetsApi'
import * as evaluationApi from '@/api/evaluationApi'
import { CommonDialog } from '@/components/common/dialog/common'
import { ASSET_EVALUATIO_STATUS } from '@/enums/evaluation'
import { formatNumberNoRound } from '@/utils/number'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Button, Spin } from 'antd'
import dayjs from 'dayjs'

export function EvaluationInfoDialog({
  visible,
  setVisible,
  evaluationInfo,
  // 是否显示认领
  isView
}: {
  visible: boolean
  setVisible: (visible: boolean) => void
  evaluationInfo: CaseListResponse
  isView: boolean
}) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  // 案件状态
  const dataStatusContent = (status: ASSET_EVALUATIO_STATUS | 0) => {
    let data = {} as { className: string }
    // 已完成
    if ([ASSET_EVALUATIO_STATUS.COMPLETED].includes(status as any)) {
      data = {
        className: 'bg-#00FF8733 text-#00FF85'
      } // 已驳回
    }
    else if ([ASSET_EVALUATIO_STATUS.REJECTED].includes(status as any)) {
      data = {
        className: 'bg-#CD647833 text-#CF6679'
      } // 待认领
    }
    else if ([ASSET_EVALUATIO_STATUS.PENDING_CLAIM].includes(status as any)) {
      data = {
        className: 'bg-#2E2F1F text-#FFDD00'
      } // 待评估
    }
    else {
      data = {
        className: 'bg-#00FF8733 text-#00FF85'
      } // 已上链
    }

    return (
      <div
        className={cn(
          data.className,
          'rounded-9999px px-2 py-1 text-xs font-400 w-fit'
        )}
      >
        {t(
          (ASSET_EVALUATIO_STATUS.PENDING_CLAIM <= status
            && ASSET_EVALUATIO_STATUS.EVALUATED >= status)
          || ASSET_EVALUATIO_STATUS.COMPLETED === status
            ? `evaluation.asseteStatus.${status}`
            : `common.assetStatus.other`
        )}
      </div>
    )
  }
  // 获取资产详情
  const { data: assetInfo, isFetching } = useQuery({
    queryKey: ['getEvaluationDetail', evaluationInfo?.id],
    queryFn: async () => {
      const res = await assetsApi.getAssetInfo(
        `${evaluationInfo?.id}` as string
      )
      return res.data
    },
    enabled: !!evaluationInfo?.id
  })
  // 获取资产类型
  const { data: assetType, isFetching: getAssetTypeLoading } = useQuery({
    queryKey: ['getAssetType'],
    queryFn: async () => {
      const res = await assetsApi.getAssetType()
      return res.data
    }
  })

  // 获取房产类型
  const assteTypeText = useMemo(() => {
    if (!assetInfo?.properties.property_type || !assetType)
      return ''
    const typeData = assetType?.find(
      type => type.id.toString() === assetInfo?.properties.property_type
    )
    return i18n.language === 'zh'
      ? typeData?.name_zh_cn || ''
      : i18n.language === 'en'
        ? typeData?.name_en || ''
        : typeData?.name_ja || ''
  }, [assetInfo, assetType, i18n.language])

  // 评估认领
  const { mutateAsync: claimSubmission, isPending: claimSubmissionLoading }
    = useMutation({
      mutationKey: ['claimSubmission'],
      mutationFn: async (data: { submission_id: string, remark?: string }) => {
        const res = await evaluationApi.claimSubmission(data)
        return res
      }
    })

  const toClaimSubmission = () => {
    if (!evaluationInfo.id)
      return
    claimSubmission({
      submission_id: evaluationInfo.id.toString()
    }).then((res) => {
      if (res.code === 1) {
        setVisible(false)
        toast.success(t('evaluation.infoDialog.claimEvaluationSuccess'))
        setTimeout(() => {
          navigate({
            to: '/evaluation/info/$id',
            params: { id: `${evaluationInfo.id}` }
          })
        }, 100)
      }
    })
  }

  return (
    <CommonDialog
      open={visible}
      onCancel={() => setVisible(false)}
      maskClosable={false}
      width={900}
      className={cn(
        'login-dialog [&>div>.ant-modal-content]:!bg-#171b21 b-1 b-solid  b-#1E293B',
        'rounded-2 '
      )}
      centered
      closable
      title={(
        <div className="fm-orbitron text-xl text-white font-700">
          <div>{t('evaluation.infoDialog.title')}</div>
          <div>{evaluationInfo?.code}</div>
        </div>
      )}
      footer={
        !isView
          ? (
              <div className="sticky bottom-0 fyc justify-end gap-4">
                <Button
                  disabled={isFetching || claimSubmissionLoading}
                  onClick={toClaimSubmission}
                  loading={claimSubmissionLoading}
                  className="h-9.5 b-#00E5FF bg-#00E5FF px-3.5 text-base text-black"
                >
                  {t('evaluation.infoDialog.startEvaluation')}
                </Button>
              </div>
            )
          : (
              false
            )
      }
    >
      <Spin spinning={isFetching || getAssetTypeLoading}>
        <div className="pb-4 text-base">
          <div className="mt-6 flex gap-6">
            <div className="flex-1">
              <div className="text-sm text-#8B949E">
                {t('evaluation.infoDialog.caseDescription')}
              </div>
              <div className="mt-1.5">
                {assetInfo?.properties?.property_description || '-'}
              </div>
              <div className="mt-4 text-sm text-#8B949E">
                {t('evaluation.infoDialog.assetList')}
              </div>
              <div className="mt-3 flex flex-col gap-3">
                <div className="rounded-2 bg-#2E353C4D p-4">
                  <div>{assetInfo?.properties?.name || '-'}</div>
                  <div className="flex gap-3 [&>div]:flex-1">
                    <div className="text-#8B949E">
                      {t('evaluation.infoDialog.type')}
                      ：
                      {assteTypeText}
                    </div>
                    <div className="text-sm text-#00E5FF">
                      $
                      {formatNumberNoRound(
                        evaluationInfo?.valuation || 0,
                        6,
                        0
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[30%]">
              <div className="b-1 b-#00E2FF1A b-#2E353C4D rounded-2 b-solid p-5">
                <div className="text-sm text-#8B949E">
                  {t('evaluation.infoDialog.caseInfo')}
                </div>
                <div className="mt-4 flex flex-col gap-3 gap-3 [&>div]:flex [&>div]:justify-between [&>div>div:first-child]:text-#8B949E">
                  <div>
                    <div>{t('evaluation.table.caseId')}</div>
                    <div>{evaluationInfo?.code}</div>
                  </div>
                  <div>
                    <div>{t('evaluation.infoDialog.assetType')}</div>
                    <div>{assteTypeText}</div>
                  </div>
                  <div>
                    <div>{t('evaluation.table.createTime')}</div>
                    <div>
                      {dayjs(evaluationInfo?.update_time || '').format(
                        'YYYY-MM-DD'
                      )}
                    </div>
                  </div>
                  <div>
                    <div>{t('evaluation.infoDialog.currentStatus')}</div>
                    <div>{dataStatusContent(evaluationInfo?.status || 0)}</div>
                  </div>
                  <div className="b-t-1 b-t-#00E2FF1A b-t-solid pt-3">
                    <div>{t('evaluation.infoDialog.totalValuationAmount')}</div>
                    <div className="text-lg font-bold">
                      $
                      {formatNumberNoRound(
                        evaluationInfo?.valuation || 0,
                        6,
                        0
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 b-1 b-#00E2FF1A b-#2E353C4D rounded-2 b-solid p-5">
                <div className="text-sm text-#8B949E">
                  {t('evaluation.infoDialog.submittedLawyer')}
                </div>
                <div className="mt-4 fyc gap-3">
                  <div>
                    <div>{evaluationInfo?.lawyer_name || '-'}</div>
                    {/* <div className="text-xs text-#8B949E">执业律师</div> */}
                  </div>
                </div>
              </div>
              <div className="mt-6 b-1 b-#00E2FF1A b-#2E353C4D rounded-2 b-solid p-5">
                <div className="text-sm text-#8B949E">
                  {t('evaluation.infoDialog.assetOwnerInfo')}
                </div>
                <div className="mt-3 flex flex-col gap-1 text-sm text-#8B949E">
                  <div className="text-base text-white">
                    {evaluationInfo?.asset_owner_name || '-'}
                  </div>
                  <div>{t('evaluation.infoDialog.assetValuationRequest')}</div>
                  <div>
                    {t('evaluation.table.createTime')}
                    :
                    {' '}
                    {dayjs(evaluationInfo?.create_time || '').format(
                      'YYYY-MM-DD'
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="mt-8 b-1 b-#00E2FF1A rounded-2 b-solid bg-#2E353C4D p-5 pb-6">
          <div className="text-sm text-#8B949E">
            {t('evaluation.infoDialog.lawyerReviewOpinion')}
          </div>
          <div className="mt-3 b-1 b-#00E2FF1A b-solid bg-#161C2280 p-4 text-sm">
            "该案件材料齐全，符合评估要求。资产权属清晰，相关证明文件已审核。建议进行专业评估，评估过程中需重点关注资产当前市场价值及未来收益能力。"
          </div>
        </div> */}
        </div>
      </Spin>
    </CommonDialog>
  )
}
