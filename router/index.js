const {getFlavorCope} = require('../services/puppeteer');

const router = require('koa-router')();
router.get('/getinfo', getFlavorCope);
module.exports = router;