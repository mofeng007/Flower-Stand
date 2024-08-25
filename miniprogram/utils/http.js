import WxRequest from 'mina-request'
import { getStorage, clearStorage } from './storage'
import { toast, modal } from './extendApi'
import { env } from './env'

// 实例化
const instance = new WxRequest({
  baseURL: env.baseUrl,
  timeout: 15000
})

// 请求拦截器
instance.interceptors.request = (config) => {
  // 在发送请求之前，需要先判断本地是否存在访问令牌 token
  const token = getStorage('token')
  // 如果存在 token，就需要在请求头中添加 token 字段
  if (token) {
    config.header['token'] = token
  }
  return config
}
// 响应拦截器
instance.interceptors.response = async (response) => {
  const { isSuccess, data } = response
  if (!isSuccess) {
    toast({
      title: '网络异常请重试！',
      icon: 'error'
    })
    return Promise.reject(response)
  }
  switch (data.code) {
    case 200:
      return data
    case 208:
      const res = await modal({
        content: '鉴权失败，请重新登录！',
        showCancel: false
      })
      if (res) {
        clearStorage()

        wx.navigateTo({
          url: '/pages/login/login'
        })
      }
      return Promise.reject(response)

    default:
      toast({
        title: '程序出现异常，请联系客服或稍后重试！'
      })
      return Promise.reject(response)
  }
}

export default instance
