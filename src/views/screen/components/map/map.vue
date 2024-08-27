<template>
  <div class="box4" ref="map"></div>
</template>

<script setup lang="ts">
  import * as echarts from 'echarts'
  import { ref, onMounted } from 'vue'
  import chinaJSON from './china.json'

  const map = ref(null)

  // 注册中国地图
  echarts.registerMap('china', chinaJSON as any)

  onMounted(() => {
    const myMap = echarts.init(map.value)
    myMap.setOption({
      geo: {
        map: 'china',
        roam: true, // 允许地图拖拽缩放
        //地图的位置调试
        // left: 80,
        // right: 80,
        top: 150,
        bottom: 0,
        zoom: 1.2,
        // 地图上文字展示
        label: {
          show: true,
          color: '#fff',
          fontSize: 12,
          opacity: 0.7,
        },
        itemStyle: {
          color: {
            // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: '#00008B', // 深蓝色 (DarkBlue) 0% 处的颜色
              },
              {
                offset: 1,
                color: '#1E90FF', // 浅蓝色 (LightSkyBlue) 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
          opacity: 0.8,
        },
        // 地图高亮效果
        emphasis: {
          itemStyle: {
            color: '#87CEFA',
          },
          label: {
            fontSize: 18,
            color: '#fff',
          },
        },
      },
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
      series: [
        {
          type: 'lines',
          data: [
            {
              coords: [
                [116.405285, 39.904989], // 起点
                [119.306239, 26.075302], // 终点
              ],
              // 统一的样式设置
              lineStyle: {
                color: 'orange',
                width: 2,
              },
            },
            {
              coords: [
                [116.405285, 39.904989], // 起点
                [114.298572, 30.584355], // 终点
              ],
              // 统一的样式设置
              lineStyle: {
                color: 'yellow',
                width: 2,
              },
            },
            {
              coords: [
                [110.824582, 33.158327], // 起点
                [120.451713, 24.182493], // 终点
              ],
              // 统一的样式设置
              lineStyle: {
                color: 'white',
                width: 2,
              },
            },
            {
              coords: [
                [115.784741, 40.55841], // 起点
                [86.864542, 28.022401], // 终点
              ],
              // 统一的样式设置
              lineStyle: {
                color: 'yellow',
                width: 2,
              },
            },
          ],
          //开启动画特效
          effect: {
            show: true,
            symbol: 'arrow',
            color: 'skyblue',
            symbolSize: 10,
          },
        },
      ],
    })
  })
</script>

<style scoped lang="scss">
  .box4 {
    height: 100%;
  }
</style>
