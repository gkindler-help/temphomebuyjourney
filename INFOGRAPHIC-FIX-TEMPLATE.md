# INFOGRAPHIC CONDITIONAL DISPLAY FIX

Apply this replacement to ALL 8 income articles:
- how-much-house-afford-making-50k-st-louis.html
- how-much-house-afford-making-60k-st-louis.html  
- how-much-house-afford-making-70k-st-louis.html ✅ DONE
- how-much-house-afford-making-80k-st-louis.html
- how-much-house-afford-making-100k-st-louis.html
- how-much-house-afford-making-120k-st-louis.html
- how-much-house-afford-making-150k-st-louis.html
- how-much-house-afford-making-200k-st-louis.html

---

## FIND AND REPLACE

**Search for section starting with:**
```html
<div class="infographic-section" style="margin:56px 0;">
  <h3 style="...">VISUAL GUIDE: YOUR COMPLETE BUDGET BREAKDOWN</h3>
```

**Replace entire section through closing `</div>` with:**

### For 50K article:
```html
<div class="infographic-section" id="infographicSection" style="margin:56px 0;display:none;">
  <h3 style="font-size:1.15rem;font-weight:700;color:var(--gold);margin:0 0 24px 0;text-align:center;letter-spacing:.03em;">VISUAL GUIDE: YOUR COMPLETE BUDGET BREAKDOWN</h3>
  <img id="infographicImage" src="../assets/infographics/affordability-50K-infographic.jpg" 
       alt="50K Income St. Louis Home Buying Budget Breakdown" 
       style="width:100%;max-width:900px;height:auto;margin:0 auto;display:block;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.3);">
</div>

<script>
(function() {
  const img = new Image();
  img.src = '../assets/infographics/affordability-50K-infographic.jpg';
  img.onload = function() { document.getElementById('infographicSection').style.display = 'block'; };
  img.onerror = function() { document.getElementById('infographicSection').style.display = 'none'; };
})();
</script>
```

### For 60K article:
```html
<div class="infographic-section" id="infographicSection" style="margin:56px 0;display:none;">
  <h3 style="font-size:1.15rem;font-weight:700;color:var(--gold);margin:0 0 24px 0;text-align:center;letter-spacing:.03em;">VISUAL GUIDE: YOUR COMPLETE BUDGET BREAKDOWN</h3>
  <img id="infographicImage" src="../assets/infographics/affordability-60K-infographic.jpg" 
       alt="60K Income St. Louis Home Buying Budget Breakdown" 
       style="width:100%;max-width:900px;height:auto;margin:0 auto;display:block;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.3);">
</div>

<script>
(function() {
  const img = new Image();
  img.src = '../assets/infographics/affordability-60K-infographic.jpg';
  img.onload = function() { document.getElementById('infographicSection').style.display = 'block'; };
  img.onerror = function() { document.getElementById('infographicSection').style.display = 'none'; };
})();
</script>
```

### For 70K article:
✅ **ALREADY FIXED**

### For 80K, 100K, 120K, 150K, 200K articles:
Same pattern - just change the filename to match income level.

