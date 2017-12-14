const knex = require('../../knex.js')
const conf = require('../../config.js')

const add = async (ctx, next) => {
  const { backId, replyToId, content } = ctx.request.body
  if (!backId || !content) {
    ctx.body = { success: false, message: "Parameter Error!" }
  } else {
    const user = ctx.request.user
    await knex('forum_back_reply').insert({ back_id: backId, user_id: user.u_id, content: content, reply_user_id: replyToId })
    await knex('forum_topic_back').where({ 'id': backId }).increment('reply_num', 1)
    ctx.body= { success: true }
  }
}

module.exports = { add }