// 商品分类全局组件的小仓库
import { defineStore } from 'pinia'
import { reqC1, reqC2, reqC3 } from '@/api/product/attr/attr'
import type { CategoryResponseData } from '@/api/product/attr/type'
import type { CategoryState } from './type/type'
let useCategoryStore = defineStore('Category', {
  state: (): CategoryState => {
    return {
      c1Arr: [], // 存储一级分类数据
      c1Id: '', // 收集一级分类的id
      c2Arr: [], // 存储二级分类数据
      c2Id: '', // 收集二级分类的id
      c3Arr: [], // 存储三级分类数据
      c3Id: '', // 收集三级分类的id
    }
  },
  actions: {
    async getC1() {
      let result: CategoryResponseData = await reqC1()
      if (result.code === 200) {
        this.c1Arr = result.data
      }
    },
    async getC2() {
      let result: CategoryResponseData = await reqC2(this.c1Id)
      if (result.code === 200) {
        this.c2Arr = result.data
      }
    },
    async getC3() {
        let result: CategoryResponseData = await reqC3(this.c2Id)
        if (result.code === 200) {
          this.c3Arr = result.data
        }
      },
  },
})

export default useCategoryStore
