<template>
  <div>
    <van-nav-bar
      :title="headerobj.text"
      left-text
      right-text="按钮"
      :left-arrow="!headerobj.iscross"
      @click-left="onClickLeft"
      @click-right.stop="onClickRight"
    >
      <van-icon v-if="headerobj.iscross" name="cross" slot="left" />
      <van-icon v-if="headerobj.iswallet" size="40px" :name="walletIco" slot="right" />
      <transition name="van-fade" slot="right">
        <div class="opt_wallet_wrap" v-show="isWshow">
          <div @click.stop  class="opt_wallet">
            <!-- <div class="wallet_name">
              钱包
              <span class="user_name">-</span>
            </div> -->
            <div class="wallet_over">
              余额
              <span v-if="integral_num" class="user_over">{{ integral_num }} Lark</span>
              <span v-else class="user_over">-</span>
            </div>
            <!-- <div class="toogle_btn" @click.stop="toogleWallet">切换钱包</div> -->
          </div>
        </div>
      </transition>
    </van-nav-bar>
  </div>
</template>

<script>
var preD = function (e) {
    e.preventDefault()
}
import { Icon, NavBar } from "vant";
import walletIco from "../assets/images/wallet.png";
export default {
  components: {
    [Icon.name]: Icon,
    [NavBar.name]: NavBar
  },
  props: {
    headerobj: {
      type: Object
    }
  },
  data() {
    return {
      walletIco,
      isWshow: false,
      integral_num: null,
    };
  },
  watch: {
    isWshow (v){
      if(v){
        document.body.style.overflow = 'hidden'
        document.addEventListener('touchmove', preD, {passive: false}) // 禁止页面滑动
      }else{
        document.body.style.overflow = '' // 出现滚动条
        document.removeEventListener('touchmove', preD, {passive: false})
      }
    }
  },
  methods: {
    getMe() {
      this.axios.get('/me').then((res) => {
        if(res.status === 200) {
          // console.log(res);
          this.integral_num = res.data.data.integral_num
          // this.mallList = res.data.data
        }
      })
    },
    onClickLeft() {
      if (!this.headerobj.iscross) {
        this.$router.go(-1); // 后退商城
      } else {
        this.sendPraRequest("closeMall") // 关闭商城
      }
    },
    onClickRight() {
      this.isWshow = !this.isWshow;
    },
    getOperatingSystem() {
      if(/android/i.test(navigator.userAgent)){
        return 'Android'
      }
      if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)){
        return 'iOS'
        }
    },
    // 原生交互事件
    sendPraRequest(methodName, params, cbName) {
      var device_type = this.getOperatingSystem()
        var message = {
        'method': methodName,
        'params': params,
        'callback': cbName
        }
      if (device_type === 'Android') {
        window.ReactNativeWebView.postMessage('sendLarkMarketRequest=' + JSON.stringify(message))
      } else if (device_type === 'iOS') {
        window.webkit.messageHandlers.Larkshop.postMessage(message)
      }
    },
  },
  mounted() {
    // 获取用户信息
    this.getMe()
    window.addEventListener('message', function(event) {
      if (event.data && event.data.type == 'callback') {
        // console.log(event.data);
        var name = event.data.name;
        window[name](event.data.msg)
      }
    }, false);
  },
};
</script>
<style lang="less" scoped>
/deep/ .van-icon {
  color: #7f7c94;
  font-size: 20px;
}
.opt_wallet_wrap{
  position: fixed;
  left: 50%;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  max-width: 750px;
  transform: translateX(-50%);
  background-color: #fff0;
}
.opt_wallet {
  position: absolute;
  z-index: 2003;
  right: 16px;
  top: 46px;
  width: 270rem/50;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 8px 20px 0px rgba(59, 51, 130, 0.16);
  border: 1px solid rgba(88, 41, 219, 0.36);
  border-radius: 8rem/50;
  padding: 28rem/50;
  &::after {
    content: "";
    width: 0px;
    height: 0px;
    border-color: transparent transparent #fff transparent;
    border-style: solid;
    border-width: 0.18rem;
    position: absolute;
    // right: 0.54rem;
    right: 14px;
    top: -0.34rem;
  }
  &::before {
    content: "";
    width: 0px;
    height: 0px;
    border-color: transparent transparent rgba(88, 41, 219, 0.36) transparent;
    border-style: solid;
    border-width: 0.2rem;
    position: absolute;
    // right: 0.52rem;
    right: 13px;
    top: -0.4rem;
  }
  .wallet_name,
  .wallet_over {
    color: #7f7c94;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .user_name {
    color: #34333d;
    font-size: 24rem/50;
  }
  .user_over {
    color: #ff9514;
    font-size: 24rem/50;
  }
  .toogle_btn {
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    text-align: center;
    color: #fff;
    background: linear-gradient(90deg, #7c42f9 0%, #452dc2 100%);
    border-radius: 20px;
  }
}
</style>