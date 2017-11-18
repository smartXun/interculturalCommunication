const validate = (formatType, value) => {
  switch (formatType){
    case 'email':
      return /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(value)
    case 'acc':
      return true
    case 'pwd':
      return true
    default:
      return false
  }
}

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


// 显示繁忙提示
var showBusy = text => wx.showToast({
    title: text,
    icon: 'loading',
    duration: 10000
})

// 显示成功提示
var showSuccess = text => wx.showToast({
    title: text,
    icon: 'success'
})

// 显示失败提示
var showModel = (title, content) => {
    wx.hideToast();
    wx.showModal({
        title,
        content: typeof (content) ==="string" ? content:JSON.stringify(content),
        showCancel: false
    })
}

const post = (url, data, cb) => {
  let header = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
  var token = getApp().globalData.token;
  if (token && token !== '') {
    header.Authorization = token;
  }
  wx.request({
    url: url,
    method: "POST",
    data: data,
    header: header,
    success: (res) => {
      cb(res.data)
    }
  })
}
module.exports = { formatTime, showBusy, showSuccess, showModel, validate, post }
