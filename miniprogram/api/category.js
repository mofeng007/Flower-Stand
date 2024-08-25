import http from '../utils/http'

// 获取商品分类数据
export const reqCategoryData = () => {
  return http.get('/index/findCategoryTree')
}
