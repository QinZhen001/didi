<template>
  <div>
    <ul class="container log-list">
      <li v-for="(log, index) in logs" :class="{ red: aa }" :key="index" class="log-item">
      </li>
    </ul>
  </div>
</template>

<script>
import { formatTime } from '@/utils/index'

export default {
  data () {
    return {
      logs: []
    }
  },
  created () {
    const logs = (wx.getStorageSync('logs') || [])
    this.logs = logs.map(log => formatTime(new Date(log)))
  }
}
</script>

<style>

</style>
