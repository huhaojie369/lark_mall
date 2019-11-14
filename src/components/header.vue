<template>
  <div>
    <van-nav-bar
      :title="headerobj.text"
      left-text=""
      right-text="按钮"
      :left-arrow="!headerobj.iscross"
      @click-left="onClickLeft"
      @click-right="onClickRight">
      <van-icon v-if="headerobj.iscross" name="cross" slot="left"/>
      <van-icon  v-if="headerobj.iswallet" size='40px' :name="walletIco" slot="right"/>
      <transition name="van-fade" slot="right">
        <div v-show="visible" class="opt_wallet_wrap">
          <div class="wallet_name">
            钱包
            <span class="user_name">-</span>
          </div>
          <div class="wallet_over">
            余额
            <span class="user_over">-</span>
          </div>
          <div class="toogle_btn" @click.stop="toogleWallet">切换钱包</div>
        </div>
      </transition>
    </van-nav-bar>
  </div>
</template>

<script>
  import { Icon,  NavBar } from 'vant';
  import walletIco from '../assets/images/wallet.png'
  export default {
    components: {
      [Icon.name]: Icon,
      [NavBar.name]: NavBar,
    },
    props: {
      headerobj:{
        type: Object,
      }
    },
    data() {
      return {
        walletIco,
        visible: false,
      }
    },
    methods: {
      onClickLeft() {
        // this.$router.go(-1);
        if(!this.headerobj.iscross){
          console.log('后退');
          this.$router.go(-1);
        }else{
          console.log('关闭');
        }
      },
      onClickRight() {
        this.visible = !this.visible
      },
      toogleWallet() {
        this.$toast('切换钱包');
      }
    },
  }
</script>
<style lang="less" scoped>
  /deep/ .van-icon{
    color: #7f7c94;
    font-size: 20px;
  }
  .opt_wallet_wrap{
    position: absolute;
    z-index: 2003;
    right: 0%;
    top: 100%;
    width:270rem/50;
    background:rgba(255,255,255,1);
    box-shadow:0px 8px 20px 0px rgba(59,51,130,0.16);
    border:1px solid rgba(88,41,219,0.36);
    border-radius: 8rem/50;
    padding: 28rem/50;
    &::after{
      content: '';
      width: 0px;
      height: 0px;
      border-color: transparent transparent #fff transparent;
      border-style: solid;
      border-width: 0.18rem;
      position: absolute;
      right: 0.54rem;
      top: -0.34rem;
    }
    &::before{
      content: '';
      width: 0px;
      height: 0px;
      border-color: transparent transparent rgba(88, 41, 219, 0.36) transparent;
      border-style: solid;
      border-width: 0.2rem;
      position: absolute;
      right: 0.52rem;
      top: -0.4rem;
    }
    .wallet_name, 
    .wallet_over{
    color: #7F7C94;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    }
    .user_name{
      color: #34333D;
      font-size: 24rem/50;
    }
    .user_over{
      color: #FF9514;
      font-size: 24rem/50;
    }
    .toogle_btn{
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