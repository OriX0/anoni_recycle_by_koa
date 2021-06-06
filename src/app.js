/*
 * @Description:
 * @Author: OriX
 * @LastEditors: OriX
 * @LastEditTime: 2021-06-06 21:11:17
 */
const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
// 路由限制
const koaJwt = require('koa-jwt');

const index = require('./routes/index');
const users = require('./routes/users');
// 引入api 路由
const adminApiRouter = require('./routes/api/admin');
const authApiRouter = require('./routes/api/auth');
// 引入常量
const { JWT_CONFIG } = require('./conf/constant');
// 引入全局异常捕捉中间件
const Exception = require('./middleware/Exception');

// error handler
onerror(app);

// middlewares
app.use(
  bodyparser({
    enableTypes: ['json', 'form', 'text'],
  })
);
app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/public'));

app.use(
  views(__dirname + '/views', {
    extension: 'ejs',
  })
);
app.use(Exception);
// token验证 及 无需验证的路由
app.use(
  koaJwt({ secret: JWT_CONFIG.JWT_SECRET_KEY }).unless({
    path: [/^\/api\/auth\/login/, /^\/api\/admin\/initAdmin/, /^\/api\/user\/register/, /^\/auth\/refreshtoken/],
  })
);

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());
// api路由
app.use(adminApiRouter.routes(), adminApiRouter.allowedMethods());
app.use(authApiRouter.routes(), authApiRouter.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
});

module.exports = app;
