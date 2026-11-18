const { test, expect } = require('@playwright/test');
const axe = require.resolve('axe-core/axe.min.js');

test('save, annotate, search and recover focus after removing the last saved record', async ({page}) => {
  await page.goto('/');
  await page.getByRole('button',{name:/Azurite/}).click();
  const dialog=page.getByRole('dialog');
  await dialog.getByLabel('Field note').fill('Blue facets by the edge.');
  await dialog.getByRole('button',{name:'Save specimen'}).click();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button',{name:/Azurite/})).toBeFocused();
  await page.reload();
  await page.getByRole('button',{name:'Saved',exact:true}).click();
  await expect(page.locator('.record')).toHaveCount(1);
  await page.locator('.record').click();
  await expect(dialog.getByLabel('Field note')).toHaveValue('Blue facets by the edge.');
  await dialog.getByRole('button',{name:'Remove from saved'}).click();
  await dialog.getByRole('button',{name:'Close'}).click();
  await expect(page.getByRole('button',{name:'Saved',exact:true})).toBeFocused();
  await expect(page.getByText('Your shelf is empty')).toBeVisible();
  await page.getByRole('button',{name:'Show all specimens'}).click();
  await page.getByLabel('Search specimens').fill('unobtainium');
  await expect(page.getByText('No matching specimens')).toBeVisible();
  await page.getByRole('button',{name:'Show all specimens'}).click();
  await expect(page.locator('.record')).toHaveCount(3);
});
test('tide chart, accessible table and persistent log agree after conversion', async ({page}) => {
  await page.goto('/tide.html');
  await page.getByLabel('Station',{exact:true}).selectOption({label:'West pier'});
  const range=page.getByRole('slider');
  await range.focus(); await page.keyboard.press('ArrowRight');
  const metres=parseFloat(await page.locator('#height').innerText());
  await page.getByRole('button',{name:'Feet'}).click();
  expect(Math.abs(parseFloat(await page.locator('#height').innerText()) - metres*3.28084)).toBeLessThan(.03);
  await page.getByText('Hourly data',{exact:true}).click();
  await expect(page.getByRole('row',{name:/09:00/})).toContainText(await page.locator('#height').innerText());
  await page.getByRole('button',{name:'Log reading'}).click({clickCount:2});
  await expect(page.locator('#log-list li')).toHaveCount(1);
  await page.reload();
  await expect(page.locator('#log-list')).toContainText('West pier · 09:00');
});
test('proof editing preserves a saved version and restores text and focus', async ({page}) => {
  await page.goto('/type.html');
  await page.getByLabel('Specimen text').fill('Rivers fold');
  await page.getByLabel('Typeface').selectOption('mono');
  await page.getByLabel('Italic').check();
  await page.getByRole('button',{name:'Save proof'}).click();
  await page.getByLabel('Specimen text').fill('Draft');
  await page.getByRole('button',{name:'Restore saved'}).click();
  await expect(page.getByLabel('Specimen text')).toBeFocused();
  await page.reload();
  await expect(page.locator('#proof-title')).toHaveText('Rivers fold');
  await expect(page.getByLabel('Italic')).toBeChecked();
  await expect(page.getByLabel('Typeface')).toHaveValue('mono');
});
test('print request validates, cancels, retries, removes and undoes', async ({page}) => {
  await page.goto('/controls.html');
  const submit=page.getByRole('button',{name:'Queue print'});
  await submit.click();
  await expect(page.getByLabel('Print title')).toHaveAttribute('aria-invalid','true');
  await page.getByLabel('Print title').fill('Night edition');
  await page.getByRole('radio',{name:'Gloss'}).check();
  await submit.click();
  await page.getByRole('button',{name:'Cancel request'}).click();
  await expect(page.getByLabel('Print title')).toHaveValue('Night edition');
  await page.getByText('Test printer connection').click();
  await page.getByLabel('Printer online').uncheck();
  await submit.click();
  await expect(page.getByRole('status')).toContainText('Printer offline');
  await expect(page.locator('#queue li')).toHaveCount(0);
  await page.getByLabel('Printer online').check();
  await submit.click();
  await expect(page.locator('#queue li')).toContainText('Gloss');
  await page.getByRole('button',{name:'Remove Night edition'}).click();
  await expect(page.getByRole('button',{name:'Undo removal'})).toBeFocused();
  await page.getByRole('button',{name:'Undo removal'}).click();
  await expect(page.getByRole('button',{name:'Remove Night edition'})).toBeFocused();
});
test('a blocked storage provider keeps work usable and reports its lifetime', async ({page}) => {
  await page.addInitScript(() => { Storage.prototype.setItem = () => { throw Error('Unavailable'); }; });
  await page.goto('/');
  await page.getByRole('button',{name:/Examine specimen/}).click();
  await page.getByRole('button',{name:'Save specimen'}).click();
  await expect(page.getByRole('dialog')).toContainText('for this visit');
});
for (const file of ['index','tide','type','controls','motion','agenda']) {
  for (const mode of ['light','dark']) {
    test(file + ' reflows and passes automated accessibility checks in ' + mode, async ({page}) => {
      const faults=[]; page.on('pageerror',e => faults.push(e.message));
      await page.setViewportSize({width:320,height:740});
      await page.emulateMedia({colorScheme:mode,reducedMotion:'reduce'});
      await page.goto('/' + file + '.html');
      await expect(page.getByRole('heading',{level:1})).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth<=innerWidth)).toBe(true);
      await page.addScriptTag({path:axe});
      const findings = await page.evaluate(async () => (await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}})).violations.map(v=>[v.id,v.nodes.map(n=>n.target)]));
      expect(findings).toEqual([]);
      expect(faults).toEqual([]);
    });
  }
}
test('modal retains keyboard focus and respects reduced motion', async ({page}) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  await page.getByRole('button',{name:/Examine specimen/}).click();
  await expect(page.getByRole('dialog')).toHaveCSS('animation-name','none');
  await page.getByRole('button',{name:'Close',exact:true}).focus();
  await page.keyboard.press('Tab'); await page.keyboard.press('Tab');
  expect(await page.evaluate(()=>document.querySelector('dialog').contains(document.activeElement))).toBe(true);
  await page.addScriptTag({path:axe});
  expect(await page.evaluate(async ()=>(await axe.run(document)).violations.map(v=>v.id))).toEqual([]);
});
test('light selection and rapid disclosure reversal retain their final state', async ({page}) => {
  await page.goto('/motion.html');
  const cool = page.getByRole('button',{name:'Cool',exact:true});
  await cool.click();
  await expect(cool).toHaveAttribute('aria-pressed','true');
  const toggle=page.getByRole('button',{name:'Lighting details'});
  await toggle.click(); await toggle.click(); await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded','true');
  await expect(page.locator('#setup')).toHaveJSProperty('inert',false);
  const opener=page.getByRole('button',{name:'Open light table'});
  await opener.click();
  await expect(page.getByRole('dialog')).toContainText('Cool light');
  await page.keyboard.press('Escape');
  await expect(opener).toBeFocused();
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(page.locator('.light-cursor')).toHaveCSS('transition-duration','0s');
});
test('long RTL content in an enlarged proof stays inside a compact viewport',async ({page})=>{
  await page.goto('/type.html');
  await page.setViewportSize({width:390,height:760});
  await page.getByLabel('Specimen text').fill('تجربة الطباعة '.repeat(5));
  await page.evaluate(()=>{document.documentElement.dir='rtl'; document.documentElement.style.fontSize='200%';});
  await expect(page.locator('#proof-title')).toHaveCSS('direction','rtl');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
test('agenda retains a conflicting draft, protects dirty dismissal and restores the edited booking',async({page})=>{
  await page.goto('/agenda.html');
  await page.getByRole('button',{name:'Edit Paper delivery'}).click();
  await page.getByLabel('Start time').fill('11:30');
  await page.getByRole('button',{name:'Save booking'}).click();
  await expect(page.locator('#event-error')).toContainText('overlaps Proof review');
  await expect(page.getByLabel('Start time')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog',{name:'Discard this draft?'})).toBeVisible();
  await page.getByRole('button',{name:'Keep editing'}).click();
  await expect(page.getByLabel('Start time')).toHaveValue('11:30');
  await page.getByLabel('Start time').fill('12:00');
  await page.getByRole('button',{name:'Save booking'}).click();
  await expect(page.getByRole('button',{name:'Edit Paper delivery'})).toBeFocused();
  await page.reload();
  await expect(page.locator('#events li').filter({hasText:'Paper delivery'})).toContainText('12:00');
  await page.getByRole('button',{name:'Next day'}).click();
  await expect(page.locator('#agenda-empty')).toBeVisible();
  await page.getByRole('button',{name:'New booking'}).click();
  await page.getByLabel('Booking name').fill('Discard me');
  await page.getByRole('button',{name:'Cancel',exact:true}).click();
  await page.getByRole('button',{name:'Discard changes'}).click();
  await expect(page.locator('#events li')).toHaveCount(0);
});
test('cancelled and duplicate requests cannot replace the latest result',async({page})=>{
  await page.goto('/controls.html');
  const events=await page.evaluate(async()=>{
    const changes=[];
    const task=Stillform.singleTask({
      busy:value=>changes.push('busy '+value),success:value=>changes.push(value),failure:err=>changes.push(err.message)
    });
    let late;
    const first=task.run(()=>new Promise(resolve=>{late=resolve;}));
    await task.run(()=>{throw Error('duplicate executed');});
    task.cancel();
    await task.run(async()=>'current');
    late('stale'); await first;
    return changes;
  });
  expect(events).toEqual(['busy true','busy false','busy true','busy false','current']);
});
