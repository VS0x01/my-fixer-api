const Router = require('koa-router');
const usersController = require('./controllers/users');

const router = new Router();

// Auth
router.post('/sign-in', usersController.signIn);
router.post('/sign-up', usersController.signUp);

// CRUD
router.get('/users', usersController.index);
router.post('/users', usersController.create);
router.get('/users/:userID', usersController.read);
router.put('/users/:userID', usersController.update);
router.delete('/users/:userID', usersController.destroy);

module.exports = router;
