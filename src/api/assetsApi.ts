import type { ASSET_AUDIT_SUBMISSION_STATUS, ASSET_AUDITOR_ROLE, ASSET_STATUS, ASSET_SUBMISSION_STATUS, RISK_STATUS, SALE_STATUS } from '@/enum/asset'
import type { INPUT_FORMAT_TYPE, INPUT_UI_TYPE, IS_REQUIRED, REVIEW_STATUS } from '@/enum/common'
import type { DataListResponse } from './responseData'
import apiClient from './client'

// 资产方

// 资产类型
export interface AssetType {
  /**
   * 编码
   */
  code: string
  created_at: string
  description: string
  /**
   * 类型id
   */
  id: number
  /**
   * 英文
   */
  name_en: string
  /**
   * 日语
   */
  name_ja: string
  /**
   * 韩语
   */
  name_ko: string
  /**
   * 中文名称
   */
  name_zh_cn: string
  order_index: number
  status: number
  updated_at: string
}

// 链上资产状态
export interface SubmissionStatistics {
  /**
   * 上链失败资产
   */
  failed: number
  /**
   * 已上链资产
   */
  on_chain: number
  /**
   * 总资产
   */
  total_on_chain: number
  /**
   * 待验证资产
   */
  verifying: number
}

// 资产上链明细
export interface SubmissionData {
  /**
   * 图片
   */
  asset_image: string[]
  /**
   * 资产名称
   */
  asset_name: string
  /**
   * 资产类型
   */
  asset_type: string
  /**
   * 编码
   */
  code: string
  /**
   * 资产提交id
   */
  id: number
  /**
   * 处理方
   */
  processor: string
  /**
   * 处理意见
   */
  review_remark: string
  /**
   * 状态
状态 审核状态 -1草稿 0待审核 1律师已确认 2为审核驳回\r\n3 律师已审核
 4评估方已认领 5 评估方已驳回 6 评估方已评估 7：律师已认领线下 8律师线下上传材料 9资产已上链
   */
  status: ASSET_STATUS
  /**
   * 状态说明
   */
  status_label: string
  status_type: string
  /**
   * 更新日期
   */
  update_time: string
  /**
   * 估值
   */
  valuation: number
}

// 资产运营状态
export interface AssetsOperationSummaryData {
  /**
   * 违约房产
   */
  default_properties: number
  /**
   * 本月应缴纳租金
   */
  monthly_due_amount: number
  /**
   * 正常房产
   */
  normal_properties: number
  /**
   * 待缴纳房产
   */
  pending_properties: number
  /**
   * 总房产
   */
  total_properties: number
}

// 资产运营状态明细
export interface AssetsOperationData {
  activate_date: number
  activate_hash: string
  /**
   * 资产地址
   */
  address: string
  annual_return_max: number
  annual_return_min: number
  appraisement: number
  area: string
  bedrooms: number
  /**
   * 逾期天数
   */
  breaking_contract_number: number
  capital_appreciation: null
  chain_id: number
  city: string
  /**
   * 资产编码
   */
  code: string
  contact: string
  contract_address: string
  create_user: number
  created_date: number
  district: string
  equity: string
  expected_annual_return: number
  governance_reserved_tokens: number
  house_life: number
  /**
   * 资产id
   */
  id: number
  image_list: string[]
  image_urls: null | string
  Inception_number: number
  latitude: string
  location: string
  longitude: string
  market_status: number
  /**
   * 月租金
   */
  monthly_rent: number
  name: string
  /**
   * 下个交租日期
   */
  next_rent_date: string
  number: number
  old_token_name: string
  payout_token_address: string
  postcode: string
  price: null
  /**
   * 资产id
   */
  properties_id: number
  properties_user: number
  property_description: string
  /**
   * 风险 1为正常 2为宽限期 3为升级逾期 4 违约理赔期 5保险理赔 6 清算 7拍卖成功 8拍卖失败
   */
  property_status: RISK_STATUS
  /**
   * 房产类型
   */
  property_type: string
  property_type_value: string
  rent_day: number
  /**
   * 交租状态
   */
  rent_status: {
    /**
     * 0为未知 1为正常 2为待缴纳 3 为逾期
     */
    key: string
    label: string
  }
  rental_yield: null
  status: number
  /**
   * 提交资产id
   */
  submission_id: number
  /**
   * 状态 0待审核 1律师已确认 2为审核驳回\r\n3 律师已审核  4评估方已认领 5 评估方已驳回 6 评估方已评估 7律师已认领线下   8律师线下上传材料 9 资产已上链
   */
  submission_status: ASSET_STATUS
  token_name: string
  token_symbol: string
  total_money: number
  tx_hash: string
  updated_date: number
  valuation_report: string
}

// 提交资产信息
export interface SubmitAssetInfo {
  /**
   * 资产类型id
   */
  asset_type_id: number
  /**
   * 基础信息
   */
  basic_info: BasicInfo
  /**
   * 国家id
   */
  country_id: number
  /**
   * 需要上传的文件以及字段
   */
  files: {
    /**
     * 文件需要添加的字段
     */
    fields?: Fields
    /**
     * 文件地址
     */
    file_urls: string[]
    /**
     * 文件Id
     */
    template_file_id: number
  }[]
  /**
   * 状态 提交审核 不传为保存草稿
   */
  status?: number
  /**
   * 资产id 编辑的时候用到
   */
  submission_id: string
  /**
   * 模板id
   */
  template_id: number
}

/**
 * 基础信息
 */
export interface BasicInfo {
  /**
   * 地址
   */
  address: string
  /**
   * 年化收益上限
   */
  annual_return_max: number
  /**
   * 年化收益下线
   */
  annual_return_min: number
  /**
   * 面积
   */
  area: number
  /**
   * 房间数量
   */
  bedrooms: number
  /**
   * 链id
   */
  chain_id: number
  /**
   * 城市id
   */
  city: number
  /**
   * 预期年回报率（百分比）
   */
  expected_annual_return: number
  /**
   * 房屋年限
   */
  house_life: number
  /**
   * 纬度
   */
  latitude: number
  /**
   * 位置描述
   */
  location: string
  /**
   * 经度
   */
  longitude: number
  /**
   * 月租
   */
  monthly_rent: number
  /**
   * 资产名称
   */
  name: string
  /**
   * 邮编
   */
  postcode: string
  /**
   * 房产描述
   */
  property_description: string
  /**
   * 类型id
   */
  property_type: number
  /**
   * 缴纳房租日
   */
  rent_day: number
}

export interface File {
  /**
   * 提交的文件字段信息
   */
  fields: Field[]
  file_info: FileInfo
  /**
   * 已提交的文件信息
   */
  file_urls: FileUrls
  id: number
  template_file_id: number
}

/**
 * 文件需要添加的字段
 */
export interface Fields {
  file_code: string
  file_date: string
}

/**
 * 房产类型
 */
export interface HouseType {
  /**
   * 编码
   */
  code: string
  id: number
  /**
   * 房产类型名称
   */
  name: string
}
// ---------资产信息
/**
 * 资产信息
 */
export interface AssetInfo {
  /**
   * 审核日志信息
   */
  audit_logs: AuditLog[]
  /**
   * 资产文件信息
   */
  files: AssetFile[]
  /**
   * 资产基础信息
   */
  properties: Properties
  /**
   * 提交资产模版信息
   */
  submission: Submission
  /**
   * 模板文件相关信息
   */
  template_files: TemplateFile[]
}

/**
 * 文件上传模板信息
 */
export interface AssetFileTemplates {
  /**
   * 类型id
   */
  asset_type_id?: number
  /**
   * 编码
   */
  code?: string
  /**
   * 国家id
   */
  country_id?: number
  create_date?: number
  /**
   * 多语言Json
   */
  i18n_labels_json?: null
  /**
   * 模板id
   */
  id?: number
  /**
   * 模板名称
   */
  name?: string
  /**
   * 备注
   */
  notes?: string
  parent_template_id?: null
  /**
   * 状态
   */
  status?: number
  /**
   * 需要上传的文件
   */
  template_files?: TemplateFile[]
  update_date?: number
  /**
   * 创建人id
   */
  user_id?: number
}

export interface TemplateFile {
  create_date: number
  /**
   * 描述
   */
  description: string
  /**
   * 名称
   */
  display_name: string
  /**
   * 文件里面需要提交的字段信息
   */
  fields: Field[]
  /**
   * 提交文件的参数键值
   */
  file_code: string
  i18n_labels_json: null
  /**
   * 文件id
   */
  id: number
  /**
   * 是否必填 1为是 0为否
   */
  is_required: IS_REQUIRED
  metadata_json: null
  /**
   * 排序
   */
  order_index: number
  /**
   * 模板id
   */
  template_id: number
  update_date: number
}

export interface Field {
  create_date: number
  /**
   *
   * 输入值的格式类型'STRING','TEXT','INT','DECIMAL','DATE','DATETIME','BOOL','ENUM','MULTI_ENUM','FILE','ADDRESS','JSON'
   */
  data_type: INPUT_FORMAT_TYPE
  /**
   * 默认值
   */
  default_value: string
  /**
   * 字段键
   */
  field_key: string
  /**
   * 提示文字
   */
  help_text: string
  /**
   * 多语言标签和提示
   */
  i18n_labels_json: null
  /**
   * id
   */
  id: number
  /**
   * 显示的名称
   */
  label: string
  /**
   * 下拉/单选选项 JSON 数组
   */
  options_json: null
  /**
   * 排序
   */
  order_index: number
  /**
   * 输入占位符
   */
  placeholder: string
  /**
   * 是否必填 1为是 0为否
   */
  required: IS_REQUIRED
  /**
   * 文件id
   */
  template_file_id: number
  /**
   * 输入ui的类型
   * 'INPUT','TEXTAREA','NUMBER','DATEPICKER','CHECKBOX','RADIO','SELECT','MULTISELECT','UPLOAD'
   */
  ui_control: INPUT_UI_TYPE
  update_date: number
  /**
   * 验证规则，如正则、最小值、最大值
   */
  validation_json: null
}

export interface AuditLog {
  /**
   * 提交ID
   */
  audit_step: number
  /**
   * 审核时间
   */
  audit_time: number
  /**
   * 审核步骤：0:资料提交 1：律师认领 2：律师驳回 3：律师审核通过 4：评估方认领 5 ：评估方驳回 6：评估方审核通过 7：律师线下提交资料成功 8：资产上链成功
   */
  auditor_id: ASSET_AUDIT_SUBMISSION_STATUS
  /**
   * 审核人姓名
   */
  auditor_name: null
  /**
   * 审核人角色 1为资产方 2为 律师 3为评估 4为平台管理员
   */
  auditor_role: ASSET_AUDITOR_ROLE
  /**
   * 创建日期
   */
  create_date: number
  id: number
  /**
   * 驳回原因（如果驳回）
   */
  reject_reason: null
  /**
   * 备注
   */
  remark: string
  /**
   * 审核状态：0=待审核，1=审核通过，2=审核驳回，-1=已撤回
   */
  status: REVIEW_STATUS
  submission_id: number
  /**
   * 更新日期
   */
  update_date: number
}

export interface AssetFile extends File {
  file_info: FileInfo
  id: number
}

export interface Field {
  /**
   * 模板文件字段相关信息
   */
  definition: Definition
  /**
   * 字段的key
   */
  field_key: string
  /**
   * 提交的文件信息id
   */
  submission_file_id: number
  /**
   * 模板文件字段id
   */
  template_file_field_id: number
  /**
   * 字段的字
   */
  value: string
}

/**
 * 模板文件字段相关信息
 */
export interface Definition {
  create_date: number
  data_type: string
  default_value: string
  field_key: string
  help_text: string
  i18n_labels_json: null
  id: number
  label: string
  options_json: null
  order_index: number
  placeholder: string
  required: number
  template_file_id: number
  ui_control: string
  update_date: number
  validation_json: null
}

export interface FileInfo {
  create_date: number
  description: string
  display_name: string
  file_code: string
  i18n_labels_json: null
  id: number
  is_required: number
  metadata_json: null
  order_index: number
  template_id: number
  update_date: number
}

/**
 * 已提交的文件信息
 */
export interface FileUrls {
  /**
   * 文件链接
   */
  fileUrls: string[]
  /**
   * 驳回意见
   */
  remake: string
  /**
   * 状态 0为待审核 1为已审核 2为审核驳回
   */
  status: REVIEW_STATUS
}

/**
 * 资产基础信息
 */
export interface Properties {
  /**
   * 激活日期
   */
  activate_date: number
  /**
   * 激活哈希
   */
  activate_hash: string
  /**
   * 地址
   */
  address: string
  /**
   * 年化收益上限
   */
  annual_return_max: string
  /**
   * 年化收益下限
   */
  annual_return_min: string
  /**
   * 估值
   */
  appraisement: string
  /**
   * 面积
   */
  area: string
  /**
   * 房间
   */
  bedrooms: number
  /**
   * 违约天数
   */
  breaking_contract_number: number
  /**
   * 资本增值
   */
  capital_appreciation: null
  /**
   * 链id
   */
  chain_id: number
  /**
   * 城市
   */
  city: string
  contact: string
  /**
   * 资产合约地址
   */
  contract_address: string
  create_user: number
  created_date: number
  /**
   * 国家id
   */
  district: string
  equity: string
  /**
   * 预期年回报率
   */
  expected_annual_return: string
  governance_reserved_tokens: number
  /**
   * 房屋年限
   */
  house_life: number
  /**
   * 资产id
   */
  id: number
  /**
   * 资产图片
   */
  image_urls: null
  /**
   * 初始份额
   */
  Inception_number: number
  /**
   * 纬度
   */
  latitude: string
  /**
   * 位置描述
   */
  location: string
  /**
   * 经度
   */
  longitude: string
  /**
   * 销售状态 0为未销售 1为销售中 2为售罄 3为已退出
   */
  market_status: SALE_STATUS
  /**
   * 月租
   */
  monthly_rent: string
  /**
   * 资产名称
   */
  name: string
  /**
   * 份额
   */
  number: number
  old_token_name: string
  payout_token_address: string
  /**
   * 邮编
   */
  postcode: string
  /**
   * 单价
   */
  price: string
  properties_user: number
  /**
   * 房产描述
   */
  property_description: string
  /**
   * 资产状态 1为正常 2为宽限期 3为升级逾期 4 违约理赔期 5保险理赔 6 清算 7拍卖成功 8拍卖失败
   */
  property_status: RISK_STATUS
  /**
   * 房产类型
   */
  property_type: string
  /**
   * 交租日期
   */
  rent_day: number
  /**
   * 包含的租金回报率
   */
  rental_yield: null
  status: number
  token_name: string
  token_symbol: string
  /**
   * 交易哈西
   */
  tx_hash: string
  updated_date: number
  valuation_report: string
}

/**
 * 提交资产模版信息
 */
export interface Submission {
  /**
   * 资产类型id
   */
  asset_type_id: number
  /**
   * 资产编码
   */
  code: string
  /**
   * 国家id
   */
  country_id: number
  create_date: number
  /**
   * 资产模板id
   */
  id: number
  /**
   * 资产id
   */
  properties_id: number
  /**
   * 驳回信息
   */
  review_remark: null
  /**
   * 状态 -1为草稿  0为待审核 1为审核通过 2为审核驳回
   */
  status: ASSET_SUBMISSION_STATUS
  /**
   * 模板Id
   */
  template_id: number
  update_date: number
  /**
   * 用户id
   */
  user_id: number
  /**
   * 所有权
   */
  assets_user_name: string
}

/**
 * 资产租金收入
 */
export interface SaveRentIncome {
  /**
   * 缴纳金额
   */
  income_amount?: string
  /**
   * 租金月份
   */
  income_date?: string
  /**
   * 资产提交id
   */
  submission_id?: string
  /**
   * 交易哈希
   */
  tx_hash?: string
}

/**
 * 房租详情
 */
export interface RentPaymentDetails {
  /**
   * 缴纳租金合约地址
   */
  contract_address: string
  /**
   * 本月缴纳信息
   */
  current_payment: null
  /**
   * 图片
   */
  image_list: string
  /**
   * 租金
   */
  monthly_rent: number
  /**
   * 下一个交租日期
   */
  next_rent_date: string
  /**
   * 历史缴纳记录
   */
  payment_history: string[]
  /**
   * 催缴记录
   */
  payment_reminder_records: PaymentReminderRecord[]
  /**
   * 资产id
   */
  properties_id: number
  /**
   * 地址
   */
  property_address: string
  /**
   * 名称
   */
  property_name: string
  /**
   * 交租日期
   */
  rent_day: number
  /**
   * 状态 0为未知 1为正常 2为待缴纳 3 为逾期
   */
  rent_status: RentStatus
  /**
   * 提交资产id
   */
  submission_id: number
  /**
   * 处理建议
   */
  suggestions: string[]
}

export interface PaymentReminderRecord {
  created_at: number
  id: number
  operator_id: number
  reminder_content: string
  reminder_time: number
  reminder_times: number
  reminder_title: string
  reminder_type: string
  status: number
  submission_id: number
  updated_at: number
  user_id: number
}

/**
 * 状态 0为未知 1为正常 2为待缴纳 3 为逾期
 */
export interface RentStatus {
  key: string
  label: string
}
export default {
  /**
   * 资产类型
   * @returns 资产类型列表
   */
  getAssetType() {
    return apiClient.post<AssetType[]>('/api/assets/assetType')
  },
  /**
   * 链上资产状态
   * @returns 链上资产状态
   */
  getSubmissionStatistics() {
    return apiClient.post<SubmissionStatistics>('/api/assets/submissionStatistics')
  },
  /**
   * 资产上链明细列表
   * @param data 分页数据
   * @returns
   */
  getSubmissionList(data: {
    page: number
    pageSize: number
    keyword?: string
    status?: string
  }) {
    return apiClient.post<DataListResponse<SubmissionData>>('/api/assets/submissionList', data)
  },
  /**
   * 资产运营状态
   * @returns
   */
  getAssetsOperationSummary() {
    return apiClient.post<AssetsOperationSummaryData>('/api/assetsInfo/operationSummary')
  },
  /**
   * 资产运营状态明细
   * @returns
   */
  getAssetsOperationList(data: {
    page: number
    pageSize: number
    keyword?: string
    status?: string
  }) {
    return apiClient.post<DataListResponse<AssetsOperationData>>('/api/assetsInfo/operationList', data)
  },
  /**
   * 提交资产信息
   * @param data 资产信息
   * @returns
   */
  saveAssetInfo(data: SubmitAssetInfo) {
    return apiClient.post<{
      properties_id: number
      submission_id: string
    }>('/api/assets/saveAssetInfo', data)
  },
  /**
   * 房产类型
   * @returns 房产类型
   */
  getAssetHouseType() {
    return apiClient.post<HouseType[]>('/api/assets/pType')
  },
  /**
   * 资产需要上传文件信息
   * @returns 上传的文件信息
   */
  getAssetTemplates(asset_type_id: number[]) {
    return apiClient.post<{
      list: AssetFileTemplates
    }>('/api/assets/templates', { asset_type_id })
  },
  /**
   * 获取资产信息
   * @param submission_id 资产id
   * @returns
   */
  getAssetInfo(submission_id: string) {
    return apiClient.post<AssetInfo>('/api/assets/submissionDetail', { submission_id })
  },
  /**
   * 保存资产租金收入
   * @param data 资产租金收入
   * @returns
   */
  saveRentIncome(data: SaveRentIncome) {
    return apiClient.post<{
      /**
       * 违约房产
       */
      default_properties: number
      /**
       * 本月应缴纳租金
       */
      monthly_due_amount: number
      /**
       * 正常房产
       */
      normal_properties: number
      /**
       * 待缴纳房产
       */
      pending_properties: number
      /**
       * 总房产
       */
      total_properties: number
    }>('/api/assetsinfo/saveRentIncome', data)
  },
  /**
   * 资产租金支付详情
   * @param data 资产租金支付详情
   * @returns
   */
  getRentPaymentDetails(data: {
    submission_id: string
  }) {
    return apiClient.post<RentPaymentDetails>('/api/assetsInfo/rentPaymentDetails', data)
  }
}
