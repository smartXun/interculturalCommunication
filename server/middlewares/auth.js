const debug = require('debug')('Cross-culture')

module.exports = async (ctx, next) => {
  try {
    if (ctx.req.headers && ctx.req.headers.authorization) {
      await next()
    } else {
      ctx.body = {
        code: -1,
        msg: '用户未验证'
      }
    }
  } catch (e) {
    // catch 住全局的错误信息
    debug('Catch Error: %o', e)
    // 设置状态码为 200 - 服务端错误
    ctx.status = 200
    // 输出详细的错误信息
    ctx.body = {
      code: -1,
      error: e && e.message ? e.message : e.toString()
    }
  }
}