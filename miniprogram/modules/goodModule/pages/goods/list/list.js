// pages/goods/list/index.js
import { reqGoodsList } from '@/modules/goodModule/api/goods'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [], // 商品列表数据
    isFinish: false, // 判断数据是否加载完毕,控制页面文字提示显示效果
    total: 0, //数据总条数
    isLoading: false, // 判断数据是否加载完毕,控制节流阀
    // 商品列表请求参数
    requestData: {
      page: 1, //页码
      limit: 10, //每页请求条数
      category1Id: '', //一级分类id
      category2Id: '' //二级分类
    }
  },

  // 获取商品列表
  async getGoodsList() {
    // 表示正在上传数据
    this.data.isLoading = true
    const { data } = await reqGoodsList(this.data.requestData)
    // 表示数据上传结束
    this.data.isLoading = false
    this.setData({
      goodsList: [...this.data.goodsList, ...data.records],
      total: data.total
    })
  },

  onLoad(options) {
    // 合并对象，后往前合并
    Object.assign(this.data.requestData, options)
    this.getGoodsList()
  },

  // 监听页面上拉操作
  onReachBottom() {
    const { goodsList, total, requestData, isLoading } = this.data
    // 解构page
    const { page } = requestData
    // 判断isLoading状态
    if (isLoading) return
    // goodlist长度与total对比
    if (goodsList.length === total) {
      this.setData({
        isFinish: true
      })
      return
    }
    // 页码加一
    this.setData({
      requestData: { ...this.data.requestData, page: page + 1 }
    })
    this.getGoodsList()
  },

  // 监听页面下拉操作
  onPullDownRefresh() {
    this.setData({
      goodsList: [],
      total: 0,
      isFinish: false,
      requestData: { ...this.data.requestData, page: 1 }
    })
    this.getGoodsList()
    // 关闭下拉刷新
    wx.stopPullDownRefresh()
  },
  // 转发功能
  onShareAppMessage() {},
  // 分享到朋友圈
  onShareTimeline() {}
})
