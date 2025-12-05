/**
 * 通知类型（1.用户审核  2.房子上链成功  3.房产违约  4公告）
 */
export enum MESSAGE_TYPE {
  /**
   * 用户审核
   */
  USER_AUDIT = '1',
  /**
   * 资产上链成功
   */
  ASSET_ONCHAIN_SUCCESS = '2',
  /**
   * 房产违约
   */
  PROPERTY_DEFAULT = '3',
  /**
   * 公告
   */
  ANNOUNCEMENT = '4'
}

/**
 * 状态 0未读 1已读
 */
export enum MESSAGE_STATUS {
  /**
   * 未读
   */
  UNREAD = 0,
  /**
   * 已读
   */
  READ = 1
}
