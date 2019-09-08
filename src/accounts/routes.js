const Router = require('koa-router');
const {
  jwtAuth, signIn, token, logout, sendEmailConfirmation, index, create, read, update, destroy,
} = require('./controllers/users');

const router = new Router();

// Auth
router.post('/sign-in', signIn);
router.post('/confirm', sendEmailConfirmation);
router.get('/token', token);

router.use(jwtAuth);

router.delete('/token', logout);

// CRUD
router.get('/', index);
router.post('/', create);
router.get('/:userID', read);
router.put('/:userID', update);
router.delete('/:userID', destroy);

module.exports = router;
