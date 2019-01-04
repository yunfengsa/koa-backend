const Koa = require('koa');
const body = require('koa-body');
const router = require('./router/index');
const jsonp = require('./middleware/koa-jsonp');

const app = new Koa();
app.use(body({
  multipart: true
}))
app.use(jsonp());
app.use(router.routes(), router.allowedMethods());

app.listen(3000);
