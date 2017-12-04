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
      article.create_time = util.getTimeString(new Date(article.create_time))
      article.content = JSON.parse(article.content)
      this.setData({ article })
    })
  },
  like: function () {
    util.http_post(url.ArticleLike, { articleId: this.data.articleId }, (res) => {
      if (res.success) {
        util.showSuccess('Success')
        let article = this.data.article
        article.like_num += 1
        this.setData({ article })
      } else {
        util.showModel('Notice', res.message)
      }
    })
  },
})