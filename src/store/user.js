import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios'; // 确保导入 axios
import https from '@/utils/http';

Vue.use(Vuex);

const state = {
  money: 0,
  OrderID: 0,//50,150,500
  userId: 0,
  weight: 0,
  dreamWeight: 0
};

const mutations = {
  PayMoney(state, money){
    state.money = money;
  },
  AddMoney(state, payload) {
    const { money, OrderID } = payload;
    if(OrderID === 0){
      state.money = money + 50;
    } else if(OrderID === 1){
      state.money = money + 150;
    } else if(OrderID === 2){
      state.money = money + 500;
    }
  },
  GetMoney(state, money) {
    state.money = money;
  },
  //取消订单还钱
  BackMoney(state,money){
    state.money = money;
    console.log('我有多少钱'+state.money);
    
    console.log("还钱"+money);
    
  },
  GetWeight(state, weight) {
    state.weight = weight;
  },
  GetDreamWeight(state, dreamWeight) {
    state.dreamWeight = dreamWeight;
  }
};

const actions = {
  async payMoney({ commit }, payload){
   // console.log(payload);
    
    const{ user_id,money } = payload;
    const res = await https.post('/payOrder',null,{
      params: {
      user_id: user_id,
      money: money,
      }
    });
     commit('PayMoney', money);
  },
 async backMoney({ commit }, payload){
    const { userId, orderId,money } = payload;
   // console.log(payload);
    
    const res = await https.post('/backOrder',null,{
      params: {
      user_id: userId,
        orderId: orderId,
        money: money,
      }
    });
    commit('BackMoney', money);
    
  },
  async addMoney({ commit }, payload) {
    const { userId, OrderID } = payload;
    const res = await https.post('/addMoney', null, {
      params: {
        id: userId,
        orderId: OrderID
      }
    });
    commit('AddMoney', { money: res.data.money, OrderID });
  },
  async getMoney({ commit }, id) {
    const res = await https.get('getMoney?id=' + id);
    commit('GetMoney', res.data);
  },
  async setWeight({ commit }, { id, weight, dreamWeight }) {
    const formData = new URLSearchParams();
    formData.append('id', id);
    formData.append('weight', weight);
    formData.append('dreamWeight', dreamWeight);

    const res = await https.post('/setWeight', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    commit('GetWeight', res.data.weight);
    commit('GetDreamWeight', res.data.dreamWeight);
  },
  async getWeight({ commit }, userId) {
    const res = await https.get('getWeight?id=' + userId);
    commit('GetWeight', res.data.weight);
    commit('GetDreamWeight', res.data.dreamWeight);
  }
};

const getters = {};

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
});
