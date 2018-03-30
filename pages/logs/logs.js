//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: []
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
    wx.authorize({
      scope: 'scope.userInfo',
      success(res) {
        console.log(res);
      },
      fail(res){
        console.log(res.errMsg)
      }
    })
  }
})
