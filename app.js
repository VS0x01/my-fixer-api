const config = require('config');
const Koa = require('koa');
const Router = require('koa-router');
const mongoose = require('mongoose');
const usersController = require('./src/controllers/users');

const uri = config.get('databaseUrl');
mongoose.connect(uri, { useNewUrlParser: true });

const app = new Koa();
const router = new Router();

router.get('/user', usersController.all);
app.use(router.routes());

app.listen(config.get('port'));
