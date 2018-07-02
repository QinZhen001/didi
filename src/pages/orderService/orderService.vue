<template>
  <div class="order-service-page">
    <map class="didiMap"
         id="didiMap"
         :latitude="startPosition[0]"
         :longitude="startPosition[1]"
         :polyline="polyline"
         :markers="markers"
         show-location>

      <cover-view class="driver" v-if="driver.name">
        <driver-header :driver="driver"></driver-header>
        <cover-view class="driver-body">
          <cover-image class="img-looking"
                       src="/static/img/looking.png"></cover-image>
          <cover-view class="text-looking">寻找拼友</cover-view>
        </cover-view>
        <cover-view class="driver-footer">
          请在2分1秒内走到上车点
        </cover-view>
      </cover-view>

      <cover-image class="marker location-marker"
                   src="/static/img/location.png"
                   @click.stop="onClickMark"></cover-image>

      <cover-image class="marker walk-marker"
                   src="/static/img/walk.png"
                   @click.stop="onClickMark"></cover-image>

      <cover-image class="car-marker" src="/static/img/mapCart.png"></cover-image>

      <cover-view class="footer-bar">
        <cover-view class="text" @click.stop="cancel">取消订单
        </cover-view>
        <cover-view class="right-border"></cover-view>
        <cover-view class="text" @click.stop="endTrip">结束行程
        </cover-view>
        <cover-view class="right-border"></cover-view>
        <cover-view class="text">下载滴滴APP</cover-view>
      </cover-view>
    </map>
  </div>
</template>

<script type="text/ecmascript-6">
  import DriverHeader from '../../components/driver-header.vue'
  import {request} from '../../api/request'
  import {mapState, mapMutations} from 'vuex'

  const START_ID = 0, END_ID = 1

  let animationTimer, num = 1

  export default{
    data(){
      return {
        isShowLoading: true,
        driver: {},
        markers: [],
        polyline: [],
      }
    },
    onLoad(){
      this.getInitData()
      this.mapCtx = wx.createMapContext("didiMap");
    },
    onShow(){
      this.mapCtx.moveToLocation();
      this.requestDriver()
    },
    onUnload(){
      clearInterval(animationTimer)
    },
    methods: {
      getInitData(){
        this.markers = [
          {
            iconPath: '/static/img/str.png',
            id: START_ID,
            latitude: this.startPosition[0],
            longitude: this.startPosition[1],
            width: 30,
            height: 30
          }, {
            iconPath: '/static/img/end.png',
            id: END_ID,
            latitude: this.endPosition[0],
            longitude: this.endPosition[1],
            width: 30,
            height: 30
          }
        ]
        this.polyline = [{
          points: [
            {
              latitude: this.startPosition[0],
              longitude: this.startPosition[1]
            }, {
              latitude: this.endPosition[0],
              longitude: this.endPosition[1]
            }
          ],
          color: "#f44336",
          width: 4,
          dottedLine: true,
        }]
      },
      setMapView(){
        if (this.startPosition.length && this.endPosition.length) {
          console.log('includePoints')
          this.mapCtx.includePoints({
            points: [
              {
                latitude: this.startPosition[0], longitude: this.startPosition[1]
              }, {
                latitude: this.endPosition[0], longitude: this.endPosition[1]
              }
            ]
          })
        }
      },
      requestDriver(){
        //为了看到loading效果 设置延时
        setTimeout(async () => {
          const res = await request('/comments')
          const drivers = res.data.drivers
          this.driver = drivers[Math.floor(Math.random() * drivers.length)];
          this.isShowLoading = false
          this.saveDriver(this.driver)
        }, 800)
      },
      onClickMark(){
        this.mapCtx.moveToLocation();
      },
      cancel(){
        wx.navigateTo({
          url: "/pages/orderCancel/main",
          success: () => {
            clearInterval(animationTimer)
          }
        })
      },
      endTrip(){
        wx.redirectTo({
          url: "/pages/evaluation/main",
        })
      },
      ...mapMutations({
        saveDriver: 'SET_DRIVER'
      })
    },
    computed: {
      ...mapState([
        'startPosition',
        'endPosition'
      ])
    },
    components: {
      DriverHeader
    }
  }
</script>

<style lang="less" scoped rel="stylesheet/less">
  @import '../../common/less/variable';
  @import '../../common/less/mixin1';

  .order-service-page {
    width: 100%;
    height: 100vh;
    .didiMap {
      width: 100%;
      height: 100%;
      .driver {
        position: absolute;
        top: 10px;
        left: 12px;
        right: 12px;
        border: ~"1rpx" solid @border-color-light;
        .card-shadow();
        background: #fff;
        .driver-body {
          text-align: center;
          height: 44px;
          width: 100%;
          font-size: 0;
          border-top: ~"1rpx" solid @border-color-light;
          border-bottom: ~"1rpx" solid @border-color-light;
          .img-looking, .text-looking {
            vertical-align: middle;
            display: inline-block;
          }
          .img-looking {
            width: 15px;
            height: 15px;
            /*animation: looking 1s linear infinite;*/
          }
          .text-looking {
            height: 44px;
            line-height: 44px;
            margin-left: 5px;
            font-size: 14px;
            opacity: .5;
          }
        }
        .driver-footer {
          height: 42px;
          line-height: 42px;
          font-size: 12px;
          color: rgba(0, 0, 0, .7);
          text-align: center;
        }
      }
      .marker {
        position: fixed;
        width: 32px;
        height: 32px;
        left: 12px;
      }
      .location-marker {
        bottom: 80px;
      }
      .walk-marker {
        bottom: 125px;
      }
      .car-marker {
        position: fixed;
        top: 40%;
        left: 40%;
        width: 22px;
        height: 45px;
      }
      .footer-bar {
        padding: 0 12px;
        display: flex;
        align-items: center;
        position: absolute;
        bottom: 20px;
        left: 12px;
        right: 12px;
        height: 44px;
        box-sizing: border-box;
        color: rgba(0, 0, 0, .7);
        background: #fff;
        .card-shadow(#e0e0e0);
        font-size: 0;
        .text {
          flex: 1 1 auto;
          display: inline-block;
          height: 22px;
          line-height: 22px;
          text-align: center;
          font-size: 18px;
        }
        .right-border {
          flex: 0 0 1px;
          height: 22px;
          width: 1px;
          background-color: @border-color-deep;
        }
      }
    }
  }

  /*@keyframes looking {*/
  /*0% {*/
  /*transform: rotate(0)*/
  /*}*/
  /*100% {*/
  /*transform: rotate(360deg)*/
  /*}*/
  /*}*/
</style>
