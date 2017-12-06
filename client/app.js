const util = require('./common/util.js')
const urls = require('./common/constant_url.js')

App({
  onLaunch: function () {
    var token = wx.getStorageSync('token') || '';
    this.globalData.token = token;
    
    if(token){
      this.getUserInfo()
      return
    }
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
    var that = this
    wx.request({
      url: urls.UserInfo,
      method: 'GET',
      header: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.globalData.token
      },
      success: function (res) {
        const data = res.data
        if (data.success){
          that.globalData.userInfo = data.userInfo
          that.globalData.userType = data.userType
        }
      }
    })
  },
  globalData:{
    userInfo: null,
    token: ''
  }
})