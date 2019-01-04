const {getFlavorCope, getOverReact} = require('../services/puppeteer');

const router = require('koa-router')();
router.get('/getinfo', getFlavorCope);
router.get('/getoverreact', getOverReact)
module.exports = router;