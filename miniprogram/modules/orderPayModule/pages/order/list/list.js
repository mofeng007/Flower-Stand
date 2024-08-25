// pages/order/list/index.js
import { reqOrderList } from '@/modules/orderPayModule/api/orderpay'
import { toast } from '@/utils/extendApi'
Page({
  // 页面的初始数据
  data: {
    orderList: [],
    page: 1,
    limit: 10,
    total: 0,
    isLodaing: false
  },

  async getOrderList() {
    this.data.isLodaing = true
    const { page, limit } = this.data
    const res = await reqOrderList(page, limit)
    this.data.isLodaing = false
    if (res.code === 200) {
      const { records: orderList, total } = res.data
      this.setData({
        orderList: [...this.data.orderList, ...orderList],
        total
      })
    }
  },

  onReachBottom() {
    const { page, total, orderList, isLodaing } = this.data
    if (isLodaing) return
    if (total === orderList.length) {
      toast({ title: '数据加载完毕！' })
      return
    }
    this.setData({
      page: page + 1
    })
    this.getOrderList()
  },

  onPullDownRefresh() {
    this.setData({
      orderList: [],
      page: 1,
      limit: 10,
      total: 0,
      isLodaing: false
    })
    this.getOrderList()
    wx.stopPullDownRefresh()
  },

  onLoad() {
    this.getOrderList()
  }
})
