/*
 * @Description: app.js
 * @Author: OriX
 * @LastEditors: OriX
 */
const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
// 导入koa2-cors模块
const cors = require('koa2-cors')
const index = require('./routes/index');
const users = require('./routes/users');
// 引入api 路由
const adminApiRouter = require('./routes/api/admin');
const authApiRouter = require('./routes/api/auth');
// 引入全局token验证中间件
const ValidateTokenMiddle = require('./middleware/validateToken');
// error handler
onerror(app);

app.use(
  cors({
    origin: function (ctx) { //设置允许来自指定域名请求
      return '*'; // 允许来自所有域名请求
    },
    maxAge: 5, //指定本次预检请求的有效期，单位为秒。
    credentials: true, //是否允许发送Cookie
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'], //设置服务器支持的所有头信息字段
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'] //设置获取其他自定义字段
  })
)
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
/* 
koaJwt 中间件
app.use(Exception);
// token验证 及 无需验证的路由
app.use(
  koaJwt({ secret: JWT_CONFIG.JWT_SECRET_KEY }).unless({
    path: [/^\/api\/auth\/login/, /^\/api\/admin\/initAdmin/, /^\/api\/user\/register/, /^\/auth\/refreshToken/],
  })
); */
// 自写验证中间件
app.use(ValidateTokenMiddle);
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
