var urls = require('../../common/constant_url.js')
var util = require('../../common/util.js')
var app = getApp()

Page({
  data: {
    accValue:'',
    pwdValue:''
  },
  signup: function () {
    wx.navigateTo({ url: '../SignUp/SignUp' })
  },
  accKeyInput: function (e) {
    this.setData({ accValue: e.detail.value })
  },
  pwdKeyInput: function (e) {
    this.setData({ pwdValue: e.detail.value })
  },
  localLogin:function () {
    util.http_post(urls.LocalLogin, {
      acc: this.data.accValue,
      pwd: this.data.pwdValue
    },(res)=>{
      if (res.success){
        wx.setStorageSync('token', res.token);
        app.globalData.token = res.token
        app.globalData.userInfo = res.userInfo
        wx.switchTab({ url: '../MyAccount/MyAccount' })
      }else{
        util.showModel('Error', res.message)
      }
    })
  },
  wechat_login_http: (userInfo) => {
    util.showLoading()
    wx.login({
      success: res => {
        const data = {
          code: res.code,
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl,
        }
        util.http_post(urls.WechatLogin, data, (res) => {
          if (res && res.success) {
            wx.setStorageSync('token', res.token);
            app.globalData.token = res.token
            app.globalData.userInfo = userInfo
            wx.switchTab({ url: '../MyAccount/MyAccount' })
          }
        });
      },
      fail: err => { }
    })
  },
  wechatLogin: function () {
    const that = this
    wx.getUserInfo({
      success: function (res) {
        wechat_login_http(res.userInfo)
      },
      fail: function () {
        wx.showModal({
          title: 'Attention',
          content: 'You have denied authorization,Please re authorize.',
          cancelText: 'NO',
          confirmText: 'OK',
          success: function (res) {
            if (res.confirm) {
              wx.openSetting({
                success: function (res) {
                  if (!res.authSetting["scope.userInfo"] || !res.authSetting["scope.userLocation"]) {
                    wx.getUserInfo({
                      success: function (res) {
                        that.wechat_login_http(res.userInfo)
                      },
                      fail: function () {}
                    })
                  } 
                }
              })
            }
          }
        })
      }
    })
  }
})