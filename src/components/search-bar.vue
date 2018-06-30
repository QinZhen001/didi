<template>
  <div class="search-bar">
    <div class="text-location" @click.stop="chooseCity">{{curCity}}</div>
    <input type="text"
           v-model="search"
           class="input-location"
           placeholder="你在哪儿上车"
           placeholder-style="color:#cccccc">
    <div class="cancel-location" @click.stop="cancel">取消</div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {debounce} from '../utils/index'

  export default{
    props: {
      curCity: {
        type: String,
        default: '暂无'
      }
    },
    data(){
      return {
        search: ''
      }
    },
    methods: {
      cancel(){
        this.$emit('cancel')
      },
      clear(){
        this.search = ''
      },
      chooseCity(){
        this.$emit('chooseCity')
      }
    },
    watch: {
      search(newVal){
        debounce(() => {
          this.$emit('search', newVal)
        }, 500)()
      }
    }
  }
</script>

<style lang="less" scoped rel="stylesheet/less">
  @import '../common/less/mixin1';
  @import '../common/less/variable';

  .search-bar {
    height: 44px;
    width: 100%;
    display: flex;
    align-items: center;
    background-color: #fff;
    font-size: 14px;
    box-shadow: 3px 5px 10px #e0e0e0;
    .text-location {
      padding-left: 10px;
      padding-right: 12px;
      flex: 0 0 auto;
      display: inline-block;
      height: 44px;
      line-height: 44px;
      text-align: center;
      color: #666;
      .inverted-triangle(#a4a4a4);
    }
    .input-location {
      position: relative;
      flex: 1 1 auto;
      display: inline-block;
      height: 44px;
      padding-left: 24px;
      line-height: 44px;
      &::before {
        content: '';
        position: absolute;
        top: 12px;
        left: 12px;
        width: 1px;
        height: 20px;
        background: @border-color-light;
      }
    }

    .cancel-location {
      padding-right: 20px;
      flex: 0 0 auto;
      display: inline-block;
      height: 44px;
      line-height: 44px;
      color: #666;
    }

  }
</style>
