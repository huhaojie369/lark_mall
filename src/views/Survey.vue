<template>
  <div class="survey_con">
    <div class="survey_header">
      <h2 class="survey_title">Lark Wallet 问卷调查</h2>
      <p>您好，为了更好的服务Lark 用户的使用体验，丰富产品内容，我们策划了本次问卷调查，由衷的希望您根据个人实际感受认真作答哦，您的意见将会对我们的产品有很大的帮助，衷心感谢您的合作与支持</p>
    </div>
    <div class="survey_item" v-for="(item, index) in resdata" :key="index">
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
        <van-radio-group v-model="item.times">
          <van-cell-group>
            <van-cell
                v-for="(key, ops) in item.options"
                :key="ops"  
                clickable 
                @click="radioClick(item.id,ops)" >
              <van-radio  :name="key" checked-color="#5829db">
                {{ ops }}、 {{ key }}
              </van-radio>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </template>
      <!-- 多选 -->
      <template v-if="item.multiple > 1" >
        <van-checkbox-group v-model="checked" @change="singleChecked(item.id)">
          <van-cell-group>  
            <van-cell 
              v-for="(keys, checkboxs) in item.options" 
              :key="keys">
              <van-checkbox 
                :name ="checkboxs"
                checked-color="#5829db">
                {{ checkboxs }}、 {{ keys }}
              </van-checkbox>
            </van-cell>
          </van-cell-group>
        </van-checkbox-group>
      </template>
      <!-- 文本意见 -->
      <template  v-if="item.multiple === 0">
        <van-cell-group>
          <van-field
            v-model="message"
            rows="2"
            autosize
            type="textarea"
            maxlength="100"
            placeholder="请输入留言"
            show-word-limit
            @blur="submsg(item.id)"
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
      message: '',
      radioss: [],
      checked: [], 
      resdata: [], // 问卷列表
      answers: [], // 提交数据
      issubmit: false,
    };
  },
  methods: {
    radioClick(id,ops) {
      this.answers.filter(im => { if(im.id === id ) return im.choices = [ops] })
    },
    singleChecked(checkedID) {
      this.answers.filter(im => { if(im.id === checkedID ) return im.choices = this.checked })
    },
    // 获取问卷
    getQuestionnaires() {
      this.axios.get('/questionnaires').then((res)=>{
        if(res.status === 200){
          this.resdata = res.data.data.map(x =>{
            return { ...x, times: new Date().getTime()} // 往数据中添加一个字段，用于区别每一项
          })
          // 动态初始化一个提交表单数组
          this.answers = res.data.data.map(s =>{
            if(s.multiple === 0) return { id: s.id , choices:''} // 0 是字符串
            return { id: s.id , choices:[]} // 其他是数组
          })
        }
      })
    },
    // 同步问卷意见
    submsg(ID) {
      this.answers.filter(im => { if(im.id === ID ) return im.choices = this.message })
    },
    // 提交
    submitSurvey(){

      this.answers.forEach(im =>{ 
        if(im.choices == "" || im.choices.length === 0){
          this.$toast('请完整填写后提交');
          this.issubmit = false
        }else{
          this.issubmit = true
        }
      })

      if(this.issubmit){
        this.axios.post('/questionnaires',{ answers: this.answers } ).then(res=>{
          console.log(res);
          if(res.status === 200 ) {
            this.$toast('提交成功');
            this.$router.go(0);
          }
        })
      }

    }
  },
  mounted () {
    this.getQuestionnaires()
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