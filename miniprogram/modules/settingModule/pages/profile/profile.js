// pages/profile/profile.js
import { userBehavior } from './behavior'
import { removeStorage, setStorage, getStorage } from '@/utils/storage'
import { reqUploadFile, reqUpdateUserInfo } from '@/api/user'
import { toast } from '@/utils/extendApi'

Page({
  // 注册behaviors
  behaviors: [userBehavior],
  // 页面的初始数据
  data: {
    isShowPopup: false // 控制更新用户昵称的弹框显示与否
  },

  // 更新用户头像
  async chooseAvatar(event) {
    // 获取头像临时路径，临时路径会失效
    // 将临时路径上传到服务器，获取永久路径，使用永久路径更新
    const { avatarUrl } = event.detail
    const res = await reqUploadFile(avatarUrl, 'file')
    this.setData({
      'userInfo.headimgurl': res.data
    })
    // wx.uploadFile({
    //   url: 'https://gmall-prod.atguigu.cn/mall-api/fileUpload', //服务器地址
    //   filePath: avatarUrl, // 文件资源路径
    //   name: 'file', //文件对应的key
    //   header: {
    //     token: getStorage('token')
    //   },
    //   success: (res) => {
    //     const uploadRes = JSON.parse(res.data)
    //     this.setData({
    //       'userInfo.headimgurl': avatarUrl
    //     })
    //   }
    // })
  },

  // 更新用户信息
  async updateUserInfo() {
    const res = await reqUpdateUserInfo(this.data.userInfo)
    if (res.code === 200) {
      //  更新成功，存储到本地，同步store
      // removeStorage('userInfo')
      setStorage('userInfo', this.data.userInfo)
      this.setUserInfo(this.data.userInfo)
      toast({ title: '用户信息更新成功！' })
    }
  },

  // 获取用户昵称
  getNickName(event) {
    const { nickname } = event.detail.value
    this.setData({
      'userInfo.nickname': nickname,
      isShowPopup: false
    })
  },

  // 显示修改昵称弹框
  onUpdateNickName() {
    this.setData({
      isShowPopup: true,
      'userInfo.nickname': this.data.userInfo.nickname
    })
  },

  // 弹框取消按钮
  cancelForm() {
    this.setData({
      isShowPopup: false
    })
  }
})
