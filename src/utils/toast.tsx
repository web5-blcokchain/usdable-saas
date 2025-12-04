import type { TypeOptions } from 'react-toastify'

const toastCache = new Map() // 记录每条 text 的最近调用时间
// 记录每条 text 的最近调用时间,n 秒内只会触发一次
export function showToastOnce(
  text: string,
  type: TypeOptions,
  time: number = 2
) {
  const now = Date.now()
  const lastTime = toastCache.get(text) || 0

  // 2 秒内不重复调用
  if (now - lastTime < 1000 * time) {
    return
  }

  toastCache.set(text, now)

  // 这里替换为你的 toast 方法
  toast(text, {
    type
  })
}
