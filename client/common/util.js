const validate = (formatType, value) => {
  switch (formatType) {
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

const diffDate = (date1, date2) => {
  let yearDiff = Math.abs(date1.getFullYear() - date2.getFullYear())
  if (yearDiff >= 1) {
    return yearDiff + 'year'
  }
  let monthDiff = Math.abs(date1.getMonth() - date2.getMonth())
  if (monthDiff >= 1) {
    return monthDiff + 'month'
  }
  var datediff = Math.abs(date1.getTime() - date2.getTime())
  var days = Math.floor(datediff / (24 * 3600 * 1000))
  var leave1 = datediff % (24 * 3600 * 1000)
  var hours = Math.floor(leave1 / (3600 * 1000))
  var leave2 = leave1 % (3600 * 1000)
  var minutes = Math.floor(leave2 / (60 * 1000))
  var leave3 = leave2 % (60 * 1000)
  var seconds = Math.round(leave3 / 1000)
  
  return days ? days + ' days' : hours ? hours + ' hours' : minutes ? minutes + ' minutes' : seconds +' seconds'
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

const getTimeString = date =>{
  const monthString = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()
  return monthString[month] + " " + day+','+year
}

var basicHttp = (method, requestUrl, data, successCallback, failCallback) => {
  let header = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
  var token = getApp().globalData.token;
  if (token && token !== '') {
    header.Authorization = token;
  }
  wx.request({
    url: requestUrl,
    data: data,
    method: method,
    header: header,
    success: function (res) {
      if (successCallback) successCallback(res.data, res.errMsg, res.statusCode);
    },
    fail: function (err) {
      if (failCallback) failCallback(err);
    }
  })
};

module.exports = {
  http_get: (requestUrl, successCallback, failCallback) => {
    basicHttp('GET', requestUrl, {}, successCallback, failCallback);
  },
  http_post: (requestUrl, data, successCallback, failCallback) => {
    basicHttp('POST', requestUrl, data, successCallback, failCallback);
  },
  http_put: (requestUrl, data, successCallback, failCallback) => {
    basicHttp('PUT', requestUrl, data, successCallback, failCallback);
  },
  http_delete: (requestUrl, successCallback, failCallback) => {
    basicHttp('DELETE', requestUrl, {}, successCallback, failCallback);
  },
  validate: validate,
  showSuccess: text => wx.showToast({
    title: text,
    icon: 'success'
  }),
  showLoading: () => {
    wx.showToast({
      title: 'Loading',
      icon: 'loading',
      mask: true,
      duration: 10000
    })
  },
  hideLoading: () => {
    wx.hideToast();
  },
  showModel: (title, content)=>{
    wx.hideToast();
    wx.showModal({
      title,
      content: typeof (content) === "string" ? content : JSON.stringify(content),
      showCancel: false
    })
  },
  formatTime, diffDate, getTimeString
}