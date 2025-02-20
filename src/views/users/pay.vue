<template>
    <div>
      <img :src="imgSrc" alt="QR Code" id="img" />
      <div id="div">{{ message }}</div>
    </div>
  </template>
  
  <script>
  import $ from "jquery";
  export default {
    data() {
      return {
        orderId: 1,
        imgSrc: '',
        message: '',
        socket: null
      };
    },
    created() {
      this.getUrl(this.orderId);
      this.initializeWebSocket();
    },
    methods: {
      getUrl(orderId) {
        $.ajax({
          url: `http://192.168.40.238:9000/api/v1/order/payOrder?orderId=${orderId}`,
          type: "get",
          dataType: "json",
          success: (result) => {
            this.imgSrc = `data:image/png;base64,${result.data}`;
          },
          error: (result) => {
            alert(result);
          }
        });
      },
      initializeWebSocket() {
        if (typeof WebSocket !== "undefined") {
          console.log("您的浏览器支持WebSocket");
          this.socket = new WebSocket("ws://192.168.40.238:9000/ws/" + this.orderId);
  
          this.socket.onopen = () => {
            console.log("Socket 已打开");
          };
  
          this.socket.onmessage = (msg) => {
            console.log("接收到消息：" + msg.data);
            if (msg.data === '支付成功') {
              this.message = msg.data;
            }
          };
  
          this.socket.onclose = () => {
            console.log("Socket已关闭");
          };
  
          this.socket.onerror = () => {
            alert("Socket发生了错误");
          };
        } else {
          console.log("您的浏览器不支持WebSocket");
        }
      },
      getParameter(param) {
        const query = window.location.search.substring(1);
        const vars = query.split("&");
        for (let i = 0; i < vars.length; i++) {
          const pair = vars[i].split("=");
          if (pair[0] === param) {
            return pair[1];
          }
        }
        return "";
      }
    }
  };
  </script>
  
  <style>
  /* Add your styles here */
  </style>
  