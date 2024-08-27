<template>
  <el-card>
    <el-form :inline="true">
      <el-form-item label="一级分类" style="width: 30%">
        <el-select v-model="categoryStore.c1Id" @change="handler()" :disabled="scene === 1 ? true : false">
          <!-- option: label即为显示文字, value属性即为select下拉菜单收集的数据- -->
          <el-option v-for="c1 in categoryStore.c1Arr" :key="c1.id" :label="c1.name" :value="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类" style="width: 30%">
        <el-select v-model="categoryStore.c2Id" @change="handler1()" :disabled="scene === 1 ? true : false">
          <el-option v-for="c2 in categoryStore.c2Arr" :key="c2.id" :label="c2.name" :value="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类" style="width: 30%">
        <el-select v-model="categoryStore.c3Id" :disabled="scene === 1 ? true : false">
          <el-option v-for="c3 in categoryStore.c3Arr" :key="c3.id" :label="c3.name" :value="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  // 引入分类相关的仓库
  import useCategoryStore from '@/store/modules/category.ts'
  let categoryStore = useCategoryStore()
  // 接收父组件传递的场景值scene
  defineProps(['scene'])

  onMounted(() => {
    getC1()
  })

  // 通知仓库发请求获取一级分类数据
  const getC1 = async () => {
    categoryStore.getC1()
  }

  // 一级分类下拉菜单的change事件(选中了一级分类时触发)
  const handler = () => {
    // 需要将二、三级分类的数据清空
    categoryStore.c2Id = ''
    categoryStore.c2Arr = []
    categoryStore.c3Id = ''
    // 通知仓库发请求获取二级分类数据
    categoryStore.getC2()
  }

  // 二级分类下拉菜单的change事件(选中了二级分类时触发)
  const handler1 = () => {
    categoryStore.c3Arr = []
    categoryStore.c3Id = ''
    // 通知仓库发请求获取三级分类数据
    categoryStore.getC3()
  }
</script>

<style scoped lang="scss"></style>
