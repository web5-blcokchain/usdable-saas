import apiClient from './client'

interface FileResponse {
  suffix: string
  full_url: string
  id: number
  topic: string
  admin_id: number
  user_id: number
  url: string
  width: number
  height: number
  name: string
  size: number
  mimetype: string
  storage: string
  sha1: string
  last_upload_time: number
}
/**
 * 文件上传
 * @param data 文件
 * @returns
 */
export function uploadFile(data: FormData) {
  return apiClient.post<{ file: FileResponse }>('/api/user/upload', data)
}

export interface Region {
  id: number
  code: string
  has_children: boolean
  level: number
  level_name: string
  name: string
  name_en: string
  parent_id: number
}

export function getLocation(data: {
  /**
   * 等级 1为州 2为国家 3为省 4为市 默认为2
   */
  level: number
  /**
   * 父级ID
   */
  parent_id?: number
}) {
  return apiClient.post<Region[]>('/api/EntityType/location', data)
}
