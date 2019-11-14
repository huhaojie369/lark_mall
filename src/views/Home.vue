<template>
  <div class="home">
    <Header :headerobj="headerobj"></Header>

    <div class="content">
      <div class="main">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <van-row gutter="20">
            <van-col span="12" v-for="(item,index) in mallList" :key="index">
              <router-link class="MHomeLink" :to="'/details/' +item.gid">
                <div class="link_img">
                  <img @error="defImg()" :src="item.image" >
                </div>
                <div class="link_title"> 
                  <p class="van-multi-ellipsis--l2">{{ item.title }}</p>
                </div>
                <div class="link_label">
                  <span v-for="(labels,keyed) in item.label" :key="keyed"
                  :class="labelsfunc(labels)">
                    <template >{{ labels }}</template>
                  </span>
                  <!-- <span class="orange">热门</span> -->
                  <!-- <span class="yellow">一周年纪念</span> -->
                </div>
                <div class="link_footer">
                  <span class="price">
                    {{ item.price }} Lark
                  </span>
                  <span class="exchange">
                    已兑{{ item.exchanged }}份
                  </span>
                </div>
              </router-link>
            </van-col>
          </van-row>
        </van-pull-refresh>
      </div>

    </div>

    <Footer :active = 0 ></Footer>

  </div>
</template>

<script>
import Header from '@/components/header.vue'
import Footer from '@/components/footer'
import { Toast, Icon, PullRefresh, Row, Col, NoticeBar } from 'vant';
import homesvg from '@/assets/images/home.png';
import homeactivesvg from '@/assets/images/homeactive.png';
import ordersvg from '@/assets/images/order.png';
import orderactivesvg from '@/assets/images/orderactive.png';

// import vueWaterfallEasy from 'vue-waterfall-easy' // 瀑布流插件
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
    [Toast.name] :Toast,
    [NoticeBar.name] :NoticeBar,
    [PullRefresh.name] :PullRefresh,
    // vueWaterfallEasy
  },
  data() {
    return{
      headerobj: {
        iscross: false,
        iswallet: true,
        text: "L A R K 商城"
      },
      isLoading: false,
      defaultImg: require('../assets/images/logo.svg'),
      mallList: [{
        exchanged: 8000,
        gid: 1,
        image: "http://wallet.admin/uploads/572061a79bf6e9d4673bc8febbac6915.jpg",
        label: ["热门", "抢购"],
        price: 1000,
        title: "苹果手机离开红军看来进口鳞茎离开金陵科技快乐教皇克莱简历库离开离开了简历库",
      }
      ],
      labels: [],
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
    goHome() {
       this.$router.push('home');
    },
    goOrder() {
      this.$router.push('order');
    },
    getMalls() {
      this.axios.get('/mall').then((res) => {
        if(res.status === 200) {
          this.mallList = res.data.data
        }
      })
    },
    onRefresh() {
      setTimeout(() => {
        this.$toast('刷新成功');
        this.isLoading = false;
      }, 500);
    },

  },
  mounted () {
    this.getMalls();
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
    margin: 0 auto;
    position: relative;
    padding-bottom: 90rem/@base;
  }
  .main{
    padding: 28rem/@base;
    background-color: #fff;
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
    margin: 7.5px 0;
    img {
      display: block;
      width: 100%;
    }
    .link_img{
      border-bottom: 1px solid #F5F5FA;
      min-height: 336rem/@base;
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