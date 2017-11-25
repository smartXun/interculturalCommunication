const util = require('../../common/util.js')
const url = require('../../common/constant_url.js')

Page({
  data: {
  
  },
  onLoad: function (options) {
    const AnsListUrl = url.AnsDetail + "/" + options.id
    util.http_get(AnsListUrl, (res) => {
      let ans = res.data.ans
      let que = res.data.que
      ans.create_time = util.diffDate(new Date(), new Date(ans.create_time))
      ans.content = JSON.parse(ans.content)
      que.create_time = util.diffDate(new Date(), new Date(que.create_time))
      // let commentList = res.data.commentList
      // ansList.forEach((ans) => {
      //   ans.create_time = util.diffDate(new Date(), new Date(ans.create_time))
      //   const content = JSON.parse(ans.content)
      //   ans.content = content.filter((item) => {
      //     return item.type == 'text'
      //   })[0].content.replace(/^(\&nbsp\;)/, '')
      // })
      this.setData({ ans, que })
    })
  },
})