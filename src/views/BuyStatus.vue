<template>
  <div class="lark_container">
    <div class="status_wrap">
      <div class="s_top">
        <div class="s_sucess">
          <div class="s_icon sucess">
            <div class="dot1"></div>
            <div class="dot2"></div>
            <div class="add1"></div>
            <div class="add2"></div>
          </div>
          <div class="s_title">兑换成功</div>
          <p>将在3个工作日内为您发货</p>
        </div>
      </div>
      <div class="s_bottom">
        <div class="s_success">
          <router-link class="s_btn now" :to="{name: 'home'}">返回商城</router-link>
          <router-link class="s_btn" :to="{name: 'order'}">查看订单</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    
  }
</script>

<style lang="less" scoped>
.lark_container{
  width: 100%;
  height: 100vh;
  max-width: 750px;
  min-width: 320px;
  margin: 0 auto;
  position: relative;
}

.status_wrap{
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  .s_top{
    margin-bottom: 51px;
    .s_title{
      color: #34333D;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 4px;
    }
    p{
      color: #7F7C94;
      font-size: 12px;
    }
  }
  .s_bottom{
    margin-top: 51px;
    .s_btn{
      display: block;
      width: 490px/2;
      height: 80px/2;
      line-height: 80px/2;
      text-align: center;
      color: #5829DB;
      font-size: 28px/2;
      border-radius: 40px/2;
      border:1px solid rgba(88,41,219,0.4);
      margin-bottom: 20px/2;
      &.now{
        color: #fff;
        background:linear-gradient(90deg,rgba(115,66,249,1) 0%,rgba(69,45,194,1) 100%);
      }
    }
  }
  .s_icon{
    width: 158px/2;
    height: 158px/2;
    margin: 0 auto 38px/2 auto;
    position: relative;
    &.fail{
      background: url(../assets/images/hint_fail.svg) center center no-repeat;
      background-size: 100% 100%;
    }
    &.sucess{
      background: url(../assets/images/hint_sucess.svg) center center no-repeat;
      background-size: 100% 100%;
    }
    .dot1{
      position: absolute;
      left: 0;
      top: -20px/2;
      width: 15px/2;
      height: 15px/2;
      background: url(../assets/images/dot.svg) center center no-repeat;
      background-size: 100%;
      transform: scale(0);
      animation: scale .4s .4s forwards  linear;
    }
    .dot2{
      position: absolute;
      right: -30px/2;
      bottom: 30px/2;
      width: 13px/2;
      height: 13px/2;
      background: url(../assets/images/dot.svg) center center no-repeat;
      background-size: 100%;
      transform: scale(0);
      animation: scale .4s .4s forwards  linear;
    }
    .add1{
      position: absolute;
      left: -40px/2;
      top: 30px/2;
      width: 20px/2;
      height: 20px/2;
      background: url(../assets/images/add.svg) center center no-repeat;
      background-size: 100%;
      transform: scale(0);
      animation: scale .4s .4s forwards  linear;
    }
    .add2{
      position: absolute;
      right: -50px/2;
      top: 40px/2;
      width: 20px/2;
      height: 20px/2;
      background: url(../assets/images/add.svg) center center no-repeat;
      background-size: 100%;
      transform: scale(0);
      animation: scale .4s .4s forwards  linear;
    }
  }
}
@keyframes scale {
  0% {
      transform: scale(0);
  }

  100% {
    transform: scale(1);
  }
}

</style>