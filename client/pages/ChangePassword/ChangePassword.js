const util = require('../../common/util.js')
const url = require('../../common/constant_url.js')

Page({
  data: {
    accValue: '',
    oldpwdValue: '',
    pwd1Value: '',
    pwd2Value: '',
  },
  onLoad: function (options) {
  
  },
  accKeyInput: function (e) {
    this.setData({ accValue: e.detail.value })
  },
  oldpwdKeyInput: function (e) {
    this.setData({ oldpwdValue: e.detail.value })
  },
  pwd1KeyInput: function (e) {
    this.setData({ pwd1Value: e.detail.value })
  },
  pwd2KeyInput: function (e) {
    this.setData({ pwd2Value: e.detail.value })
  },
  changePwd: function(){
    if (!this.data.accValue) {
      util.showModel('Notice', 'Please enter Username!')
      return
    }
    if (!this.data.oldpwdValue) {
      util.showModel('Notice', 'Please enter Password!')
      return
    }
    if (!this.data.pwd1Value) {
      util.showModel('Notice', 'Please enter New Password!')
      return
    }
    if (!this.data.pwd2Value) {
      util.showModel('Notice', 'Please enter Comfirm New Password!')
      return
    }
    if (this.data.pwd1Value != this.data.pwd2Value) {
      util.showModel('Notice', 'Two Password not same!')
      return
    }
    util.showLoading()
    util.http_post(url.LocalChangePassword,{
      acc: this.data.accValue,
      oldPwd: oldpwdValue,
      newPwd: pwd1Value
    },res=>{
      util.hideLoading()
      if(res.success){
        util.showSuccess('Success!');
        wx.navigateBack({ url:'../AccountSetting/AccountSetting' })
      }
    })
  }
})