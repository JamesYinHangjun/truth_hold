// knex操作数据库
const {mysql} = require('../qcloud')

// ctx包含从前端请求过来的信息
module.exports = async(ctx) => {
  // 1.将前端的消息提交给后端了
  const {opinion,src,wechat,openid} = ctx.request.body
  // console.log("opinion",opinion)

  try {
      // 必须等到数据库操作完成之后才能继续往下执行
    await mysql('opinions').insert({
      opinion,src,wechat,openid
    })

    // 2.获取到数据后，向前端传递
    ctx.state.data = {
      code: 0,
      msg: 'success'
    }

    console.log("执行成功")
  } catch(e) {
    ctx.state = {
      code: -1,
      data: {
        msg: '意见添加失败' + e.sqlMessage
      }
    }
    console.log("执行错误")
  }
}
