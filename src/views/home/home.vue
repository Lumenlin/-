<template>
  <el-card>
    <div class="box">
      <img :src="userStore.avatar" alt="" class="avatar" />
      <div class="container">
        <h3 class="title">{{ getTime() }}好&nbsp;{{ userStore.username }}</h3>
        <p class="subtitle">甄选运营平台</p>
      </div>
    </div>
  </el-card>
  <div class="bottom">
    <svg-icon name="welcome" width="600px" height="500px"></svg-icon>
  </div>
</template>

<script setup lang="ts">
  // 引入用户相关的小仓库，获取当前用户的头像、昵称
  import useUserStore from '@/store/modules/user'
  import { getTime } from '@/utils/time'

  let userStore = useUserStore()
</script>

<style scoped lang="scss">
  .box {
    display: flex;
    align-items: center;
    .avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
    }
    .container{
      margin-left: 20px;
      .title{
        font-size: 22px;
        font-weight: 900;
        margin-bottom: 20px;
      }
      .subtitle{
        font-size: 17px;
      }
    }
  }
  .bottom{
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }
</style>
