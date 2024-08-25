import { reqCategoryData } from '../../api/category'

Page({
  data: {
    // 左侧一级分类
    categoryList: [],
    // 左侧选中索引
    activeIndex: 0
  },
  // 一级分类切换效果
  updateActive(event) {
    const { index } = event.currentTarget.dataset
    this.setData({
      activeIndex: index
    })
  },

  // 获取商品分类数据
  async getCategoryData() {
    const res = await reqCategoryData()
    this.setData({
      categoryList: res.data
    })
  },

  onLoad() {
    this.getCategoryData()
  }
})
