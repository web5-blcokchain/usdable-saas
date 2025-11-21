import { CommonDialog } from '@/components/common/dialog/common'
import { formatNumberNoRound } from '@/utils/number'
import { Button, Upload } from 'antd'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

// 待线下执行案件 => 执行案件操作弹窗
export function ExecuteCaseDialog({ visible, setvisible }: {
  visible: boolean
  setvisible: (visible: boolean) => void
}) {
  const { t } = useTranslation()
  return (
    <CommonDialog
      open={visible}
      style={{
        '--common-dialog-footer-background': '#171b21',
        '--common-dialog-body-background': '#171b21',
        '--common-dialog-header-background': '#171b21'
      } as any}
      width={446}
      onCancel={() => setvisible(false)}
      title={<div className="text-xl">{t('lawyerWorkbench.executeCaseDialog.title')}</div>}
      closable={false}
      footer={(
        <div className="fyc justify-end gap-3">
          <Button className="h-8 b-#0A192F rounded-2 bg-#0A192F px-6 text-sm text-#D1D5DB" onClick={() => setvisible(false)}>{t('common.cancel')}</Button>
          <Button className="h-8 b-#00E5FF rounded-2 bg-#00E5FF px-6 text-sm text-black" onClick={() => setvisible(false)}>{t('common.confirm')}</Button>
        </div>
      )}
    >
      <div className="bg-#171b21 py-6">
        <div className="text-base text-#9CA3AF">{t('lawyerWorkbench.executeCaseDialog.uploadInstruction')}</div>
        <div className="mt-4 text-sm text-#9CA3AF">{t('lawyerWorkbench.executeCaseDialog.uploadLabel')}</div>
        <Upload
          directory
          className=""
          accept=".pdf,.png,.jpg,.jpeg"
          showUploadList={false}
          beforeUpload={(_file) => {
          }}
        >
          <Button className="mt-4 h-8 bg-white px-3 text-sm text-black">{t('lawyerWorkbench.executeCaseDialog.selectFile')}</Button>
        </Upload>
      </div>
    </CommonDialog>
  )
}

// 待认领案件（初审阶段) => 确认认领弹窗
export function ConfirmClaimDialog({
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
      style={{
        '--common-dialog-footer-background': '#171b21',
        '--common-dialog-body-background': '#171b21',
        '--common-dialog-header-background': '#171b21'
      } as any}
      width={446}
      onCancel={() => setvisible(false)}
      title={<div className="text-xl">{t('lawyerWorkbench.confirmClaimDialog.title')}</div>}
      closable={false}
      footer={(
        <div className="fyc justify-end gap-3">
          <Button className="h-8 b-#0A192F rounded-2 bg-#0A192F px-6 text-sm text-#D1D5DB" onClick={() => setvisible(false)}>{t('common.cancel')}</Button>
          <Button className="h-8 b-#00E5FF rounded-2 bg-#00E5FF px-6 text-sm text-black" onClick={() => setvisible(false)}>{t('common.confirm')}</Button>
        </div>
      )}
    >
      <div className="bg-#171b21 py-6">
        <div className="text-base text-#9CA3AF">{t('lawyerWorkbench.confirmClaimDialog.confirmMessage', { id: 'PROP20231101' })}</div>
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
      style={{
        '--common-dialog-footer-background': '#171b21',
        '--common-dialog-body-background': '#171b21',
        '--common-dialog-header-background': '#171b21'
      } as any}
      width={446}
      onCancel={() => setvisible(false)}
      title={<div className="text-xl">{t('lawyerWorkbench.confirmSignDialog.title')}</div>}
      closable={false}
      footer={(
        <div className="fyc justify-end gap-3">
          <Button className="h-8 b-#0A192F rounded-2 bg-#0A192F px-6 text-sm text-#D1D5DB" onClick={() => setvisible(false)}>{t('common.cancel')}</Button>
          <Button className="h-8 b-#00E5FF rounded-2 bg-#00E5FF px-6 text-sm text-black" onClick={() => setvisible(false)}>{t('common.confirm')}</Button>
        </div>
      )}
    >
      <div className="bg-#171b21 py-6">
        <div className="text-base text-#9CA3AF">{t('lawyerWorkbench.confirmSignDialog.confirmMessage', { id: 'PROP20231103' })}</div>
        <div className="mt-4 text-sm text-#9CA3AF">{t('lawyerWorkbench.confirmSignDialog.uploadLabel')}</div>
        <Upload
          directory
          className=""
          accept=".pdf,.png,.jpg,.jpeg"
          showUploadList={false}
          beforeUpload={(_file) => {
          }}
        >
          <Button className="mt-4 h-8 bg-white px-3 text-sm text-black">{t('lawyerWorkbench.confirmSignDialog.selectFile')}</Button>
        </Upload>
      </div>
    </CommonDialog>
  )
}

// 已完成拍卖案件 => 查看详情弹窗
export function CaseDetailDialog({ visible, setvisible }: {
  visible: boolean
  setvisible: (visible: boolean) => void
}) {
  const { t } = useTranslation()
  return (
    <CommonDialog
      open={visible}
      style={{
        '--common-dialog-footer-background': '#171b21',
        '--common-dialog-body-background': '#171b21',
        '--common-dialog-header-background': '#171b21'
      } as any}
      className="[&>div>div>.ant-modal-footer]:!b-0"
      width={879}
      closable
      onCancel={() => setvisible(false)}
      title={(
        <div className="text-xl">
          {t('lawyerWorkbench.caseDetailDialog.title')}
          :AUC-2023-0001
        </div>
      )}
      footer={false}
    >
      <div className="bg-#171b21 py-6">
        <div className="text-lg text-#00E5FF">{t('lawyerWorkbench.caseDetailDialog.auctionInfoTitle')}</div>
        <div className="grid cols-2 mt-4 gap-4 text-base [&>div>div:first-child]:mb-1 [&>div>div:first-child]:text-#9CA3AF">
          <div>
            <div>{t('lawyerWorkbench.caseDetailDialog.caseNumber')}</div>
            <div>AUC-2023-0001</div>
          </div>
          <div>
            <div>{t('lawyerWorkbench.caseDetailDialog.propertyName')}</div>
            <div>滨海国际公寓15栋801室</div>
          </div>
          <div>
            <div>{t('lawyerWorkbench.caseDetailDialog.auctionPrice')}</div>
            <div>
              $
              {formatNumberNoRound(12500000, 6, 0)}
            </div>
          </div>
          <div>
            <div>{t('lawyerWorkbench.caseDetailDialog.auctionDate')}</div>
            <div>{dayjs().format('YYYY-MM-DD')}</div>
          </div>
          <div>
            <div>{t('lawyerWorkbench.caseDetailDialog.contractNumber')}</div>
            <div>CT-2023-1115-001</div>
          </div>
          <div>
            <div>{t('lawyerWorkbench.caseDetailDialog.investorStatus')}</div>
            <div>{ }</div>
          </div>
        </div>
        <div className="text-lg text-#00E5FF">{t('lawyerWorkbench.caseDetailDialog.contractInfoTitle')}</div>
        <div className="mb-30 mt-4 overflow-hidden b-1 b-#30363D rounded-2 p-4 text-base">
          <div className="#9CA3AF">{t('lawyerWorkbench.caseDetailDialog.transactionHash')}</div>
          {/* 自动换行 */}
          <div className="mt-2.5 fyc gap-2 whitespace-pre-wrap text-sm">
            <div>0x7a9f8e7d6c5b4a3f2e1d0c9b8a7s6d5f4g3h2j1k0l9m8n7b6v5c4x3z2a1</div>
            <div className="i-fa-solid:copy text-#69e2fc clickable"></div>
          </div>
          <div className="mt-4 flex justify-end text-#00E5FF">
            <div className="w-fit fyc gap-1 clickable">
              <div className="i-tdesign:jump"></div>
              <div>{t('lawyerWorkbench.caseDetailDialog.viewBlockchainRecord')}</div>
            </div>
          </div>
        </div>
      </div>
    </CommonDialog>
  )
}

// 待执行拍卖 => 查看详情弹窗
export function AuctionDetailDialog({ visible, setvisible }: {
  visible: boolean
  setvisible: (visible: boolean) => void
}) {
  const { t } = useTranslation()
  return (
    <CommonDialog
      open={visible}
      style={{
        '--common-dialog-footer-background': '#171b21',
        '--common-dialog-body-background': '#171b21',
        '--common-dialog-header-background': '#171b21'
      } as any}
      width={766}
      onCancel={() => setvisible(false)}
      title={<div className="text-xl">{t('lawyerWorkbench.auctionDetailDialog.title')}</div>}
      footer={<Button onClick={() => setvisible(false)} className="h-10 b-#1E293B bg-#1E293B px-4 text-base">{t('lawyerWorkbench.auctionDetailDialog.close')}</Button>}
    >
      <div className="grid cols-2 gap-4 bg-#171b21 p-6">
        <div className="fol gap-4">
          <img className="h-64 w-full rounded-2" src={(new URL('@/assets/test/test.png', import.meta.url).href)} alt="" />
          <div className="[&>div>div:first-child]:mb-1 [&>div>div:first-child]:text-sm [&>div>div:first-child]:text-#9CA3AF">
            <div>
              <div>{t('lawyerWorkbench.auctionDetailDialog.caseNumber')}</div>
              <div>#AUC20231101</div>
            </div>
          </div>
          <div>
            <div>
              <div>{t('lawyerWorkbench.auctionDetailDialog.propertyName')}</div>
              <div>深圳南山公寓</div>
            </div>
          </div>
          <div>
            <div>
              <div>{t('lawyerWorkbench.auctionDetailDialog.propertyLocation')}</div>
              <div>南山区·科技园</div>
            </div>
          </div>
        </div>
        <div className="fol gap-4 [&>div>div:first-child]:mb-1 [&>div>div:first-child]:text-sm [&>div>div:first-child]:text-#9CA3AF">
          <div>
            <div>{t('lawyerWorkbench.auctionDetailDialog.submitter')}</div>
            <div>李房产管理员</div>
          </div>
          <div>
            <div>{t('lawyerWorkbench.auctionDetailDialog.submissionDate')}</div>
            <div>{dayjs().format('YYYY-MM-DD')}</div>
          </div>
          <div>
            <div>{t('lawyerWorkbench.auctionDetailDialog.propertyDescription')}</div>
            <div>位于深圳市南山区科技园核心地段，2015年建成，总面积120平方米，三室两厅一卫，南北通透，采光良好。周边配套完善，交通便利，距离地铁1号线科技园站仅800米。</div>
          </div>
          <div>
            <div>{t('lawyerWorkbench.auctionDetailDialog.startingPrice')}</div>
            <div>
              $
              {formatNumberNoRound(5200000, 6, 0)}
            </div>
          </div>
        </div>
      </div>
    </CommonDialog>
  )
}

// 已完成案件 => 查看详情弹窗
export function CompletedCaseDetailDialog({ visible, setvisible }: {
  visible: boolean
  setvisible: (visible: boolean) => void
}) {
  const { t } = useTranslation()
  return (
    <CommonDialog
      open={visible}
      style={{
        '--common-dialog-footer-background': '#171b21',
        '--common-dialog-body-background': '#171b21',
        '--common-dialog-header-background': '#171b21'
      } as any}
      className="[&>div>div>.ant-modal-footer]:!b-0"
      width={766}
      closable
      onCancel={() => setvisible(false)}
      title={(
        <div>
          <div className="text-xl">
            {t('lawyerWorkbench.completedCaseDetailDialog.title')}
            :AUC-2023-0001
          </div>
          <div className="mt-1 text-base text-#9CA3AF">
            {t('lawyerWorkbench.completedCaseDetailDialog.assetNumber')}
            : ASSET-9876
          </div>
        </div>
      )}
      footer={false}
    >
      <div className="py-6 text-white">
        <div className="flex gap-6">
          <div className="flex-1">
            <img className="szie-full h-64" src={(new URL('@/assets/test/test.png', import.meta.url).href)} alt="" />
          </div>
          <div className="min-w-54 b b-#30363D rounded-2 bg-#1E2328 p-5">
            <div className="text-lg font-600">{t('lawyerWorkbench.completedCaseDetailDialog.assetSummary')}</div>
            <div className="mt-4 flex flex-col gap-3 [&>div>div:first-child]:mb-1 [&>div>div:first-child]:text-sm [&>div>div:last-child]:text-base [&>div>div:first-child]:text-#9CA3AF">
              <div>
                <div>{t('lawyerWorkbench.completedCaseDetailDialog.assetType')}</div>
                <div>房地产</div>
              </div>
              <div>
                <div>{t('lawyerWorkbench.completedCaseDetailDialog.appraisalValue')}</div>
                <div>
                  $
                  {formatNumberNoRound(12500000, 6, 0)}
                </div>
              </div>
              <div>
                <div>{t('lawyerWorkbench.completedCaseDetailDialog.location')}</div>
                <div>上海市浦东新区</div>
              </div>
              <div>
                <div>{t('lawyerWorkbench.completedCaseDetailDialog.submissionTime')}</div>
                <div>{dayjs().format('YYYY-MM-DD HH:mm')}</div>
              </div>
              <div>
                <div>{t('lawyerWorkbench.completedCaseDetailDialog.status')}</div>
                <div className="text-#FACC15">待上链</div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <div className="text-lg font-600">{t('lawyerWorkbench.completedCaseDetailDialog.assetDetails')}</div>
          <div className="mt-4 b b-#30363D rounded-2 bg-#1E2328 p-5 text-400 text-base text-#D1D5DB">
            该资产位于上海市浦东新区核心商业区，是一栋现代化写字楼的第15层整层，建筑面积约1,200平方米。建筑采用玻璃幕墙设计，配备高速电梯和先进的安防系统。周边交通便利，地铁2号线和7号线交汇处，距离浦东国际机场仅30分钟车程。
            目前该物业已出租给一家跨国科技公司，剩余租期3年，年租金回报率稳定在4.5%。评估报告显示，该区域商业地产价格在过去5年平均年增长率为6.2%，具有良好的保值增值潜力。
          </div>
        </div>
        <div className="grid cols-2 mt-8 gap-6">
          <div>
            <div className="text-lg font-600">{t('lawyerWorkbench.completedCaseDetailDialog.lawyerInfo')}</div>
            <div className="mt-4 b b-#30363D rounded-2 bg-#1E2328 p-5">
              <div className="fyc gap-4">
                <div className="size-16 fcc overflow-hidden b-2 b-#00E5FF rounded-full">
                  <img className="size-full" src={(new URL('@/assets/test/test.png', import.meta.url).href)} alt="" />
                </div>
                <div className="fol gap-1">
                  <div className="text-base">
                    张明
                    {t('lawyerWorkbench.offlineExecution.lawyer')}
                  </div>
                  <div className="text-sm text-#9CA3AF">高级合伙人 | 上海市律师事务所</div>
                  <div className="fyc gap-1 text-sm text-#00FF85">
                    <div className="i-ep:success-filled"></div>
                    <div>执业证已验证</div>
                  </div>
                </div>
              </div>
              <div className="mt-4 fol gap-2 text-base [&>div]:fyc [&>div]:justify-between [&>div]:gap-2 [&>div>div:first-child]:text-#9CA3AF">
                <div>
                  <div>{t('register.lawOffice.licenseNo')}</div>
                  <div>110XXXXXXXXXXX</div>
                </div>
                <div>
                  <div>{t('register.lawOffice.specialization')}</div>
                  <div>房地产法、公司法</div>
                </div>
                <div>
                  <div>{t('register.lawOffice.yearsOfPractice')}</div>
                  <div>15年</div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="text-lg font-600">{t('lawyerWorkbench.completedCaseDetailDialog.evaluationReportSummary')}</div>
            <div className="mt-4 b b-#30363D rounded-2 bg-#1E2328 p-5">
              <div className="mt-4 fol gap-2 text-base [&>div]:fol [&>div]:justify-between [&>div]:gap-2 [&>div>div:first-child]:text-#9CA3AF">
                <div>
                  <div>{t('lawyerWorkbench.completedCaseDetailDialog.evaluationAgency')}</div>
                  <div>上海诚信资产评估有限公司</div>
                </div>
                <div>
                  <div>{t('lawyerWorkbench.completedCaseDetailDialog.evaluationDate')}</div>
                  <div>{dayjs().format('YYYY-MM-DD')}</div>
                </div>
                <div>
                  <div>{t('lawyerWorkbench.completedCaseDetailDialog.reportNumber')}</div>
                  <div>SH-2023-0687</div>
                </div>
                <div>
                  <div>{t('lawyerWorkbench.completedCaseDetailDialog.evaluationMethod')}</div>
                  <div>市场比较法、收益法</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 text-lg font-600">{t('lawyerWorkbench.completedCaseDetailDialog.relatedDocuments')}</div>
        <div className="grid cols-3 mt-4 gap-4 pb-10">
          {
            [1, 2, 3].map(item => (
              <div key={item} className="fyc gap-3 b b-#30363D rounded-2 bg-#1E2328 p-4 clickable">
                <div className="size-12 fcc rounded-1 bg-#00E2FF1A">
                  <div className="i-mdi:file text-4 text-primary"></div>
                </div>
                <div>
                  <div className="text-base">
                    相关文件
                    {item}
                    .pnf
                  </div>
                  <div className="mt-1 text-sm text-#9CA3AF">2.4 MB</div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </CommonDialog>
  )
}
