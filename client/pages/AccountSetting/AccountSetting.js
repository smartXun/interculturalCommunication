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
    util.showSuccess('Loged Out!')
  }
})