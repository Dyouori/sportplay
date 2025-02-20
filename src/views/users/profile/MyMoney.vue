<template>
  <div class="container">
    <div class="wp">
      <div class="title">
        <span class="pay-bcoin-index-icon"></span>
        <div class="txt">我的账户</div>
        <a
          target="_blank"
          href="https://www.bilibili.com/html/help.html#n1"
          class="pay-bcoin-help"
        >
          <span class="help-icon"></span>
          <span class="help-txt">常见问题</span>
        </a>
      </div>

      <div class="pay-bcoin-index-content">
        <div class="name">账户余额</div>
        <div class="box">
          <div class="pay-bcoin-num">{{ curMoney }}</div>
          <el-button class="pay-bcoin-btn" @click="toPay" type="primary"
            >充值</el-button
          >
        </div>
      </div>
    </div>

    <el-dialog title="选择充值金额" :visible.sync="dialogFormVisible">
      <div class="pay-bcoin-recharge-content-title">请扫码充值</div>
      <el-form :model="form" class="pay-bcoin-recharge-content">
        <div
          v-for="(item, index) in items"
          :key="index"
          class="select-box"
          @click="selectItem(index)"
        >
          <div
            class="pay-rechange-item"
            :class="{ selected: selectedItem === index }"
          >
            <div class="pay-rechange-item-txt">{{ item }}</div>
          </div>
        </div>
      </el-form>

      <div>
        <img
          style="width: 200px; height: 200px"
          v-show="isShow"
          :src="imgSrc"
          alt="QR Code"
          id="img"
        />
        <div id="div">{{ message }}</div>
      </div>
      <div>
        <span class="alipayText">充值金额自定义？</span>
        <el-button type="primary" size="small" @click="pay" plain>点我使用支付宝</el-button>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关 闭</el-button>
        <el-button type="primary" @click="commit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import $ from "jquery";

export default {
  created() {
    this.userId = JSON.parse(sessionStorage.getItem("user")).id;
    this.fetchMoney();
   // console.log(this.$route.params.orderId);
  },
  onMounted() {
    // this.getUrl(this.orderId);

    this.curMoney = this.$store.state.money;
  },
  data() {
    return {
      curMoney: 0,
      formLabelWidth: "120px",
      dialogTableVisible: false,
      dialogFormVisible: false,
      form: {},
      isShow: false,
      items: ["50元", "150元", "500元"], // 你的选项数组
      selectedItem: null, // 当前选中的项的索引
      imgSrc: "",
      message: "",
      socket: null,
      userId: 0,
    };
  },


  methods: {
    pay() {
    // 使用 window.open 打开新页面
    const url = this.$router.resolve('/aliPay').href;
    window.open(url, '_blank');
    this.dialogFormVisible = false
  },

    fetchMoney() {
      this.$store
        .dispatch("getMoney", this.userId)
        .then(() => {
          this.curMoney = this.$store.state.money;
        })
        .catch((error) => {
          // 处理错误
        });
    },
    toPay() {
      this.dialogFormVisible = true;
    },
    selectItem(index) {
      this.selectedItem = index; // 设置当前选中的项的索引
    },
    commit() {
      this.getUrl();
      this.initializeWebSocket();
      if (this.selectedItem === null) {
        this.$message({
          message: "请选择充值金额！",
          type: "warning",
        });
      } else {
        this.isShow = true;
      }
    },
    initializeWebSocket() {
      if (typeof WebSocket !== "undefined") {
        console.log("您的浏览器支持WebSocket");
        this.socket = new WebSocket(
          "ws://localhost:9000/ws/" + this.selectedItem.toString()
        );

        this.socket.onopen = () => {
          console.log("Socket 已打开");
        };

        this.socket.onmessage = (msg) => {
          //  console.log("接收到消息：" + msg.data);
          if (msg.data === "支付成功") {
            this.$message({
              message: msg.data,
              type: "success",
            });

            this.$store
              .dispatch("addMoney", {
                userId: this.userId,
                OrderID: this.selectedItem,
              })
              .then(() => {
                this.$store
                  .dispatch("getMoney", this.userId)
                  .then(() => {
                    this.curMoney = this.$store.state.money;
                  })
                  .catch((error) => {
                    // 处理错误
                  });
                this.curMoney = this.$store.state.money;
              })
              .catch((error) => {
                // 处理错误
              });
              this.dialogFormVisible = false;
          }
        };

        this.socket.onclose = () => {
          // console.log("Socket已关闭");
        };

        this.socket.onerror = () => {
          alert("Socket发生了错误");
        };
      } else {
        // console.log("您的浏览器不支持WebSocket");
      }
    },
    getUrl() {
      //console.log(`http://192.168.40.238:9000/api/v1/order/payOrder??orderId=${id}`);
      $.ajax({
        url: `http://localhost:9000/api/v1/order/payOrder?orderId=${this.selectedItem}`,
        type: "get",
        dataType: "json",

        success: function (result) {
          const img = document.getElementById("img");
          img.setAttribute("src", "data:image/png;base64," + result.data);
        },
        error: function (result) {
          alert(result);
        },
      });
    },
    getParameter(param) {
      const query = window.location.search;
      const iLen = param.length;
      let iStart = query.indexOf(param);
      if (iStart === -1) {
        return "";
      }
      iStart += iLen + 1;
      let iEnd = query.indexOf("&", iStart);
      if (iEnd === -1) {
        return query.substring(iStart);
      }
      return query.substring(iStart, iEnd);
    },

  },
  beforeDestroy() {
    if (this.socket) {
      this.socket.close();
    }
  },
};
</script>

<style scoped>
.alipayText{
  color: #02a7e3;
  cursor: pointer;
}
.pay-rechange-item-txt {
  margin-left: 46px;
  font-size: 19px;
}
.select-box .selected {
  border: 1px solid #02a7e3;
  color: #02a7e3;
  cursor: default;
}
.pay-bcoin-recharge-content-title {
  font-size: 14px;
  color: #99a2aa;
  margin-bottom: 13px;
  width: 13%;
}
.pay-bcoin-recharge-content {
  padding: 15px 12px;
  display: -ms-flexbox;
  display: flex;
  flex-direction: row;

  background: #fff;
  -ms-flex-pack: center;
  justify-content: center;
}
.select-box {
  display: flex;
  width: 100%;
  align-items: center;

  flex-flow: wrap;
}
.pay-rechange-item {
  color: #222;
  box-sizing: border-box;
  border: 1px solid #e7ecf1;
  border-radius: 4px;
  height: 80px;
  display: -ms-flexbox;
  display: flex;
  text-align: center;
  width: 83%;
  align-items: center;
  margin-right: 16px;
  margin-bottom: 16px;
  cursor: pointer;
}

.pay-bcoin-btn {
  text-decoration: none;

  text-align: center;
  color: #fff;
  letter-spacing: 0;
  -ms-user-select: none;
  user-select: none;
  width: 140px;
  height: 45px;
  float: right;
  background: #02a7e3;
  border-radius: 4px;
  font-size: 22px;
  position: absolute;
  top: 0;
  right: 0;
}
.pay-bcoin-num:after {
  content: "RMB";
  font-size: 16px;
  margin-left: 4px;
  color: #01b5e7;
  font-weight: 400;
}
.pay-bcoin-index-content {
  padding: 15px 12px;

  display: flex;

  flex-direction: column;
  background: #fff;

  justify-content: center;
}
.name {
  font-size: 14px;
  color: #99a2aa;
  width: 10%;
}
.box {
  box-sizing: border-box;
  margin-top: 13px;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: end;
  align-items: flex-end;
  position: relative;
  padding-bottom: 16px;
  border-bottom: 1px solid #e7ecf1;
}
.pay-bcoin-num {
  font-size: 50px;
  color: #01b5e7;
  font-weight: 700;
  font-family: Microsoft YaHei, Arial, Helvetica, sans-serif;
}
.wp {
  width: 90%;
  border: 1px solid #ccd0d7;
  border-radius: 4px;
  margin-top: 48px;
}
.title {
  padding: 12px 28px;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  position: relative;
  background: #eef2f4;
  border-bottom: 1px solid #ccd0d7;
}
.pay-bcoin-index-icon {
  width: 25px;
  height: 25px;
  background: url(//s1.hdslb.com/bfs/static/jinkela/pay-pc/assets/icons.png) -355px -35px;
}
.txt {
  font-size: 16px;
  color: #6c818c;
  cursor: default;
  margin-left: 12px;
}
.pay-bcoin-help {
  text-decoration: none;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  position: absolute;
  top: 12px;
  right: 28px;
}
.help-icon {
  width: 24px;
  height: 24px;
  background: url(//s1.hdslb.com/bfs/static/jinkela/pay-pc/assets/icons.png) -66px -68px;
}
.help-txt {
  text-decoration: none;
  font-size: 14px;
  color: #879196;
}
</style>
