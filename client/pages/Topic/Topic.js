const util = require('../../common/util.js')
const url = require('../../common/constant_url.js')

Page({
  data: {
  
  },
  onLoad: function (options) {
    const topDetailUrl = url.TopicDetail + "/" + options.id
    util.http_get(topDetailUrl,(res)=>{
      let topic = res.data
      topic.content = JSON.parse(topic.content)
      this.setData({topic});
    })
  },
})