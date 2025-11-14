import { formatNumberNoRound } from '@/utils/number'
import { Modal } from 'antd'
import dayjs from 'dayjs'

export function DefaultDetailsDialog({ visible, setVisible }:
{
  visible: boolean
  setVisible: (visible: boolean) => void
}) {
  const { t } = useTranslation()
  return (
    <Modal
      open={visible}
      onCancel={() => setVisible(false)}
      maskClosable={false}
      width={659}
      className={cn('login-dialog [&>div>.ant-modal-content]:!bg-#171b21 b-1 b-solid  b-#1E293B', 'rounded-2 ')}
      centered
      title={<div className="text-xl text-white font-600">{t('assete.defaultDetails.title')}</div>}
      footer={false}
    >
      <div className="mt-4 b-b b-t b-#1E293B py-6 text-white">
        <div className="fyc justify-between">
          <div className="fyc gap-3">
            <div className="h-12 b-2 b-#CF667A80 rounded-1.5 b-solid">
              <img className="size-full object-cover" src={(new URL('@/assets/test/img.png', import.meta.url).href)} alt="" />
            </div>
            <div>
              <div className="text-base">星光天地</div>
              <div className="text-xs text-#9CA3AF">ID: PROP-2023-003</div>
            </div>
          </div>
          <div className="rounded-999px bg-#CD647833 px-2 py-1 text-xs text-#CF6679 font-500">严重违约</div>
        </div>
        <div className="grid cols-2 mt-6 gap-6 text-sm [&>div>div:first-child]:text-#9CA3AF">
          <div>
            <div>{t('assete.defaultDetails.tenant')}</div>
            <div>环球零售连锁</div>
          </div>
          <div>
            <div>{t('assete.defaultDetails.contact')}</div>
            <div>张三（138****8776）</div>
          </div>
          <div>
            <div>{t('assete.defaultDetails.payDate')}</div>
            <div>{dayjs().format('YYYY-MM-DD')}</div>
          </div>
          <div>
            <div>{t('assete.defaultDetails.overdueDays')}</div>
            <div className="font-600">23天</div>
          </div>
          <div>
            <div>{t('assete.defaultDetails.amountPayable')}</div>
            <div>
              $
              {formatNumberNoRound(125000, 6, 2)}
            </div>
          </div>
          <div>
            <div>{t('assete.defaultDetails.defaultAmount')}</div>
            <div>
              $
              {formatNumberNoRound(185000, 6, 2)}
            </div>
          </div>
          <div>
            <div>{t('assete.defaultDetails.totalAmountPayable')}</div>
            <div className="text-xl font-bold">
              $
              {formatNumberNoRound(143750, 6, 2)}
            </div>
          </div>
        </div>
        <div className="mt-7">
          <div className="text-lg font-600">{t('assete.defaultDetails.defaultReason')}</div>
          <div className="mt-3 b b-#D1677B4D rounded-2 b-solid bg-#00000080 p-4 text-sm text-#D1D5DB">
            租户未按合同约定时间支付租金，经多次催缴仍未履行付款义务。根据合同第5.2条规定，逾期超过15天视为严重违约，需支付15%的违约金。
          </div>
        </div>
        <div className="mt-6">
          <div className="text-lg font-600">{t('assete.defaultDetails.collectionRecord')}</div>
          <div className="mt-3 flex flex-col gap-3">
            {[0, 1, 2].map(item => (
              <div key={item} className="w-full fyc gap-4">
                <div className="fccc gap-1">
                  <div className="size-2 rounded-full bg-#CF6679"></div>
                  <div className={cn('h-13 w-0.5', item < 2 ? 'bg-#374151' : 'bg-transparent')}></div>
                </div>
                <div>
                  <div className="text-base">{t('assete.defaultDetails.notice{{num}}', { num: t(`common.number.${item + 1}`) })}</div>
                  <div className="text-sm text-#9CA3AF">法务部门发送正式律师函</div>
                  <div className="mt-1 text-xs text-#6B7280">{dayjs().add(item, 'day').format('YYYY-MM-DD HH:mm')}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6">
          <div className="text-lg font-600">{t('assete.defaultDetails.handlingSuggestion')}</div>
          <div className="mt-3 flex flex-col gap-2 rounded-2 bg-#00000080 p4 text-xs text-#D1D5DB">
            <div>{t('assete.defaultDetails.contactTenant')}</div>
            <div>{t('assete.defaultDetails.prepareLegalAction')}</div>
            <div>{t('assete.defaultDetails.considerTermination')}</div>
            <div>
              {t('assete.defaultDetails.evaluateRental')}
              {' '}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
