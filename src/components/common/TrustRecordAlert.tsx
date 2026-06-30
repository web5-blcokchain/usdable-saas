import { cn } from '@/utils/style'
import { useTranslation } from 'react-i18next'

export interface TrustRecordAlertProps {
  count: number
  className?: string
}

export function TrustRecordAlert({ count, className }: TrustRecordAlertProps) {
  const { t } = useTranslation()

  return (
    <div
      className={cn(
        'rounded-lg border border-solid border-[#6F580F80] bg-[#39311280] px-[15px] py-[14px]',
        className
      )}
    >
      <div className="text-[14px] text-[#FBF0C6] leading-[24px] tracking-[0.027em] font-mono">
        {t('common.trustRecord', { count })}
      </div>
    </div>
  )
}
