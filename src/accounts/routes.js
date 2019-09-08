const Router = require('koa-router');
const {
  jwtAuth, signIn, token, logout, sendEmailConfirmation, index, create, read, update, destroy,
} = require('./controllers/users');

const router = new Router();

// Auth
router.post('/sign-in', signIn);
router.post('/confirm', sendEmailConfirmation);
router.get('/token', token);
router.delete('/token', jwtAuth, logout);

// CRUD
router.get('/', jwtAuth, index);
router.post('/', create);
router.get('/:userID', jwtAuth, read);
router.put('/:userID', jwtAuth, update);
router.delete('/:userID', jwtAuth, destroy);

module.exports = router;
