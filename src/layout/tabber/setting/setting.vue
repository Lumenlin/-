<template>
  <el-button size="small" icon="Refresh" circle @click="updateRefsh"></el-button>
  <el-button size="small" icon="FullScreen" circle @click="fullScreen"></el-button>
  <el-popover placement="top-start" title="主题设置" :width="250" trigger="hover">
    <el-form>
      <el-form-item label="主题颜色">
        <el-color-picker @change="setColor" v-model="color" size="small" show-alpha :teleported="false" />
      </el-form-item>
      <el-form-item label="暗黑模式">
        <el-switch @change="changeDark" v-model="dark" inline-prompt active-icon="MoonNight" inactive-icon="Sunny" />
      </el-form-item>
    </el-form>
    <template #reference>
      <el-button size="small" icon="Setting" circle></el-button>
    </template>
  </el-popover>
  <img :src="userStore.avatar" alt="" style="width: 24px; height: 24px; margin: 0 10px" />
  <!-- 下拉菜单 -->
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  // 获取layout相关配置的小仓库
  import useLayoutSettingStore from '@/store/modules/setting.ts'
  import useUserStore from '@/store/modules/user.ts'
  let layoutSettingStore = useLayoutSettingStore()
  let userStore = useUserStore()
  let $router = useRouter()
  let $route = useRoute()
  let dark = ref<boolean>(false) // 控制暗黑模式开关
  // 颜色组件的数据
  const color = ref('rgba(255, 69, 0, 0.68)')
  // 刷新的方法
  const updateRefsh = () => {
    layoutSettingStore.refsh = !layoutSettingStore.refsh
  }
  // 全屏的方法
  const fullScreen = () => {
    // DOM对象的一个属性:可以用来判断当前是不是全屏模式 [全屏:true,不是全屏:false]
    let full = document.fullscreenElement
    if (!full) {
      //文档根节点的方法requestFullscreen,实现全屏模式
      document.documentElement.requestFullscreen()
    } else {
      // 退出全屏模式
      document.exitFullscreen()
    }
  }
  // 退出登录的方法
  const logout = async () => {
    // 1.向服务器发请求[退出登录接口]
    // 2.清空仓库当中关于用户相关的数据[ token| username | avatar]
    // 3.跳转到登录页面
    await userStore.userLogout()
    // query 必须是一个对象
    $router.push({ path: '/login', query: { redirect: $route.path } })
  }

  // 暗黑模式开关的change事件
  const changeDark = () => {
    // 获取html根节点
    const html = document.documentElement
    // dark为真表示开启暗黑模式，即需要给html加上类名dark
    dark.value ? (html.className = 'dark') : (html.className = '')
  }

  // 设置主题颜色的change事件
  const setColor = () => {
    // 通知js修改根节点的样式对象的属性与属性值
    const html = document.documentElement
    html.style.setProperty('--el-color-primary', color.value)
  }
</script>
<script lang="ts">
  export default {
    name: 'Setting',
  }
</script>

<style scoped lang="scss"></style>
