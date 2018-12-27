const puppeteer = require('puppeteer');

module.exports.getFlavorCope = async function(ctx, next) {
  let page;
  try {
    page = await initPage('https://flaviocopes.com');
  } catch (error) {
    ctx.body = 'error'
  }
  
  // await page.pdf({path: 'hn.pdf', format: 'A4'});
  await page.waitForSelector('[class="post-container"]')
  const blogPost = await page.$$('li[itemprop="blogPost"]');
  let infoList = [];
  for (let el of blogPost) {
    const info = await page.evaluate(dom => {
      const title = dom.getElementsByClassName('post-stub-title')[0].innerHTML;
      const subTitle = dom.querySelector('[itemprop="name"]').innerHTML;
      const href = dom.querySelector('[itemprop="url"]').getAttribute('href');
      const changeTime = dom.getElementsByClassName('post-stub-date')[0].innerHTML;
      return {title, subTitle, href, changeTime}
    }, el);
    infoList.push(info);
    await el.dispose();
  }
  
  ctx.body = infoList;
}


var browser;

async function initPage(url) {
  if (!browser) {
    browser = await puppeteer.launch({
      timeout: 30000
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