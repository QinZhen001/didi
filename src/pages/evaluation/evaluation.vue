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
      <span class="end-trip" @click.stop="endTrip">结束行程</span>
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
      },
      endTrip(){
        wx.showLoading({
          title: '提交中',
          success: () => {
            setTimeout(() => {
              wx.redirectTo({
                url: '/pages/index/main',
              })
            }, 800)
          }
        })
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
    box-sizing: content-box;
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
      left: 12px;
      right: 12px;
      height: 44px;
      box-sizing: border-box;
      border: ~"1rpx" solid @border-color-light;
      .card-shadow(#e3e4e5);
      .need-help, .end-trip {
        display: inline-block;
        width: 50%;
        height: 44px;
        line-height: 44px;
        text-align: center;
        box-sizing: border-box;
      }
      .need-help {
        border-right: ~"1rpx" solid @border-color-light;
      }
    }
  }
</style>
