const util = require('../../common/util.js')
const url = require('../../common/constant_url.js')

Page({
  data: {
  
  },
  onLoad: function (options) {
    this.setData({ articleId: options.id })
  },
  onShow: function () {
    const ArticleDetailUrl = url.ArticleDetail + "/" + this.data.articleId
    util.http_get(ArticleDetailUrl, (res) => {
      let article = res.data
      this.setData({ article })
    })
  },
})