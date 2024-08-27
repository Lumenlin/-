// 统一管理与用户相关的接口
import request from '@/utils/request'
import type { loginFormData, loginResponseData, userInfoResponseData } from './type'
// 统一管理接口
// 项目用户相关的请求地址
enum API {
    LOGIN_URL = '/admin/acl/index/login',
    USERIFON_URL = '/admin/acl/index/info',
    LOGOOUT_URL = '/admin/acl/index/logout',
}

// 登录接口
export const reqLogin = (data: loginFormData) => request.post<any, loginResponseData>(API.LOGIN_URL, data)

// 获取用户信息
export const reqUserInfo = () => request.get<any, userInfoResponseData>(API.USERIFON_URL)

// 退出登录
export const reqLogout = () => request.post<any, any>(API.LOGOOUT_URL)
