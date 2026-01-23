/**
 * 资产状态
 */
export enum ASSET_EVALUATIO_STATUS {
  /**
   * 待认领
   */
  PENDING_CLAIM = 3,
  /**
   * 已认领
   */
  CLAIMED = 4,
  /**
   * 已驳回
   */
  REJECTED = 5,
  /**
   * 已评估
   */
  EVALUATED = 6,
  /**
   * 已完成
   */
  COMPLETED = 9
}
