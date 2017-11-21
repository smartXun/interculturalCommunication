module.exports = async(ctx, next) => {
  console.log(ctx.request.user)
  ctx.body = {
    success: true, data: [{
      id: 1,
      title: 'What video games have changed your perspective forever?',
      createTime: '15 minutes',
      description: "Sid Meier's Railroad Tycoon taught me that debt isn't bad(and a bankrupty isn't the end of the world).In addition to teaching me a fair bit geography",
      commentUserPhotos: [
        "../../assets/user/portrait_01.png",
        "../../assets/user/portrait_02.png",
        "../../assets/user/portrait_03.png",
      ],
      commentCounts: 3
    }, {
      id: 1,
      title: 'What video games have changed your perspective forever?',
      createTime: '15 minutes',
      description: "Sid Meier's Railroad Tycoon taught me that debt isn't bad(and a bankrupty isn't the end of the world).In addition to teaching me a fair bit geography",
      commentUserPhotos: [
        "../../assets/user/portrait_01.png",
        "../../assets/user/portrait_02.png",
        "../../assets/user/portrait_03.png",
      ],
      commentCounts: 3
    }]}
}