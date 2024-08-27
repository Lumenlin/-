<template>
  <div class="box8">
    <div class="title">
      <p>预约渠道数据统计</p>
      <img src="../../images/dataScreen-title.png" alt="" />
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
  import * as echarts from 'echarts'
  import { ref, onMounted } from 'vue'

  const charts = ref(null)
  onMounted(() => {
    let myCharts = echarts.init(charts.value)
    myCharts.setOption({
      legend: {
        data: ['官网预约', '线下预约'],
        left: 'center',
        top: '-2%',
        textStyle:{
          color: '#fff',
          fontSize:18,
        }
      },
      radar: {
        // shape: 'circle',
        indicator: [
          { name: '官网', max: 65 },
          { name: '淘宝', max: 160 },
          { name: '代购', max: 300 },
          { name: '门店', max: 380 },
          { name: '授权店', max: 520 },
          { name: '电话', max: 250 },
        ],
        radius: '80%',
        center: ['50%', '60%'],
      },
      series: [
        {
          name: '线上 vs 线下',
          type: 'radar',
          data: [
            {
              value: [42, 30, 200, 350, 500, 180],
              name: '官网预约',
            },
            {
              value: [50, 140, 280, 260, 420, 210],
              name: '线下预约',
            },
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
  .box8 {
    width: 100%;
    height: 100%;
    background: url(../../images/dataScreen-main-cb.png) no-repeat;
    background-size: 100% 100%;
    margin-top: 20px;

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
