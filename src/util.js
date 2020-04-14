import config from './config'

// 消息提示框
export function showSuccess (text) {
  // wx.showToast是小程序现成的API，其中title是提示的内容,icon是显示的图标
  wx.showToast({
    title: text,
    icon: 'success',
    duration: 2000
  })
}

export function showModal (title, content) {
  wx.showModal({
    title,
    content,
    showCancel: false  // 不显示取消按钮
  })
}

// 封装请求
function request(url,method,data) {
  return new Promise((resolve,reject) => {
    wx.request({
      url: config.host + url,
      data: data,
      header: {'content-type':'application/json'},
      method: method,
      dataType: 'json',
      responseType: 'text',
      success: (result)=>{
        console.log("请求成功,前端打印的消息:", result)
        if(result.data.code === 0) {
          // pending 变成 resolved
          resolve(result.data.data)
        } else {
          // pending 变成 rejected 调用失败
          reject(result.data)
        }
      }
    })
  })
}

// get工具函数
export function get (url, data) {
  // 返回的是一个Promise对象
  return request(url, 'GET', data)
}

// post工具函数
export function post (url, data) {
  // 返回的是一个Promise对象
  return request(url, 'POST', data)
}
