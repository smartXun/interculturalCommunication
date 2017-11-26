const debug = require('debug')('Cross-culture')
const conf = require('../config.js')
const jwt = require('jsonwebtoken')
const knex = require('../knex.js')

module.exports = async (ctx, next) => {
  try {
    if (ctx.req.headers && ctx.req.headers.authorization) {
      const decoded = jwt.verify(ctx.req.headers.authorization, conf.jwtSecret)
      if (decoded.id){
        const user = await knex('mUser').where({ u_id: decoded.id }).first()
        ctx.request.user = user
        await next()
      }else{
        ctx.body = { code: -1, message: 'token invalid' }
      }
    } else {
      ctx.body = { code: -1, message: 'User authentication failed' }
    }
  } catch (e) {
    debug('Catch Error: %o', e)
    ctx.status = 200
    ctx.body = { code: -1, message: e && e.message ? e.message : e.toString() }
  }
}