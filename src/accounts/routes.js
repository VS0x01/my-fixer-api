const Router = require('koa-router');
const passport = require('koa-passport');
const usersController = require('./controllers/users');

const router = new Router();

// Auth
router.post('/sign-in', usersController.signIn);

// CRUD
router.get('/', passport.authenticate('jwt', { session: false }), usersController.index);
router.post('/', usersController.create);
router.get('/:userID', usersController.read);
router.put('/:userID', usersController.update);
router.delete('/:userID', usersController.destroy);

module.exports = router;