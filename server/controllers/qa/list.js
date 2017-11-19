module.exports = async(ctx, next) => {
  console.log(ctx.request.user)
  ctx.body = { success: true, message: '' }
}