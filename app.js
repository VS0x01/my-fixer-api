const config = require('config');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');
const mongoose = require('mongoose');
const usersController = require('./src/controllers/users');

const uri = config.get('databaseUrl');
mongoose.connect(uri, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
});

const app = new Koa();
app.use(bodyParser());
const router = new Router();

router.get('/users', usersController.index);
router.post('/users', usersController.create);
router.get('/users/:userID', usersController.read);
router.put('/users/:userID', usersController.update);
router.delete('/users/:userID', usersController.destroy);
app.use(router.routes());

app.listen(config.get('port'));
