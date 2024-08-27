// 创建用户相关的仓库
import { defineStore } from 'pinia'
// 引入接口
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
import type { loginFormData, loginResponseData, userInfoResponseData } from '@/api/user/type'

import type { UserState } from './type/type'
import router from '@/router'
//引入深拷贝方法
//@ts-expect-error
import cloneDeep from 'lodash/cloneDeep'
// 引入操作本地存储数据的方法
import { SET_TOKEN, GET_TOKEN, DEL_TOKEN } from '@/utils/token'
// 引入路由
import { constantRoute, asyncRoute, anyRoute } from '@/router/routes'

// 用于过滤当前用户需要展示的异步路由
function filterAsyncRoute(asyncRoute: any, routes: any) {
  return asyncRoute.filter((item: any) => {
    if (routes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        item.children = filterAsyncRoute(item.children, routes)
      }
      return true
    }
  })
}

// 创建用户小仓库
let useUserStore = defineStore('User', {
  // 小仓库储存数据的地方
  state: (): UserState => {
    return {
      token: GET_TOKEN(), // 用户唯一标识符
      menuRoutes: constantRoute, // 仓库存储生成菜单需要的数据（路由）
      username: '', // 用户名
      avatar: '', // 头像
      dynamicRoutes: [], //用于保存所有动态添加的路由名称。
      buttons: [], // 存储当前用户是否包含某一个按钮
    }
  },
  // 异步|逻辑的地方
  actions: {
    // 用户登录的方法
    async userLogin(data: loginFormData) {
      let result: loginResponseData = await reqLogin(data)

      // 成功200 => token
      if (result.code === 200) {
        // pinia/vuex存储数据其实是利用js对象
        this.token = result.data
        // 本地持久化存储一份
        SET_TOKEN(result.data)
        // 保证当前async函数返回一个成功的Promise对象
        return 'ok'
      } else {
        return Promise.reject(new Error(result.data))
      }
    },
    // 获取用户信息的方法
    async userInfo() {
      //获取用户信息存储在仓库中
      let result: userInfoResponseData = await reqUserInfo()

      if (result.code === 200) {
        this.username = result.data.name
        this.avatar = result.data.avatar
        // 获取当前用户需要展示的异步路由
        let userAsyncRoute = filterAsyncRoute(cloneDeep(asyncRoute), result.data.routes)

        this.menuRoutes = [...constantRoute, ...userAsyncRoute, ...anyRoute]

        // 目前路由器管理的只有常量路由:用户计算完毕异步路由、任意路由动态追加
        ;[...userAsyncRoute, ...anyRoute].forEach((route: any) => {
          router.addRoute(route)
          this.dynamicRoutes.push(route.name) // 保存动态路由名称
        })

        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
    // 退出登录
    async userLogout() {
      let result: any = await reqLogout()
      if (result.code === 200) {
        this.token = ''
        this.username = ''
        this.avatar = ''
        DEL_TOKEN()
        // 删除动态添加的路由
        this.dynamicRoutes.forEach((routeName: any) => {
          router.removeRoute(routeName)
        })
        // 清空保存的动态路由名称
        this.dynamicRoutes = []
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
  },
  getters: {},
})

// 对外暴露获取小仓库的方法
export default useUserStore

