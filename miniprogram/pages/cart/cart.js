// pages/cart/component/cart.js
import { ComponentWithStore } from 'mobx-miniprogram-bindings'
import { userStore } from '@/stores/userStore'
import {
  reqCartList,
  reqUpdateChecked,
  reqCheckAllCart,
  reqAddCart,
  reqDelCart
} from '@/api/cart'
import { debounce } from 'miniprogram-licia'
import { swiperCellBehavior } from '@/behaviors/swiperCell'
import { modal, toast } from '@/utils/extendApi'
const computedBehavior = require('miniprogram-computed').behavior

ComponentWithStore({
  behaviors: [computedBehavior, swiperCellBehavior],
  storeBindings: {
    store: userStore,
    fields: ['token']
  },
  // 组件的属性列表
  properties: {},

  // 组件的初始数据
  data: {
    cartList: [],
    emptyDes: '还没有添加商品，快去添加吧～'
  },
  computed: {
    // 判断是否全选
    selectAllStatus(data) {
      return (
        data.cartList.length !== 0 && data.cartList.every((item) => item.isChecked === 1)
      )
    },
    // 计算订单总金额
    totalPrice(data) {
      let totalPrice = 0
      data.cartList.forEach((item) => {
        if (item.isChecked === 1) {
          totalPrice += item.count * item.price
        }
      })
      return totalPrice
    }
  },

  // 组件的方法列表
  methods: {
    // 展示文案同时获取购物车列表数据
    async showTipGetList() {
      const { token } = this.data

      if (!token) {
        this.setData({
          emptyDes: '您尚未登录，点击登录获取更多权益！',
          cartList: []
        })
        return
      } else {
        const { code, data: cartList } = await reqCartList()
        if (code === 200) {
          this.setData({
            cartList,
            emptyDes: cartList.length === 0 && '还没有添加商品，快去添加吧～'
          })
        }
      }
    },

    // 更新商品购买状态
    async updateChecked(event) {
      const { detail } = event
      const { id, index } = event.currentTarget.dataset
      const isChecked = detail ? 1 : 0
      const res = await reqUpdateChecked(id, isChecked)
      if (res.code === 200) {
        // 方法一：服务器获取最新状态
        // this.showTipGetList()
        // 方法二：更新data中的数据
        this.setData({
          [`cartList[${index}].isChecked`]: isChecked
        })
      }
    },

    // 全选按钮
    async selectAllStatus(event) {
      const { detail } = event
      const isChecked = detail ? 1 : 0
      const res = await reqCheckAllCart(isChecked)
      if (res.code === 200) {
        const newCartList = JSON.parse(JSON.stringify(this.data.cartList))
        newCartList.forEach((item) => {
          item.isChecked = isChecked
        })
        this.setData({
          cartList: newCartList
        })
      }
    },

    // 更新购买数量
    changeBuyNum: debounce(async function (event) {
      const newBuyNum = event.detail > 200 ? 200 : event.detail
      const { id, index, oldbuynum } = event.target.dataset
      const reg = /^([1-9]|[1-9]\d|1\d{2}|200)$/
      const regRes = reg.test(newBuyNum)
      if (!regRes) {
        this.setData({
          [`cartList[${index}].count`]: oldbuynum
        })
        return
      }
      const disCount = newBuyNum - oldbuynum
      if (disCount === 0) return
      const res = await reqAddCart({ goodsId: id, count: disCount })
      if (res.code === 200) {
        this.setData({
          [`cartList[${index}].count`]: newBuyNum,
          [`cartList[${index}].isChecked`]: 1
        })
      }
    }, 250),

    // 删除购物车中的商品
    async delCartGoods(event) {
      const { id } = event.currentTarget.dataset
      const modalRes = await modal({ content: '您确认删除吗？' })
      if (modalRes) {
        await reqDelCart(id)
        this.showTipGetList()
      }
    },

    // 去结算
    toOrder() {
      if (this.data.totalPrice === 0) {
        toast({ title: '请选择要购买的商品！', icon: 'error' })
        return
      }
      wx.navigateTo({
        url: '/modules/orderPayModule/pages/order/detail/detail'
      })
    },

    onShow() {
      this.showTipGetList()
    },

    onHide() {
      // 切换页面时弹回删除滑块
      this.onSwiperCellClose()
    }
  }
})
