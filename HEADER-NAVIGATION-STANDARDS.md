# 📋 **HEADER NAVIGATION STANDARDS - STL Home Journey**

## **UNIFORM HEADER SYSTEM**

All pages (except tools) should have a consistent header with:
1. **Logo** with link to homepage
2. **Site name** with branding
3. **Navigation** appropriate to page type

---

## **🎨 HEADER PATTERNS BY PAGE TYPE**

### **1. ARTICLE PAGES (54 pages)**

**Header Class:** `.art-hdr`  
**Structure:**
```html
<header class="art-hdr">
  <a href="../index.html" class="art-hdr-l">
    <div class="art-hdr-ico">
      <img src="../assets/STLhomebuyerjourneylogo.png" alt="STL Home Journey" onerror="this.style.display='none'">
    </div>
    <div>
      <div class="art-hdr-t"><span>STL</span> Home Journey</div>
      <div class="art-hdr-name">George Kindler</div>
      <div class="art-hdr-tagline">13 Years Experience At Your Fingertips</div>
    </div>
  </a>
  <nav class="art-hdr-nav">
    <a href="index.html" class="art-hdr-btn">Guides</a>
    <a href="../index.html" class="art-hdr-btn gold">Journey</a>
  </nav>
</header>
```

**Navigation:**
- ✅ "Guides" → Articles index
- ✅ "Journey" (gold) → Homepage

**Logo Path:** `../assets/STLhomebuyerjourneylogo.png`  
**Logo Link:** `../index.html`

**STATUS:** ✅ Implemented on all articles

---

### **2. NEIGHBORHOOD PAGES (98 pages)**

**Header Class:** `.nbhd-hdr`  
**Structure:**
```html
<header class="nbhd-hdr">
  <a href="../index.html" class="nbhd-hdr-l">
    <div class="nbhd-hdr-ico">
      <img src="../assets/STLhomebuyerjourneylogo.png" alt="STL Home Journey" onerror="this.style.display='none'">
    </div>
    <div>
      <div class="nbhd-hdr-t"><span>STL</span> Home Journey</div>
      <div class="nbhd-hdr-name">George Kindler</div>
      <div class="nbhd-hdr-tagline">98 Neighborhoods Analyzed</div>
    </div>
  </a>
  <nav class="nbhd-hdr-nav">
    <a href="index.html" class="nbhd-hdr-btn">Neighborhoods</a>
    <a href="../index.html" class="nbhd-hdr-btn gold">Journey</a>
  </nav>
</header>
```

**Navigation:**
- ✅ "Neighborhoods" → Neighborhoods index
- ✅ "Journey" (gold) → Homepage

**Logo Path:** `../assets/STLhomebuyerjourneylogo.png`  
**Logo Link:** `../index.html`

**STATUS:** ✅ Implemented on all neighborhoods

---

### **3. ABOUT PAGE**

**Header Class:** `.header`  
**Structure:**
```html
<header class="header">
  <div class="header-inner">
    <a href="index.html" class="logo-link">
      <div class="logo-ico">
        <img src="assets/STLhomebuyerjourneylogo.png" alt="STL Home Journey" onerror="this.style.display='none'">
      </div>
      <div>
        <div class="logo-wordmark"><span>STL</span> Home Journey</div>
        <div class="logo-name">George Kindler</div>
      </div>
    </a>
    <a href="index.html" class="back-btn">← BACK TO JOURNEY</a>
  </div>
</header>
```

**Navigation:**
- ✅ "← BACK TO JOURNEY" → Homepage

**Logo Path:** `assets/STLhomebuyerjourneylogo.png`  
**Logo Link:** `index.html`

**STATUS:** ✅ Fixed (was using wrong logo file)

---

### **4. HOMEPAGE**

**Header Class:** `.hdr .idx-hidden`  
**Note:** Homepage uses **shared.js** to render navigation  
**DO NOT MODIFY** - Controlled by dashboard system

**STATUS:** ✅ Uses shared.js navigation (DO NOT TOUCH)

---

### **5. TOOL PAGES (6 pages)**

**Status:** Most tools have NO header (loaded in iframe)  
**Reason:** Tools load inside tool panel, don't need duplicate header

**Tools:**
- prep.html (no header)
- afford.html (has header but minimal)
- home-cost.html (no header)
- compare.html (no header)
- fails.html (has header but minimal)
- neighborhood-matcher.html (no header)

**Recommendation:** Leave as-is (tools are embedded, don't need full navigation)

---

## **📐 LOGO FILE SPECIFICATIONS**

### **Logo File:**
- **Filename:** `STLhomebuyerjourneylogo.png`
- **Location:** `/assets/STLhomebuyerjourneylogo.png`
- **Size:** 850 KB
- **Dimensions:** 512x512px (square icon)

### **Paths by Page Type:**
- **Articles:** `../assets/STLhomebuyerjourneylogo.png`
- **Neighborhoods:** `../assets/STLhomebuyerjourneylogo.png`
- **About/Root pages:** `assets/STLhomebuyerjourneylogo.png`
- **Homepage:** `assets/STLhomebuyerjourneylogo.png`

### **Alt Text:**
Always use: `alt="STL Home Journey"`

### **Error Handling:**
Always include: `onerror="this.style.display='none'"`  
(Gracefully hides if logo fails to load)

---

## **🎨 HEADER CSS CLASSES**

### **Article Header (.art-hdr)**
```css
.art-hdr {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: rgba(5,5,5,0.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--line);
  position: sticky;
  top: 0;
  z-index: 100;
}
```

### **Neighborhood Header (.nbhd-hdr)**
```css
.nbhd-hdr {
  background: rgba(5,5,5,.96);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--line);
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
}
```

### **Common Properties:**
- ✅ Sticky positioning (`position: sticky; top: 0`)
- ✅ Backdrop blur for depth
- ✅ High z-index (100) for layering
- ✅ Dark background with transparency
- ✅ Bottom border for separation

---

## **🔗 NAVIGATION PATTERNS**

### **Two-Button Navigation (Articles & Neighborhoods):**
```html
<nav class="art-hdr-nav">
  <a href="index.html" class="art-hdr-btn">Guides</a>
  <a href="../index.html" class="art-hdr-btn gold">Journey</a>
</nav>
```

**Button 1:** Section index (Guides/Neighborhoods)  
**Button 2:** Homepage (gold accent)

### **Single-Button Navigation (About):**
```html
<a href="index.html" class="back-btn">← BACK TO JOURNEY</a>
```

**Simple:** One clear path back to homepage

---

## **✅ IMPLEMENTATION CHECKLIST**

**For New Articles:**
- [ ] Copy header from STANDARD-HEADER-ARTICLE.html
- [ ] Verify logo path: `../assets/STLhomebuyerjourneylogo.png`
- [ ] Verify navigation: Guides + Journey
- [ ] Test logo link returns to homepage

**For New Neighborhood Pages:**
- [ ] Use `.nbhd-hdr` class
- [ ] Logo path: `../assets/STLhomebuyerjourneylogo.png`
- [ ] Navigation: Neighborhoods + Journey
- [ ] Test all links

**For Standalone Pages:**
- [ ] Use `.header` class (like about.html)
- [ ] Logo path: `assets/STLhomebuyerjourneylogo.png` (no ../)
- [ ] Simple back button to homepage
- [ ] Verify logo displays correctly

---

## **🚨 COMMON MISTAKES TO AVOID**

❌ **WRONG:** `src="assets/stl-home-journey-icon.png"` (file doesn't exist)  
✅ **RIGHT:** `src="assets/STLhomebuyerjourneylogo.png"`

❌ **WRONG:** `<img src="../assets/logo.png">` (missing error handler)  
✅ **RIGHT:** `<img src="../assets/STLhomebuyerjourneylogo.png" onerror="this.style.display='none'">`

❌ **WRONG:** Logo link points to `#` or nothing  
✅ **RIGHT:** Logo always links to homepage (`index.html` or `../index.html`)

❌ **WRONG:** Missing alt text  
✅ **RIGHT:** `alt="STL Home Journey"`

---

## **📊 CURRENT STATUS**

| Page Type | Count | Header Status | Logo Status |
|-----------|-------|---------------|-------------|
| **Articles** | 54 | ✅ Standardized | ✅ Correct |
| **Neighborhoods** | 98 | ✅ Standardized | ✅ Correct |
| **About** | 1 | ✅ Fixed | ✅ Fixed |
| **Homepage** | 1 | ✅ Uses shared.js | ✅ Correct |
| **Tools** | 6 | ⚠️ Minimal/None | N/A |

**Total Pages with Headers:** 153  
**Broken Logo Links:** ✅ **0 (ALL FIXED)**

---

## **🔧 MAINTENANCE**

### **When Adding New Articles:**
1. Copy from `STANDARD-HEADER-ARTICLE.html`
2. Paste into new article `<body>` opening
3. Verify navigation links

### **When Adding New Neighborhood Pages:**
1. Use existing neighborhood page as template
2. Keep `.nbhd-hdr` structure
3. Maintain navigation pattern

### **DO NOT MODIFY:**
- ✅ Homepage header (controlled by shared.js)
- ✅ Tool headers (minimal by design for iframe embedding)

---

## **📁 REFERENCE FILES**

**Templates:**
- `/STANDARD-HEADER-ARTICLE.html` - Copy/paste article header
- Any article file - Working example of article header
- Any neighborhood file - Working example of neighborhood header

**Logo Asset:**
- `/assets/STLhomebuyerjourneylogo.png` - Main logo file

**Documentation:**
- This file - Header standards reference

---

**Last Updated:** May 23, 2026  
**Status:** ✅ All headers standardized and functional
