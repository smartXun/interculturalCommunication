const originalMulter = require('multer')

function multer(options) {
  const m = originalMulter(options)

  makePromise(m, 'any')
  makePromise(m, 'array')
  makePromise(m, 'fields')
  makePromise(m, 'none')
  makePromise(m, 'single')

  return m
}

function makePromise(multer, name) {
  if (!multer[name]) return

  const fn = multer[name]

  multer[name] = function () {
    const middleware = fn.apply(this, arguments)

    return (ctx, next) => {
      return new Promise((resolve, reject) => {
        middleware(ctx.req, ctx.res, (err) => {
          err ? reject(err) : resolve(ctx)
        })
      }).then(next).catch(function (e) {
        console.log(e)
      })
    }
  }
}

multer.diskStorage = originalMulter.diskStorage
multer.memoryStorage = originalMulter.memoryStorage

module.exports = multer