const knex = require('../../knex.js')

const tome = async (ctx, next) => {
  let { offset, pageSize } = ctx.params
  const user = ctx.request.user
  offset = offset ? parseInt(offset) : 0
  pageSize = pageSize ? parseInt(pageSize) : 20
  const backs = await knex.select('*').from('forum_topic_back').where({ author_id: user.u_id }).limit(pageSize).offset(offset)
  ctx.body = { success: true, data: backs }
}

const my = async (ctx, next) => {
  let { offset, pageSize } = ctx.params
  const user = ctx.request.user
  offset = offset ? parseInt(offset):0
  pageSize = pageSize ? parseInt(pageSize): 20
  const backs = await knex.select('*').from('forum_topic_back').where({ user_id: user.u_id }).limit(pageSize).offset(offset)
  ctx.body = { success: true, data: backs}
}

module.exports = { tome, my }