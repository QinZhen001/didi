<template>
  <scroll-view
    class="address-list"
    scroll-y="true"
    scroll-with-animation="true">
    <div class="place-item"
         v-for="item in data"
         :key="item.id"
         @click.stop="choose(item)"
    >
          <span class="img-wrapper">
            <img src="/static/img/clock.png" alt="">
          </span>
      <div class="text-wrapper">
        <p class="text-name">{{item.title}}</p>
        <p class="text-detail">{{item.address}}</p>
      </div>
    </div>
  </scroll-view>
</template>

<script type="text/ecmascript-6">
  export default{
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    methods: {
      choose(item){
        this.$emit('choose', item)
      }
    }
  }
</script>

<style lang="less" scoped rel="stylesheet/less">
  @import '../common/less/variable';
  @import "../common/less/mixin1";

  .address-list {
    width: 100%;
    height: 100%;
    box-shadow: 1px 1px 5px #e0e0e0;
    .place-item {
      padding-right: 2px;
      display: flex;
      align-items: center;
      height: 60px;
      box-sizing: border-box;
      border-bottom: 1px solid @border-color-deep;
      .img-wrapper {
        position: relative;
        flex: 0 0 40px;
        width: 40px;
        height: 60px;
        img {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 10px;
          height: 10px;
          opacity: .5;
        }
      }
      .text-wrapper {
        flex: 1 1 auto;
        overflow: hidden;
        font-size: 0;
        .text-name {
          color: #333333;
          font-size: 14px;
        }
        .text-detail {
          color: #999999;
          font-size: 12px;
          .no-wrap();
        }
      }
    }
  }
</style>
