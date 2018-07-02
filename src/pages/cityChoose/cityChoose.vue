<template>
  <div class="city-choose-page">
    <div class="input-wrapper">
      <input type="text"
             v-model="city"
             placeholder="城市中文或拼音"/>
    </div>
    <scroll-view scroll-y="true" class="city-wrapper">
      <div class="city-item" v-if="curCity">
        当前城市: {{curCity}}
      </div>
      <ul class="city-list">
        <li class="item-header">
          ★ 热门城市
        </li>
        <li class="city-item"
            v-for="(item,index) in hotCities"
            :key="index"
            @click.stop="chooseCity(item)">
          {{item}}
        </li>
      </ul>
      <ul class="city-list" v-if="cityList" v-for="(citys, letter) in cityList" :key="key">
        <li class="item-header">
          {{letter}}
        </li>
        <li class="city-item"
            v-for="(item,index) in citys"
            :key="index"
            @click.stop="chooseCity(item)">
          {{item}}
        </li>
      </ul>
    </scroll-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import {QQ_MAP_key} from '../../common/constant/constant'
  import QQMapWX from '../../common/lib/qqmap-wx-jssdk.js'
  import {reverseGeocoder} from '../../utils/index'
  import {mapState, mapMutations} from 'vuex'


  const qqmapsdk = new QQMapWX({
    key: QQ_MAP_key
  });


  export default{
    data(){
      return {
        city: '',
        hotCities: ['北京市', '广州市', '成都市', '深圳市', '杭州市', '武汉市'],
        cityList: {}
      }
    },
    created(){
      qqmapsdk.getCityList({
        success: (res) => {
          const result = res.result[1]
          let temp_citys = {} //使用temp_citys 避免频繁改动data里面的数据
          for (let i = 0; i < result.length; i++) {
            let key = result[i].pinyin[0].charAt(0).toLocaleUpperCase()
            if (!temp_citys[key]) {
              temp_citys[key] = []
            }
            temp_citys[key].push(result[i].fullname)
          }
          this.cityList = temp_citys
        }
      })
    },
    methods: {
      chooseCity(city){
        console.log(city)
        this.saveCurCity(city)
        qqmapsdk.geocoder({
          address: city,
          success: (res) => {
            console.log(res)
            if (this.startFormattedPlace === '' || this.startFormattedPlace == null) {
              const result = res.result.location
              this.saveStartPosition([result.lat, result.lng])
              reverseGeocoder(qqmapsdk, {latitude: result.lat, longitude: result.lng}).then(res => {
                this.saveStartPlace(res.result.address)
                this.saveFormattedStartPlace(res.result.formatted_addresses.recommend)
              })
            }
            wx.navigateBack()
          }
        })
      },
      ...mapMutations({
        saveCurCity: 'SET_CUR_CITY',
        saveStartPosition: 'SET_START_POSITION',
        saveStartPlace: 'SET_START_PLACE',
        saveFormattedStartPlace: 'SET_FORMATTED_START_PLACE'
      })
    },
    computed: {
      ...mapState([
        'curCity',
        'startFormattedPlace'
      ])
    }
  }
</script>

<style lang="less" scoped rel="stylesheet/less">
  @import '../../common/less/variable';
  @import '../../common/less/mixin1';

  .city-choose-page {
    .input-wrapper {
      padding: 0 20px 0 10px;
      position: relative;
      height: 44px;
      width: 100%;
      box-sizing: border-box;
      border-top: ~"1rpx" solid @border-color-light;
      border-bottom: ~"1rpx" solid @border-color-light;
      input {
        position: absolute;
        left: 10px;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        .no-wrap();
        font-size: 16px;
        box-sizing: border-box;
        border-right: ~"1rpx" solid @border-color-deep;
      }
    }
    .city-wrapper {
      width: 100%;
      height: 100%;
      overflow: hidden;
      .item-header {
        padding-left: 14px;
        height: 44px;
        line-height: 44px;
        font-size: 14px;
        background: #f5f5f5;
        color: #9E9E9E;
        border-bottom: ~"1rpx" solid @border-color-light;
      }
      .city-item {
        padding-left: 16px;
        height: 44px;
        line-height: 44px;
        font-size: 16px;
        border-bottom: ~"1rpx" solid @border-color-light;
      }
    }
  }
</style>
