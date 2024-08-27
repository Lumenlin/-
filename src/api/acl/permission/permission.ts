// 菜单管理相关的接口
import request from '@/utils/request'
import type { PermissionResponseData, MenuParams } from './type'

enum API {
  // 获取全部菜单与按钮的标识数据
  ALLPERMISSION_URL = '/admin/acl/permission',
  // 给某一级菜单新增子菜单
  ADDPERMISSION_URL = '/admin/acl/permission/save',
  // 更新某一个已有的菜单
  UPDATEPERMISSION_URL = '/admin/acl/permission/update',
  // 删除某一个菜单
  REMOVEPERMISSION_URL = '/admin/acl/permission/remove/',
}

// 获取菜单数据
export const reqAllPermission = () => request.get<any, PermissionResponseData>(API.ALLPERMISSION_URL)

// 给某一级菜单新增子菜单或更新已有菜单
export const reqAddOrUpdatePermission = (data: MenuParams) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATEPERMISSION_URL, data)
  } else {
    return request.post<any, any>(API.ADDPERMISSION_URL, data)
  }
}

// 删除某个已有菜单
export const reqRemovePermission = (id: number) => request.delete<any, any>(API.REMOVEPERMISSION_URL + id)
