import type { USER_AGREE } from '@/enum/common'
import type { ASSET_TYPE, USER_AUDIT_STATUS, USER_TYPE } from '@/enum/user'
import type { AccountType } from '@/enums/create-account.ts'
import apiClient from './client'

// 用户
export interface RegisterParams {
  mobile?: string
  email?: string
  password?: string
  wallet_address?: string
  type: AccountType
  id_card_front_url?: string
  id_card_back_url?: string
  address_url?: string
  photo_url?: string
  business_registration_document?: string
  shareholder_structure_url?: string
  legal_representative_documents_url?: string
  financial_documents_url?: string
  token?: string
  username?: string
  id_number?: string
  property_type?: number
  area?: number
  appraisement?: number
  prove_url?: string
}

export interface UserResponse {
  /**
   * 机构信息
   */
  appraiser_info: string
  /**
   * 资产方信息（企业）
   */
  company_info: string
  /**
   * 律师资料信息
   */
  law_firm: LawFirm
  /**
   * 资产方信息（个人）
   */
  personal_info: string
  /**
   * 用户信息
   */
  user: User
}

interface LawFirm {
  agree_compliance_promise: number
  agree_service_terms: number
  bar_membership_file: string
  create_date: number
  firm_license_file: string
  id: number
  lawyer_email: string
  lawyer_license_file: string
  lawyer_license_no: string
  /**
   * 律所名称
   */
  lawyer_name: string
  lawyer_phone: string
  lawyer_practice_years: number
  specialty: string
  update_date: number
  user_id: number
}

export interface User {
  /**
   * 地址
   */
  address: string
  /**
   * 是否同意《反洗钱承诺书》 1=是 0=否
   */
  agree_aml_statement: USER_AGREE
  /**
   * 是否同意《资产上链合规声明》 1=是 0=否
   */
  agree_asset_compliance: USER_AGREE
  /**
   * 审核日期
   */
  audit_date: number
  /**
   * 审核状态 0为未审核 1为已审核
   */
  audit_status: USER_AUDIT_STATUS
  /**
   * 头像
   */
  avatar: string
  birthday: null
  /**
   * 城市
   */
  city: string
  /**
   * 联系人姓名
   */
  contact_name: string
  /**
   * 国家
   */
  country: string
  create_time: number
  did: string
  /**
   * 邮箱
   */
  email: string
  /**
   * 机构主体类型id
   */
  entity_type_id: number
  gender: number
  group_id: number
  id: number
  /**
   * 身份证号码
   */
  id_number: string
  /**
   * 身份证类型
   */
  id_type: number
  in_wallet_address: string
  join_ip: string
  join_time: null
  last_login_ip: string
  last_login_time: number
  /**
   * 法人姓名
   */
  legal_rep_name: string
  login_failure: number
  /**
   * 联系方式
   */
  mobile: string
  money: number
  nationality: string
  /**
   * 用户名称
   */
  nickname: string
  /**
   * 昵称
   */
  petname: string
  /**
   * 个人简介
   */
  motto: string
  /**
   * 资产方类型 1为个人 2为企业
   */
  p_type: ASSET_TYPE
  password: string
  /**
   * 律所执业许可证号
   */
  practice_license_number: string
  /**
   * 省份
   */
  province: string
  /**
   * 原因
   */
  review_remark: string
  salt: string
  score: number
  status: string
  tx_hash: string
  /**
   * 3资产方 4 评估方 5 律师方
   */
  type: USER_TYPE
  update_time: number
  /**
   * 统一社会信用代码
   */
  uscc: string
  username: string
  /**
   * 钱包地址
   */
  wallet_address: string
  /**
   * 年份
   */
  year: number
  /**
   * 是否开启Google认证
   */
  ga_2fa_enabled: string
  /**
   * 是否开启短信认证
   */
  sms_2fa_enabled: string
  /**
   * 是否开启资产状态通知
   */
  notify_asset_status: string
  /**
   * 是否开启系统公告通知
   */
  notify_system_announcement: string
  /**
   * 是否开启账号活动通知
   */
  notify_account_activity: string
}

// 用户注册信息
export interface UserRegisterModel {
  /**
   * 办公地址 （type=4 必填）
   */
  address?: string
  /**
   * 是否同意《反洗钱承诺书》 1=是 0=否 （type=3 必填）
   */
  agree_aml_statement?: USER_AGREE
  /**
   * 是否同意《资产上链合规声明》 1=是 0=否（type=3 必填）
   */
  agree_asset_compliance?: USER_AGREE
  /**
   * 合规承诺 1=同意，0=不同意（type=5 必填）
   */
  agree_compliance_promise?: USER_AGREE
  /**
   * 平台注册服务协议  1=同意，0=不同意（type=5 必填）
   */
  agree_service_terms?: USER_AGREE
  /**
   * 反洗钱合规声明文件（type=4 必填）
   */
  anti_money_laundering_statement?: string
  /**
   * 律师协会会员证明（type=5 必填）
   */
  bar_membership_file?: string
  /**
   * 机构营业执照 （type=4 必填）
   */
  business_license?: string
  /**
   * 营业执照地址 （type=3 必填）
   */
  business_registration_document?: string
  /**
   * 主评估师（或负责人）的专业资格证书 （type=4 必填）
   */
  chief_appraiser_certificate?: string
  /**
   * 城市id
   */
  city?: string
  /**
   * 联系人姓名  （type=4 必填）
   */
  contact_name?: string
  /**
   * 国家Id
   */
  country?: string
  /**
   * 邮箱
   */
  email?: string
  /**
   * 机构类型Id （type=4 必填）
   */
  entity_type_id?: string
  /**
   * 机构评估资质等级证书（type=4 必填）
   */
  evaluation_qualification_certificate?: string
  /**
   * 律所执照扫描件（type=5 必填）
   */
  firm_license_file?: string
  /**
   * 身份证背面图片地址（type=3 必填）
   */
  id_card_back_url?: string
  /**
   * 身份证正面图片地址  （type=3 必填）
   */
  id_card_front_url?: string
  /**
   * 证件号码/法人证件号
   */
  id_number?: string
  /**
   * 主办律师执业证扫描件（type=5 必填）
   */
  lawyer_license_file?: string
  /**
   * 执业证编号 （type=5 必填）
   */
  lawyer_license_no?: string
  /**
   * 律师事务所名称 （type=5 必填）
   */
  lawyer_name?: string
  /**
   * 律师事务所联系方式（type=5 必填）
   */
  lawyer_phone?: string
  /**
   * 执业年限
   */
  lawyer_practice_years?: string
  /**
   * 法人姓名 （type=3 必填）
   */
  legal_rep_name?: string
  /**
   * 电话号码 /联系方式
   */
  mobile?: string
  /**
   * 姓名/企业全称/机构名称 /主办律师名称
   */
  nickname?: string
  /**
   * 机构介绍/办公场所照片 （type=4 必填）
   */
  office_photo?: string
  /**
   * 资产方类型  1为个人  2为企业 （type=3 必填）
   */
  p_type?: ASSET_TYPE
  /**
   * 律所执业许可证号（type=5 必填）
   */
  practice_license_number?: string
  /**
   * 省份id
   */
  province?: string
  /**
   * 服务协议文件 （type=4 必填）
   */
  service_agreement_file?: string
  /**
   * 是否已签署平台服务协议 0为否 1为是（type=4 必填）
   */
  service_agreement_status?: USER_AGREE
  /**
   * 专业领域（type=5 必填）
   */
  specialty?: string
  /**
   * 身份的Token
   */
  token?: string
  /**
   * 类型 3资产方 4 评估方 5 律师方
   */
  type?: USER_TYPE
  /**
   * 社会统一信用代码（type=3/4 必填）
   */
  uscc?: string
  /**
   * 成立年份 （type=4/5 必填）
   */
  year?: string
}

// 评估机构主体类型
export interface EntityTypeData {
  /**
   * 编码
   */
  code: string
  created_at: string
  /**
   * 说明/备注
   */
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
   * 日文
   */
  name_ja: string
  /**
   * 韩文
   */
  name_ko: string
  /**
   * 中文
   */
  name_zh_cn: string
  /**
   * 排序
   */
  order_index: number
  status: number
  updated_at: string
}

// 律师专业领域字典
export interface EntityTypeSpecialtyData {
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
 * 保存用户信息
 */
export interface SaveUserModel {
  /**
   * 邮箱
   */
  email?: string
  /**
   * 二次验证-Google Authenticator: 0=未启用,1=已启用
   */
  ga_2fa_enabled?: string
  /**
   * 手机号码
   */
  mobile?: string
  /**
   * 个人简介
   */
  motto?: string
  /**
   * 姓名
   */
  nickname?: string
  /**
   * 账户活动提醒: 0=关闭,1=开启
   */
  notify_account_activity?: string
  /**
   * 资产状态更新通知: 0=关闭,1=开启
   */
  notify_asset_status?: string
  /**
   * 系统公告通知: 0=关闭,1=开启
   */
  notify_system_announcement?: string
  /**
   * 昵称
   */
  petname?: string
  /**
   * 二次验证-短信验证: 0=未启用,1=已启用
   */
  sms_2fa_enabled?: string
  /**
   * 钱包地址
   */
  wallet_address?: string
}

export default {
  /**
   * 获取用户信息
   * @returns
   */
  getUserInfo() {
    return apiClient.post<UserResponse>('/api/user/getRegisterInfo')
  },
  /**
   * 资产方/评估方/律师 注册
   * @param data 用户信息
   * @returns
   */
  regitser(data: UserRegisterModel) {
    return apiClient.post<string>('/api/user/register', data)
  },
  /**
   * 评估机构主体类型
   * @returns
   */
  getEntityType() {
    return apiClient.get<EntityTypeData[]>('/api/EntityType/index')
  },
  /**
   * 律师专业领域字典
   * @returns
   */
  getEntityTypeSpecialty() {
    return apiClient.get<EntityTypeSpecialtyData[]>('/api/EntityType/specialty')
  },
  /**
   * 资产方/评估方/律师 重新提交注册
   * @param data 用户信息
   * @returns
   */
  resubmitRegister(data: UserRegisterModel) {
    return apiClient.post<string>('/api/user/resubmitRegister', data)
  },
  /**
   *  保存用户信息
   * @param data 用户信息
   * @returns
   */
  saveUserInfo(data: SaveUserModel) {
    return apiClient.post<string>('/api/info/saveInfo', data)
  }
}
