export const swiperCellBehavior = Behavior({
  data: {
    // 存储滑动单元格实例
    swiperCellQueue: []
  },
  methods: {
    // 打开滑块触发
    swiperCellOpen(event) {
      // 获取单元格实例
      const instance = this.selectComponent(`#${event.target.id}`)
      // 实例追加到数组中
      this.data.swiperCellQueue.push(instance)
    },

    // 页面点击事件
    onSwiperCellPage() {
      this.onSwiperCellClose()
    },

    // 滑动单元格点击事件
    onSwiperCellClick() {
      this.onSwiperCellClose()
    },

    // 关闭滑块统一逻辑
    onSwiperCellClose() {
      this.data.swiperCellQueue.forEach((instance) => {
        instance.close()
      })
      // 将数组重置为空
      this.data.swiperCellQueue = []
    }
  }
})
