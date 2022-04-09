// components/loading/loading.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
   /// apply-shared: // 代表页面wxss样式将影响自定义组件
   ///shared: // 代表双向的影响
    styleIsolation: 'isolated'  // 默认值isolated: 代表启动样式隔离
  },
  properties: {
      tip: {
          type: String,
          value: ''
      }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
