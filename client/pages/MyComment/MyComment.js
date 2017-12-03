const util = require('../../common/util.js')
const url = require('../../common/constant_url.js')

Page({
  data: {
  
  },
  onLoad: function (options) {
    util.http_get(url.CommentToMe, res => {

    })

    util.http_get(url.MyComment, res => {

    })
  },
})