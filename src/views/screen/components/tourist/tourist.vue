<template>
  <div class="box">
    <div class="top">
      <p class="title">实时游客统计</p>
      <p class="bg"></p>
      <p class="right">可预约总量<span>9999</span>人</p>
    </div>
    <div class="number">
      <span v-for="(item, index) in people" :key="index">{{ item }}</span>
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
  import * as echarts from 'echarts'
  // 水球图拓展插件
  import 'echarts-liquidfill'
  import { ref, onMounted } from 'vue'
  let people = ref('216908人')

  // 获取节点
  let charts = ref()
  onMounted(() => {
    // 获取echarts类的实例
    let myCharts = echarts.init(charts.value)
    // 设置实例的配置项
    myCharts.setOption({
      // 标题
      title: {
        text: '水球图',
        textStyle: {
          color: '#fff',
          fontSize: 16,
          fontWeight: 'bold',
        },
        left: 'center',
        top: '20%',
      },
      // x|y组件
      // xAxis: {},
      // yAxis: {},
      // 系列：决定你展示什么样的图形图标
      series: [
        {
          radius: '90%',
          type: 'liquidFill',
          data: [0.6, 0.55, 0.4, 0.25],
          color: ['rgba(28,173,160)', 'rgba(27,173,190)', 'rgba(31,195,185)', 'rgba(19,155,183)'],
          label: {
            normal: {
              formatter: '75%',
              textStyle: {
                fontSize: 20,
                color: '#fff',
              },
            },
          },
          backgroundStyle: {
            color: '#001e3b',
          },
          outline: {
            show: true,
            borderDistance: 8,
            itemStyle: {
              color: 'none',
              borderColor: 'rgba(34,195,214)',
              borderWidth: 8,
              shadowBlur: 20,
              shadowColor: 'rgba(0, 0, 0, 0.25)',
            },
          },
        },
      ],
      // 布局组件
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
  .box {
    background: url(../../images/dataScreen-main-lb.png) no-repeat;
    background-size: 100% 100%;
    margin-top: 10px;

    .top {
      margin-left: 20px;

      .title {
        color: white;
        font-size: 20px;
      }

      .bg {
        width: 68px;
        height: 7px;
        background: url(../../images/dataScreen-title.png) no-repeat;
        background-size: 100% 100%;
        margin-top: 10px;
      }

      .right {
        float: right;
        color: white;
        font-size: 20px;

        span {
          color: yellowgreen;
        }
      }
    }

    .number {
      padding: 10px;
      margin-top: 30px;
      display: flex;

      span {
        flex: 1;
        height: 40px;
        text-align: center;
        line-height: 40px;
        background: url(../../images/total.png) no-repeat;
        background-size: 100% 100%;
        color: #29fcff;
      }
    }

    .charts {
      width: 100%;
      height: 270px;
    }
  }
</style>
