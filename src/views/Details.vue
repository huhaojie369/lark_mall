<template>
  <div class="details">
    <Header :headerobj="headerobj"></Header>

    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <div class="pic_list">
        <van-swipe :autoplay="3000" indicator-color="#582adc">
          <van-swipe-item v-for="(item,index) in detail.image" :key="index">
            <img :src="item" />
          </van-swipe-item>
        </van-swipe>
      </div>
      <div class="pic_title">
        <h2>{{ detail.title }}</h2>
        <p>{{ detail.price }} Lark</p>
      </div>
      <div class="pic_prompt">该物品不可退货</div>
      <div class="pic_product">
        <div class="pic_product_title">商品详情</div>
        <p class="desc">{{ detail.desc }}</p>
      </div>
    </van-pull-refresh>

    <div class="lark_navs">
      <div
        :class="{ 'disabled' : detail.status != 1 }"
        class="exchange_btn"
        @click="showtransform"
      >立即兑换</div>
    </div>

    <van-action-sheet v-model="first_step">
      <div class="mall_info van-hairline--bottom">
        <div class="info_left">
          <img :src="detail.image[0]" />
        </div>
        <div class="info_right">
          <div class="right_title">{{ detail.title }}</div>
          <div class="right_pic">{{ detail.price }} Lark</div>
        </div>
      </div>
      <div class="buy_con">
        <div class="buy_wrap">
          <div class="buy_wrap_left">
            <span class="left_title">购买数量</span>
            <span>剩余 {{ detail.supply }} 件</span>
          </div>
          <div class="buy_wrap_right">
            <van-stepper
              min="1"
              :max="detail.limit || detail.supply"
              :disabled="detail.attr > 128"
              :disable-input="true"
              v-model="stepper_value"
            />
            <div class="stint_num">
              <template v-if="stepper_value >= detail.supply || detail.supply == null">库存不足</template>
              <template
                v-if="stepper_value >= detail.limit && detail.limit != null"
              >每人限购{{ detail.limit }}份</template>
            </div>
          </div>
        </div>
        <div class="exchange_btn" @click="nextBtn">下一步</div>
      </div>
    </van-action-sheet>
    <!-- attr 0 实物 其他虚拟 -->
    <van-action-sheet v-if="detail.attr === 0" v-model="second_step" title="收货信息">
      <van-field v-model="receive_name" required clearable placeholder="请填写收货人姓名" />
      <van-field
        v-model="receive_phone"
        clearable
        :required="true"
        placeholder="请填写收货人手机号"
        error-message
      />
      <van-field
        v-model="receive_address"
        clearable
        :required="true"
        rows="2"
        autosize
        :show-word-limit="true"
        type="textarea"
        placeholder="请填写详细地址"
      />
      <div class="step_bottom">
        <div class="sum">
          合计:
          <span>{{ Number(detail.price) * Number(stepper_value) }} Lark</span>
        </div>
        <div class="submit_btn" @click="submitBtn">提交订单</div>
      </div>
    </van-action-sheet>

    <van-action-sheet v-if="detail.attr != 0" v-model="second_step" title-name="cross" title="订单信息">
      <div class="mall_info van-hairline--bottom">
        <div class="info_left"></div>
        <div class="info_right">
          <div class="right_title">{{ detail.title }}</div>
          <div class="right_pic">
            <span>{{ detail.price }} Lark</span>
            <span id="buy_number">x {{ stepper_value }}</span>
          </div>
        </div>
      </div>
      <div class="step_bottom">
        <div class="sum">
          合计:
          <span>{{ Number( detail.price ) * Number( stepper_value) }} Lark</span>
        </div>
        <div class="submit_btn" @click="submitBtn">提交订单</div>
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
import Header from "../components/header.vue";
import {
  Sku,
  Icon,
  Swipe,
  Field,
  Button,
  Dialog,
  SwipeItem,
  CellGroup,
  PullRefresh,
  ActionSheet,
  Stepper
} from "vant";

export default {
  components: {
    Header,
    [Sku.name]: Sku,
    [Icon.name]: Icon,
    [Swipe.name]: Swipe,
    [Field.name]: Field,
    [Button.name]: Button,
    [Dialog.name]: Dialog,
    [Stepper.name]: Stepper,
    [CellGroup.name]: CellGroup,
    [SwipeItem.name]: SwipeItem,
    [PullRefresh.name]: PullRefresh,
    [ActionSheet.name]: ActionSheet
  },
  data() {
    return {
      headerobj: {
        iswallet: false,
        text: "商品详情"
      },
      first_step: false,
      second_step: false,
      stepper_value: 1,
      isLoading: false,
      // detals 里面默认添加一张图片，否则vue初始化时会报错
      detail: {
        attr: 0,
        bought: 1,
        desc: "fddddddd",
        exchanged: 4,
        gid: 8,
        image: [
          "http://wallet.admin/uploads/images/190809-8.png", 
          "http://wallet.admin/uploads/images/190812-1.jpg"
        ],
        label: ["热门"],
        limit: 5,
        on_sale: null,
        out_sale: null,
        price: 99,
        status: 1,
        supply: 84,
        title: "duke2",
      },
      tips: null,
      receive_name: null,
      receive_phone: null,
      receive_address: null
    };
  },

  methods: {
    getDetails() {
      this.axios.get(`/mall/${this.$route.params.id}`).then(res => {
        if (res.status === 200) {
          this.detail = res.data.data.good;
          this.tips = res.data.data.tag;
        }
      });
    },
    onRefresh() {
      setTimeout(() => {
        this.$toast("刷新成功");
        this.isLoading = false;
      }, 500);
    },
    showtransform() {
      if (this.detail.status == 1) {
        this.first_step = true;
      } else {
        this.$toast(this.tips);
      }
    },
    nextBtn() {
      this.axios.get(`/receiver-info`).then(res => {
        if (res.status === 200 && res.data.data != null) {
          this.receive_name = res.data.data.name;
          this.receive_phone = res.data.data.phone;
          this.receive_address = res.data.data.address;
        }
      });
      // 两个值。一个是限购的值，另外一个是已购买值
      if((this.stepper_value + this.detail.bought) > this.detail.limit){
        this.$toast('超出限购数量，您当前已购买'+ this.detail.bought + '个，该商品限购数量为'  +this.detail.limit);
        return false;
      }
      this.first_step = false;
      this.second_step = true;
    },
    submitBtn() {
      Dialog.confirm({
        title: '是否确认购买？',
      }).then(() => {
        let params;
        // 表单校验
        if (this.detail.attr === 0) {
          if (this.receive_name == "" || this.receive_name == null)
            return this.$toast("收货人不能为空");
          if (this.receive_phone == "" || this.receive_phone == null) {
            return this.$toast("收货人手机不能为空");
          } else {
            var re = /^1[345678]\d{9}$/;
            if (!re.test(this.receive_phone)) {
              return this.$toast("手机号格式不正确");
            }
          }
          if (this.receive_address == "" || this.receive_address == null)
            return this.$toast("收货人地址不能为空");

          params = {
            amount: this.stepper_value,
            name: this.receive_name,
            address: this.receive_address,
            phone: this.receive_phone
          };
        } else {
          params = {
            amount: this.stepper_value
          };
        }

        this.axios
          .post(`/mall/${this.detail.gid}`, params)
          .then(res => {
            if (res.status === 200) {
              return this.$router.push("/status");
            }
          })
          .catch(err => {
            return this.$toast(err.response.data.msg);
          });
      }).catch(() => {
        // on cancel
      });
    }
  },
  mounted() {
    // this.getDetails();

    window.addEventListener("message",function(event) {
      if (event.data && event.data.type == "callback") {
          var name = event.data.name;
          window[name](event.data.msg);
      }
    },false);
  },
};
</script>

<style lang="less" scoped>
/deep/ .van-action-sheet__header {
  text-align: left;
  padding-left: 15px;
}

/deep/ .van-stepper__minus,
.van-stepper__plus {
  background-color: #fff0;
}
/deep/ .van-field__control {
  width: 100%;
  min-height: 45px;
  color: #34333d;
  background: #f5f5fa;
  border-radius: 4px;
  border: 1px solid #fff0;
  padding: 0 40px 0 15px;
  &:focus {
    border: 1px solid #5829db;
  }
}
/deep/ .van-field__clear {
  margin: 0;
  position: absolute;
  right: 6px;
}
/deep/ .van-stepper__plus {
  background-color: #fff0;
}
/deep/ .van-stepper__input {
  background: #e3d9ff;
  color: #5829db;
  font-weight: 600;
  border-radius: 5px;
  width: 30px;
}
.van-popup--bottom.van-popup--round {
  border-radius: 8px 8px 0 0;
}
.details {
  text-align: left;
  padding-bottom: 100px;
}
.pic_list {
  min-height: 320rem/50;
  width: 100%;
  border-bottom: 0.5px solid #f5f5fa;
  img {
    width: 100%;
  }
}
.pic_title {
  margin-top: 10px;
  padding: 20px;
  background-color: #fff;
  h2 {
    font-size: 16px;
    color: #1c1c21;
    margin-bottom: 0.4rem;
  }
  p {
    color: #ff9514;
    font-size: 14px;
    font-weight: 800;
  }
}
.pic_prompt {
  color: #7f7c94;
  font-size: 0.48rem;
  margin: 15px 0;
  padding: 15px 20px;
  background-color: #fff;
}
.pic_product {
  padding: 15px 20px;
  background-color: #fff;
  color: #4c4b59;
  font-size: 14px;
  .pic_product_title {
    color: #34333d;
    font-size: 16px;
    margin-bottom: 0.76rem;
    .desc{
      margin-bottom: 20px;
    }
  }
}
.lark_navs {
  position: fixed;
  bottom: 0;
  max-width: 750px;
  min-width: 320px;
  width: 100%;
  height: 70px;
  overflow: hidden;
  box-sizing: border-box;
  color: #fff;
  font-size: 14px;
  text-indent: 10px;
  background-color: rgba(239, 240, 240, 0.96);
  display: flex;
  align-items: center;
  -webkit-box-pack: justify;
  justify-content: center;
}
.exchange_btn {
  width: 295px;
  height: 42px;
  line-height: 42px;
  font-size: 14px;
  margin: 0 auto;
  text-align: center;
  color: #ffffff;
  background: linear-gradient(90deg, #8542f9 0%, #452dc2 100%);
  box-shadow: 0px 5px 13px 0px rgba(88, 41, 219, 0.42);
  border-radius: 20px;
  &.disabled {
    background: rgba(115, 114, 124, 0.76);
    box-shadow: none;
  }
}

.info_left {
  width: 70px;
  height: 70px;
  background-color: #7f7c94;
  border-radius: 4px;
  img {
    width: 100%;
    height: 100%;
  }
}
.mall_info {
  display: flex;
  padding: 15px;
  .info_right {
    margin-left: 15px;
    width: 73%;
  }
  .right_title {
    color: #1c1c21;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 10px;
    padding-right: 10px;
  }
  .right_pic {
    font-size: 13px;
    color: #7f7c94;
    display: flex;
    justify-content: space-between;
  }
}
.buy_con {
  padding: 15px 20px;
  .buy_wrap {
    display: flex;
    justify-content: space-between;
    padding: 1rem 0;
    .buy_wrap_left {
      display: flex;
      flex-direction: column;
      color: #a8a5c4;
      font-size: 12px;
    }
    .left_title {
      color: #4c4b59;
      font-size: 14px;
      margin-bottom: 4px;
    }
    .stint_num {
      text-align: right;
      font-size: 12px;
      color: #fe3f22;
    }
  }
}
.step_bottom {
  padding: 20px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .sum {
    color: #4c4b59;
    font-size: 12px;
    span {
      color: #f6a219;
      font-size: 16px;
    }
  }
}
.submit_btn {
  width: 182px;
  height: 42px;
  line-height: 42px;
  font-size: 14px;
  color: #fff;
  text-align: center;
  background: linear-gradient(90deg, #8542f9 0%, #452dc2 100%);
  box-shadow: 0px 5px 13px 0px rgba(88, 41, 219, 0.42);
  border-radius: 20px;
}
.Timelimit{
  color: #1c1c21;
  font-size: 0.48rem;
}
</style>
