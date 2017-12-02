const util = require('../../common/util.js')
const url = require('../../common/constant_url.js')

Page({
  data: {
  
  },
  onLoad: function (options) {
    const categoryList = {
      '0': 'Others',
      '1': 'IT',
      '2': 'OA',
      '3': 'Company',
      '4': 'HR',
      '5': 'Culture',
      '6': 'Renting',
      '7': 'Transportation',
      '8': 'Food',
    }
    const ArticleListUrl = url.ArticleList + options.category
    this.setData({ category: categoryList[options.category] })
    util.http_get(ArticleListUrl, (res) => {
      let list = res.data
      list.forEach((item)=>{
        item.content = JSON.parse(item.content)
        let firstText = item.content.filter((item) => {
          return item.type == 'text'
        })[0]
        let firstImage = item.content.filter((item) => {
          return item.type == 'image'
        })[0]
        if (firstText) {
          item.firstText = firstText.content.replace(/^(\&nbsp\;)/, '')
        }
        if (firstImage) {
          item.firstImage = firstImage.src
        }
      })
      this.setData({ list })
    })
  },
  toArticle: function(e){
    wx.navigateTo({ url: '../Article/Article?id=' + e.currentTarget.dataset.id })
  }
})