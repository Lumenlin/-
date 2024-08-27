<template>
  <div>
    <!-- 三级分类组件 -->
    <Category :scene="scene"></Category>
    <el-card style="margin: 10px 0">
      <div v-show="scene === 0">
        <el-button
          @click="addAttr"
          type="primary"
          size="default"
          icon="Plus"
          :disabled="categoryStore.c3Id ? false : true"
          >添加属性</el-button
        >
        <el-table border style="margin: 10px 0" :data="attrArr">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column label="属性名称" prop="attrName" align="center" width="120px"></el-table-column>
          <el-table-column label="属性值名称" align="center">
            <!-- row为每一个属性对象 -->
            <template #="{ row, $index }">
              <el-tag style="margin: 5px" v-for="item in row.attrValueList" :key="item.id">{{ item.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="120px">
            <template #="{ row, $index }">
              <el-button type="primary" size="small" icon="Edit" @click="updateAttr(row)"></el-button>
              <el-popconfirm
                :title="`你确定要删除${row.attrName}吗？`"
                width="280px"
                @confirm="removeAttr(row.id)">
                <template #reference>
                  <el-button type="primary" size="small" icon="Delete"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 展示添加属性与修改属性的结构 -->
      <div v-show="scene === 1">
        <el-form :inline="true">
          <el-form-item label="属性名称">
            <el-input placeholder="请输入属性名称" v-model="attrParams.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          size="default"
          icon="Plus"
          :disabled="attrParams.attrName ? false : true"
          @click="addAttrValue"
          >添加属性值</el-button
        >
        <el-button type="primary" size="default" @click="cancel">取消</el-button>
        <el-table style="margin: 10px 0" :data="attrParams.attrValueList">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column label="属性值名称" align="center">
            <!-- row即为当前的属性值对象 -->
            <template #="{ row, $index }">
              <el-input
                :ref="(vc:any)=>inputArr[$index]=vc"
                v-if="row.flag"
                @blur="toLook(row, $index)"
                placeholder="请输入属性值的名称"
                v-model="row.valueName"></el-input>
              <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template #="{ row, $index }">
              <el-button
                type="primary"
                size="small"
                icon="Delete"
                @click="attrParams.attrValueList.splice($index, 1)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          size="default"
          :disabled="attrParams.attrValueList.length > 0 ? false : true"
          @click="save"
          >保存</el-button
        >
        <el-button type="primary" size="default" @click="cancel2">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, reactive, nextTick,onBeforeUnmount } from 'vue'
  import { ElMessage } from 'element-plus'
  import type { AttrResponseData, Attr, AttrValue } from '@/api/product/attr/type'
  import { reqAttr, reqAddOrUpdateAttr, reqRemoveAttr } from '@/api/product/attr/attr'
  // 引入分类相关的仓库
  import useCategoryStore from '@/store/modules/category.ts'
  let categoryStore = useCategoryStore()

  let attrArr = ref<Attr[]>([]) // 存储已有的属性与属性值
  // 定义card组件内容的切换
  let scene = ref<number>(0) // scene==0展示属性与属性值；scene==1展示添加属性的结构
  // 收集新增的属性的数据
  let attrParams = reactive<Attr>({
    attrName: '', // 新增的属性的名字
    // 新增的属性值数组
    attrValueList: [],
    categoryId: '', // 三级分类的id
    categoryLevel: 3, // 代表三级分类
  })
  // 存储对应的组件实例el-input
  let inputArr = ref<any>([])

  // 监听有三级分类id时，就可以发请求拿到属性与属性值的数据
  watch(
    () => categoryStore.c3Id,
    () => {
      // 清空上一次查询的属性与属性值
      attrArr.value = []
      // 保证有三级分类id才能发请求
      if (!categoryStore.c3Id) return
      getAttr()
    }
  )

  // 获取已有的属性与属性值的方法
  const getAttr = async () => {
    const { c1Id, c2Id, c3Id } = categoryStore
    let result: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id)
    if (result.code === 200) {
      attrArr.value = result.data
    }
  }

  // 添加属性按钮
  const addAttr = () => {
    // 先清空上一次的数据
    Object.assign(attrParams, {
      attrName: '',
      attrValueList: [],
      categoryId: categoryStore.c3Id, // 收集三级分类的id
      categoryLevel: 3,
    })
    // 切换为添加属性的结构
    scene.value = 1
  }

  // 编辑按钮
  const updateAttr = (row: AttrValue) => {
    Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
    scene.value = 1
  }

  // 取消按钮
  const cancel = () => {
    scene.value = 0
  }
  const cancel2 = () => {
    attrParams.attrValueList = []
  }

  // 添加属性值按钮
  const addAttrValue = () => {
    // 点击添加属性值按钮时，向数组添加一个属性值对象
    attrParams.attrValueList.push({
      valueName: '',
      flag: true, // 控制添加的属性值编辑模式与查看模式的切换
    })
    // 让增加的el-input组件聚焦
    nextTick(() => {
      inputArr.value[attrParams.attrValueList.length - 1].focus()
    })
  }

  // 添加属性的保存按钮
  const save = async () => {
    let result = await reqAddOrUpdateAttr(attrParams)
    if (result.code === 200) {
      // 切换场景
      scene.value = 0
      ElMessage({ type: 'success', message: attrParams.id ? '修改成功' : '添加成功' })
      getAttr()
    } else {
      scene.value = 0
      ElMessage({ type: 'error', message: attrParams.id ? '修改失败' : '添加失败' })
    }
  }

  // 属性值input框失去焦点
  const toLook = (row: AttrValue, $index: number) => {
    if (row.valueName.trim() === '') {
      // 删除对应属性值为空的元素
      attrParams.attrValueList.splice($index, 1)
      ElMessage({ type: 'error', message: '属性值不能为空' })
      return
    }
    let repeat = attrParams.attrValueList.find((item: AttrValue) => {
      // 确保在 find方法中，当前正在检查的 item 不是 row 本身
      // 因为点击添加属性值后就有row，如果不包含这个检查，find方法可能会错误地将row自己识别为重复项
      if (item != row) {
        return item.valueName === row.valueName
      }
    })
    if (repeat) {
      attrParams.attrValueList.splice($index, 1)
      ElMessage({ type: 'error', message: '属性值不能重复' })
      return
    }
    row.flag = false
  }
  const toEdit = (row: AttrValue, $index: number) => {
    row.flag = true
    nextTick(() => {
      inputArr.value[$index].focus()
    })
  }
  // 删除已有属性
  const removeAttr=async(attrId:number)=>{
    let result = await reqRemoveAttr(attrId)
    if(result.code===200){
      ElMessage({ type: 'success', message: '删除成功' })
      getAttr()
    }else{
      ElMessage({ type: 'error', message: '删除失败' })
    }
  }

  // 路由组件销毁时，清空仓库分类相关的数据
  onBeforeUnmount(()=>{
      categoryStore.$reset()
  })
</script>

<style scoped lang="scss"></style>
