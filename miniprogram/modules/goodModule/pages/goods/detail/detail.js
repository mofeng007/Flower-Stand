// pages/goods/detail/index.js
import { reqGoodsInfo } from '@/modules/goodModule/api/goods'
import { userBehavior } from '@/modules/goodModule/behaviors/userBehavior'
import { reqAddCart, reqCartList } from '@/api/cart'
import { toast } from '@/utils/extendApi'

Page({
  behaviors: [userBehavior],
  // 页面的初始数据
  data: {
    goodsInfo: {}, // 商品详情
    show: false, // 控制加入购物车和立即购买弹框的显示
    count: 1, // 商品购买数量，默认是 1
    blessing: '', // 祝福语
    buyNow: 0, //控制加入购物车还是立即购买 0加 1购
    allCount: '' //商品购买数量
  },

  // 加入购物车
  handleAddcart() {
    this.setData({
      show: true,
      buyNow: 0
    })
  },

  // 立即购买
  handeGotoBuy() {
    this.setData({
      show: true,
      buyNow: 1
    })
  },

  // 点击关闭弹框时触发的回调
  onClose() {
    this.setData({ show: false })
  },

  // 监听是否更改了购买数量
  onChangeGoodsCount(event) {
    this.setData({
      count: Number(event.detail)
    })
  },

  // 获取商品详情数据
  async getGoodsInfo() {
    const { data } = await reqGoodsInfo(this.goodsId)
    this.setData({
      goodsInfo: data
    })
  },

  // 全屏预览图片
  previewImage() {
    wx.previewImage({
      urls: this.data.goodsInfo.detailList
    })
  },

  // 弹窗确定按钮触发事件
  async handlerSubmit() {
    const { token, count, blessing, buyNow } = this.data
    const goodsId = this.goodsId
    if (!token) {
      wx.navigateTo({
        url: '/pages/login/login'
      })
      return
    }
    if (buyNow === 0) {
      const res = await reqAddCart({ goodsId, count, blessing })
      if (res.code === 200) {
        toast({ title: '加入购物车成功！', icon: 'success' })
        // 加入成功后重新计算数量
        this.getCartCount()
        this.setData({
          show: false
        })
      }
    } else {
      wx.navigateTo({
        url: `/modules/orderPayModule/pages/order/detail/detail?goodsId=${goodsId}&blessing=${blessing}`
      })
    }
  },

  // 计算购物车商品数量
  async getCartCount() {
    // 判断是否登录
    if (!this.data.token) return
    const res = await reqCartList()
    if (res.data.length !== 0) {
      let allCount = 0
      res.data.forEach((item) => {
        allCount += item.count
      })
      this.setData({
        allCount: (allCount > 99 ? '99+' : allCount) + ''
      })
    }
  },

  onLoad(options) {
    // 挂载商品id
    this.goodsId = options.goodsId
    this.getGoodsInfo()
    this.getCartCount()
  },

  // 转发功能
  onShareAppMessage() {
    return {
      title: '所有的怦然心动，都是你',
      path: '/pages/index/index',
      imageUrl: '../../../../../assets/images/love.jpg'
    }
  },
  // 分享到朋友圈
  onShareTimeline() {}
})
