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
          <span class="text-info">{{progressTxt}}</span>
          <span class="text-time">{{time}}</span>
        </div>
      </div>
    </div>
    <div class="footer">
      <span class="btn-cancel" @click.stop="cancel">取消订单</span>
      <span class="btn-no-carpool" @click.stop="back">不拼车</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapState} from 'vuex'
  import {formatNumber} from '../../utils/index'

  let countTimer;
  const MAX_WAIT_TIME = 5 * 60

  export default{
    data(){
      return {
        progressTxt: '已等待',
        time: '00:00'
      }
    },
    onReady(){
      this.drawProgressBg();
      this.countInterval();
//      this.drawProgress();
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
//      step的取值是0-2 所以step = step*2
        step = step * 2
        const context = wx.createCanvasContext('progress');
        context.setLineWidth(4);
        context.setStrokeStyle("#fbcb02");
        context.setLineCap('round')
        context.beginPath();
        // 参数step 为绘制的圆环周长，从0到2为一周 。 -Math.PI / 2 将起始角设在12点钟位置 ，结束角 通过改变 step 的值确定
        context.arc(110, 110, 100, -Math.PI / 2, step * Math.PI - Math.PI / 2, false);
        context.stroke();
        context.draw()
      },
      cancel(){
        wx.redirectTo({
          url: "/pages/cancel/main",
          success: () => {
            this.clearData()
          }
        })
      },
      back(){
        wx.redirectTo({
          url: "/pages/index/main",
          success: () => {
            this.clearData()
          }
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
    }
  }
</script>

<style lang="less" scoped rel="stylesheet/less">
  @import '../../common/less/mixin1';

  .wait-page {
    padding: 10px 16px 0 16px;
    height: 100vh;
    background-color: #f4f6f8;
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
      .text-desc-up {
        margin-top: 30px;
        text-align: center;
        font-size: 20px;
        color: #666666;
      }
      .text-desc-down {
        margin-top: 10px;
        text-align: center;
        font-size: 16px;
        color: #666666;
      }
      .circle-progress-wrapper {
        position: relative;
        margin: 20px auto 0;
        width: 220px;
        height: 220px;
        .progress-bg, .progress {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        .progress-info {
          text-align: center;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 0;
          .text-info {
            margin-bottom: 10px;
            display: inline-block;
            font-size: 14px;
            color: #666666;
            letter-spacing: 1px;
          }
          .text-time {
            display: inline-block;
            font-size: 28px;
            color: #fc9153;
          }
        }
      }
    }
    .footer {
      margin-top: 120px;
      width: 100%;
      height: 44px;
      box-shadow: 1px 1px 3px #f5f6f7, 0 0 5px #e3e4e5;
      background-color: #fff;
      color: #666666;
      text-align: center;
      box-sizing: border-box;
      border: 1px solid #eee;
      .btn-cancel, .btn-no-carpool {
        display: inline-block;
        height: 44px;
        line-height: 44px;
        width: 50%;
      }
      .btn-cancel {
        box-sizing: border-box;
        border-right: 1px solid #eee;
      }
    }
  }
</style>
