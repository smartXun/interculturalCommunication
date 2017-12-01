const knex = require('../../../knex.js')
const conf = require('../../../config.js')
const stringUtil = require('../../../util/string.js')

const list = async (ctx, next) => {
  const { offset, pageSize } = ctx.params
  let topics = await knex.select('*').from('forum_topic').limit(parseInt(pageSize)).offset(parseInt(offset))
  topics.forEach((topic) => {
    const content = JSON.parse(topic.content)
    let firstText = content.filter((item) => {
      return item.type == 'text'
    })[0]
    if (firstText) {
      topic.content = stringUtil.setString(firstText.content.replace(/^(\&nbsp\;)/, ''),100)
    } else {
      topic.content = ''
    }
  })
  const totalRet = await knex('forum_topic').count('*')
  const total = totalRet && totalRet[0] && totalRet[0]['count(*)']
  ctx.body = { success: true, data: topics, total }
}

const delete_item = async (ctx, next) => {
  const { id } = ctx.request.body
  ctx.body = { success: true }
}

module.exports = { list, delete_item }