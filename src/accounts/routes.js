const Router = require('@koa/router');

const {
  jwtAuth, signIn, token, sendEmailConfirmation, index, create, read, update, destroy,
} = require('./controllers/users');

const router = new Router();

// Auth
router.post('/sign-in', signIn);
router.post('/confirm', sendEmailConfirmation);
router.get('/token', token);

// CRUD
router.post('/', create);
router.use(jwtAuth);
router.get('/', index);
router.get('/:userID', read);
router.put('/:userID', update);
router.delete('/:userID', destroy);

module.exports = router;
