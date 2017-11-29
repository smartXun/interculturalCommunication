const util = require('../../common/util.js')
const url = require('../../common/constant_url.js')

Page({
  data: {
  
  },
  onLoad: function (options) {
    util.http_get(url.AnsLikeList, (res) => {
      if (!res.data) return
      let list = res.data
      list.forEach((ans) => {
        ans.create_time = util.diffDate(new Date(), new Date(ans.create_time))
        const content = JSON.parse(ans.content)
        let firstText = content.filter((item) => {
          return item.type == 'text'
        })[0]
        let images = content.filter((item) => {
          return item.type == 'image'
        })
        ans.images = []
        for (var i = 0; i < images.length; i++) {
          if (i >= 2) { break; }
          ans.images.push(images[i])
        }
        if (firstText) {
          ans.firstText = firstText.content.replace(/^(\&nbsp\;)/, '')
        }
        return ans
      })
      this.setData({ list: list }) 
    });
  },
  toAnsList: function (e) {
    wx.navigateTo({ url: '../AnsList/AnsList?id=' + e.currentTarget.dataset.id })
  },
  toAnswer: function (e) {
    wx.navigateTo({ url: '../Answer/Answer?id=' + e.currentTarget.dataset.id })
  },
})