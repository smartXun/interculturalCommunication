const util = require('./common/util.js')
const urls = require('./common/constant_url.js')
const config = require('./config')

App({
    onLaunch: function () {
      var token = wx.getStorageSync('token') || '';
      this.globalData.token = token;
      
      var that = this
      wx.getUserInfo({
        success: function (res) {
          const userInfo = res.userInfo
          wx.login({
            success: res => {
              const data = {
                code: res.code,
                nickName: userInfo.nickName,
                avatarUrl: userInfo.avatarUrl,
              }
              util.http_post(urls.WechatLogin, data, (res) => {
                if (res && res.success) {
                  that.globalData.userInfo = userInfo
                  if (that.userInfoReadyCallback) {
                    that.userInfoReadyCallback(res)
                  }
                }
              });
            },
            fail: err => {
              if(token){
                this.getUserInfo();
              }
            }
          })
        }
      })
    },
    getUserInfo: function(){
      util.http_get(urls.UserInfo,(res)=>{
        if(res.success){
          this.globalData.userInfo = res.userInfo
        }
      });
    },
    globalData:{
      userInfo: null,
      token: ''
    }
})