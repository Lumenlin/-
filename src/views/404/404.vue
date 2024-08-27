<template>
  <div class="box">
    <img src="../../assets/images/error_images/404.png" alt="" />
    <button @click="goHome">首页</button>
  </div>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'
  let $router = useRouter()
  const goHome = () => {
    $router.push('/home')
  }
</script>

<style scoped lang="scss">
  .box {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    padding-top: 100px;
    img {
      width: 800px;
      height: 400px;
    }

    button {
      width: 120px;
      height: 50px;
      font-size: 20px;
      color: #fff;
      font-weight: 800;
      background-color: skyblue;
      border: 1px solid #fff;
      cursor: pointer;
    }
  }
</style>
