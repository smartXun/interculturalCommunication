var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
  },
  onLoad: function (options) {
  },
  onReady: function () {
  },
  wechat_login_success: (userInfo)=>{
    util.showSuccess('登录成功')
    app.globalData.userInfo = userInfo
    wx.navigateBack()
  },  
  wechatLogin: function () {
    // util.showBusy('正在登录')
    var that = this
    qcloud.login({
      success(result) {
        if (result) {
          that.wechat_login_success(result)
        } else {
          // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
          qcloud.request({
            url: config.service.requestUrl,
            login: true,
            success(result) {
              that.wechat_login_success(result.data.data)
            },
            fail(error) {
              util.showModel('请求失败', error)
              console.log('request fail', error)
            }
          })
        }
      },
      fail(error) {
        wx.showModal({
          title: '警告',
          content: '您点击了拒绝授权,将无法正常显示个人信息,点击确定重新获取授权。',
          success: function (res) {
            wx.openSetting({
              success: (res) => {
                if (res.authSetting["scope.userInfo"]) {
                  wx.getUserInfo({
                    success: function (res) {
                      that.wechat_login_success(res.userInfo)
                    }
                  })
                }
              }, fail: function (res) {
              }
            })
          }
        });
      }
    })
  }
})