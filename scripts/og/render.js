// Renders share cards: node scripts/og/render.js jobs.json   (jobs: [{title, eyebrow, calc, out, photo?}])
// A job with `photo` is rendered as that photo, center-cropped to 1200x630, instead of the title card.
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
(async () => {
  const jobs = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  const b = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  await p.goto('file://' + path.join(__dirname, 'card.html'));
  await p.evaluate(() => document.fonts.ready);
  let pp = null;
  for (const j of jobs) {
    if (j.photo) {
      if (!pp) pp = await b.newPage({ viewport: { width: 1200, height: 630 } });
      await pp.setContent('<html><body style="margin:0;width:1200px;height:630px;overflow:hidden;background:#000">'
        + '<img src="data:image/' + path.extname(j.photo).slice(1).replace('jpg', 'jpeg') + ';base64,' + fs.readFileSync(j.photo).toString('base64') + '" style="display:block;width:1200px;height:630px;object-fit:cover;object-position:center 55%"></body></html>');
      await pp.evaluate(() => document.querySelector('img').decode());
      await pp.screenshot({ path: j.out, type: 'jpeg', quality: 86 });
      continue;
    }
    await p.evaluate(j => {
      document.getElementById('eb').textContent = j.eyebrow;
      document.body.classList.toggle('has-calc', !!j.calc);
      // Centered layout so the middle 630px square (Facebook's comment crop) reads on its own.
      const t = document.getElementById('t'), c = document.querySelector('.col'); t.textContent = j.title; let s = 52; t.style.fontSize = s + 'px';
      while ((t.scrollHeight > 4 * s * 1.1 + 4 || c.scrollHeight > c.clientHeight) && s > 34) { s -= 2; t.style.fontSize = s + 'px'; }
    }, j);
    await p.screenshot({ path: j.out, type: 'jpeg', quality: 84 });
  }
  await b.close();
})();
