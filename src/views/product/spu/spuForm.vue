<!-- 添加一个新的spu和修改spu的结构 -->
<template>
  <el-form>
    <el-form-item label="SPU名称">
      <el-input placeholder="请输入spu名称" v-model="SpuParams.spuName"></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌">
      <el-select style="width: 30%" v-model="SpuParams.tmId">
        <el-option v-for="item in allTrademark" :key="item.id" :label="item.tmName" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU名称">
      <el-input type="textarea" placeholder="请输入spu的描述" v-model="SpuParams.description"></el-input>
    </el-form-item>
    <el-form-item label="SPU图片">
      <!-- v-model:file-list：展示默认图片
           action：上传图片的接口地址
           list-type：文件列表的类型 -->
      <el-upload
        v-model:file-list="imgList"
        action="/api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove">
        <el-icon><Plus /></el-icon>
      </el-upload>

      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" style="width: 100%; height: 100px" />
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU销售属性">
      <el-select
        style="width: 30%"
        v-model="saleAttrIdAndValueName"
        :placeholder="unSelectAttr.length > 0 ? `还未选择的有${unSelectAttr.length}个` : '无'">
        <el-option
          :value="`${item.id}:${item.name}`"
          v-for="item in unSelectAttr"
          :key="item.id"
          :label="item.name"></el-option>
      </el-select>
      <el-button
        :disabled="saleAttrIdAndValueName ? false : true"
        style="margin-left: 10px"
        type="primary"
        size="default"
        icon="Plus"
        @click="addSaleAttr"
        >添加属性</el-button
      >
      <el-table style="margin: 10px 0" :data="saleAttr">
        <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
        <el-table-column label="销售属性名称" align="center" width="120px" prop="saleAttrName"></el-table-column>
        <el-table-column label="销售属性值" align="center">
          <!-- row为每个销售属性对象 -->
          <template #="{ row, $index }">
            <el-tag
              style="margin: 0 5px"
              @close="row.spuSaleAttrValueList.splice($index, 1)"
              v-for="item in row.spuSaleAttrValueList"
              :key="row.id"
              closable>
              {{ item.saleAttrValueName }}
            </el-tag>
            <el-input
              @blur="toLook(row)"
              v-model="row.saleAttrValue"
              v-if="row.flag === true"
              placeholder="请输入属性值"
              size="small"
              style="width: 100px"></el-input>
            <el-button v-else @click="toEdit(row)" type="primary" size="small" icon="Plus"></el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120px">
          <template #="{ row, $index }">
            <el-button type="primary" size="small" icon="Delete" @click="saleAttr.splice($index, 1)"></el-button>
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
  import { ref, computed } from 'vue'
  import { reqAllTrademark, reqSpuImageList, reqHasSaleAttr, reqAllSaleAttr, reqAddSpu } from '@/api/product/spu/spu'
  import type { Trademark, SpuData, SpuImg, SaleAttr, HasSaleAttr, SaleAttrValue } from '@/api/product/spu/type'
  import { ElMessage } from 'element-plus'
  let $emit = defineEmits(['changeScene'])

  let allTrademark = ref<Trademark[]>([]) // 存储已有的spu数据
  let imgList = ref<SpuImg[]>([]) // 存储已有的品牌图片
  let saleAttr = ref<SaleAttr[]>([]) // 存储已展示的销售属性
  let allSaleAttr = ref<HasSaleAttr[]>([]) // 存储全部的销售属性
  // 存储已有的spu对象
  let SpuParams = ref<SpuData>({
    category3Id: '', //收集三级分类的ID
    spuName: '', //SPU的名字
    description: '', //SPU的描述
    tmId: '', //品牌的ID
    spuImageList: [],
    spuSaleAttrList: [],
  })
  let dialogVisible = ref<boolean>(false) // 控制照片墙预览的dialogVisible的显示与隐藏
  let dialogImageUrl = ref<string>('') // 存储预览图片的地址
  let saleAttrIdAndValueName = ref<string>('') // 将来收集还未选择的销售属性的ID与属性值的名字
  // 取消按钮
  const cancel = () => {
    $emit('changeScene', { flag: 0, params: 'update' })
  }

  const initHasSpuData = async (spu: SpuData) => {
    // spu即为父组件传递过了来的已有的spu对象
    SpuParams.value = spu
    // 获取全部品牌的数据
    let result = await reqAllTrademark()
    // 获取某个品牌下的全部售卖商品的图片
    let result1 = await reqSpuImageList(spu.id)
    // 获取全部已展示的销售属性
    let result2 = await reqHasSaleAttr(spu.id)
    // 获取全部的销售属性
    let result3 = await reqAllSaleAttr()
    allTrademark.value = result.data
    imgList.value = result1.data.map((item: any) => {
      return {
        name: item.imgName,
        url: item.imgUrl,
      }
    })
    saleAttr.value = result2.data
    allSaleAttr.value = result3.data
  }

  // 添加一个新的spu初始化请求方法
  const initAddSpu = async (c3Id: number | string) => {
    // 清空数据
    Object.assign(SpuParams.value, {
      category3Id: '',
      spuName: '',
      description: '',
      tmId: '',
      spuImageList: [],
      spuSaleAttrList: [],
    })
    imgList.value = []
    saleAttr.value = []
    saleAttrIdAndValueName.value = ''
    // 存储三级分类id
    SpuParams.value.category3Id = c3Id
    let result = await reqAllTrademark()
    let result1 = await reqAllSaleAttr()
    allTrademark.value = result.data
    allSaleAttr.value = result1.data
  }
  // 照片墙点击预览时触发的方法
  // file:当前要预览的图片的地址
  const handlePictureCardPreview = (file: any) => {
    dialogImageUrl.value = file.url
    dialogVisible.value = true
  }
  // 删除照片的方法
  const handleRemove = () => {
    console.log(123)
  }

  // 计算出当前spu还未拥有的销售属性
  let unSelectAttr = computed(() => {
    let unSelectAttr = allSaleAttr.value.filter((item: any) => {
      return saleAttr.value.every((item1: any) => {
        return item.name !== item1.saleAttrName
      })
    })
    return unSelectAttr
  })

  // 添加属性按钮
  const addSaleAttr = () => {
    const [baseSaleAttr, saleAttrName] = saleAttrIdAndValueName.value.split(':')
    // 准备一个新的销售属性对象:将来带给服务器即可
    let newSaleAttr = {
      baseSaleAttr,
      saleAttrName,
      spuSaleAttrValueList: [],
    }
    //追加到数组当中
    saleAttr.value.push(newSaleAttr)
    //清空收集的数据
    saleAttrIdAndValueName.value = ''
  }

  // 属性值按钮的点击事件
  const toEdit = (row: SaleAttr) => {
    row.flag = true
    row.saleAttrValue = ''
  }
  // 表单元素失去焦点
  const toLook = (row: SaleAttr) => {
    //整理收集的属性的ID与属性值的名字
    const { baseSaleAttrId, saleAttrValue } = row
    //整理成服务器需要的属性值形式
    let newSaleAttrValue: SaleAttrValue = {
      baseSaleAttrId,
      saleAttrValueName: saleAttrValue as string,
    }

    //非法情况判断
    if ((saleAttrValue as string).trim() == '') {
      ElMessage({
        type: 'error',
        message: '属性值不能为空的',
      })
      return
    }
    //判断属性值是否在数组当中存在
    let repeat = row.spuSaleAttrValueList.find(item => {
      return item.saleAttrValueName == saleAttrValue
    })

    if (repeat) {
      ElMessage({
        type: 'error',
        message: '属性值重复',
      })
      return
    }

    //追加新的属性值对象
    row.spuSaleAttrValueList.push(newSaleAttrValue)
    //切换为查看模式
    row.flag = false
  }

  // 保存按钮
  const save = async () => {
    // 整理参数
    SpuParams.value.spuImageList = imgList.value.map((item: any) => {
      return {
        imgName: item.name,
        imgUrl: (item.response && item.response.data) || item.url,
      }
    })
    SpuParams.value.spuSaleAttrList = saleAttr.value
    // 发请求
    let result = await reqAddSpu(SpuParams.value)
    if (result.code === 200) {
      ElMessage({
        type: 'success',
        message: SpuParams.value.id ? '修改成功' : '添加成功',
      })
      $emit('changeScene', { flag: 0, params: SpuParams.value.id ? 'update' : 'add' })
    } else {
      ElMessage({
        type: 'error',
        message: SpuParams.value.id ? '修改失败' : '添加失败',
      })
    }
  }
  // 对外暴露
  defineExpose({ initHasSpuData, initAddSpu })
</script>

<style scoped lang="scss"></style>
