// 引入项目中全部的全局组件
import SvgIcon from './SvgIcon/index.vue'
import Pagination from './Pagination/index.vue'
import Category from './Category/index.vue'
// 引入element-plus的全部图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 全局对象
const allGloablComponent = { SvgIcon, Pagination, Category }

// 对外暴露插件对象
export default {
  // 务必叫做instal方法
  install(app: any) {
    // 注册项目全部的全局组件
    Object.keys(allGloablComponent).forEach(key => {
      // 注册为全局组件
      // app.component('组件名称','组件')
      app.component(key, allGloablComponent[key])
    })
    // 将element-plus提供的图标注册为全局组件
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  },
}
