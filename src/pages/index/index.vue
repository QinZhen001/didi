<template>
  <div class="home-page">
    <div class="nav-wrapper">
      <div class="nav-me" @click.stop="navigateToLogin">
        <img src="../../../static/img/nav-me.png" alt="">
      </div>
      <scroll-view
        class="nav"
        scroll-x="true"
        scroll-with-animation="true"
        :scroll-left="navScrollLeft">
        <div v-for="(item,index) in navData"
             :key="item.id"
             class="nav-item"
             :class="{active:index==curNavIndex}"
             @click.stop="switchNav(item.id)">
          {{item.name}}
        </div>
      </scroll-view>
      <div class="nav-all" @click.stop="navigateToCars">
        <img src="../../../static/img/nav-all.png" alt="">
      </div>
    </div>
    <div class="card" :class="{'noWhite':isShowCost}">
      <div v-if="isLoading" class="loading-wrapper">
        <loading-sprinner></loading-sprinner>
      </div>
      <div class="card-time">
        {{waitingTimes}}
      </div>
      <div class="card-start">
        <span class="circle-green"></span>
        <span class="card-address" @click.stop="navigateToStarting">{{startFormattedPlace}}</span>
      </div>
      <div class="card-destination">
        <span class="circle-orange"></span>
        <span
          class="card-input-destination"
          @click.stop="navigateToDestination">{{destination}}</span>
      </div>
    </div>
    <button v-if="!isShowCost"
            @click.stop="showCost"
            class="btn-call-car">
      呼叫{{car}}
    </button>

    <div v-if="isShowCost" class="cost">
      <div class="cost-header">
        <div class="header-item" v-for="item in chooseArr" :key="item.id">
          <img width="15" height="15" :src="item.url" alt="">
          <span>{{item.name}}</span>
        </div>
      </div>
      <div class="cost-footer">
        <div class="carpooling"
             :class="{active:index==curCostIndex}"
             v-for="(item,index) in carCostArr"
             :key="item.id"
             @click.stop="chooseCost(item)">
          <span class="carpooling-name">{{item.name}}</span>
          <img :src="item.imgUrl">
          <span class="carpooling-cost">预计 {{item.cost}} 元</span>
        </div>
      </div>
    </div>
    <button v-if="isShowCost"
            @click.stop="confirmCost"
            class="btn-confirm">确认
    </button>

    <swiper v-if="!isShowCost"
            class="swiper-tab"
            :current="curNavIndex"
            @change="switchTab">
      <swiper-item class="swiper-item">
        <div class="item-content">
          <img src="/static/img/members.png" alt="">
          <span class="item-text">会员</span>
        </div>
        <div class="item-content">
          <img src="/static/img/package.png" alt="">
          <span class="item-text">套餐</span>
        </div>
        <div class="item-content">
          <img class="img-no-round" src="/static/img/recruiting.png" alt="">
          <span class="item-text">招募</span>
        </div>
      </swiper-item>

      <swiper-item class="swiper-item">
        <div class="item-content">
          <img src="/static/img/pick-send.png" alt="">
          <span class="item-text">接机</span>
        </div>
        <div class="item-content">
          <img src="/static/img/pick-up.png" alt="">
          <span class="item-text">送机</span>
        </div>
      </swiper-item>

      <swiper-item class="swiper-item" v-for="(item,index) in swipers" :key="index">
        <span class="item-text">{{item}}</span>
      </swiper-item>

    </swiper>
    <swiper v-if="!isShowCost"
            class="swiper-ad"
            circular="true"
            autoplay="true">
      <swiper-item class="swiper-item" v-for="item in imgUrls" :key="item">
        <img :src="item"/>
      </swiper-item>
    </swiper>

  </div>
</template>

<script type="text/ecmascript-6">
  import {request} from '../../api/request'
  import {reverseGeocoder} from '../../utils/index'
  import LoadingSprinner from '../../components/loading-sprinner.vue'
  import {mapState, mapMutations} from 'vuex'
  import {QQ_MAP_key, INIT_DESTINATION} from '../../common/constant/constant'
  import QQMapWX from '../../common/lib/qqmap-wx-jssdk.js'
  import {carCostArr} from '../../common/constant/constant'

  const qqmapsdk = new QQMapWX({
    key: QQ_MAP_key
  });


  //微信小程序无法进行Dom操作 所以无法动态拿到元素宽度
  //这里进行模拟宽度 两个字宽度+2*margin 也就是 32+10*2 = 52
  const NAV_SMALL_WIDTH = 52;
  //这里模拟宽度 三个字宽度+2*margin 也就是 48+10*2 = 68
  const NAV_BIG_WIDTH = 68;

  export default {
    data () {
      return {
        isLoading: true,
        isShowCost: false,
        navScrollLeft: 0,
        navData: [],
        imgUrls: [],
        waitingTimes: [],
        chooseArr: [],
        car: '快车',
        carCostArr: carCostArr,
        curCostIndex: 0,
        swipers: ['出租车后续完善', '顺风车后续完善', '公交后续完善', '代驾后续完善', '自驾租车后续完善', '二手车后续完善']
      }
    },
    created () {
      this.getInitData()
//    维护一个nav各项navScrollLeft的长度数组
      this.navOffsetArr = [
        0,
        0,
        NAV_SMALL_WIDTH,
        NAV_SMALL_WIDTH * 2,
        NAV_SMALL_WIDTH * 2 + NAV_BIG_WIDTH,
        NAV_SMALL_WIDTH * 2 + NAV_BIG_WIDTH * 2,
        NAV_SMALL_WIDTH * 3 + NAV_BIG_WIDTH * 2,
        NAV_SMALL_WIDTH * 4 + NAV_BIG_WIDTH * 2
      ]
    },
    methods: {
      async getInitData(){
        const res = await request('/comments')
//        console.log('res', res)
        this.imgUrls = res.data.imgUrls
        this.navData = res.data.navData
        this.chooseArr = res.data.cost
        //setTimeout延时 为了看到loading的效果
        setTimeout(() => {
          const arr = res.data.waitingTimes;
          const index = Math.floor(Math.random() * arr.length)
          this.waitingTimes = arr[index]
          this.isLoading = false
        }, 800)
        wx.getLocation({
          type: 'gcj02',
          success: (res) => {
            reverseGeocoder(qqmapsdk, res).then(res => {
              this.saveStartPlace(res.result.address)
              this.saveFormattedStartPlace(res.result.formatted_addresses.recommend)
              this.saveCurCity(res.result.address_component.city)
            })
            this.saveStartPosition([res.latitude, res.longitude])
          }
        })
      },
      switchNav(index){
        this.saveCurNavIndex(index)
      },
      switchTab(e){
        this.saveCurNavIndex(e.mp.detail.current)
      },
      navigateToLogin(){
        //如果没有用户信息就跳转到登陆页
        if (!this.$store.state.phone) {
          wx.navigateTo({
            url: '/pages/login/main'
          })
        } else {
          wx.showToast({
            title: '已成功登录!',
            icon: 'success'
          })
        }
      },
      navigateToCars(){
        wx.navigateTo({
          url: '/pages/cars/main'
        })
      },
      navigateToStarting(){
        wx.navigateTo({
          url: '/pages/starting/main'
        })
      },
      navigateToDestination(){
        wx.navigateTo({
          url: '/pages/destination/main'
        })
      },
      showCost(){
        if (this.destination == INIT_DESTINATION || this.destination == null) {
          wx.showToast({
            title: '请先选择目的地!',
            icon: 'none'
          })
          return
        }
        this.isShowCost = true
      },
      chooseCost(item){
        this.curCostIndex = item.id
      },
      confirmCost(){
        this.saveCost(this.carCostArr[this.curCostIndex].cost)
        wx.navigateTo({
          url: "/pages/wait/main",
          success: () => {
            this.isShowCost = false
          }
        })
      },
      ...mapMutations({
        saveCurNavIndex: 'SET_CUR_NAV_INDEX',
        saveStartPlace: 'SET_START_PLACE',
        saveFormattedStartPlace: 'SET_FORMATTED_START_PLACE',
        saveCurCity: 'SET_CUR_CITY',
        saveStartPosition: 'SET_START_POSITION',
        saveCost: 'SET_COST'
      })
    },
    computed: {
      ...mapState([
        'startFormattedPlace',
        'destination',
        'curNavIndex'
      ])
    },
    watch: {
      //利用watch 更好的模拟navScrollLeft
      curNavIndex(newIndex){
        this.navScrollLeft = this.navOffsetArr[newIndex]
        this.car = this.navData[newIndex].name
      }
    },
    components: {
      LoadingSprinner
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  @import '../../common/less/mixin1';
  @import "../../common/less/variable";

  .home-page {
    padding: 0 12px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    box-sizing: border-box;
    background-color: @page-bg-color;
    .nav-wrapper {
      display: flex;
      align-items: center;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 54px;
      width: 100%;
      background: #ffffff;
      .nav-me, .nav-all {
        flex: 0 0 48px;
        width: 48px;
        height: 36px;
        img {
          width: 48px;
          height: 36px;
        }
      }
      .nav-me {
        border-right: 1px solid @border-color-light;
      }
      .nav {
        flex: 1;
        margin: 0 5px;
        height: 54px;
        line-height: 54px;
        overflow: hidden;
        white-space: nowrap;
        font-size: 0;
        .nav-item {
          margin: 0 10px;
          display: inline-block;
          font-size: 16px;
          &:first-child {
            margin-left: 0;
          }
          &:last-child {
            margin-right: 0;
          }
          &.active {
            color: #fc975c;
          }
        }
      }
    }
    .card {
      position: relative;
      margin-top: 74px;
      padding: 5px 16px 0 16px;
      background-color: #fff;
      border-radius: 5px;
      &.noWhite {
        background-color: @page-bg-color;
      }
      .loading-wrapper {
        position: absolute;
        top: 0;
        left: 50%;
        width: 21px;
        transform: translateX(-50%);
      }
      .card-time {
        width: 100%;
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        color: rgba(0, 0, 0, .7)
      }
      .card-start, .card-destination {
        display: flex;
        align-items: center;
        height: 60px;
        width: 100%;
        .circle-green {
          flex: 0 0 10px;
          .circle(#3cbca3)
        }
        .circle-orange {
          flex: 0 0 10px;
          .circle(#fc9153);
        }
        .card-address, .card-input-destination {
          padding-right: 8px;
          flex: 1;
          display: inline-block;
          margin-left: 20px;
          height: 60px;
          width: 100%;
          line-height: 60px;
          font-size: 16px;
          .no-wrap();
          .right-arrow();
        }
        .card-address {
          .border-1px(#f5f5f5)
        }
      }
    }
    .btn-call-car, .btn-confirm {
      margin-top: 20px;
      .long-btn(#fff, #4a4c5b);
    }
    .cost {
      width: 100%;
      background: #fff;
      border-radius: 5px;
      .cost-header, .cost-footer {
        display: flex;
        align-items: center;
        justify-content: space-around;
        width: 100%;
      }
      .cost-header {
        height: 60px;
        color: #666666;
        border-bottom: 1px solid @border-color-light;
        .header-item {
          flex: 0 0 auto;
          height: 60px;
          line-height: 60px;
          font-size: 0;
          img {
            vertical-align: middle;
            display: inline-block;
            width: 15px;
            height: 15px;
          }
          span {
            margin-left: 5px;
            vertical-align: middle;
            display: inline-block;
            font-size: 14px;
          }
        }
      }
      .cost-footer {
        height: 130px;
        .carpooling {
          opacity: .6;
          transform: scale(.7);
          font-size: 0;
          &.active {
            opacity: 1;
            transform: scale(1);
          }
          .carpooling-name, .carpooling-cost {
            display: block;
            text-align: center;
          }
          .carpooling-name {
            font-size: 16px;
            margin-bottom: 6px;
          }
          .carpooling-cost {
            font-size: 14px;
            margin-top: 6px;
          }
          img {
            display: block;
            width: 75px;
            height: 35px;
          }
        }
      }
    }
    .swiper-tab {
      margin-top: 24px;
      width: 100%;
      height: 100px;
      .swiper-item {
        display: flex;
        align-items: center;
        justify-content: space-around;
        .item-content {
          img {
            height: 50px;
            width: 50px;
            border-radius: 50%;
          }
          .img-no-round {
            height: 50px;
            width: 74px;
            border-radius: 50% 0 0 50%;
          }
          .item-text {
            display: block;
            font-size: 12px;
            text-align: center;
          }
        }
      }
    }
    .swiper-ad {
      margin-top: 30px;
      height: 72px;
      width: 100%;
      .swiper-item {
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

</style>
