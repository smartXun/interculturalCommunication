var util = require('../../utils/util.js')
var errMsg = require('../../errMsg.js')
var config = require('../../config.js')
var app = getApp()

Page({
  data: {
    userPhoto: null,
    accValue: '',
    pwdValue: '',
    pwd2Value: '',
    emailValue: ''
  },
  accKeyInput: function (e) {
    this.setData({ accValue: e.detail.value })
  },
  pwdKeyInput: function (e) {
    this.setData({ pwdValue: e.detail.value })
  },
  pwd2KeyInput: function (e) {
    this.setData({ pwd2Value: e.detail.value })
  },
  emailKeyInput: function (e) {
    this.setData({ emailValue: e.detail.value })
  },
  chooseImageTap: function () {
    let _this = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#f7982a",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            _this.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            _this.chooseWxImage('camera')
          }
        }
      }
    })
  },
  chooseWxImage: function (type) {
    let _this = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        _this.setData({ userPhoto: res.tempFilePaths[0] })
      }
    })
  },
  signin: function() {
    wx.navigateBack({ url: '../SignIn/SignIn' })
  },
  signup: function () {
    if (!this.data.accValue) {
      util.showModel(errMsg.type.empty, errMsg.account.accEmpty)
    } else if (!this.data.emailValue){
      util.showModel(errMsg.type.empty, errMsg.account.emailEmpty)
    } else if (!this.data.pwdValue) {
      util.showModel(errMsg.type.empty, errMsg.account.pwdEmpty)
    } else if (!this.data.pwd2Value) {
      util.showModel(errMsg.type.empty, errMsg.account.pwd2Empty)
    } else if (!this.data.userPhoto) {
      util.showModel(errMsg.type.empty, errMsg.account.userPhotoEmpty)
    } else if (!util.validate('email', this.data.emailValue)) {
      util.showModel(errMsg.type.format, errMsg.account.emailFormatInvalid)
    } else if (!util.validate('acc', this.data.accValue)) {
      util.showModel(errMsg.type.format, errMsg.account.accFormatInvalid)
    } else if (!util.validate('pwd', this.data.pwdValue)) {
      util.showModel(errMsg.type.format, errMsg.account.pwdFormatInvalid)
    } else if (!util.validate('pwd', this.data.pwd2Value)) {
      util.showModel(errMsg.type.format, errMsg.account.pwd2FormatInvalid)
    } else if (this.data.pwdValue !== this.data.pwd2Value) {
      util.showModel(errMsg.type.wrongValue, errMsg.account.pwdNotSame)
    }else{
      wx.uploadFile({
        url: config.urls.LocalRegister,
        filePath: this.data.userPhoto,
        name: 'file',
        formData: {
          acc: this.data.accValue,
          pwd: this.data.pwdValue,
          email: this.data.emailValue
        },
        success: function (res) {
          const data = JSON.parse(res.data)
          if (data.success){
            util.showSuccess('注册成功')
            wx.setStorageSync('token', res.token);
            app.globalData.token = res.token
            // app.globalData.userInfo = data.userInfo
            wx.switchTab({ url: '../MyAccount/MyAccount' })
          }else{
            util.showModel('注册失败', data.msg)
          }
        },
        fail: function (e) {
          util.showModel('上传图片失败')
        }
      })
    }
  }
})