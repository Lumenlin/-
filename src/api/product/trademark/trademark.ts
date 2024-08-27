// 定义品牌管理模块的接口
import request from '@/utils/request'
import type { TradeMarkResponseData, TradeMark } from './type.ts'

enum API {
  TRADEMARK_URL = '/admin/product/baseTrademark/',
  ADDTRADEMARK_URL = '/admin/product/baseTrademark/save',
  UPDATETRADEMARK_URL = '/admin/product/baseTrademark/update',
  REMOVETRADEMARK_URL = '/admin/product/baseTrademark/remove/',
}

// 获取已有品牌的接口方法
// page:获取第几页---默认第一页
// limit:获取几个已有品牌的额数据
export const reqHasTrademark = (page: number, limit: number) =>
  request.get<any, TradeMarkResponseData>(API.TRADEMARK_URL + `${page}/${limit}`)

// 新增与修改品牌的接口
export const reqAddOrUpdateTrademark = (data: TradeMark) => {
  // 修改品牌
  if (data.id) {
    return request.put<any, any>(API.UPDATETRADEMARK_URL, data)
  } else {
    return request.post<any, any>(API.ADDTRADEMARK_URL, data)
  }
}

// 删除某个品牌的方法
export const reqRemoveTrademark = (id: number) => request.delete<any,any>(API.REMOVETRADEMARK_URL + id)
