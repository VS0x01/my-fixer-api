const config = require('config');
const Koa = require('koa');
const serve = require('koa-static');
const cors = require('@koa/cors');
const helmet = require('koa-helmet');
const bodyParser = require('koa-body')({ multipart: true });
const params = require('strong-params');
const Router = require('@koa/router');
const swagger = require('koa2-swagger-ui');
const passport = require('./src/libs/passport/index');

const app = new Koa();

app.use(cors({
  origin: config.get('cors').origin,
}));
app.use(helmet());

app.use(serve('docs'));
app.use(
  swagger(
    {
      hideTopbar: true,
      swaggerOptions: {
        url: 'swagger.yml',
      },
    },
  ),
);

app.use(bodyParser);
app.use(params.koaMiddleware());

app.use(passport.initialize());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    const errors = [];
    const { name, statusCode, message } = err;

    ctx.status = statusCode || 500;
    if (err.errors) {
      Object.keys(err.errors).forEach((key) => {
        errors.push({
          name: key,
          message: err.errors[key].message,
        });
      });
    } else {
      errors.push({
        name,
        message,
      });
    }
    ctx.body = {
      errors,
    };
  }
});

const router = new Router();
router.use('/api/accounts', require('./src/accounts/routes').routes());

app.use(router.routes());

module.exports = app.listen(config.get('port'));
