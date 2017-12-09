const util = require('../../common/util.js')
const app = getApp()

Page({
  data: {
  
  },
  onLoad: function (options) {
  
  },
  SwitchAccount: function(){
    app.globalData.token = null
    app.globalData.userInfo = null
    app.globalData.userType = null
    util.showSuccess('Logged Out!')
  },
  toChangePassword: function () {
    if (!app.globalData.token || !app.globalData.userInfo || !app.globalData.userType){
      util.showModel('Notice', "Please Log In!")
      return
    }
    if (app.globalData.userType == 'wechat'){
      util.showModel('Notice',"Wechat user can't change password!")
      return
    }
    wx.navigateTo({ url: '../ChangePassword/ChangePassword' })
  },
})