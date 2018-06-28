import Vue from 'vue'
import App from './orderWhy.vue'
// import store from '../../store/index'
//
// Vue.prototype.$store = store

const app = new Vue(App)
app.$mount()


export default {
  config: {
    navigationBarTitleText: '行程取消成功',
  }
};

