<template>
  <div class="box6">
    <div class="title">
      <p>热门景区排行</p>
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
        text: '景区排行',
        // 跳转链接
        // link:'http://www.baidu.com',
        // 标题位置
        left: '30%',
        textStyle: {
          color: 'rgba(28,178,171)',
          fontSize: 18,
        },
        // 子标题
        subtext: '各大景区排行',
        // 子标题样式
        subtextStyle: {
          color: 'rgba(19,154,180)',
          fontSize: 16,
        },
      },
      xAxis: {
        type: 'category',
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
        data: ['九寨沟', '张家界', '鱼子西', '赛里木湖', '布达拉宫'],
      },
      yAxis: {
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
      },
      grid: {
        left: 30,
        right: 0,
        top: 20,
        bottom: 20,
      },
      series: [
        {
          type: 'bar',
          data: [30, 10, 20, 50, 40],
          // 柱条的样式
          itemStyle: {
            borderRadius: [20, 20, 0, 0],
            // 柱条颜色
            color: function (data: any) {
              let arr = [
                'rgb(11,136,244)',
                'rgb(255,129,112)',
                'rgb(137,228,252)',
                'rgb(254,178,66)',
                'rgb(135,122,251)',
              ]
              return arr[data.dataIndex]
            },
          },
          // 设置柱条宽度
          barWidth: '50%',
        },
        {
          type: 'line',
          data: [30, 10, 20, 50, 40],
        },
      ],
    })
  })
</script>

<style scoped lang="scss">
  .box6 {
    width: 100%;
    height: 100%;
    background: url(../../images/dataScreen-main-cb.png) no-repeat;
    background-size: 100% 100%;
    margin: 20px 0px;

    .title {
      margin-left: 5px;

      p {
        color: white;
        font-size: 20px;
      }
    }

    .charts {
      height: calc(100% - 30px);
    }
  }
</style>
