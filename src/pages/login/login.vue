<template>
  <div class="login-page">
    <header>登录</header>
    <div class="login-content">
      <input type="text"
             class="weui-input input-login"
             v-model="phone"
             @input="changePhoneNum"
             maxlength="13"
             focus="true"
             placeholder-style="color:#999999"
             placeholder="请输入手机号">
      <img v-if="phone.length"
           @click.stop="clearPhoneNum"
           src="/static/img/cancel.png">
    </div>
    <button
      class="btn-next"
      @click.stop="next"
      :style="{backgroundColor:btnBackgroundColor}"
      :disabled="nextBtnDisabled">
      下一步
    </button>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapMutations} from 'vuex'

  export default{
    data(){
      return {
        phone: '',
        nextBtnDisabled: true,
        btnBackgroundColor: '#bcbcbc'
      }
    },
    methods: {
      clearPhoneNum(){
        this.phone = ''
      },
      changePhoneNum(e){
        console.log(e.mp.detail.value)
        let phoneNum = e.mp.detail.value
        phoneNum = phoneNum.replace(/\s+|[^\d]+/g, '')
        let result = []
        for (let i = 0; i < phoneNum.length; i++) {
          if (i === 3 || i === 7) {
            result.push(' ')
          }
          result.push(phoneNum.charAt(i))
        }
        this.phone = result.join('')
      },
      next(){
        if (!this.checkPhoneNum()) {
          wx.showToast({
            title: '请输入正确的手机号码!',
            icon: 'none',
          })
          this.clearPhoneNum()
          return
        }
        this.savePhone(this.phone.replace(/\s+/g, ''))
        wx.showToast({
          title: '登录成功!',
          icon: 'success',
          success: setTimeout(() => {
            wx.redirectTo({
              url: '/pages/index/main'
            })
            this.clearPhoneNum()
          }, 500)
        })
      },
      checkPhoneNum(){
        return /^1[34578]\d{9}$/.test(this.phone.replace(/\s+/g, ''))
      },
      ...mapMutations({
        savePhone: 'SET_PHONE'
      })
    },
    watch: {
      phone(newVal){
        this.nextBtnDisabled = newVal.length !== 13;
      },
      nextBtnDisabled(newVal){
        if (!newVal) {
          this.btnBackgroundColor = '#4a4c5b'
        }
      }
    }
  }
</script>

<style lang="less" scoped rel="stylesheet/less">

  .login-page {
    padding: 0 16px;
    header {
      margin-top: 60px;
      height: 40px;
      line-height: 40px;
      text-indent: 2px;
      text-align: center;
      color: #000;
      font-size: 20px;
    }
    .login-content {
      margin-top: 10px;
      position: relative;
      height: 60px;
      width: 100%;
      box-sizing: border-box;
      border: 1px solid #eeeff0;
      box-shadow: 0 0 1px #e5e6e7;
      .input-login {
        margin-left: 20px;
        display: inline-block;
        width: calc(100% - 20px - 18px - 20px);
        height: 60px;
      }
      img {
        position: absolute;
        top: 21px;
        right: 20px;
        display: inline-block;
        width: 18px;
        height: 18px;
      }
    }
    .btn-next {
      margin-top: 20px;
      color: #fff;
    }
  }
</style>
