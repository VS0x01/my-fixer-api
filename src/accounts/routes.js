const Router = require('koa-router');
const passport = require('koa-passport');
const usersController = require('./controllers/users');

const router = new Router();

// Auth
router.post('/sign-in', usersController.signIn);

// CRUD
router.get('/users', passport.authenticate('jwt', { session: false }), usersController.index);
router.post('/users', usersController.create);
router.get('/users/:userID', usersController.read);
router.put('/users/:userID', usersController.update);
router.delete('/users/:userID', usersController.destroy);

module.exports = router;
