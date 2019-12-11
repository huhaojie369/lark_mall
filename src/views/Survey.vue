<template>
  <div class="survey_con">
    <div class="survey_header">
      <h2 class="survey_title">Lark Wallet 问卷调查</h2>
      <p>为了更好的服务Lark 用户，希望您根据个人实际感受认真作答，衷心感谢您的合作与支持</p>
    </div>
    <div class="survey_item" v-for="(item, index) in Sdata" :key="index">
      <div class="item_title"> 
        <template v-if="index < 9">
         0{{ index + 1 }} 
        </template>
        <template v-else>
          {{ index + 1 }} 
        </template>
        {{ item.question }}
      </div>
      <!-- 单选 -->
      <template v-if="item.multiple == 1">
        <van-radio-group v-model="item.choices[0]">
          <van-cell-group>
            <van-cell
                v-for="(key, ops) in item.options"
                :key="ops">
              <van-radio  :name="ops" checked-color="#5829db">
                {{ ops }}、 {{ key }}
              </van-radio>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </template>
      <!-- 多选 -->
      <template v-if="item.multiple > 1" >
        <van-checkbox-group v-model="item.choices[0]" :max="item.multiple">
          <van-cell-group>  
            <van-cell 
              v-for="(checkboxs, keys) in item.options" 
              :key="keys">
              <van-checkbox 
                :name ="keys"
                checked-color="#5829db">
                {{ keys }}、 {{ checkboxs }}
              </van-checkbox>
            </van-cell>
          </van-cell-group>
        </van-checkbox-group>
      </template>
      <!-- 文本意见 -->
      <template  v-if="item.multiple === 0">
        <van-cell-group>
          <van-field
            v-model="item.choices"
            rows="2"
            autosize
            type="textarea"
            maxlength="100"
            placeholder="请输入留言"
            show-word-limit
          />
        </van-cell-group>
      </template>
    </div>
    <van-button size="large" color="#5829db" @click="submitSurvey">提交</van-button>
  </div>
</template>

<script>
import { Cell, CellGroup, Field, Radio, RadioGroup, Button, Checkbox, CheckboxGroup } from "vant";

export default {
  components: {
    [Cell.name]: Cell,
    [Radio.name]: Radio,
    [Field.name]: Field,
    [Button.name]: Button,
    [Checkbox.name]: Checkbox,
    [CellGroup.name]: CellGroup,
    [RadioGroup.name]: RadioGroup,
    [CheckboxGroup.name]: CheckboxGroup,
  },
  data() {
    return {
      checked: [], 
      Sdata: [], // 问卷列表
      answers: [], // 提交数据
      issubmit: false,
    };
  },
  methods: {
    // 获取问卷
    getQuestionnaires() {
      this.axios.get('/questionnaires').then((res)=>{
        if(res.status === 200){
          this.Sdata = res.data.data.map(x =>{
            if(x.multiple === 0) return { ...x , choices:''} // 0 是字符串
            return { ...x,  choices:[]} // 往数据中添加一个字段，用于区别每一项
          })
        }
      })
    },
    // 提交
    submitSurvey(){
      // 同步选项数据
      this.answers = this.Sdata.map(x=>{
        if(x.multiple > 1) return { id: x.id, choices: x.choices[0] }

        return { id: x.id, choices: x.choices }
      })
      // 循环判断是否为空 
      this.Sdata.forEach(im =>{ 
        if(im.choices === "" && im.choices.length === 0){
          this.$toast('请完整填写后提交');
          this.issubmit = false
        }else{
          this.issubmit = true
        }
      });
      // 为真时提交
      if(this.issubmit){
        this.axios.post('/questionnaires',{ answers: this.answers } ).then(res=>{
          if(res.status === 200 ) {
            this.$toast.success('提交成功');
            setTimeout(()=>{
              this.sendPraRequest("closeMall") // 关闭商城
            },1500)
          }
        }).catch(err=>{
          return this.$toast(err.response.data.msg);
        })
      }

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
  mounted () {
    this.getQuestionnaires()
    window.addEventListener('message', function(event) {
      if (event.data && event.data.type == 'callback') {
        var name = event.data.name;
        window[name](event.data.msg)
      }
    }, false);
  },

};
</script>

<style lang="less" scoped>
.survey_header{
  margin-bottom: 1.5rem;
}
.survey_con {
  padding: 1.2rem 0.6rem;
  p {
    font-size: 0.48rem;
    color: #4c4b59;
    line-height: 0.88rem;
  }
}
.survey_title {
  font-size: 0.64rem;
  margin-bottom: 0.8rem;
}
.survey_item {
  margin: 0.6rem 0;
  font-size: 0.6rem;
  .item_title {
    padding-bottom: 0.3rem;
    margin-bottom: 0.4rem;
  }
  .van-radio, .van-checkbox {
    padding: 0.4rem 0;
  }
}
</style>