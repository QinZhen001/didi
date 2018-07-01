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
          <star :score="stars"
                @chooseStar="chooseStar">
          </star>
        </div>
      </div>
    </div>
    <common-footer
      @clickLeft="clickFooterLeft"
      @clickRight="clickFooterRight">
    </common-footer>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapState} from 'vuex'
  import DriverHeader from '../../components/driver-header.vue'
  import Star from '../../components/star.vue'
  import CommonFooter from '../../components/common-footer.vue'

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
      clickFooterRight(){
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
      },
      clickFooterLeft(){
        wx.showToast({
          title: '尚未开发！',
          icon: 'none',
          duration: 2000
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
      Star,
      CommonFooter
    }
  }
</script>

<style lang="less" scoped rel="stylesheet/less">
  @import '../../common/less/mixin1';
  @import '../../common/less/variable';

  .evaluation-page {
    position: relative;
    padding: 12px 12px 0;
    height: 100vh;
    box-sizing: border-box;
    .card {
      .card-shadow();
      border: ~"1rpx" solid @border-color-light;
      .cost {
        border-top: ~"1rpx" solid @border-color-light;
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
          margin: 10px 0;
          text-align: center;
        }
      }
    }
  }
</style>
