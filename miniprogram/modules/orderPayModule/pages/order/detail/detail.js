import {
  reqOrderAddress,
  reqOrderInfo,
  reqBuyNowGoods,
  reqSubmitOrder,
  reqPreBuyInfo,
  reqPayStatus
} from '@/modules/orderPayModule/api/orderpay'
import { formatTime } from '@/modules/orderPayModule/utils/formatTime'
import Schema from 'async-validator'
import { toast } from '@/utils/extendApi'
import { debounce } from 'miniprogram-licia'
const app = getApp()

Page({
  data: {
    buyName: '', // 订购人姓名
    buyPhone: '', // 订购人手机号
    deliveryDate: '', // 期望送达日期
    blessing: '', // 祝福语
    show: false, // 期望送达日期弹框
    orderAddress: {}, //收货地址
    orderInfo: {}, //订单商品详情
    minDate: new Date().getTime()
  },

  // 选择期望送达日期
  onShowDateTimerPopUp() {
    this.setData({
      show: true
    })
  },

  // 期望送达日期确定按钮
  onConfirmTimerPicker(event) {
    const times = formatTime(new Date(event.detail))
    this.setData({
      show: false,
      deliveryDate: times
    })
  },

  // 期望送达日期取消按钮 以及 关闭弹框时触发
  onCancelTimePicker() {
    this.setData({
      show: false,
      minDate: new Date().getTime(),
      currentDate: new Date().getTime()
    })
  },

  // 跳转到收货地址
  toAddress() {
    wx.navigateTo({
      url: '/modules/settingModule/pages/address/list/index'
    })
  },

  // 获取订单页面收货地址
  async getAddress() {
    // 判断全局共享是否含有数据
    const addressId = app.globalData.address.id
    if (addressId) {
      this.setData({
        orderAddress: app.globalData.address
      })
      return
    }
    const { data: orderAddress } = await reqOrderAddress()
    this.setData({
      orderAddress
    })
  },

  // 获取订单详情数据
  async getOrderIndo() {
    const { goodsId, blessing } = this.data
    const { data: orderInfo } = goodsId
      ? await reqBuyNowGoods({ goodsId, blessing })
      : await reqOrderInfo()
    const orderGoods = orderInfo.cartVoList.find((item) => item.blessing !== '')
    this.setData({
      orderInfo,
      blessing: orderGoods ? orderGoods.blessing : ''
    })
  },

  // 处理提交订单
  submitOrder: debounce(async function () {
    const {
      buyName,
      buyPhone,
      deliveryDate,
      blessing,
      orderAddress,
      orderInfo
    } = this.data

    const params = {
      buyName,
      buyPhone,
      cartList: orderInfo.cartVoList,
      deliveryDate,
      remarks: blessing,
      userAddressId: orderAddress.id
    }
    const { valid } = await this.validatorAddress(params)
    if (!valid) return
    // 创建订单
    const res = await reqSubmitOrder(params)
    // 订单创建成功，挂载订单编号到页面实例上
    if (res.code === 200) {
      this.orderNo = res.data
      // 获取预付单信息，支付参数
      this.advancePay()
    }
  }, 500),

  // 预付单信息
  async advancePay() {
    try {
      const payParams = await reqPreBuyInfo(this.orderNo)
      if (payParams.code === 200) {
        // 发起微信支付
        const payInfo = await wx.requestPayment(payParams.data)
        // 获取支付结果
        if (payInfo.errMsg === 'requestPayment:ok') {
          // 查询支付状态
          const payStatus = await reqPayStatus(this.orderNo)
          if (payStatus.code === 200) {
            wx.redirectTo({
              url: '/modules/orderPayModule/pages/order/list/list',
              success: () => {
                toast({ title: '支付成功！', icon: 'success' })
              }
            })
          }
        }
      }
    } catch (error) {
      toast({ title: '支付失败！', icon: 'error' })
    }
  },

  // 验证订购人地址
  validatorAddress(params) {
    // 规则
    // 验证收货人，是否只包含大小写字母、数字和中文字符
    const nameRegExp = '^[a-zA-Z\\d\\u4e00-\\u9fa5]+$'
    // 验证手机号，是否符合中国大陆手机号码的格式
    const phoneReg = '^1(?:3\\d|4[4-9]|5[0-35-9]|6[67]|7[0-8]|8\\d|9\\d)\\d{8}$'
    const rules = {
      userAddressId: {
        required: true,
        message: '请选择收货地址！'
      },
      buyName: [
        { required: true, message: '请输入订购人姓名！' },
        { pattern: nameRegExp, message: '订购人姓名不合法！' }
      ],
      buyPhone: [
        { required: true, message: '请输入订购人手机号码！' },
        { pattern: phoneReg, message: '订购人手机号不合法！' }
      ],
      deliveryDate: { required: true, message: '请选择送达日期！' }
    }
    // 实例化
    const validator = new Schema(rules)
    return new Promise((resolve) => {
      validator.validate(params, (err) => {
        if (err) {
          toast({ title: err[0].message })
          resolve({ valid: false })
        } else {
          resolve({ valid: true })
        }
      })
    })
  },

  onLoad(options) {
    // 从立即购买进入订单详情
    this.setData({
      ...options
    })
  },

  onShow() {
    // this.getAddressList()
    this.getAddress(), this.getOrderIndo()
  },
  onUnload() {
    app.globalData.address = {}
  }
})
