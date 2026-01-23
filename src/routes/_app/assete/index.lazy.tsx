import type { AssetsOperationData, SubmissionData } from '@/api/assetsApi'
import type { ColumnsType } from 'antd/es/table'
import assetsApi from '@/api/assetsApi'
import { CommonTable } from '@/components/common/common-table'
import { CommonDialog } from '@/components/common/dialog/common'
import { ASSET_STATUS, RISK_STATUS } from '@/enums/asset'
import { formatNumberNoRound } from '@/utils/number'
import { addHttpsPrefix } from '@/utils/url'
import { useQuery } from '@tanstack/react-query'
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

  const { data: assetStatistics } = useQuery({
    queryKey: ['getSubmissionStatistics'],
    queryFn: async () => {
      const res = await assetsApi.getSubmissionStatistics()
      return res.data
    }
  })

  // 资产上链状态
  const assetStatus = useMemo(() => {
    return [
      {
        title: 'assete.assetStatus.totalOnChain',
        num: `$${formatNumberNoRound(
          assetStatistics?.total_on_chain || 0,
          6,
          0
        )}`,
        icon: (
          <div className="size-10 fcc rounded-full bg-#CD647833">
            <div className="i-ic:round-warning text-4 text-#c26c7a"></div>
          </div>
        )
      },
      {
        title: 'assete.assetStatus.verifying',
        num: assetStatistics?.total_on_chain || 0,
        icon: (
          <div className="size-10 fcc rounded-full bg-#2E2F1F">
            <img
              className="h-4"
              src={
                new URL('@/assets/icon/assete/icon-2.png', import.meta.url).href
              }
              alt=""
            />
          </div>
        )
      },
      {
        title: 'assete.assetStatus.onChainSuccess',
        num: assetStatistics?.on_chain || 0,
        icon: (
          <div className="size-10 fcc rounded-full bg-#00FF8733">
            <div className="i-ep:success-filled text-4 text-#75fb92"></div>
          </div>
        )
      },
      {
        title: 'assete.assetStatus.onChainFailed',
        num: assetStatistics?.failed || 0,
        icon: (
          <div className="size-10 fcc rounded-full bg-#CD647833">
            <div className="i-ic:round-warning text-4 text-#c26c7a"></div>
          </div>
        )
      }
    ]
  }, [assetStatistics])

  const { data: assetsOperationSummary } = useQuery({
    queryKey: ['getAssetsOperationSummary'],
    queryFn: async () => {
      const res = await assetsApi.getAssetsOperationSummary()
      return res.data
    }
  })

  // 资产运营状态
  const assetOperatingStatus = useMemo(() => {
    return [
      {
        title: 'assete.assetOperatingStatus.monthlyRent',
        num: `$${formatNumberNoRound(
          assetsOperationSummary?.monthly_due_amount || 0,
          6,
          0
        )}`,
        icon: (
          <div className="size-10 fcc rounded-full bg-#00E6FF33">
            <div className="i-ic:baseline-attach-money text-4 text-#68e2fb"></div>
          </div>
        )
      },
      {
        title: 'assete.assetOperatingStatus.pendingProperties',
        num: assetsOperationSummary?.pending_properties || 0,
        icon: (
          <div className="size-10 fcc rounded-full bg-#B987FA33">
            <img
              className="h-4"
              src={
                new URL('@/assets/icon/assete/hourglass.png', import.meta.url)
                  .href
              }
              alt=""
            />
          </div>
        )
      },
      {
        title: 'assete.assetOperatingStatus.defaultAssets',
        num: assetsOperationSummary?.default_properties || 0,
        icon: (
          <div className="size-10 fcc rounded-full bg-#CD647833">
            <div className="i-si:warning-fill text-4 text-#c26c7a"></div>
          </div>
        )
      }
    ]
  }, [assetsOperationSummary])

  const [asseteErrorDialogVisible, setAsseteErrorDialogVisible] = useState({
    value: false,
    data: {} as SubmissionData
  })
  // 缴纳租金
  const [payRentDialogVisible, setPayRentDialogVisible] = useState({
    value: false,
    data: {} as AssetsOperationData
  })
  // 违约详情
  const [defaultDetailsDialogVisible, setDefaultDetailsDialogVisible]
    = useState({
      value: false,
      data: {} as AssetsOperationData
    })
  const [searchText, setSearchText] = useState('')
  const [selectAssetId, setSelectAssetId] = useState('')
  // 获取缴纳租金详情
  const { data: rentPaymentDetails, isFetching: paymentLoading } = useQuery({
    queryKey: ['getRentPaymentDetails', selectAssetId],
    queryFn: async () => {
      const res = await assetsApi.getRentPaymentDetails({
        submission_id: selectAssetId
      })
      return res.data
    },
    enabled: !!selectAssetId
  })

  function onChangeDialog(data: AssetsOperationData, type: number) {
    setSelectAssetId(data?.submission_id.toString())
    switch (type) {
      case 1:
        setPayRentDialogVisible({
          value: true,
          data
        })
        break
      case 2:
        setDefaultDetailsDialogVisible({
          value: true,
          data
        })
        break
    }
  }
  const [assetOperatingReload, setAssetOperatingReload] = useState(0)
  function payRentSuccess() {
    setAssetOperatingReload(prev => prev + 1)
    setPayRentDialogVisible(prev => ({
      value: false,
      data: prev.data
    }))
  }

  useEffect(() => {
    return () => {
      setPayRentDialogVisible({
        value: false,
        data: {} as AssetsOperationData
      })
      setDefaultDetailsDialogVisible({
        value: false,
        data: {} as AssetsOperationData
      })
      setAsseteErrorDialogVisible({
        value: false,
        data: {} as SubmissionData
      })
    }
  }, [])

  return (
    <div className="bg-#000000 px-22 pb-15 pt-8 max-md:px-4">
      <div className="fyc justify-between">
        <div className="text-2xl font-600">
          {t('assete.assetOnChainStatus')}
        </div>
        <Link to="/assete/addAssete">
          <Button className="h-10.5 fcc gap-2 b b-#00E5FF b-solid bg-#00E2FF1A px-4.5 text-#00E5FF">
            <div className="i-tabler:plus text-4 text-#00E5FF"></div>
            <div>{t('assete.addAssetBtn')}</div>
          </Button>
        </Link>
      </div>
      {/* 资产上链状态 */}
      <div className="grid cols-4 mt-6 gap-4 max-md:cols-1">
        {assetStatus.map(item => (
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
        ))}
      </div>
      {/* 资产上链明细 */}
      <div className="mt-8 rounded-2 bg-#161B22 backdrop-blur-4">
        <div className="fyc justify-between p-4">
          <div className="text-lg font-bold">
            {t('assete.assetOnChainDetails')}
          </div>
          <Input
            className="w-64 max-md:w-50% [&>input]:!h-6"
            placeholder={t('assete.searchAsset')}
            prefix={<div className="i-gg:search text-4 text-#E5E7EB"></div>}
            onKeyUp={(e) => {
              // 按下回车键
              if (e.key === 'Enter') {
                setSearchText(e.currentTarget?.value)
              }
            }}
          />
        </div>
        <AssetsTable
          openErrorDialog={data =>
            setAsseteErrorDialogVisible({ value: true, data })}
          searchText={searchText}
        />
      </div>
      <div className="mt-8">
        <div className="text-2xl font-600">
          {t('assete.assetOperatingStatusTitle')}
        </div>
        <div className="grid cols-4 mt-6 gap-4 max-md:cols-1">
          {assetOperatingStatus.map(item => (
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
          ))}
        </div>
        <div className="mt-8 rounded-2 bg-#161B22 backdrop-blur-4">
          <div className="fyc justify-between p-4">
            <div className="text-lg font-bold">
              {t('assete.propertyOperatingDetails')}
            </div>
          </div>
          <AssetOperatingTable
            reload={assetOperatingReload}
            openPayDialog={data => onChangeDialog(data, 1)}
            openDefaultDetailsDialog={data => onChangeDialog(data, 2)}
          />
        </div>
      </div>
      {/* 驳回原因 */}
      <AsseteErrorDialog
        visible={asseteErrorDialogVisible.value}
        setVisible={(val) => {
          setAsseteErrorDialogVisible(pre => ({ value: val, data: pre.data }))
        }}
        message={asseteErrorDialogVisible.data}
      />
      <PayRentDialog
        payRentSuccess={payRentSuccess}
        visible={payRentDialogVisible.value}
        data={{
          asset: payRentDialogVisible.data,
          payment: rentPaymentDetails
        }}
        loading={paymentLoading}
        setVisible={val =>
          setPayRentDialogVisible(pre => ({ value: val, data: pre.data }))}
      />
      {/* 违约详情 */}
      <DefaultDetailsDialog
        visible={defaultDetailsDialogVisible.value}
        data={{
          asset: defaultDetailsDialogVisible.data,
          payment: rentPaymentDetails
        }}
        loading={paymentLoading}
        setVisible={val =>
          setDefaultDetailsDialogVisible(pre => ({
            value: val,
            data: pre.data
          }))}
      />
    </div>
  )
}

// 资产上链明细
function AssetsTable({
  openErrorDialog,
  searchText
}: {
  openErrorDialog: (message: any) => void
  searchText: string
}) {
  const { t, i18n } = useTranslation()
  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 10 })

  const { data, isFetching: isDataLoading } = useQuery({
    queryKey: ['getSubmissionList', pageInfo, searchText],
    queryFn: async () => {
      const res = await assetsApi.getSubmissionList({
        ...pageInfo,
        keyword: searchText
      })
      return res.data
    }
  })

  const { data: assetType } = useQuery({
    queryKey: ['getAssetType'],
    queryFn: async () => {
      const res = await assetsApi.getAssetType()
      return res.data
    }
  })

  function findAssetType(type: number) {
    return assetType?.find(item => item.id === type) || null
  }
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

  const columns: ColumnsType<SubmissionData> = [
    {
      title: t('assete.table.assetName'),
      dataIndex: 'asset_name',
      key: 'asset_name',
      render: (_, record) => (
        <div className="fyc gap-3">
          <img
            className="size-10 rounded-6px object-cover"
            src={addHttpsPrefix(record.asset_image[0])}
            alt=""
          />
          <div>
            <div className="text-sm font-500">{record.asset_name}</div>
            <div className="text-xs text-#9CA3AF">{record.code}</div>
          </div>
        </div>
      )
    },
    {
      title: t('assete.table.valuation'),
      dataIndex: 'valuation',
      key: 'valuation',
      render: data => (
        <div className="text-sm text-#D1D5DB">
          $
          {formatNumberNoRound(data, 6, 0)}
        </div>
      )
    },
    {
      title: t('assete.table.assetType'),
      dataIndex: 'asset_type',
      key: 'asset_type',
      render: data => (
        <div className="text-sm text-#D1D5DB">
          {i18n.language === 'zh'
            ? findAssetType(data)?.name_zh_cn
            : i18n.language === 'en'
              ? findAssetType(data)?.name_en
              : findAssetType(data)?.name_ja}
        </div>
      )
    },
    {
      title: t('assete.table.updateTime'),
      dataIndex: 'update_time',
      key: 'update_time',
      render: data => (
        <div className="text-sm text-#D1D5DB">
          {dayjs(data).format('YYYY-MM-DD HH:mm')}
        </div>
      )
    },
    {
      title: t('assete.table.status'),
      dataIndex: 'status',
      key: 'status',
      render: (data, record) => (
        <div className="text-sm text-#D1D5DB">
          {dataStatusContent(data, record.status_label)}
        </div>
      )
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
            <div className="text-sm text-#D1D5DB clickable">
              {t('assete.table.view')}
            </div>
          </Link>
          {record.status === ASSET_STATUS.LAWYER_REJECTED && (
            <div
              onClick={() => openErrorDialog(record)}
              className="text-sm text-#CF6679 clickable"
            >
              {t('assete.rejectedReason')}
            </div>
          )}
        </div>
      )
    }
  ]
  return (
    // 设置表格背景
    <CommonTable
      data={data?.list || []}
      tableProps={{ loading: isDataLoading }}
      columns={columns}
      pagination={{
        pageSize: pageInfo.pageSize,
        total: data?.count || 0,
        current: pageInfo.page,
        onChange: (page, pageSize) => {
          setPageInfo(prev => ({ ...prev, page, pageSize }))
        }
      }}
    />
  )
}

// 资产运营状态
function AssetOperatingTable({
  openPayDialog,
  openDefaultDetailsDialog,
  reload
}: {
  // 支付房租
  openPayDialog: (record: AssetsOperationData) => void
  openDefaultDetailsDialog: (record: AssetsOperationData) => void
  reload: number
}) {
  const { t } = useTranslation()
  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 10 })

  const { data, isFetching: isDataLoading } = useQuery({
    queryKey: ['getAssetsOperationList', pageInfo, reload],
    queryFn: async () => {
      const res = await assetsApi.getAssetsOperationList({
        ...pageInfo
      })
      return res.data
    }
  })

  const dataTypeContent = (status: number) => {
    switch (status) {
      case 0:
        return t('assete.operatingStatus.paid')
      default:
        return t('assete.operatingStatus.payRent')
    }
  }
  const dataStatusContent = (status: string, _text: string) => {
    let data = {} as { className: string, text: string }
    switch (status) {
      case '1':
        data = {
          className: 'bg-#00FF8733 text-#00FF85',
          text: t('assete.operatingStatus.normal')
        } // 正常
        break
      case '2':
        data = {
          className: 'bg-#B987FA33 text-#BB86FC',
          text: t('assete.operatingStatus.pending')
        } // 待缴
        break
      case '3':
        data = {
          className: 'bg-#CD647833 text-#CF6679',
          text: t('assete.operatingStatus.overdue')
        } // 逾期
        break
      default:
        data = {
          className: 'bg-#EBB40A33 text-#FACC15',
          text: t('common.assetRentStatus.0')
        } // 未知
    }

    return (
      <div
        className={cn(
          data.className,
          'rounded-9999px px-2 py-1 text-xs font-400 w-fit'
        )}
      >
        {data.text}
      </div>
    )
  }
  const [
    propertyOperatingStatusDetailsDialogVisible,
    setPropertyOperatingStatusDetailsDialogVisible
  ] = useState({
    visible: false,
    data: {} as AssetsOperationData
  })

  useEffect(() => {
    // 全局事件总线监听资产运营状态详情弹窗关闭
    return () => {
      setPropertyOperatingStatusDetailsDialogVisible({
        visible: false,
        data: {} as AssetsOperationData
      })
    }
  }, [])

  const columns: ColumnsType<AssetsOperationData> = [
    {
      title: t('assete.operatingTable.assetName'),
      dataIndex: 'assetInfo',
      key: 'assetInfo',
      render: (_, record) => (
        <div className="fyc gap-3">
          <img
            className="size-10 rounded-6px object-cover"
            src={addHttpsPrefix(record?.image_urls || '')}
            alt=""
          />
          <div>
            <div className="text-sm font-500">{record?.name}</div>
            <div className="text-xs text-#9CA3AF">{record?.code}</div>
          </div>
        </div>
      )
    },
    {
      title: t('assete.operatingTable.tenant'),
      dataIndex: 'tenant',
      key: 'tenant',
      render: (_, record) => (
        <div>
          <div className="text-sm text-#D1D5DB">{record?.name}</div>
          {/* <div className="text-xs text-#9CA3AF">
            {t('assete.operatingTable.contractPeriod')}
            :
            {new Date(data?.startDate || '').getFullYear()}
            {' '}
            -
            {' '}
            {new Date(data?.endDate || '').getFullYear()}
          </div> */}
        </div>
      )
    },
    {
      title: t('assete.operatingTable.monthlyRent'),
      dataIndex: 'monthly_rent',
      key: 'monthly_rent',
      render: data => (
        <div className="text-sm text-#D1D5DB">
          $
          {formatNumberNoRound(data || 0, 6, 0)}
        </div>
      )
    },
    {
      title: t('assete.operatingTable.paymentStatus'),
      dataIndex: 'rent_status',
      key: 'rent_status',
      render: data => (
        <div className="text-sm text-#D1D5DB">
          {dataStatusContent(data?.key, data?.label)}
        </div>
      )
    },
    {
      title: t('assete.operatingTable.nextPaymentDate'),
      dataIndex: 'next_rent_date',
      key: 'next_rent_date',
      render: (time, content) => (
        <div className="fyc gap-1 text-sm text-#D1D5DB">
          {dayjs(time || '').format('YYYY-MM-DD')}
          {content?.status >= ASSET_STATUS.LAWYER_REJECTED && (
            <div
              className={cn(
                'text-xs ',
                content?.status === 3 ? 'text-#CF6679' : 'text-#FACC15'
              )}
            >
              (
              {t('assete.operatingTable.overdue')}
              {' '}
              {Math.max(content.breaking_contract_number, 1)}
              {' '}
              {t('assete.operatingTable.days')}
              )
            </div>
          )}
        </div>
      )
    },
    {
      title: t('assete.operatingTable.action'),
      key: 'type',
      render: (_, content) => (
        <div className="fyc gap-4">
          <div
            onClick={() => {
              if (content?.status !== 0)
                openPayDialog(content)
            }}
            className={cn(
              'text-sm text-#D1D5DB',
              content?.status !== 0 && 'clickable'
            )}
          >
            {dataTypeContent(content?.status >= 2 ? 1 : 0)}
          </div>
          {content?.status === 3 && (
            <div
              onClick={() => openDefaultDetailsDialog(content)}
              className="text-sm text-#CF6679 clickable"
            >
              {t('assete.operatingTable.defaultDetails')}
            </div>
          )}
          <div
            className="clickable"
            onClick={() =>
              setPropertyOperatingStatusDetailsDialogVisible({
                visible: true,
                data: content
              })}
          >
            {t('assete.table.view')}
          </div>
        </div>
      )
    }
  ]

  return (
    <div>
      <CommonTable
        data={data?.list}
        columns={columns}
        tableProps={{ loading: isDataLoading }}
        pagination={{
          pageSize: pageInfo.pageSize,
          total: data?.count || 0,
          current: pageInfo.page,
          onChange: (page, pageSize) => {
            setPageInfo(prev => ({ ...prev, page, pageSize }))
          }
        }}
      />
      <PropertyOperatingStatusDetailsDialog
        visible={propertyOperatingStatusDetailsDialogVisible.visible}
        data={propertyOperatingStatusDetailsDialogVisible.data}
        setVisible={visible =>
          setPropertyOperatingStatusDetailsDialogVisible(pre => ({
            visible,
            data: pre.data
          }))}
      />
    </div>
  )
}

// 资产错误弹窗
function AsseteErrorDialog({
  visible,
  setVisible,
  message
}: {
  visible: boolean
  setVisible: (visible: boolean) => void
  message: SubmissionData
}) {
  const { t } = useTranslation()

  return (
    <Modal
      open={visible}
      onCancel={() => setVisible(false)}
      maskClosable={false}
      width={420}
      className={cn(
        'login-dialog [&>div>.ant-modal-content]:!bg-#171b21 b-1 b-solid  b-#1E293B',
        'rounded-2'
      )}
      centered
      title={(
        <div className="text-lg font-600">
          {t('assete.rejectedReasonDialog.title')}
        </div>
      )}
      footer={() => (
        <Button
          onClick={() => setVisible(false)}
          className="h-10.5 b-#00E5FF bg-#00E2FF1A px-4 text-base text-#00E5FF"
        >
          {t('assete.rejectedReasonDialog.confirm')}
        </Button>
      )}
    >
      <div className="flex flex-col gap-4 b-b b-t b-#1E293B b-solid py-5 text-white [&>div>div:last-child]:mt-1.5 [&>div>div:first-child]:text-sm [&>div>div:last-child]:text-base [&>div>div:first-child]:text-#9CA3AF [&>div>div:last-child]:font-500">
        <div>
          <div>{t('assete.rejectedReasonDialog.assetName')}</div>
          <div>{message.asset_name}</div>
        </div>
        <div>
          <div>{t('assete.rejectedReasonDialog.rejectedBy')}</div>
          <div>{message.processor}</div>
        </div>
        <div>
          <div>{t('assete.rejectedReasonDialog.rejectedTime')}</div>
          <div>{dayjs(message.update_time).format('YYYY-MM-DD HH:mm')}</div>
        </div>
        <div>
          <div>{t('assete.rejectedReasonDialog.reason')}</div>
          <div className="b b-#1D2738 rounded-1.5 b-solid bg-#0D1117 p-4 text-4 text-sm text-#D1D5DB">
            {message.review_remark}
          </div>
        </div>
      </div>
    </Modal>
  )
}

// 房产运营状态明细详情弹窗
function PropertyOperatingStatusDetailsDialog({
  visible,
  setVisible,
  data
}: {
  visible: boolean
  setVisible: (visible: boolean) => void
  data: AssetsOperationData
}) {
  const { t } = useTranslation()
  return (
    <CommonDialog
      open={visible}
      onCancel={() => setVisible(false)}
      maskClosable={false}
      width={894}
      className={cn(
        'login-dialog [&>div>.ant-modal-content]:!bg-#171b21 b-1 b-solid  b-#1E293B',
        'rounded-2'
      )}
      centered
      title={(
        <div className="text-lg font-600">
          {t('assete.propertyOperatingStatusDetailsDialog.title')}
        </div>
      )}
      footer={false}
      closable
    >
      <div className="fol gap-6 py-6">
        <img
          src={addHttpsPrefix(data?.image_urls || '')}
          className="h-64 w-full rounded-2"
          alt=""
        />
        <div className="grid cols-2 gap-6 [&>div>div:last-child]:mt-1 [&>div>div:first-child]:text-sm [&>div>div:last-child]:text-lg [&>div>div:first-child]:text-#9CA3AF [&>div>div:last-child]:font-500">
          <div>
            <div>
              {t('assete.propertyOperatingStatusDetailsDialog.propertyName')}
            </div>
            <div>{data?.name}</div>
          </div>
          <div>
            <div>
              {t('assete.propertyOperatingStatusDetailsDialog.location')}
            </div>
            <div>{data?.address}</div>
          </div>
          <div>
            <div>
              {t(
                'assete.propertyOperatingStatusDetailsDialog.managementMethod'
              )}
            </div>
            <div>{data?.hosting_method || '-'}</div>
          </div>
          <div>
            <div>{t('assete.propertyOperatingStatusDetailsDialog.rent')}</div>
            <div>
              $
              {formatNumberNoRound(data?.monthly_rent || 0, 6, 0)}
              /
              {t('common.month')}
            </div>
          </div>
          <div>
            <div>{t('assete.propertyOperatingStatusDetailsDialog.status')}</div>
            <div
              className={cn(
                'fyc gap-2',
                data.property_status === RISK_STATUS.NORMAL
                  ? 'text-#00FF85'
                  : 'text-#FF4D4F'
              )}
            >
              <div
                className={cn(
                  'size-2 rounded-full',
                  data.property_status === RISK_STATUS.NORMAL
                    ? 'bg-#00FF85'
                    : 'bg-#FF4D4F'
                )}
              >
              </div>
              <div></div>
              {t(
                `common.assetPropertyStatus.${
                  data?.property_status < RISK_STATUS.NORMAL
                  || data?.property_status > RISK_STATUS.AUCTION_FAILURE
                    ? 'other'
                    : data?.property_status || 'other'
                }`
              )}
            </div>
          </div>
          <div>
            <div>
              {t('assete.propertyOperatingStatusDetailsDialog.nextPayment')}
            </div>
            <div>{dayjs(data?.next_rent_date || '').format('MM-DD')}</div>
          </div>
        </div>
        <div>
          <div className="text-sm text-#9CA3AF font-400">
            {t(
              'assete.propertyOperatingStatusDetailsDialog.propertyDescription'
            )}
          </div>
          <div className="mt-1 text-base text-#D1D5DB font-400">
            {data?.property_description}
          </div>
        </div>
      </div>
    </CommonDialog>
  )
}
