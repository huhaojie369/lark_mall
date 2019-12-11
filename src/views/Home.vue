<template>
  <div class="home">
    <Header :headerobj="headerobj"></Header>

    <div class="content">
      <div class="main">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <van-list
            v-model="loading"
            :error.sync="error"
            error-text="请求失败，请重新加载"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad">
            <van-row type="flex" gutter="20">
              <van-col 
                span="12" 
                v-for="(item,index) in mallList"
                :key="index">
                <div class="MHomeLink" @click="goDetails(item.id, item.supply, item.status)">
                  <div class="link_header">
                    <img @error="defImg()" :src="item.image[0]">
                    <div class="sellout_tips" v-if="item.supply == 0">
                      已售罄 补货中
                    </div>
                    <div class="sellout_tips" v-if="item.status === 2">
                      未开售
                    </div>
                    <div class="sellout_tips" v-if="item.status === 3">
                      已售罄 补货中
                    </div>
                  </div>
                  <div class="link_title">
                    <p class="van-multi-ellipsis--l2">{{ item.title }}</p>
                  </div>
                  <div class="link_label">
                    <span v-for="(labels,keyed) in item.label" :key="keyed"
                    :class="labelsfunc(labels)">
                      <template >{{ labels }}</template>
                    </span>
                  </div>
                  <div class="link_footer">
                    <span class="price">
                      {{ item.price }} Lark
                    </span>
                    <span class="exchange">
                      已兑{{ item.exchanged }}份
                    </span>
                  </div>
                </div>
              </van-col>
            </van-row>
          </van-list>
        </van-pull-refresh>
      </div>

    </div>

    <Footer :active = 0 ></Footer>
  </div>
</template>

<script>
import Header from '@/components/header.vue'
import Footer from '@/components/footer'
import { Toast, Icon, List, PullRefresh, Row, Col, NoticeBar } from 'vant';
import homesvg from '@/assets/images/home.png';
import homeactivesvg from '@/assets/images/homeactive.png';
import ordersvg from '@/assets/images/order.png';
import orderactivesvg from '@/assets/images/orderactive.png';
//   Status 商品状态 1 正常销售 2 倒计时中  3 限时结束
// 默认展示图片
import defaultPhoto from '@/assets/images/logo.svg';
export default {
  name: 'home',
  components: {
    Header,
    Footer,
    [Row.name] :Row,
    [Col.name] :Col,
    [Icon.name] :Icon,
    [List.name] :List,
    [Toast.name] :Toast,
    [NoticeBar.name] :NoticeBar,
    [PullRefresh.name] :PullRefresh,
  },
  data() {
    return{
      headerobj: {
        iscross: true,
        iswallet: true,
        text: "L A R K 商城"
      },
      disabled: false, // 瀑布流
      isWshow: false, // 是否显示切换钱包
      isLoading: false, // Loading
      error: false,
      list: [],
      page: 1,
      loading: false,
      finished: false,
      defaultImg: require('../assets/images/logo.svg'), // 默认图片
      mallList: [],
    }
  },
  methods: {
    labelsfunc(value) {
       switch (value) {
        case "限时":
          return "pur";
        case "免息":
          return "blue";
        case "热门":
          return "orange";
        case "限量":
          return "pur";
        case "一周年出品":
          return "yellow";
        default:
          return "";
      }
    },
    // 默认图片
    defImg(){
      let img = event.srcElement;
      img.src = this.defaultImg;
      img.onerror = null; //防止闪图
    },
    // 首页
    goHome() {
       this.$router.push('home');
    },
    // 订单页
    goOrder() {
      this.$router.push('order');
    },
    // 获取商品列表
    getMalls() {
      this.axios.get(`/goods`).then((res) => {
        if(res.status === 200) {
          this.mallList = res.data.data
        }
      })
    },
    onRefresh() {
      setTimeout(() => {
        this.getMalls();
        this.isLoading = false;
      }, 500);
    },
    // 判断是跳转至详情页面
    goDetails(id, supply, productStatus) {
      // 判断是否已经到达开售时间
      if(productStatus == 2) return this.$toast('商品未开售');
      // 判断是否已经到达结束时间
      if(productStatus == 3) return this.$toast('库存不足，正在补货中');
      // 正常商品
      if(supply != 0 &&  productStatus === 1) {
        this.$router.push({path: `details/${id}`})
      }else if(supply == 0){ // 库存不足
        this.$toast('库存不足，正在补货中');
      }
    },
    onLoad() {
      // 异步更新数据
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1);
        }
        // 加载状态结束
        this.loading = false;

        // 数据全部加载完成
        if (this.list.length >= 40) {
          this.finished = true;
        }
      }, 500);
  },


    // 与原生交互==================================
    // 切换钱包
    // CBswitchAccount(msg) {
    //   // console.log('msg',msg);
    //   if(msg){
    //     window.localStorage.setItem('token',msg);
    //     // this.walletInfo.balance = msg.balance
    //   }else {
    //     // this.walletInfo.balance = '-'
    //   }
    // },
    // getOperatingSystem() {
    //   if(/android/i.test(navigator.userAgent)){
    //     return 'Android'
    //   }
    //   if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)){
    //     return 'iOS'
    //     }
    // },
    // // 原生交互事件
    // sendPraRequest(methodName, params, cbName) {
    //   var device_type = this.getOperatingSystem()
    //     var message = {
    //     'method': methodName,
    //     'params': params,
    //     'callback': cbName
    //     }
    //   if (device_type === 'Android') {
    //     window.ReactNativeWebView.postMessage('sendLarkMarketRequest=' + JSON.stringify(message))
    //   } else if (device_type === 'iOS') {
    //     window.webkit.messageHandlers.Larkshop.postMessage(message)
    //   }
    // },

  },
  mounted () {

    // 获取列表
    this.onRefresh();
    // window注册message事件
    window.addEventListener('message', function(event) {
      if (event.data && event.data.type == 'callback') {
        var name = event.data.name;
        window[name](event.data.msg)
      }
    }, false);

    // 事件挂载到window上面
    window.CBswitchAccount = this.CBswitchAccount

    // this.sendPraRequest('getAccount',{},'CBswitchAccount')
    
  }
}
</script>
<style lang="less" scoped>
  @base: 50;
  .content{
    width: 100%;
    height: 100%;
    max-width: 750px;
    min-width: 320px;
    min-height: 90vh;
    margin: 0 auto;
    position: relative;
    padding-bottom: 90rem/@base;
  }
  .main{
    padding: 28rem/@base;
    background-color: #fff;
  }
  .van-row.van-row--flex{
    flex-wrap: wrap;
    .van-col{
      margin: 7.5px 0;
    }
  }
  .content /deep/ .van-pull-refresh{
    overflow: inherit;
  }
  .MHomeLink{
    background: #ffffff;
    box-shadow: 0px 10px 38px 0px rgba(201, 197, 235, 0.32);
    border-radius: 4px;
    width: 100%;
    height: 100%;
    display: block;
    position: relative;
    img {
      display: block;
      width: 100%;
    }
    .link_header{
      height: 336rem/@base;
      border-bottom: .5px solid #F5F5FA;
      position: relative;
      .sellout_tips{
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 48rem/@base;
        line-height: 48rem/@base;
        text-align: center;
        color: #fff;
        font-size: 20rem/@base;
        background:rgba(127,124,148,0.76);
      }
    }
    .link_title{
      min-height: 80rem/@base;
      font-size: 28rem/@base;
      padding: 20rem/@base;
      color: #1C1C21;
      p{
        margin: 0;
      }
    }
    .link_label{
      padding: 0 0.4rem;
      margin-bottom: 20rem/@base;
      box-sizing: border-box;
      text-align: left;
      span{
        padding: 0.12rem 0.24rem;
        font-size: 0.36rem;
        margin-right: 0.2rem;
        border-radius: 0.08rem;
        color: #5829DB;
        background:rgba(88,41,219,0.05);
      }
      .pur{
        color: #5829DB;
        background:rgba(88,41,219,0.05);
      }
      .blue{
        color: #2ABCB4;
        background:rgba(255,255,255,1);
        background:rgba(42,188,180,0.06);
      }
      .orange{
        color: #FE5322;
        background:rgba(254,83,34,0.06);
      }
      .yellow{
        color: #D3A823;
        background:rgba(188,148,42,0.06);
      }
    }
    .link_footer{
      padding: 0 14px 14px 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .price{
        color: #FF9514;
        font-size: 15px;
      }
      .exchange {
        color: #A8A5C4;
        font-size: 13px;
      }
    }
  }
</style>