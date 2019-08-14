const config = require('config');
const Koa = require('koa');
const cors = require('@koa/cors');
const helmet = require('koa-helmet');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');
require('./src/utils/mongoose');
const passport = require('./src/utils/passport/index');

const app = new Koa();

app.use(cors({
  origin: config.get('cors').origin,
}));
app.use(helmet());

app.use(bodyParser({
  multipart: true,
}));

app.use(passport.initialize());

app.use(async (ctx, next) => {
  console.log(ctx.request.body);
  try {
    await next();
  } catch (err) {
    console.log(err);
    const errors = [];
    Object.keys(err.errors).forEach((key) => {
      errors.push(err.errors[key].message);
    });
    ctx.status = 500;
    ctx.body = {
      errors,
    };
  }
});

const router = new Router();
router.use('/accounts', require('./src/accounts/routes').routes());

app.use(router.routes());

app.listen(config.get('port'));
