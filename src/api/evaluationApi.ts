import type { SUBMISSION_STATUS } from '@/enum/common'
import type { ASSET_EVALUATIO_STATUS } from '@/enum/evaluation'
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
   * 联系人
   */
  appraiser: string
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
  create_time?: string
  /**
   * 提交id
   */
  id?: number
  /**
   * 是否被认领 1为是 0为否
   */
  is_claimable?: boolean
  /**
   * 来源律师名称
   */
  lawyer_name?: string
  // 状态 3为待认领 4为已认领 5 为已驳回 6为已评估 9为已完成
  status?: ASSET_EVALUATIO_STATUS
  /**
   * 状态 审核状态 -1草稿 0待审核 1律师已确认 2为审核驳回\r\n3 律师已审核
4评估方已认领 5 评估方已驳回 6 评估方已评估 7：律师已认领线下 8律师线下上传材料 9资产已上链
   */
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

export interface ClaimSubmissionResponse {
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
 * 认领评估
 * @param data 认领评估信息
 * @returns
 */
export function claimSubmission(data: {
  submission_id: string
  remark?: string
}) {
  return apiClient.post<ClaimSubmissionResponse>('/api/appraiser/claimSubmission', data)
}

export interface AppraiserReportList {
  /**
   * 估值
   */
  appraise_value_cny?: number
  /**
   * 评估机构名称
   */
  appraiser_company?: string
  /**
   * 评估师名称
   */
  appraiser_name?: string
  /**
   * 资产名称
   */
  asset_name?: string
  /**
   * 文件
   */
  files?: string[]
  /**
   * 资产编号
   */
  report_code?: string
  /**
   * 报告id
   */
  report_id?: number
  /**
   * 提交状态 0是未提交 1是已提交
   */
  status?: SUBMISSION_STATUS
  /**
   * 状态说明
   */
  status_label?: string
  status_type?: string
  /**
   * 提交日期
   */
  submit_time?: string
}
/**
 * 获取评估报告列表
 * @param data 请求参数
 * @returns
 */
export function getReportList(data: {
  /**
   * 页码
   */
  page: number
  /**
   * 每页数量
   */
  pageSize: number
  /**
   * 搜索关键词
   */
  keyword?: string
}) {
  return apiClient.post<DataListResponse<AppraiserReportList>>('/api/appraiser/reportList', data)
}

/**
 * 评估报告详情
 */
export interface ReportDetail {
  /**
   * 时间
   */
  appraise_date: string
  /**
   * 方法id
   */
  appraise_method: string
  /**
   * 评估结论
   */
  appraise_summary: string
  /**
   * 评估价
   */
  appraise_value_cny: number
  /**
   * 机构名称
   */
  appraiser_company: string
  /**
   * 评估师名称
   */
  appraiser_name: string
  /**
   * 资产编码
   */
  asset_code: string
  /**
   * 资产信息
   */
  asset_info: {
    address: string
    bedrooms: number
    building_area: string
    monthly_rent: number
    name: string
    property_type: string
  }
  /**
   * 评估分拣
   */
  report_files: string[]
  /**
   * 报告id
   */
  report_id: number
  /**
   * 状态 0未未提交 1为已提交
   */
  status: number
  /**
   * 提交资产id
   */
  submission_id: number
  [property: string]: any
}
/**
 * 评估报告详情
 * @param data
 * @returns
 */
export function getReportDetail(data: {
  submission_id: string | number
}) {
  return apiClient.post<ReportDetail>('/api/appraiser/reportDetail', data)
}

/**
 * 评估驳回
 * @param data 资产评估驳回信息
 * @returns
 */
export function rejectSubmission(data: {
  submission_id: string | number
  reject_reason: string
}) {
  return apiClient.post<ClaimSubmissionResponse>('/api/appraiser/rejectSubmission', data)
}

/**
 * 资产评估类型
 */
export interface AssessmentMethod {
  /**
   * 编码
   */
  code: string
  created_at: string
  /**
   * 描述
   */
  description: string
  /**
   * 类型id
   */
  id: number
  /**
   * 英文名称
   */
  name_en: string
  /**
   * 日文名称
   */
  name_ja: string
  /**
   * 韩文名称
   */
  name_ko: string
  /**
   * 中文名称
   */
  name_zh_cn: string
  /**
   * 排序
   */
  order_index: number
  status: number
  updated_at: string
}
/**
 * 资产评估类型
 * @returns
 */
export function getAssessmentMethod() {
  return apiClient.get<AssessmentMethod[]>('api/EntityType/assessmentMethod')
}

export interface ReportFinalResponse {
  /**
   * 时间
   */
  appraise_date: string
  /**
   * 方法id
   */
  appraise_method: string
  /**
   * 评估结论
   */
  appraise_summary: string
  /**
   * 评估价
   */
  appraise_value_cny: number
  /**
   * 机构名称
   */
  appraiser_company: string
  /**
   * 评估师名称
   */
  appraiser_name: string
  /**
   * 资产编码
   */
  asset_code: string
  /**
   * 资产信息
   */
  asset_info: {
    address: string
    bedrooms: number
    building_area: string
    monthly_rent: number
    name: string
    property_type: string
  }
  /**
   * 评估分拣
   */
  report_files: string[]
  /**
   * 报告id
   */
  report_id: number
  /**
   * 状态 0未未提交 1为已提交
   */
  status: number
  /**
   * 提交资产id
   */
  submission_id: number
}
/**
 * 提交评估报告
 * @param data 评估报告id
 * @returns
 */
export function submitReportFinal(data: { report_id: string | number }) {
  return apiClient.post<ReportFinalResponse>('/api/appraiser/submitReportFinal', data)
}

export interface SubmitReportModel {
  /**
   * 评估时间
   */
  appraise_date?: string
  /**
   * 评估方式id
   */
  appraise_method?: string
  /**
   * 报告结论
   */
  appraise_summary?: string
  /**
   * 评估价
   */
  appraise_value_cny?: string
  /**
   * 评估机构名称
   */
  appraiser_company?: string
  /**
   * 评估师姓名
   */
  appraiser_name?: string
  /**
   * 提交id
   */
  submission_id?: string | number
  /**
   * 是否草稿 传1为是 0为否 不传则为提交报告
   */
  is_draft?: string
  /**
   * 评估报告文件
   */
  report_file_urls?: string
}
/**
 * 生成评估报告
 * @param data 评估报告id
 * @returns
 */
export function submitReport(data: SubmitReportModel) {
  return apiClient.post<{ report_id: number }>('/api/appraiser/submitReport', data)
}
