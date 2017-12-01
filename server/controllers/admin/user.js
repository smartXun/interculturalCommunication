const knex = require('../../knex.js')
const conf = require('../../config.js')

const list = async (ctx, next) => {
  const { offset, pageSize } = ctx.params
  const user = await knex.select('*').from('mUser').limit(parseInt(pageSize)).offset(parseInt(offset))
  const totalRet = await knex('mUser').count('*')
  const total = totalRet && totalRet[0] && totalRet[0]['count(*)']
  ctx.body = { success: true, data: user, total }
}

module.exports = { list }