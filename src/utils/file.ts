// 获取url的文件后缀
export function getFileExtension(url: string) {
  const name = url.split('/').pop() || ''
  return name.split('.').pop() || ''
}
