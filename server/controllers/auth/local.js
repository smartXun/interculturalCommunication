// 登录授权接口
module.exports = async (ctx, next) => {
  const { acc, pwd } = ctx.request.body;
  ctx.body = {
    userInfo: {
      nickName: '',
      avatarUrl: ''
    },
    time: Math.floor(Date.now() / 1000)
  }
}
