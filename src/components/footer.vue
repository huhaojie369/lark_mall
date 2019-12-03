<template>
  <div class="footer">
    <van-tabbar v-model="active" :safe-area-inset-bottom="true" active-color="#5829db" inactive-color="#000">
      <van-tabbar-item @click="goHome">
        <span>商品</span>
        <img
          slot="icon"
          slot-scope="props"
          :src="props.active ? icon.Hactive : icon.Hinactive"
        >
      </van-tabbar-item>
      <van-tabbar-item @click="goOrder">
        <span>订单</span>
          <img
          slot="icon"
          slot-scope="props"
          :src="props.active ? icon.Oactive : icon.Oinactive"
          >
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { Tabbar, TabbarItem } from 'vant';
import homesvg from '@/assets/images/home.png';
import homeactivesvg from '@/assets/images/homeactive.png';
import ordersvg from '@/assets/images/order.png';
import orderactivesvg from '@/assets/images/orderactive.png';

export default {
  components: {
    [Tabbar.name] :Tabbar,
    [TabbarItem.name] :TabbarItem,
  },
  props: {
    isctive: {
      type: Number,
      default: 0,
    }
  },
  data() {
    return{
      active: this.isctive,
      icon: {
        Hactive: homeactivesvg,
        Hinactive: homesvg,
        Oactive: orderactivesvg,
        Oinactive: ordersvg,
      }
    }
  },
  methods: {
    goHome() {
       this.$router.push('/');
    },
    goOrder() {
      this.$router.push('order');
    },
  }
}
</script>
<style lang="less" scoped>

  .footer /deep/ .van-tabbar{
    max-width: 750px;
    height: 120rem/50;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(239, 240, 240, 0.96);
  }
</style>
