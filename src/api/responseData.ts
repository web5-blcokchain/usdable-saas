export interface ResponseData<T> {
  code: number
  msg: string
  data: T
  time: number
}
export interface DataListResponse<T> {
  count: number
  list: T[]
  page: number
  pageSize: number
}
export interface ResponseListData<T> {
  code: number
  msg: string
  data: DataListResponse<T>
}
