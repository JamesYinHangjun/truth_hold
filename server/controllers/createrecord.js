// knex操作数据库
const {mysql} = require('../qcloud')

module.exports = async(ctx) => {
  // 这个add表示是 点击的哪个按钮
  const {openid,add} = ctx.request.body

  try {
      // 必须等到数据库操作完成之后才能继续往下执行
      // 查找用户的最后一条记录，得到分数
    const res = await mysql('records').where('openid',openid).select('mark').orderBy('id','desc').first()


    if(res) {
      // 查到最后一条语句，将分数直接赋给当前的mark
      var mark = res.mark
    }else {
      // 没有查到，即没有任何记录，当前分数就是0
      var mark = 0
    }
    mark += add
    console.log("当前分数",mark)

    await mysql('records').insert({
      openid,add,mark
    })

    // 返回给前端的
    ctx.state.data = {
      code: 0,
      msg: "success"
    }
    console.log('执行成功')
  } catch(e) {
    ctx.state.data = {
      code: -1,
      data: {
        msg: '最后一条添加失败' + e.sqlMessage
      }
    }
    console.log("执行错误",e)
  }
}
