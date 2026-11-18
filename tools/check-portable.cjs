const { chromium, expect } = require('@playwright/test');
const { createServer } = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');

const output = path.resolve('test-results/portable-captures');
const mime = {'.html':'text/html', '.js':'text/javascript', '.mjs':'text/javascript', '.wasm':'application/wasm',
  '.css':'text/css', '.json':'application/json', '.png':'image/png', '.ttf':'font/ttf'};
async function serve(root) {
  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost');
      const file = path.resolve(root, '.' + decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname));
      if (!file.startsWith(root + path.sep)) throw Error('Out of scope');
      const bytes = await fs.readFile(file);
      res.writeHead(200, {'Content-Type': mime[path.extname(file)] || 'application/octet-stream'});
      res.end(bytes);
    } catch { res.writeHead(404); res.end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  return {url:'http://127.0.0.1:' + server.address().port, close:() => server.close()};
}
async function check(browser, framework) {
  const site = await serve(path.resolve('test-results/portable', framework));
  const page = await browser.newPage({viewport:{width:1120,height:760}, reducedMotion:'reduce'});
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  try {
    await page.goto(site.url);
    if (framework === 'flutter') {
      const semantics = page.locator('flt-semantics-placeholder');
      await semantics.waitFor({state:'attached', timeout:60000});
      await semantics.evaluate(element => element.click());
    }
    const field = page.getByRole('textbox', {name:'Cue name'});
    await expect(field).toBeVisible({timeout:60000});
    await page.screenshot({path:path.join(output, framework + '.png')});
    if (framework === 'flutter') await field.click();
    await field.fill('Evening arrival');
    await page.getByRole('button', {name:/Door closes/}).click();
    await page.getByRole('button', {name:'Keep editing'}).click();
    if (framework === 'flutter') await field.click();
    await expect(field).toHaveValue('Evening arrival');
    await page.getByRole('button', {name:'Save changes'}).click();
    if (framework === 'dioxus') await expect(page.getByRole('status')).toHaveText('Changes saved.');
    await expect(page.getByRole('button', {name:/Evening arrival/})).toBeVisible();
    await page.setViewportSize({width:390,height:800});
    await expect(field).toBeAttached();
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)) throw Error('Overflow');
    await page.screenshot({path:path.join(output, framework + '-compact.png')});
    await page.getByRole('button', {name:/Type proof/i}).click();
    await page.getByRole('button', {name:/Increase type size/i}).click();
    await page.getByRole('button', {name:'Reset settings'}).click();
    await page.getByRole('button', {name:'Undo reset'}).click();
    await expect(page.getByRole('button', {name:'Reset settings'})).toBeEnabled();
    await page.screenshot({path:path.join(output, framework + '-proof.png')});
    if (errors.length) throw Error(errors.join('\n'));
    console.log(framework + ' rendered, protected a draft, saved and reflowed at 390px.');
  } finally { await page.close(); site.close(); }
}
(async () => {
  await fs.mkdir(output,{recursive:true});
  const browser = await chromium.launch({args:['--no-sandbox']});
  try { for (const framework of ['dioxus','flutter']) await check(browser,framework); }
  finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
