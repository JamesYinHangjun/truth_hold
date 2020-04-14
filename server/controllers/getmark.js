// knex操作数据库
const {mysql} = require('../qcloud')

module.exports = async(ctx) => {
  const {openid} = ctx.request.query

  try {
      // 必须等到数据库操作完成之后才能继续往下执行
    const res = await mysql('records').where('openid',openid).select('mark').orderBy('id','desc').first()

    if(res) {
      var mark = res.mark
    }else {
      var mark = 0
    }

    console.log("当前分数",mark)

    // 返回前端
    ctx.state.data = {
      code: 0,
      msg: "success",
      mark:mark
    }
    console.log('执行成功')
  } catch(e) {
    ctx.state.data = {
      code: -1,
      data: {
        msg: '获取分数添加失败' + e.sqlMessage
      }
    }
    console.log("执行错误",e)
  }
}
