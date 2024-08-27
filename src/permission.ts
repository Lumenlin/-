// 路由鉴权
import router from '@/router'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import setting from './setting'

// 获取用户相关的小仓库中的token，用于判断用户是否登录
import useUserStore from '@/store/modules/user.ts'
// 在组件外部获取小仓库之前必须有大仓库
import pinia from './store'
nprogress.configure({ showSpinner: false })
let userStore = useUserStore(pinia)

// 全局前置守卫 访问某一个路由之前的守卫
router.beforeEach(async (to: any, from: any, next: any) => {
  document.title = `${setting.title} - ${to.meta.title}`
  //to:你将要访问那个路由
  //from:你从来个路由而来
  //next:路由的放行函数
  nprogress.start()
  // 获取token，判断用户是否登录
  let token = userStore.token
  let username = userStore.username
  if (token) {
    // 登陆成功后不能访问登录页面
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      if (username) {
        next()
      } else {
        // 如果没有用户信息，在守卫这里请求拿到用户信息在放行
        try {
          await userStore.userInfo()
          //刷新的时候是异步路由,有可能获取到用户信息、但是异步路由还没有加载完毕,就会出现空白的效果
          next({ ...to })
        } catch (error) {
          // 两种情况：1.token过期  2.用户手动修改了token信息
          // 解决：退出登录，清空用户信息，再跳转到登录页
          await userStore.userLogout()
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  } else {
    //用户未登录判断
    if (to.path === '/login') next()
    else next({ path: '/login', query: { redirect: to.path } })
  }
})
// 全局后置守卫
router.afterEach((to: any, from: any) => {
  nprogress.done()
})
