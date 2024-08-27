<template>
  <div class="box2">
    <div class="title">
      <p>年龄比例</p>
      <img src="../../images/dataScreen-title.png" alt="" />
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
  import * as echarts from 'echarts'
  import { ref, onMounted } from 'vue'
  let charts = ref()
  onMounted(() => {
    let myCharts = echarts.init(charts.value)
    myCharts.setOption({
      tooltip: {
        trigger: 'item',
      },
      legend: {
        top: 40,
        right: 60,
        orient: 'vertical', // 图例组件方向
        itemGap: 20, // 设置图例项之间的间距
        textStyle: {
          fontSize: 18,
          color: '#fff',
        },
      },
      series: [
        {
          name: '年龄比例',
          type: 'pie',
          radius: ['40%', '80%'],
          center: ['35%', '50%'], // 将饼图向左移动,位于宽度的35%处
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            // borderColor: '#fff',
            borderWidth: 0,
          },
          label: {
            show: true,
            position: 'inside',
            color: '#fff',
          },
          labelLine: {
            show: false,
          },
          data: [
            { value: 1048, name: '0-18' },
            { value: 735, name: '18-35' },
            { value: 580, name: '35-50' },
            { value: 484, name: '50-70' },
            { value: 300, name: '>70' },
          ],
        },
      ],
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
    })
  })
</script>

<style scoped lang="scss">
  .box2 {
    width: 100%;
    height: 100%;
    background: url(../../images/dataScreen-main-cb.png) no-repeat;
    background-size: 100% 100%;

    .title {
      margin-left: 20px;

      p {
        color: white;
        font-size: 20px;
      }
    }

    .charts {
      height: 260px;
    }
  }
</style>
