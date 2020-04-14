// knex操作数据库
const {mysql} = require('../qcloud')

module.exports = async(ctx) => {
  const {openid,page} = ctx.request.query

  try {
      // 必须等到数据库操作完成之后才能继续往下执行
    const records = await mysql('records').where("openid",openid)
                          .orderBy("id","desc").limit(15).offset(Number(page)*15) //page 0 1 2..

    // 获取到数据后，向前端传递
    ctx.state.data = {
      records
    }

    console.log("执行成功")
  } catch(e) {
    ctx.state= {
      code: -1,
      data: {
        msg: '添加失败' + e.sqlMessage
      }
    }
    console.log("执行错误")
  }
}
