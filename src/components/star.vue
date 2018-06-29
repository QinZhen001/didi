<template>
  <div class="star">
    <span v-for="(itemClass,index) in stars"
          :key="itemClass"
          :class="itemClass"
          class="star-item"
          @click.stop="chooseStar(index)"
    >
    </span>
  </div>
</template>

<script type="text/ecmascript-6">
  import {isDecimalNum} from '../utils/index'


  const CLS_ON = 'on'
  const CLS_HALF = 'half'
  const CLS_OFF = 'off'

  export default{
    props: {
      score: {
        type: Number,
        default: 0
      },
      length: {
        type: Number,
        default: 5
      }
    },
    data(){
      return {}
    },
    methods: {
      chooseStar(index){
        this.$emit('chooseStar', index + 1)
      }
    },
    computed: {
      stars(){
        let result = []
        const integer = Math.floor(this.score)
        for (let i = 0; i < integer; i++) {
          result.push(CLS_ON)
        }
        if (isDecimalNum(this.score)) {
          result.push(CLS_HALF)
        }
        while (result.length < this.length) {
          result.push(CLS_OFF)
        }
        return result
      }
    }
  }
</script>

<style lang="less" scoped rel="stylesheet/less">
  @import '../common/less/mixin1';

  .star {
    font-size: 0;
    .star-item {
      margin-right: 10px;
      display: inline-block;
      width: 22px;
      height: 22px;
      background-repeat: no-repeat;
      background-size: 22px 22px;
      .extend-click();
      &:last-child {
        margin-right: 0;
      }
      &.on {
        background-image: url("../../static/img/star/star36_on@2x.png")
      }
      &.half {
        background-image: url("../../static/img/star/star36_half@2x.png")
      }
      &.off {
        background-image: url("../../static/img/star/star36_off@2x.png")
      }
    }
  }
</style>
