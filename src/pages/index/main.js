import Vue from 'vue'
import App from './index'
import store from '../../store/index'

Vue.prototype.$store = store

const app = new Vue(App)
app.$mount()
