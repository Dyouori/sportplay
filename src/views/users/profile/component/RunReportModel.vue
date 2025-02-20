<template>
  <div>
    <el-dialog
      title="跑步报告"
      :visible.sync="localReportVisible"
      width="900px"
      @closed="handleClose"
      class="dialog"
    >
      <div class="content">
        <div class="left">
          <div class="text">本月你一共跑了</div>
          <div class="step-count animate__animated animate__backInDown">
            {{ totalRunThisMonth }}
          </div>
          <div class="text">步</div>
        </div>
        <div class="right">
          <div class="text">本月跑步最多的那一天是</div>
          <div class="step-max animate__animated animate__backInDown">
            {{ maxDay }}
          </div>
          <div class="text">那天发生了什么呢~</div>
        </div>
      </div>
      <div id="main" class="chart"></div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleClose">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import "animate.css";
import * as echarts from "echarts";
export default {
  props: {
    parentReportVisible: {
      type: Boolean,
      default: false,
    },
    stepCounts: {
      type: Object,
      default: function () {
        return {};
      },
    },
    currentMonth: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      totalRunThisMonth: "", //这个月跑步步数
      localReportVisible: false, // 创建一个本地副本
      maxDay: "", //跑步最多的日期
    };
  },

  created() {
    console.log("stepCounts:", this.stepCounts);
    this.calculateTotalStepsForCurrentMonth();
    this.localReportVisible = this.parentReportVisible;
    // this.echart()
  },
  mounted() {
    this.$nextTick(() => {
      this.echart();
    });
  },
  methods: {
    // 格式化日期
    formatDate(dateString) {
      const [year, month, day] = dateString.split("-").map(Number);
      const date = new Date(year, month - 1, day); // 注意月份是从0开始的
      return `${month}月${day}日`;
    },
    //只要本月步数
    calculateTotalStepsForCurrentMonth() {
      let totalSteps = 0;
      let maxSteps = 0;
      let maxDay = "";

      const [year, month] = this.currentMonth.split("-").map(Number);

      for (const [date, steps] of Object.entries(this.stepCounts)) {
        const [dateYear, dateMonth, dateDay] = date.split("-").map(Number);
        if (dateYear === year && dateMonth === month) {
          totalSteps += steps;
          if (steps > maxSteps) {
            maxSteps = steps;
            maxDay = `${dateYear}-${dateMonth}-${dateDay}`;
          }
        }
      }

      this.totalRunThisMonth = totalSteps;
      this.maxDay = this.formatDate(maxDay); // 设置跑步最多的那一天
      console.log(this.totalRunThisMonth, this.maxDay);
    },
    handleClose(done) {
      this.localReportVisible = false;
      //告诉父组件要关了，让他关
      this.$emit("closeDialog");
    },
    echart() {
      if (this.stepCounts) {
        var chartDom = document.getElementById('main');
    if (chartDom) {
      var myChart = echarts.init(chartDom);
      const data = Object.keys(this.stepCounts).map(dateStr => {
        const timestamp = new Date(dateStr).getTime();
        const steps = this.stepCounts[dateStr];
        return [timestamp, steps];
      });

      const option = {
        tooltip: {
          trigger: 'axis',
          position: function (pt) {
            return [pt[0], '10%'];
          }
        },
        title: {
          left: 'left',
          text: '全部步数统计'
        },
        xAxis: {
          type: 'time',
          boundaryGap: false
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '50%'],
          max: 39999
        },
        dataZoom: [
          {
            type: 'slider', // 滑动条型数据区域缩放组件
            start: 0,       // 数据窗口范围的起始百分比
            end: 100        // 数据窗口范围的结束百分比
          },
          {
            type: 'inside', // 内置型数据区域缩放组件
            start: 0,       // 数据窗口范围的起始百分比
            end: 100        // 数据窗口范围的结束百分比
          }
        ],
        series: [
          {
            name: '步数',
            type: 'line',
            smooth: true,
            symbol: 'none',
            areaStyle: {},
            data: data
          }
        ]
      };

          option && myChart.setOption(option);
        }
      }
    },
  },
};
</script>

<style scoped>
.text {
  font-size: 17px;
  width: 200px;
  margin: 10px 0;
}

.step-count {
  width: 200px;
  font-weight: bold;
  overflow: hidden;
  font-size: 20px;
  color: rgb(15, 113, 218);
}

.step-max {
  width: 200px;
  font-weight: bold;
  overflow: hidden;
  font-size: 20px;
  color: rgb(11, 171, 11);
}

.content {
  display: flex;
  justify-content: center;
}
.chart {
  width: 100%;
  height: 400px;
 
}
.dialog{
    height: 750px;
    
}
</style>