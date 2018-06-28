import Vue from 'vue'
import App from './evaluation.vue'
import store from '../../store/index'

Vue.prototype.$store = store

const app = new Vue(App)
app.$mount()
