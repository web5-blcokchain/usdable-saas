import type { ColumnsType } from 'antd/es/table'
import * as evaluationApi from '@/api/evaluationApi'
import { CommonTable } from '@/components/common/common-table'
import { ASSET_STATUS } from '@/enum/asset'
import { formatNumberNoRound } from '@/utils/number'
import { cn } from '@/utils/style'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Input, Select } from 'antd'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { EvaluationInfoDialog } from './-components/evaluationInfoDialog'

export const Route = createFileRoute('/_app/evaluation/')({
  component: RouteComponent
})

function RouteComponent() {
  const { t } = useTranslation()

  // 获取评估统计
  const { data: homeData } = useQuery({
    queryKey: ['getDashboardStatistics'],
    queryFn: async () => {
      const data = await evaluationApi.getDashboardStatistics()
      return data.data
    }
  })
  const caseList = useMemo(() => {
    return [
      {
        title: t('evaluation.caseStatus.pending'),
        num: homeData?.pending_cases || 0,
        icon: (
          <div className="h-13 w-11 fcc rounded-2 bg-#00E6FF33">
            <div className="i-bi:clock-fill bg-#68e2fb text-5"></div>
          </div>
        )
      },
      {
        title: t('evaluation.caseStatus.processing'),
        num: homeData?.processing_cases || 0,
        icon: (
          <div className="h-13 w-11 fcc rounded-2 bg-#00FF8733">
            <div className="i-nonicons:loading-16 bg-#75fb92 text-5"></div>
          </div>
        )
      },
      {
        title: t('evaluation.caseStatus.completedThisMonth'),
        num: homeData?.completed_this_month || 0,
        icon: (
          <div className="h-13 w-11 fcc rounded-2 bg-#00E6FF33">
            <div className="i-ep:success-filled bg-#68e2fb text-5"></div>
          </div>
        )
      },
      {
        title: t('evaluation.caseStatus.pendingClaim'),
        num: homeData?.claim_cases || 0,
        icon: (
          <div className="h-13 w-11 fcc rounded-2 bg-#00E6FF33">
            <div className="i-famicons:hand-left-sharp bg-#68e2fb text-5"></div>
          </div>
        )
      }
    ]
  }, [t, homeData])

  const [formData, setFormData] = useState({
    page: 1,
    pageSize: 10,
    name: '',
    status: 0
  })

  // 获取评估列表
  const { data } = useQuery({
    queryKey: ['getCaseList', formData],
    queryFn: async () => {
      const data = await evaluationApi.getCaseList(formData)
      return data?.data
    }
  })

  // 案件状态
  const dataStatusContent = (status: ASSET_STATUS, _text: string) => {
    let data = {} as { className: string, text: string }
    if (status < 2) {
      data = {
        className: 'bg-#00FF8733 text-#00FF85',
        text: t('assete.assetStatus.lawyerConfirming')
      } // 律师确认中
    }
    else if (
      [ASSET_STATUS.LAWYER_REJECTED, ASSET_STATUS.ASSESSOR_REJECTED].includes(
        status
      )
    ) {
      data = {
        className: 'bg-#CD647833 text-#CF6679',
        text: t('assete.assetStatus.rejected')
      } // 驳回
    }
    else if (
      [
        ASSET_STATUS.ASSESSOR_CLAIMED,
        ASSET_STATUS.LAWYER_CLAIMED_OFFLINE,
        ASSET_STATUS.LAWYER_UPLOADED_MATERIALS
      ].includes(status)
    ) {
      data = {
        className: 'bg-#2E2F1F text-#FFDD00',
        text: t('assete.assetStatus.pendingEvaluation')
      } // 待评估
    }
    else {
      data = {
        className: 'bg-#00FF8733 text-#00FF85',
        text: t('assete.assetStatus.onChainSuccess')
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
          `common.assetStatus.${
            ASSET_STATUS.DRAFT <= status
            && ASSET_STATUS.ASSET_ON_CHAIN >= status
              ? status
              : 'other'
          }`
        )}
      </div>
    )
  }

  const dataStatus = Array.from({ length: 10 }, (_, index) => {
    return {
      value: index - 1,
      label: t(`common.assetStatus.${index - 1}`)
    }
  })

  const columns: ColumnsType<evaluationApi.CaseListResponse> = [
    {
      title: t('evaluation.table.caseId'),
      dataIndex: 'code',
      key: 'code',
      render: data => <div className="font-bold">{data}</div>
    },
    {
      title: t('evaluation.table.sourceLawyer'),
      dataIndex: 'lawyer_name',
      key: 'lawyer_name',
      render: data => (
        <div className="flex items-center gap-3">
          {/* <img className="size-8 rounded-full object-cover" src={data.img} alt="" /> */}
          <div className="text-sm text-#8B949E">{data}</div>
        </div>
      )
    },
    {
      title: t('evaluation.table.assetParty'),
      dataIndex: 'asset_owner_name',
      key: 'asset_owner_name'
    },
    {
      title: t('evaluation.table.amount'),
      dataIndex: 'valuation',
      key: 'valuation',
      render: data => (
        <div className="">
          $
          {formatNumberNoRound(data || 0, 6, 0)}
        </div>
      )
    },
    {
      title: t('evaluation.table.createTime'),
      dataIndex: 'update_time',
      key: 'update_time',
      render: data => (
        <div className="text-#8B949E">
          {dayjs(data || '').format('YYYY-MM-DD HH:mm:ss')}
        </div>
      )
    },
    {
      title: t('evaluation.table.status'),
      dataIndex: 'status',
      key: 'status',
      render: data => (
        <div
          className={cn(
            'px-2 py-1  rounded-9999px w-fit text-xs',
            data === 0 && 'text-#F87171 bg-#EB45451A',
            data === 1 && 'text-#60A5FA bg-#3B7FF51A'
          )}
        >
          {dataStatusContent(data, '')}
        </div>
      )
    },
    {
      title: t('evaluation.table.action'),
      key: 'action',
      render: (_, record) => (
        <div className="clickable">
          {record.status === 0
            ? (
                <div onClick={() => setEvaluationInfoDialogVisible({
                  value: true,
                  data: record
                })}
                >
                  {t('evaluation.action.claimEvaluation')}
                </div>
              )
            : (
                <Link
                  to="/evaluation/info/$id"
                  params={{ id: (record?.id || '').toString() }}
                >
                  <div>{t('evaluation.action.viewDetails')}</div>
                </Link>
              )}
        </div>
      )
    }
  ]

  const [evaluationInfoDialogVisible, setEvaluationInfoDialogVisible]
    = useState({
      value: false,
      data: {} as evaluationApi.CaseListResponse
    })

  useEffect(() => {
    return () => {
      setEvaluationInfoDialogVisible({
        value: false,
        data: {} as evaluationApi.CaseListResponse
      })
    }
  }, [])

  return (
    <div className="px-22 py-13">
      <div className="text-8 font-600">{t('evaluation.title')}</div>
      <div className="mt-2 text-base text-#E5E7EB">
        {t('evaluation.description')}
      </div>
      <div className="grid grid-cols-4 mt-7 gap-6 max-md:cols-2">
        {caseList.map((item, index) => (
          <div
            key={index}
            className="w-full flex items-center justify-between b-1 b-#30363D rounded-2 b-solid bg-#161B22 p-6"
          >
            <div>
              <div className="text-sm text-#8B949E">{item.title}</div>
              <div className="mt-1 text-7.5 font-bold">{item.num}</div>
            </div>
            {item.icon}
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-2 bg-#161B22 backdrop-blur-4">
        <div className="fyc justify-between b-1 b-b-0 b-#30363D rounded-t-2 b-solid p-4">
          <div className="text-lg font-bold">{t('evaluation.caseList')}</div>
          <div className="fyc gap-3">
            <Input
              className="w-64 bg-#24292f !h-9.5 max-md:w-50% [&>input]:!h-full"
              placeholder={t('evaluation.searchPlaceholder')}
              prefix={<div className="i-gg:search text-4 text-#E5E7EB"></div>}
            />
            <Select
              className="w-64 !h-9.5 [&>input]:h-full max-md:w-50% [&>.ant-select-selector]:bg-#24292f"
              options={dataStatus}
              placeholder={t('evaluation.selectPlaceholder')}
              onChange={(value) => {
                setFormData(pre => ({ ...pre, status: value }))
              }}
            />
          </div>
        </div>
        <CommonTable
          className="b-1 rounded-0"
          data={data?.list || []}
          columns={columns}
          tableConfig={
            {
              borderColor: '#30363D',
              headerBorderRadius: 0
            } as any
          }
        />
      </div>
      <EvaluationInfoDialog
        visible={evaluationInfoDialogVisible.value}
        setVisible={(visible) => {
          setEvaluationInfoDialogVisible(pre => ({
            value: visible,
            data: pre.data
          }))
        }}
        _evaluationInfo={evaluationInfoDialogVisible.data}
      />
    </div>
  )
}
