<template>
  <div class="order-close-page">
    <div class="card" v-if="startFormattedPlace">
      <div class="card-header">
        <div class="item time">
          <img src="/static/img/clock.png" alt="">
          <span class="item-text">{{time}}</span>
        </div>
        <div class="item start-place">
          <span class="circle-green"></span>
          <span class="item-text">{{startFormattedPlace}}</span>
        </div>
        <div class="item end-place">
          <span class="circle-orange"></span>
          <span class="item-text">{{destination}}</span>
        </div>
      </div>
      <div class="card-content">
        <img src="/static/img/warn.png" alt="">
        <p class="text-content">
          司机接单后2分钟内免费取消
        </p>
        <p class="text-rule">
          取消规则
        </p>
      </div>
    </div>
    <common-footer
      @clickLeft="clickFooterLeft"
      @clickRight="clickFooterRight">
    </common-footer>
  </div>
</template>

<script type="text/ecmascript-6">
  import CommonFooter from '../../components/common-footer.vue'
  import {mapState} from 'vuex'
  import {formatTime} from '../../utils/index'

  export default{
    data(){
      return {
        time: ''
      }
    },
    mounted(){
      this.time = formatTime(new Date())
    },
    methods: {
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
        'startFormattedPlace',
        'destination'
      ])
    },
    components: {
      CommonFooter
    }
  }
</script>

<style lang="less" scoped rel="stylesheet/less">
  @import '../../common/less/mixin1';
  @import '../../common/less/variable';

  .order-close-page {
    padding: 12px 12px 0;
    position: relative;
    height: 100vh;
    box-sizing: border-box;
    background-color: @page-bg-color;
    .card {
      height: 264px;
      .card-shadow(#e0e0e0);
      background: #ffffff;
      border: ~"1rpx" solid @border-color-light;
      .card-header {
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 92px;
        border-bottom: ~"1rpx" solid @border-color-light;
        .item {
          flex: 0 0 24px;
          height: 24px;
          line-height: 24px;
          color: #333333;
          font-size: 0;
          .item-text {
            margin-left: 18px;
            vertical-align: middle;
            display: inline-block;
            width: calc(100% - 48px);
            font-size: 14px;
            .no-wrap();
          }
        }
        .time {
          img {
            vertical-align: middle;
            margin-left: 20px;
            display: inline-block;
            width: 10px;
            height: 10px;
            opacity: .3;
          }
        }
        .start-place {
          .circle-green {
            vertical-align: middle;
            margin-left: 20px;
            .circle(#3cbca3)
          }
        }
        .end-place {
          .circle-orange {
            vertical-align: middle;
            margin-left: 20px;
            .circle(#fc9153)
          }
        }
      }
      .card-content {
        padding-top: 30px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        img {
          width: 56px;
          height: 56px;
        }
        .text-content {
          margin-top: 10px;
          font-size: 16px;
          color: #333333;
        }
        .text-rule {
          margin-top: 10px;
          padding-right: 10px;
          color: #d1d1d1;
          font-size: 14px;
          .right-arrow(#d1d1d1)
        }
      }
    }
  }
</style>
