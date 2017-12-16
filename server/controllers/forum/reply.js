const knex = require('../../knex.js')
const conf = require('../../config.js')

const add = async (ctx, next) => {
  const { backId, replyToId, citeId, content } = ctx.request.body
  if (!backId || !content) {
    ctx.body = { success: false, message: "Parameter Error!" }
  } else {
    const user = ctx.request.user
    await knex('forum_back_reply').insert({ back_id: backId, user_id: user.u_id, content: content, reply_user_id: replyToId, cite_id: citeId })
    await knex('forum_topic_back').where({ 'id': backId }).increment('reply_num', 1)
    ctx.body= { success: true }
  }
}

const like = async (ctx, next) => {
  const { replyId } = ctx.request.body
  const user = ctx.request.user
  const replyLike = await knex('forum_back_reply_like').where({ 'reply_id': replyId, user_id: user.u_id }).first()
  if (replyLike) {
    ctx.body = { success: false, message: "You've liked it!" }
  } else {
    await knex('forum_back_reply_like').insert({ user_id: user.u_id, reply_id: replyId })
    await knex('forum_back_reply').where({ 'id': replyId }).increment('like_num', 1)
    ctx.body = { success: true }
  }
}

const dislike = async (ctx, next) => {
  const { replyId } = ctx.request.body
  const user = ctx.request.user
  await knex('forum_back_reply_like').where({ 'reply_id': replyId, user_id: user.u_id }).del()
  ctx.body = { success: true }
}

const likelist = async (ctx, next) => {
  const user = ctx.request.user
  const list = await knex('forum_back_reply_like').where({ user_id: user.u_id })
  ctx.body = { success: true, data: list }
}

module.exports = { add, like, dislike, likelist }