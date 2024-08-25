import http from '@/utils/http'

/**
 * @description 获取订单详情
 * @returns Promise
 */
export const reqOrderInfo = () => {
  return http.get('/order/trade')
}

/**
 * @description 获取订单收货地址
 * @returns Promise
 */
export const reqOrderAddress = () => {
  return http.get('/userAddress/getOrderAddress')
}

/**
 * @description 获取立即购买商品的详情信息
 * @param { Object } params { goodsId: 商品 Id,  blessing：祝福语 }
 * @returns Promise
 */
export const reqBuyNowGoods = ({ goodsId, ...data }) => {
  return http.get(`/order/buy/${goodsId}`, data)
}

/**
 * @description 提交订单
 * @returns Promise
 */
export const reqSubmitOrder = (data) => {
  return http.post('/order/submitOrder', data)
}

/**
 * @description 获取微信预支付信息
 * @param {*} orderNo 订单 ID
 * @returns Promise
 */
export const reqPreBuyInfo = (orderNo) => {
  return http.get(`/webChat/createJsapi/${orderNo}`)
}

/**
 * @description 微信支付状态查询
 * @param {*} orderNo
 * @returns Promise
 */
export const reqPayStatus = (orderNo) => {
  return http.get(`/webChat/queryPayStatus/${orderNo}`)
}

/**
 * @description 获取订单列表
 * @param {*} page 页码
 * @param {*} limit 每页展示的条数
 * @returns Promise
 */
export const reqOrderList = (page, limit) => {
  return http.get(`/order/order/${page}/${limit}`)
}
