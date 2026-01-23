import type { ASSET_STATUS } from '@/enums/asset'
import type { APPLICATION_STATUS, PENDING_CASE_STATUS, PROCESS_STEP } from '@/enums/lawyerWorkbench'
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
export function getPendingCaseList(data: Omit<PageInfoRequest, 'status'>) {
  return apiClient.post<DataListResponse<PendingCaseList>>('/api/lawFirm/pendingCaseList', data)
}

export interface CaseListData {
  /**
   * 申请人
   */
  proposer: string
  /**
   * 申请人手机号
   */
  proposer_mobile: string
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

/**
 * 资产认领（认领初审）
 * @param data 资产提交id
 * @returns
 */
export function claimSubmission(data: {
  /**
   * 资产提交id
   */
  submission_id: number
}) {
  return apiClient.post('/api/lawFirm/claimSubmission', data)
}

export interface PendingOfflineDetailData {
  /**
   * 资产信息
   */
  case_info: CaseInfo
  /**
   * 联系方式
   */
  contacts: Contacts
  /**
   * 步骤完成情况
   */
  process_steps: ProcessStep[]
}

/**
 * 资产信息
 */
export interface CaseInfo {
  /**
   * 资产编码
   */
  case_code: string
  /**
   * 创建日期
   */
  create_time: string
  /**
   * 线下记录id
   */
  id: number
  /**
   * 地址
   */
  property_address: string
  /**
   * 名称
   */
  property_name: string
  /**
   * 异常说明
   */
  remake: null
  /**
   * 状态 0为已认领 1为材料准备 2：窗口提交 3 信息核验 4盖章确权 5 完成  -1异常
   */
  status: PROCESS_STEP
  /**
   * 状态说明
   */
  status_label: string
  /**
   * 提交id
   */
  submission_id: number
  /**
   * 更新日期
   */
  update_time: string
}

/**
 * 联系方式
 */
export interface Contacts {
  /**
   * 资产方联系方式
   */
  asset_owner: AssetOwner
  /**
   * 律师联系方式
   */
  lawyer: Lawyer
}

/**
 * 资产方联系方式
 */
export interface AssetOwner {
  name: string
  phone: string
}

/**
 * 律师联系方式
 */
export interface Lawyer {
  name: string
  phone: string
}

export interface ProcessStep {
  /**
   * 完成时间
   */
  create_date?: number
  /**
   * 线下处理步骤 1为材料准备 2：窗口提交 3 信息核验 4盖章确权 5 完成  -1异常
   */
  type?: PROCESS_STEP
}

/**
 * 待线下确认案件详情
 * @param data 资产提交id
 * @returns
 */
export function getPendingOfflineDetail(data: {
  /**
   * 资产提交id
   */
  id?: number | string
  submission_id?: number | string
}) {
  return apiClient.post<PendingOfflineDetailData>('/api/lawFirm/pendingOfflineDetail', data)
}

export interface rejectSubmissionModel {
  /**
   * 驳回文件列表
   */
  reject_files: {
    /**
     * 提交文件id
     */
    file_id: number
    /**
     * 驳回原因
     */
    reject_reason: string
  }[]
  /**
   * 整体驳回原因
   */
  reject_reason: string
  /**
   * 提交资产id
   */
  submission_id: number
}

/**
 * 律师初审驳回
 * @param data  驳回信息
 * @returns
 */
export function lawyerRejectSubmission(data: rejectSubmissionModel) {
  return apiClient.post('/api/lawFirm/rejectSubmission', data)
}

/**
 * 律师初审提交到评估方
 */
export function submitToAppraiser(data: {
  /**
   * 资产提交id
   */
  submission_id: number
  /**
   * 备注
   */
  remark?: string
}) {
  return apiClient.post('/api/lawFirm/submitToAppraiser', data)
}

/**
 * 领取线下执行案件
 */
export function claimOfflineSubmission(data: {
  /**
   * 资产提交id
   */
  submission_id: number
  /**
   * 备注
   */
  remark: string
}) {
  return apiClient.post('/api/lawFirm/claimOfflineSubmission', data)
}

export interface SubmitOfflineMaterialsModel {
  /**
   * 异常/阻塞上报 ✅
   */
  anomaly_report?: string
  /**
   * 预约时间 ✅
   */
  appointment_time?: string
  /**
   * 合规专员姓名 ✅
   */
  compliance_specialist_name?: string
  /**
   * 合规专员电话 ✅
   */
  compliance_specialist_phone?: string
  /**
   * 业主联系方式 ✅
   */
  contact_method?: string
  /**
   * 合同盖章版本文件 ✅
   */
  contract_with_seal?: string
  /**
   * 费用发票/缴费凭证 ✅
   */
  expense_invoice?: string
  /**
   * 中介名称 ✅
   */
  intermediary_name?: string
  /**
   * 中介联系方式 ✅
   */
  intermediary_phone?: string
  /**
   * 律师姓名 ✅
   */
  lawyer_name?: string
  /**
   * 律师联系方式 ✅
   */
  lawyer_phone?: string
  /**
   * 线下办理备注 ✅
   */
  offline_processing_notes?: string
  /**
   * 线下办理现场照片 ✅
   */
  offline_processing_photos?: string
  /**
   * 他项权证/登记证明文件 ✅
   */
  other_rights_certificate?: string
  /**
   * 业主复印件 ✅
   */
  owner_id_copy?: string
  /**
   * 业主名称 ✅
   */
  owner_name?: string
  /**
   * 办理地点 ✅
   */
  processing_location?: string
  /**
   * 权属证号 ✅
   */
  property_certificate_number?: string
  /**
   * 登记受理回执文件 ✅
   */
  registration_acceptance_receipt?: string
  /**
   * 妆台 传0或者不传为暂存 1为提交
   */
  status?: string
  /**
   * 提交资产id
   */
  submission_id?: string
}
export function submitOfflineMaterials(data: SubmitOfflineMaterialsModel) {
  return apiClient.post('/api/lawFirm/submitOfflineMaterials', data)
}

export interface ViewOfflineMaterialsData {
  completed_documents_count: number
  /**
   * 联系人
   */
  contacts: Contacts
  /**
   * 文件
   */
  files: File[]
  /**
   * 备注
   */
  notes: Notes
  /**
   * 资产信息
   */
  property: Property
  /**
   * 状态 0为暂存 1为已提交
   */
  status: number
  /**
   * 提交资产Id
   */
  submission_id: number
  total_documents_count: number

}

/**
 * 联系人
 */
export interface Contacts {
  /**
   * 资产方
   */
  asset_contact: AssetContact
  /**
   * 合规专员
   */
  compliance_specialist: ComplianceSpecialist
  /**
   * 中介
   */
  intermediary: Intermediary
  /**
   * 律师
   */
  lawyer: Lawyer

}

/**
 * 资产方
 */
export interface AssetContact {
  id: number
  name: string
  phone: string

}

/**
 * 合规专员
 */
export interface ComplianceSpecialist {
  id: number
  /**
   * 名称
   */
  name: string
  /**
   * 联系方式
   */
  phone: string

}

/**
 * 中介
 */
export interface Intermediary {
  id: number
  name: string
  phone: string

}

/**
 * 律师
 */
export interface Lawyer {
  id: number
  /**
   * 名称
   */
  name: string
  /**
   * 联系方式
   */
  phone: string
}

export interface File {
  files: string[]
  key: string
  label: string
  status: number

}

/**
 * 备注
 */
export interface Notes {
  /**
   * 异常/阻塞上报
   */
  anomaly_report: string
  /**
   * 线下办理备注
   */
  offline_processing_notes: string

}

/**
 * 资产信息
 */
export interface Property {
  /**
   * 预约时间
   */
  appointment_time: number
  /**
   * 预约时间
   */
  appointment_time_text: string
  /**
   * 联系方式
   */
  contact_method: string
  /**
   * 名称
   */
  name: string
  /**
   * 业主名称
   */
  owner_name: string
  /**
   * 办理地点
   */
  processing_location: string
  /**
   * 权属证号
   */
  property_certificate_number: string

}
/**
 * 获取线下执行案件详情
 * @param data
 * @returns
 */
export function getViewOfflineMaterials(data: {
  submission_id: string | number
}) {
  return apiClient.post<ViewOfflineMaterialsData>('/api/lawFirm/viewOfflineMaterials', data)
}

/**
 * 提交异常
 * @param data 异常内容
 * @returns
 */
export function submitOfflineIssue(data: {
  /**
   * 资产提交id
   */
  id: number
  /**
   * 备注
   */
  remark: string
}) {
  return apiClient.post('/api/lawFirm/submitOfflineIssue', data)
}

/**
 * 修改案件处理步骤
 * @param data 修改内容
 * @returns
 */
export function updateOfflineStep(data: {
  id: number
  status: PROCESS_STEP
}) {
  return apiClient.post('/api/lawFirm/updateOfflineStep', data)
}
