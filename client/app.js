//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')

App({
    onLaunch: function () {
      qcloud.setLoginUrl(config.service.loginUrl)
      var that = this
      qcloud.login({
        success(result) {
          if (result) {
            that.globalData.userInfo = result;
          } else {
            qcloud.request({
              url: config.service.requestUrl,
              login: true,
              success(result) {
                that.globalData.userInfo = result.data.data;
              },
              fail(error) {
                console.log('request fail', error)
              }
            })
          }
        },
        fail(error) {
          console.log('登录失败', error)
        }
      })
    },
    globalData:{
      userInfo: null
    }
})