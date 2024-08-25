// 配置当前小程序的环境变量

// 获取账号信息
const { miniProgram } = wx.getAccountInfoSync()
// 获取小程序版本
const { envVersion } = miniProgram

let env = {
  baseUrl: 'https://gmall-prod.atguigu.cn/mall-api'
}

switch (envVersion) {
  // 开发版
  case 'develop':
    env.baseUrl = 'https://gmall-prod.atguigu.cn/mall-api'
    break
  // 测试版
  case 'trial':
    env.baseUrl = 'https://gmall-prod.atguigu.cn/mall-api'
    break
  // 正式版
  case 'release':
    env.baseUrl = 'https://gmall-prod.atguigu.cn/mall-api'
    break
  default:
    env.baseUrl = 'https://gmall-prod.atguigu.cn/mall-api'
    break
}

export { env }
