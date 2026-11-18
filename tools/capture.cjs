// node tools/capture.cjs <work directory for animation frames>
const fs = require('node:fs');
const path = require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const gallery=path.join(root,'skills/stillform/assets/web');
const out=path.join(root,'showcase');
const frames=path.resolve(process.argv[2] || 'test-results/frames');
const file=name=>pathToFileURL(path.join(gallery,name + '.html')).href;
async function capture() {
  for(const dir of [out,frames]) fs.mkdirSync(dir,{recursive:true});
  const browser=await chromium.launch(process.env.EDGE_PATH?{executablePath:process.env.EDGE_PATH}:{});
  try {
    const page=await browser.newPage({viewport:{width:1200,height:780},deviceScaleFactor:1,colorScheme:'light'});
    for(const screen of ['index','tide','type','controls','motion','agenda']) {
      await page.goto(file(screen));
      await page.evaluate(()=>document.fonts.ready);
      await page.screenshot({path:path.join(out,screen+'.png')});
    }
    await page.setViewportSize({width:390,height:844});
    await page.goto(file('index'));
    await page.screenshot({path:path.join(out,'compact.png')});
    await page.setViewportSize({width:960,height:660});
    await page.goto(file('motion'));
    const panel=page.locator('.motion-frame');
    const box=await panel.boundingBox();
    const size=Math.min(box.height,440);
    const clip={x:Math.floor(box.x),y:Math.floor(box.y),width:Math.floor(box.width),height:Math.floor(size)};
    async function series(name, region, trigger, ticks) {
      const dir=path.join(frames,name);
      fs.mkdirSync(dir,{recursive:true});
      const snap=i=>page.screenshot({clip:region,path:path.join(dir,String(i).padStart(3,'0')+'.png')});
      await snap(0);
      await page.evaluate(selector=>{
        document.querySelector(selector).click();
        // Resolve the final style before pausing actual transitions for reproducible sampling.
        document.body.getBoundingClientRect();
        window.stillformAnimations=document.getAnimations();
        window.stillformAnimations.forEach(a=>{a.pause(); a.currentTime=0;});
      },trigger);
      for(let i=0;i<ticks.length;i++) {
        await page.evaluate(t=>window.stillformAnimations.forEach(a=>{a.currentTime=t;}),ticks[i]);
        await snap(i+1);
      }
      await page.evaluate(()=>window.stillformAnimations.forEach(a=>a.finish()));
    }
    const times=[0,16,32,48,64,80,96,112,128,144,176,208,240,280];
    await series('selection',clip,'[data-light="1"]',times);
    await page.goto(file('index'));
    await series('sheet',{x:180,y:8,width:600,height:638},'#open-feature',times);
    await page.setViewportSize({width:1440,height:720});
    await page.goto(pathToFileURL(path.join(root,'tools/cover.html')).href);
    await page.evaluate(()=>document.fonts.ready);
    await page.screenshot({path:path.join(out,'cover.png')});
  } finally { await browser.close(); }
}
capture().catch(e=>{console.error(e);process.exitCode=1;});
