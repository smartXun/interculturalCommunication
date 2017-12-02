const knex = require('../../../knex.js')
const cos = require('../../../cos.js')
const conf = require('../../../config.js')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const stringUtil = require('../../../util/string.js')

const add = async (ctx, next) => {
  if (ctx.req.headers && ctx.req.headers.authorization) {
    const decoded = jwt.verify(ctx.req.headers.authorization, conf.jwtSecret)
    if (decoded.id) {
      const user = await knex('aUser').where({ u_id: decoded.id }).first()
      let { title, pageData } = ctx.req.body
      const files = ctx.req.files
      if (!title || !pageData){
        files.forEach((item) => { fs.unlinkSync(item.path)})
        ctx.body = { success: false, message: 'Bad request' }
      }else{
        const promises = files.map((file, index, array) => {
          return cos.up(file.filename, file.path).then((data) => {
            file.url = "http://" + data.Location
          })
        })
        await Promise.all(promises)
        pageData = JSON.parse(pageData)
        pageData.filter((item, index, arr) => {
          return item.type == 'image'
        }).forEach((item, index, arr) => {
          item.src = files[index].url
        })
        pageData = JSON.stringify(pageData)
        await knex('kit').insert({ title, content: pageData })
        ctx.body = { success: true }
      }
    } else {
      ctx.body = { code: -1, message: 'token invalid' }
    }
  } else {
    ctx.body = { code: -1, message: 'User authentication failed' }
  }
}

const list = async (ctx, next) => {
  const { offset, pageSize } = ctx.params
  let articles = await knex.select('*').from('kit').limit(parseInt(pageSize)).offset(parseInt(offset))
  articles.forEach((article) => {
    const content = JSON.parse(article.content)
    let firstText = content.filter((item) => {
      return item.type == 'text'
    })[0]
    if (firstText) {
      article.content = stringUtil.setString(firstText.content.replace(/^(\&nbsp\;)/, ''), 100)
    } else {
      article.content = ''
    }
  })
  const totalRet = await knex('kit').count('*')
  const total = totalRet && totalRet[0] && totalRet[0]['count(*)']
  ctx.body = { success: true, data: articles, total }
}

module.exports = { add, list }