// layout组件相关配置的仓库
import {defineStore} from 'pinia';
let useLayoutSettingStore=defineStore('SettingStore', {
    state:()=>{
        return {
            fold:false,  //用于左上角图标切换，控制菜单折叠还是展开
            refsh:false, //用于控制刷新效果
        }
    }
})

export default useLayoutSettingStore;