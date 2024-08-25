// 封装toast，传入对象作为参数
// 消息提示框
export const toast = ({
  title = '数据加载中...',
  icon = 'none',
  duration = 2000,
  mask = true
} = {}) => {
  wx.showToast({
    title,
    icon,
    duration,
    mask
  })
}

/**
 * @description 封装模态对话框
 * @param {*} options
 * @returns Promise
 */
export const modal = (options = {}) => {
  return new Promise((resolve) => {
    const defaultOpt = {
      title: '提示',
      content: '您确定执行该操作吗？',
      confirmColor: '#f3514f'
    }
    const opts = Object.assign({}, defaultOpt, options)
    wx.showModal({
      ...opts,
      complete({ confirm, cancel }) {
        confirm && resolve(true)
        cancel && resolve(false)
      }
    })
  })
}

// wx.toast = toast
// wx.modal = modal
