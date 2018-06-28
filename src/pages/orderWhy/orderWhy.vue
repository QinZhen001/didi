<template>
  <div class="order-why-page">
    <div class="card">
      <div class="header">
        <p class="text-why">你为什么取消?</p>
        <p class="text-header">请告知我们，我们可以改善</p>
      </div>
      <div class="weui-cells weui-cells_after-title">
        <checkbox-group @change="checkboxChange">
          <label class="weui-cell weui-check__label" v-for="item in reasons" :key="item.value">
            <checkbox  value="item.value" checked="item.checked">
            <span>
              {{item.name}}
            </span>
              <img src="/static/img/checked.png" alt="">
            </checkbox>
          </label>
        </checkbox-group>
      </div>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import {reasons} from '../../common/constant/constant'

  export default{
    data(){
      return {
        reasons: reasons
      }
    },
    methods: {
      checkboxChange(e){
      }
    }
  }
</script>

<style lang="less" scoped rel="stylesheet/less">
  @import '../../common/less/variable';
  @import '../../common/less/mixin1';

  .order-why-page {
    padding: 0 10px;
    height: 100vh;
    overflow: hidden;
    background-color: #f3f4f5;
    .card {
      margin-top: 10px;
      background-color: #fff;
      .header {
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 72px;
        box-sizing: border-box;
        .text-why {
          text-align: center;
          color: rgba(0, 0, 0, .6);
          font-size: 18px;
        }
        .text-header {
          text-align: center;
          color: #fc9153;
          font-size: 14px;
        }
      }
      img {
        width: 20px;
        height: 20px;
      }
    }
  }
</style>
