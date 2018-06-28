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
        <cover-view class="driver-header">
          <cover-view class="driver-img">
            <cover-image class="img" src="/static/img/driver.png"/>
          </cover-view>

          <cover-view class="driver-detailed">
            <cover-view class="detailed-header">
              <cover-view class="detailed-name">{{driver.name}}</cover-view>
              <cover-image class="detailed-star" src="/static/img/star.png"></cover-image>
              <cover-view class="detailed-order">{{driver.stars}}</cover-view>
            </cover-view>

            <cover-view class="detailed-car-number">{{driver.Cartnumber}}</cover-view>

            <cover-view class="detailed-car">{{driver.cart}}</cover-view>

          </cover-view>


          <cover-view class="driver-contact">
            <cover-view class="img-mas">
              <cover-image class="img" src="/static/img/msm.png"/>
            </cover-view>
            <cover-view class="img-phone">
              <cover-image class="img" src="/static/img/phone.png"/>
            </cover-view>
          </cover-view>
        </cover-view>
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
        <cover-view class="text footer-help" @click.stop="end">结束行程</cover-view>
        <cover-view class="text footer-app">下载滴滴APP</cover-view>
      </cover-view>
    </map>
  </div>
</template>

<script type="text/ecmascript-6">
  import {request} from '../../api/request'
  import {mapState} from 'vuex'

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
      this.requestDriver()
      this.mapCtx = wx.createMapContext("didiMap");
      this.mapCtx.moveToLocation();
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
                  left: 20, // 单位px
                  top: res.windowHeight - 150,
                  width: 40, // 控件宽度/px
                  height: 40,
                },
                clickable: true
              }, {
                id: WALK_ID,
                iconPath: '/static/img/walk.png',
                position: {
                  left: 20, // 单位px
                  top: res.windowHeight - 200,
                  width: 40, // 控件宽度/px
                  height: 40,
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
          this.isShowLoading = false
        }, 800)
      },
      tapControl(e){
        this.mapCtx.moveToLocation();
      },
      cancel(){
        wx.navigateTo({
          url: "/pages/orderCancel/main"
        })
      },
      end(){
        wx.redirectTo({
          url: "/pages/evaluation/main",
        })
      }
    },
    computed: {
      ...mapState([
        'startPosition',
        'endPosition'
      ])
    }
  }
</script>

<style lang="less" scoped rel="stylesheet/less">
  @import '../../common/less/variable';

  .order-service-page {
    width: 100%;
    height: 100vh;
    .didiMap {
      width: 100%;
      height: 100%;
      .driver {
        position: absolute;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        box-sizing: border-box;
        border: 1px solid #f5f5f5;
        box-shadow: 3px 5px 10px #e0e0e0;
        background: #fff;
        z-index: 999;
        .driver-header {
          padding: 0 16px;
          display: flex;
          align-items: center;
          width: 100%;
          height: 95px;
          border-bottom: 1px solid #f5f5f5;
          box-sizing: border-box;
          .driver-img {
            flex: 0 0 auto;
            .img {
              width: 75px;
              height: 75px;
            }
          }
          .driver-detailed {
            margin-left: 10px;
            font-size: 0;
            .detailed-header {
              display: flex;
              align-items: center;
              height: 30px;
              font-size: 0;
              .detailed-name {
                flex: 1 1 auto;
                display: inline-block;
                color: #333333;
                font-size: 18px;
              }
              .detailed-star {
                margin: -2px 4px 0;
                flex: 0 0 17px;
                vertical-align: middle;
                display: inline-block;
                width: 17px;
                height: 17px;
              }
              .detailed-order {
                flex: 1 1 auto;
                display: inline-block;
                font-size: 14px;
                opacity: .6;
              }
            }
            .detailed-car-number {
              margin-top: 2px;
              width: 80px;
              height: 16px;
              line-height: 16px;
              font-size: 14px;
              background-color: #eeeeee;
              border: 1px solid #cccccc;
              text-align: center;
            }
            .detailed-car {
              margin-top: 6px;
              height: 16px;
              line-height: 16px;
              font-size: 14px;
              color: #666666;
            }
          }
          .driver-contact {
            flex: 1 1 auto;
            .img-mas, .img-phone {
              margin-left: 10px;
              display: inline-block;
              .img {
                width: 35px;
                height: 35px;
              }
            }
          }
        }
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
          color: rgba(0, 0, 0, .5);
          text-align: center;
          box-sizing: border-box;
          border-top: 1px solid @border-color-light;
        }
      }
      .footer-bar {
        padding: 0 14px;
        display: flex;
        align-items: center;
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        height: 42px;
        box-shadow: 3px 5px 5px #e0e0e0;
        box-sizing: border-box;
        color: rgba(0, 0, 0, .7);
        background: #fff;
        z-index: 999;
        font-size: 18px;
        .text {
          flex: 1 1 auto;
          display: inline-block;
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
            border-right: 1px solid @border-color-deep;
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
