const puppeteer = require('puppeteer');

const cacheFlavorList = {}; // 暂时不用数据库
const cacheOverReact = {};

module.exports.getFlavorCope = async function(ctx, next) {
  let page;
  if (cacheFlavorList.infoList && cacheFlavorList.dateTime && (Date.now() - cacheFlavorList.dateTime) <= 1000 * 60 * 60 * 24) {
    ctx.body = cacheFlavorList.infoList;
    return;
  }
  try {
    page = await initPage('https://flaviocopes.com');
    await page.waitForSelector('[class="post-container"]')
  } catch (error) {
    ctx.body = 'error';
    return;
  }
  // await page.waitForSelector('[class="post-container"]')
  const blogPost = await page.$$('li[itemprop="blogPost"]');
  let infoList = [];
  for (let el of blogPost) {
    const info = await page.evaluate(dom => {
      const title = dom.getElementsByClassName('post-stub-title')[0].innerHTML;
      const subTitle = dom.querySelector('p[itemprop="name"]').innerHTML;
      const href = dom.querySelector('[itemprop="url"]').getAttribute('href');
      const changeTime = dom.getElementsByClassName('post-stub-date')[0].innerHTML;
      return {title, subTitle, href, changeTime}
    }, el);
    infoList.push(info);
    await el.dispose();
  }
  cacheFlavorList.dateTime = Date.now();
  cacheFlavorList.infoList = infoList;
  ctx.body = infoList;
}


// https://overreacted.io
module.exports.getOverReact = async function(ctx, next) {
  let page;
  if (cacheOverReact.infoList && cacheOverReact.dateTime && (Date.now() - cacheOverReact.dateTime) <= 1000 * 60 * 60 * 24) {
    ctx.body = cacheOverReact.infoList;
    return;
  }
  try {
    page = await initPage('https://overreacted.io');
    await page.waitForSelector('div[id="___gatsby"]')
  } catch (error) {
    ctx.body = 'error';
    return;
  }
  // await page.waitForSelector('[class="post-container"]')
  const blogPost = await page.$$('div h3');
  let infoList = [];
  for (let el of blogPost) {
    console.log(el)
    const info = await page.evaluate(dom => {
      const titleDom = dom.querySelector('h3 > a');
      const title = titleDom.innerHTML;
      // const subTitle = dom.querySelector('p');
      const href = `https://overreacted.io${titleDom.getAttribute('href')}`;
      // const changeTime = dom.querySelector('small').innerHTML;
      return {title, href}
    }, el);
    infoList.push(info);
    await el.dispose();
  }
  cacheOverReact.dateTime = Date.now();
  cacheOverReact.infoList = infoList;
  ctx.body = infoList;
}

var browser;
async function initPage(url) {
  if (!browser) {
    browser = await puppeteer.launch({
      timeout: 30000,
      args: ['--no-sandbox', '--disable-setuid-sandbox']  // 不关闭 ubuntu会失效(https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md)
    })
  }
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: 'networkidle2', 
  });
  if (page) {
    return page;
  } else {
    throw new Error('page is null')
  }
}