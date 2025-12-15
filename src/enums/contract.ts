export enum ContractError {

  /**
   * 合约内部异常
   */
  Error_Fail = 4001,

  /**
   * 用户取消操作
   */
  Error_Cancle = 4002,

  /**
   * 用户支付金额不足
   */
  Error_Insufficient_Balance = 4003,

  /**
   * 合约自定义异常
   */
  Error_User_Custom = 5001
}
