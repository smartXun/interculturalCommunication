const knex = require('../../knex.js')
const cos = require('../../cos.js')
const conf = require('../../config.js')

const add = async (ctx, next) => {
  const { articleId, content } = ctx.request.body
  if (!articleId || !content) {
    ctx.body = { success: false, message: "Parameter Error!" }
  } else {
    const user = ctx.request.user
    const article = await knex('kit_article').where({ 'id': articleId }).first()
    const comment = await knex('kit_article_back').insert({ user_id: user.u_id, content: content, a_id: articleId })
    if (comment) {
      await knex('kit_article').where({ 'id': articleId }).increment('comment_num', 1)
      ctx.body = { success: true }
    } else {
      ctx.body = { success: false, message: "Comment Fail!" }
    }
  }
}

const list = async (ctx, next) => {
  const articleId = ctx.params.id
  if (!articleId) {
    ctx.body = { success: false, message: "Parameter Error!" }
  } else {
    let comments = await knex('kit_article_back').where({ a_id: articleId })
    const promises = comments.map((comment, index, array) => {
      return knex('mUser').where({ 'u_id': comment.user_id }).first().then((user) => {
        comment.userAvatar = user.image_url
        comment.name = user.name
      })
    })
    await Promise.all(promises)
    ctx.body = { data: { comments } }
  }
}

module.exports = { add, list }