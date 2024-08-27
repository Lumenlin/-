<template>
  <div class="box7">
    <div class="title">
      <p>年度游客量对比</p>
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
      title: {
        text: '散点图',
        // 标题位置
        left: '50%',
        textStyle: {
          color: 'rgba(28,178,171)',
          fontSize: 18,
        },
      },
      xAxis: {
        type: 'category',
      },
      yAxis: {
        show: false,
      },
      grid: {
        left: 0,
        right: 0,
        top: 40,
        bottom: 20,
      },
      series: [
        {
          type: 'scatter',
          data: [33, 88, 55, 66, 90, 12, 67, 45, 39, 96, 87, 30, 10, 56, 80, 31, 12, 99],
          symbolSize: 25,
          label: {
            show: true,
            color: '#fff',
          },
          // 散点图散点颜色
          itemStyle: {
            color: 'rgb(250,200,88)',
          },
        },
      ],
    })
  })
</script>

<style scoped lang="scss">
  .box7 {
    width: 100%;
    height: 100%;
    background: url(../../images/dataScreen-main-cb.png) no-repeat;
    background-size: 100% 100%;
    margin: 20px 0px;

    .title {
      p {
        color: white;
        font-size: 18px;
      }
    }

    .charts {
      height: calc(100% - 30px);
    }
  }
</style>
