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

module.exports = { add, list }