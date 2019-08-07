const config = require('config');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');
require('./src/utils/mongoose');

const app = new Koa();
app.use(bodyParser({
  multipart: true,
}));

const router = new Router();
router.use('/accounts', require('./src/accounts/routes').routes());

app.use(router.routes());

app.listen(config.get('port'));
