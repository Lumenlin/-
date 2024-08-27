<template>
  <div>
    <Category :scene="scene"></Category>
    <el-card style="margin: 10px 0">
      <div v-show="scene === 0">
        <el-button
          @click="addSpu"
          type="primary"
          size="default"
          icon="Plus"
          :disabled="categoryStore.c3Id ? false : true"
          >添加SPU</el-button
        >
        <el-table border style="margin: 10px 0" :data="records">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column label="SPU名称" prop="spuName" width="200px"></el-table-column>
          <el-table-column label="SPU描述" prop="description"> </el-table-column>
          <el-table-column label="操作" align="center">
            <!-- row为已有的spu对象 -->
            <template #="{ row, $index }">
              <el-button type="primary" size="small" icon="Plus" title="添加SKU" @click="addSku(row)"></el-button>
              <el-button type="primary" size="small" icon="Edit" title="编辑SPU" @click="updateSpu(row)"></el-button>
              <el-button type="primary" size="small" icon="View" title="查看SKU列表" @click="findSku(row)"></el-button>
              <el-popconfirm :title="`你确定删除${row.spuName}?`" width="280px" @confirm="deleteSpu(row)">
                <template #reference>
                  <el-button type="primary" size="small" icon="Delete" title="删除SPU"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          v-model:current-page="pageNo"
          v-model:page-size="pageSize"
          :page-sizes="[5, 7, 9, 11]"
          :background="true"
          layout="prev, pager, next, jumper, ->, total, sizes"
          :total="total"
          @current-change="getHasSpu"
          @size-change="changeSize" />
      </div>
      <!-- 添加与修改Spu的子组件 -->
      <SpuForm ref="spu" v-show="scene === 1" @changeScene="changeScene"></SpuForm>
      <!-- 添加Sku的子组件 -->
      <SkuForm ref="sku" v-show="scene === 2" @changeScene="changeScene"></SkuForm>
      <!-- dialog对话框:展示已有的SKU数据 -->
      <el-dialog v-model="show" title="SKU列表">
        <el-table border :data="skuArr">
          <el-table-column label="SKU名字" prop="skuName"></el-table-column>
          <el-table-column label="SKU价格" prop="price"></el-table-column>
          <el-table-column label="SKU重量" prop="weight"></el-table-column>
          <el-table-column label="SKU图片">
            <template #="{ row, $index }">
              <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, onBeforeUnmount } from 'vue'
  import { ElMessage } from 'element-plus'
  import { reqHasSpu, reqSkuList, reqRemoveSpu } from '@/api/product/spu/spu'
  import type { HasSpuResponseData, Records, SpuData, SkuInfoData, SkuData } from '@/api/product/spu/type'
  import SpuForm from './spuForm.vue'
  import SkuForm from './skuForm.vue'
  // 引入分类相关的仓库
  import useCategoryStore from '@/store/modules/category.ts'
  let categoryStore = useCategoryStore()
  // 控制场景切换的数据
  let scene = ref<number>(0) // 0：显示已有spu；1：显示添加与修改spu的结构；2：显示添加sku的结构
  let pageNo = ref<number>(1) // 默认页码
  let pageSize = ref<number>(5) // 每页展示条数
  let total = ref<number>(0) // 总条数
  let records = ref<Records>([]) // 存储已有的spu的数据
  // 获取子组件实例spuForm
  let spu = ref()
  let sku = ref()
  //存储全部的SKU数据
  let skuArr = ref<SkuData[]>([])
  // 控制对话框的显示与隐藏
  let show = ref<boolean>(false)

  // 监听三级分类id变化
  watch(
    () => categoryStore.c3Id,
    () => {
      if (!categoryStore.c3Id) return
      getHasSpu()
    }
  )

  // 获取某个三级分类下全部已有的spu
  const getHasSpu = async (pager = 1) => {
    pageNo.value = pager
    let result: HasSpuResponseData = await reqHasSpu(pageNo.value, pageSize.value, categoryStore.c3Id)
    if (result.code === 200) {
      records.value = result.data.records
      total.value = result.data.total
    }
  }

  // 分页器下拉菜单自定义事件的回调
  const changeSize = () => {
    getHasSpu()
  }

  // 添加spu按钮
  const addSpu = () => {
    scene.value = 1
    // 点击添加SPU按钮,调用子组件的方法初始化数据
    spu.value.initAddSpu(categoryStore.c3Id)
  }

  // 添加与修改spu，spuForm中的取消按钮的自定义事件
  const changeScene = (obj: any) => {
    scene.value = obj.flag
    if (obj.params === 'update') {
      // 更新留在当前页
      getHasSpu(pageNo.value)
    } else {
      // 添加留在第一页
      getHasSpu()
    }
  }

  // 编辑spu按钮
  const updateSpu = (row: SpuData) => {
    scene.value = 1
    // 调用子组件实例方法获取完整的已有的spu数据
    spu.value.initHasSpuData(row)
  }

  // 添加sku
  const addSku = (row: SpuData) => {
    // 切换为场景2
    scene.value = 2
    sku.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row)
  }

  // 查看sku列表
  const findSku = async (row: SpuData) => {
    let result: SkuInfoData = await reqSkuList(row.id)
    if (result.code == 200) {
      skuArr.value = result.data
      //对话框显示出来
      show.value = true
    }
  }

  //删除已有的SPU的按钮
  const deleteSpu = async (row: SpuData) => {
    let result: any = await reqRemoveSpu(row.id)
    if (result.code == 200) {
      ElMessage({
        type: 'success',
        message: '删除成功',
      })
      //获取剩余SPU数据
      getHasSpu(records.value.length > 1 ? pageNo.value : pageNo.value - 1)
    } else {
      ElMessage({
        type: 'error',
        message: '删除失败',
      })
    }
  }

  //路由组件销毁前，清空仓库关于分类的数据
  onBeforeUnmount(() => {
    categoryStore.$reset()
  })
</script>

<style scoped lang="scss"></style>
