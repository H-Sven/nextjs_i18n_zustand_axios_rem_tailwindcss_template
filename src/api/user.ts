import { del, get, patch, post, put } from '@/lib/request'

// 定义接口返回的数据类型
interface LoginData {
  token: string
  userInfo: {
    id: string
    name: string
  }
}

interface UserInfo {
  id: string
  name: string
  email: string
}

/**
 * 登录接口 (POST)
 */
export const loginApi = (data: { username: string; password: string }) => {
  return post<LoginData>('/auth/login', data)
}

/**
 * 获取用户信息 (GET)
 */
export const getUserInfoApi = (id: string) => {
  return get<UserInfo>(`/users/${id}`)
}

/**
 * 更新用户信息 (PUT - 全量更新)
 */
export const updateUserInfoApi = (id: string, data: UserInfo) => {
  return put<UserInfo>(`/users/${id}`, data)
}

/**
 * 更新用户部分信息 (PATCH - 局部更新)
 */
export const patchUserInfoApi = (id: string, data: Partial<UserInfo>) => {
  return patch<UserInfo>(`/users/${id}`, data)
}

/**
 * 删除用户 (DELETE)
 */
export const deleteUserApi = (id: string) => {
  return del(`/users/${id}`)
}
