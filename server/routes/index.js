const path = require('path')
const router = require('koa-router')({ prefix: '/weapp' })
const controllers = require('../controllers')
const auth = require('../middlewares/auth.js')

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
router.get('/user_info', auth, controllers.auth.userInfo)

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
router.post('/forum/topic/like/:id', auth, controllers.forum.topic.like)
router.post('/forum/topic/dislike/:id', auth, controllers.forum.topic.dislike)
router.get('/forum/topic/:id', controllers.forum.topic.item)

router.put('/forum/back/add', auth, controllers.forum.back.add)
router.get('/forum/back/list/:id', controllers.forum.back.list)

router.post('/translate', controllers.translate)

router.post('/system/login', controllers.admin.user.login)

module.exports = router
