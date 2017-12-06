const util = require('../../common/util.js')
const url = require('../../common/constant_url.js')

Page({
  data: {
  
  },
  onLoad: function (options) {
    this.getData()
  },
  onPullDownRefresh: function () {
    this.getData()
  },
  getData: function () {
    util.http_get(url.TopicList, (res) => {
      wx.stopPullDownRefresh()
      if (!res.data) return
      const data = res.data
      let list = data.map((topic) => {
        topic.create_time = util.diffDate(new Date(), new Date(topic.create_time))
        if (topic.content) {
          const content = JSON.parse(topic.content)
          let firstText = content.filter((item) => {
            return item.type == 'text'
          })[0]
          let images = content.filter((item) => {
            return item.type == 'image'
          })
          topic.images = []
          for (var i = 0; i < images.length; i++) {
            if (i >= 2) { break; }
            topic.images.push(images[i])
          }
          if (firstText) {
            topic.firstText = firstText.content.replace(/^(\&nbsp\;)/, '')
          }
        }
        return topic
      })
      this.setData({ list: list })
    });
  },
  forumnew: function(){
    wx.navigateTo({ url: '../ForumNew/ForumNew' })
  },
  toTopic: function(e){
    wx.navigateTo({ url: '../Topic/Topic?id=' + e.currentTarget.dataset.id })
  }
})