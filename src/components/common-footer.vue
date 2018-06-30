<template>
  <div class="common-footer" :class="{'noShadow':noShadow}">
    <span class="need-help" @click.stop="clickLeft">{{leftText}}</span>
    <span class="end-trip" @click.stop="clickRight">{{rightText}}</span>
  </div>
</template>

<script type="text/ecmascript-6">
  export default{
    props: {
      leftText: {
        type: String,
        default: '需要帮助'
      },
      rightText: {
        type: String,
        default: '结束行程'
      },
      noShadow: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      clickLeft(){
        this.$emit('clickLeft')
      },
      clickRight(){
        this.$emit('clickRight')
      }
    }
  }
</script>

<style lang="less" scoped rel="stylesheet/less">
  @import '../common/less/variable';
  @import '../common/less/mixin1';

  .common-footer {
    position: absolute;
    bottom: 20px;
    left: 12px;
    right: 12px;
    height: 44px;
    box-sizing: border-box;
    border: ~"1rpx" solid @border-color-light;
    .card-shadow(#e0e0e0);
    color: #666666;
    background: #ffffff;
    &.noShadow {
      box-shadow: none;
    }
    .need-help, .end-trip {
      display: inline-block;
      width: 50%;
      height: 44px;
      line-height: 44px;
      text-align: center;
      box-sizing: border-box;
    }
    .need-help {
      border-right: ~"1rpx" solid @border-color-deep;
    }
  }
</style>
