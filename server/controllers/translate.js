const { translate, detect, audio } = require('translation.js') 

module.exports = async (ctx, next) => {
  const { transText, to } = ctx.request.body
  const res = await translate({ text: transText, to })
  const result = res.result
  ctx.body = { success: true, result }
}