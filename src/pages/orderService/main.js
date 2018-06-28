import Vue from 'vue'
import App from './orderService.vue'
import store from '../../store/index'

Vue.prototype.$store = store

const app = new Vue(App)
app.$mount()


export default {
  config: {
    navigationBarTitleText: '等待服务',
  }
};
