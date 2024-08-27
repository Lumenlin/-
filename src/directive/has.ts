import useUserStore from '@/store/modules/user'
let userStore = useUserStore()
export const isHasButton = (app: any) => {
  // 自定义指令：实现按钮权限
  app.directive('has', {
    //代表使用这个全局自定义指令的DOM|组件挂载完毕的时候会执行一次
    mounted(el: any, options: any) {
      // 自定义指令右侧的数值：如果在用户信息buttons数组中没有就从DOM树上删除
      if (!userStore.buttons.includes(options.value)) {
        el.parentNode.removeChild(el)
      }
    },
  })
}
