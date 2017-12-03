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
  },
  toILikeSelect: function () {
    wx.navigateTo({ url: '../ILikeSelect/ILikeSelect' })
  },
  toMyComment: function () {
    wx.navigateTo({ url: '../MyComment/MyComment' })
  }
})