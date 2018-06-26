<template>
  <div class="cars-page">
    <div class="car"
         v-for="item in cars"
         :key="item.id"
         @click.stop="chooseCar(item)">
      <img :src="item.url" alt="">
      <span>{{item.name}}</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {request} from '../../api/request'
  import {mapMutations} from 'vuex'

  export default{
    data(){
      return {
        cars: []
      }
    },
    mounted(){
      this.getInitData()
    },
    methods: {
      async getInitData(){
        const res = await request('/comments')
        this.cars = res.data.navData
      },
      chooseCar(item){
        this.setNavIndex(item.id)
        console.log(this.$store.state.curNavIndex)
        wx.reLaunch({
          url: "/pages/index/main"
        })
      },
      ...mapMutations({
        setNavIndex: 'SET_CUR_NAV_INDEX'
      })
    }
  }
</script>

<style lang="less" scoped rel="stylesheet/less">
  .cars-page {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    overflow: hidden;
    .car {
      flex: 0 1 auto;
      width: 33.33333333%;
      height: 105px;
      border-right: 1px solid #d9d9d9;
      border-bottom: 1px solid #d9d9d9;
      box-sizing: border-box;
      img {
        display: block;
        margin: 34px auto 0;
        width: 35px;
        height: 15px;
      }
      span {
        margin-top: 15px;
        display: block;
        text-align: center;
        text-indent: 2px;
        font-size: 14px;
      }
    }
  }
</style>
