import type { ColumnsType } from 'antd/es/table'
import { CommonTable } from '@/components/common/common-table'
import { CommonDialog } from '@/components/common/dialog/common'
import { formatTimeDiff } from '@/utils/date'
import { formatNumberNoRound } from '@/utils/number'
import { Button, Input, Select } from 'antd'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

// 节点中心首页 已移除
export function RouteComponent() {
  const { t } = useTranslation()
  const data = [
    { id: '#5754335789', user: { name: '张三', cardId: '12121344' }, conntractAddress: '0x7ab1249bE2', country: '美国', status: 0, creatTime: '2025-07-01' },
    { id: '#5754335789', user: { name: '张三', cardId: '12121344' }, conntractAddress: '0x7ab1249bE2', country: '美国', status: 0, creatTime: '2025-07-01' },
    { id: '#5754335789', user: { name: '张三', cardId: '12121344' }, conntractAddress: '0x7ab1249bE2', country: '美国', status: 0, creatTime: '2025-07-01' },
    { id: '#5754335789', user: { name: '张三', cardId: '12121344' }, conntractAddress: '0x7ab1249bE2', country: '美国', status: 1, creatTime: '2025-07-01' }
  ]

  const [assetDetailModalVisible, setAssetDetailModalVisible] = useState(false)
  const [rejectApplicationModalVisible, setRejectApplicationModalVisible] = useState(false)
  const [confirmUploadModalVisible, setConfirmUploadModalVisible] = useState(false)

  const columns: ColumnsType<typeof data[0]> = [
    {
      title: t('nodeOperator.columns.assetNumber'),
      dataIndex: 'id',
      key: 'id',
      render: (text, record) => (
        <div>
          <div className="text-base">{text}</div>
          <div className="mt-1 text-xs text-#6B7280 font-400">{formatTimeDiff(record.creatTime)}</div>
        </div>
      )
    },
    {
      title: t('nodeOperator.columns.lawyerSeal'),
      dataIndex: 'user',
      key: 'user',
      render: (_, record) => (
        <div className="fyc gap2">
          <div className="size-8 fcc b-1 b-#E5E7EB rounded-full">
            <img src={(new URL('@/assets/test/img.png', import.meta.url)).href} alt="" />
          </div>
          <div>
            <div className="text-sm">{record.user.name}</div>
            <div className="mt-1 text-xs text-#6B7280 font-400">{record.user.cardId}</div>
          </div>
        </div>
      )
    },
    {
      title: t('nodeOperator.columns.contractAddress'),
      dataIndex: 'conntractAddress',
      key: 'conntractAddress',
      render: text => (
        <div className="text-sm text-#D1D5DB font-400 clickable">
          {
            `${text.substring(0, 6)}...${text.substring(text.length - 4)}`
          }
        </div>
      )
    },
    {
      title: t('nodeOperator.columns.country'),
      dataIndex: 'country',
      key: 'country',
      render: text => (
        <div className="fyc gap-2 text-base">
          <div className="size-5 fcc">🇺🇸</div>
          <div className="text-#E5E7EB font-400">{text}</div>
        </div>
      )
    },
    {
      title: t('nodeOperator.columns.status'),
      dataIndex: 'status',
      key: 'status',
      render: text => (
        <div className={cn('px-2 py-1 rounded-9999px b text-xs w-fit ', text === 0 ? 'bg-#EBB40A33 b-#EBB3074D text-#FACC15' : 'bg-#00FF8A33 b-#00FF89 text-#00FF89')}>
          {text === 0 ? t('nodeOperator.status.pending') : t('nodeOperator.status.processing')}
        </div>
      )
    },
    {
      title: t('nodeOperator.columns.actions'),
      key: 'action',
      render: () => (
        <div className="fyc gap-2 [&>button]:h-7 [&>button]:b-#00E5FF4D [&>button]:bg-transparent [&>button]:px-2 [&>button]:text-sm [&>button]:text-#00E5FF">
          <Button onClick={() => setAssetDetailModalVisible(true)}>{t('nodeOperator.columns.viewDetails')}</Button>
          <Button onClick={() => setRejectApplicationModalVisible(true)}>{t('nodeOperator.columns.rejectApplication')}</Button>
          <Button onClick={() => setConfirmUploadModalVisible(true)}>{t('nodeOperator.columns.confirmOnChain')}</Button>
        </div>
      )
    }
  ]

  return (
    <div className="min-h-100vh bg-#0D1117 px-22 py-13">
      <div className="text-10 font-600">{t('nodeOperator.title')}</div>
      <div className="mt-2.5 text-base font-400">{t('nodeOperator.description')}</div>
      <div className="mt-6 fyc gap-3">
        <Input
          width={264}
          className="h-12.5 w-66 b-#30363D bg-#161B22 [&>input]:h-full"
          placeholder={t('nodeOperator.searchPlaceholder')}
          prefix={
            <div className="i-gg:search text-4 text-#E5E7EB"></div>
          }
        />
        <Select className="!h-12.5 !w-30 [&>input]:h-full" placeholder={t('nodeOperator.selectCountryPlaceholder')} />
        <Select className="!h-12.5 !w-30 [&>input]:h-full" placeholder={t('nodeOperator.selectTypePlaceholder')} />
      </div>
      <div className="grid cols-3 mt-8 gap-6 [&>div>div:first-child>div:first-child]:mb-2 [&>div>div:last-child]:size-12 [&>div]:fyc [&>div>div:last-child]:fcc [&>div]:justify-between [&>div]:rounded-3 [&>div>div:last-child]:rounded-full [&>div]:bg-#161B22 [&>div]:px-6 [&>div]:py-11 [&>div>div>div:first-child]:text-sm [&>div>div>div:last-child]:text-7.5 [&>div>div>div:first-child]:text-#9CA3AF [&>div>div>div:last-child]:font-700 [&>div>div:last-child>div]:!text-lg">
        <div>
          <div>
            <div>{t('nodeOperator.pendingTasks')}</div>
            <div>{formatNumberNoRound(24, 0, 0)}</div>
          </div>
          <div className="bg-#00E2FF1A">
            <div className="i-bi:clock-fill bg-#68e2fb"></div>
          </div>
        </div>
        <div>
          <div>
            <div>{t('nodeOperator.completedToday')}</div>
            <div>{formatNumberNoRound(18, 0, 0)}</div>
          </div>
          <div className="bg-#00FF891A">
            <div className="i-ep:success-filled bg-#75fb92"></div>
          </div>

        </div>
        <div>
          <div>
            <div>{t('nodeOperator.totalOnChainAssets')}</div>
            <div>{formatNumberNoRound(1284, 0, 0)}</div>
          </div>
          <div className="bg-#00E5FF">
            <div className="i-heroicons-solid:link bg-black"></div>
          </div>

        </div>
      </div>
      <CommonTable
        data={data}
        columns={columns}
        className="mt-8 !b-0"
        pagination={{
          pageSize: 10,
          total: 100
        }}
      />
      {/* 资产详情弹窗 */}
      <AssetDetailModal visible={assetDetailModalVisible} setVisible={setAssetDetailModalVisible} />
      {/* 驳回申请弹窗 */}
      <RejectApplicationModal visible={rejectApplicationModalVisible} setVisible={setRejectApplicationModalVisible} />
      {/* 确认上链弹窗 */}
      <UploadSuccessModal visible={confirmUploadModalVisible} setVisible={setConfirmUploadModalVisible} />
    </div>
  )
}

// 资产详情弹窗
export function AssetDetailModal({ visible, setVisible }: { visible: boolean, setVisible: (visible: boolean) => void }) {
  const { t } = useTranslation()
  return (
    <CommonDialog
      style={{ '--common-dialog-background': '#171b21', '--common-dialog-header-background': '#1E2328' } as any}
      open={visible}
      width={766}
      title={(
        <div>
          <div className="text-xl">
            {t('lawyerWorkbench.completedCaseDetailDialog.title')}
          </div>
          <div className="mt-1 text-base text-#9CA3AF">
            {t('lawyerWorkbench.completedCaseDetailDialog.assetNumber')}
            : ASSET-9876
          </div>
        </div>
      )}
      onCancel={() => setVisible(false)}
      closable
      footer={(
        <div className="fyc justify-end gap-3">
          <Button className="h-12.5 b-#30363D bg-transparent px-6 text-base text-#D1D5DB" onClick={() => setVisible(false)}>
            {t('lawyerWorkbench.auctionDetailDialog.close')}
          </Button>
          <Button className="h-12.5 b-#00E5FF bg-#00E5FF px-6 text-base text-black">
            {t('common.confirmOnChain')}
          </Button>
        </div>
      )}
    >
      <div className="py-6">
        <div className="flex gap-6">
          <div className="w-70% overflow-hidden rounded-2">
            <img className="h-64 w-full" src={(new URL('@/assets/test/test.png', import.meta.url)).href} alt="" />
          </div>
          <div className="flex-1 b-1 b-#30363D rounded-2 bg-#1E2328 p-5">
            <div className="text-base font-600">资产概要</div>
            <div className="mt-4 fol gap-3 [&>div>div:first-child]:text-sm [&>div>div:last-child]:text-base [&>div>div:first-child]:text-#9CA3AF">
              <div>
                <div>资产类型</div>
                <div>房地产</div>
              </div>
              <div>
                <div>评估价值</div>
                <div>
                  $
                  {formatNumberNoRound(12500000, 6, 0)}
                </div>
              </div>
              <div>
                <div>位置</div>
                <div>上海市浦东新区</div>
              </div>
              <div>
                <div>提交时间</div>
                <div>{dayjs().format('YYYY-MM-DD HH:mm')}</div>
              </div>
              <div>
                <div>状态</div>
                <div className="text-#FACC15">待上链</div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <div className="text-base font-600">资产描述</div>
          <div className="whitespace-pre-wrap b-1 b-#30363D rounded-2 bg-#1E2328 p-5">
            {`该资产位于上海市浦东新区核心商业区，是一栋现代化写字楼的第15层整层，建筑面积约1,200平方米。建筑采用玻璃幕墙设计，配备高速电梯和先进的安防系统。周边交通便利，地铁2号线和7号线交汇处，距离浦东国际机场仅30分钟车程。\n
目前该物业已出租给一家跨国科技公司，剩余租期3年，年租金回报率稳定在4.5%。评估报告显示，该区域商业地产价格在过去5年平均年增长率为6.2%，具有良好的保值增值潜力。`}
          </div>
        </div>
        <div className="grid cols-2 mt-8 gap-6">
          <div>
            <div className="mb-4 text-base font-600">{t('lawyerWorkbench.completedCaseDetailDialog.lawyerInfo')}</div>
            <div className="b b-#30363D rounded-2 bg-#1E2328 p-5">
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
            <div className="mb-4 text-base font-600">{t('lawyerWorkbench.completedCaseDetailDialog.evaluationReportSummary')}</div>
            <div className="b b-#30363D rounded-2 bg-#1E2328 p-5">
              <div className="fol gap-2 text-base [&>div]:fol [&>div]:justify-between [&>div]:gap-2 [&>div>div:first-child]:text-#9CA3AF">
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

// 驳回申请弹窗
export function RejectApplicationModal({ visible, setVisible }: { visible: boolean, setVisible: (visible: boolean) => void }) {
  const { t } = useTranslation()
  return (
    <CommonDialog
      style={{ '--common-dialog-background': '#171b21', '--common-dialog-header-background': '#1E2328' } as any}
      open={visible}
      width={446}
      title={(
        <div>
          <div className="text-xl font-600">{t('nodeOperator.rejectApplicationModal.title')}</div>
          <div className="mt-1 text-base text-#9CA3AF font-400">{t('nodeOperator.rejectApplicationModal.description')}</div>
        </div>
      )}
      onCancel={() => setVisible(false)}
      closable
      footer={null}
    >
      <div className="py-6">
        <div className="fyc gap-2 text-base">
          <div className="text-#9CA3AF font-400">{t('lawyerWorkbench.completedCaseDetailDialog.assetNumber')}</div>
          <div>ASSET-9876</div>
        </div>
        <div className="mt-1.5">{t('nodeOperator.rejectApplicationModal.selectRejectionReason')}</div>
        <Select className="mt-2" placeholder={t('nodeOperator.rejectApplicationModal.selectRejectionReasonPlaceholder')} />
        <div className="mt-6">{t('nodeOperator.rejectApplicationModal.detailedExplanation')}</div>
        <Input.TextArea className="mt-2" placeholder={t('nodeOperator.rejectApplicationModal.detailedExplanationPlaceholder')} autoSize={{ minRows: 6, maxRows: 6 }} />
        <div className="mt-6 fyc gap-3">
          <Button onClick={() => setVisible(false)} className="h-12.5 flex-1 b-#30363D bg-transparent px-4 text-base text-#D1D5DB font-400">{t('common.cancel')}</Button>
          <Button className="h-12.5 flex-1 b-#EF4444 bg-#EF4444 px-4 text-base text-white font-600">{t('assete.assetStatus.rejected')}</Button>
        </div>
      </div>
    </CommonDialog>
  )
}

// 上链成功弹窗
export function UploadSuccessModal({ visible, setVisible }: { visible: boolean, setVisible: (visible: boolean) => void }) {
  const { t } = useTranslation()
  const asseteData = [
    { title: t('nodeOperator.uploadSuccessModal.assetNumber'), value: 'ASSET-9876' },
    { title: t('nodeOperator.uploadSuccessModal.lawyerSeal'), value: '张明律师' },
    { title: t('nodeOperator.uploadSuccessModal.countryRegion'), value: '中国', img: '' },
    { title: t('nodeOperator.uploadSuccessModal.assetHash'), value: '45d1CD...8EF6', type: 'hash' },
    { title: t('nodeOperator.uploadSuccessModal.transactionHash'), value: '45d1CD...8EF6', type: 'hash' }
  ]
  return (
    <CommonDialog
      style={{ '--common-dialog-background': '#171b21', '--common-dialog-header-background': '#1E2328' } as any}
      open={visible}
      onCancel={() => setVisible(false)}
      footer={null}
      closable
      width={446}
      title={(
        <div>
          <div className="text-xl font-600">{t('nodeOperator.uploadSuccessModal.title')}</div>
          <div className="mt-1 text-base text-#9CA3AF font-400">{t('nodeOperator.uploadSuccessModal.description')}</div>
        </div>
      )}
    >
      <div className="fol gap-2 py-6 pb-20">
        {
          asseteData.map((item, index) => (
            <div key={index} className="fyc justify-between gap-2 text-base">
              <div className="text-#9CA3AF font-400">{item.title}</div>
              <div className={cn('fyc gap-1 text-white', item.type === 'hash' && 'clickable hover:underline')}>
                {item.img && <div>🇨🇳</div>}
                <div>
                  {' '}
                  {item.value}
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </CommonDialog>
  )
}
