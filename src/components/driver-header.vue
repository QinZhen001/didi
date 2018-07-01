<template>
  <cover-view class="driver-header">
    <cover-view class="driver-img">
      <cover-image class="img" src="/static/img/driver.png"/>
    </cover-view>

    <cover-view class="driver-detailed">
      <cover-view class="detailed-header">
        <cover-view class="detailed-name">{{driver.name}}</cover-view>
        <cover-image class="detailed-star" src="/static/img/star.png"></cover-image>
        <cover-view class="detailed-order">{{driver.stars}}</cover-view>
      </cover-view>

      <cover-view class="detailed-car-number">{{driver.Cartnumber}}</cover-view>

      <cover-view class="detailed-car">{{driver.cart}}</cover-view>

    </cover-view>

    <cover-view class="driver-contact">
      <cover-view class="img-mas">
        <cover-image class="img" src="/static/img/msm.png"/>
      </cover-view>
      <cover-view class="img-phone">
        <cover-image class="img" src="/static/img/phone.png"/>
      </cover-view>
    </cover-view>
  </cover-view>
</template>

<script type="text/ecmascript-6">
  export default{
    props: {
      driver: {
        type: Object,
        default: {}
      }
    }
  }
</script>

<style lang="less" scoped rel="stylesheet/less">

  .driver-header {
    padding: 0 12px;
    display: flex;
    align-items: center;
    width: 100%;
    height: 95px;
    .driver-img {
      flex: 0 0 auto;
      .img {
        width: 75px;
        height: 75px;
      }
    }
    .driver-detailed {
      margin-left: 10px;
      font-size: 0;
      .detailed-header {
        height: 30px;
        line-height: 30px;
        font-size: 0;
        .detailed-name, .detailed-order {
          display: inline-block;
          height: 30px;
          line-height: 30px;
        }
        .detailed-name {
          color: #333333;
          font-size: 18px;
        }
        .detailed-star {
          margin: 0 4px;
          position: relative;
          top: -7px;
          display: inline-block;
          width: 17px;
          height: 17px;
        }
        .detailed-order {
          font-size: 14px;
          opacity: .6;
        }
      }
      .detailed-car-number {
        margin-top: 2px;
        width: 80px;
        height: 16px;
        line-height: 16px;
        font-size: 14px;
        background-color: #eeeeee;
        border: 1px solid #cccccc;
        text-align: center;
      }
      .detailed-car {
        margin-top: 6px;
        height: 16px;
        line-height: 16px;
        font-size: 14px;
        color: #666666;
      }
    }
    .driver-contact {
      flex: 1 1 auto;
      .img-mas, .img-phone {
        margin-left: 10px;
        display: inline-block;
        .img {
          width: 35px;
          height: 35px;
        }
      }
    }
  }
</style>
