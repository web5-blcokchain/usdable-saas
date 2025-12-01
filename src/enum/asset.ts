/**
 * 资产状态
 */
export enum ASSET_STATUS {
  /**
   * 草稿
   */
  DRAFT = -1,
  /**
   * 0 待审核
   */
  PENDING_REVIEW = 0,
  /**
   * 1 律师已确认
   */
  LAWYER_CONFIRMED = 1,
  /**
   * 2 为审核驳回
   */
  LAWYER_REJECTED = 2,
  /**
   * 3 律师已审核
   */
  LAWYER_REVIEWED = 3,
  /**
   * 4 评估方已认领
   */
  ASSESSOR_CLAIMED = 4,
  /**
   * 5 评估方已驳回
   */
  ASSESSOR_REJECTED = 5,
  /**
   * 6 评估方已评估
   */
  ASSESSOR_EVALUATED = 6,
  /**
   * 7 律师已认领线下
   */
  LAWYER_CLAIMED_OFFLINE = 7,
  /**
   * 8 律师线下上传材料
   */
  LAWYER_UPLOADED_MATERIALS = 8,
  /**
   * 9 资产已上链
   */
  ASSET_ON_CHAIN = 9
}

/**
 * 资产风险
 */
export enum RISK_STATUS {
  /**
   * 1 正常
   */
  NORMAL = 1,
  /**
   * 2 宽限期
   */
  GRACE_PERIOD = 2,
  /**
   * 3 升级逾期
   */
  UPGRADE_OVERDUE = 3,
  /**
   * 4 违约理赔期
   */
  DEFAULT_CLAIM_PERIOD = 4,
  /**
   * 5 保险理赔
   */
  INSURANCE_CLAIM = 5,
  /**
   * 6 清算
   */
  SETTLEMENT = 6,
  /**
   * 7 拍卖成功
   */
  AUCTION_SUCCESS = 7,
  /**
   * 8 拍卖失败
   */
  AUCTION_FAILURE = 8
}

/**
 * 交租状态
 */
export enum PROPERTY_STATUS {
  /**
   * 0 未知
   */
  UNKNOWN = 0,
  /**
   * 1 正常
   */
  NORMAL = 1,
  /**
   * 2 待缴纳
   */
  AWAITING_PAYMENT = 2,
  /**
   * 3 逾期
   */
  OVERDUE = 3
}

/**
 * 销售状态
 */
export enum SALE_STATUS {
  /**
   * 0 未销售
   */
  NOT_SOLD = 0,
  /**
   * 1 销售中
   */
  ON_SALE = 1,
  /**
   * 2 售罄
   */
  SOLD_OUT = 2,
  /**
   * 3 已退出
   */
  EXITED = 3
}

/**
 * 审核步骤：0:资料提交 1：律师认领 2：律师驳回 3：律师审核通过 4：评估方认领 5 ：评估方驳回 6：评估方审核通过 7：律师线下提交资料成功 8：资产上链成功
 */
export enum ASSET_AUDIT_SUBMISSION_STATUS {
  /**
   * 0:资料提交
   */
  MATERIAL_SUBMITTED = 0,
  /**
   * 1：律师认领
   */
  LAWYER_CLAIMED = 1,
  /**
   * 2：律师驳回
   */
  LAWYER_REJECTED = 2,
  /**
   * 3：律师审核通过
   */
  LAWYER_REVIEWED = 3,
  /**
   * 4：评估方认领
   */
  ASSESSOR_CLAIMED = 4,
  /**
   * 5 ：评估方驳回
   */
  ASSESSOR_REJECTED = 5,
  /**
   * 6：评估方审核通过
   */
  ASSESSOR_REVIEWED = 6,
  /**
   * 7：律师线下提交资料成功
   */
  LAWYER_OFFLINE_SUBMISSION_SUCCESS = 7,
  /**
   * 8：资产上链成功
   */
  ASSET_ON_CHAIN = 8
}

/**
 * 审核人角色 1为资产方 2为 律师 3为评估 4为平台管理员
 */
export enum ASSET_AUDITOR_ROLE {
  /**
   * 1为资产方
   */
  ASSET_OWNER = 1,
  /**
   * 2为 律师
   */
  LAWYER = 2,
  /**
   * 3为评估
   */
  ASSESSOR = 3,
  /**
   * 4为平台管理员
   */
  PLATFORM_ADMIN = 4
}

export enum ASSET_SUBMISSION_STATUS {
  /**
   * 草稿
   */
  DRAFT = -1,
  /**
   * 待审核
   */
  PENDING = 0,
  /**
   * 审核通过
   */
  APPROVED = 1,
  /**
   * 审核驳回
   */
  REJECTED = 2
}
