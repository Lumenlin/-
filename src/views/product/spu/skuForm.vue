<!-- spu中添加sku的结构 -->
<template>
  <el-form>
    <el-form-item label="SKU名称">
      <el-input placeholder="请输入sku名称" v-model="skuParams.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格（元）">
      <el-input placeholder="请输入价格" type="number" v-model="skuParams.price"> </el-input>
    </el-form-item>
    <el-form-item label="重量（g）">
      <el-input type="number" placeholder="请输入重量" v-model="skuParams.weight"></el-input>
    </el-form-item>
    <el-form-item label="SKU描述">
      <el-input type="textarea" placeholder="请输入sku描述" v-model="skuParams.skuDesc"></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form :inline="true">
        <el-form-item label-width="50px" v-for="item in attrArr" :key="item.id" :label="item.attrName">
          <el-select v-model="item.attrIdAndValueId" style="width: 200px">
            <el-option
              :value="`${item.id}:${attrValue.id}`"
              v-for="attrValue in item.attrValueList"
              :key="attrValue.id"
              :label="attrValue.valueName"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form :inline="true">
        <el-form-item label-width="50px" v-for="item in saleArr" :key="item.id" :label="item.saleAttrName">
          <el-select v-model="item.saleIdAndValueId" style="width: 200px">
            <el-option
              :value="`${item.id}:${saleAttrValue.id}`"
              v-for="saleAttrValue in item.spuSaleAttrValueList"
              :key="saleAttrValue.id"
              :label="saleAttrValue.saleAttrValueName"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片名称">
      <el-table border :data="imgArr" ref="table">
        <el-table-column type="selection" width="80px" align="center"></el-table-column>
        <el-table-column label="图片">
          <template #="{ row, $index }">
            <img :src="row.imgUrl" alt="" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <el-table-column label="操作">
          <template #="{ row, $index }">
            <el-button type="primary" size="small" @click="handler(row)">设置默认</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="default" @click="save">保存</el-button>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { ElMessage } from 'element-plus'
  import { reqSpuImageList, reqHasSaleAttr, reqAddSku } from '@/api/product/spu/spu'
  import { reqAttr } from '@/api/product/attr/attr'
  import type { SkuData } from '@/api/product/spu/type'
  let $emit = defineEmits(['changeScene'])
  let attrArr = ref<any>([]) // 平台属性
  let saleArr = ref<any>([]) // 销售属性
  let imgArr = ref<any>([]) // 照片墙
  //收集SKU的参数
  let skuParams = reactive<SkuData>({
    //父组件传递过来的数据
    category3Id: '', //三级分类的ID
    spuId: '', //已有的SPU的ID
    tmId: '', //SPU品牌的ID
    //v-model收集
    skuName: '', //sku名字
    price: '', //sku价格
    weight: '', //sku重量
    skuDesc: '', //sku的描述

    //平台属性的收集
    skuAttrValueList: [],
    //销售属性
    skuSaleAttrValueList: [],
    skuDefaultImg: '', //sku图片地址
  })
  let table = ref()

  // 取消按钮
  const cancel = () => {
    $emit('changeScene', { flag: 0, params: '' })
  }

  // 对外暴露子组件的方法
  const initSkuData = async (c1Id: number | string, c2Id: number | string, spu: any) => {
    //收集数据
    skuParams.category3Id = spu.category3Id
    skuParams.spuId = spu.id
    skuParams.tmId = spu.tmId
    //获取平台属性
    let result: any = await reqAttr(c1Id, c2Id, spu.category3Id)
    //获取对应的销售属性
    let result1: any = await reqHasSaleAttr(spu.id)
    // //获取照片墙的数据
    let result2: any = await reqSpuImageList(spu.id)
    //平台属性
    attrArr.value = result.data
    //销售属性
    saleArr.value = result1.data
    //图片
    imgArr.value = result2.data
  }

  // 设置默认图片的方法
  const handler = (row: any) => {
    //点击的时候,全部图片的的复选框不勾选
    imgArr.value.forEach((item: any) => {
      table.value.toggleRowSelection(item, false)
    })
    //选中的图片才勾选
    table.value.toggleRowSelection(row, true)
    //收集图片地址
    skuParams.skuDefaultImg = row.imgUrl
  }

  //保存按钮的方法
  const save = async () => {
    //整理参数
    //平台属性
    skuParams.skuAttrValueList = attrArr.value.reduce((prev: any, next: any) => {
      if (next.attrIdAndValueId) {
        let [attrId, valueId] = next.attrIdAndValueId.split(':')
        prev.push({
          attrId,
          valueId,
        })
      }
      return prev
    }, [])
    //销售属性
    skuParams.skuSaleAttrValueList = saleArr.value.reduce((prev: any, next: any) => {
      if (next.saleIdAndValueId) {
        let [saleAttrId, saleAttrValueId] = next.saleIdAndValueId.split(':')
        prev.push({
          saleAttrId,
          saleAttrValueId,
        })
      }
      return prev
    }, [])
    //添加SKU的请求
    let result: any = await reqAddSku(skuParams)
    if (result.code == 200) {
      ElMessage({
        type: 'success',
        message: '添加SKU成功',
      })
      //通知父组件切换场景为零
      $emit('changeScene', { flag: 0, params: '' })
    } else {
      ElMessage({
        type: 'error',
        message: '添加SKU失败',
      })
    }
  }
  // 对外暴露
  defineExpose({ initSkuData })
</script>

<style scoped lang="scss"></style>
