const knex = require('../../knex.js')

const list = async (ctx, next) => {
  let { offset, pageSize } = ctx.params
  const user = ctx.request.user
  offset = offset ? parseInt(offset) : 0
  pageSize = pageSize ? parseInt(pageSize) : 20
  const list = await knex.select('forum_topic.*','mUser.image_url').from('forum_topic').leftJoin('mUser', 'u_id','forum_topic.user_id').where({ 'user_id': user.u_id }).limit(pageSize).offset(offset)
  ctx.body = { success: true, data: list }
}

const delete_item = async (ctx, next) => {
  const { id } = ctx.request.body
  const user = ctx.request.user
  await knex('forum_topic').where({ 'user_id': user.u_id, 'id':id }).del()
  ctx.body = { success: true }
}

module.exports = { list, delete_item }