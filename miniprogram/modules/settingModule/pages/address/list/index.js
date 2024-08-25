// pages/address/list/index.js
import { reqAddressList, reqDelAddress } from '@/modules/settingModule/api/address'
import { toast, modal } from '@/utils/extendApi'
import { swiperCellBehavior } from '@/behaviors/swiperCell'
// 获取应用实例
const app = getApp()
Page({
  behaviors: [swiperCellBehavior],
  // 页面的初始数据
  data: {
    addressList: []
  },

  // 去编辑页面
  toEdit(event) {
    const { id } = event.currentTarget.dataset
    wx.navigateTo({
      url: `/modules/settingModule/pages/address/add/index?id=${id}`
    })
  },

  // 获取收货地址列表数据
  async getAddressList() {
    const { data: addressList } = await reqAddressList()
    this.setData({
      addressList
    })
  },

  // 删除
  async delAddress(event) {
    const { id } = event.currentTarget.dataset
    const modalRes = await modal({ title: '请确认删除该地址！' })
    if (modalRes) {
      await reqDelAddress(id)
      toast({ title: '地址删除成功！', icon: 'success' })
      this.getAddressList()
    }
  },

  //切换收货地址
  changeAddress(event) {
    if (this.flag !== '1') return
    const addressId = event.currentTarget.dataset.id
    const selectAddress = this.data.addressList.find((item) => item.id === addressId)
    if (selectAddress) {
      app.globalData.address = selectAddress
      wx.navigateBack()
    }
  },

  onShow() {
    this.getAddressList()
  },

  onLoad(options) {
    // 接受传递参数，挂载到实例上
    this.flag = options.flag
  }
})
