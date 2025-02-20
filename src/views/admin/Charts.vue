<template>
  <div >


    <div style="width: 50%">
      <div id="bie" style="width: 100%; height: 400px"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  mounted() {
    this.initEcharts();
  },
  data() {
    return {};
  },
  methods: {
    initEcharts(){
      this.$https.get("/bie").then(res=>{
    if(res.data.code === '0'){ // 使用res.data来访问响应数据
        //开始渲染数据
        console.log(res.data.data);
        
        this.initBie(res.data.data)
    }else{
        this.$message.error(res.data.msg) // 使用res.data来访问错误信息
    }
})

    },
    initBie(data) {
     let  chartDom = document.getElementById("bie");
     let  myChart = echarts.init(chartDom);
     let  option;

      option = {
        title: {
          text: "系统现有课程的类别统计",
         
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: "课程分类",
            type: "pie",
            radius: "50%",
            data:data,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };

      option && myChart.setOption(option);
    },
  },
};
</script>

<style scoped>


</style>
