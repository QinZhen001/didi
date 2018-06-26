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
      <cover-view class="driver">
          <cover-view class="driver-header">
            <cover-view class="driver-img">
              <cover-image style="width: 150rpx;height: 150rpx;"src="../../assets/images/driver.png"/>
            </cover-view>
            <cover-view class="driver-detailed">

            </cover-view>
            <cover-view class="driver-contact">
              <cover-view class="img-mas">
                <cover-image style="width: 70rpx;height: 70rpx;" src="../../assets/images/msm.png"/>
              </cover-view>
              <cover-view class="img-phone">
                <cover-image style="width: 70rpx;height: 70rpx;" src="../../assets/images/phone.png"/>
              </cover-view>
            </cover-view>
          </cover-view>
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
        polyline: []
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
      requestDriver()
      {
        //为了看到loading效果 设置延时
        setTimeout(async () => {
          const res = await request('/comments')
          const drivers = res.data.drivers
          this.driver = drivers[Math.floor(Math.random() * drivers.length)];
          this.isShowLoading = false
        }, 800)
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
  .order-service-page {
    width: 100%;
    height: 100vh;
    .didiMap {
      width: 100%;
      height: 100%;
    }
  }
</style>
