<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="60%"
    @close = "handleClose"
  >
   <Video
    :videoUrl = "videoUrl"
   />
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Video from './Video.vue';
export default {
    components: { Video },
    props: {
      videoUrl: {
        type: String,
        default: '',
      },
      videoVisible:{
        type: Boolean,
      }
    },
  data() {
    return {
        dialogVisible: false,
    };
  },
  created() {
    this.dialogVisible = this.videoVisible;
  },
  
  methods: {
    handleClose(type) {
      this.dialogVisible = false;
      this.$emit('close', type);
    },
  },
};
</script>

<style scoped>
</style>