import type { RouteRecordRaw } from 'vue-router'
import type { CategoryObj } from '@/api/product/attr/type'
import { RouteRecordName } from 'vue-router'

// 定义小仓库数据state类型
export interface UserState {
  token: string | null
  menuRoutes: RouteRecordRaw[]
  username: string
  avatar: string
  dynamicRoutes:RouteRecordName[]
  buttons:string[]
}

// 定义分类仓库state对像的ts类型
export interface CategoryState {
  c1Id: string | number
  c1Arr: CategoryObj
  c2Id: string | number
  c2Arr: CategoryObj
  c3Arr: CategoryObj
  c3Id: string | number
}
