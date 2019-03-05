const {getFlavorCope, getOverReact, getLog} = require('../services/puppeteer');

const router = require('koa-router')();
router.get('/getinfo', getFlavorCope);
router.get('/getoverreact', getOverReact);
router.post('/pushlog', getLog)
module.exports = router;