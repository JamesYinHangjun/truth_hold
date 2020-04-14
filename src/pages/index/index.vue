<template>
  <div>
    <div v-if="showLogin">
      <!-- 登陆弹窗组件 -->
      <LoginWindow @changeShow="getModel(arguments)"></LoginWindow>
    </div>

    <div class="show">
      <div class="button">
        <div class="btn1 right" @click='recall'>撤销</div>
        <div class="btn0" @click='reset'>清零</div>
      </div>

      <div class="mark-text">当前分数</div>
      <div class="mark"> {{ mark }}</div>
    </div>

    <div class="row">
      <div class="button right" @click="addMark(1)">+1</div>
      <div class="button left" @click="addMark(-1)">-1</div>
    </div>

    <div class="row">
      <div class="button right" @click="addMark(5)">+5</div>
      <div class="button left" @click="addMark(-5)">-5</div>
    </div>
  </div>
</template>

<script>
import LoginWindow from '@/components/LoginWindow'
import {showSuccess,showModal,post,get} from "@/util"
export default {
  data () {
    return {
      mark: 0,          // 当前分数
      userinfo: {},     // 保存用户的信息，查看缓存中是否有userinfo
      showLogin: false  // 用来控制登陆弹窗LoginWindow 的显示，默认不显示
    }
  },

  // 每次登陆小程序，会先执行mounted
  mounted() {
    // 获取缓存中userinfo，然后在判断其中是否有openId
    const userinfo = wx.getStorageSync('userinfo')
    // 有openId，表示当前用户已经登陆,就不显示登陆弹窗
    if(userinfo.openId) {
      this.userinfo = userinfo
    } else {
      // 用户没有登陆。显示登陆弹窗,隐藏tabBar
      wx.hideTabBar()
      this.showLogin = true
    }
  },
  onShow() {
    // 每次进入页面都调用  获取当前的分数
    this.getCurrentMark()
  },
  components: {
    LoginWindow
  },
  methods: {
    // 授权登陆成功之后调用,从LoginWindow传过来的
    getModel(val) {
      this.showLogin = val[0]   // 是false
      this.userinfo = val[1]

      // 每次登陆成功之后也会读取当前的分数
      this.getCurrentMark()
    },

    // 加减分数 这里要将获得的分数添加到数据库中保存
    async addMark (add) {
      try {
        const data = {
          openid:this.userinfo.openId,
          add:add                // 指明 点击了哪个按钮
        }
        await post("/weapp/createrecord",data)
        this.mark += add
        console.log("this.mark",this.mark)
      } catch(e) {
        showModal("请求失败","请重试~")
        console.log("从后端返回的执行错误的语句:", e)
      }
    },
    // 从后端读取当前总分
    async getCurrentMark(){
      try {
        const res = await get('/weapp/getmark',{openid:this.userinfo.openId})
        console.log("从后端传递过来的信息",res)
        this.mark = res.mark
      }catch(e) {
        showModal("请求失败","请重试~")
        console.log("从后端返回的执行错误的语句:", e)
      }
    },

    // 点击清零，弹出提示框
    reset () {
      var that = this
      wx.showModal({
        content: `确定要清零吗？`,
        success: function (res) {
          if (res.confirm) {        // 用户点击确认
            that.resetMark()
          }
        }
      })
    },
    // 点击清零
    async resetMark() {
      if(this.mark !== 0) {
        // 如果当前总分不为0，继续往下执行
        // try...catch抓取后端传回的错误
        try {
          // 请求后端，通过'/weapp/resetmark'链接，找到server/controllers/resetmark.js文件
          const res = await post('/weapp/resetmark', {openid: this.userinfo.openId})
          console.log('从后端返回的执行正确的信息是：', res)
          // 将当前页面显示的总分改为0
          this.mark = 0
        } catch (e) {
          showModal('失败', '请重试哦~')
          console.log('从后端返回的执行错误的信息是：', e)
        }
      }
    },

    // 点击撤销
    async recall () {
      try {
        const res = await post('/weapp/deleterecord', {openid: this.userinfo.openId})
        console.log('从后端返回的执行正确的信息是：', res)
        this.mark = res.mark
        // 调用工具函数showSuccess方法
        showSuccess('撤销成功')
      } catch (e) {
        showModal('失败', e.data.msg)
        console.log('从后端返回的执行错误的信息是：', e)
      }
    }
  },

  // 下拉刷新 获取当前分数
  onPullDownRefresh() {
    console.log("下拉刷新")
    this.getCurrentMark()
    wx.stopPullDownRefresh()
  },
  // 分享 点击右上角的三个点 分享
  onShareAppMessage() {
     return {
      title: '真自律',
      path: '/pages/index/main'
    }
  }
}
</script>

<style lang='scss'>
.show{
  text-align:center;
  height:266px;
  background: #EA5149;
  margin-bottom:5px;
  color: #FFFFFF;
  font-weight:bold;
  .mark-text{
    font-size: 20px;
    padding:28px;
  }
  .mark{
    font-size: 88px;
  }
  // 清零
  .button{
    margin:0 10px;
    height: 30px;
    line-height:30px;
    text-align:center;
    font-size: 15px;
    font-weight:bold;
    background:#EA5149;
    .btn0{
      width: 60px;
      border-radius: 15px;
      border:1px dashed #feb600;
    }
    .btn1{
      width: 60px;
      border-radius: 15px;
      border:1px dashed #feb600;
    }
  }
}
.row{
  margin: 40px 56px;
  .button{
    width: 70px;
    height: 70px;
    line-height:70px;
    border-radius: 20%;
    border: none;
    text-align:center;
    font-size: 25px;
    color:#FFFFFF;
    font-weight:bold;
  }
}
.right{
  background:#EA5149;
  float: right;
}
.left{
  background:#feb600;
  margin-right:80px;
}
</style>


