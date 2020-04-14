<template>
  <div>
    <div v-if="show_record">
      <div class="prompt">还没有任何记录~</div>
    </div>
    <!-- 有记录数据 -->
    <div v-else>
      <div class="table th">
        <div class="date">时间</div>
        <div class="busi">分数</div>
        <div class="mark">最后得分</div>
        <div class="net">备注</div>
      </div>

      <!-- 每一条记录 -->
      <!-- 将每次循环得到的record传递到子组件RecordList中 -->
      <RecordList v-for="(record,index) in records" :key="index" :record="record"></RecordList>

      <p class="text-footer" v-if="!more">没有更多数据了</p>
      <p class="text-footer" v-else>加载中...</p>
    </div>
  </div>
</template>

<script>
import {get} from "@/util"
import RecordList from "@/components/RecordList"
export default {
  data() {
    return {
      userinfo:{},
      show_record:false,    // 控制现在是否有记录
      records:[],            // 存放从数据库中获取到的记录数据
      page: 0,              // 表示当前的页数
      more: true            // 表示是否有更多的数据
    }
  },
  components: {
    RecordList
  },
  methods: {
    async getRecords(init) {
      wx.showToast({
        title: '加载中',
        icon: 'loading'
      })

      if(init) {
        this.page = 0
        this.more = true
      }
      if(this.page === 0) {
        this.records = []
      }

      try {
        const data = {
          openid:this.userinfo.openId,
          page: this.page
        }

        const res = await get("/weapp/getrecords",data)
        console.log("从后端传递过来的信息:",res)
        this.records = res.records.concat(res.records)
        // 表示最后一页了
        if(res.records.length < 15 && this.page > 0) {
          this.more = false
        }

        // 没有任何记录
        if(this.records.length === 0) {
          this.show_record = true
        }else {
          this.show_record = false
        }

      // 隐藏提示框
        wx.hideToast()
      }catch(e) {
        console.log("错误信息:",e)
        wx.hideToast()
      }
    }
  },
  onShow() {
    // 每次切换到记录页面。都会立即获得用户的缓存信息
    const userinfo = wx.getStorageSync('userinfo')
    if(userinfo.openId) {
      this.userinfo = userinfo
      console.log("用户信息:",this.userinfo)
    }

    this.getRecords(true)
  },
  onShareAppMessage() {
    return {
      title: "真自律",
      path:"/pages/index/main"
    }
  },
  // 到页面底部会触发
  onReachBottom() {
    if(!this.more) {
      return
    }
    this.page++
    console.log("当前在第" + this.page)
    this.getRecords()
  },
  // 下拉刷新
  onPullDownRefresh(){
    this.getRecords(true)
    wx.stopPullDownRefresh()
  }
}
</script>

<style lang='scss' scoped>
.add{
	margin-top: 20px;
	margin-bottom: 10px;
	text-align:center;
  p{
  	font-size: 15px;
  }
}
.th {
  width: 100%;
  height: 30px;
  line-height:30px;
  background: #EA5149;
  color: #FFFFFF;
  font-size: 16px;
  font-weight: bold;
  display: flex;
}
.date{
  width: 23%;
  padding-left: 60px;
}
.busi{
  width: 10%;
  margin-left: 5px;
}
.mark{
	width: 20%;
  margin-left: 10px;
}
.net{
	width: 20%;
  margin-left: 20px;
}
.text-footer{
  text-align: center;
  font-size: 12px;
  margin-bottom:5px;
  padding-top: 5px;
}
</style>
