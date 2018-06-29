<template>
  <div class="order-service-page">
    <map class="didiMap"
         id="didiMap"
         :latitude="startPosition[0]"
         :longitude="startPosition[1]"
         :scale="scale"
         :polyline="polyline"
         :markers="markers"
         :controls="controls"
         @controltap="tapControl"
         @regionchange="regionChange"
         @begin="begin"
         @end="end"
         show-location>

      <cover-view class="driver" v-if="driver.name">
        <driver-header :driver="driver"></driver-header>
        <cover-view class="driver-body">
          <cover-image class="img-looking" src="/static/img/looking.png"></cover-image>
          <cover-view class="text-looking">寻找拼友</cover-view>
        </cover-view>
        <cover-view class="driver-footer">
          请在2分1秒内走到上车点
        </cover-view>
      </cover-view>

      <cover-view class="footer-bar">
        <cover-view class="text footer-cancel" @click.stop="cancel">取消订单</cover-view>
        <cover-view class="text footer-help" @click.stop="endTrip">结束行程</cover-view>
        <cover-view class="text footer-app">下载滴滴APP</cover-view>
      </cover-view>
    </map>
  </div>
</template>

<script type="text/ecmascript-6">
  import DriverHeader from '../../components/driver-header.vue'
  import {request} from '../../api/request'
  import {mapState, mapMutations} from 'vuex'

  const START_ID = 0,
    END_ID = 1,
    CAR_ID = 2,
    LOCATION_ID = 3,
    WALK_ID = 4

  export default{
    data(){
      return {
        scale: 14,
        isShowLoading: true,
        driver: {},
        markers: [],
        polyline: [],
        controls: []
      }
    },
    onLoad(){
      this.getInitData()
      this.getInitControls()
    },
    onShow(){
      this.mapCtx = wx.createMapContext("didiMap");
      this.mapCtx.moveToLocation();
      this.requestDriver()
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
      getInitControls(){
        wx.getSystemInfo({
          success: (res) => {
            this.controls = [
              {
                id: CAR_ID,
                iconPath: '/static/img/mapCart.png',
                position: {
                  left: res.windowWidth / 2 - 11,
                  top: res.windowHeight / 2 - 60,
                  width: 22,
                  height: 45
                },
                clickable: true
              }, {
                id: LOCATION_ID,
                iconPath: '/static/img/location.png',
                position: {
                  left: 12, // 单位px
                  top: res.windowHeight - 110,
                  width: 30, // 控件宽度/px
                  height: 30,
                },
                clickable: true
              }, {
                id: WALK_ID,
                iconPath: '/static/img/walk.png',
                position: {
                  left: 12, // 单位px
                  top: res.windowHeight - 150,
                  width: 30, // 控件宽度/px
                  height: 30,
                },
                clickable: true
              }
            ]

          }
        })
      },
      requestDriver(){
        //为了看到loading效果 设置延时
        setTimeout(async () => {
          const res = await request('/comments')
          const drivers = res.data.drivers
          this.driver = drivers[Math.floor(Math.random() * drivers.length)];
//          console.log('driver', this.driver)
          this.isShowLoading = false
          this.saveDriver(this.driver)
        }, 1800)
      },
      tapControl(e){
        this.mapCtx.moveToLocation();
      },
      cancel(){
        wx.navigateTo({
          url: "/pages/orderCancel/main"
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
    box-sizing: border-box;
    .didiMap {
      width: 100%;
      height: 100%;
      .driver {
        position: absolute;
        top: 10px;
        left: 12px;
        right: 12px;
        box-sizing: border-box;
        border: 1px solid @border-color-light;
        .card-shadow();
        background: #fff;
        z-index: 999;
        .driver-body {
          text-align: center;
          height: 44px;
          width: 100%;
          font-size: 0;
          .img-looking, .text-looking {
            vertical-align: middle;
            display: inline-block;
          }
          .img-looking {
            width: 15px;
            height: 15px;
            animation: looking 1s linear infinite;
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
          color: rgba(0, 0, 0, .6);
          text-align: center;
          box-sizing: border-box;
          border-top: 1px solid @border-color-light;
        }
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
        z-index: 999;
        font-size: 0;
        .text {
          flex: 1 1 auto;
          display: inline-block;
          text-align: center;
          font-size: 18px;
        }
        .footer-cancel, .footer-help {
          padding-right: 20px;
          position: relative;
          &::after {
            content: '';
            position: absolute;
            right: 10px;
            top: 0;
            bottom: 0;
            height: 100%;
            border-right: ~"1rpx" solid @border-color-deep;
          }
        }
      }
    }

  }

  @keyframes looking {
    0% {
      transform: rotate(0)
    }
    100% {
      transform: rotate(360deg)
    }
  }
</style>
