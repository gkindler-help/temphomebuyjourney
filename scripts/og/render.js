// Renders share cards: node scripts/og/render.js jobs.json   (jobs: [{title, eyebrow, calc, out}])
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
(async () => {
  const jobs = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  const b = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  await p.goto('file://' + path.join(__dirname, 'card.html'));
  await p.evaluate(() => document.fonts.ready);
  for (const j of jobs) {
    await p.evaluate(j => {
      document.getElementById('eb').textContent = j.eyebrow;
      const t = document.getElementById('t'); t.textContent = j.title; let s = 66; t.style.fontSize = s + 'px';
      while (t.scrollHeight > 3 * s * 1.08 + 4 && s > 42) { s -= 2; t.style.fontSize = s + 'px'; }
      document.body.classList.toggle('has-calc', !!j.calc);
    }, j);
    await p.screenshot({ path: j.out, type: 'jpeg', quality: 84 });
  }
  await b.close();
})();
