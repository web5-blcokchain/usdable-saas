import type { AssetsOperationData, RentPaymentDetails } from '@/api/assetsApi'
import { CommonDialog } from '@/components/common/dialog/common'
import { formatNumberNoRound } from '@/utils/number'
import { Spin } from 'antd'
import dayjs from 'dayjs'

export function DefaultDetailsDialog({
  visible,
  setVisible,
  data,
  loading
}: {
  visible: boolean
  setVisible: (visible: boolean) => void
  data: {
    asset: AssetsOperationData
    payment?: RentPaymentDetails
  }
  loading: boolean
}) {
  const { t } = useTranslation()
  return (
    <CommonDialog
      open={visible}
      onCancel={() => setVisible(false)}
      maskClosable={false}
      width={659}
      className={cn(
        'login-dialog [&>div>.ant-modal-content]:!bg-#171b21 b-1 b-solid  b-#1E293B',
        'rounded-2 '
      )}
      centered
      title={(
        <div className="text-xl text-white font-600">
          {t('assete.defaultDetails.title')}
        </div>
      )}
      footer={false}
      closable
    >
      <Spin spinning={loading}>
        <div className="mt-4 py-6 text-white">
          <div className="fyc justify-between">
            <div className="fyc gap-3">
              <div className="h-12 b-2 b-#CF667A80 rounded-1.5 b-solid">
                <img
                  className="size-full object-cover"
                  src={new URL('@/assets/test/img.png', import.meta.url).href}
                  alt=""
                />
              </div>
              <div>
                <div className="text-base">{data?.asset?.name}</div>
                <div className="text-xs text-#9CA3AF">
                  ID:
                  {data?.asset?.code}
                </div>
              </div>
            </div>
            <div className="rounded-999px bg-#CD647833 px-2 py-1 text-xs text-#CF6679 font-500">
              {t(
                `common.assetPropertyStatus.${
                  data?.asset?.property_status < 0
                  || data?.asset?.property_status > 8
                    ? 'other'
                    : data?.asset?.property_status || 0
                }`
              )}
            </div>
          </div>
          {/* TODO */}
          <div className="grid cols-2 mt-6 gap-6 text-sm [&>div>div:first-child]:text-#9CA3AF">
            {/* <div>
            <div>{t('assete.defaultDetails.tenant')}</div>
            <div>环球零售连锁</div>
          </div> */}
            {/* <div>
            <div>{t('assete.defaultDetails.contact')}</div>
            <div>张三（138****8776）</div>
          </div> */}
            <div>
              <div>{t('assete.defaultDetails.payDate')}</div>
              <div>
                {dayjs(data?.asset?.next_rent_date || '').format('YYYY-MM-DD')}
              </div>
            </div>
            <div>
              <div>{t('assete.defaultDetails.overdueDays')}</div>
              <div className="font-600">
                {data?.asset?.breaking_contract_number || 1}
                {t('assete.operatingTable.days')}
              </div>
            </div>
            <div>
              <div>{t('assete.defaultDetails.amountPayable')}</div>
              <div>
                $
                {formatNumberNoRound(
                  data?.asset?.monthly_rent
                  || 0
                  * Math.max(
                    Number.parseInt(
                      `${data?.asset?.breaking_contract_number / 30}`
                    ),
                    1
                  ),
                  6,
                  2
                )}
              </div>
            </div>
            {/* <div>
            <div>{t('assete.defaultDetails.defaultAmount')}</div>
            <div>
              $
              {formatNumberNoRound(185000, 6, 2)}
            </div>
          </div> */}
            <div></div>
            <div>
              <div>{t('assete.defaultDetails.totalAmountPayable')}</div>
              <div className="text-xl font-bold">
                $
                {formatNumberNoRound(
                  data?.asset?.monthly_rent
                  || 0
                  * Math.max(
                    Number.parseInt(
                      `${data?.asset?.breaking_contract_number / 30}`
                    ),
                    1
                  ),
                  6,
                  2
                )}
              </div>
            </div>
          </div>
          <div className="mt-7">
            <div className="text-lg font-600">
              {t('assete.defaultDetails.defaultReason')}
            </div>
            <div className="mt-3 b b-#D1677B4D rounded-2 b-solid bg-#00000080 p-4 text-sm text-#D1D5DB">
              {t('common.haveDefaulted')}
            </div>
          </div>
          <div className="mt-6">
            <div className="text-lg font-600">
              {/* TODO 违约内容 */}
              {t('assete.defaultDetails.collectionRecord')}
            </div>
            <div className="mt-3 flex flex-col gap-3">
              {data.payment?.payment_reminder_records.map((item, index) => (
                <div key={item.id} className="w-full fyc gap-4">
                  <div className="fccc gap-1">
                    <div className="size-2 rounded-full bg-#CF6679"></div>
                    <div
                      className={cn(
                        'h-13 w-0.5',
                        index < 2 ? 'bg-#374151' : 'bg-transparent'
                      )}
                    >
                    </div>
                  </div>
                  <div>
                    <div className="text-base">
                      {item.reminder_title
                        || t('assete.defaultDetails.notice{{num}}', {
                          num: t(`common.number.${index + 1}`)
                        })}
                    </div>
                    <div className="text-sm text-#9CA3AF">
                      {item.reminder_content}
                    </div>
                    <div className="mt-1 text-xs text-#6B7280">
                      {dayjs(item.reminder_time * 1000).format(
                        'YYYY-MM-DD HH:mm'
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {data.payment?.payment_reminder_records?.length === 0 && (
                <div>
                  {t('common.noContent')}
                </div>
              )}
            </div>
          </div>
          <div className="mt-6">
            <div className="text-lg font-600">
              {t('assete.defaultDetails.handlingSuggestion')}
            </div>
            <div className="mt-3 flex flex-col gap-2 rounded-2 bg-#00000080 p4 text-xs text-#D1D5DB">
              {data?.payment?.suggestions?.map((item) => {
                return <div key={item}>{item}</div>
              })}
              {/* <div>{t('assete.defaultDetails.contactTenant')}</div>
            <div>{t('assete.defaultDetails.prepareLegalAction')}</div>
            <div>{t('assete.defaultDetails.considerTermination')}</div>
            <div>{t('assete.defaultDetails.evaluateRental')} </div> */}
            </div>
          </div>
        </div>
      </Spin>
    </CommonDialog>
  )
}
