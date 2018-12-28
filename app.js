const Koa = require('koa');
const router = require('./router/index');
const jsonp = require('./middleware/koa-jsonp');

const {getFlavorCope} = require('./services/puppeteer');

const app = new Koa();
app.use(jsonp());
app.use(router.routes(), router.allowedMethods());

app.listen(3000);
