export interface FristFormData {
  // 资产类型 ID
  asset_type_id: number

  // 资产名称
  name: string

  // 房产类型
  property_type: number

  // 建筑面积
  area: number

  // 建筑年限
  house_life: number

  // 卧室数量
  bedrooms: number

  // 缴租日期
  rent_day: number

  // 链ID
  chain_id: number

  // 月租金（可选）
  monthly_rent: number

  // 预计年回报率（可选）
  expected_annual_return: number

  // 预计年化收益下限（可选）
  annual_return_min: number

  // 预计年化收益上限（注意：原代码中name属性有拼写错误）
  annual_return_max: number // 建议修正为 annual_return_max

  // 经度（可选）
  longitude: number

  // 纬度（可选）
  latitude: number

  // 邮编
  postcode: number

  // 国家编码
  country_id: number

  // 城市编码
  city: number

  // 房产描述
  property_description: string

  // 位置描述（可选）
  location: string

  // 房产地址
  address: string
}
