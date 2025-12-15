import { envConfig } from './envConfig.ts'

export function joinImagePath(path: string) {
  if (!path) {
    return ''
  }

  return `${envConfig.apiUrl}${path}`
}

export function joinImagesPath(paths?: string) {
  return paths?.split(',').map(joinImagePath) || []
}

// 判断url是否有https：前缀，没有则加上
export function addHttpsPrefix(url: string | undefined) {
  if (!url) {
    return ''
  }

  if (url.startsWith('https:') || url.startsWith('http:')) {
    return url
  }

  return url.startsWith('//') ? `https:${url}` : `https://${url}`
}
