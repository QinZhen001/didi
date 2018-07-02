<template>
  <div class="wait-page">
    <div class="header">
      <img src="/static/img/remind.png">
      <p class="text-header">
        您上车的站点为<span class="text-address">「{{startFormattedPlace}}」</span>
      </p>
    </div>
    <div class="container">
      <div class="text-desc-up">正在为您寻找车辆和拼友</div>
      <div class="text-desc-down">每人一小步，更快更顺路</div>
      <div class="circle-progress-wrapper">
        <canvas class="progress-bg" canvas-id="progressBg"></canvas>
        <canvas class="progress" canvas-id="progress"></canvas>
        <div class="progress-info">
          <div class="text-info">{{progressTxt}}</div>
          <div class="text-time">{{time}}</div>
        </div>
      </div>
    </div>
    <CommonFooter
      noShadow="true"
      leftText="取消订单"
      rightText="不拼车"
      @clickLeft="cancel"
      @clickRight="back"
    >
    </CommonFooter>
  </div>
</template>

<script type="text/ecmascript-6">
  import CommonFooter from '../../components/common-footer.vue';
  import {mapState} from 'vuex'
  import {formatNumber} from '../../utils/index'

  let countTimer;
  const MAX_WAIT_TIME = 180

  export default{
    data(){
      return {
        progressTxt: '已等待',
        time: '00:00'
      }
    },
    onShow(){
      this.drawProgressBg();
      this.countInterval();
    },
    onUnload(){
      this.clearData()
    },
    methods: {
      drawProgressBg(){
        const ctx = wx.createCanvasContext('progressBg')
        ctx.setLineWidth(4);
        ctx.setStrokeStyle("#e5e5e5");
        ctx.setLineCap("round");
        ctx.beginPath();
        ctx.arc(110, 110, 100, 0, 2 * Math.PI, false);
        ctx.stroke();
        ctx.draw();
      },
      countInterval(){
        let cur = 0,
          timer = new Date(0, 0),
          randomTime = Math.floor(20 * Math.random())
        countTimer = setInterval(() => {
          if (cur <= randomTime) {
            this.time = formatNumber(timer.getMinutes()) + ':' + formatNumber(timer.getSeconds())
            timer.setMinutes(cur / 60)
            timer.setSeconds(cur % 60)
            this.drawProgress(cur / MAX_WAIT_TIME)
            cur++;
          } else {
            this.progressTxt = '匹配成功'
            clearInterval(countTimer);
            wx.redirectTo({
              url: "/pages/orderService/main",
            });
          }
        }, 1000)
      },
      drawProgress(step){
        const context = wx.createCanvasContext('progress');
        context.setLineWidth(4);
        context.setStrokeStyle("#fbcb02");
        context.setLineCap('round')
        context.beginPath();
        // 参数step 为绘制的圆环周长，从0到2为一周 。 -Math.PI / 2 将起始角设在12点钟位置 ，结束角 通过改变 step 的值确定
        context.arc(110, 110, 100, -Math.PI / 2, step * 2 * Math.PI - Math.PI / 2, false);
        context.stroke();
        context.draw()
      },
      cancel(){
        wx.navigateTo({
          url: "/pages/orderCancel/main",
        })
        this.clearData()
      },
      back(){
        wx.redirectTo({
          url: "/pages/index/main",
        })
      },
      clearData(){
        clearInterval(countTimer);
        this.time = '00:00'
      }
    },
    computed: {
      ...mapState([
        'startFormattedPlace',
      ])
    },
    components: {
      CommonFooter
    }
  }
</script>

<style lang="less" scoped rel="stylesheet/less">
  @import '../../common/less/mixin1';
  @import '../../common/less/variable';

  .wait-page {
    padding: 12px 12px 0;
    height: 100vh;
    background-color: @page-bg-color;
    box-sizing: border-box;
    overflow: hidden;
    .header {
      display: flex;
      align-items: center;
      width: 100%;
      height: 50px;
      box-shadow: 0 0 5px #e3e4e5;
      background-color: #fff;
      border-radius: 3px;
      img {
        margin: 0 5px;
        flex: 0 0 25px;
        width: 25px;
        height: 25px;
      }
      .text-header {
        font-size: 14px;
        .no-wrap();
        .text-address {
          color: #fc9153;
        }
      }
    }
    .container {
      position: relative;
      .text-desc-up, .text-desc-down {
        text-align: center;
        color: #666666;
      }
      .text-desc-up {
        margin-top: 30px;
        font-size: 20px;
      }
      .text-desc-down {
        margin-top: 10px;
        font-size: 16px;
      }
      .circle-progress-wrapper {
        position: relative;
        margin: 25px auto 0;
        width: 220px;
        height: 220px;
        font-size: 0;
        .progress-bg, .progress {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        .progress-info {
          position: relative;
          top: 75px;
          .text-info {
            text-align: center;
            font-size: 14px;
            color: #666666;
            letter-spacing: 1px;
          }
          .text-time {
            margin-top: 5px;
            text-align: center;
            font-size: 28px;
            color: #fc9153;
          }
        }
      }
    }
  }
</style>
