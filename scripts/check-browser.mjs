import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

const baseURL = process.env.PORTFOLIO_URL || 'http://localhost:5173';
const browser = await chromium.launch({ headless: true });
const results = [];
const errors = [];
const pass = name => { results.push(name); console.log(`PASS ${name}`); };
await mkdir('docs', { recursive: true });

async function scrollScene(page, id, progress) {
  await page.evaluate(({ id, progress }) => {
    const element = document.getElementById(id);
    window.scrollTo({ top: scrollY + element.getBoundingClientRect().top + (element.offsetHeight - innerHeight) * progress, behavior: 'instant' });
  }, { id, progress });
  await page.waitForTimeout(850);
}
async function scrollBeat(page, stage) {
  await page.evaluate(stage => {
    const row = document.querySelector(`.craft-beat[data-stage="${stage}"]`);
    const rect = row.getBoundingClientRect();
    const target = innerWidth < 768 ? .8 : .53;
    window.scrollTo({ top: scrollY + rect.top + rect.height / 2 - innerHeight * target, behavior: 'instant' });
  }, stage);
  await page.waitForTimeout(1000);
}
const captureErrors = page => {
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
};

try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await context.newPage(); captureErrors(page);
  await page.goto(baseURL, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => Number(document.querySelector('canvas[data-scene="portrait"]')?.dataset.frames) > 10);
  assert.match(await page.locator('canvas[data-scene="portrait"]').getAttribute('data-engine'), /three\.js/);
  assert.equal(await page.locator('.three-portrait').evaluate(element => element.classList.contains('is-ready')), true);
  pass('Portrait shader uses a live Three.js WebGL renderer and loads its texture');
  await page.screenshot({ path: 'docs/3d-hero.png' });

  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width, `Horizontal overflow at ${width}`);
  }
  pass('No horizontal overflow at 320, 390, 768, 1024, and 1440 pixels');
  await page.setViewportSize({ width: 1440, height: 1000 });

  await scrollScene(page, 'story', .1);
  const system = page.locator('canvas[data-scene="system"]');
  await system.waitFor();
  const firstCamera = await system.getAttribute('data-camera');
  const firstAssembly = await system.getAttribute('data-geometry');
  await scrollScene(page, 'story', .8);
  assert.notEqual(await system.getAttribute('data-camera'), firstCamera);
  assert.notEqual(await system.getAttribute('data-geometry'), firstAssembly);
  assert.equal(await system.getAttribute('data-stage'), '3');
  assert.match(await page.locator('#system-title').textContent(), /Built to grow/);
  pass('Scrolling moves the system camera, assembles the layers, and advances the story');
  await page.screenshot({ path: 'docs/3d-system.png' });
  await page.getByRole('button', { name: '02 Connect' }).click();
  await page.waitForTimeout(1000);
  assert.equal(await system.getAttribute('data-stage'), '1');
  pass('Engineering stages can also be selected with accessible buttons');

  let geometry = null;
  for (const stage of [0, 1, 2, 3]) {
    await scrollBeat(page, stage);
    const craft = page.locator('canvas[data-scene="craft"]');
    assert.equal(await craft.getAttribute('data-stage'), String(stage));
    const nextGeometry = await craft.getAttribute('data-geometry');
    assert.ok(nextGeometry);
    if (geometry) assert.notEqual(nextGeometry, geometry);
    geometry = nextGeometry;
    await page.screenshot({ path: `docs/3d-craft-${['sphere', 'lattice', 'laptop', 'helix'][stage]}.png` });
  }
  pass('The Three.js point cloud morphs into four distinct geometry targets as process beats change');

  const craft = page.locator('canvas[data-scene="craft"]');
  const craftBounds = await page.locator('.three-craft').boundingBox();
  assert.ok(craftBounds);
  const restingBloom = await craft.getAttribute('data-geometry');
  await page.mouse.move(craftBounds.x + craftBounds.width / 2, craftBounds.y + craftBounds.height / 2);
  await page.waitForTimeout(500);
  const activeBloom = await craft.getAttribute('data-geometry');
  assert.notEqual(activeBloom, restingBloom, 'Hovering the sculpture should activate its local particle bloom');
  await page.mouse.move(1, 1);
  await page.waitForTimeout(500);
  assert.match(await craft.getAttribute('data-geometry'), /bloom=0\.\d+/);
  pass('Pointer hover locally scatters and brightens the particle sculpture');

  await page.getByRole('button', { name: 'Pause motion', exact: true }).click();
  await page.waitForTimeout(200);
  const pausedFrames = await craft.getAttribute('data-frames');
  await page.waitForTimeout(450);
  assert.equal(await craft.getAttribute('data-frames'), pausedFrames);
  assert.equal(await craft.getAttribute('data-paused'), 'true');
  await page.getByRole('button', { name: 'Resume motion', exact: true }).click();
  await page.waitForTimeout(350);
  assert.notEqual(await craft.getAttribute('data-frames'), pausedFrames);
  pass('Pause freezes WebGL rendering and Resume restarts it');

  await scrollScene(page, 'worlds', .45);
  const world = page.locator('canvas[data-scene="world"]');
  await world.waitFor();
  await page.screenshot({ path: 'docs/3d-world.png' });
  const inactiveFrames = await craft.getAttribute('data-frames');
  await page.waitForTimeout(300);
  assert.equal(await craft.getAttribute('data-frames'), inactiveFrames);
  pass('Offscreen WebGL scenes stop rendering');
  await page.getByRole('button', { name: 'Explore this world', exact: true }).click();
  await page.waitForTimeout(200);
  assert.equal(await page.locator('#worlds').evaluate(element => element.classList.contains('is-exploring')), true);
  const orbitCamera = await world.getAttribute('data-camera');
  await page.keyboard.press('ArrowRight'); await page.waitForTimeout(250);
  assert.notEqual(await world.getAttribute('data-camera'), orbitCamera);
  const keyCamera = await world.getAttribute('data-camera');
  await page.mouse.move(1050, 420); await page.mouse.down(); await page.mouse.move(1230, 490, { steps: 8 }); await page.mouse.up(); await page.waitForTimeout(250);
  assert.notEqual(await world.getAttribute('data-camera'), keyCamera);
  await page.screenshot({ path: 'docs/3d-world-explore.png' });
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#worlds').evaluate(element => element.classList.contains('is-exploring')), false);
  assert.equal(await page.getByRole('button', { name: 'Explore this world' }).evaluate(element => element === document.activeElement), true);
  pass('World exploration supports mouse drag, keyboard orbit, Escape, and focus restoration');

  await page.getByRole('link', { name: 'Explore my work', exact: true }).click();
  await page.waitForFunction(() => document.querySelector('.chapter-indicator')?.textContent.includes('Selected work'));
  assert.match(await page.locator('.chapter-indicator').textContent(), /Selected work/);
  for (const name of ['Orbit', 'Forma', 'Pulse']) {
    const trigger = page.getByRole('button', { name: `View ${name} case study`, exact: true });
    await trigger.click();
    assert.equal(await page.locator('dialog').evaluate(element => element.open), true);
    for (let i = 0; i < 7; i++) await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => Boolean(document.activeElement?.closest('dialog'))), true);
    await page.keyboard.press('Escape');
    assert.equal(await trigger.evaluate(element => element === document.activeElement), true);
  }
  pass('Existing work navigation and all project dialogs retain keyboard behavior');
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: 'Copy email address' }).click();
  assert.equal(await page.evaluate(() => navigator.clipboard.readText()), 'askadarshskumar@gmail.com');
  pass('Email copying remains functional');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(baseURL, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.locator('#mobile-menu').getByRole('link', { name: /Work/ }).click();
  assert.equal(await page.getByRole('button', { name: 'Open menu' }).getAttribute('aria-expanded'), 'false');
  for (const [id, value, filename] of [['story', .45, '3d-system-mobile'], ['worlds', .5, '3d-world-mobile']]) {
    await scrollScene(page, id, value);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 390);
    await page.screenshot({ path: `docs/${filename}.png` });
  }
  await scrollBeat(page, 2);
  await page.screenshot({ path: 'docs/3d-craft-mobile.png' });
  pass('Mobile navigation and all immersive scenes fit the viewport');
  await context.close();

  const reducedContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const reducedPage = await reducedContext.newPage(); captureErrors(reducedPage);
  await reducedPage.goto(baseURL, { waitUntil: 'networkidle' });
  await reducedPage.locator('#story').scrollIntoViewIfNeeded();
  await reducedPage.locator('canvas[data-scene="system"]').waitFor();
  await reducedPage.waitForTimeout(250);
  const reducedCanvas = reducedPage.locator('canvas[data-scene="system"]');
  const initialReducedFrames = await reducedCanvas.getAttribute('data-frames');
  await reducedPage.waitForTimeout(300);
  assert.equal(await reducedCanvas.getAttribute('data-frames'), initialReducedFrames);
  const staticGeometry = await reducedCanvas.getAttribute('data-geometry');
  await reducedPage.getByRole('button', { name: '04 Evolve' }).click();
  await reducedPage.waitForTimeout(200);
  assert.equal(await reducedCanvas.getAttribute('data-stage'), '3');
  assert.notEqual(await reducedCanvas.getAttribute('data-geometry'), staticGeometry);
  assert.equal(await reducedPage.locator('#story').evaluate(element => element.classList.contains('reduced-story')), true);
  await reducedPage.locator('#process').scrollIntoViewIfNeeded();
  const design = reducedPage.getByRole('button', { name: '02 Design', exact: true });
  await design.click(); assert.equal(await design.getAttribute('aria-expanded'), 'true');
  await design.click(); assert.equal(await design.getAttribute('aria-expanded'), 'false');
  await reducedPage.locator('#worlds').scrollIntoViewIfNeeded();
  assert.equal(await reducedPage.getByRole('button', { name: 'Explore this world' }).isDisabled(), true);
  assert.equal(await reducedPage.evaluate(() => document.documentElement.scrollWidth), 390);
  pass('Reduced motion renders static artwork, supports stage controls and accordions, and shortens pinned stories');
  await reducedContext.close();

  const fallbackContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const fallbackPage = await fallbackContext.newPage(); captureErrors(fallbackPage);
  await fallbackPage.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      if (type === 'webgl2' || type === 'webgl') return null;
      return original.call(this, type, ...args);
    };
  });
  await fallbackPage.goto(baseURL, { waitUntil: 'networkidle' });
  await fallbackPage.waitForFunction(() => document.querySelector('.three-portrait')?.classList.contains('scene-failed'));
  await fallbackPage.waitForFunction(() => getComputedStyle(document.querySelector('.hero-portrait')).opacity === '1');
  await scrollScene(fallbackPage, 'story', .4);
  assert.equal(await fallbackPage.locator('#system-title').isVisible(), true);
  await scrollScene(fallbackPage, 'worlds', .3);
  await fallbackPage.waitForTimeout(200);
  assert.equal(await fallbackPage.getByRole('button', { name: 'Explore this world' }).isDisabled(), true);
  assert.equal(await fallbackPage.evaluate(() => document.documentElement.scrollWidth), 390);
  pass('WebGL-unavailable devices retain the portrait, story, fallback artwork, and readable content');
  await fallbackContext.close();
  assert.deepEqual(errors, []);
  pass('No JavaScript errors, shader errors, or failed resource requests');
  const report = { checkedAt: new Date().toISOString(), browser: browser.version(), baseURL, results, errors };
  await writeFile('docs/browser-results.json', JSON.stringify(report, null, 2) + '\n');
  console.log(`\n${results.length} browser checks passed.`);
} finally { await browser.close(); }
