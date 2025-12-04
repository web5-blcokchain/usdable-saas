// 获取url的文件后缀
export function getFileExtension(url: string) {
  const name = url.split('/').pop() || ''
  return name.split('.').pop() || ''
}

// 下载图片
export async function downloadFile({ downLoadUrl, filename, t }: {
  downLoadUrl: string | string[] | undefined
  filename?: string
  t?: any
}) {
  if (!downLoadUrl)
    return
  const urls = typeof downLoadUrl === 'string' ? [downLoadUrl] : downLoadUrl
  try {
    for (const url of urls) {
      if (!url)
        continue
      const response = await fetch(url)
      const blob = await response.blob()
      // 后缀通过url确认
      const fileExtension = getFileExtension(url) || 'png'
      const blobUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = blobUrl
      // 通过url获取前缀
      const prefix = url.split('/').pop() || 'img.png'
      link.download = filename ? (filename + fileExtension) : prefix

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // 释放内存
      URL.revokeObjectURL(blobUrl)
    }
  }
  catch (error) {
    console.error('下载文件失败', error)
    t && toast.error(t('common.downloadFailed'))
    throw new Error('下载文件失败')
  }
}
