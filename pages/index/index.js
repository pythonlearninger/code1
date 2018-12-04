const app = getApp()

Page({
  data: {
    grids: [{
      index: 0,
      name: "药品代购",
      img: "../img/gsjj.png",
      url: "../ypdg/ypdg",
    }, {
      index: 1,
      name: "健康指南",
      img: "../img/jjzn.png",
      url: "../jkzn/jkzn"
    }, {
      index: 2,
      name: "专家预约",
      img: "../img/zjyy.png",
      url: "../zjyy/zjyy"
    }, {
      index: 3,
      name: "团购体检",
      img: "../img/ypdg.png",
      url: '../tgtj/tgtj'
    }, {
      index: 4,
      name: "个人体检",
      img: "../img/gxtj.png",
      url: "../grtj/grtj"
    }],
    articleDatas: null,
    url_prefix: app.globalData.url_prefix,
  },
  call() {
    wx.showModal({
      title: "提示",
      content: '确认咨询卓越壹生吗？',
      success(res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: "15884176782",
            complete() {
              wx.switchTab({
                url: '../index/index'
              })
            }
          })
        } else if (res.cancel) {
          wx.switchTab({
            url: '../index/index'
          })
        }
      }
    })
  },
  onLoad(options){
    wx.a = this;
    this.mylogin();
    this.getJkzn();
  },
  mylogin(){
    wx.login({
      success: res => {
        if (res.code) {
          wx.setStorageSync("code", res.code)
          console.log(res)
          console.log(res.code)
          // 向服务器发送code换取自定义状态
          wx.request({
            url: app.globalData.url_prefix + '/wx_mini/code2status/',
            data: {
              code: res.code
            },
            header: {
              'content-type': 'application/json', // 默认值
              'cookie': wx.getStorageSync("cookiesAndSessionId")  // 使用之前存入的cookie
            },
            success: res => {
              var setCookie = res.header["Set-Cookie"]
              wx.setStorageSync("cookiesAndSessionId", setCookie)  // 存入cookie(sessionid以备使用)
              console.log(setCookie)
              console.log(res.data)
              this.checkHaveTel()
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })

  },
  getJkzn(){
    wx.request({
      url: app.globalData.url_prefix + '/wx_mini/getArticleListClient?categoryId=3&page=' + 1,
      success: response => {
        response.data.articles.pop()
        console.log(response.data)
        this.setData({
          articleDatas: response.data
        })
      }
    })
  },
  gotoArticleDetail(e) {
    console.log(e.currentTarget.dataset)
    wx.navigateTo({
      url: '../articleDetail/articleDetail?id=' + e.currentTarget.dataset.id
    })
  },
  gotoOtherPage(e){
    var navigate_method = e.currentTarget.dataset.method;
    var target_url_name = e.currentTarget.dataset.name;
    var url =  '../' + target_url_name + '/' + target_url_name;
    if(navigate_method === 'tab')
      wx.switchTab({
        url: url,
      })
    else
      wx.navigateTo({
        url: url,
      })
  },
  checkHaveTel(){
    'getTel' // 检查后端有没有保存当前用户的手机号码,在code2session success以后调用
    wx.request({
      url: app.globalData.url_prefix + '/wx_mini/getTel',
      header: {
        'content-type': 'application/x-www-form-urlencoded', // 默认值
        'cookie': wx.getStorageSync("cookiesAndSessionId")  // 使用之前存入的cookie
      },
      success(res) {
        console.log("用户手机号保存了：", res.data.tel)
        app.globalData.tel = res.data.tel
      },
    })
  }
})