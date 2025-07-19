<template>
  <div class="content">
    <el-calendar>
      <template slot="dateCell" slot-scope="{ date, data }">
        <!-- 通过使用这个插槽，你可以覆盖掉 el - calendar 组件默认的日期单元格显示方式，实现高度定制化。 -->
        <p
          :class="{ 'is-selected': isDateSelected(date) }"
          @click="toggleSelectDate(date)"
          class="date"
        >
          {{ data.day.split("-").slice(1).join("-") }}

          <span v-if="isDateSelected(date)">✔️</span>
        </p>

        <div v-if="isEditing && editingDate === data.day" class="editRun">
          <el-input
            v-model="tempStepCount"
            placeholder="请输入步数"
            size="small"
            class="inputRun"
          ></el-input>
          <el-button
            type="text"
            size="medium"
            @click="confirmStepCount(data.day)"
          >
            确定
          </el-button>
          <el-button
            type="text"
            size="medium"
            @click="cancelStepCount(data.day)"
          >
            取消
          </el-button>
        </div>
        <div v-else-if="isDateSelected(date)" class="showRun">
          <div>步数: {{ stepCounts[data.day] }}</div>
          <el-button type="text" size="medium" @click="editStepCount(data.day)">
            修改
          </el-button>
        </div>
        <p class="btn">
          <el-button
            v-if="
              !isDateSelected(date) &&
              (!data.cellClassName ||
                (!data.cellClassName.includes('prev-month') &&
                  !data.cellClassName.includes('next-month')))
            "
            type="primary"
            size="small"
            plain
            @click.stop="toggleSelectDate(date)"
          >
            打卡
          </el-button>
        </p>
      </template>
    </el-calendar>
    <div style="margin-top: 16px;">
        <el-button type="success" @click="onOpenReport">
            查看我的运动月报
        </el-button>
    </div>
    <RunReportModel
        v-if="runReportVisible"
        :parentReportVisible = "runReportVisible"
        :stepCounts = "this.stepCounts"
        @closeDialog = "onCloseReportDialog"
        :currentMonth="currentMonth" 
    />

  </div>
</template>

<script>
import RunReportModel from './component/RunReportModel.vue';
export default {
    components:{
        RunReportModel
    },
    computed: {
  currentMonth() {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}`;
  }
},

  data() {
    return {
      selectedDates: [],
      stepCounts: {},
      tempStepCount: "", // 临时存储用户输入的步数
      user_id: "",
      isEditing: false, // 新增一个状态来跟踪是否处于编辑状态
      editingDate: "", // 当前正在编辑的日期
      runReportVisible:false,
    };
  },
  created() {
    var userString = window.sessionStorage.getItem("user");
    var user = JSON.parse(userString);
    this.user_id = user.id;
    this.getRecords();
  },
  methods: {
    onCloseReportDialog(){
        this.runReportVisible = false;
    },
    onOpenReport(){
        this.runReportVisible = true;
    },
    async getRecords() {
      const response = await this.$https.get(`getRun?user_id=${this.user_id}`);
      const records = response.data; // 假设返回的数据格式是 { '2023-01-01': 10000, '2023-01-02': 12000, ... }
      // 清空之前的步数记录
      this.stepCounts = {};

      // 遍历记录并更新 stepCounts
      records.forEach((record) => {
        const date = record.date; // 日期字符串，例如 "2025-02-11"
        const step = record.step; // 步数字符串，例如 "12332"
        this.$set(this.stepCounts, date, parseInt(step, 10)); // 将步数转换为整数并存储
        this.selectedDates.push(date); // 将有步数记录的日期添加到选中日期数组
      });
      console.log(this.stepCounts);
    },
    isDateSelected(date) {
      return this.selectedDates.includes(this.formatDate(date));
    },
    toggleSelectDate(date) {
      const dateString = this.formatDate(date);
      if (!this.selectedDates.includes(dateString)) {
        this.selectedDates.push(dateString);
        this.isEditing = true; // 设置编辑状态为true
        this.editingDate = dateString; // 设置当前正在编辑的日期
      }
    },
    editStepCount(date) {
      this.tempStepCount = this.stepCounts[date] || ""; // 将当前步数赋值给临时变量
      this.editingDate = date; // 设置当前正在编辑的日期
      this.isEditing = true; // 设置编辑状态为true
    },
    confirmStepCount(date) {
      // 检查用户是否输入了步数
      if (!this.tempStepCount || this.tempStepCount.trim() === "") {
        // 如果没有输入步数，则显示错误消息并取消编辑状态
        this.$message({
          type: "warning",
          message: "请输入步数！",
        });
        this.cancelStepCount(date); // 调用取消方法来重置状态
        return;
      }
      // 更新步数逻辑

      const isEdit = this.stepCounts[date] !== undefined;
      this.stepCounts[this.editingDate] = this.tempStepCount;

      this.isEditing = false; // 确认后，设置编辑状态为false
      this.editingDate = ""; // 清空当前正在编辑的日期
      this.$set(this.stepCounts, date, this.tempStepCount);
      this.tempStepCount = ""; // 清空临时变量
      // 构建RunData对象
      const runData = {
        user_id: this.user_id,
        date: date, // 将字符串转换为Date对象
        step: this.stepCounts[date],
      };
      //   console.log(this.stepCounts[this.editingDate]+'菜菜'+isEdit);

      // 根据是否是编辑状态调用不同的API
      if (isEdit) {
        this.editRunDataInDatabase(runData);
        // 编辑成功后，重置状态
        this.isEditing = false;
        this.editingDate = "";
        this.tempStepCount = "";
      } else {
        this.saveRunDataToDatabase(runData);
        // 添加成功后，重置状态
        this.isEditing = false;
        this.editingDate = "";
        this.tempStepCount = "";
      }
      console.log(`保存步数: ${date} -${this.stepCounts[date]}`);
    },
    //编辑步数
    async editRunDataInDatabase(runData) {
      const res = await this.$https.post(
        `editRunByDate?user_id=${runData.user_id}&date=${runData.date}&step=${runData.step}`
      );
      if (res.data === "find") {
        this.$message({
          type: "success",
          message: "修改成功",
        });
      } else {
        this.$message({
          type: "danger",
          message: "修改失败",
        });
      }
      this.getRecords();
    },
    //添加步数
    async saveRunDataToDatabase(runData) {
      const res = await this.$https.post(
        `addRun?user_id=${runData.user_id}&date=${runData.date}&step=${runData.step}`
      );
      if (res.data === "success") {
        this.$message({
          type: "success",
          message: "打卡成功",
        });
      } else {
        this.$message({
          type: "danger",
          message: "打卡失败请重试",
        });
      }
      this.getRecords();
    },

    cancelStepCount(date) {
      this.tempStepCount = ""; // 清空临时变量
      this.isEditing = false; // 取消后，设置编辑状态为false
      this.editingDate = ""; // 清空当前正在编辑的日期
      // 移除选中状态
      const index = this.selectedDates.indexOf(date);
      if (index > -1) {
        this.selectedDates.splice(index, 1);
      }
    },
    formatDate(date) {
      return date.toISOString().split("T")[0];
    },
  },
};
</script>

<style scoped>
.is-selected {
  color: #1989fa;
  font-weight: bold;
}
.date {
  text-align: center;
  margin-bottom: 5px;
}
::v-deep .el-calendar-day {
  display: flex;
}
::v-deep .el-button {
}
.btn {
  text-align: center;
  margin-top: 40px;
}
::v-deep .el-calendar {
  width: 1068px;
  margin-top: 10px;
}
::v-deep .el-calendar-day .date {
  font-size: 16px;
  height: 20px;
}
::v-deep .inputRun {
  margin-top: 37px;
  margin-left: 0px;
  padding: 0;
}
.editRun {
  width: 90px;
}
::v-deep .current {
  height: 108px;
}
::v-deep .el-calendar__header {
  font-size: 16px;
}
.showRun {
  height: 60px;
  margin-top: 30px;
  font-size: 16px;
  width: 79px;
}
.content{
    display: flex;
    justify-content: center;
}
</style>
