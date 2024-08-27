<template>
  <div>
    <!-- 测试svg图标使用 -->
    <!-- svg：图标外层容器节点，内部需要与use标签结合使用 -->
    <svg :style="{ width, height }">
      <!-- xlink: href执行使用哪一个图标 属性值务必 # icon-图标名字 -->
      <use :xlink:href="prefix + name" :fill="color"></use>
    </svg>
  </div>
</template>

<script setup lang="ts">
  // 接收父组件传递过来的参数
  defineProps({
    // xlink:href属性值的前缀
    prefix: {
      type: String,
      default: '#icon-',
    },
    // 图标的名字
    name: String,
    // 图标的颜色
    color: {
      type: String,
      default: '',
    },
    //接受父组件传递过来的图标的宽度
    width: {
      type: String,
      default: '16px',
    },
    //接受父组件传递过来的图标的高度
    height: {
      type: String,
      default: '16px',
    },
  })
</script>
