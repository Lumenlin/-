<template>
    <div class="login-container">
        <el-row>
            <el-col :span="12" :xs="0"></el-col>
            <el-col :span="12" :xs="12">
                <el-form
                    class="login-form"
                    :model="loginForm"
                    :rules="rules"
                    ref="loginForms">
                    <h1>Hello</h1>
                    <h2>欢迎来到甄选后台</h2>
                    <el-form-item prop="username">
                        <el-input
                            :prefix-icon="User"
                            v-model="loginForm.username"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input
                            type="passsword"
                            :prefix-icon="Lock"
                            show-password
                            v-model="loginForm.password"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button
                            class="login-btn"
                            type="primary"
                            size="default"
                            @click="login"
                            :loading="loading"
                            >登录</el-button
                        >
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
    import { User, Lock } from '@element-plus/icons-vue'
    import { reactive, ref } from 'vue'
    import { useRouter, useRoute } from 'vue-router'
    import { ElNotification } from 'element-plus'
    // 引入用户相关的小仓库
    import useUserStore from '@/store/modules/user'
    // 引入获取时间的函数
    import { getTime } from '@/utils/time'
    // 获取路由器
    let $router = useRouter()
    let $route = useRoute()
    // 定义变量控制按钮加载效果
    let loading = ref(false)
    let useStore = useUserStore()
    // 获取el-form组件
    let loginForms = ref()
    // 收集账号与密码的数据
    let loginForm = reactive({ username: 'admin', password: '111111' })

    // 自定义校验规则函数
    const validatorUserName = (rule: any, value: any, callback: any) => {
        // rule:即为校验规则对象
        //value:即为表单元素文本内容
        //callback函数:如果符合条件callback放行通过即为
        //如果不符合条件callBack方法,注入错误提示信息
        if (value.length >= 5) {
            callback()
        } else {
            callback(new Error('账号长度至少5位'))
        }
    }

    const validatorPassword = (rule: any, value: any, callback: any) => {
        if (value.length >= 6) {
            callback()
        } else {
            callback(new Error('密码长度至少6位'))
        }
    }

    // 登录按钮回调
    const rules = {
        username: [
            //规则对象属性:
            // required,代衣这个字段务必要校验的
            //min:文本长度至少多少位
            //max:文本长度最多多少位
            // message：错误的提示信息
            // trigger：触发校验表单的时机 change----文本发生变化时，blur----失去焦点时
            // {
            //     require: true,
            //     min: 6,
            //     max: 10,
            //     message: '账号长度至少6位，不能超过10位',
            //     trigger: 'change',
            // },
            { trigger: 'change', validator: validatorUserName },
        ],
        password: [{ trigger: 'change', validator: validatorPassword }],
    }
    const login = async () => {
        // 保证全部的表单校验通过后再发请求
        await loginForms.value.validate()

        // 点击后给按钮添加加载效果
        loading.value = true

        try {
            await useStore.userLogin(loginForm)
            // 编程式导航跳转到首页
            // 判断登录时是否有query参数，如果有就跳转到query参数对应的页面，没有就跳到首页
            let redirect:any = $route.query.redirect
            $router.push({ path: redirect || '/' })
            // 登录成功的提示信息
            ElNotification({
                type: 'success',
                message: '欢迎回来',
                title: `Hi,${getTime()}好`,
            })
            // 登录成功加载效果消失
            loading.value = false
        } catch (error) {
            // 登录失败加载效果消失
            loading.value = false
            // 登录失败的提示信息
            ElNotification({
                type: 'error',
                message: (error as any).message,
            })
        }
    }
</script>

<style scoped lang="scss">
    .login-container {
        width: 100%;
        height: 100vh;
        background: url('@/assets/images/background.jpg') no-repeat;
        background-size: cover;
        .login-form {
            position: relative;
            width: 80%;
            top: 30vh;
            background: url('@/assets/images/login_form.png') no-repeat;
            background-size: cover;
            padding: 40px;
            h1 {
                color: white;
                font-size: 20px;
            }
            h2 {
                font-size: 20px;
                color: white;
                margin: 20px 0;
            }
            .login-btn {
                width: 100%;
            }
        }
    }
</style>
