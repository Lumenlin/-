<template>
  <el-card>
    <el-form :inline="true" class="form">
      <el-form-item label="用户名">
        <el-input placeholder="请输入搜索的用户名" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default" :disabled="keyword ? false : true" @click="search">搜索</el-button>
        <el-button type="primary" size="default" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0">
    <el-button type="primary" size="default" @click="addUser">添加用户</el-button>
    <el-button type="primary" size="default" :disabled="selectIdArr.length ? false : true" @click="deleteSelectUser"
      >批量删除</el-button
    >
    <!-- table展示用户信息 -->
    <el-table style="margin: 10px 0" border :data="userArr" @selection-change="selectChange">
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column label="#" align="center" type="index"></el-table-column>
      <el-table-column label="ID" align="center" prop="id"></el-table-column>
      <el-table-column label="用户名字" align="center" prop="username" show-overflow-tooltip></el-table-column>
      <el-table-column label="用户名称" align="center" prop="name" show-overflow-tooltip></el-table-column>
      <el-table-column label="用户角色" align="center" prop="roleName" show-overflow-tooltip></el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" show-overflow-tooltip></el-table-column>
      <el-table-column label="更新时间" align="center" prop="updateTime" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="300px" align="center">
        <template #="{ row, $index }">
          <el-button type="primary" size="small" icon="User" @click="setRole(row)">分配角色</el-button>
          <el-button type="primary" size="small" icon="Edit" @click="updateUser(row)">编辑</el-button>

          <el-popconfirm :title="`你确定要删除${row.username}吗？`" width="260px" @confirm="deleteUser(row.id)">
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
      @current-change="getHasUser"
      @size-change="handler" />
  </el-card>
  <!-- 抽屉结构：完成添加新的用户账号、更新已有的用户信息 -->
  <el-drawer v-model="drawer">
    <!-- 头部标题：文字内容应该是动态的 -->
    <template #title>
      <h4>{{ userParams.id ? '编辑用户' : '添加用户' }}</h4>
    </template>
    <template #default>
      <el-form :model="userParams" :rules="rules" ref="formRef">
        <el-form-item label="用户姓名" prop="username">
          <el-input placeholder="请输入用户姓名" v-model="userParams.username"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="name">
          <el-input placeholder="请输入用户昵称" v-model="userParams.name"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
          <el-input placeholder="请输入用户密码" v-model="userParams.password"></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </template>
  </el-drawer>
  <!-- 抽屉结构：用于已有账号进行职位分配 -->
  <el-drawer v-model="drawer1">
    <template #title>
      <h4>分配角色</h4>
    </template>
    <template #default>
      <el-form>
        <el-form-item label="用户姓名">
          <el-input v-model="userParams.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="角色列表">
          <el-checkbox @change="handleCheckChange" v-model="checkAll" :indeterminate="isIndeterminate"
            >全选</el-checkbox
          >
          <!-- 显示职位的复选框 -->
          <el-checkbox-group v-model="userRole" @change="handleCheckCitiesChange">
            <el-checkbox v-for="(role, index) in allRole" :key="index" :label="role">{{ role.roleName }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer1 = false">取消</el-button>
        <el-button type="primary" @click="confirmClick">确认</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
  import useLayoutSettingStore from '@/store/modules/setting'
  import { ref, onMounted, reactive, nextTick } from 'vue'
  import {
    reqUserInfo,
    reqAddOrUpdateUser,
    reqAllRole,
    reqSetUserRole,
    reqRemoveUser,
    reqSelectRemoveUser,
  } from '@/api/acl/user/user.ts'
  import type {
    UserResponseData,
    Records,
    User,
    AllRoleResponseData,
    AllRole,
    SetRoleData,
  } from '@api/acl/user/type.ts'
  import { ElMessage } from 'element-plus'
  let pageNo = ref<number>(1) // 默认页码
  let pageSize = ref<number>(5) // 每页展示条数
  let total = ref<number>(0) // 总条数
  let userArr = ref<Records>([]) // 存储全部用户的数组
  let drawer = ref<boolean>(false) // 控制添加或修改用户的抽屉的显示与隐藏
  let drawer1 = ref<boolean>(false) // 控制分配角色的抽屉的显示与隐藏
  let formRef = ref<any>() // 获取form组件实例
  let allRole = ref<AllRole>([]) // 存储全部职位
  let userRole = ref<AllRole>([]) // 当前用户已有的职位
  let selectIdArr = ref<User>([]) // 批量删除的用户
  let keyword = ref<string>('') // 用户搜索输入的关键字
  // 收集用户信息的响应式数据
  let userParams = reactive<User>({
    username: '',
    name: '',
    password: '',
  })
  // 获取模版setting仓库
  let settingStore = useLayoutSettingStore()

  onMounted(() => {
    getHasUser()
  })

  // 获取全部已有的用户信息
  const getHasUser = async (pager = 1) => {
    // 收集当前页码
    pageNo.value = pager
    let result: UserResponseData = await reqUserInfo(pageNo.value, pageSize.value, keyword.value)
    if (result.code === 200) {
      total.value = result.data.total
      userArr.value = result.data.records
    }
  }

  // 分页器下拉菜单自定义事件的回调
  const handler = () => {
    getHasUser()
  }

  // 添加用户
  const addUser = () => {
    // 显示抽屉
    drawer.value = true
    // 清空数据
    Object.assign(userParams, {
      id: 0,
      username: '',
      name: '',
      password: '',
    })
    // 清除上一次的错误的提示信息
    nextTick(() => {
      formRef.value.clearValidate('username')
      formRef.value.clearValidate('name')
      formRef.value.clearValidate('password')
    })
  }

  // 更新用户
  // row即为已有的用户信息
  const updateUser = (row: User) => {
    drawer.value = true
    // 存储收集已有的账号信息
    Object.assign(userParams, row)
    // 清除上一次的错误的提示信息
    nextTick(() => {
      formRef.value.clearValidate('username')
      formRef.value.clearValidate('name')
    })
  }

  // 确定按钮的回调:添加用户或者更新已有用户
  const save = async () => {
    // 保证表单全部符合条件再发请求
    await formRef.value.validate()
    let result: any = await reqAddOrUpdateUser(userParams)
    if (result.code === 200) {
      drawer.value = false
      // 提示信息
      ElMessage({ type: 'success', message: userParams.id ? '更新成功' : '添加成功' })
      // 获取最新的全部用户信息
      // getHasUser(userParams.id ? pageNo.value : 1)
      // 浏览器自动刷新一次
      window.location.reload()
    } else {
      drawer.value = false
      // 提示信息
      ElMessage({ type: 'error', message: userParams.id ? '更新失败' : '添加失败' })
    }
  }
  // 取消按钮
  const cancel = () => {
    drawer.value = false
  }

  // 校验用户名的回调函数
  const validatorUsername = (rule: any, value: any, callBack: any) => {
    // 用户名字长度至少5位
    if (value.trim().length > 4) {
      callBack()
    } else {
      callBack(new Error('用户名字至少5位'))
    }
  }
  const validatorName = (rule: any, value: any, callBack: any) => {
    // 用户名字长度至少5位
    if (value.trim().length > 4) {
      callBack()
    } else {
      callBack(new Error('用户昵称至少5位'))
    }
  }
  const validatorPassword = (rule: any, value: any, callBack: any) => {
    // 用户密码长度至少5位
    if (value.trim().length > 5) {
      callBack()
    } else {
      callBack(new Error('用户密码至少6位'))
    }
  }
  // 表单校验规则对象
  const rules = {
    username: [{ required: true, trigger: 'blur', validator: validatorUsername }],
    name: [{ required: true, trigger: 'blur', validator: validatorName }],
    password: [{ required: true, trigger: 'blur', validator: validatorPassword }],
  }
  // 分配角色按钮
  const setRole = async (row: User) => {
    // 存储已有的用户信息
    Object.assign(userParams, row)
    // 获取全部的职位数据与当前用户已有的职位数据
    let result: AllRoleResponseData = await reqAllRole(userParams.id)
    if (result.code === 200) {
      allRole.value = result.data.allRolesList
      userRole.value = result.data.assignRoles
      // 显示抽屉
      drawer1.value = true
    }
  }

  let checkAll = ref<boolean>(false) // 顶部全选框是否全部勾选
  let isIndeterminate = ref<boolean>(true) // 设置全选框不确定状态

  // 顶部全选复选框的change事件
  const handleCheckChange = (val: boolean) => {
    userRole.value = val ? allRole.value : []
    isIndeterminate.value = false
  }

  // 下面复选框的change事件
  const handleCheckCitiesChange = (value: string) => {
    // 已经勾选的内容的长度
    const checkedCount = value.length
    // 勾选上的个数与全部个数相等，顶部全选复选框要勾上
    checkAll.value = checkedCount === allRole.value.length
    isIndeterminate.value = !(checkedCount === allRole.value.length)
  }

  // 分配职位的确定按钮
  const confirmClick = async () => {
    // 收集参数
    let data: SetRoleData = {
      userId: userParams.id as number, // 用户id
      // 职位id
      roleIdList: userRole.value.map(item => {
        return item.id as number
      }), 
    }

    let result = await reqSetUserRole(data)
    if (result.code === 200) {
      // 提示信息
      ElMessage({ type: 'success', message: '更新成功' })
      drawer1.value = false
      // 获取最新的全部用户信息
      getHasUser(pageNo.value)
    }
  }

  // 删除某一个用户
  const deleteUser = async (userId: number) => {
    let result = await reqRemoveUser(userId)
    if (result.code === 200) {
      ElMessage({ type: 'success', message: '删除成功' })
      getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
    }
  }

  // table复选框勾选时会触发的事件
  const selectChange = (value: any) => {
    selectIdArr.value = value
  }

  // 批量删除用户
  const deleteSelectUser = async () => {
    let idList: any = selectIdArr.value.map(item => {
      return item.id
    })
    let result = await reqSelectRemoveUser(idList)
    if (result.code === 200) {
      ElMessage({ type: 'success', message: '删除成功' })
      getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
    }
  }

  // 搜索按钮
  const search = () => {
    // 根据关键字获取相应的用户数据
    getHasUser()
    // 清空关键字
    keyword.value = ''
  }

  // 重置按钮
  const reset = () => {
    settingStore.refsh = !settingStore.refsh
  }
</script>

<style scoped lang="scss">
  .form {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
