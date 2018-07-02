<template>
  <div class="starting-page">
    <div class="search-bar-wrapper">
      <search-bar ref="searchBar"
                  :curCity="curCity"
                  @chooseCity="chooseCity"
                  @cancel="cancel"></search-bar>
    </div>
    <!--<div class="address-list-wrapper" v-if="addresses.length">-->
    <!--<address-list :data="addresses" @choose="chooseItem"></address-list>-->
    <!--</div>-->
    <map class="map-didi"
         id="map-didi"
         :latitude="latitude"
         :longitude="longitude"
         :markers="markers"
         @regionchange="regionChange"
         @begin="begin"
         @end="end"
         show-location
    >

      <cover-image class="location-marker"
                   src="/static/img/location.png"
                   @click.stop="onclickLocation">
      </cover-image>

      <cover-view class="center-marker">
        <cover-view class="text-center">最快{{minutes}}分钟接驾</cover-view>
        <cover-image class="inverted-triangle" src="/static/img/triangle-down.png"></cover-image>
        <cover-image class="img-center" src="/static/img/marker2.png"></cover-image>
      </cover-view>

      <cover-view class="address">
        <cover-image class="img-address" src="/static/img/address.png">
        </cover-image>
        <cover-view class="address-desc">
          <cover-view class="blur">{{startPlace}}</cover-view>
          <cover-view class="detail">{{startFormattedPlace}}</cover-view>
        </cover-view>
        <cover-view class="btn-address" @click.stop="setStartPlace">确定</cover-view>
      </cover-view>
    </map>
  </div>
</template>

<script type="text/ecmascript-6">
  import AddressList from '../../components/addressList.vue'
  import SearchBar from '../../components/search-bar.vue'
  import {QQ_MAP_key} from '../../common/constant/constant'
  import QQMapWX from '../../common/lib/qqmap-wx-jssdk.js'
  import {reverseGeocoder, getRandomNum} from '../../utils/index'
  import {mapMutations, mapState} from 'vuex'

  const qqmapsdk = new QQMapWX({
    key: QQ_MAP_key
  });

  let touchTimeStamp = 0

  export default{
    data(){
      return {
        latitude: 0,
        longitude: 0,
        scale: 16,
        markers: [],
        addresses: [],
        minutes: getRandomNum(3, 12)
      }
    },
    onShow(){
//     保证后面可以拿到经纬度
      this.initLocation()
      this.mapCtx = wx.createMapContext("map-didi"); // 地图组件的id
      console.log('this.curNavIndex', this.curNavIndex)
      this.updateCars()
    },
    onUnload(){
      this.clearData()
    },
    methods: {
      initLocation(){
        if (this.startPosition.length) {
          this.latitude = this.startPosition[0]
          this.longitude = this.startPosition[1]
        } else {
          wx.getLocation({
            type: "gcj02",
            success: (res) => {
              this.longitude = res.longitude
              this.latitude = res.latitude
            }
          })
        }
      },
      chooseCity(){
        wx.navigateTo({
          url: '/pages/cityChoose/main'
        })
      },
      search(value){
        if (value.length === 0) {
          this.addresses = []
          return
        }
        qqmapsdk.getSuggestion({
          keyword: value,
          region: this.curCity,
          success: (res) => {
            this.addresses = res.data
          }
        })
      },
      chooseItem(item){
        console.log(item)
        this.latitude = item.location.lat
        this.longitude = item.location.lng
        this.saveStartPlace(item.address)
        this.saveFormattedStartPlace(item.title)
        this.saveStartPosition([this.latitude, this.longitude])
        this.goBack()
        this.$refs.searchBar.clear()
      },
      cancel(){
        wx.navigateBack()
        this.clearData()
      },
      clearData(){
        this.addresses = []
        this.$refs.searchBar.clear()
      },
      onclickLocation(e){
        this.mapCtx.moveToLocation()
      },
      regionChange(){
        console.log('regionChange', e)

      },
      begin({timeStamp}){
        touchTimeStamp = timeStamp
      },
      end({timeStamp}){
        console.log('end')
//       加入时间判断
//       解决修改data内数据导致地图在拖动开始时闪回原位的bug
        if (timeStamp - touchTimeStamp > 50) {
          this.mapCtx.getCenterLocation({
            success: (res) => {
              reverseGeocoder(qqmapsdk, res).then(res => {
                this.saveStartPlace(res.result.address)
                this.saveFormattedStartPlace(res.result.formatted_addresses.recommend)
              })
              const lon_distance = res.longitude - this.longitude
              const lat_distance = res.latitude - this.latitude
              // 更新当前位置坐标
              this.longitude = res.longitude
              this.latitude = res.latitude
              //判断屏幕移动的距离，如果超过阀值
              if (Math.abs(lon_distance) >= 0.0022 || Math.abs(lat_distance) >= 0.0022) {
                //刷新附近的车
                this.updateCars()
                //刷新等待时间
                this.minutes = getRandomNum(3, 12)
              }
            }
          })
        }
      },
      updateCars(){
        this.markers = []
        const carNum = getRandomNum(3, 8)
        for (let i = 1; i <= carNum; i++) {
          // 定义一个车对象
          let car = {
            id: 0,
            iconPath: "/static/img/car/cart1.png",
            latitude: 0,
            longitude: 0,
            width: 35,
            height: 15
          }

          //随机值
          const lon_dis = (Math.ceil(Math.random() * 99)) * 0.00012;
          const lat_dis = (Math.ceil(Math.random() * 99)) * 0.00012;

          car.id = 2 + i
          car.latitude = this.latitude + lat_dis
          car.longitude = this.longitude + lon_dis
          car.iconPath = `/static/img/car/cart${this.curNavIndex + 1}.png`
          this.markers.push(car)
        }
      },
      setStartPlace(){
        //这里只需要再保存位置就好了
        this.saveStartPosition([this.latitude, this.longitude])
        wx.redirectTo({
          url: "/pages/index/main",
        })
      },
      ...mapMutations({
        saveStartPlace: 'SET_START_PLACE',
        saveFormattedStartPlace: 'SET_FORMATTED_START_PLACE',
        saveCurCity: 'SET_CUR_CITY',
        saveStartPosition: 'SET_START_POSITION'
      })
    },
    computed: {
      ...mapState([
        'curNavIndex',
        'curCity',
        'startPlace',
        'startFormattedPlace',
        'startPosition'
      ])
    },
    components: {
      SearchBar,
      AddressList
    }
  }
</script>

<style lang="less" scoped rel="stylesheet/less">
  @import '../../common/less/mixin1';

  .starting-page {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    .search-bar-wrapper {
      width: 100%;
      height: 44px;
      .card-shadow(#e0e0e0)
    }
    /*.address-list-wrapper {*/
    /*position: fixed;*/
    /*top: 45px;*/
    /*left: 0;*/
    /*right: 0;*/
    /*height: 300px;*/
    /*width: 100%;*/
    /*z-index: 999;*/
    /*background-color: #fff;*/
    /*}*/
    .map-didi {
      width: 100%;
      height: calc(100% - 44px);
      .location-marker {
        position: fixed;
        left: 12px;
        bottom: 95px;
        width: 32px;
        height: 32px;
      }
      .center-marker {
        position: fixed;
        left: 50%;
        top: calc(50% - 47px);
        transform: translateX(-50%);
        width: 110px;
        height: 70px;
        text-align: center;
        .text-center {
          padding: 0 4px;
          position: relative;
          height: 25px;
          line-height: 25px;
          color: #f5f5f5;
          background-color: #616161;
          font-size: 12px;
          border-radius: 12px;
          box-sizing: border-box;
        }
        .inverted-triangle {
          position: absolute;
          left: 45px;
          top: 16px;
          width: 20px;
          height: 20px;
        }
        .img-center {
          display: inline-block;
          margin-top: 8px;
          width: 38px;
          height: 40px;
        }
      }
      .address {
        display: flex;
        align-items: center;
        position: absolute;
        bottom: 20px;
        left: 12px;
        right: 12px;
        height: 60px;
        box-sizing: border-box;
        overflow: hidden;
        background-color: #fff;
        .img-address {
          padding-left: 4px;
          flex: 0 0 40px;
          width: 40px;
          height: 40px;
        }
        .address-desc {
          margin-left: 5px;
          flex: 1;
          height: 40px;
          .blur {
            font-size: 14px;
            color: #333333;
            .no-wrap();
          }
          .detail {
            padding-top: 6px;
            .no-wrap();
            font-size: 12px;
            color: #c7c7c7;
          }
        }
        .btn-address {
          padding: 20px;
          letter-spacing: 4px;
          flex: 0 0 40px;
          text-align: center;
          font-size: 18px;
          color: #333;
        }
      }
    }
  }
</style>
