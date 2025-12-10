import type { SearchParams } from '@/api/lawyerWorkbenchApi'
import * as lawyerWorkbenchApi from '@/api/lawyerWorkbenchApi'
import icAuction from '@/assets/icon/assete/ic_auction.png'
import { CommonDialog } from '@/components/common/dialog/common'
import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  CompletedCaseDetailDialog,
  ConfirmClaimDialog,
  ExecuteCaseDialog,
  PendingOfflineExecutionDialog
} from './-components/homeDialogs'
import { HomeForm } from './-components/homeForm'
import {
  CompletedCasesTable,
  PendingClaimCasesTable,
  PendingInitialReviewTable,
  PendingOfflineExecutionTable,
  PendingRightConfirmationTable
} from './-components/homeTables'
import './index.lazy.scss'

export const Route = createLazyFileRoute('/_app/lawyerWorkbench/')({
  component: RouteComponent
})

// 律师工作台
function RouteComponent() {
  const { t } = useTranslation()

  const { data: statisticsData } = useQuery({
    queryKey: ['getDashboardStatistics'],
    queryFn: async () => {
      const res
        = await lawyerWorkbenchApi.getLawyerWorkbenchDashboardStatistics()
      return res.data
    }
  })
  const caseTypeList = useMemo(() => {
    return [
      {
        title: t('lawyerWorkbench.pendingInitialReview'),
        num: statisticsData?.summary.pending_initial || 0,
        icon: <img src={icAuction} className="w-5" />
      },
      {
        title: t('lawyerWorkbench.pendingOfflineConfirmation'),
        num: statisticsData?.summary.pending_offline || 0,
        icon: <div className="i-ep:success-filled"></div>
      },
      {
        title: t('lawyerWorkbench.completedCases'),
        num: statisticsData?.summary.completed || 0,
        icon: <div className="i-fa-solid:flag-checkered"></div>
      },
      {
        title: t('lawyerWorkbench.auctionTasks'),
        num: statisticsData?.summary.auction_tasks || 0,
        icon: <img src={icAuction} className="w-5" />
      }
    ]
  }, [statisticsData, t])

  const [filterParams, setFilterParams] = useState({
    start_date: '',
    end_date: '',
    country_id: 0,
    keyword: '',
    reload: 0
  } as SearchParams & {
    reload?: number
  })

  const [allDialogVisible, setAllDialogVisible] = useState(false)
  const [tableType, setTableType] = useState(0)

  const showTableAllDialog = (type: number) => {
    setAllDialogVisible(true)
    setTableType(type)
  }
  useEffect(() => {
    if (!allDialogVisible) {
      setTableType(0)
    }
  }, [allDialogVisible])

  // 执行案件弹窗 TODO  and 已完成案件查看
  const [executeCaseData, setExecuteCaseData] = useState({
    visible: false,
    data: {}
  })

  // 确认认领弹窗
  const [confirmClaimDialogData, setConfirmClaimDialogData] = useState({
    visible: false,
    data: {} as lawyerWorkbenchApi.PendingCaseList
  })

  // 已完成案件 => 查看详情弹窗
  const [completedEndData, setCompletedEndData] = useState({
    visible: false,
    data: {} as lawyerWorkbenchApi.CaseListData
  })

  // 待线下执行案件 => 领取弹窗
  const [
    pendingOfflineExecutionDialogData,
    setPendingOfflineExecutionDialogData
  ] = useState({
    visible: false,
    data: {} as lawyerWorkbenchApi.CaseListData
  })

  const pendingClaimCasesEvent = {
    openConfirmClaimDialog: (data: lawyerWorkbenchApi.PendingCaseList) => {
      // setAllDialogVisible(false)
      setConfirmClaimDialogData({ visible: true, data })
    },
    openDialog: () => {
      showTableAllDialog(3)
    },
    reload: () => {
      setFilterParams(prev => ({
        ...prev,
        reload: prev.reload ? prev.reload + 1 : 1
      }))
    }
  }

  const pendingOfflineExecutionEvent = {
    openDialog: () => {
      showTableAllDialog(1)
    },
    openClaimDialog: (data: lawyerWorkbenchApi.CaseListData) => {
      setPendingOfflineExecutionDialogData({ visible: true, data })
    }
  }

  const pendingRightConfirmationEvent = {
    openDialog: () => {
      showTableAllDialog(4)
    }
  }

  const completedCasesEvent = {
    openDialog: () => {
      showTableAllDialog(2)
    },
    openCaseDetailDialog: (data: lawyerWorkbenchApi.CaseListData) =>
      setCompletedEndData({ visible: true, data })
  }

  const pendingInitialReviewEvent = {
    openDialog: () => {
      showTableAllDialog(0)
    }
  }

  const DialogContent = useMemo(() => {
    switch (tableType) {
      case 1:
        return {
          component: PendingOfflineExecutionTable,
          props: pendingOfflineExecutionEvent
        }
      case 2:
        return {
          component: CompletedCasesTable,
          props: completedCasesEvent
        }
      case 3:
        return {
          component: PendingClaimCasesTable,
          props: pendingClaimCasesEvent
        }
      case 4: //
        return {
          component: PendingRightConfirmationTable,
          props: pendingRightConfirmationEvent
        }
      default: // 5
        return {
          component: PendingInitialReviewTable,
          props: pendingInitialReviewEvent
        }
    }
  }, [tableType])

  const reloadTableData = useCallback(() => {
    setFilterParams(prev => ({
      ...prev,
      reload: prev.reload ? prev.reload + 1 : 1
    }))
  }, [])

  return (
    <div className="lawyer-workbench px-22 py-13 pb-24">
      <div className="rounded-3 bg-#161B22 p-4">
        <div className="text-lg font-600">
          {t('lawyerWorkbench.quickFilter')}
        </div>
        <HomeForm
          key="home_form"
          filterParams={filterParams}
          setFilterParams={setFilterParams}
        />
      </div>
      <div className="grid cols-4 mt-10.5 gap-6">
        {caseTypeList.map((item, index) => {
          return (
            <div
              key={index}
              className="fyc justify-between gap-3 rounded-3 bg-#161B22 px-6 py-11"
            >
              <div>
                <div className="text-xs text-#9CA3AF">{item.title}</div>
                <div className="mt-1 text-7.5 font-bold">{item.num}</div>
              </div>
              <div className="h-13.5 w-11.5 fcc b-1 b-#00E5FF rounded-2 b-solid bg-#0A192F text-xl text-#00E5FF">
                {item.icon}
              </div>
            </div>
          )
        })}
      </div>
      <div className="grid cols-2 mt-8 gap-6">
        <div className="flex justify-between gap-3 rounded-3 bg-#161B22 p-6">
          <div>
            <div className="text-xs text-#9CA3AF">
              {t('lawyerWorkbench.pendingClaimInitialReview')}
            </div>
            <div className="mt-1 text-7.5 font-bold">
              {statisticsData?.claim?.initial || 0}
            </div>
            <div
              onClick={() => showTableAllDialog(3)}
              className="mt-4 text-xs text-#00E5FF clickable"
            >
              {t('lawyerWorkbench.viewDetails')}
            </div>
          </div>
          <div className="h-13.5 w-12 fcc b-1 b-#00E5FF rounded-2 b-solid bg-#0A192F text-xl text-#00E5FF">
            <div className="i-fa-solid:hand-holding translate-y--20%"></div>
          </div>
        </div>
        <div className="flex justify-between gap-3 rounded-3 bg-#161B22 p-6">
          <div>
            <div className="text-xs text-#9CA3AF">
              {t('lawyerWorkbench.pendingRightConfirmation')}
            </div>
            <div className="mt-1 text-7.5 font-bold">
              {statisticsData?.claim?.offline || 0}
            </div>
            <div
              onClick={() => showTableAllDialog(4)}
              className="mt-4 text-xs text-#00E5FF clickable"
            >
              {t('lawyerWorkbench.viewDetails')}
            </div>
          </div>
          <div className="h-13.5 w-12 fcc b-1 b-#00E5FF rounded-2 b-solid bg-#0A192F text-xl text-#00E5FF">
            <img
              className="w-5 transform-translate-x-10%"
              src={
                new URL(
                  '@/assets/images/register/userSign-main.png',
                  import.meta.url
                ).href
              }
              alt=""
            />
          </div>
        </div>
      </div>
      <div className="mt-11 flex flex-col gap-8">
        {/* 待认领案件（初审阶段） */}
        <PendingClaimCasesTable
          {...pendingClaimCasesEvent}
          searchParams={filterParams}
        />

        {/* 待初审 */}
        <PendingInitialReviewTable
          {...pendingInitialReviewEvent}
          searchParams={filterParams}
        />

        {/* 待线下执行案件 */}
        <PendingOfflineExecutionTable
          {...pendingOfflineExecutionEvent}
          searchParams={filterParams}
        />
        {/* 待确权案件（线下确认阶段） */}
        <PendingRightConfirmationTable
          {...pendingRightConfirmationEvent}
          searchParams={filterParams}
        />
        {/* 已完成案件 */}
        <CompletedCasesTable
          {...completedCasesEvent}
          searchParams={filterParams}
        />
      </div>
      {/* 展示所有的案件分类全部列表弹窗 */}
      <TableAllDialog
        visible={allDialogVisible}
        setVisible={setAllDialogVisible}
        component={DialogContent.component}
        title={t('lawyerWorkbench.caseList')}
        {...DialogContent.props}
      />
      {/* 执行案件操作弹窗 */}
      <ExecuteCaseDialog
        visible={executeCaseData.visible}
        setvisible={() =>
          setExecuteCaseData(res => ({ visible: false, data: res.data }))}
      />
      {/* 确认认领弹窗 */}
      <ConfirmClaimDialog
        reloadTable={reloadTableData}
        visible={confirmClaimDialogData.visible}
        setvisible={() =>
          setConfirmClaimDialogData(res => ({
            visible: false,
            data: res.data
          }))}
        data={confirmClaimDialogData.data}
      />
      {/* 待线下执行案件 => 确认认领弹窗 */}
      <PendingOfflineExecutionDialog
        visible={pendingOfflineExecutionDialogData.visible}
        setvisible={() =>
          setPendingOfflineExecutionDialogData(res => ({
            visible: false,
            data: res.data
          }))}
        data={pendingOfflineExecutionDialogData.data}
        reloadTable={reloadTableData}
      />
      {/* 已完成案件 => 查看详情弹窗 */}
      <CompletedCaseDetailDialog
        visible={completedEndData.visible}
        setvisible={() =>
          setCompletedEndData(res => ({ visible: false, data: res.data }))}
        data={completedEndData.data}
      />
    </div>
  )
}

// 展示所有的案件分类全部列表弹窗
function TableAllDialog({
  visible,
  setVisible,
  component: Component,
  title,
  ...props
}: {
  visible: boolean
  setVisible: (visible: boolean) => void
  component: React.ComponentType<any>
  title: string
}) {
  // const { t } = useTranslation()
  const [filterParams, setFilterParams] = useState({
    start_date: '',
    end_date: '',
    country_id: 0,
    keyword: '',
    reload: 0
  } as SearchParams & {
    reload?: number
  })

  const onCancel = () => {
    setVisible(false)
    setFilterParams({
      start_date: '',
      end_date: '',
      country_id: 0,
      keyword: ''
    })
  }

  const reloadTableData = useCallback(() => {
    setFilterParams(prev => ({
      ...prev,
      reload: prev.reload ? prev.reload + 1 : 1
    }))
  }, [])

  return (
    <CommonDialog
      style={
        {
          '--common-dialog-body-background': '#0e1014'
        } as any
      }
      width={1200}
      footer={false}
      closable
      title={title}
      open={visible}
      onCancel={onCancel}
    >
      <div className="fol gap-2 pb-10 pt-2">
        <HomeForm
          key="home_dialog_form"
          filterParams={filterParams}
          setFilterParams={setFilterParams}
        />
        <Component
          pagination
          searchParams={filterParams}
          {...{ ...props, reloadTable: reloadTableData }}
        />
      </div>
    </CommonDialog>
  )
}
