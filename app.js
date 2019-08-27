const config = require('config');
const Koa = require('koa');
const cors = require('@koa/cors');
const helmet = require('koa-helmet');
const bodyParser = require('koa-body')({ multipart: true });
const params = require('strong-params');
const Router = require('koa-router');
require('./src/libs/mongoose');
const passport = require('./src/libs/passport/index');

const app = new Koa();

app.use(cors({
  origin: config.get('cors').origin,
}));
app.use(helmet());

app.use(bodyParser);

app.use(passport.initialize());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = 500;
    if (err.hasOwnProperty('errors')) {
      const errors = [];
      Object.keys(err.errors).forEach((key) => {
        errors.push(err.errors[key].message);
      });
      ctx.body = {
        errors,
      };
    } else {
      ctx.body = {
        error: err.message,
      };
    }
  }
});

const router = new Router();
router.use('/accounts', require('./src/accounts/routes').routes());

app.use(router.routes());

app.listen(config.get('port'));
