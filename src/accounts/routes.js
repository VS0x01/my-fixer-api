const Router = require('koa-router');
const passport = require('koa-passport');
const usersController = require('./controllers/users');

const router = new Router();

// Auth
router.post('/sign-in', usersController.signIn);
router.get('/token', usersController.token);
router.delete('/token', passport.authenticate('jwt', { session: false }), usersController.logout);
router.post('/confirm', usersController.sendEmailConfirmation);

// CRUD
router.get('/', passport.authenticate('jwt', { session: false }), usersController.index);
router.post('/', usersController.create);
router.get('/:userID', passport.authenticate('jwt', { session: false }), usersController.read);
router.put('/:userID', passport.authenticate('jwt', { session: false }), usersController.update);
router.delete('/:userID', passport.authenticate('jwt', { session: false }), usersController.destroy);

module.exports = router;
