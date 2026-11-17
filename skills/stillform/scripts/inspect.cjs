#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');

async function inspect() {
  const [url, directory] = process.argv.slice(2);
  if (!url || !directory) throw Error('Usage: node inspect.cjs <url> <output-directory>');
  const target = new URL(url);
  if (!['http:', 'https:', 'file:'].includes(target.protocol)) throw Error('Use an HTTP, HTTPS or local file URL.');
  const resolve = createRequire(path.join(process.cwd(), 'package.json'));
  const { chromium } = resolve('playwright');
  let axe;
  try { axe = resolve.resolve('axe-core/axe.min.js'); } catch { /* optional audit dependency */ }
  fs.mkdirSync(directory, {recursive:true});
  const browser = await chromium.launch(process.env.EDGE_PATH ? {executablePath:process.env.EDGE_PATH} : {});
  const report=[];
  try {
    for (const preset of [
      {id:'compact',width:320,height:740,theme:'light'},
      {id:'wide-dark',width:1280,height:900,theme:'dark'},
      {id:'enlarged-rtl',width:390,height:844,theme:'light',stress:true}
    ]) {
      const page=await browser.newPage({viewport:{width:preset.width,height:preset.height},colorScheme:preset.theme,reducedMotion:'reduce'});
      const errors=[]; page.on('pageerror',e=>errors.push(e.message));
      const response=await page.goto(target.href,{waitUntil:'load'});
      if(response && !response.ok()) throw Error('Target returned HTTP ' + response.status());
      if(preset.stress) await page.evaluate(()=>{
        document.documentElement.dir='rtl'; document.documentElement.style.fontSize='200%';
      });
      await page.evaluate(()=>document.fonts.ready);
      const facts=await page.evaluate(()=>({
        title:document.title, headings:[...document.querySelectorAll('h1,h2')].map(h=>h.textContent.trim()),
        viewport:innerWidth, documentWidth:document.documentElement.scrollWidth,
        overflowing:[...document.querySelectorAll('main *')].filter(e=>{
          const b=e.getBoundingClientRect(); return b.width>0 && (b.right>innerWidth+1 || b.left < -1);
        }).slice(0,20).map(e=>e.id || e.tagName)
      }));
      let violations=null;
      if(axe) {
        await page.addScriptTag({path:axe});
        violations=await page.evaluate(async()=>(await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}})).violations.map(v=>({id:v.id,impact:v.impact,targets:v.nodes.map(n=>n.target)})));
      }
      await page.screenshot({path:path.join(directory,preset.id+'.png'),fullPage:true});
      report.push({preset,...facts,errors,violations});
      await page.close();
    }
  } finally { await browser.close(); }
  fs.writeFileSync(path.join(directory,'inspection.json'),JSON.stringify(report,null,2));
  console.log('Captured ' + report.length + ' inspection states in ' + directory);
  if(report.some(r=>r.errors.length || r.documentWidth>r.viewport || r.violations?.length)) process.exitCode=1;
}
inspect().catch(e=>{console.error(e.message);process.exitCode=1;});
