<template>
  <div>

    <!--条件搜索区域-->
    <el-row>
      <el-col :span="24">
        <el-card header="人脸列表">
          <el-form :inline="true">
              <el-form-item label="人脸名称">
                <el-input
                    v-model="searchFace.faceName"
                    placeholder="名称"
                    clearable>
                </el-input>
              </el-form-item>
            <el-form-item label="人脸状态">
              <el-select v-model="searchFace.faceStatus" placeholder="请选择">
                <el-option label="不限" value=""></el-option>
                <el-option label="启用" value="0"></el-option>
                <el-option label="禁用" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button icon="el-icon-search" @click="getFaceList">搜索</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>


    <!--数据显示区域-->
    <el-row>
      <el-col :span="24">
        <el-card>
          <el-header style="background-color: #ffffff">
            <el-button @click="handleSave()" icon="el-icon-circle-plus-outline">添加人脸</el-button>
          </el-header>
          <el-table
              :data="tableData"
              style="width: 100%">
            <el-table-column
                width="100"
                prop="fid"
                label="编号" sortable>
            </el-table-column>

            <el-table-column
                width="150"
                prop="date"
                label="人脸图片">
              <template slot-scope="scope">
                <el-button icon="el-icon-picture-outline" size="mini" @click="selectImg(scope.row.faceBase)">查看人脸</el-button>
              </template>
            </el-table-column>

            <el-table-column
                prop="createTime"
                label="创建时间" width="200" sortable>
            </el-table-column>

            <el-table-column
                prop="vefNum"
                label="验证次数" sortable>
            </el-table-column>

            <el-table-column
                prop="faceName"
                label="姓名">
            </el-table-column>

            <el-table-column
                prop="remark"
                label="备注">
            </el-table-column>

            <el-table-column
                prop="faceStatus"
                label="是否启用" sortable>
              <template slot-scope="scope">
                <el-switch
                    :value="scope.row.faceStatus===0"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                </el-switch>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="230">
              <template slot-scope="scope">
                <el-button
                    icon="el-icon-edit"
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-popconfirm
                :title="('确认删除'+scope.row.faceName+'的人脸数据吗?')"
                @confirm="handleDelete(scope.$index, scope.row)"
                >
                  <el-button
                      style="margin-left: 20px"
                      icon="el-icon-delete"
                      size="mini"
                      type="danger"  slot="reference">删除</el-button>
                </el-popconfirm>

              </template>
            </el-table-column>

          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!--分页-->
    <el-row class="page-row">
      <el-pagination
          class="el-pagination"
         @size-change="handleSizeChange"
         @current-change="handleCurrentChange"
         layout="total, sizes, prev, pager, next, jumper"
         :page-sizes="[5, 10, 30, 50]"
         :current-page="current"
         :page-size="size"
         :total="total">
      </el-pagination>
    </el-row>



    <!--查看人脸图片-->
    <el-dialog
        title="人脸图片"
        :visible.sync="selectImgDialog"
        width="30%">
        <img style="width: 100%;" :src="currentImg">
    </el-dialog>


    <!-- 添加/修改-->
    <el-dialog
    :title="saveAndUpdateTitle"
    :visible.sync="saveAndUpdateDialog"
    :before-close="handleClose"
    width="600px"
    >
      <el-form :model="faceObj" :rules="rules" ref="ruleForm" label-width="80px">

        <input type="hidden" v-model="faceObj.fid"></input>

        <el-form-item label="人脸名称" prop="faceName">
          <el-input placeholder="必填项" v-model="faceObj.faceName"></el-input>
        </el-form-item>

        <el-form-item label="人脸状态" style="margin-bottom: 30px" prop="faceStatus">
          <el-select style="width: 100%;" v-model="faceObj.faceStatus" placeholder="请选择">
            <el-option label="启用" :value="0"></el-option>
            <el-option label="禁用" :value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="人脸数据" class="login-mid-mid" prop="faceBase">
          <!--捕获人脸区域-->
          <div class="savevideoCamera-canvasCamera " style="margin-top: -60px;" ref="effetAdd">

            <el-input type="hidden" v-model="faceObj.faceBase"></el-input>
          </div>

          <!--拍照显示区域-->
          <div class="savefaceBase" id="faceBase">

          </div>

          <!--按钮区域-->
          <div class="saveface-btn" v-if="addFaceText === 'success'">
            <el-tag type="success">录入完成</el-tag>
          </div>
          <div class="saveface-btn" v-else>
            <el-tag>{{addFaceText === '人脸开始检测'?'头部请上下左右转动':addFaceText}}</el-tag>
          </div>

        </el-form-item>


        <el-form-item label="备注">
          <el-input placeholder="非必填" type="textarea" v-model="faceObj.remark"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>


      </el-form>

    </el-dialog>

  </div>


</template>

<script>
export default {
  data() {
    return {
      size:5,
      current:1,
      total:0,
      videoWidth: 200,
      videoHeight: 200,
      faceImgState:false,
      searchFace:{
        faceName:'',
        faceStatus:''
      },
      tableData:[],
      selectImgDialog:false,
      currentImg:'',
      saveAndUpdateDialog:false,
      saveAndUpdateTitle:'',
      faceObj:{
        fid:null,
        faceName:'',
        faceBase:'',
        faceStatus:0,
        remark:'',
        addAndUpdateState:false,
      },
      rules:{
        faceName:[
          { required: true, message: '请输入人脸名称', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        faceBase:[{ required: true, message: '人脸数据不能为空'}]
      },
      faceOption:{},
      cameraState:false,
      // 第一次加载标记
      addFaceLoading:false,
      addFaceText:'',
    }
  },
  watch:{

    saveAndUpdateDialog:{
      handler(newValue,oldValue){
        this.$nextTick(()=>{
          if (newValue){
            if (this.addFaceLoading){
              this.addFaceText = ''
              if (this.addAndUpdateState) {
                this.faceObj.faceBase = ''
              }
              this.$faceEffet.restart()
              return;
            }
            this.$faceEffet.init({
              el: this.$refs.effetAdd,
              type:'addFace',
              addFaceDistance:28,// 人脸距离屏幕的距离
              callBack: this.callBack
            })
            this.addFaceLoading = true
          }else {
            this.$faceEffet.close();
          }
        })
      }
    }
  },
  // 获取人脸数据
  created() {
      this.getFaceList()
  },
  methods: {
    callBack(data){
      Promise.all(data.base64Array).then((base64Strings) => {
        this.addFaceText = data.progressMessage
        this.faceObj.faceBase = base64Strings[0] || ''
        if (this.addFaceText === 'success'){
          let faceBase = document.getElementById("faceBase");
          faceBase.innerHTML = "<img src='"+this.faceObj.faceBase+"' />"
        }
      }).catch((error) => {
        console.error("Error resolving promises:", error);
      });
    },
    // 增加|修改
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$faceAxios.post("/face/"+(this.addAndUpdateState?'save':'update'),this.faceObj).then(res =>{
            this.$message({
              showClose:true,
              message:res.msg,
              type:'success',
              duration:3000
            })
            this.getFaceList()
            this.saveAndUpdateDialog = false
          })
        } else {
          return false;
        }
      });
    },
    // 重置表单
    resetForm(formName) {
      let faceBase = document.getElementById("faceBase");
      faceBase.innerHTML= ""
      this.$refs[formName].resetFields();
    },
    // 查看人脸
    selectImg(faceBase){
        this.selectImgDialog = true
        this.currentImg = faceBase
    },
    // 获取人脸列表
    getFaceList(){
        this.$faceAxios.get('/face/faceList',{
          params:{
            current:this.current,
            size:this.size,
            faceName:this.searchFace.faceName,
            faceStatus:this.searchFace.faceStatus
          }
        }).then(res =>{
          this.tableData = res.data.records
          this.size = res.data.size
          this.current = res.data.current
          this.total = res.data.total
        })
    },
    // 分页
    handleSizeChange(val) {
      this.size = val
      this.getFaceList()
    },
    // 分页
    handleCurrentChange(val) {
      this.current = val
      this.getFaceList()
    },
    // 关闭弹出层
    handleClose() {
      this.saveAndUpdateDialog = false
      this.cameraState = false
      this.resetForm('ruleForm')
    },
    // 设置按钮的延迟加载
    setCameraState(){
      setTimeout(()=>{
        this.cameraState = true
      },1500)
    },
    // 添加
    handleSave(){
      this.setCameraState()
      this.addAndUpdateState = true
      this.saveAndUpdateDialog = true
      this.saveAndUpdateTitle = '添加人脸'
    },
    // 修改
    handleEdit(index, row) {
      this.setCameraState()
      this.addAndUpdateState = false
      this.saveAndUpdateDialog = true
      this.saveAndUpdateTitle = '修改人脸'
      this.$faceAxios.get("/face/info/"+row.fid).then(res =>{
        this.faceObj = res.data
        let faceBase = document.getElementById("faceBase");
        faceBase.innerHTML = "<img src='"+this.faceObj.faceBase+"' />"
      })
    },
    //删除
    handleDelete(index, row) {
      console.log(index, row);
      this.$faceAxios.get("/face/faceDelete/"+row.fid).then(res =>{
        this.getFaceList();
        this.$message.success(res.data.msg)
      })
    }
  }
}
</script>

<style>
@import "./index.css";
</style>
