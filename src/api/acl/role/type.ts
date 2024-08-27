export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 角色数据的ts类型
export interface RoleData {
  id?: number
  createTime?: string
  updateTime?: string
  roleName: string
  remark?: null
}

// 全部角色的数组的ts类型
export type Records = RoleData[]

// 全部职位数据相应的ts类型
export interface RoleResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    pages: number
    order: []
    optimizeCountSql: boolean
    hitCount: boolean
    countId: null
    maxLimit: null
    searchCount: boolean
  }
}

// 权限数据的ts类型
export interface MenuData {
  id: number
  createTime: string
  updateTime: string
  pid: number
  name: string
  code: string
  toCode: string
  type: number
  status: null
  level: number
  children: []
  select: boolean
}

export type MenuList = MenuData[]

// 权限接口数据返回的ts类型
export interface MenuResponseData extends ResponseData {
  data: MenuList
}
