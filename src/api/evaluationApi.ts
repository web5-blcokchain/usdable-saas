import type { ASSET_STATUS } from '@/enum/asset'
import type { DataListResponse } from './responseData'
import apiClient from './client'
// 评估方
export interface DashboardStatisticsResponse {
  /**
   * 待认领案件
   */
  claim_cases: number
  /**
   * 本月已完成案件
   */
  completed_this_month: number
  /**
   * 待处理案件
   */
  pending_cases: number
  /**
   * 处理中
   */
  processing_cases: number
}
/**
 * 获取首页评估方统计信息
 * @returns
 */
export function getDashboardStatistics() {
  return apiClient.post<DashboardStatisticsResponse>('/api/appraiser/dashboardStatistics')
}

/**
 * 案件列表
 */
export interface CaseListResponse {
  /**
   * 图片
   */
  asset_image?: string[]
  /**
   * 资产名称
   */
  asset_name?: string
  /**
   * 资产方名称
   */
  asset_owner_name?: string
  /**
   * 类型
   */
  asset_type?: string
  /**
   * 编号
   */
  code?: string
  /**
   * 是否被认领 1为是 0为否
   */
  create_time?: string
  /**
   * 提交id
   */
  id?: number
  is_claimable?: boolean
  /**
   * 来源律师名称
   */
  lawyer_name?: string
  /**
   * 状态 审核状态 -1草稿 0待审核 1律师已确认 2为审核驳回\r\n3 律师已审核
 4评估方已认领 5 评估方已驳回 6 评估方已评估 7：律师已认领线下 8律师线下上传材料 9资产已上链
   */
  status?: ASSET_STATUS
  status_label?: string
  status_type?: string
  /**
   * 创建日期
   */
  update_time?: string
  /**
   * 估值
   */
  valuation?: number
}
/**
 * 获取案件列表
 * @param data 请求参数
 * @returns
 */
export function getCaseList(data: {
  /**
   * 页码
   */
  page: number
  /**
   * 每页数量
   */
  pageSize: number
  /**
   * 案件状态 3为待认领 4为已认领 5 为已驳回 6为已评估 8为已完成
   */
  status?: number
  /**
   * 搜索关键词
   */
  keyword?: string
}) {
  return apiClient.post<DataListResponse<CaseListResponse>>('/api/appraiser/caseList', data)
}
