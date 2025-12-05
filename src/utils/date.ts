import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

/**
 * 转化时间（小于1分钟 => 一分钟、小于一小时 => 输出分钟、小于一天 => 输出小时、昨天的内容 => 昨天
 * 小于一个月 => 输出天、 小于一年 => 输出月、其余则是 YYYY-MM
 * @param time 时间
 * @param t 多语言函数
 * @returns
 */
export function formatTimeDiff(time: string | number | Date, t?: any): string {
  const now = dayjs()
  const target = dayjs(time)

  const diffMinutes = now.diff(target, 'minute')
  const diffHours = now.diff(target, 'hour')
  const diffDays = now.diff(target, 'day')
  const diffMonths = now.diff(target, 'month')

  // 小于 1 分钟 → 按 1 分钟
  if (diffMinutes < 1) {
    return `1 ${t ? (t('common.minute') + t('common.timeAgo')) : '分钟前提交'}`
  }

  // 小于 1 小时 → 按分钟
  if (diffMinutes < 60) {
    return `${diffMinutes} ${t ? (t('common.minute') + t('common.timeAgo')) : '分钟前提交'}`
  }

  // 小于 24 小时 → 按小时
  if (diffHours < 24) {
    return `${diffHours} ${t ? (t('common.hour') + t('common.timeAgo')) : '小时前提交'}`
  }

  // 判断昨天
  if (now.subtract(1, 'day').isSame(target, 'day')) {
    return t ? t('common.yesterday') : '昨天'
  }

  // 2~30 天 → X 天
  if (diffDays < 30) {
    return `${diffDays} ${t ? (t('common.day') + t('common.timeAgo')) : '天前提交'}`
  }

  // 月份计算
  if (diffMonths < 10) {
    return `${diffMonths} ${t ? (t('common.month') + t('common.timeAgo')) : '个月前提交'}`
  }

  // >= 10 月 → X 年 Y 月
  const years = Math.floor(diffMonths / 12)
  const months = diffMonths % 12

  if (months === 0) {
    return `${years} ${t ? (t('common.year') + t('common.timeAgo')) : '年'}`
  }

  return `${years} ${t ? (t('common.year') + t('common.timeAgo')) : '年'} - ${months} ${t ? (t('common.month') + t('common.timeAgo')) : '月'}`
}

/**
 * 智能时间格式化 （一天内 → HH:mm
   昨天 → 昨天
   今年内 → MM-DD
   其余年份 → YYYY-MM-DD）
 * @param time 时间
 * @returns
 */
export function formatSmartTime(time: string | number | Date | undefined, t?: any): string {
  if (!time)
    return ''
  const now = dayjs()
  const date = dayjs(time)

  // 一天内：HH:mm
  if (now.isSame(date, 'day')) {
    return date.format('HH:mm')
  }

  // 昨天
  const yesterday = now.subtract(1, 'day')
  if (yesterday.isSame(date, 'day')) {
    return t ? t('common.yesterday') : '昨天'
  }

  // 今年内：MM-DD
  if (now.isSame(date, 'year')) {
    return date.format('MM-DD')
  }

  // 其余：YYYY-MM-DD
  return date.format('YYYY-MM-DD')
}
