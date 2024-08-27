<template>
  <div class="layout-container">
    <!-- 左侧菜单 -->
    <div class="layout-slider">
      <Logo></Logo>
      <!-- 展示菜单 -->
      <el-scrollbar class="scrollbar">
        <!-- 根据路由动态生成菜单 -->
        <el-menu
          :collapse="layoutSettingStore.fold ? true : false"
          :dafault-active="$route.path"
          background-color="#001529"
          text-color="white">
          <Menu :menuList="userStore.menuRoutes"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 顶部导航 -->
    <div class="layout-tabber" :class="{ fold: layoutSettingStore.fold ? true : false }">
      <Tabber></Tabber>
    </div>
    <!-- 内容展示区域 -->
    <div class="layout-mian" :class="{ fold: layoutSettingStore.fold ? true : false }">
      <Main></Main>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useRoute } from 'vue-router'
  // 引入左侧菜单logo子组件
  import Logo from './logo/logo.vue'
  // 引入菜单组件
  import Menu from './menu/menu.vue'
  // 引入右侧内容展示区
  import Main from './main/main.vue'
  // 引入顶部tabber组件
  import Tabber from './tabber/tabber.vue'
  // 获取用户相关的小仓库
  import useUserStore from '@/store/modules/user'
  import useLayoutSettingStore from '@/store/modules/setting.ts'
  // 获取路由对象
  let $route = useRoute()
  let userStore = useUserStore()
  // 获取layout配置仓库
  let layoutSettingStore = useLayoutSettingStore()
</script>

<script lang="ts">
  export default {
    name: 'Layout',
  }
</script>

<style scoped lang="scss">
  .layout-container {
    width: 100%;
    height: 100vh;
    .layout-slider {
      color: white;
      width: $base-menu-width;
      height: 100vh;
      background-color: $base-menu-background;
      transition: all 0.3s;
      .scrollbar {
        width: 100%;
        height: calc(100vh - $base-logo-height);
        .el-menu {
          border-right: none;
        }
      }
    }
    .layout-tabber {
      position: fixed;
      left: $base-menu-width;
      top: 0;
      width: calc(100% - $base-menu-width);
      height: $base-tabber-height;
      transition: all 0.3s;
      background-color: white;
      &.fold {
        width: calc(100vw - $base-menu-min-width);
        left: $base-menu-min-width;
      }
      .dark & {
        background-color: black;
      }
    }
    .layout-mian {
      position: absolute;
      width: calc(100% - $base-menu-width);
      height: calc(100vh - $base-tabber-height);
      left: $base-menu-width;
      top: $base-tabber-height;
      padding: 20px;
      overflow: auto;
      transition: all 0.3s;
      background-color: white;
      // &.fold表示当前选择器与 .fold 类名组合在一起，也就是多一个fold类
      &.fold {
        width: calc(100vw - $base-menu-min-width);
        left: $base-menu-min-width;
      }
      // .dark &表示当父元素具有 .dark 类时，应用该样式规则
      .dark & {
        background-color: black;
      }
    }
  }
</style>
