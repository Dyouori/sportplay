<template>
    <div class="payment-container" >
      <input type="number" v-model="orderId" placeholder="请输入充值金额" class="input-field">
      <button class="pay-button" @click="pay">支付</button>
      <div ref="alipayForm" class="hidden-form" target="_blank"></div>
    </div>
  </template>
  
  <script>
  import request from './request' 
  export default {
    created(){
      this.userId = JSON.parse(sessionStorage.getItem("user")).id;
    },
    data() {
      return {
        alipayForm: null,
        orderId: '',
        userId:'',
      }
    },
    mounted() {
      this.alipayForm = this.$refs.alipayForm
    },
    methods: {
  pay() {
      
    request
      .get('http://localhost:9000/alipay/pay', {
        params: {
          totalAmount: this.orderId,
          userId:this.userId
        }
      })
      .then((response) => {
        let innerHtml = response;
        innerHtml = innerHtml.substring(0, innerHtml.indexOf('<script>'));
        this.alipayForm.innerHTML = innerHtml;
       
        // 确保表单存在
        if (window.document.forms.length > 0) {
          window.document.forms[0].submit();
          // this.$store
          //     .dispatch("addMoney", {
          //       userId: this.userId,
          //       OrderID: this.orderId,
          //     })
        
        } else {
          console.error('没有找到表单元素');
        }
      })
      .catch((error) => {
        console.error('支付请求错误:', error);
      })
  }
}

  }
  </script>
  
  <style scoped>
  /* 样式保持不变 */
  .payment-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: #f0f8ff;
    font-family: Arial, sans-serif;
  }
  
  .input-field {
    width: 300px;
    margin: 10px 0;
    padding: 15px;
    border: 2px solid #c7e0ff;
    border-radius: 5px;
    outline: none;
    font-size: 16px;
    transition: border-color 0.3s;
  }
  
  .input-field:focus {
    border-color: #007bff;
  }
  
  .pay-button {
    width: 333px;
    margin: 10px 0;
    padding: 15px;
    border: none;
    border-radius: 5px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
  }
  
  .pay-button:hover {
    background-color: #0056b3;
  }
  
  .hidden-form {
    display: none;
  }
  </style>
  