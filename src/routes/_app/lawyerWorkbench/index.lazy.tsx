import icAuction from '@/assets/icon/assete/ic_auction.png'
import { CommonDialog } from '@/components/common/dialog/common'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Select } from 'antd'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AuctionDetailDialog, CaseDetailDialog, CompletedCaseDetailDialog, ConfirmClaimDialog, ExecuteCaseDialog } from './-components/homeDialogs'
import { CompletedAuctionTable, CompletedCasesTable, PendingAuctionExecutionTable, PendingClaimCasesTable, PendingInitialReviewTable, PendingOfflineExecutionTable, PendingRightConfirmationTable } from './-components/homeTables'
import './index.lazy.scss'

export const Route = createLazyFileRoute('/_app/lawyerWorkbench/')({
  component: RouteComponent
})

// 律师工作台
function RouteComponent() {
  const { t } = useTranslation()
  const caseTypeList = [
    { title: t('lawyerWorkbench.pendingInitialReview'), num: 12, icon: <img src={icAuction} className="w-5" /> },
    { title: t('lawyerWorkbench.pendingOfflineConfirmation'), num: 8, icon: <div className="i-ep:success-filled"></div> },
    { title: t('lawyerWorkbench.completedCases'), num: 24, icon: <div className="i-fa-solid:flag-checkered"></div> },
    { title: t('lawyerWorkbench.auctionTasks'), num: 6, icon: <img src={icAuction} className="w-5" /> }
  ]
  const [allDialogVisible, setAllDialogVisible] = useState(false)
  const [tableType, setTableType] = useState(0)

  const showTableAllDialog = (type: number) => {
    setAllDialogVisible(true)
    setTableType(type)
  }

  const DialogContent = useMemo(() => {
    switch (tableType) {
      case 0:
        return PendingInitialReviewTable
      case 1:
        return PendingOfflineExecutionTable
      case 2:
        return CompletedCasesTable
      case 3:
        return PendingClaimCasesTable
      case 4:
        return PendingRightConfirmationTable
      case 5:
        return PendingAuctionExecutionTable
      default:
        return CompletedAuctionTable
    }
  }, [tableType])

  // 执行案件弹窗 TODO  and 已完成案件查看
  const [executeCaseData, setExecuteCaseData] = useState({
    visible: false,
    data: {}
  })

  // 确认认领弹窗
  const [confirmClaimDialogData, setConfirmClaimDialogData] = useState({
    visible: false,
    data: {}
  })

  // 确认签章弹窗
  // const [signDialogData, setSignDialogData] = useState({
  //   visible: false,
  //   data: {}
  // })

  // 已完成拍卖案件 => 查看详情弹窗
  const [completedCaseData, setCompletedCaseData] = useState({
    visible: false,
    data: {}
  })

  // 待执行拍卖 => 查看详情弹窗
  const [auctionCaseData, setAuctionCaseData] = useState({
    visible: false,
    data: {}
  })

  // 已完成案件 => 查看详情弹窗

  const [completedEndData, setCompletedEndData] = useState({
    visible: false,
    data: {}
  })

  return (
    <div className="lawyer-workbench px-22 py-13 pb-24">
      <div className="rounded-3 bg-#161B22 p-4">
        <div className="text-lg font-600">{t('lawyerWorkbench.quickFilter')}</div>
        <div
          className="grid cols-3 mt-4 gap-3 pb-4 [&>div>div:first-child]:mb-1"
          style={{
            '--input-border-color': '#334155',
            '--input-bg-color': '#1f2328'
          } as any}
        >
          <div>
            <div>{t('lawyerWorkbench.country')}</div>
            {/* 全部 */}
            <Select placeholder={t('lawyerWorkbench.selectCountry')} />
          </div>
          <div>
            <div>{t('lawyerWorkbench.timeRange')}</div>
            {/* 全部时间 */}
            <Select placeholder={t('lawyerWorkbench.selectTimeRange')} />
          </div>
          <div>
            <div>{t('lawyerWorkbench.caseStatus')}</div>
            {/* 全部状态 */}
            <Select placeholder={t('lawyerWorkbench.selectCaseStatus')} />
          </div>
        </div>
      </div>
      <div className="grid cols-4 mt-10.5 gap-6">
        {
          caseTypeList.map((item, index) => {
            return (
              <div key={index} className="fyc justify-between gap-3 rounded-3 bg-#161B22 px-6 py-11">
                <div>
                  <div className="text-xs text-#9CA3AF">{item.title}</div>
                  <div className="mt-1 text-7.5 font-bold">{item.num}</div>
                </div>
                <div className="h-13.5 w-11.5 fcc b-1 b-#00E5FF rounded-2 b-solid bg-#0A192F text-xl text-#00E5FF">
                  {item.icon}
                </div>
              </div>
            )
          })
        }
      </div>
      <div className="grid cols-2 mt-8 gap-6">
        <div className="flex justify-between gap-3 rounded-3 bg-#161B22 p-6">
          <div>
            <div className="text-xs text-#9CA3AF">{t('lawyerWorkbench.pendingClaimInitialReview')}</div>
            <div className="mt-1 text-7.5 font-bold">2</div>
            <div className="mt-4 text-xs text-#00E5FF clickable">{t('lawyerWorkbench.viewDetails')}</div>
          </div>
          <div className="h-13.5 w-12 fcc b-1 b-#00E5FF rounded-2 b-solid bg-#0A192F text-xl text-#00E5FF">
            <div className="i-fa-solid:hand-holding translate-y--20%"></div>
          </div>
        </div>
        <div className="flex justify-between gap-3 rounded-3 bg-#161B22 p-6">
          <div>
            <div className="text-xs text-#9CA3AF">{t('lawyerWorkbench.pendingRightConfirmation')}</div>
            <div className="mt-1 text-7.5 font-bold">2</div>
            <div className="mt-4 text-xs text-#00E5FF clickable">{t('lawyerWorkbench.viewDetails')}</div>
          </div>
          <div className="h-13.5 w-12 fcc b-1 b-#00E5FF rounded-2 b-solid bg-#0A192F text-xl text-#00E5FF">
            <img className="w-5 transform-translate-x-10%" src={(new URL('@/assets/images/register/userSign-main.png', import.meta.url).href)} alt="" />
          </div>
        </div>
      </div>
      <div className="mt-11 flex flex-col gap-8">
        {/* 待认领案件（初审阶段） */}
        <PendingClaimCasesTable openConfirmClaimDialog={data => setConfirmClaimDialogData({ visible: true, data })} openDialog={() => showTableAllDialog(3)} />
        {/* 待初审案件 */}
        {/* <PendingInitialReviewTable openDialog={() => showTableAllDialog(0)} /> */}

        {/* 待线下执行案件 */}
        <PendingOfflineExecutionTable openDialog={() => showTableAllDialog(1)} />
        {/* 待确权案件（线下确认阶段） */}
        <PendingRightConfirmationTable openDialog={() => showTableAllDialog(4)} />
        {/* 已完成案件 */}
        <CompletedCasesTable openCaseDetailDialog={data => setCompletedEndData({ visible: true, data })} openDialog={() => showTableAllDialog(2)} />
        {/* 待执行拍卖案件 */}
        <PendingAuctionExecutionTable openAuctionDetailDialog={data => setAuctionCaseData({ visible: true, data })} openDialog={() => showTableAllDialog(5)} />
        {/* 已完成拍卖案件 */}
        <CompletedAuctionTable openCaseDetailDialog={data => setCompletedCaseData({ visible: true, data })} openDialog={() => showTableAllDialog(6)} />
      </div>
      {/* 展示所有的案件分类全部列表弹窗 */}
      <TableAllDialog visible={allDialogVisible} setVisible={setAllDialogVisible} component={DialogContent} title={t('lawyerWorkbench.caseList')} />
      {/* 执行案件操作弹窗 */}
      <ExecuteCaseDialog visible={executeCaseData.visible} setvisible={() => setExecuteCaseData(res => ({ visible: false, data: res.data }))} />
      {/* 确认认领弹窗 */}
      <ConfirmClaimDialog visible={confirmClaimDialogData.visible} setvisible={() => setConfirmClaimDialogData(res => ({ visible: false, data: res.data }))} />
      {/* 确认签章弹窗 */}
      {/* <ConfirmSignDialog visible={signDialogData.visible} setvisible={() => setSignDialogData(res => ({ visible: false, data: res.data }))} /> */}
      {/* 已完成拍卖案件 => 查看详情弹窗 */}
      <CaseDetailDialog visible={completedCaseData.visible} setvisible={() => setCompletedCaseData(res => ({ visible: false, data: res.data }))} />
      {/* 待执行拍卖案件 => 查看详情弹窗 */}
      <AuctionDetailDialog visible={auctionCaseData.visible} setvisible={() => setAuctionCaseData(res => ({ visible: false, data: res.data }))} />
      {/* 已完成案件 => 查看详情弹窗 */}
      <CompletedCaseDetailDialog visible={completedEndData.visible} setvisible={() => setCompletedEndData(res => ({ visible: false, data: res.data }))} />
    </div>
  )
}

// 展示所有的案件分类全部列表弹窗
function TableAllDialog({
  visible,
  setVisible,
  component: Component,
  title
}: {
  visible: boolean
  setVisible: (visible: boolean) => void
  component: React.ComponentType<any>
  title: string
}) {
  // const { t } = useTranslation()
  return (
    <CommonDialog
      style={{
        '--common-dialog-body-background': '#0e1014'
      } as any}
      width={1200}
      footer={false}
      closable
      title={title}
      open={visible}
      onCancel={() => setVisible(false)}
    >
      <div className="py-6">
        <Component pagination />
      </div>
    </CommonDialog>
  )
}
