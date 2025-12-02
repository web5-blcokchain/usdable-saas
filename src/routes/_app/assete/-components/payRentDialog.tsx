import type { AssetsOperationData, RentPaymentDetails } from '@/api/assetsApi'
import { CommonDialog } from '@/components/common/dialog/common'
import { formatNumberNoRound } from '@/utils/number'
import { Button, Radio, Spin } from 'antd'
import dayjs from 'dayjs'

export function PayRentDialog({
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
  const copyText = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success(t('common.copySuccess'))
  }

  return (
    <CommonDialog
      open={visible}
      onCancel={() => setVisible(false)}
      maskClosable={false}
      width={480}
      className={cn(
        'login-dialog [&>div>.ant-modal-content]:!bg-#171b21 b-1 b-solid  b-#1E293B',
        'rounded-2'
      )}
      centered
      title={
        <div className="text-lg font-600">{t('assete.payRent.title')}</div>
      }
      footer={() => (
        <div className="fyc justify-end gap-3">
          <Button
            onClick={() => setVisible(false)}
            className="h-10.5 b-#00E5FF b-#374151 bg-#000000 px-4 text-base text-#D1D5DB"
          >
            {t('common.cancel')}
          </Button>
          <Button
            disabled={loading}
            // loading={isPending}
            onClick={() => setVisible(false)}
            className="h-10.5 b-#00E5FF bg-#00E2FF1A px-4 text-base text-#00E5FF"
          >
            {t('common.surePay')}
          </Button>
        </div>
      )}
    >
      <Spin spinning={loading}>
        <div className="py-4">
          <div className="rounded-2 bg-#00000080 p-4">
            <div className="fyc gap-2">
              <div className="size-12 rounded-1.5">
                <img
                  className="szie-full object-cover"
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
            <div className="grid cols-2 mt-4 gap4 text-sm [&>div>div:last-child]:text-base [&>div>div:first-child]:text-#9CA3AF">
              <div>
                <div>{t('assete.payRent.payDate')}</div>
                <div>
                  {dayjs(data?.asset?.next_rent_date || '').format(
                    'YYYY-MM-DD'
                  )}
                </div>
              </div>
              <div></div>
              <div>
                <div>{t('assete.payRent.rentCycle')}</div>
                <div>
                  {dayjs(data?.asset?.next_rent_date || '').format('YYYY-MM')}
                </div>
              </div>
              <div>
                <div>{t('assete.payRent.rentAmount')}</div>
                <div>
                  $
                  {formatNumberNoRound(data?.asset?.monthly_rent || 0, 6, 2)}
                </div>
              </div>
            </div>
            <div className="mt-6">
              <div className="text-sm text-#D1D5DB">
                {t('assete.payRent.paymentMethod')}
              </div>
              <div className="mt-2 b-1 b-#374151 rounded-1.5 b-solid p-3 text-base">
                <Radio defaultChecked>{t('common.usdcPay')}</Radio>
              </div>
            </div>
            <div className="mt-6">
              <div className="text-sm text-#D1D5DB">
                {t('assete.payRent.selectCrypto')}
              </div>
              <div className="mt-2 rounded-2 bg-#00000080 p-4">
                <div className="flex justify-between text-base text-#9CA3AF">
                  <div>{t('assete.payRent.paymentAddress')}</div>
                  <div
                    onClick={() =>
                      copyText(data.payment?.contract_address || '')}
                    className="w-fit fyc gap-1 text-xs text-#00E5FF clickable"
                  >
                    <div className="i-fa-solid:copy"></div>
                    <div>{t('common.copy')}</div>
                  </div>
                </div>
                <div className="mt-2 p-2 text-base">
                  {data.payment?.contract_address}
                </div>
                {/* <div className="mx-a mt-3 size-32 overflow-hidden b-4 rounded-2 b-solid">
                  <div className="i-bi:qr-code size-full bg-primary"></div>
                </div> */}
                <div className="mt-3 text-center text-xs text-#9CA3AF">
                  {t('assete.payRent.paymentInstruction')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Spin>
    </CommonDialog>
  )
}
