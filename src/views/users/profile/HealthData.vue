<template>
 <div class="content">
  <el-table
    :data="tableData"
    style="width: 900px;font-size: 17px"
    :row-class-name="tableRowClassName"
     v-if="tableData && tableData.length > 0"
  >
    <!-- 项目名列 -->
    <el-table-column prop="name" label="项目" width="130" align="center"> </el-table-column>
    <!-- 实际数值列 -->
    <el-table-column prop="value" label="实际数值" width="180" align="center">
    </el-table-column>
    <!-- 健康数值列 -->
    <el-table-column prop="healthyValue" label="健康数值" width="180" align="center">
      <template slot-scope="scope">
        {{ healthyValues[scope.row.name] || "未知" }}
      </template>
    </el-table-column>
    <!-- 建议列 -->
    <el-table-column prop="suggestion" label="建议" align="center">
        <template slot-scope="scope">
    {{ scope.row.suggestion }}
  </template>    
    </el-table-column>
  </el-table>
  <el-empty
      v-else
      description="暂无数据，请填写信息"
      :image-size="200"
    >
    <el-button type="primary" @click="goToHealthData">去填写信息</el-button>
    </el-empty>
  <div class="footer"  v-if="tableData && tableData.length > 0">
    <span class="text">数据发生变化?</span>
    <el-button type="primary" @click="goToHealthData">点我前往修改→</el-button>
  </div>
 </div>
 
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      user_id: "",
      healthyValues: {
        血脂: "4.4-7.8 ",
        餐后血糖: "4.4-7.8 ",
        空腹血糖: "3.9-6.1 ",
        尿酸: "155-428",
        收缩压: "90-120 ",
        舒张压: "60-80",
        体温: "36.1-37.2",
        '心率(次/分钟)': "60-100",
        BMI:"18.5-24",
      },
    };
  },
  created() {
    this.getHealthData();
  },
  methods: {
   
    goToHealthData() {
      this.$router.push("/bodyHealth");
    },
    async getHealthData() {
      var userString = window.sessionStorage.getItem("user");
      var user = JSON.parse(userString);
      this.user_id = user.id;
      const { data: res } = await this.$https.get(
        "getHealth?id=" + this.user_id
      );
      // 将 res 对象转换成数组格式，每个属性作为一个对象放入数组中
      const res2 = res[0];
      // 映射关系
      const nameMapping = {
        xuezhi: "血脂",
        afterXuetang: "餐后血糖",
        weight: "体重",
        height: "身高",
        emptyXuetang: "餐后血糖",
        niaosuan: "尿酸",
        shousuoya: "收缩压",
        shuzhangya: "舒张压",
        tiwen: "体温",
        xinlv: "心率(次/分钟)",
      };

      // 定义要排除的键数组
      const keysToExclude = ["user_id", "id", "weight", "height","date"];

      // 使用映射对象来转换键名，并排除特定的键
      this.tableData = Object.keys(res2)
      .filter((key) => !keysToExclude.includes(key))
      .map((key) => {
        const newName = nameMapping[key] || key;
        const value = res2[key];
        const healthyRange = this.healthyValues[newName];
        let suggestion = '';
        let rowClassName = '';

        // 判断实际数值是否超出健康范围，并设置建议和行类名
        if (healthyRange) {
          const [min, max] = healthyRange.split('-').map(Number);
          const numValue = parseFloat(value);
          if (numValue < min || numValue > max) {
            suggestion = `数值异常，请注意身体健康!`;
            rowClassName = 'out-of-range-row'; // 自定义超出范围的行类名
          }else{
            suggestion = `正常`;
          }
        }

        return {
          name: newName,
          value: value,
          suggestion: suggestion,
          rowClassName: rowClassName, // 添加行类名属性
        };
      });

      // 检查 res2 中是否有 weight 和 height，如果有，则计算 BMI
      if (res2.weight && res2.height) {
        const weightKg = parseFloat(res2.weight); // 假设 weight 是以公斤为单位的体重
        const heightM = parseFloat(res2.height) / 100; // 假设 height 是以厘米为单位的身高，转换为米
        const bmi = (weightKg / (heightM * heightM)).toFixed(2); // 计算并格式化 BMI 值

         // 定义 BMI 的健康范围和建议
    const bmiHealthyRange = this.healthyValues["BMI"];
    let bmiSuggestion = '';
    let bmiRowClassName = '';
    if (bmiHealthyRange) {
      const [min, max] = bmiHealthyRange.split('-').map(Number);
      const numBmi = parseFloat(bmi);
      if (numBmi < min || numBmi > max) {
        bmiSuggestion = `数值异常，请注意身体健康!`;
        bmiRowClassName = 'out-of-range-row'; // 自定义超出范围的行类名
      } else {
        bmiSuggestion = `正常`;
      }
    }
        // 将计算出的 BMI 添加到 tableData 中
        this.tableData.push({
          name: "BMI",
          value: `${bmi} `,
          suggestion: bmiSuggestion,
      rowClassName: bmiRowClassName, // 添加行类名属性
        });
      }
    },
    tableRowClassName({ row}) {
      // 使用行数据中的 rowClassName 属性来设置类名
      
    return row.rowClassName || '';
    },
  },
};
</script>

<style scoped>
::v-deep .el-empty {
  width: 650px;
  margin-top: 80px;
}
::v-deep .el-empty .el-empty__description {
  color: #909399;
  font-size: 14px;
}
::v-deep .el-empty .el-button {
  margin-top: 20px;
}
::v-deep .out-of-range-row {
  background: #fae0e7;
}
.footer{
  width: 900px;
  display: flex;
  justify-content: center;
  margin-top: 18px;
  margin-bottom: 20px;
}
.footer .text{
  font-size: 16px;
  text-align: center;
  line-height: 42px;
  margin-right: 10px;
  color: rgb(94, 185, 234);
}
</style>
