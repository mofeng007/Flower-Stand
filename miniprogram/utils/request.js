// 通过类的方式封装，复用性、方便添加方法
class WxRequest {
  constructor() {}
  request(options) {
    return new Promise((resolve, reject) => {
      wx.request({
        ...options,
        success: (res) => {
          resolve(res)
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  }
}

const instance = new WxRequest()
export default instance
