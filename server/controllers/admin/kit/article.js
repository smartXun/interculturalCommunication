const knex = require('../../../knex.js')
const cos = require('../../../cos.js')
const conf = require('../../../config.js')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const stringUtil = require('../../../util/string.js')

const categoryList = {
  'Others': 0,
  'IT': 1,
  'OA': 2,
  'Company': 3,
  'HR': 4,
  'Culture': 5,
  'Renting': 6,
  'Transportation': 7,
  'Food': 8,
}

var cache = {}
const preAddWithImage = async (ctx, next) => {
  const { title, category, pageData, imageCount } = ctx.request.body
  const user = ctx.request.user
  let images = []
  for (var i = 0; i < imageCount; i++) { images.push({}) }
  cache[user.u_id] = { title, category, pageData, imageCount, images }
  ctx.body = { success: true }
}
const addWithImage = async (ctx, next) => {
  if (ctx.req.headers && ctx.req.headers.authorization) {
    const decoded = jwt.verify(ctx.req.headers.authorization, conf.jwtSecret)
    if (decoded.id) {
      const user = await knex('aUser').where({ u_id: decoded.id }).first()
      const { imageIndex } = ctx.req.body
      const { filename, path, mimetype } = ctx.req.file
      let article = cache[user.u_id]
      if (!article) {
        fs.unlinkSync(path)
        ctx.body = { success: false, message: 'Bad request' }
      } else {
        article.images[imageIndex] = { filename, path }
        if (!cache[user.u_id].complete && article.images.every((value, index, arr) => {
          return value && value.filename && value.path
        })) {
          cache[user.u_id].complete = true
          let { title, category, pageData, images } = article
          const promises = images.map((image, index, array) => {
            return cos.up(image.filename, image.path).then((data) => {
              image.url = "http://" + data.Location
            })
          })
          await Promise.all(promises)
          pageData = JSON.parse(pageData)
          let pageImages = pageData.filter((item, index, arr) => {
            return item.type == 'image'
          })
          pageImages.forEach((item, index, arr) => {
            item.src = images[index].url
          })
          pageData = JSON.stringify(pageData)
          await knex('kit_article').insert({ title, content: pageData, category })
          delete cache[user.u_id]
          ctx.body = { success: true }
        }
      }
    } else {
      ctx.body = { code: -2, message: 'token invalid' }
    }
  } else {
    ctx.body = { code: -2, message: 'User authentication failed' }
  }
}

const addWithoutImage = async (ctx, next) => {
  const { title, category, pageData } = ctx.request.body
  const user = ctx.request.user
  await knex('kit_article').insert({ title, content: pageData, category })
  ctx.body = { success: true }
}

const list = async (ctx, next) => {
  const { offset, pageSize } = ctx.params
  let articles = await knex.select('*').from('kit_article').limit(parseInt(pageSize)).offset(parseInt(offset))
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
  const totalRet = await knex('kit_article').count('*')
  const total = totalRet && totalRet[0] && totalRet[0]['count(*)']
  ctx.body = { success: true, data: articles, total }
}

const delete_item = async (ctx, next) => {
  const { id } = ctx.request.body
  await knex('kit_article').where({ 'id': id }).del()
  ctx.body = { success: true }
}

module.exports = { preAddWithImage, addWithImage, addWithoutImage, list, delete_item }