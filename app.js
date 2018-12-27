const Koa = require('koa');
const router = require('./router/index');
const {getFlavorCope} = require('./services/puppeteer');

const app = new Koa();

app.use(router.routes(), router.allowedMethods());

app.listen(3000);
