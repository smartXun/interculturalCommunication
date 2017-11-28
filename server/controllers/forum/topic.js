const knex = require('../../knex.js')
const cos = require('../../cos.js')
const conf = require('../../config.js')
const fs = require('fs')

var cache = {}
const preAddWithImage = async (ctx, next) => {
  const { title, pageData, imageCount } = ctx.request.body
  const user = ctx.request.user
  let images = []
  for (var i = 0; i < imageCount; i++) { images.push({}) }
  cache[user.u_id] = { title, pageData, images }
  ctx.body = { success: true }
}

const addWithImage = async (ctx, next) => {
  if (ctx.req.headers && ctx.req.headers.authorization) {
    const decoded = jwt.verify(ctx.req.headers.authorization, conf.jwtSecret)
    if (decoded.id) {
      const user = await knex('mUser').where({ u_id: decoded.id }).first()
      const { imageIndex } = ctx.req.body
      const { filename, path, mimetype } = ctx.req.file
      let ansObj = cache[user.u_id]
      if (!ansObj) {
        fs.unlinkSync(path)
        ctx.body = { success: false, message: 'Bad request' }
      } else {
        ansObj.images[imageIndex] = { filename, path }
        if (!cache[user.u_id].complete && ansObj.images.every((value, index, arr) => {
          return value && value.filename && value.path
        })) {
          cache[user.u_id].complete = true
          let { title, pageData, images } = ansObj
          const promises = images.map((image, index, array) => {
            return cos.up(image.filename, image.path).then((data) => {
              image.url = "http://" + data.Location
            })
          })
          await Promise.all(promises)
          pageData.filter((item, index, arr) => {
            return item.type == 'image'
          }).forEach((item, index, arr) => {
            item.src = images[index].url
          })
          pageData = JSON.stringify(pageData)
          await knex('forum_topic').insert({ title, user_id: user.u_id, content: pageData })
          delete cache[user.u_id]
          ctx.body = { success: true }
        }
      }
    } else {
      ctx.body = { code: -1, message: 'token invalid' }
    }
  } else {
    ctx.body = { code: -1, msg: 'User authentication failed' }
  }
}

const addWithoutImage = async (ctx, next) => {
  const { title, pageData } = ctx.request.body
  const user = ctx.request.user
  console.log(111)
  const topic = await knex('forum_topic').insert({ title, user_id: user.u_id, content: pageData })
  if (topic) {
    ctx.body = { success: true }
  } else {
    ctx.body = { success: false, message: "Create Topic Fail!" }
  }
}

const list = async (ctx, next) => {
  let topics = await knex('forum_topic').orderBy('create_time', 'desc').limit(20)
  const promises = topics.map((topic, index, array) => {
    return knex('mUser').where({ 'u_id': topic.user_id }).first().then((user) => {
      topic.userPhotos = user.image_url
    })
  })
  await Promise.all(promises)
  ctx.body = { data: topics }
}

const item = async (ctx, next) => {
  const id = ctx.params.id
  let topic = await knex('forum_topic').where({ id: id }).first()
  const user = await knex('mUser').where({ 'u_id': topic.user_id }).first()
  topic.user = { name: user.name, userAvatar: user.image_url }
  ctx.body = { data: topic }
}

module.exports = { item, list, preAddWithImage, addWithImage, addWithoutImage }