<template>
  <div class="order-why-page">
    <div class="card">
      <div class="header">
        <p class="text-why">你为什么取消?</p>
        <p class="text-header">请告知我们，我们可以改善</p>
      </div>
      <div class="questionList weui-cells weui-cells_after-title">
        <checkbox-group @change="checkboxChange">
          <label class="weui-cell weui-check__label" v-for="item in reasons" :key="item.value">
            <checkbox class="weui-check" :value="item.value" :checked="item.checked"></checkbox>
            <div class="text weui-cell__bd">
              {{item.name}}
            </div>
            <img v-if="item.checked" src="/static/img/checked.png" alt="">
            <img v-if="!item.checked" src="/static/img/nochecked.png" alt="">
          </label>
        </checkbox-group>
        <div class="weui-cell weui-cell_link"
             v-if="isShowMore"
             @click.stop="showMoreReasons">
          <div class="more-reasons">点击查看更多原因</div>
        </div>
      </div>
    </div>
    <button class="btn-commit" @click.stop="commit">提交</button>
  </div>
</template>

<script type="text/ecmascript-6">
  import {reasons, moreResons} from '../../common/constant/constant'

  export default{
    data(){
      return {
        reasons: reasons,
        isShowMore: true
      }
    },
    onUnload(){
      this.clearData()
    },
    methods: {
      checkboxChange(e){
        const indexArr = e.mp.detail.value
        this.reasons = this.reasons.map(item => {
          if (indexArr.indexOf(String(item.value)) !== -1) {
            return {...item, checked: true}
          } else {
            return {...item, checked: false}
          }
        })
      },
      showMoreReasons(){
        wx.showLoading({
          title: '加载中',
          icon: 'loading',
          duration: 800,
          success: () => {
            this.reasons = this.reasons.concat(moreResons)
            this.isShowMore = false
          }
        })
      },
      commit(){
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          success: () => {
            wx.redirectTo({
              url: "/pages/orderClose/main"
            })
          }
        })
      },
      clearData(){
        this.reasons = reasons,
          this.isShowMore = true
      }
    }
  }
</script>

<style lang="less" scoped rel="stylesheet/less">
  @import '../../common/less/variable';
  @import '../../common/less/mixin1';

  .order-why-page {
    padding: 12px 12px 0;
    height: 100vh;
    box-sizing: border-box;
    background-color: @page-bg-color;
    .card {
      background-color: #fff;
      .header {
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 80px;
        box-sizing: border-box;
        .text-why {
          text-align: center;
          color: rgba(0, 0, 0, .6);
          font-size: 18px;
        }
        .text-header {
          text-align: center;
          color: #fc9153;
          font-size: 14px;
        }
      }
      .questionList {
        .text {
          .no-wrap();
          color: #666666;
          font-size: 14px;
        }
        img {
          width: 20px;
          height: 20px;
        }
      }
      .more-reasons {
        margin: 0 auto;
        height: 40px;
        line-height: 40px;
        padding-right: 12px;
        .inverted-triangle(#adadad)
      }
    }
    .btn-commit {
      margin: 20px 0;
      .long-btn(#fff, #4a4c5b);
    }
  }
</style>
