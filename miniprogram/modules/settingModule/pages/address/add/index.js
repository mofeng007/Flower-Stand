import { toast, modal } from '@/utils/extendApi'
import QQMapWX from '@/modules/settingModule/libs/qqmap-wx-jssdk.min'
import Schema from 'async-validator'
import {
  reqAddAddress,
  reqAddressInfo,
  reqUpdateAddress
} from '@/modules/settingModule/api/address'

Page({
  // 页面的初始数据
  data: {
    name: '', // 收货人
    phone: '', // 手机号
    provinceName: '', // 省
    provinceCode: '', // 省 编码
    cityName: '', // 市
    cityCode: '', // 市 编码
    districtName: '', // 区
    districtCode: '', // 区 编码
    address: '', // 详细地址
    fullAddress: '', // 完整地址 (省 + 市 + 区 + 详细地址)
    isDefault: 0 // 设置默认地址，是否默认地址 → 0：否  1：是
  },

  // 省市区选择
  onAddressChange(event) {
    const [provinceName, cityName, districtName] = event.detail.value
    const [provinceCode, cityCode, districtCode] = event.detail.code
    this.setData({
      provinceName,
      cityName,
      districtName,
      provinceCode,
      cityCode,
      districtCode
    })
  },

  // 定位按钮获取用户地理信息
  async onLocation() {
    const { authSetting } = await wx.getSetting()
    if (authSetting['scope.userLocation'] === false) {
      const modalRes = await modal({
        title: '授权提示',
        content: '需要获取地理位置，请确认授权！'
      })
      if (!modalRes) {
        return toast({ title: '您拒绝了授权！', icon: 'error' })
      }
      // 打开授权页面
      const { authSetting } = await wx.openSetting()
      if (!authSetting['scope.userLocation']) {
        return toast({ title: '授权失败！', icon: 'error' })
      }
      try {
        // wx.getLocation()  chooseLocation()
        const { longitude, latitude, name } = wx.chooseLocation()
        this.qqmapwx.reverseGeocoder({
          location: {
            longitude,
            latitude
          },
          success: (res) => {
            const { adcode, province, city, district } = res.result.ad_info
            const { street, street_number } = res.result.address_component
            const { standard_address } = res.result.formatted_addresses

            this.setData({
              provinceName: province, // 省
              // 省前两位有值
              provinceCode: adcode.replace(adcode.substring(2, 6), '0000'), // 省 编码
              cityName: city, // 市
              cityCode: adcode.replace(adcode.substring(4, 6), '00'), // 市 编码
              districtName: district, // 区
              districtCode: district && adcode, // 区 编码
              address: street + street_number + name, // 详细地址
              fullAddress: standard_address + name // 完整地址 (省 + 市 + 区 + 详细地址)
            })
          }
        })
      } catch (err) {
        toast({ title: '您拒绝了授权获取地理位置！', icon: 'error' })
      }
    } else {
      try {
        // wx.getLocation()  chooseLocation()
        const { longitude, latitude, name } = await wx.chooseLocation()
        this.qqmapwx.reverseGeocoder({
          location: {
            longitude,
            latitude
          },
          success: (res) => {
            const { adcode, province, city, district } = res.result.ad_info
            const { street, street_number } = res.result.address_component
            const { standard_address } = res.result.formatted_addresses

            this.setData({
              provinceName: province, // 省
              // 省前两位有值
              provinceCode: adcode.replace(adcode.substring(2, 6), '0000'), // 省 编码
              cityName: city, // 市
              cityCode: adcode.replace(adcode.substring(4, 6), '00'), // 市 编码
              districtName: district, // 区
              districtCode: district && adcode, // 区 编码
              address: street + street_number + name, // 详细地址
              fullAddress: standard_address + name // 完整地址 (省 + 市 + 区 + 详细地址)
            })
          }
        })
      } catch (err) {
        toast({ title: '授权取消！', icon: 'error' })
      }
    }
  },

  // 验证新增的收货地址
  validatorAddress(params) {
    // 规则
    // 验证收货人，是否只包含大小写字母、数字和中文字符
    const nameRegExp = '^[a-zA-Z\\d\\u4e00-\\u9fa5]+$'
    // 验证手机号，是否符合中国大陆手机号码的格式
    const phoneReg = '^1(?:3\\d|4[4-9]|5[0-35-9]|6[67]|7[0-8]|8\\d|9\\d)\\d{8}$'
    const rules = {
      name: [
        { required: true, message: '请输入收货人姓名！' },
        { pattern: nameRegExp, message: '收货人姓名不合法！' }
      ],
      phone: [
        { required: true, message: '请输入收货人手机号码！' },
        { pattern: phoneReg, message: '收货人手机号不合法！' }
      ],
      provinceName: { required: true, message: '请选择收货人所在地区！' },
      address: { required: true, message: '请输入收货人详细地址！' }
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
  // 保存收货地址
  async saveAddrssForm() {
    // 组织参数
    const { provinceName, cityName, districtName, address, isDefault } = this.data
    const params = {
      ...this.data,
      fullAddress: provinceName + cityName + districtName + address,
      isDefault: isDefault ? 1 : 0
    }
    const { valid } = await this.validatorAddress(params)
    if (!valid) return
    const res = this.addressId
      ? await reqUpdateAddress(params)
      : await reqAddAddress(params)
    if (res.code === 200) {
      wx.navigateBack({
        success: () => {
          toast({
            title: this.addressId ? '更新地址成功！' : '新增地址成功！',
            icon: 'success'
          })
        }
      })
    }
  },

  // 更新逻辑
  async showAddressInfo(id) {
    if (!id) return
    // 挂载id
    this.addressId = id
    // 动态设置页面标题
    wx.setNavigationBarTitle({
      title: '更新收货地址'
    })
    const { data } = await reqAddressInfo(id)
    this.setData(data)
  },

  onLoad(options) {
    this.qqmapwx = new QQMapWX({
      key: '7BZBZ-RGLC5-7RIIR-IBLUD-GFBUZ-HDFB4'
    })
    this.showAddressInfo(options.id)
  }
})
