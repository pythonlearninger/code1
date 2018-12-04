// pages/cashierDesk/cashierDesk.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id
    var amount = options.amount
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url_prefix + '/wx_mini/launchOrder',
      method: 'POST',
      data: {id: id, amount: amount},
      success: response => {
        // console.log(response)
        this.setData({
          
        })
        wx.hideLoading()
        
      }
    })
  },
})