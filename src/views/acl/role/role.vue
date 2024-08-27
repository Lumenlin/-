<template>
  <el-card>
    <el-form :inline="true" class="form">
      <el-form-item label="角色名称">
        <el-input placeholder="请输入角色名称" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default" :disabled="keyword ? false : true" @click="search">搜索</el-button>
        <el-button type="primary" size="default" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>

  <el-card style="margin: 10px 0">
    <el-button type="primary" size="default" icon="Plus" @click="addRole">添加角色</el-button>
    <!-- table展示用户信息 -->
    <el-table style="margin: 10px 0" border :data="allRole">
      <el-table-column label="#" align="center" type="index"></el-table-column>
      <el-table-column label="ID" align="center" prop="id"></el-table-column>
      <el-table-column label="角色名称" align="center" prop="roleName" show-overflow-tooltip></el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" show-overflow-tooltip></el-table-column>
      <el-table-column label="更新时间" align="center" prop="updateTime" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="300px" align="center">
        <!-- row：已有的职位对象 -->
        <template #="{ row, $index }">
          <el-button type="primary" size="small" icon="User" @click="setPermission(row)">分配权限</el-button>
          <el-button type="primary" size="small" icon="Edit" @click="updateRole(row)">编辑</el-button>

          <el-popconfirm :title="`你确定要删除${row.roleName}吗？`" width="260px" @confirm="deleteUser(row.id)">
            <template #reference>
              <el-button type="primary" size="small" icon="Delete">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      v-model:currentPage="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[5, 7, 9, 11]"
      :background="true"
      layout="prev, pager, next, jumper, ->, total, sizes"
      :total="total"
      @current-change="getHasRole"
      @size-change="sizeChange" />
  </el-card>

  <!-- 对话框：用于添加角色与更新已有角色 -->
  <el-dialog v-model="dialogVisible" :title="RoleParams.id ? '更新职位' : '添加职位'">
    <el-form :model="RoleParams" :rules="rules" ref="formRef">
      <el-form-item label="角色名称" prop="roleName">
        <el-input placeholder="请输入角色名称" v-model="RoleParams.roleName"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" size="default" @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" size="default" @click="save">确定</el-button>
    </template>
  </el-dialog>

  <!-- 抽屉组件：用于分配角色的菜单权限与按钮的权限 -->
  <el-drawer v-model="drawer">
    <!-- 头部标题：文字内容应该是动态的 -->
    <template #title>
      <h4>分配菜单与按钮权限</h4>
    </template>
    <template #default>
      <!-- 树形框架 -->
      <el-tree
        ref="tree"
        :data="menuArr"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="selectArr"
        :props="defaultProps" />
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer = false">取消</el-button>
        <el-button type="primary" @click="handler">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
  import { ref, onMounted, reactive, nextTick } from 'vue'
  import {
    reqAllRole,
    reqAddOrUpdateRole,
    reqAllMenuList,
    reqSetPermission,
    reqDeleteRole,
  } from '@/api/acl/role/role.ts'
  import type { Records, RoleData, MenuResponseData, MenuList } from '@/api/acl/role/type.ts'
  import useLayoutSettingStore from '@/store/modules/setting'
  import { ElMessage } from 'element-plus'
  // 获取模版setting仓库
  let settingStore = useLayoutSettingStore()
  let pageNo = ref<number>(1) // 默认页码
  let pageSize = ref<number>(5) // 每页展示条数
  let total = ref<number>(0) // 总条数
  let allRole = ref<Records>([]) // 存储全部角色的数组
  let keyword = ref<string>('') // 用户搜索职位输入的关键字
  let dialogVisible = ref<boolean>(false) // 用于对话框的显示与隐藏
  let formRef = ref<any>() // 获取form组件实例
  // 收集新增角色数据
  let RoleParams = reactive<RoleData>({
    roleName: '',
  })
  let drawer = ref<boolean>(false) // 控制抽屉的显示与隐藏
  let menuArr = ref<MenuList>([]) // 存储权限的数组
  let selectArr = ref<any>([]) // 存储已勾选的权限的数组
  let tree = ref<any>() // 获取tree组件实例，也就是选中的权限

  onMounted(() => {
    getHasRole()
  })

  // 获取全部角色的方法
  const getHasRole = async (pager = 1) => {
    pageNo.value = pager
    let result = await reqAllRole(pageNo.value, pageSize.value, keyword.value)
    if (result.code === 200) {
      total.value = result.data.total
      allRole.value = result.data.records
    }
  }

  // 分页器下拉菜单自定义事件的回调
  const sizeChange = () => {
    getHasRole()
  }

  // 搜索按钮
  const search = () => {
    getHasRole()
    keyword.value = ''
  }

  // 重置按钮
  const reset = () => {
    settingStore.refsh = !settingStore.refsh
  }

  // 添加角色按钮
  const addRole = () => {
    dialogVisible.value = true
    // 清空数据
    Object.assign(RoleParams, { roleName: '', id: 0 })
    // 清除上一次的错误的提示信息
    nextTick(() => {
      formRef.value.clearValidate('roleName')
    })
  }

  // 编辑角色按钮
  const updateRole = (row: RoleData) => {
    dialogVisible.value = true
    Object.assign(RoleParams, row)
    // 清除上一次的错误的提示信息
    nextTick(() => {
      formRef.value.clearValidate('roleName')
    })
  }

  const validatorRoleName = (rule: any, value: any, callBack: any) => {
    if (value.trim().length >= 2) {
      callBack()
    } else {
      callBack(new Error('角色名称至少两位'))
    }
  }
  // 添加角色表单校验规则
  const rules = {
    roleName: [{ required: true, trigger: 'blur', validator: validatorRoleName }],
  }
  // 对话框确定按钮
  const save = async () => {
    // 表单校验结果通过再发请求
    await formRef.value.validate()
    let result = await reqAddOrUpdateRole(RoleParams)
    if (result.code === 200) {
      // 提示信息
      ElMessage({ type: 'success', message: RoleParams.id ? '更新成功' : '添加成功' })
      dialogVisible.value = false
      // 获取最新的全部用户信息
      getHasRole(RoleParams.id ? pageNo.value : 1)
    }
  }

  // 分配权限按钮
  const setPermission = async (row: RoleData) => {
    drawer.value = true
    // 收集当前要分配权限的角色数据
    Object.assign(RoleParams, row)
    // 根据角色获取权限数据
    let result: MenuResponseData = await reqAllMenuList(RoleParams.id)
    if (result.code === 200) {
      menuArr.value = result.data
      selectArr.value = filterSelectArr(menuArr.value, [])
    }
  }

  const filterSelectArr = (allData: any, initArr: any) => {
    allData.forEach((item: any) => {
      if (item.select && item.level === 4) {
        initArr.push(item.id)
      }
      if (item.children && item.children.length > 0) {
        filterSelectArr(item.children, initArr)
      }
    })
    return initArr
  }

  // 给角色分配权限的确定按钮
  const handler = async () => {
    // 角色的id
    let roleId = RoleParams.id
    // 选中的权限的id
    let arr = tree.value.getCheckedKeys()
    // 半选中的权限的id(已选中权限的父级)
    let arr1 = tree.value.getHalfCheckedKeys()
    let permissionId = arr.concat(arr1)
    let result = await reqSetPermission(roleId, permissionId)
    if (result.code === 200) {
      // 提示信息
      ElMessage({ type: 'success', message: '分配权限成功' })
      drawer.value = false
      // 页面刷新
      window.location.reload()
    }
  }

  // 树形框架展示的数据的名称及结构
  const defaultProps = {
    children: 'children',
    label: 'name',
  }

  // 删除角色
  const deleteUser = async (roleId: number) => {
    let result = await reqDeleteRole(roleId)
    if (result.code === 200) {
      // 提示信息
      ElMessage({ type: 'success', message: '删除成功' })
      getHasRole(allRole.value.length > 1 ? pageNo.value : pageNo.value - 1)
    }
  }
</script>

<style scoped lang="scss">
  .form {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
