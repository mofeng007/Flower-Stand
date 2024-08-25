import http from '../utils/http'

// 进行登录，code是临时登录凭证
export const reqLogin = (code) => {
  return http.get(`/weixin/wxLogin/${code}`)
}

// 获取用户信息
/**
 * @description 获取用户信息
 * @returns promise
 */
export const reqUserInfo = () => {
  return http.get('/weixin/getuserInfo')
}

// 上传用户头像
/**
 * @description 实现本地资源上传
 * @param {*} filePath 文件路径
 * @param {*} name 文件对应key
 * @returns Promise
 */
export const reqUploadFile = (filePath, name) => {
  return http.upload('/fileUpload', filePath, name)
}

/**
 * @description 更新用户信息
 * @param {*} userInfo 最新的头像和昵称
 * @returns Promise
 */
export const reqUpdateUserInfo = (userInfo) => {
  return http.post('/weixin/updateUser', userInfo)
}
