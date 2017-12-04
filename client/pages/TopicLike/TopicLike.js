const util = require('../../common/util.js')
const url = require('../../common/constant_url.js')

Page({
  data: {
  
  },
  onLoad: function (options) {
    util.http_get(url.TopicLikeList, (res) => {
      let list = res.data
      console.log(list)
      // this.setData({ topic, contents });
    })
  },
})