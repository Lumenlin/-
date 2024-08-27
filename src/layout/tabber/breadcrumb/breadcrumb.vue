<template>
  <el-icon style="margin-right: 20px" @click="changeIcon">
    <component :is="layoutSettingStore.fold ? 'Fold' : 'Expand'"></component>
  </el-icon>
  <!-- 左侧面包屑 -->
  <el-breadcrumb separator-icon="ArrowRight">
    <el-breadcrumb-item v-for="(item, index) in $route.matched" :key="index" v-show="item.meta.title" :to="item.path">
      <el-icon style="margin: 0 5px"><component :is="item.meta.icon"></component></el-icon>
      <span>{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
  import useLayoutSettingStore from '@/store/modules/setting.ts'
  // 获取layout配置相关的仓库
  let layoutSettingStore = useLayoutSettingStore()
  // 点击图标的方法
  const changeIcon = () => {
    layoutSettingStore.fold = !layoutSettingStore.fold
  }
</script>
<script lang="ts">
  export default {
    name: 'Breadcrumb',
  }
</script>

<style scoped lang="scss"></style>
