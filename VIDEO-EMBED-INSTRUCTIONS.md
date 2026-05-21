# How to Add Your VA Appraisal Video to the Articles

## Current State
All 5 VA articles have conditional video embeds set to **hidden**:
```javascript
const videoId = false;
```

## When Your Video is Ready

### Step 1: Get Your YouTube Video ID
From your YouTube video URL, grab the ID:
- **Full URL:** `https://www.youtube.com/watch?v=QcEXfSi6yjQ`
- **Video ID:** `QcEXfSi6yjQ` (the part after `?v=`)

### Step 2: Edit the Article Files

Open any article HTML file and find this section near the bottom:

```javascript
<script>
  const videoId = false; // Change this to your YouTube video ID when ready
  
  if (videoId) {
    const videoContainer = document.getElementById('video-container');
    videoContainer.innerHTML = `
      <div class="video-embed">
        <iframe src="https://www.youtube.com/embed/${videoId}" ...
```

**Change this line:**
```javascript
const videoId = false;
```

**To this:**
```javascript
const videoId = 'QcEXfSi6yjQ';  // Your actual video ID
```

### Step 3: Choose Which Articles Get the Video

You can add the video to **all 5 articles** or just **specific ones**:

#### Option A: Same video in all articles
Edit all 5 files with the same video ID:
- `va-home-loan-st-louis-what-kills-deals.html`
- `federal-pacific-panel-va-loan-st-louis.html`
- `can-you-buy-fixer-upper-va-loan-st-louis.html`
- `va-appraisal-failed-st-louis-what-happens-next.html`
- `how-to-screen-stl-homes-before-va-offer.html`

#### Option B: Different videos per article
If you create topic-specific videos:
- Hub article: General VA appraisal overview
- Federal Pacific article: Electrical panel walkthrough
- Screening article: Property inspection demo

#### Option C: Video only in hub article
Just edit `va-home-loan-st-louis-what-kills-deals.html`

---

## What Happens When You Add the Video

### Before (videoId = false):
- No video section appears at all
- Article goes straight from metadata to body content
- No broken embeds, no empty space

### After (videoId = 'QcEXfSi6yjQ'):
- Video embed appears at top of article (after metadata, before body)
- Caption appears below video
- Fully responsive (works on mobile)

---

## Example: Adding Video to Hub Article

**File:** `articles/va-home-loan-st-louis-what-kills-deals.html`

**Find this (around line 420):**
```javascript
<script>
  // Conditional video embed
  // Set videoId to false or empty string to hide the video section entirely
  // Set videoId to a YouTube video ID (e.g., 'dQw4w9WgXcQ') to show the embed
  
  const videoId = false; // Change this to your YouTube video ID when ready
```

**Change to:**
```javascript
  const videoId = 'QcEXfSi6yjQ'; // VA appraisal walkthrough video
```

**Save the file. Done.**

The video will now appear at the top of the article when loaded.

---

## Custom Captions Per Article

Each article has a default caption. You can customize them:

**Hub article caption:**
```javascript
<p class="video-caption">VA appraisal walkthrough: what the appraiser looks for and why deals fail</p>
```

**Federal Pacific article caption:**
```javascript
<p class="video-caption">How to identify a Federal Pacific panel and why VA appraisers flag them</p>
```

**Fixer-upper article caption:**
```javascript
<p class="video-caption">What fixer-upper actually means for VA buyers in St. Louis</p>
```

**Appraisal failed article caption:**
```javascript
<p class="video-caption">What to do when a VA appraisal fails in St. Louis</p>
```

**Screening article caption:**
```javascript
<p class="video-caption">How to screen St. Louis homes before making a VA offer</p>
```

To customize, find the caption text in the `<script>` section and edit it.

---

## Testing

After adding the video ID:

1. Open the HTML file in a browser
2. The video should appear at the top
3. Click play to verify it loads correctly
4. Check on mobile (should be responsive)

---

## Troubleshooting

**Video doesn't appear:**
- Check you changed `false` to your actual video ID in quotes
- Check the video ID is correct (no extra characters)
- Check the video is public on YouTube (not private/unlisted)

**Video appears but won't play:**
- Check the YouTube video is embeddable (not restricted)
- Check for any browser console errors
- Try a different browser

**Video appears but caption is wrong:**
- Edit the caption text inside the `<p class="video-caption">` tag
