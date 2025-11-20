import type { ColumnsType } from 'antd/es/table'
import { CommonTable } from '@/components/common/common-table'
import { cn } from '@/utils/style'
import { createFileRoute } from '@tanstack/react-router'
import { Input } from 'antd'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import './index.scss'

export const Route = createFileRoute('/_app/evaluation/reportManagement/')({
  component: RouteComponent
})

function RouteComponent() {
  const { t } = useTranslation()

  const data = [
    {
      id: 'VAL-2025-00120',
      address: '上海花家地园区',
      status: 1,
      createTime: '2125-11-12 12:12:12'
    },
    {
      id: 'VAL-2025-00120',
      address: '上海花家地园区',
      status: 1,
      createTime: '2025-11-12 12:12:12'
    },
    {
      id: 'VAL-2025-00120',
      address: '上海花家地园区',
      status: 0,
      createTime: '2025-11-12 12:12:12'
    }
  ]

  const columns: ColumnsType<typeof data[0]> = [
    {
      title: t('evaluation.reportManagement.table.reportId'),
      dataIndex: 'id',
      key: 'id',
      render: text => (
        <div>
          <div className="text-#9CA3AF">{t('evaluation.reportManagement.table.reportId')}</div>
          <div className="mt-1.5 font-bold">{text}</div>
        </div>
      )
    },
    {
      title: t('evaluation.reportManagement.table.assetName'),
      dataIndex: 'address',
      key: 'address',
      render: text => (
        <div>
          <div className="mb-1.5 text-#9CA3AF">{t('evaluation.reportManagement.table.assetName')}</div>
          <div>{text}</div>
        </div>
      )
    },
    {
      title: t('evaluation.reportManagement.table.status'),
      dataIndex: 'status',
      key: 'status',
      render: text => (
        <div>
          <div className="mb-1.5 text-#9CA3AF">{t('evaluation.reportManagement.table.status')}</div>
          <div className={cn(text === 1 ? 'bg-#00FF8733 text-#00FF85' : 'text-#F87171 bg-#EB45451A', 'px-2 py-1.5 rounded-9999px fyc gap-1 text-xs w-fit h-fit')}>
            <div className={cn(text === 1 ? 'i-ep:success-filled' : 'i-ix:namur-failure-filled')}></div>
            <div>{text === 1 ? t('evaluation.reportManagement.table.passed') : t('evaluation.reportManagement.table.failed')}</div>
          </div>
        </div>
      )
    },
    {
      title: t('evaluation.reportManagement.table.submitTime'),
      dataIndex: 'createTime',
      key: 'createTime',
      render: text => (
        <div>
          <div className="mb-1.5 text-#9CA3AF">{t('evaluation.reportManagement.table.submitTime')}</div>
          <div className="text-#D1D5DB">{dayjs(text).format('YYYY-MM-DD HH:mm:ss')}</div>
        </div>
      )
    },
    {
      title: t('evaluation.reportManagement.table.action'),
      key: 'action',
      render: () => (
        <div className="fcc gap-4 text-base text-#9CA3AF [&>div]:fcc [&>div]:clickable [&>div]:gap-1">
          <div>
            <div className="i-flowbite:download-solid"></div>
            <div>{t('evaluation.reportManagement.table.download')}</div>
          </div>
          <div>
            <div className="i-ic:baseline-delete"></div>
            <div>{t('evaluation.reportManagement.table.delete')}</div>
          </div>
        </div>
      )
    }
  ]

  return (
    <div className="reportManagement px-22 py-13 text-base max-md:px-4">
      <div className="fyc justify-between gap-4">
        <div>
          <div className="text-8 font-600">{t('evaluation.reportManagement.title')}</div>
          <div className="mt-2 text-#9CA3AF">{t('evaluation.reportManagement.description')}</div>
        </div>
      </div>
      <Input
        className="mt-8 [&>span>input]:h-12.5 [&>span>input]:b-l-0 [&>span>.ant-input-group-addon]:bg-#171b21 [&>span>input]:bg-#171b21 [&>span>.ant-input-outlined:focus]:b-l-1! [&>span>.ant-input-outlined:hover]:b-l-1!"
        placeholder={t('evaluation.reportManagement.searchPlaceholder')}
        addonBefore={
          <div className="i-weui:search-filled text-4 text-#9ea3ae"></div>
        }
      />
      <div className="mt-8">
        <CommonTable data={data} columns={columns} />
      </div>
    </div>
  )
}
