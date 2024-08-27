// SPU管理相关的接口
import request from '@/utils/request'
import {
  HasSpuResponseData,
  AllTrademark,
  SpuHasImg,
  SaleAttrResponseData,
  HasSaleAttrResponseData,
  SpuData,
  SkuData,
  SkuInfoData
} from './type'

enum API {
  // 获取已有的spu数据
  HASSPU_URL = '/admin/product/',
  // 所有品牌的数据
  ALLTRADEMARK_URL = '/admin/product/baseTrademark/getTrademarkList',
  // 获取某个spu下的全部的售卖商品的图片数据
  IMAGE_URL = '/admin/product/getSpuInfo/',
  // 获取某一个spu下全部的销售属性的接口（已有的展示出来的）
  SPUHASSALEATTR_URL = '/admin/product/spuSaleAttrList/',
  // 获取整个项目全部已有的销售属性【颜色、版本】
  ALLSALEATTR_URL = '/admin/product/baseSaleAttrList',
  // 添加spu
  ADDSPU_URL = '/admin/product/saveSpuInfo',
  // 更新已有的spu
  UPDATESPU_URL = '/admin/product/updateSpuInfo',
  //追加一个新增的SKU地址
  ADDSKU_URL = '/admin/product/saveSkuInfo',
  //查看某一个已有的SPU下全部售卖的商品
  SKUINFO_URL = '/admin/product/findBySpuId/',
  //删除已有的SPU
  REMOVESPU_URL = '/admin/product/deleteSpu/',
}

export const reqHasSpu = (page: number, limit: number, category3Id: number | string) =>
  request.get<any, HasSpuResponseData>(API.HASSPU_URL + `${page}/${limit}?category3Id=${category3Id}`)

// 获取全部品牌的数据
export const reqAllTrademark = () => request.get<any, AllTrademark>(API.ALLTRADEMARK_URL)

// 获取某个已有的spu下全部商品的图片
export const reqSpuImageList = (spuId: number) => request.get<any, SpuHasImg>(API.IMAGE_URL + spuId)

// 获取全部展示的销售属性
export const reqHasSaleAttr = (spuId: number) => request.get<any, SaleAttrResponseData>(API.SPUHASSALEATTR_URL + spuId)

// 获取某一个spu下全部的已有销售属性
export const reqAllSaleAttr = () => request.get<any, HasSaleAttrResponseData>(API.ALLSALEATTR_URL)
// 添加spu和更新已有的spu
export const reqAddSpu = (data: SpuData) => {
  if (data.id) {
    return request.post<any, any>(API.UPDATESPU_URL, data)
  } else {
    return request.post<any, any>(API.ADDSPU_URL, data)
  }
}

//添加SKU的请求方法
export const reqAddSku = (data: SkuData) => request.post<any, any>(API.ADDSKU_URL, data)

//获取SKU数据
export const reqSkuList = (spuId: number | string) => request.get<any, SkuInfoData>(API.SKUINFO_URL + spuId)

//删除已有的SPU
export const reqRemoveSpu = (spuId: number | string) => request.delete<any, any>(API.REMOVESPU_URL + spuId)
