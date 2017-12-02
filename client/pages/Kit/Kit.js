Page({
  data: {
    searchValue: ''
  },
  searchKeyInput: function (e) {
  
  },
  toArticleList: function(e){
    wx.navigateTo({ url: '../ArticleList/ArticleList?category=' + e.currentTarget.dataset.category })
  }
})