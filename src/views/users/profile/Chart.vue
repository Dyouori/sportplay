<template>
  <div class="root-container">
    <div class="weightContainer">
      <div class="title">体重管理</div>
      <div class="aim">
        <div class="circle">
          <div class="num">
            {{ weight }}
          </div>

          <div class="text">当前体重</div>
          <div class="kg">kg</div>
          <el-input-number
            class="changeNum"
            v-show="visible"
            v-model="weight"
            :min="0"
            :max="300"
            @change="handleChange"
          />
        </div>

        <div class="circle">
          <div class="num">
            {{ dreamWeight }}
          </div>

          <div class="text">目标体重</div>
          <div class="kg">kg</div>
          <el-input-number
            class="changeNum"
            v-show="visible"
            v-model="dreamWeight"
            :min="0"
            :max="300"
            @change="handleChange"
          />
        </div>
      </div>
      <div class="btns">
        <el-button type="primary" @click="edit" plain>编辑</el-button>
        <el-button
          type="primary"
          :disabled="visible === false"
          @click="submit"
          plain
          >确定</el-button
        >
      </div>
    </div>
    <div class="Log">最近体重变化:(最多记录七天)</div>
    <div style="width: 80%">
      <div id="chart" style="width: 100%; height: 400px"></div>
    </div>
  </div>
</template>

<script>
import store from "@/store/user";
import * as echarts from "echarts";
import http from "@/utils/http";

export default {
  data() {
    return {
      text: "",
      weight: 0,
      dreamWeight: 0,
      num: 0,
      visible: false,
      times: [],
      weights: [],
    };
  },
  mounted() {
    const userJSON = window.sessionStorage.getItem("user");
    const user = JSON.parse(userJSON);

    if (user) {
      store.dispatch("getWeight", user.id).then(() => {
        this.weight = store.state.weight;
        this.dreamWeight = store.state.dreamWeight;
      });
    }
    this.initEcharts();
  },
  methods: {
    handleChange(event) {
      // 您的处理逻辑
    },
    initEcharts() {
  let userId = JSON.parse(window.sessionStorage.getItem("user"));
  http.get("weightChart", { params: { id: userId.id } }).then((res) => {
    console.log(res);
    
    if (res.data.data && res.data.data.length > 0) {
      // 创建一个对象来存储最后更改的记录
      const lastChanges = {};

      // 遍历数据，确保只保留最后一次更改的记录
      res.data.data.forEach((item) => {
        const datePart = item.date.split("T")[0];
        const timePart = item.date.split("T")[1]; // 获取时间部分，包括小时、分钟、秒
        const fullDate = `${datePart}T${timePart}`; // 重新组合完整的日期时间字符串
//console.log(lastChanges[datePart]);

        // 如果没有该日期的记录，或者有记录但当前的时间戳更大（即更近的时间），则更新记录
        if (!lastChanges[datePart] || new Date(fullDate) > new Date(lastChanges[datePart].date)) {
          lastChanges[datePart] = item;
        }
      });

      // 将对象转换成数组并按照日期排序
      const filteredData = Object.values(lastChanges).sort((a, b) => new Date(a.date) - new Date(b.date));

      // 如果数据长度超过7，则只取最后7条记录
      const recentData = filteredData.length > 7 ? filteredData.slice(-7) : filteredData;

      // 处理最近7天的数据
      recentData.forEach((item) => {
        const datePart = item.date.split("T")[0];
        const [year, month, day] = datePart.split("-");
        this.times.push(`${month}月${day}日`);
        this.weights.push(item.weight);
      });

      // 初始化图表
      this.initChart(this.times, this.weights);
    } else {
      this.text = "还没有记录体重,开始记录吧！";
    }
  });
},


    edit() {
      this.visible = true;
    },
    submit() {
      this.visible = false;
      const user = JSON.parse(window.sessionStorage.getItem("user"));
      store.dispatch("setWeight", {
        id: user.id,
        weight: this.weight,
        dreamWeight: this.dreamWeight,
      });
     // 提交完成后，刷新页面
     window.location.reload();
    //  console.log(store.state.weight);
    },
    initChart(times, weights) {
      let chartDom = document.getElementById("chart");
      let myChart = echarts.init(chartDom);
      let option = {
        xAxis: {
          type: "category",
          data: times,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: weights,
            type: "line",
          },
        ],
      };
      myChart.setOption(option);
    },
  },
};
</script>

<style scoped>
.weightContainer {
  width: 80%;
  background-color: #2f63f12b;
  position: relative; /* 或者 absolute 或 fixed */
  border-radius: 20px;
}

.aim {
  position: relative;
  margin-top: 5%;
  width: 100%;
  height: 190px;
  display: flex;
  justify-content: space-between;
}
.circle {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: rgba(0, 102, 255, 0.189);
  text-align: center;
  position: relative;
  margin: auto;
}
.num {
  width: 50px;
  height: 50px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* 使用 transform 进行居中 */
  font-size: 45px;
  font-weight: bold;
  color: #2f66ff;
}
.title {
  position: absolute;
  width: 100px;
  height: 25px;
  padding: 4px 7px;
  font-size: 18px;
  font-weight: bold;
  color: #715e5e;
  border: rgba(47, 99, 241, 0.4) 3px outset;
  border-radius: 20px 0 20px 0;
}
.text {
  font-size: 20px;
  margin-top: 15px;
}
.btns {
  padding-top: 8px;
  padding-bottom: 15px;
}
.changeNum {
  top: 19px;
}
.kg {
  font-size: 20px; /* 可根据需要调整大小 */
  margin-top: 78px;
}
.Log {
  font-size: 16px;
  font-weight: bold;
  color: rgba(0, 102, 255, 0.647);
  width: 210px;
  height: 20px;
  margin-top: 3%;
  margin-bottom: -2%;
}
</style>
