import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

export function formatTimeDiff(time: string | number | Date, t?: any): string {
  const now = dayjs()
  const target = dayjs(time)

  const diffMinutes = now.diff(target, 'minute')
  const diffHours = now.diff(target, 'hour')
  const diffDays = now.diff(target, 'day')
  const diffMonths = now.diff(target, 'month')

  // 小于 1 分钟 → 按 1 分钟
  if (diffMinutes < 1) {
    return `1 ${t ? t('minute') : '分钟前提交'}`
  }

  // 小于 1 小时 → 按分钟
  if (diffMinutes < 60) {
    return `${diffMinutes} ${t ? t('minute') : '分钟前提交'}`
  }

  // 小于 24 小时 → 按小时
  if (diffHours < 24) {
    return `${diffHours} ${t ? t('hour') : '小时前提交'}`
  }

  // 判断昨天
  if (now.subtract(1, 'day').isSame(target, 'day')) {
    return t ? t('yesterday') : '昨天'
  }

  // 2~30 天 → X 天
  if (diffDays < 30) {
    return `${diffDays} ${t ? t('day') : '天前提交'}`
  }
  console.log('diffMonths', diffMonths)

  // 月份计算
  if (diffMonths < 10) {
    return `${diffMonths} ${t ? t('month') : '个月前提交'}`
  }

  // >= 10 月 → X 年 Y 月
  const years = Math.floor(diffMonths / 12)
  const months = diffMonths % 12

  if (months === 0) {
    return `${years} ${t ? t('year') : '年'}`
  }

  return `${years} ${t ? t('year') : '年'} - ${months} ${t ? t('month') : '月'}`
}
