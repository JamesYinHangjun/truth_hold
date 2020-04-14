<template>
  <div>
    <div class="contain">
      <div class="row">
        <label class="name">意见反馈</label>
      </div>

      <div class="row text">
        <div>
          <textarea v-model="opinion" class="input" maxlength="200" placeholder="点击这里输入您的建议~"></textarea>
          <label class="word-count">{{word_count}}/200</label>
        </div>
      </div>

      <!-- 上传图片 -->
      <div class="row">
        <div>
          <label class="name">相关截图 (选填) </label>
          <label class="img-count">{{img_count}}/2</label>
        </div>
        <label v-for="(item,index) in src" :key="index">
          <img :src="item" class="img">
        </label>

        <!-- 添加图片部分 -->
        <!-- 当图片数量是2时，那个+图片消失 -->
        <label v-if="img_count<2" @click="uploadImage">
          <img class="add-img" src="../../../static/images/addimage.png" alt="">
        </label>
      </div>

      <div class="row">
        <div class="name">
          微信号(选填)
        </div>
        <input v-model="wechat" maxlength="20"
              placeholder="如果想详细交流，点击这里留下微信号哦~" class="wechat-input">
      </div>
    </div>

    <!-- 点击提交按钮，将opinion之中的数据插入到数据库中 -->
    <button @click="submit">提交</button>
  </div>
</template>

<script>
import {post,showModal} from '@/util'
export default {
  name: "Opioion",
  data() {
    return {
      opinion: "",     // 用来记录用户的反馈
      word_count: 0,    // 用来记录用户反馈的字数
      src: [],          // 存放添加的图片
      img_count: 0,     // 上传的图片的数量
      wechat: ""       // 存放用户的微信号码(用于联系用的)
    }
  },

  // 监听输入的字数
  watch: {
    // 监听opinion,得到用户输入的反馈opinion的长度赋值给word_count
    opinion() {
      this.word_count = this.opinion.length
    },
    // 监听上传的图片的数量
    src() {
      this.img_count = this.src.length
    }
  },
  methods: {
    // 上传图片   使用微信的chooseImage方法
    uploadImage() {
      let that = this
      wx.chooseImage({
        count: 2,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success (res) {
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths
          that.src.push(tempFilePaths)
          console.log(that.src)
        }
      })
    },

    // 点击提交按钮,请求后端数据
    async submit() {
      // 反馈建议不能为空
      if(this.word_count > 0) {
        const data = {
          opinion:this.opinion,
          src:this.src.join(','),     // 因为mysql中没有数组的形式
          wechat:this.wechat,
          openid:wx.getStorageSync('userinfo').openId    // 谁传递的
        }

        try{
          const res = await post('/weapp/createopinion',data)
          console.log("从后端返回执行正确的信息:", res)
          showModal('提交成功',"已经将您的反馈提交给开发者~")
        }catch(e) {
          console.log("从后端返回执行错误的信息:",e)
          showModal("提交失败","服务器出了一点问题，请稍后重试~")
        }
      } else {
        // console.log("提交失败")
        showModal("提交失败","反馈信息不能为空")
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.contain{
  background:#FFFFFF;
  font-size:15px;
  .text {
    height: 110px;
  }
  .row{
    border-bottom: 1px #E8E8E8 solid;
    padding: 5px 15px;
    .name {
      width:80%;
      height: 40px;
      line-height: 40px;
    }
    .input {
      width:100%;
      height:85px;
      font-size:14px;
      padding-top:5px;
    }
    .word-count {
      float:right;
      color: #808080;
    }
    .img-count {
      float:right;
      line-height: 40px;
      color: #808080;
    }
    .add-img {
      width:80px;
      height:80px;
    }
    .img {
      width:66px;
      height:66px;
      margin-bottom:7px;
      margin-right: 10px;
    }
    .wechat-input{
      font-size:14px;
    }
  }
}
button {
  margin:20px auto;
  width:90%;
  border-radius: 5px;
  background:#EA5149;
  font-size:16px;
  color:#FFFFFF;
  font-weight:bold;
}
</style>
