<template>
  <div class="destination-page">
    <div class="search-bar-wrapper">
      <search-bar
        ref="searchBar"
        :curCity="curCity"
        @search="search"
        @cancel="goBack">
      </search-bar>
    </div>
    <div class="addressList-wrapper">
      <address-list :data="addresses" @choose="choosePlace"></address-list>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import AddressList from '../../components/addressList.vue'
  import SearchBar from '../../components/search-bar.vue'
  import {request} from '../../api/request'
  import QQMapWX from '../../common/lib/qqmap-wx-jssdk.js'
  import {QQ_MAP_key} from '../../common/constant/constant'
  import {mapMutations, mapState} from 'vuex'

  const qqmapsdk = new QQMapWX({
    key: QQ_MAP_key
  });

  export default{
    data(){
      return {
        addresses: []
      }
    },
    created(){
      this.getInitData()
    },
    onUnload(){
      this.clearData()
    },
    methods: {
      async getInitData(){
        const res = await request('/comments')
        this.addresses = res.data.entity
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
      goBack(){
        wx.redirectTo({
          url: '/pages/index/main'
        })
      },
      choosePlace(item){
        //item.address详细地址
        //item.title简短语义化地址
        console.log(item)
        qqmapsdk.geocoder({
          address: item.address,
          success: (res) => {
            this.saveEndPosition([res.result.location.lat, res.result.location.lng])
            this.saveDestination(item.title)
            this.goBack()
          },
          fail: (err) => {
            console.log(err)
          }
        })
      },
      clearData(){
        this.$refs.searchBar.clear()
      },
      ...mapMutations({
        saveDestination: 'SET_DESTINATION',
        saveEndPosition: 'SET_END_POSITION'
      })
    },
    computed: {
      ...mapState([
        'curCity'
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
  @import '../../common/less/variable';

  .destination-page {
    width: 100%;
    height: 100vh;
    .search-bar-wrapper {
      height: 44px;
      width: 100%;
    }
    .addressList-wrapper {
      width: 100%;
      overflow: hidden;
    }
  }
</style>
