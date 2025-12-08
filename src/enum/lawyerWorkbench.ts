// 案件状态
export enum PENDING_CASE_STATUS {
  /**
   * 待初审
   */
  PENDING_INITIAL = 1,
  /**
   * 待线下认领
   */
  PENDING_OFFLINE = 6,
  /**
   * 线下已认领
   */
  OFFLINE_CLAIMED = 7,
  /**
   * 已提交线下资料
   */
  OFFLINE_DOCUMENT_SUBMITTED = 8
}
/**
 * 申请状态 0为未申请 1为处理中 2为已通过 3为异常
 */
export enum APPLICATION_STATUS {
  /**
   * 未申请
   */
  UNAPPLIED = 0,
  /**
   * 处理中
   */
  PROCESSING = 1,
  /**
   * 已通过
   */
  APPROVED = 2,
  /**
   * 异常
   */
  EXCEPTION = 3
}

/**
 * 线下处理步骤 1为材料准备 2：窗口提交 3 信息核验 4盖章确权 5 完成  -1异常
 */
export enum PROCESS_STEP {
  /**
   * 材料准备
   */
  MATERIAL_PREPARATION = 1,
  /**
   * 窗口提交
   */
  WINDOW_SUBMISSION = 2,
  /**
   * 信息核验
   */
  INFORMATION_VERIFICATION = 3,
  /**
   * 盖章确权
   */
  STAMPING_AUTHORIZATION = 4,
  /**
   * 完成
   */
  COMPLETED = 5,
  /**
   * 异常
   */
  EXCEPTION = -1
}
