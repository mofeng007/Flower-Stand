// 同步存储
// 本地存储数据
export const setStorage = (key, data) => {
  try {
    wx.setStorageSync(key, data)
  } catch (err) {
    console.error('存储指定 ${key} 数据发生异常！', err)
  }
}
// 读取指定key数据
export const getStorage = (key) => {
  try {
    const value = wx.getStorageSync(key)
    if (value) {
      return value
    }
  } catch (err) {
    console.error('读取指定 ${key} 数据发生异常！', err)
  }
}
// 移除指定key数据
export const removeStorage = (key) => {
  try {
    wx.removeStorageSync(key)
  } catch (err) {
    console.error('移除指定 ${key} 数据发生异常！', err)
  }
}
// 清空本地数据
export const clearStorage = () => {
  try {
    wx.clearStorageSync()
  } catch (err) {
    console.error('清空本地数据发生异常！', err)
  }
}

// 异步存储
export const asyncSetStorage = (key, data) => {
  return new Promise((resolve) => {
    wx.setStorage({
      key,
      data,
      complete(res) {
        resolve(res)
      }
    })
  })
}
// 读取
export const asyncGetStorage = (key) => {
  return new Promise((resolve) => {
    wx.getStorage({
      key,
      complete(res) {
        resolve(res)
      }
    })
  })
}
// 移除指定key数据
export const asyncRemoveStorage = (key) => {
  return new Promise((resolve) => {
    wx.removeStorage({
      key,
      complete(res) {
        resolve(res)
      }
    })
  })
}
// 清空
// 移除指定key数据
export const asyncClearStorage = () => {
  return new Promise((resolve) => {
    wx.clearStorage({
      complete(res) {
        resolve(res)
      }
    })
  })
}
