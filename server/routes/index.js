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
router.get('/user_info', auth, controllers.auth.userInfo)

router.get('/account/comment/my', auth, controllers.account.comment.my)
router.get('/account/comment/tome', auth, controllers.account.comment.tome)

router.get('/qa/q/likelist', auth, controllers.qa.q.likelist)
router.get('/qa/q/list', controllers.qa.q.list)
router.put('/qa/q/add', auth, controllers.qa.q.add)
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
router.get('/forum/back/list/:id', controllers.forum.back.list)

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
router.put('/system/kit/article/add', upload.array('files'), controllers.admin.kit.article.add)

module.exports = router