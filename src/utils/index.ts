export function screenToTop(options?: ScrollToOptions) {
  const mainDom = document.querySelector('.app-content')
  if (options) {
    mainDom?.scrollTo(options)
  }
  else {
    mainDom?.scrollTo(0, 0)
  }
}

/**
 * 提取大括号中的关键字内容
 * @param text 输入文本
 * @returns 匹配到的关键字数组或null
 */
export function extractFirstBraces(text: string) {
  const regex = /\{\{(.*?)\}\}/g
  const matches = []
  let match

  // eslint-disable-next-line no-cond-assign
  while ((match = regex.exec(text)) !== null) {
    matches.push(match[1].trim()) // 去掉前后空格
  }
  return matches.length > 0 ? matches : null
}
