var app = getApp();
Page({
  data: {
    userInfo:null
  },
  tapHeader: (event) => {
    if (app.globalData.userInfo){

    }else{
      wx.navigateTo({ url: '../SignIn/SignIn' })
    }
  },
  onShow: function () {
    this.setData({ userInfo: app.globalData.userInfo });
  }
})