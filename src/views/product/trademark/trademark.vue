<template>
  <div>
    <el-card>
      <!-- 添加品牌按钮 -->
      <el-button type="primary" size="default" icon="Plus" @click="addTrademark" v-has="`btn.Trademark.add`">添加品牌</el-button>
      <el-table style="margin: 10px 0" border :data="trademarkArr">
        <el-table-column label="序号" width="80" align="center" type="index"></el-table-column>
        <!-- table-column:[prop="tmName"]默认展示数据用div -->
        <el-table-column label="品牌名称" align="center" prop="tmName"></el-table-column>
        <el-table-column label="品牌LOGO" align="center">
          <template #="{ row, $index }">
            <img :src="row.logoUrl" alt="" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column label="品牌操作" align="center">
          <!-- row为品牌的对象 -->
          <template #="{ row, $index }">
            <el-button type="primary" size="small" icon="Edit" @click="updateTrademark(row)"></el-button>
            <el-popconfirm :title="`你确定要删除${row.tmName}吗？`" width="260px" @confirm="removeTrademark(row.id)">
              <template #reference>
                <el-button type="primary" size="small" icon="Delete"></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器  pagination
            v-model: current-page:设置分页器当前页码
            v -model:page-size:设置每一个展示数据条数
            page-sizes:用于设置下拉菜单数据
            background:设置分页器按钮的背景颜色
            layout:可以设置分页器六个子组件布局调整
        -->
      <el-pagination
        @size-change="sizeChange"
        @current-change="getHasTrademark"
        v-model:current-page="pageNo"
        v-model:page-size="limit"
        :page-sizes="[3, 5, 7, 9]"
        :background="true"
        layout="prev, pager, next, jumper, ->,sizes, total"
        :total="total" />
    </el-card>
    <!-- 对话框组件：在添加品牌与修改已有品牌的业务时使用的结构 -->
    <el-dialog v-model="dialogFormVisible" :title="trademarkParams.id ? '编辑品牌' : '添加品牌'">
      <el-form style="width: 80%" :model="trademarkParams" :rules="rules" ref="formRef">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input placeholder="请输入品牌名称" v-model="trademarkParams.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- upload组件
                            action：action图片上传路径 -->
          <el-upload
            class="avatar-uploader"
            action="/api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 具名插槽：footer -->
      <template #footer>
        <el-button type="primary" size="default" @click="cancel">取消</el-button>
        <el-button type="primary" size="default" @click="confirm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, reactive, nextTick } from 'vue'
  import { reqHasTrademark, reqAddOrUpdateTrademark, reqRemoveTrademark } from '@/api/product/trademark/trademark.ts'
  import type { Records, TradeMarkResponseData, TradeMark } from '@/api/product/trademark/type.ts'
  import type { UploadProps } from 'element-plus'
  import { ElMessage } from 'element-plus'
 
  let pageNo = ref<number>(1) // 当前页码
  let limit = ref<number>(3) // 每页展示多少条数据
  let total = ref<number>(0) // 总条数
  let trademarkArr = ref<Records>([]) // 已有品牌的数据
  let dialogFormVisible = ref<boolean>(false) // 控制对话框的显示与隐藏
  let trademarkParams = reactive<TradeMark>({
    id: 0,
    tmName: '',
    logoUrl: '',
  })
  let formRef = ref<any>() // 获取form组件实例，用于表单校验

  const getHasTrademark = async (pager = 1) => {
    pageNo.value = pager
    let result: TradeMarkResponseData = await reqHasTrademark(pageNo.value, limit.value)

    if (result.code === 200) {
      total.value = result.data.total
      trademarkArr.value = result.data.records
    }
  }
  onMounted(() => {
    getHasTrademark()
  })
  // 分页器当前页码发生变化的时候会触发
  // 对于当前页码发生变化自定义事件,组件pagination父组件回传了数据(当前的页码)
  // const changePageNo = () => {
  //     getHasTrademark()
  // }

  // 当下拉菜单发生变化的时候会触发
  // 这个自定义事件，分页器组件会将下拉菜单选中数据返回
  const sizeChange = () => {
    // 当前每一页的显示条数发生变化时，当前页码归1
    getHasTrademark()
  }
  // 添加品牌
  const addTrademark = () => {
    dialogFormVisible.value = true
    Object.assign(trademarkParams, {
      id: 0,
      tmName: '',
      logoUrl: '',
    })
    // 清除上一次的错误的提示信息
    // 第一种写法
    // formRef.value?.clearValidate('tmName')
    // formRef.value?.clearValidate('logoUrl')
    // 第二种写法
    nextTick(() => {
      formRef.value.clearValidate('tmName')
      formRef.value.clearValidate('logoUrl')
    })
  }
  // 修改品牌
  const updateTrademark = (row: TradeMark) => {
    dialogFormVisible.value = true
    Object.assign(trademarkParams, row)
    // 清除上一次的错误的提示信息
    nextTick(() => {
      formRef.value.clearValidate('tmName')
      formRef.value.clearValidate('logoUrl')
    })
  }
  // 对话框底部取消按钮
  const cancel = () => {
    dialogFormVisible.value = false
  }
  // 对话框底部确定按钮
  const confirm = async () => {
    // 保证表单全部符合条件再发请求
    await formRef.value.validate()
    let result = await reqAddOrUpdateTrademark(trademarkParams)
    if (result.code === 200) {
      // 提示信息
      ElMessage({ type: 'success', message: trademarkParams.id ? '更新成功' : '添加成功' })
      dialogFormVisible.value = false
      getHasTrademark(trademarkParams.id ? pageNo.value : 1)
    } else {
      ElMessage({ type: 'error', message: trademarkParams.id ? '更新失败' : '添加失败' })
      dialogFormVisible.value = false
    }
  }
  // 上传图片之前触发的钩子函数
  const beforeAvatarUpload: UploadProps['beforeUpload'] = rawFile => {
    // 在图片上传成功之前触发，上传文件之前可以约束上传的文件类型、大小
    if (rawFile.type === 'image/png' || rawFile.type === 'image/jpeg' || rawFile.type === 'image/gif') {
      if (rawFile.size / 1024 / 1024 < 4) {
        return true
      }
    } else {
      ElMessage({
        type: 'error',
        message: '上传文件的格式只能是PNG|JPG|GIF',
      })
      return false
    }
  }
  // 图片上传成功的函数
  const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
    // response:即为当前这次上传图片post请求服务器返回的数据
    // 收集上传图片的地址
    trademarkParams.logoUrl = response.data
    // 图片上传成功后清除校验信息
    formRef.value.clearValidate('logoUrl')
  }

  // 品牌名称的自定义校验规则
  const validatorTmName = (rule: any, value: any, callBack: any) => {
    // 品牌名称至少2位
    if (value.trim().length >= 2) {
      callBack()
    } else {
      callBack(new Error('品牌名称至少2位'))
    }
  }
  const validatorLogoUrl = (rule: any, value: any, callBack: any) => {
    // 品牌名称至少2位
    if (value) {
      callBack()
    } else {
      callBack(new Error('请上传品牌图片'))
    }
  }
  // 表单校验规则对象
  const rules = {
    tmName: [{ required: true, trigger: 'blur', validator: validatorTmName }],
    logoUrl: [{ required: true, trigger: 'blur', validator: validatorLogoUrl }],
  }

  // 删除某个品牌
  const removeTrademark = async (id: number) => {
    let result = await reqRemoveTrademark(id)
    if (result.code === 200) {
      ElMessage({ type: 'success', message: '删除成功' })
      getHasTrademark(trademarkArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
    }
  }
</script>

<style scoped>
  .avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }

  .avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
  }

  .el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
  }
</style>
