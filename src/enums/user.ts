/**
 * 用户审核状态
 */
export enum USER_AUDIT_STATUS {
  /**
   * 待审核
   */
  WAIT = 0,
  /**
   * 审核通过
   */
  PASS = 1,
  /**
   * 审核拒绝
   */
  REJECT = 2
}

/**
 * 用户身份
 */
export enum ASSET_TYPE {
  /**
   * 个人
   */
  PERSON = 1,
  /**
   * 企业
   */
  COMPANY = 2
}

/**
 * 用户类型
 */
export enum USER_TYPE {
  /**
   * 3资产方
   */
  ASSET = 3,
  /**
   * 4评估方
   */
  ASSESS = 4,
  /**
   * 5律师方
   */
  LAWYER = 5
}

export enum UserCode {
  /**
   * 已登录
   */
  LoggedIn = 1,

  /**
   * 不存在
   */
  NotExist = 401,

  /**
   * 未审核
   */
  NotAudited = 408
}
