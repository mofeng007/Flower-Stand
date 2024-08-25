import { reqIndexData } from '../../api/index'
Page({
  data: {
    // 轮播图数据
    bannerList: [],
    // 商品导航数据
    categoryList: [],
    // 活动渲染数据
    activeList: [],
    // 人气推荐
    hotList: [],
    // 猜你喜欢
    guessList: [],
    // 骨架屏显示
    lodaing: true
  },
  // 获取首页数据
  async getIndexData() {
    const res = await reqIndexData()
    this.setData({
      bannerList: res[0].data,
      categoryList: res[1].data,
      activeList: res[2].data,
      guessList: res[3].data,
      hotList: res[4].data,
      lodaing: false
    })
  },

  // 转发功能
  onShareAppMessage() {},
  // 分享到朋友圈
  onShareTimeline() {},

  onLoad() {
    this.getIndexData()
  }
})
