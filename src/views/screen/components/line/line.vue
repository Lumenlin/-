<template>
  <div class="box5">
    <div class="title">
      <p>未来7天游客量趋势图</p>
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
      title: {
        text: '访问量',
        textStyle: {
          color: '#fff',
          fontSize: 16,
          fontWeight: 'bold',
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: false, // 是否有留白
        // 是否要分割线
        splitLine: {
          show: false,
        },
        axisLine: {
          show: true,
        },
        axisTick: {
          show: true,
        },
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      },
      yAxis: {
        splitLine: {
          show: false,
        },
        // 轴线的设置
        axisLine: {
          show: true,
        },
        // 刻度
        axisTick: {
          show: true,
        },
      },
      grid: {
        left: 40,
        right: 0,
        top: 0,
        bottom: 20,
      },
      series: [
        {
          type: 'line',
          data: [342, 675, 289, 920, 750, 1200, 999],
          smooth: true, // 平滑曲线设置
          // 区域填充样式
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(103,86,70)', // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(17,24,80)', // 100% 处的颜色
                },
              ],
              global: false,
            },
          },
        },
      ],
    })
  })
</script>

<style scoped lang="scss">
  .box5 {
    width: 100%;
    height: 100%;
    background: url(../../images/dataScreen-main-cb.png) no-repeat;
    background-size: 100% 100%;
    margin: 0px 20px;

    .title {
      margin-left: 10px;

      p {
        color: white;
        font-size: 20px;
      }
    }

    .charts {
      height: calc(100% - 40px);
    }
  }
</style>
