// knex操作数据库
const {mysql} = require('../qcloud')

module.exports = async(ctx) => {
  const {id,note} = ctx.request.body

  try {
      // 必须等到数据库操作完成之后才能继续往下执行
    await mysql('records').where("id",id).update('note',note)

    // 获取到数据后，向前端传递
    ctx.state.data = {
      code: 0,
      msg: "success"
    }

    console.log("执行成功")
  } catch(e) {
    ctx.state= {
      code: -1,
      data: {
        msg: '修改失败' + e.sqlMessage
      }
    }
    console.log("执行错误")
  }
}
