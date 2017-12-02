const knex = require('../../knex.js')

const list = async (ctx, next) => {
  const category = ctx.params.category
  let articles = await knex('kit_article').where({ category:category }).orderBy('create_time', 'desc').limit(20)
  ctx.body = { data: articles }
}

module.exports = { list }