<template>
  <el-table :data="permissionArr" style="width: 100%; margin-bottom: 20px" row-key="id" border>
    <el-table-column label="名称" prop="name" />
    <el-table-column align="center" label="权限值" prop="code" />
    <el-table-column align="center" label="修改时间" prop="updateTime" />
    <el-table-column label="操作" width="300px" align="center">
      <!-- row：已有的菜单对象 -->
      <template #="{ row, $index }">
        <el-button type="primary" size="small" @click="addPermission(row)" :disabled="row.level === 4 ? true : false">{{
          row.level === 3 ? '添加功能' : '添加菜单'
        }}</el-button>
        <el-button type="primary" size="small" @click="updatePermission(row)" :disabled="row.level === 1 ? true : false"
          >编辑</el-button
        >
        <el-popconfirm :title="`你确定要删除${row.name}吗？`" width="260px" @confirm="removePermission(row.id)">
          <template #reference>
            <el-button type="primary" size="small" :disabled="row.level === 1 ? true : false">删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <!-- 对话框：用于添加或更新菜单 -->
  <el-dialog v-model="dialogVisible" :title="menuData.id ? '编辑菜单' : '添加菜单'" width="35%">
    <el-form>
      <el-form-item label="名称">
        <el-input placeholder="请输入菜单名称" v-model="menuData.name"></el-input>
      </el-form-item>
      <el-form-item label="权限值">
        <el-input placeholder="请输入权限值" v-model="menuData.code"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { ref, onMounted, reactive } from 'vue'
  import { ElMessage } from 'element-plus'
  import { reqAllPermission, reqAddOrUpdatePermission,reqRemovePermission } from '@/api/acl/permission/permission'
  import type { PermissionResponseData, PermissionList, Permission, MenuParams } from '@/api/acl/permission/type'

  let permissionArr = ref<PermissionList>([]) // 存储获取的菜单数据
  let dialogVisible = ref<boolean>(false) // 用于对话框的显示与隐藏
  // 新增或修改菜单携带的参数
  let menuData = reactive<MenuParams>({
    code: '', // 权限值
    level: 0,
    name: '',
    pid: 0, // 菜单的id
  })

  onMounted(() => {
    getHasPermission()
  })

  // 获取全部菜单数据
  const getHasPermission = async () => {
    let result: PermissionResponseData = await reqAllPermission()
    if (result.code === 200) {
      permissionArr.value = result.data
    }
  }

  // 添加菜单按钮
  const addPermission = (row: Permission) => {
    // 清空数据
    Object.assign(menuData, {
      id: 0,
      code: '',
      level: 0,
      name: '',
      pid: 0,
    })
    dialogVisible.value = true
    // 收集新增子菜单的level值
    menuData.level = row.level + 1
    // 给谁新增菜单（新增菜单的id）
    menuData.pid = row.id
  }

  // 编辑按钮
  const updatePermission = (row: Permission) => {
    dialogVisible.value = true
    Object.assign(menuData, row)
  }

  // 对话框的确定按钮
  const save = async () => {
    let result = await reqAddOrUpdatePermission(menuData)
    if (result.code === 200) {
      // 提示信息
      ElMessage({ type: 'success', message: menuData.id ? '更新成功' : '添加成功' })
      dialogVisible.value = false
      // 获取最新的全部菜单信息
      getHasPermission()
    }
  }

  // 删除按钮
  const removePermission=async(id:number)=>{
    let result = await reqRemovePermission(id)
    if(result.code===200){
        ElMessage({ type: 'success', message: '删除成功' })
        getHasPermission()
    }
  }
</script>

<style scoped lang="scss"></style>
