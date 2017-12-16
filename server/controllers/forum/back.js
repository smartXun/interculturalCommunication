const knex = require('../../knex.js')
const cos = require('../../cos.js')
const conf = require('../../config.js')

const add = async (ctx, next) => {
  const { topicId, content, citeId } = ctx.request.body
  if (!topicId || !content) {
    ctx.body = { success: false, message: "Parameter Error!" }
  } else {
    const user = ctx.request.user
    const topic = await knex('forum_topic').where({ id: topicId }).first()
    const backId = await knex('forum_topic_back').insert({ author_id: topic.user_id, user_id: user.u_id, content: content, topic_id: topicId, cite_id: citeId })
    ctx.body = { success: true }
  }
}

const list = async (ctx, next) => {
  const topicId = ctx.params.id
  if (!topicId) {
    ctx.body = { success: false, message: "Parameter Error!" }
  } else {
    const backs = await knex.select('forum_topic_back.*', 'mUser.image_url as userAvatar', 'mUser.name').from('forum_topic_back').leftJoin('mUser', 'u_id', 'forum_topic_back.user_id').where({ topic_id: topicId })
    const promise = backs.map((item)=>{
      return knex.select('forum_back_reply.*', 't2.name as replierName', 't1.name as replyToName').from('forum_back_reply').leftJoin('mUser as t1', 't1.u_id', 'forum_back_reply.reply_user_id').leftJoin('mUser as t2', 't2.u_id', 'forum_back_reply.user_id').where({'back_id':item.id}).then((replies)=>{
        item.replies = replies;
      })
    })
    await Promise.all(promise)
    ctx.body = { data: backs }
  }
}

const like = async (ctx, next) => {
  const { backId } = ctx.request.body
  const user = ctx.request.user
  const backLike = await knex('forum_topic_back_like').where({ 'back_id': backId, user_id: user.u_id }).first()
  if (backLike) {
    ctx.body = { success: false, message: "You've liked it!" }
  } else {
    await knex('forum_topic_back_like').insert({ user_id: user.u_id, back_id: backId })
    await knex('forum_topic_back').where({ 'id': backId }).increment('like_num', 1)
    ctx.body = { success: true }
  }
}

const dislike = async (ctx, next) => {
  const { backId } = ctx.request.body
  const user = ctx.request.user
  await knex('forum_topic_back_like').where({ 'back_id': backId, user_id: user.u_id }).del()
  ctx.body = { success: true }
}

const likelist = async (ctx, next) => {
  const user = ctx.request.user
  const list = await knex('forum_topic_back_like').where({ user_id: user.u_id })
  ctx.body = { success: true, data:list }
}

module.exports = { add, list, like, dislike, likelist }