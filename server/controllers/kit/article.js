const knex = require('../../knex.js')

const list = async (ctx, next) => {
  const category = ctx.params.category
  let articles = await knex('kit_article').where({ category:category }).orderBy('create_time', 'desc').limit(20)
  ctx.body = { data: articles }
}

const like = async (ctx, next) => {
  const { articleId } = ctx.request.body
  const user = ctx.request.user
  const isLike = await knex('kit_article_like').where({ 'a_id': articleId, user_id: user.u_id }).first()
  if (isLike) {
    ctx.body = { success: false, message: "You've liked it!" }
  } else {
    await knex('kit_article_like').insert({ user_id: user.u_id, a_id: articleId })
    await knex('kit_article').where({ 'id': articleId }).increment('like_num', 1)
    ctx.body = { success: true }
  }
}

const likelist = async (ctx, next) => {
  const user = ctx.request.user
  let likelist = await knex('kit_article_like').join('kit_article', 'kit_article_like.a_id', 'kit_article.id').select('kit_article.*').where({ 'kit_article_like.user_id': user.u_id })
  ctx.body = { success: true, data: likelist }
}

const item = async (ctx, next) => {
  const id = ctx.params.id
  let article = await knex('kit_article').where({ id: id }).first()
  ctx.body = { data: article }
}

module.exports = { list, item, like, likelist }