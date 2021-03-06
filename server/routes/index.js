const path = require('path')
const router = require('koa-router')({ prefix: '/weapp' })
const controllers = require('../controllers')
const auth = require('../middlewares/auth.js')
const admin = require('../middlewares/admin.js')

const multer = require('koa-multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, path.join(__dirname, '../uploads/')) },
  filename: function (req, file, cb) {
    var fileFormat = (file.originalname).split(".");
    cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
  }
});
const upload = multer({ storage: storage })

//账号密码小程序登录
router.post('/login_wechat', controllers.auth.wechat)
router.post('/login_local', controllers.auth.local.login)
router.post('/register_local', upload.single('file'), controllers.auth.local.register)
router.post('/change_pwd_local', auth, controllers.auth.local.changepwd)

router.get('/account/info', auth, controllers.account.info)
router.get('/account/comment/my', auth, controllers.account.comment.my)
router.get('/account/comment/tome', auth, controllers.account.comment.tome)
router.get('/account/post/list/:offset/:pageSize', auth, controllers.account.post.list)
router.post('/account/post/delete', auth, controllers.account.post.delete_item)

router.get('/qa/q/likelist', auth, controllers.qa.q.likelist)
router.get('/qa/q/list', controllers.qa.q.list)
router.put('/qa/q/add', auth, controllers.qa.q.add)
router.post('/qa/q/addWithImage', upload.single('file'), controllers.qa.q.addWithImage)
router.post('/qa/q/like', auth, controllers.qa.q.like)
router.get('/qa/q/:id', controllers.qa.q.item)

router.get('/qa/a/likelist', auth, controllers.qa.a.likelist)
router.post('/qa/a/like', auth, controllers.qa.a.like)
router.post('/qa/a/preAddWithImage', auth, controllers.qa.a.preAddWithImage)
router.post('/qa/a/addWithImage', upload.single('file'), controllers.qa.a.addWithImage)
router.put('/qa/a/addWithoutImage', auth, controllers.qa.a.addWithoutImage)
router.get('/qa/a/:id', controllers.qa.a.item)

router.put('/qa/c/add', auth, controllers.qa.c.add)
router.get('/qa/c/list/:id', controllers.qa.c.list)

router.get('/forum/topic/list', controllers.forum.topic.list)
router.post('/forum/topic/preAddWithImage', auth, controllers.forum.topic.preAddWithImage)
router.post('/forum/topic/addWithImage', upload.single('file'), controllers.forum.topic.addWithImage)
router.put('/forum/topic/addWithoutImage', auth, controllers.forum.topic.addWithoutImage)
router.get('/forum/topic/likelist', auth, controllers.forum.topic.likelist)
router.post('/forum/topic/like/:id', auth, controllers.forum.topic.like)
router.post('/forum/topic/dislike/:id', auth, controllers.forum.topic.dislike)
router.get('/forum/topic/:id', controllers.forum.topic.item)

router.put('/forum/back/add', auth, controllers.forum.back.add)
router.post('/forum/back/like', auth, controllers.forum.back.like)
router.post('/forum/back/dislike', auth, controllers.forum.back.dislike)
router.get('/forum/back/likelist', auth, controllers.forum.back.likelist)
router.get('/forum/back/list/:id', controllers.forum.back.list)
router.put('/forum/reply/add', auth, controllers.forum.reply.add)
router.post('/forum/reply/like', auth, controllers.forum.reply.like)
router.post('/forum/reply/dislike', auth, controllers.forum.reply.dislike)
router.get('/forum/reply/likelist', auth, controllers.forum.reply.likelist)

router.get('/kit/article/list/:category', controllers.kit.article.list)
router.post('/kit/article/like', auth, controllers.kit.article.like)
router.get('/kit/article/:id', controllers.kit.article.item)

router.post('/kit/back/add', auth, controllers.kit.back.add)
router.post('/kit/back/list/:id', auth, controllers.kit.back.list)

router.post('/translate', controllers.translate)

router.post('/system/login', controllers.admin.auth.login)
router.get('/system/user/list/:offset/:pageSize', admin, controllers.admin.user.user.list)
router.get('/system/qa/q/list/:offset/:pageSize', admin, controllers.admin.qa.q.list)
router.post('/system/qa/q/delete', admin, controllers.admin.qa.q.delete_item)
router.get('/system/qa/a/list/:offset/:pageSize', admin, controllers.admin.qa.a.list)
router.post('/system/qa/a/delete', admin, controllers.admin.qa.a.delete_item)
router.get('/system/qa/c/list/:offset/:pageSize', admin, controllers.admin.qa.c.list)
router.post('/system/qa/c/delete', admin, controllers.admin.qa.c.delete_item)
router.get('/system/forum/topic/list/:offset/:pageSize', admin, controllers.admin.forum.topic.list)
router.get('/system/forum/back/list/:offset/:pageSize', admin, controllers.admin.forum.back.list)
router.get('/system/kit/article/list/:offset/:pageSize', admin, controllers.admin.kit.article.list)
router.post('/system/kit/article/preAddWithImage', admin, controllers.admin.kit.article.preAddWithImage)
router.put('/system/kit/article/addWithImage', upload.single('article_image'), controllers.admin.kit.article.addWithImage)
router.put('/system/kit/article/addWithoutImage', admin, controllers.admin.kit.article.addWithoutImage)
router.post('/system/kit/article/delete', admin, controllers.admin.kit.article.delete_item)


module.exports = router