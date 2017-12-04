const util = require('./common/util.js')
const urls = require('./common/constant_url.js')

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
                  wx.setStorageSync('token', res.token);
                  that.globalData.token = res.token
                  that.globalData.userInfo = userInfo
                  that.globalData.userType = 'wechat'
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