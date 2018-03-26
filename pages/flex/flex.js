// pages/flex/flex.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    view: [
      { index: "green", class: "bc_green" },
      { index: "red", class: "bc_red" },
      { index: "blue", class: "bc_blue" },
      { index: "green", class: "bc_green" },
      { index: "red", class: "bc_red" },
      { index: "blue", class: "bc_blue" }
    ],
    imgUrls: [
      'http://imgcms.yit.com/cmsres/20180322/65dd5b14-66d0-4f25-8777-da86c6f32085_750X420.jpeg?imageView2/0/w/750',
      'http://imgcms.yit.com/cmsres/20180326/1d5d83bb-3003-4a7d-a005-74ae2d0802ee_750X420.jpeg?imageView2/0/w/750',
      'http://imgcms.yit.com/cmsres/20180321/38665c48-a327-4445-990c-2a0de1ff7710_750X420.jpeg?imageView2/0/w/750',
      'http://imgcms.yit.com/cmsres/20180326/1d5d83bb-3003-4a7d-a005-74ae2d0802ee_750X420.jpeg?imageView2/0/w/750',
      'http://imgcms.yit.com/cmsres/20180326/5a63dee7-1fdc-4ed3-8ba9-f794786eedd8_750X420.jpeg?imageView2/0/w/750'
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    current: 0
  },
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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