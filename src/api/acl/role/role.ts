// 角色管理相关的接口
import request from '@/utils/request'
import type { RoleResponseData, RoleData, MenuResponseData } from './type'

enum API {
  // 获取全部角色的接口
  ALLROLE_URL = '/admin/acl/role/',
  // 新增角色的接口
  ADDROLE_URL = '/admin/acl/role/save',
  // 更新已有的角色
  UPDATEROLE_URL = '/admin/acl/role/update',
  // 分配权限获取全部权限与已勾选的权限
  ALLPERMISSION_URL = '/admin/acl/permission/toAssign/',
  // 给角色分配权限
  SETPERMISSION_URL = '/admin/acl/permission/doAssign/?',
  // 删除角色
  DELETEROLE_URL = '/admin/acl/role/remove/',
}

// 获取全部角色的接口
export const reqAllRole = (page: number, limit: number, roleName: string) =>
  request.get<any, RoleResponseData>(API.ALLROLE_URL + `${page}/${limit}/?roleName=${roleName}`)

// 新增和更新角色
export const reqAddOrUpdateRole = (data: RoleData) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATEROLE_URL, data)
  } else {
    return request.post<any, any>(API.ADDROLE_URL, data)
  }
}

// 获取所有权限与已勾选的权限
export const reqAllMenuList = (roleId: number) => request.get<any, MenuResponseData>(API.ALLPERMISSION_URL + roleId)

// 给相应的角色分配权限
export const reqSetPermission = (roleId: number, permissionId: number[]) =>
  request.post(API.SETPERMISSION_URL + `roleId=${roleId}&permissionId=${permissionId}`)

// 删除角色
export const reqDeleteRole = (roleId: number) => request.delete<any,any>(API.DELETEROLE_URL + roleId)
