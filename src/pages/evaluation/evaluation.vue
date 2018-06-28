<template>
  <div class="evaluation-page">
    <div class="card">
      <driver-header :driver="driver"></driver-header>
      <div class="cost">
        <p class="cost-number">{{cost}}<span>元</span></p>
        <div class="cost-desc">
          <span class="obvious">查看明细</span>
          <span class="invoice">开具发票</span>
        </div>
      </div>
      <div class="card-footer">
        <p class="evaluation">匿名评价司机</p>
        <div class="star-wrapper">
          <star :score="stars" @chooseStar="chooseStar"></star>
        </div>
      </div>
    </div>
    <div class="footer">
      <span class="need-help">需要帮助</span>
      <span class="end-trip">结束行程</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapState} from 'vuex'
  import DriverHeader from '../../components/driver-header.vue'
  import Star from '../../components/star.vue'

  export default{
    data(){
      return {
        stars: 0
      }
    },
    methods: {
      chooseStar(num){
        this.stars = num
      }
    },
    computed: {
      ...mapState([
        'driver',
        'cost'
      ])
    },
    components: {
      DriverHeader,
      Star
    }
  }
</script>

<style lang="less" scoped rel="stylesheet/less">
  @import '../../common/less/mixin1';
  @import '../../common/less/variable';

  .evaluation-page {
    position: relative;
    padding: 0 12px;
    height: 100vh;
    overflow: hidden;
    box-sizing: border-box;
    .card {
      margin-top: 12px;
      .card-shadow();
      border: 1px solid @border-color-light;
      .cost {
        border-bottom: ~"1rpx" solid @border-color-light;
        .cost-number {
          margin-top: 10px;
          text-align: center;
          font-size: 18px;
          span {
            font-size: 16px;
          }
        }
        .cost-desc {
          margin: 10px 0;
          color: #666666;
          font-size: 0;
          text-align: center;
          .obvious, .invoice {
            height: 20px;
            line-height: 20px;
            padding-right: 10px;
            display: inline-block;
            font-size: 14px;
            .right-arrow(#666666)
          }
          .obvious {
            margin-right: 30px;
          }
        }
      }
      .card-footer {
        .evaluation {
          margin-top: 20px;
          text-align: center;
          color: #666;
        }
        .star-wrapper {
          margin: 12px 0;
          text-align: center;
        }
      }
    }
    .footer {
      position: absolute;
      bottom: 20px;
      left: 0;
      right: 0;
      height: 44px;
      .card-shadow(#e3e4e5);
      .need-help, .end-trip {
        position: relative;
        width: 50%;
        display: inline-block;
      }
      .need-help {
      }
    }
  }
</style>
