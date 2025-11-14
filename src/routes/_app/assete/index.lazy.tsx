import type { ColumnsType } from 'antd/es/table'
import { CommonTable } from '@/components/common/common-table'
import { formatNumberNoRound } from '@/utils/number'
import { createLazyFileRoute, Link } from '@tanstack/react-router'
import { Button, Input, Modal } from 'antd'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { DefaultDetailsDialog } from './-components/defaultDetailsDialog'
import { PayRentDialog } from './-components/payRentDialog'

export const Route = createLazyFileRoute('/_app/assete/')({
  component: RouteComponent
})

function RouteComponent() {
  const { t } = useTranslation()

  const [assetStatus, _setAssetStatus] = useState([
    {
      title: 'assete.assetStatus.totalOnChain',
      num: `$${formatNumberNoRound(234230.21, 6, 0)}`,
      icon: (
        <div className="size-10 fcc rounded-full bg-#CD647833">
          <div className="i-ic:round-warning text-4 text-#c26c7a"></div>
        </div>
      )
    },
    {
      title: 'assete.assetStatus.verifying',
      num: 5,
      icon: (
        <div className="size-10 fcc rounded-full bg-#2E2F1F">
          <img className="h-4" src={new URL('@/assets/icon/assete/icon-2.png', import.meta.url).href} alt="" />
        </div>
      )
    },
    {
      title: 'assete.assetStatus.onChainSuccess',
      num: 19,
      icon: (
        <div className="size-10 fcc rounded-full bg-#00FF8733">
          <div className="i-ep:success-filled text-4 text-#75fb92"></div>
        </div>
      )
    },
    {
      title: 'assete.assetStatus.onChainFailed',
      num: 2,
      icon: (
        <div className="size-10 fcc rounded-full bg-#CD647833">
          <div className="i-ic:round-warning text-4 text-#c26c7a"></div>
        </div>
      )
    }
  ])

  const [assetOperatingStatus, _setAssetOperatingStatus] = useState([
    {
      title: 'assete.assetOperatingStatus.monthlyRent',
      num: `$${formatNumberNoRound(326500, 6, 0)}`,
      icon: (
        <div className="size-10 fcc rounded-full bg-#00E6FF33">
          <div className="i-ic:baseline-attach-money text-4 text-#68e2fb"></div>
        </div>
      )
    },
    {
      title: 'assete.assetOperatingStatus.pendingProperties',
      num: 5,
      icon: (
        <div className="size-10 fcc rounded-full bg-#B987FA33">
          <img className="h-4" src={new URL('@/assets/icon/assete/hourglass.png', import.meta.url).href} alt="" />
        </div>
      )
    },
    {
      title: 'assete.assetOperatingStatus.defaultAssets',
      num: 2,
      icon: (
        <div className="size-10 fcc rounded-full bg-#CD647833">
          <div className="i-si:warning-fill text-4 text-#c26c7a"></div>
        </div>
      )
    }
  ])

  const [asseteErrorDialogVisible, setAsseteErrorDialogVisible] = useState(false)
  const [payRentDialogVisible, setPayRentDialogVisible] = useState(false)
  const [defaultDetailsDialogVisible, setDefaultDetailsDialogVisible] = useState(false)

  useEffect(() => {
    return () => {
      setPayRentDialogVisible(false)
      setDefaultDetailsDialogVisible(false)
      setAsseteErrorDialogVisible(false)
    }
  }, [])

  return (
    <div className="bg-#000000 px-22 pb-15 pt-8 max-md:px-4">
      <div className="fyc justify-between">
        <div className="text-2xl font-600">{t('assete.assetOnChainStatus')}</div>
        <Link to="/assete/addAssete">
          <Button className="h-10.5 fcc gap-2 b b-#00E5FF b-solid bg-#00E2FF1A px-4.5 text-#00E5FF">
            <div className="i-tabler:plus text-4 text-#00E5FF"></div>
            <div>{t('assete.addAssetBtn')}</div>
          </Button>
        </Link>
      </div>
      {/* 资产上链状态 */}
      <div className="grid cols-4 mt-6 gap-4 max-md:cols-1">
        {
          assetStatus.map(item => (
            // hover 添加阴影 移动到右上10px
            <div
              key={item.title}
              className="flex justify-between gap-3 rounded-2 bg-#161B22 px-5 py-10 backdrop-blur-4 transition-all-300 hover:translate-[4px,-4px] hover:shadow-2xl"
            >
              <div>
                <div className="text-sm text-#9CA3AF">{t(item.title)}</div>
                <div className="mt-1 text-7.5 font-bold">{item.num}</div>
              </div>
              <div>{item.icon}</div>
            </div>
          ))
        }
      </div>
      {/* 资产上链明细 */}
      <div className="mt-8 rounded-2 bg-#161B22 backdrop-blur-4">
        <div className="fyc justify-between p-4">
          <div className="text-lg font-bold">{t('assete.assetOnChainDetails')}</div>
          <Input
            className="h-9.5 w-64 [&>input]:h-full max-md:w-50%"
            placeholder={t('assete.searchAsset')}
            prefix={
              <div className="i-gg:search text-4 text-#E5E7EB"></div>
            }
          />
        </div>
        <AssetsTable openErrorDialog={() => setAsseteErrorDialogVisible(true)} />
      </div>
      <div className="mt-8">
        <div className="text-2xl font-600">{t('assete.assetOperatingStatusTitle')}</div>
        <div className="grid cols-4 mt-6 gap-4 max-md:cols-1">
          {
            assetOperatingStatus.map(item => (
              // hover 添加阴影 移动到右上10px
              <div
                key={item.title}
                className="flex justify-between gap-3 rounded-2 bg-#161B22 px-5 py-10 backdrop-blur-4 transition-all-300 hover:translate-[4px,-4px] hover:shadow-2xl"
              >
                <div>
                  <div className="text-sm text-#9CA3AF">{t(item.title)}</div>
                  <div className="mt-1 text-7.5 font-bold">{item.num}</div>
                </div>
                <div>{item.icon}</div>
              </div>
            ))
          }
        </div>
        <div className="mt-8 rounded-2 bg-#161B22 backdrop-blur-4">
          <div className="fyc justify-between p-4">
            <div className="text-lg font-bold">{t('assete.propertyOperatingDetails')}</div>
          </div>
          <AssetOperatingTable openPayDialog={() => setPayRentDialogVisible(true)} openDefaultDetailsDialog={() => setDefaultDetailsDialogVisible(true)} />
        </div>
      </div>
      {/* 驳回原因 */}
      <AsseteErrorDialog visible={asseteErrorDialogVisible} setVisible={setAsseteErrorDialogVisible} message="驳回原因" />
      {/* 缴纳租金 */}
      <PayRentDialog visible={payRentDialogVisible} setVisible={setPayRentDialogVisible} />
      {/* 违约详情 */}
      <DefaultDetailsDialog visible={defaultDetailsDialogVisible} setVisible={setDefaultDetailsDialogVisible} />
    </div>
  )
}

// 资产上链明细
function AssetsTable({ openErrorDialog }: { openErrorDialog: (message: any) => void }) {
  const { t } = useTranslation()
  const data = [
    {
      assetInfo: {
        img: (new URL('@/assets/test/img.png', import.meta.url).href),
        name: '滨江壹号 A栋',
        id: 'PROP-2023-001'
      },
      price: 20203.94,
      type: 0,
      updateTime: '2023-05-12 09:45',
      status: 0,
      processor: '上海评估所',
      id: 0
    },
    {
      assetInfo: {
        img: (new URL('@/assets/test/img.png', import.meta.url).href),
        name: '滨江壹号 A栋',
        id: 'PROP-2023-001'
      },
      price: 20203.94,
      type: 1,
      updateTime: '2023-05-12 09:45',
      status: 1,
      processor: '上海评估所',
      id: 1
    },
    {
      assetInfo: {
        img: (new URL('@/assets/test/img.png', import.meta.url).href),
        name: '滨江壹号 A栋',
        id: 'PROP-2023-001'
      },
      price: 20203.94,
      type: 2,
      updateTime: '2023-05-12 09:45',
      status: 2,
      processor: '上海评估所',
      id: 2
    },
    {
      assetInfo: {
        img: (new URL('@/assets/test/img.png', import.meta.url).href),
        name: '滨江壹号 A栋',
        id: 'PROP-2023-001'
      },
      price: 20203.94,
      type: 3,
      updateTime: '2023-05-12 09:45',
      status: 3,
      processor: '上海评估所',
      id: 3
    }
  ]

  const dataTypeContent = (type: number) => {
    switch (type) {
      case 0:
        return t('assete.assetType.residential')
      case 1:
        return t('assete.assetType.commercial')
      case 2:
        return t('assete.assetType.complex')
      default:
        return t('assete.assetType.unknown')
    }
  }
  const dataStatusContent = (status: number) => {
    let data = {} as { className: string, text: string }
    switch (status) {
      case 0:
        data = { className: 'bg-#00FF8733 text-#00FF85', text: t('assete.assetStatus.lawyerConfirming') } // 律师确认中
        break
      case 1:
        data = { className: 'bg-#2E2F1F text-#FFDD00', text: t('assete.assetStatus.pendingEvaluation') } // 待评估
        break
      case 2:
        data = { className: 'bg-#CD647833 text-#CF6679', text: t('assete.assetStatus.rejected') } // 驳回
        break
      default:
        data = { className: 'bg-#00FF8733 text-#00FF85', text: t('assete.assetStatus.onChainSuccess') } // 已上链
    }

    return (
      <div className={cn(data.className, 'rounded-9999px px-2 py-1 text-xs font-400 w-fit')}>
        {data.text}
      </div>
    )
  }

  const columns: ColumnsType<typeof data[0]> = [
    {
      title: t('assete.table.assetName'),
      dataIndex: 'assetInfo',
      key: 'assetInfo',
      render: data => (
        <div className="fcc gap-3">
          <img className="size-10 rounded-6px object-cover" src={data.img} alt="" />
          <div>
            <div className="text-sm font-500">{data.name}</div>
            <div className="text-xs text-#9CA3AF">{data.id}</div>
          </div>
        </div>
      )
    },
    {
      title: t('assete.table.valuation'),
      dataIndex: 'price',
      key: 'price',
      render: data => (
        <div className="text-sm text-#D1D5DB">
          $
          {formatNumberNoRound(data, 6, 0)}
        </div>
      )
    },
    {
      title: t('assete.table.assetType'),
      dataIndex: 'type',
      key: 'type',
      render: data => <div className="text-sm text-#D1D5DB">{dataTypeContent(data)}</div>
    },
    {
      title: t('assete.table.updateTime'),
      dataIndex: 'updateTime',
      key: 'updateTime',
      render: data => <div className="text-sm text-#D1D5DB">{dayjs(data).format('YYYY-MM-DD HH:mm')}</div>
    },
    {
      title: t('assete.table.status'),
      dataIndex: 'status',
      key: 'status',
      render: data => <div className="text-sm text-#D1D5DB">{dataStatusContent(data as number)}</div>
    },
    {
      title: t('assete.table.processor'),
      dataIndex: 'processor',
      key: 'processor',
      render: data => <div className="text-sm text-#D1D5DB">{data}</div>
    },
    {
      title: t('assete.table.action'),
      dataIndex: 'processor',
      key: 'processor',
      render: (_, record) => (
        <div className="fyc gap-4">
          <Link to="/assete/info/$id" params={{ id: record.id.toString() }}>
            <div className="text-sm text-#D1D5DB clickable">{t('assete.table.view')}</div>
          </Link>
          {record.status === 2 && <div onClick={() => openErrorDialog(record)} className="text-sm text-#CF6679 clickable">{t('assete.rejectedReason')}</div>}
        </div>
      )
    }
  ]
  return (
    // 设置表格背景
    <CommonTable data={data} columns={columns} />
  )
}

// 资产运营状态
function AssetOperatingTable({ openPayDialog, openDefaultDetailsDialog }: {
  openPayDialog: (record: any) => void
  openDefaultDetailsDialog: (record: any) => void
}) {
  const { t } = useTranslation()
  const data = [
    {
      assetInfo: {
        img: (new URL('@/assets/test/img.png', import.meta.url).href),
        name: '滨江壹号 A栋',
        id: 'PROP-2023-001'
      },
      tenant: {
        name: '张三',
        startDate: '2023-05-12',
        endDate: '2026-05-12'
      },
      price: 20203.94,
      type: 0,
      nextPayTime: '2025-05-12',
      status: 0,
      id: 0
    },
    {
      assetInfo: {
        img: (new URL('@/assets/test/img.png', import.meta.url).href),
        name: '滨江壹号 A栋',
        id: 'PROP-2023-001'
      },
      tenant: {
        name: '张三',
        startDate: '2023-05-12',
        endDate: '2026-05-12'
      },
      price: 20203.94,
      type: 0,
      nextPayTime: '2025-05-12',
      status: 1,
      id: 0
    },
    {
      assetInfo: {
        img: (new URL('@/assets/test/img.png', import.meta.url).href),
        name: '滨江壹号 A栋',
        id: 'PROP-2023-001'
      },
      tenant: {
        name: '张三',
        startDate: '2023-05-12',
        endDate: '2026-05-12'
      },
      price: 20203.94,
      type: 0,
      nextPayTime: '2025-05-12',
      status: 2,
      id: 0
    },
    {
      assetInfo: {
        img: (new URL('@/assets/test/img.png', import.meta.url).href),
        name: '滨江壹号 A栋',
        id: 'PROP-2023-001'
      },
      tenant: {
        name: '张三',
        startDate: '2023-05-12',
        endDate: '2026-05-12'
      },
      price: 20203.94,
      type: 0,
      nextPayTime: '2025-05-12',
      status: 1,
      id: 0
    }
  ]

  const dataTypeContent = (status: number) => {
    switch (status) {
      case 0:
        return t('assete.operatingStatus.paid')
      default:
        return t('assete.operatingStatus.payRent')
    }
  }
  const dataStatusContent = (status: number) => {
    let data = {} as { className: string, text: string }
    switch (status) {
      case 0:
        data = { className: 'bg-#00FF8733 text-#00FF85', text: t('assete.operatingStatus.normal') } // 正常
        break
      case 1:
        data = { className: 'bg-#B987FA33 text-#BB86FC', text: t('assete.operatingStatus.pending') } // 待缴
        break
      case 2:
        data = { className: 'bg-#CD647833 text-#CF6679', text: t('assete.operatingStatus.default') } // 违约
        break
      default:
        data = { className: 'bg-#EBB40A33 text-#FACC15', text: t('assete.operatingStatus.overdue') } // 逾期
    }

    return (
      <div className={cn(data.className, 'rounded-9999px px-2 py-1 text-xs font-400 w-fit')}>
        {data.text}
      </div>
    )
  }

  const columns: ColumnsType<typeof data[0]> = [
    {
      title: t('assete.operatingTable.assetName'),
      dataIndex: 'assetInfo',
      key: 'assetInfo',
      render: data => (
        <div className="fcc gap-3">
          <img className="size-10 rounded-6px object-cover" src={data.img} alt="" />
          <div>
            <div className="text-sm font-500">{data.name}</div>
            <div className="text-xs text-#9CA3AF">{data.id}</div>
          </div>
        </div>
      )
    },
    {
      title: t('assete.operatingTable.tenant'),
      dataIndex: 'tenant',
      key: 'tenant',
      render: data => (
        <div>
          <div className="text-sm text-#D1D5DB">{data.name}</div>
          <div className="text-xs text-#9CA3AF">
            {t('assete.operatingTable.contractPeriod')}
            :
            {(new Date(data.startDate).getFullYear())}
            {' '}
            -
            {' '}
            {(new Date(data.endDate).getFullYear())}
          </div>
        </div>
      )
    },
    {
      title: t('assete.operatingTable.monthlyRent'),
      dataIndex: 'price',
      key: 'price',
      render: data => (
        <div className="text-sm text-#D1D5DB">
          $
          {formatNumberNoRound(data, 6, 0)}
        </div>
      )
    },
    {
      title: t('assete.operatingTable.paymentStatus'),
      dataIndex: 'status',
      key: 'status',
      render: data => <div className="text-sm text-#D1D5DB">{dataStatusContent(data)}</div>
    },
    {
      title: t('assete.operatingTable.nextPaymentDate'),
      dataIndex: 'nextPayTime',
      key: 'nextPayTime',
      render: (time, content) => (
        <div className="fyc gap-1 text-sm text-#D1D5DB">
          {dayjs(time).format('YYYY-MM-DD HH:mm')}
          {
            content.status > 1 && (
              <div className={cn('text-xs ', content.status === 2 ? 'text-#CF6679' : 'text-#FACC15')}>
                (
                {t('assete.operatingTable.overdue')}
                {' '}
                {Math.round(100) + 1}
                {' '}
                {t('assete.operatingTable.days')}
                )
              </div>
            )
          }
        </div>
      )
    },
    {
      title: t('assete.operatingTable.action'),
      dataIndex: 'type',
      key: 'type',
      render: (_, content) => (
        <div className="fyc gap-4">
          <div
            onClick={() => {
              if (content.status !== 0)
                openPayDialog(content)
            }}
            className={cn('text-sm text-#D1D5DB', content.status !== 0 && 'clickable')}
          >
            {dataTypeContent(content.status)}
          </div>
          {content.status === 2 && <div onClick={() => openDefaultDetailsDialog(content)} className="text-sm text-#CF6679 clickable">{t('assete.operatingTable.defaultDetails')}</div>}
        </div>
      )
    }
  ]
  return (
    <CommonTable data={data} columns={columns} />
  )
}

// 资产错误弹窗
function AsseteErrorDialog({ visible, setVisible, message }: { visible: boolean, setVisible: (visible: boolean) => void, message: any }) {
  const { t } = useTranslation()

  return (
    <Modal
      open={visible}
      onCancel={() => setVisible(false)}
      maskClosable={false}
      width={420}
      className={cn('login-dialog [&>div>.ant-modal-content]:!bg-#171b21 b-1 b-solid  b-#1E293B', 'rounded-2')}
      centered
      title={<div className="text-lg font-600">{t('assete.rejectedReasonDialog.title')}</div>}
      footer={() => (
        <Button onClick={() => setVisible(false)} className="h-10.5 b-#00E5FF bg-#00E2FF1A px-4 text-base text-#00E5FF">
          {t('assete.rejectedReasonDialog.confirm')}
        </Button>
      )}
    >
      <div className="flex flex-col gap-4 b-b b-t b-#1E293B b-solid py-5 text-white [&>div>div:last-child]:mt-1.5 [&>div>div:first-child]:text-sm [&>div>div:last-child]:text-base [&>div>div:first-child]:text-#9CA3AF [&>div>div:last-child]:font-500">
        <div>
          <div>{t('assete.rejectedReasonDialog.assetName')}</div>
          <div>商标权 - 品牌标识</div>
        </div>
        <div>
          <div>{t('assete.rejectedReasonDialog.rejectedBy')}</div>
          <div>
            李华律师
            {message}
          </div>
        </div>
        <div>
          <div>{t('assete.rejectedReasonDialog.rejectedTime')}</div>
          <div>{dayjs().format('YYYY-MM-DD HH:mm')}</div>
        </div>
        <div>
          <div>{t('assete.rejectedReasonDialog.reason')}</div>
          <div className="b b-#1D2738 rounded-1.5 b-solid bg-#0D1117 p-4 text-400 text-sm text-#D1D5DB">
            商标注册证扫描件不清晰，缺少最新的商标续展证明文件，请补充提供高清扫描件和完整的商标续展证明。
          </div>
        </div>
      </div>
    </Modal>
  )
}
