import type { DataListResponse } from './responseData'
import apiClient from './client'

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
 4评估方已认领 5 评估方已驳回 6 评估方已评估7：律师已认领线下 8律师线下上传材料 9资产已上链
   */
  status: number
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
  property_status: number
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
  submission_status: number
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
  files: File[]
  /**
   * 状态 提交审核 不传为保存草稿
   */
  status: string
  /**
   * 资产id 编辑的时候用到
   */
  submission_id: string
  /**
   * 模板id
   */
  template_id: number
  [property: string]: any
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
  annual_return_max: string
  /**
   * 年化收益下线
   */
  annual_return_min: string
  /**
   * 面积
   */
  area: string
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
  city: string
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
  property_type: string
  /**
   * 缴纳房租日
   */
  rent_day: number
}

export interface File {
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
  saveAssetInfo(data: BasicInfo) {
    return apiClient.post<{
      /**
       * 编码
       */
      code: string
      id: number
      /**
       * 房产类型名称
       */
      name: string
    }>('/api/assets/saveAssetInfo', data)
  },
  /**
   * 房产类型
   * @returns 房产类型
   */
  getAssetHouseType() {
    return apiClient.post<HouseType[]>('/api/assets/pType')
  }
}
