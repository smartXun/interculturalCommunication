const knex = require('../../knex.js')
const cos = require('../../cos.js')
const conf = require('../../config.js')

const add = async (ctx, next) => {
  const { topicId, content } = ctx.request.body
  if (!topicId || !content) {
    ctx.body = { success: false, message: "Parameter Error!" }
  } else {
    const user = ctx.request.user
    const back = await knex('forum_topic_back').insert({ user_id: user.u_id, content: content, topic_id: topicId })
    if (back) {
      await knex('forum_topic').where({ 'id': topicId }).increment('back_num', 1)
      ctx.body = { success: true }
    } else {
      ctx.body = { success: false, message: "Create Comment Fail!" }
    }
  }
}

const list = async (ctx, next) => {
  const topicId = ctx.params.id
  if (!topicId) {
    ctx.body = { success: false, message: "Parameter Error!" }
  } else {
    let backs = await knex('forum_topic_back').where({ topic_id: topicId })
    const promises = backs.map((back, index, array) => {
      return knex('mUser').where({ 'u_id': back.user_id }).first().then((user) => {
        back.userAvatar = user.image_url
        back.name = user.name
      })
    })
    await Promise.all(promises)
    ctx.body = { data: backs }
  }
}

module.exports = { add, list }