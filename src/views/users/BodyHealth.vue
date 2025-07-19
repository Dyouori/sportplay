<template>
  <div class="data-upload">
    <div class="content">
      <el-form
        label-position="right"
        label-width="120px"
        :model="formLabelAlign"
        ref="formRef"
      >
        <el-form-item label="身高" prop="height">
          <el-input
            v-model="formLabelAlign.height"
            @input="calculateBMI"
          ></el-input>
          <span class="unit">厘米</span>
        </el-form-item>
        <el-form-item label="体重" prop="weight">
          <el-input
            v-model="formLabelAlign.weight"
            @input="calculateBMI"
          ></el-input>
          <div class="unit">kg</div>
        </el-form-item>
        <el-form-item label="BMI">
          <div style="display: flex; align-items: center">
            <span>{{ bmi }}</span>
            <el-alert
              :title="alertTitle"
              :type="alertType"
              show-icon
              :closable="false"
              :visable="isShowAlert"
            >
            </el-alert>
          </div>
        </el-form-item>
        <el-form-item label="心率" prop="xinlv">
          <el-input v-model="formLabelAlign.xinlv"></el-input>
          <div class="unit">次/每分钟</div>
        </el-form-item>
        <el-form-item label="体温" prop="tiwen">
          <el-input v-model="formLabelAlign.tiwen"></el-input>
          <div class="unit">℃</div>
        </el-form-item>
        <el-form-item label="血压" prop="xueya">
          <div @click="clickXueya">
            <el-input
              v-model="formLabelAlign.shousuoya"
              placeholder="收缩压"
            ></el-input>
            <div class="unit">毫米汞柱</div>
          </div>

          <div v-show="isXueya">
            <el-input
              style="margin-top: 10px"
              v-model="formLabelAlign.shuzhangya"
              placeholder="舒张压"
            ></el-input>
            <div class="unit">毫米汞柱</div>
          </div>
        </el-form-item>
        <el-form-item label="空腹血糖" prop="xuetang">
          <el-input v-model="formLabelAlign.emptyXuetang"></el-input>
          <div class="unit">毫摩尔/升</div>
        </el-form-item>
        <el-form-item label="餐后血糖" prop="xuetang">
          <el-input v-model="formLabelAlign.afterXuetang"></el-input>
          <div class="unit">毫摩尔/升</div>
        </el-form-item>
        <el-form-item label="血脂(总胆固醇‌)" prop="xuezhi">
          <el-input v-model="formLabelAlign.xuezhi"></el-input>
          <div class="unit">毫摩尔/升</div>
        </el-form-item>
        <el-form-item label="尿酸" prop="niaosuan">
          <el-input v-model="formLabelAlign.niaosuan"></el-input>
          <div class="unit">微摩尔/升</div>
        </el-form-item>
        <el-form-item>
          <div class="btns">
            <el-button type="primary" @click="submit">提交</el-button>
            <el-button type="" @click="reset">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formLabelAlign: {
        user_id: "",
        height: "",
        weight: "",
        xinlv: "", //心率
        tiwen: "", //体温
        shousuoya: "", //收缩压
        shuzhangya: "", //舒张压'
        emptyXuetang: "", //空腹血糖
        afterXuetang: "", //餐后血糖
        xuezhi: "", //血脂
        niaosuan: "", //尿酸
      },
      bmi: "自动计算", // 初始显示文本
      isShowAlert: false,
      alertType: "",
      alertTitle: "",
      isXueya: false, //血压两栏
      weight:'',
    };
  },
  created() {
    // 将字符串转换回JavaScript对象
    
    this.getWeight();
    this.getHealthData();
  },
  methods: {
    async getHealthData() { 
      const { data: res } = await this.$https.get("getHealth?id=" + this.formLabelAlign.user_id);
    
      this.formLabelAlign = res[0] //赋值
      this.calculateBMI();
    },
    async getWeight() {
      var userString = window.sessionStorage.getItem("user");
      var user = JSON.parse(userString);
      this.formLabelAlign.user_id = user.id;
      const { data: res } = await this.$https.get("getWeight?id=" + user.id);
      this.formLabelAlign.weight = res.weight;
      this.weight = res.weight;
    },
    async submit() {
      const { data: res } = await this.$https.post(
        "editHealth",
        this.formLabelAlign
      );
      if (res === "success") {
        this.$message.success("提交成功");
        this.editDialogVisible = false;
        this.getUser();
      } else {
        this.$message.error("提交失败！");
      }
      
    },
    reset() {
      this.formLabelAlign = {
        weight:this.weight,
      height: "",
      xinlv: "", //心率
      tiwen: "", //体温
      shousuoya: "", //收缩压
      shuzhangya: "", //舒张压'
      emptyXuetang: "", //空腹血糖
      afterXuetang: "", //餐后血糖
      xuezhi: "", //血脂
      niaosuan: "", //尿酸
    };
 
        this.$refs.formRef.resetFields(); // 重置表单组件的显示值
        this.$message({
          message: "重置成功",
          type: "success",
        });
      
    },
    calculateBMI() {
      const heightInMeters = this.formLabelAlign.height / 100; // 将身高转换为米
      const weightInKg = this.formLabelAlign.weight; // 将体重从斤转换为千克
      if (heightInMeters > 0 && weightInKg > 0) {
        const bmi = (weightInKg / (heightInMeters * heightInMeters)).toFixed(2);
        this.bmi = bmi;
      } else {
        this.bmi = "自动计算"; // 如果身高或体重为0，则显示初始文本
      }
      if (this.bmi >= 18.5 && this.bmi <= 24) {
        this.alertTitle = "正常";
        this.alertType = "success";
      } else if (this.bmi < 18.5) {
        this.alertTitle = "体重过轻";
        this.alertType = "warning";
      } else if (this.bmi > 24) {
        this.alertTitle = "超重";
        this.alertType = "warning";
      }
      this.isShowAlert = true;
    },
    clickXueya() {
      this.isXueya = true;
    },
    toggleInputVisibility() {
      this.isXueya = !this.isXueya;
    },
  },
};
</script>

<style scoped>
.data-upload {
  display: flex;
  justify-content: center;
}
.content {
  width: 800px;
  margin-top: 40px;
}
/* ::v-deep .el-input__inner{
 
} */
::v-deep .el-input {
  width: 600px;
}
.unit {
  width: 62px;
  display: inline-block;
  margin-left: 10px;
  font-weight: 200;
}
::v-deep .el-form-item__label {
  font-weight: bold;
}
.btns {
  padding-top: 8px;
  padding-bottom: 15px;
  display: flex;
  justify-content: center;
}
::v-deep .el-alert {
  width: 160px;
  height: 45px;
  background-color: white;
}
</style>
