const knex = require('../../knex.js')
const cos = require('../../cos.js')
const conf = require('../../config.js')

const add = async (ctx, next) => {
  const { ansId, content } = ctx.request.body
  if (!ansId || !content) {
    ctx.body = { success: false, message: "Parameter Error!" }
  } else {
    const user = ctx.request.user
    const ans = await knex('qa_ans').where({ 'id': ansId }).first()
    const commentId = await knex('qa_comment').insert({ user_id: user.u_id, content: content, a_id: ansId, q_id: ans.q_id })
    if (commentId) {
      await knex('qa_ans').where({ 'id': ansId }).increment('comment_num', 1)
      ctx.body = { success: true }
    } else {
      ctx.body = { success: false, message: "Create Question Fail!" }
    }
  }
}

const list = async (ctx, next) => {
  const ansId = ctx.params.id
  if (!ansId) {
    ctx.body = { success: false, message: "Parameter Error!" }
  } else {
    let comments = await knex('qa_comment').where({ a_id: ansId })
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