<template>
  <div class="starting-page">
    <div class="search-bar-wrapper">
      <search-bar ref="searchBar" :curCity="curCity" @search="search" @cancel="goBack"></search-bar>
    </div>
    <div class="address-list-wrapper" v-if="addresses.length">
      <address-list :data="addresses" @choose="chooseItem"></address-list>
    </div>
    <map class="map-didi"
         id="map-didi"
         :latitude="latitude"
         :longitude="longitude"
         :scale="scale"
         :polyline="polyline"
         :markers="markers"
         :controls="controls"
         @controltap="tapControl"
         @regionchange="regionChange"
         @begin="begin"
         @end="end"
         show-location
    >
      <cover-view class="address">
        <cover-image class="img-address" src="/static/img/address.png">
        </cover-image>
        <cover-view class="address-desc">
          <cover-view class="blur">{{startPlace}}</cover-view>
          <cover-view class="detail"> {{startFormattedPlace}}</cover-view>
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
  const LOCATION_CONTROL_ID = 1, CENTER_MARK_ID = 2;

  export default{
    data(){
      return {
        latitude: 0,
        longitude: 0,
        scale: 16,
        markers: [],
        controls: [],
        addresses: [],
        minutes: getRandomNum(2, 15)
      }
    },
    created(){
      //created方法获取经纬度 保证后面生命周期可以拿到经纬度
      this.initLocation()
    },
    onReady(){
      this.mapCtx = wx.createMapContext("map-didi"); // 地图组件的id
      this.mapCtx.moveToLocation();
      this.initData()
    },
    onUnload(){
      this.clearData()
    },
    methods: {
      initLocation(){
        wx.getLocation({
          type: "gcj02",
          success: (res) => {
            this.longitude = res.longitude
            this.latitude = res.latitude
          }
        })
      },
      initData(){
        wx.getSystemInfo({
          success: (res) => {
            this.controls = [
              {
                id: LOCATION_CONTROL_ID,
                iconPath: '/static/img/location.png',
                position: {
                  left: 12, // 单位px
                  top: res.windowHeight - 120,
                  width: 30, // 控件宽度/px
                  height: 30,
                },
                clickable: true
              }
            ]
            console.log(this.latitude, this.longitude)
            this.markers = [
              {
                id: CENTER_MARK_ID,
                latitude: this.latitude,
                longitude: this.longitude,
                iconPath: '/static/img/marker2.png',
                width: 38,
                height: 40,
                callout: {
                  content: `最快${this.minutes}分钟接驾`,
                  color: '#f5f5f5',
                  bgColor: '#616161',
                  fontSize: 12,
                  borderRadius: 12,
                  padding: 5,
                  textAlign: 'center',
                  display: 'ALWAYS'
                }

              }
            ]
          }
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
      goBack(){
        wx.redirectTo({
          url: '/pages/index/main'
        })
      },
      clearData(){
        this.addresses = []
        this.$refs.searchBar.clear()
      },
      tapControl(e){
        console.log('tapControl', e.mp)
        if (e.mp.controlId === LOCATION_ID) {
          this.mapCtx.moveToLocation()
        }
      },
      regionChange(e){
        console.log('regionChange', e)
      },
      begin(e){
        console.log('begin', e)
      },
      end(e){
        this.mapCtx.getCenterLocation({
          success: (res) => {
            this.longitude = res.longitude
            this.latitude = res.latitude
            reverseGeocoder(qqmapsdk, res).then(res => {
              this.saveStartPlace(res.result.address)
              this.saveFormattedStartPlace(res.result.formatted_addresses.recommend)
            })
          }
        })
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
        'curCity',
        'startPlace',
        'startFormattedPlace',
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
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 44px;
      z-index: 999;
    }
    .address-list-wrapper {
      position: fixed;
      top: 45px;
      left: 16px;
      right: 16px;
      height: 300px;
      width: calc(100% - 32px);
      z-index: 999;
      background-color: #fff;
    }
    .map-didi {
      width: 100%;
      height: 100%;
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
          color: #666666;
        }
      }
    }
  }
</style>
