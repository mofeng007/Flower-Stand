import http from '../utils/http'

// 通过并发请求来获取页面数据，提升渲染速度
export const reqIndexData = () => {
  return Promise.all([
    http.get('/index/findBanner'),
    http.get('/index/findCategory1'),
    http.get('/index/advertisement'),
    http.get('/index/findListGoods'),
    http.get('/index/findRecommendGoods')
  ])
}
