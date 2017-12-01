const knex = require('../../../knex.js')
const conf = require('../../../config.js')
const stringUtil = require('../../../util/string.js')

const list = async (ctx, next) => {
  const { offset, pageSize } = ctx.params
  let backs = await knex.select('*').from('forum_topic_back').limit(parseInt(pageSize)).offset(parseInt(offset))
  backs.forEach((back) => {
    back.content = stringUtil.setString(back.content.replace(/^(\&nbsp\;)/, ''), 100)
  })
  const totalRet = await knex('forum_topic_back').count('*')
  const total = totalRet && totalRet[0] && totalRet[0]['count(*)']
  ctx.body = { success: true, data: backs, total }
}

const delete_item = async (ctx, next) => {
  const { id } = ctx.request.body
  ctx.body = { success: true }
}

module.exports = { list, delete_item }