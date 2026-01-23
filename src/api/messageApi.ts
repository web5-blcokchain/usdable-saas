import type { MESSAGE_STATUS, MESSAGE_TYPE } from '@/enums/message'
import type { DataListResponse } from './responseData'
import apiClient from './client'

export interface MessageModel {
  /**
   * 结束日期
   */
  date_end?: string
  /**
   * 开始日期
   */
  date_start?: string
  /**
   * 模糊搜索
   */
  keyword?: string
  page?: string | number
  pageSize?: string | number
  /**
   * 状态 0未读 1已读
   */
  status?: MESSAGE_STATUS
  /**
   * 通知类型（1.用户审核  2.资产上链成功  3.房产违约  4公告）
   */
  type?: MESSAGE_TYPE
}

export interface MessageList {
  /**
   * 内容
   */
  content?: string
  /**
   * 发送时间
   */
  create_time?: string
  /**
   * 扩展 比如跳转链接
   */
  extra?: string
  /**
   * 消息id
   */
  id?: number
  /**
   * 状态 0未未读  1为已读
   */
  status?: MESSAGE_STATUS
  /**
   * 标题
   */
  title?: string
  /**
   * 类型通知类型（1.用户审核  2.房子上链成功  3.房产违约  4公告）
   */
  type?: MESSAGE_TYPE
  /**
   * 用户id
   */
  user_id?: number
}

interface MessageDataListResponse extends DataListResponse<MessageList> {
  /**
   * 未读消息数量
   */
  unread?: number
}
/**
 * 获取消息列表
 * @param data 分页查询参数
 * @returns
 */
export function getMessageList(data: MessageModel) {
  return apiClient.post<MessageDataListResponse>('/api/info/messageList', data)
}

/**
 * 标记消息为已读
 * @returns
 */
export function markMessageRead(data: { ids: string }) {
  return apiClient.post<any>('/api/info/markMessageRead', data)
}

/**
 * 删除消息
 * @returns
 */
export function deleteMessage(data: { ids: string }) {
  return apiClient.post<any>('/api/info/deleteMessage', data)
}
