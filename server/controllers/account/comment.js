const knex = require('../../knex.js')

const tome = async (ctx, next) => {
  let { offset, pageSize } = ctx.params
  const user = ctx.request.user
  offset = offset ? parseInt(offset) : 0
  pageSize = pageSize ? parseInt(pageSize) : 20
  const backs = await knex.from('forum_topic_back').join('mUser', 'forum_topic_back.user_id', 'mUser.u_id').select('forum_topic_back.*', 'mUser.image_url', 'mUser.name').where({ author_id: user.u_id }).limit(pageSize).offset(offset)
  ctx.body = { success: true, data: backs }
}

const my = async (ctx, next) => {
  let { offset, pageSize } = ctx.params
  const user = ctx.request.user
  offset = offset ? parseInt(offset):0
  pageSize = pageSize ? parseInt(pageSize): 20
  const backs = await knex('forum_topic_back').join('mUser', 'forum_topic_back.author_id', 'mUser.u_id').select('forum_topic_back.*', 'mUser.image_url', 'mUser.name').where({ user_id: user.u_id }).limit(pageSize).offset(offset)
  ctx.body = { success: true, data: backs}
}

module.exports = { tome, my }