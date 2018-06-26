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
      <cover-view class="adress">
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
  import {reverseGeocoder} from '../../utils/index'
  import {mapMutations, mapState} from 'vuex'

  const qqmapsdk = new QQMapWX({
    key: QQ_MAP_key
  });
  const MARK_ID = 1, LOCATION_ID = 2;

  export default{
    data(){
      return {
        latitude: 0,
        longitude: 0,
        scale: 16,
        markers: [],
        controls: [],
        addresses: []
      }
    },
    onLoad(){
      this.initLocation()
      this.initControls()
    },
    onReady(){
      this.mapCtx = wx.createMapContext("map-didi"); // 地图组件的id
      this.mapCtx.moveToLocation();
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
      initControls(){
        wx.getSystemInfo({
          success: (res) => {
            this.controls = [
              {
                id: MARK_ID,
                iconPath: '/static/img/marker2.png',
                position: {
                  left: res.windowWidth / 2 - 20,
                  top: res.windowHeight / 2 - 46,
                  width: 40,
                  height: 46
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
      .adress {
        display: flex;
        align-items: center;
        position: absolute;
        bottom: 20px;
        left: 10px;
        right: 10px;
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
            .no-wrap();
            font-size: 14px;
            color: #333333;
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
