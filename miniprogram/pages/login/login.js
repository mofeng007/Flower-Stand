// pages/login/login.js
import { toast } from '../../utils/extendApi'
// 接口api
import { reqLogin, reqUserInfo } from '../../api/user.js'
// 导入本地存储api
import { setStorage } from '../../utils/storage'
//导入方法
import { ComponentWithStore } from 'mobx-miniprogram-bindings'
// 导入store对象
import { userStore } from '../../stores/userStore'
// 导入防抖函数
import { debounce } from 'miniprogram-licia'

ComponentWithStore({
  //页面和store对象建立关联
  storeBindings: {
    store: userStore,
    fields: ['token', 'userInfo'],
    actions: ['setToken', 'setUserInfo']
  },

  methods: {
    // 授权登录
    login: debounce(function () {
      // 获取用户登录的临时登录凭证code
      wx.login({
        success: async ({ code }) => {
          if (code) {
            // 获取后传递给开发者服务器
            const { data } = await reqLogin(code)
            // 成功后将服务器响应的自定义登录态存储到本地
            setStorage('token', data.token)
            // 将自定义登录态存储到store对象
            this.setToken(data.token)
            // 获取用户信息
            this.getUserInfo()
            // 返回上一级页面
            wx.navigateBack()
          } else {
            toast({ title: '授权失败！请重新授权！' })
          }
        }
      })
    }, 500),

    // 获取用户信息
    async getUserInfo() {
      const { data } = await reqUserInfo()
      setStorage('userInfo', data)
      this.setUserInfo(data)
    }
  }
})
