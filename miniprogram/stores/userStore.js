// observable创建监测对象，对象中的属性会被转为响应式数据
import { observable, action } from 'mobx-miniprogram'
import { getStorage } from '../utils/storage'

export const userStore = observable({
  // 定义响应式数据
  // 登录令牌token
  token: getStorage('token') || '',
  // 用户信息
  userInfo: getStorage('userInfo') || '',

  // 定义action
  // 更新修改token
  setToken: action(function (token) {
    this.token = token
  }),
  setUserInfo: action(function (userInfo) {
    this.userInfo = userInfo
  })
})
