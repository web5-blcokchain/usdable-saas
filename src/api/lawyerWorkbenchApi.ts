import type { ASSET_STATUS } from '@/enum/asset'
import type { APPLICATION_STATUS, PENDING_CASE_STATUS } from '@/enum/lawyerWorkbench'
import type { DataListResponse, PageRequest } from './responseData'
import apiClient from './client'

/**
 * 律师端
 */

export interface SearchParams {
  start_date?: string
  end_date?: string
  country_id?: number
  status?: PENDING_CASE_STATUS
  keyword?: string
}

export interface PageInfoRequest extends SearchParams, PageRequest {

}

export interface DashboardStatistics {
  /**
   * 待认领
   */
  claim: Claim
  /**
   * 待处理
   */
  summary: Summary
}

/**
 * 待认领
 */
export interface Claim {
  /**
   * 待认领案件
   */
  initial: number
  /**
   * 待确权（线下）
   */
  offline: number
}

/**
 * 待处理
 */
export interface Summary {
  /**
   * 拍卖任务
   */
  auction_tasks: number
  /**
   * 已完成
   */
  completed: number
  /**
   * 待初审
   */
  pending_initial: number
  /**
   * 待线下确认
   */
  pending_offline: number
}

/**
 * 获取律师端统计数据
 * @returns
 */
export function getLawyerWorkbenchDashboardStatistics() {
  return apiClient.post<DashboardStatistics>('/api/lawFirm/dashboardStatistics')
}

/**
 * 待处理案件列表
 */
export interface PendingCaseList {
  asset_image: string[]
  /**
   * 图片
   */
  asset_name: string
  /**
   * 房产类型
   */
  asset_type: string
  /**
   * 案件编码
   */
  code: string
  /**
   * id
   */
  id: number
  /**
   * 状态 审核状态 -1草稿 0待审核 1律师已确认 2为审核驳回\r\n3 律师已审核  4评估方已认领 5 评估方已驳回 6 评估方已评估 7律师线下上传材料 8 资产已上链
   */
  status: ASSET_STATUS
  /**
   * 状态说明
   */
  status_label: string
  /**
   * 上传日期
   */
  update_time: string
  valuation: number
}
/**
 * 获取待处理案件列表
 * @returns
 */
export function getPendingCaseList(data: PageInfoRequest) {
  return apiClient.post<DataListResponse<PendingCaseList>>('/api/lawFirm/pendingCaseList', data)
}

export interface CaseListData {
  /**
   * 图片
   */
  asset_image: string[]
  /**
   * 资产名称
   */
  asset_name: string
  /**
   * 房产类型
   */
  asset_type: string
  /**
   * 编码
   */
  code: string
  /**
   * 创建日期
   */
  create_time: string
  /**
   * 地区
   */
  district: string
  /**
   * 提交资产Id
   */
  id: number
  /**
   * 审核状态 -1草稿 0待审核 1律师已确认 2为审核驳回\r\n3 律师已审核  4评估方已认领 5 评估方已驳回 6 评估方已评估 7律师线下上传材料 8 资产已上链
   */
  status: ASSET_STATUS
  /**
   * 审核状态值
   */
  status_label: string
  /**
   * 更新日期
   */
  update_time: string
  /**
   * 估值
   */
  valuation: number
}
/**
 * 待初审案件/待线下执行案件/已完成案件列表
 * @param data 分页参数
 * @returns 案件列表
 */
export function getCaseList(data: PageInfoRequest) {
  return apiClient.post<DataListResponse<CaseListData>>('/api/lawFirm/caseList', data)
}

export interface PendingCaseListData {
  /**
   * 申请状态 0为未申请 1为处理中 2为已通过 3为异常
   */
  application_status: APPLICATION_STATUS
  /**
   * 编码
   */
  case_code?: string
  create_time?: string
  id?: number
  /**
   * 地址
   */
  property_address?: string
  /**
   * 名称
   */
  property_name?: string
  /**
   * 异常说明
   */
  remark?: string
  /**
   * 状态
   */
  status?: number
  /**
   * 状态说明
   */
  status_label?: string
  /**
   * 资产提交id
   */
  submission_id?: number
  update_time?: string
}
export function getPendingOfflineList(data: PageInfoRequest) {
  return apiClient.post<DataListResponse<PendingCaseListData>>('/api/lawFirm/pendingOfflineList', data)
}
