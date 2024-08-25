import http from '@/utils/http'

/**
 * @description 加入购物车
 * @param {*} data
 * @returns Promise
 */
export const reqAddCart = ({ goodsId, count, ...data }) => {
  return http.get(`/cart/addToCart/${goodsId}/${count}`, data)
}

/**
 * @description 获取购物车列表数据
 * @returns Promise
 */
export const reqCartList = () => {
  return http.get('/cart/getCartList')
}
/**
 * @description 更新商品的选中状态
 * @param {*} goodsId 商品 id
 * @param {*} isChecked 商品的选中状态
 * @returns Promise
 */
export const reqUpdateChecked = (goodsId, isChecked) => {
  return http.get(`/cart/checkCart/${goodsId}/${isChecked}`)
}
/**
 * @description 全选和全不选
 * @param {*} isChecked 商品的选中状态
 * @returns Promise
 */
export const reqCheckAllCart = (isChecked) => {
  return http.get(`/cart/checkAllCart/${isChecked}`)
}
/**
 * @description 删除购物车商品
 * @param {*} goodsId 商品 id
 * @returns Promise
 */
export const reqDelCart = (goodsId) => {
  return http.get(`/cart/delete/${goodsId}`)
}
