import type { ColumnsType } from 'antd/es/table'
import { CommonTable } from '@/components/common/common-table'
import { formatNumberNoRound } from '@/utils/number'
import { cn } from '@/utils/style'
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

  const caseList = useMemo(() => {
    return [{
      title: t('evaluation.caseStatus.pending'),
      num: 12,
      icon: (
        <div className="h-13 w-11 fcc rounded-2 bg-#00E6FF33">
          <div className="i-bi:clock-fill bg-#68e2fb text-5"></div>
        </div>
      )
    }, {
      title: t('evaluation.caseStatus.processing'),
      num: 12,
      icon: (
        <div className="h-13 w-11 fcc rounded-2 bg-#00FF8733">
          <div className="i-nonicons:loading-16 bg-#75fb92 text-5"></div>
        </div>
      )
    }, {
      title: t('evaluation.caseStatus.completedThisMonth'),
      num: 24,
      icon: (
        <div className="h-13 w-11 fcc rounded-2 bg-#00E6FF33">
          <div className="i-ep:success-filled bg-#68e2fb text-5"></div>
        </div>
      )
    }, {
      title: t('evaluation.caseStatus.pendingClaim'),
      num: 5,
      icon: (
        <div className="h-13 w-11 fcc rounded-2 bg-#00E6FF33">
          <div className="i-famicons:hand-left-sharp bg-#68e2fb text-5"></div>
        </div>
      )
    }]
  }, [t])

  // const [formData, setFormData] = useState({
  //   page: 1,
  //   pageSize: 10,
  //   name: '',
  //   status: 0
  // })

  const data = [
    {
      id: 'CAS202305670042',
      user: {
        img: (new URL('@/assets/test/img.png', import.meta.url).href),
        name: '张三'
      },
      company: '上海张三网络科技有限公司',
      num: 12500000,
      createTime: '2023-04-01 12:12:12',
      status: 0
    },
    {
      id: 'CAS202305670043',
      user: {
        img: (new URL('@/assets/test/img.png', import.meta.url).href),
        name: '张三'
      },
      company: '上海张三网络科技有限公司',
      num: 12500000,
      createTime: '2023-04-01 12:12:12',
      status: 0
    },
    {
      id: 'CAS202305670044',
      user: {
        img: (new URL('@/assets/test/img.png', import.meta.url).href),
        name: '张三'
      },
      company: '上海张三网络科技有限公司',
      num: 12500000,
      createTime: '2023-04-01 12:12:12',
      status: 0
    },
    {
      id: 'CAS202305670045',
      user: {
        img: (new URL('@/assets/test/img.png', import.meta.url).href),
        name: '张三'
      },
      company: '上海张三网络科技有限公司',
      num: 12500000,
      createTime: '2023-04-01 12:12:12',
      status: 1
    }
  ]

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

  const columns: ColumnsType<typeof data[0]> = [
    {
      title: t('evaluation.table.caseId'),
      dataIndex: 'id',
      key: 'id',
      render: data => (
        <div className="font-bold">{data}</div>
      )
    },
    {
      title: t('evaluation.table.sourceLawyer'),
      dataIndex: 'user',
      key: 'user',
      render: data => (
        <div className="flex items-center gap-3">
          <img className="size-8 rounded-full object-cover" src={data.img} alt="" />
          <div className="text-sm text-#8B949E">{data.name}</div>
        </div>
      )
    },
    {
      title: t('evaluation.table.assetParty'),
      dataIndex: 'company',
      key: 'company'
    },
    {
      title: t('evaluation.table.amount'),
      dataIndex: 'num',
      key: 'num',
      render: data => (
        <div className="">
          $
          {formatNumberNoRound(data, 6, 0)}
        </div>
      )
    },
    {
      title: t('evaluation.table.createTime'),
      dataIndex: 'createTime',
      key: 'createTime',
      render: data => (
        <div className="text-#8B949E">{dayjs(data).format('YYYY-MM-DD HH:mm:ss')}</div>
      )
    },
    {
      title: t('evaluation.table.status'),
      dataIndex: 'status',
      key: 'status',
      render: data => (
        <div className={cn('px-2 py-1  rounded-9999px w-fit text-xs', data === 0 && 'text-#F87171 bg-#EB45451A', data === 1 && 'text-#60A5FA bg-#3B7FF51A')}>
          {dataStatus[data].label}
        </div>
      )
    },
    {
      title: t('evaluation.table.action'),
      key: 'action',
      render: (_, record) => (
        <div className="clickable">
          {
            record.status === 0
              ? <div onClick={() => setEvaluationInfoDialogVisible(true)}>{t('evaluation.action.claimEvaluation')}</div>
              : (
                  <Link to="/evaluation/info/$id" params={{ id: record.id }}>
                    <div>{t('evaluation.action.viewDetails')}</div>
                  </Link>
                )
          }
        </div>
      )
    }
  ]

  const [evaluationInfoDialogVisible, setEvaluationInfoDialogVisible] = useState(false)

  useEffect(() => {
    return () => {
      setEvaluationInfoDialogVisible(false)
    }
  }, [])

  return (
    <div className="px-22 py-13">
      <div className="text-8 font-600">{t('evaluation.title')}</div>
      <div className="mt-2 text-base text-#E5E7EB">{t('evaluation.description')}</div>
      <div className="grid grid-cols-4 mt-7 gap-6 max-md:cols-2">
        {
          caseList.map((item, index) => (
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
          ))
        }
      </div>
      <div className="mt-8 rounded-2 bg-#161B22 backdrop-blur-4">
        <div className="fyc justify-between p-4">
          <div className="text-lg font-bold">{t('evaluation.caseList')}</div>
          <div className="fyc gap-3">
            <Input
              className="h-9.5 w-64 [&>input]:h-full max-md:w-50%"
              placeholder={t('evaluation.searchPlaceholder')}
              prefix={
                <div className="i-gg:search text-4 text-#E5E7EB"></div>
              }
            />
            <Select options={dataStatus} />
          </div>
        </div>
        <CommonTable data={data} columns={columns} />
      </div>
      <EvaluationInfoDialog visible={evaluationInfoDialogVisible} setVisible={setEvaluationInfoDialogVisible} _evaluationInfo={data[0]} />
    </div>
  )
}
