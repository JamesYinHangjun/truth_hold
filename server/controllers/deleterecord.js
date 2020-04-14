const {mysql} = require('../qcloud')

module.exports = async (ctx) => {
  const {openid} = ctx.request.body
  try{
    // 查找该用户的最后一条记录数据
    const res = await mysql('records')
        .where("openid",openid)
        .orderBy('id','desc').first()

    // 如果表中有数据
    if(res){
      await mysql('records')
        .where("id",res.id).del()

      // 删除掉最后一条数据后，再获得最后一条数据
      const re_res = await mysql('records')
          .where("openid",openid)
          .orderBy('id','desc').first()

      // 删除了一条数据后，还有数据
      if(re_res){
        var mark = re_res.mark
      }else{
        var mark = 0
      }
    }else{
      var mark = 0
    }

    // 传回前端
    ctx.state.data = {
      code: 0,
      mark:mark,
      msg: 'success'
    }
    console.log("执行成功")
  }catch(e){
    console.log("执行错误:",e)
    // 执行失败返回的数据
    ctx.state = {
      code: -1,
      data: {
        msg: '撤销失败' + e.sqlMessage
      }
    }
  }
}
