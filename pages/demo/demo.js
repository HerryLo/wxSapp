// pages/demo/demo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude:'',
    longitude: ''
  },

  /**
   * 获取地理位置
   */
  getloca: function() {
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        let latitude = res.latitude // 经度
        let longitude = res.longitude // 纬度
        this.setData({
          latitude: latitude,
          longitude: longitude
        })
      }
    })
  },

  /**
   * 跳转 
   */
  navigateTo: function() {
    wx.navigateTo({
      url: "../flex/flex"
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showNavigationBarLoading()
    this.getloca();
    /* 剪切板 */
    wx.setClipboardData({
      data: 'data',
      success: function (res) {
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideNavigationBarLoading()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})