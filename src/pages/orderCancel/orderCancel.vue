<template>
  <div class="cancel-page">
    <div class="header">
      <p class="text-desc">这是最近的司机，重新叫车将等待</p>
      <p class="text-desc">更长的时间，建议您在等等</p>
      <p class="text-small">2分钟内取消行程，不需要付费补偿司机</p>
    </div>
    <div class="container">
      <img src="/static/img/cancelCart.png" alt="">
    </div>
    <button class="btn btn-cancel" @click.stop="showCancelDialog">确定取消</button>
    <button class="btn btn-no-cancel" @click.stop="noCancel">暂不取消</button>
    <div class="footer">
      <img src="/static/img/rules.png" alt="">
      <span class="text-rule">取消规则</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default{
    methods: {
      showCancelDialog(){
        wx.showModal({
          content: '确定要取消行程吗',
          cancelColor: '#cccccc',
          confirmColor: '#fc9c56',
          success: function (res) {
            if (res.confirm) {
              wx.redirectTo({
                url: "/pages/orderWhy/main",
              })
            } else if (res.cancel) {
              wx.navigateBack()
            }
          }
        })
      },
      noCancel(){
        wx.navigateBack()
      }
    }
  }
</script>

<style lang="less" scoped rel="stylesheet/less">
  @import '../../common/less/mixin1';

  .cancel-page {
    padding: 30px 16px 0;
    height: 100vh;
    box-sizing: border-box;
    overflow: hidden;
    .header {
      text-align: center;
      .text-desc {
        color: #333333;
        font-size: 20px;
      }
      .text-small {
        margin-top: 16px;
        font-size: 14px;
        color: #d1d1d1;
      }
    }
    .container {
      margin-top: 40px;
      text-align: center;
    }
    .btn {
      margin-top: 10px;
      &.btn-cancel {
        .long-btn(#000, #f5f5f5);
        border: 1px solid #4d4d4d;
      }
      &.btn-no-cancel {
        .long-btn(#fff, #4a4c5b);
      }
    }
    .footer {
      position: absolute;
      bottom: 10px;
      left: 50%;
      transform: translateX(-50%);
      height: 18px;
      font-size: 0;
      img {
        vertical-align: top;
        display: inline-block;
        width: 18px;
        height: 18px;
      }
      .text-rule {
        margin-left: 5px;
        height: 18px;
        line-height: 18px;
        font-size: 14px;
        color: #b8b8b8;
      }
    }
  }
</style>
