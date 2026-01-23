// 是否同意
export enum USER_AGREE {
  /**
   * 是
   */
  YES = 1,
  /**
   * 否
   */
  NO = 0
}

// 是否必填
export enum IS_REQUIRED {
  /**
   * 是
   */
  YES = 1,
  /**
   * 否
   */
  NO = 0
}

// 输入值的格式类型
export enum INPUT_FORMAT_TYPE {
  /**
   * 字符串
   */
  STRING = 'STRING',
  /**
   * 文本
   */
  TEXT = 'TEXT',
  /**
   * 整数
   */
  INT = 'INT',
  /**
   * 小数
   */
  DECIMAL = 'DECIMAL',
  /**
   * 日期 YYYY-MM-DD
   */
  DATE = 'DATE',
  /**
   * 时间 YYYY-MM-DD HH:MM:SS
   */
  DATETIME = 'DATETIME',
  /**
   * 布尔
   */
  BOOL = 'BOOL',
  /**
   * 枚举
   */
  ENUM = 'ENUM',
  /**
   * 多选枚举
   */
  MULTI_ENUM = 'MULTI_ENUM',
  /**
   * 文件
   */
  FILE = 'FILE',
  /**
   * 地址
   */
  ADDRESS = 'ADDRESS',
  /**
   * JSON
   */
  JSON = 'JSON'
}

// 输入ui的类型
export enum INPUT_UI_TYPE {
  /**
   * 输入框
   */
  INPUT = 'INPUT',
  /**
   * 文本域
   */
  TEXTAREA = 'TEXTAREA',
  /**
   * 数字
   */
  NUMBER = 'NUMBER',
  /**
   * 日期选择器
   */
  DATEPICKER = 'DATEPICKER',
  /**
   * 复选框
   */
  CHECKBOX = 'CHECKBOX',
  /**
   * 单选框
   */
  RADIO = 'RADIO',
  /**
   * 下拉选择
   */
  SELECT = 'SELECT',
  /**
   * 多选下拉
   */
  MULTISELECT = 'MULTISELECT',
  /**
   * 上传
   */
  UPLOAD = 'UPLOAD'
}

/**
 * 审核状态
 */
export enum REVIEW_STATUS {
  /**
   * 0为待审核
   */
  PENDING = 0,
  /**
   * 1为已审核
   */
  APPROVED = 1,
  /**
   * 2为审核驳回
   */
  REJECTED = 2,
  /**
   * -1=已撤回
   */
  WITHDRAWN = -1
}

/**
 * 提交状态
 */
export enum SUBMISSION_STATUS {
  /**
   * 0是未提交
   */
  PENDING = 0,
  /**
   * 1是已提交
   */
  APPROVED = 1
}
