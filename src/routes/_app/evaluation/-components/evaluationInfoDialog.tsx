import { CommonDialog } from '@/components/common/dialog/common'
import { formatNumberNoRound } from '@/utils/number'
import { Button } from 'antd'
import dayjs from 'dayjs'

export function EvaluationInfoDialog({ visible, setVisible, _evaluationInfo }: {
  visible: boolean
  setVisible: (visible: boolean) => void
  _evaluationInfo: any
}) {
  const { t } = useTranslation()
  const dataStatus = [
    {
      label: t('evaluation.status.pendingEvaluation'),
      value: 0
    },
    {
      label: t('evaluation.status.completed'),
      value: 1
    }
  ]
  return (
    <CommonDialog
      open={visible}
      onCancel={() => setVisible(false)}
      maskClosable={false}
      width={900}
      className={cn('login-dialog [&>div>.ant-modal-content]:!bg-#171b21 b-1 b-solid  b-#1E293B', 'rounded-2 ')}
      centered
      closable
      title={(
        <div className="fm-orbitron text-xl text-white font-700">
          <div>{t('evaluation.infoDialog.title')}</div>
          <div>CAS-2023-0042</div>
        </div>
      )}
      footer={(
        <div className="sticky bottom-0 fyc justify-end gap-4">
          <Button className="h-9.5 b-#00E5FF80 bg-black px-3.5 text-base text-#00E5FF">{t('assete.addAsset.saveDraft')}</Button>
          <Button className="h-9.5 b-#00E5FF bg-#00E5FF px-3.5 text-base text-black">{t('evaluation.infoDialog.startEvaluation')}</Button>
        </div>
      )}
    >
      <div className="text-base">
        <div className="mt-6 flex gap-6">
          <div className="flex-1">
            <div className="text-sm text-#8B949E">{t('evaluation.infoDialog.caseDescription')}</div>
            <div className="mt-1.5">该案件涉及一项人工智能算法专利的估值评估，该专利已应用于公司核心产品，产生稳定收入流。需要评估其市场价值及未来收益潜力。</div>
            <div className="mt-4 text-sm text-#8B949E">{t('evaluation.infoDialog.assetList')}</div>
            <div className="mt-3 flex flex-col gap-3">
              {
                [1, 2].map(item => (
                  <div key={item} className="rounded-2 bg-#2E353C4D p-4">
                    <div>算法专利</div>
                    <div className="flex gap-3 [&>div]:flex-1">
                      <div className="text-#8B949E">
                        {t('evaluation.infoDialog.type')}
                        ：知识产权
                      </div>
                      <div className="text-sm text-#8B949E">数量：1</div>
                      <div className="text-sm text-#00E5FF">
                        $
                        {formatNumberNoRound(8500000, 6, 0)}
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
          <div className="w-[30%]">
            <div className="b-1 b-#00E2FF1A b-#2E353C4D rounded-2 b-solid p-5">
              <div className="text-sm text-#8B949E">{t('evaluation.infoDialog.caseInfo')}</div>
              <div className="mt-4 flex flex-col gap-3 gap-3 [&>div]:flex [&>div]:justify-between [&>div>div:first-child]:text-#8B949E">
                <div>
                  <div>{t('evaluation.table.caseId')}</div>
                  <div>CAS-2023-0042</div>
                </div>
                <div>
                  <div>{t('evaluation.infoDialog.assetType')}</div>
                  <div>知识产权</div>
                </div>
                <div>
                  <div>{t('evaluation.table.createTime')}</div>
                  <div>{dayjs().format('YYYY-MM-DD')}</div>
                </div>
                <div>
                  <div>{t('evaluation.infoDialog.currentStatus')}</div>
                  <div className={cn('px-2 py-1  rounded-9999px w-fit text-xs', false && 'text-#F87171 bg-#EB45451A', true && 'text-#00E5FF bg-#00E2FF1A b-1 b-solid b-#00E5FF80')}>
                    {dataStatus[1].label}
                  </div>
                </div>
                <div className="b-t-1 b-t-#00E2FF1A b-t-solid pt-3">
                  <div>{t('evaluation.infoDialog.totalValuationAmount')}</div>
                  <div className="text-lg font-bold">
                    $
                    {formatNumberNoRound(8500000, 6, 0)}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 b-1 b-#00E2FF1A b-#2E353C4D rounded-2 b-solid p-5">
              <div className="text-sm text-#8B949E">{t('evaluation.infoDialog.submittedLawyer')}</div>
              <div className="mt-4 fyc gap-3">
                <img className="size-12 rounded-full object-cover" src={(new URL('@/assets/test/img.png', import.meta.url).href)} alt="" />
                <div>
                  <div>张律师</div>
                  <div className="text-xs text-#8B949E">执业律师</div>
                </div>
              </div>
            </div>
            <div className="mt-6 b-1 b-#00E2FF1A b-#2E353C4D rounded-2 b-solid p-5">
              <div className="text-sm text-#8B949E">{t('evaluation.infoDialog.assetOwnerInfo')}</div>
              <div className="mt-3 flex flex-col gap-1 text-sm text-#8B949E">
                <div className="text-base text-white">科技创新有限公司</div>
                <div>{t('evaluation.infoDialog.assetValuationRequest')}</div>
                <div>提交日期: 2023-11-15</div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 b-1 b-#00E2FF1A rounded-2 b-solid bg-#2E353C4D p-5 pb-6">
          <div className="text-sm text-#8B949E">{t('evaluation.infoDialog.lawyerReviewOpinion')}</div>
          <div className="mt-3 b-1 b-#00E2FF1A b-solid bg-#161C2280 p-4 text-sm">
            "该案件材料齐全，符合评估要求。资产权属清晰，相关证明文件已审核。建议进行专业评估，评估过程中需重点关注资产当前市场价值及未来收益能力。"
          </div>
        </div>
      </div>
    </CommonDialog>
  )
}
