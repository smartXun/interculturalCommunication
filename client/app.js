const util = require('./common/util.js')
const url = require('./common/constant_url.js')

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
            util.http_post(url.WechatLogin, data, (res) => {
              if (res && res.success) {
                wx.setStorageSync('token', res.token);
                that.globalData.token = res.token
                that.handleLoginSuccess()
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
      url: url.UserInfo,
      method: 'GET',
      header: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.globalData.token
      },
      success: function (res) {
        const data = res.data
        if (data.success){
          that.handleLoginSuccess(data)
        }
      }
    })
  },
  handleLoginSuccess:function(res){
    this.globalData.userType = res.userType
    this.globalData.userInfo = res.userInfo
    this.getBackLikeList()
    this.getReplyLikeList()
    if (this.userInfoReadyCallback) {
      this.userInfoReadyCallback(res)
    }
  },
  getBackLikeList: function () {
    util.http_get(url.BackLikeList, res => {
      let likelist = []
      res.data.forEach(like => {
        likelist.push(like.back_id)
      })
      this.globalData.backLikeList = likelist
    })
  },
  getReplyLikeList: function () {
    util.http_get(url.ReplyLikeList, res => {
      let likelist = []
      res.data.forEach(like=>{
        likelist.push(like.reply_id)
      })
      this.globalData.replyLikeList = likelist
    })
  },
  globalData:{
    userInfo: null,
    token: ''
  }
})