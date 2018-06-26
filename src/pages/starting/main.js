import Vue from 'vue'
import App from './starting.vue'
import store from '../../store/index'

Vue.prototype.$store = store

const app = new Vue(App)
app.$mount()
