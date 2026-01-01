export interface AxiosResponse<T> {
  code: number
  message: string
  data: T
}
