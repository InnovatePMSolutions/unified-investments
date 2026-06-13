# Unified Investments Inc. — Landing Page

**Property Preservation & Management Maintenance | Chicago & NW Indiana**

Production-ready static landing page engineered for high conversion, mobile-first performance, and seamless Netlify deployment. Built with semantic HTML5, a modular CSS design system, and vanilla JavaScript — zero frameworks, zero dependencies beyond Google Fonts and Font Awesome.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Design System Overview](#design-system-overview)
3. [Deployment to Netlify](#deployment-to-netlify)
4. [Updating Contact Information](#updating-contact-information)
5. [Form Configuration](#form-configuration)
6. [Adding a Second Page](#adding-a-second-page)
7. [Local Development](#local-development)
8. [Performance & SEO Checklist](#performance--seo-checklist)
9. [Maintenance Notes](#maintenance-notes)

---

## Project Structure

```
unified-investments/
├── index.html          # Main landing page (semantic HTML5)
├── netlify.toml        # Netlify build, redirect, header config
├── README.md           # This file
├── css/
│   └── styles.css      # Complete design system — link in every page
└── js/
    └── main.js         # Behavior layer — link in every page
```

**Architectural principle:** CSS and JS are fully decoupled from HTML. `css/styles.css` is the single source of truth for all design tokens, layout systems, typography, and components. Any future page (`about.html`, `gallery.html`, `portfolio.html`) gains the entire UI system by adding one line:

```html
<link rel="stylesheet" href="css/styles.css" />
```

---

## Design System Overview

All design decisions are encoded as CSS custom properties in `:root {}` at the top of `css/styles.css`. Modify these tokens to globally rebrand the site:

| Token | Value | Usage |
|---|---|---|
| `--primary` | `#0B2B40` | Deep Navy — header, hero, dark sections |
| `--secondary` | `#4A5D6B` | Steel Gray — secondary text, muted UI |
| `--accent` | `#E8891F` | Safety Amber — CTAs, icons, highlights |
| `--bg-main` | `#F8F9FA` | Off-White — page background |
| `--text-dark` | `#2D3E50` | Deep Slate — headings and bold text |
| `--white` | `#FFFFFF` | Card and form backgrounds |

**Fonts** are loaded from Google Fonts:
- `Montserrat` — headings (`--font-heading`)
- `Inter` — body copy (`--font-body`)

---

## Deployment to Netlify

### Option A: Drag & Drop (Fastest)

1. Go to [app.netlify.com](https://app.netlify.com) and log in.
2. From your dashboard, click **"Add new site" → "Deploy manually"**.
3. Drag the entire `unified-investments/` project folder onto the upload zone.
4. Netlify will deploy instantly. Your live URL appears at the top.
5. To assign a custom domain: **Site settings → Domain management → Add custom domain**.

### Option B: Git-Connected Deploy (Recommended for Ongoing Use)

1. Push the project to a GitHub, GitLab, or Bitbucket repository.
2. In Netlify: **"Add new site" → "Import an existing project"**.
3. Connect your Git provider and select the repository.
4. Configure build settings:
   - **Build command:** *(leave blank — static site, no build step)*
   - **Publish directory:** `.` *(root of the repo)*
5. Click **"Deploy site"**.
6. Every push to `main` (or your configured branch) will trigger a new deploy automatically.

### Confirming the Deploy is Healthy

After deployment, verify:
- [ ] Site loads at your Netlify URL
- [ ] Navigation links scroll correctly to each section
- [ ] Burger menu opens and closes on mobile viewport
- [ ] Form renders with all fields and the submit button
- [ ] No console errors in browser DevTools

---

## Updating Contact Information

All contact vectors are in `index.html`. Search for the comment `<!-- UPDATE:` to find every field that needs a real value:

### Phone Number
Two locations in `index.html`:

```html
<!-- Footer contact list -->
<a href="tel:+13125550100" class="footer__link">(312) 555-0100</a>

<!-- Mobile sticky CTA bar -->
<a href="tel:+13125550100" class="mobile-sticky-bar__btn mobile-sticky-bar__btn--call">
```

Replace `+13125550100` with your real number in E.164 format (e.g. `+17085551234`), and update the display text `(312) 555-0100` to match.

### Email Address

```html
<a href="mailto:operations@unifiedinvestmentsinc.com" class="footer__link">
  operations@unifiedinvestmentsinc.com
</a>
```

Replace both the `href` value and the link text with the real operational email address.

### Physical / Mailing Address

In the `<address>` block inside `<footer>`:

```html
<address class="footer__address">
  <p>Serving the Greater Chicagoland Area</p>
  <p>Chicago, IL & Northwest Indiana</p>
</address>
```

Update to include a full street address if desired, or keep as service-area description.

---

## Form Configuration

The bid request form uses **Netlify Forms** — no backend code required.

### How It Works

The `<form>` tag in `index.html` contains:
```html
<form
  name="bid-request"
  method="POST"
  action="/success"
  data-netlify="true"
  netlify-honeypot="bot-field"
>
  <input type="hidden" name="form-name" value="bid-request" />
  ...
</form>
```

Netlify's deploy parser detects `data-netlify="true"` and activates native form handling. Submissions are stored in your Netlify dashboard under **Site → Forms**.

### Setting Up Email Notifications

1. In Netlify dashboard: **Site settings → Forms → Form notifications**.
2. Click **"Add notification" → "Email notification"**.
3. Enter the email address that should receive bid request alerts.
4. Set the **form** to `bid-request`.
5. Save. Every new submission will send an immediate email.

### Viewing Submissions

All captured submissions are visible at:
`Netlify Dashboard → Your Site → Forms → bid-request`

### Post-Submission Success Page

The form `action="/success"` redirects after submission. Create a `success.html` file in the project root with a confirmation message. The `netlify.toml` already has a redirect rule pointing `/success` → `/success.html`.

Minimal example `success.html`:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bid Request Submitted | Unified Investments Inc.</title>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <header class="site-header">
    <!-- Copy nav from index.html -->
  </header>
  <main style="min-height:60vh; display:flex; align-items:center; justify-content:center; text-align:center; padding: 4rem 2rem;">
    <div>
      <i class="fa-solid fa-circle-check" style="font-size:4rem; color:var(--accent); margin-bottom:1.5rem;"></i>
      <h1>Bid Request Received</h1>
      <p>A field operations manager will respond within 2–4 business hours.</p>
      <a href="/" class="btn btn--accent" style="margin-top:2rem;">Return to Home</a>
    </div>
  </main>
  <script src="js/main.js"></script>
</body>
</html>
```

---

## Adding a Second Page

The CSS architecture is designed specifically for multi-page scalability. Here is the exact procedure to add, for example, an **About** page:

### Step 1: Create the HTML File

Copy the structural shell from `index.html` — specifically the `<head>`, `<header>` (nav), and `<footer>` blocks. Keep all three external resource links:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>About | Unified Investments Inc.</title>

  <!-- Same fonts and icon CDN as index.html -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" crossorigin="anonymous" />

  <!-- The global design system — this one line gives you everything -->
  <link rel="stylesheet" href="css/styles.css" />
</head>
<body>

  <!-- PASTE THE FULL <header class="site-header"> block from index.html -->

  <main>
    <!-- Your new page content here -->
    <!-- Use .container, .section, .section-header, .section-title, -->
    <!-- .section-eyebrow, .btn, etc. — they all just work. -->
  </main>

  <!-- PASTE THE FULL <footer class="site-footer"> block from index.html -->

  <script src="js/main.js"></script>
</body>
</html>
```

### Step 2: Activate the Nav Link

In both `index.html` and `about.html`, uncomment the About nav link:

**Desktop nav (inside `.nav-links`):**
```html
<!-- Remove these comment tags: -->
<li><a href="about.html" class="nav-link">About</a></li>
```

**Mobile drawer (inside `.mobile-drawer__links`):**
```html
<li><a href="about.html" class="mobile-drawer__link">About</a></li>
```

### Step 3: Use the Existing Design System

Every CSS class in `styles.css` is available immediately. Useful re-usable classes for new pages:

| Class | Purpose |
|---|---|
| `.container` | Max-width centered wrapper with responsive padding |
| `.section` | Vertical section padding (`5rem` top/bottom) |
| `.section--alt` | Alternate off-white section background |
| `.section-header` | Centered heading block with eyebrow/title/subtitle |
| `.section-eyebrow` | Small uppercase label above headings |
| `.section-title` | H2 heading styling |
| `.section-subtitle` | Body text below section titles |
| `.btn` | Base button class |
| `.btn--accent` | Orange CTA button |
| `.btn--outline` | Ghost button (for dark backgrounds) |
| `.btn--outline-dark` | Ghost button (for light backgrounds) |
| `.btn--sm` / `.btn--lg` | Size modifiers |
| `.why-card` | Icon + heading + body card (dark bg) |
| `.service-card` | White bordered service card with hover lift |

### Step 4: Page-Specific Styles (If Needed)

If a new page needs styles not in `styles.css`, add a **page-specific stylesheet** rather than modifying the global file:

```html
<!-- In about.html head, AFTER styles.css: -->
<link rel="stylesheet" href="css/about.css" />
```

This preserves the global design system and avoids unintended regressions on other pages.

---

## Local Development

No build tools are required. Preview the site using any of these methods:

### VS Code Live Server (Recommended)
1. Install the **Live Server** extension in VS Code.
2. Right-click `index.html` → **"Open with Live Server"**.
3. The browser auto-reloads on file saves.

### Python HTTP Server
```bash
# Navigate to the project root
cd unified-investments

# Python 3
python3 -m http.server 3000

# Open: http://localhost:3000
```

### Node.js HTTP Server
```bash
# Install once globally
npm install -g serve

# Run from project root
serve .

# Open the URL shown in your terminal
```

> **Important:** Do not open `index.html` directly via `file://` protocol. Netlify forms require an HTTP server context, and some browser security policies affect local file loading. Always use one of the servers above.

---

## Performance & SEO Checklist

Before going live, verify the following:

### SEO
- [ ] Update `<meta name="description">` in `index.html` with final copy
- [ ] Update `<meta property="og:title">` and `<meta property="og:description">` 
- [ ] Add `<meta property="og:image">` pointing to a real 1200×630 social card image
- [ ] Add `<link rel="canonical" href="https://yourdomain.com/">` in `<head>`
- [ ] Create and submit a `sitemap.xml` after all pages are live
- [ ] Add `robots.txt` to the project root (allow all crawlers)

### Performance
- [ ] Enable Netlify's **Asset Optimization** (minification + compression): Site settings → Build & deploy → Post processing → Asset optimization → Enable
- [ ] Verify Google Fonts load with `display=swap` (already configured)
- [ ] Run a Lighthouse audit in Chrome DevTools after deployment
- [ ] Confirm all image assets (if added later) have explicit `width` and `height` attributes

### Accessibility
- [ ] Test keyboard navigation through all interactive elements (Tab, Enter, Escape)
- [ ] Verify all form fields have visible labels
- [ ] Run axe DevTools or WAVE extension scan
- [ ] Check color contrast ratios (accent on white, white on primary — both pass WCAG AA)

### Cross-Browser Testing
- [ ] Chrome / Edge (latest)
- [ ] Safari (macOS and iOS)
- [ ] Firefox (latest)
- [ ] Samsung Internet (Android)
- [ ] Test at 320px, 375px, 768px, 1024px, 1440px viewport widths

---

## Maintenance Notes

### Updating Service Descriptions
All 8 service cards are in `index.html` between the comments:
```html
<!-- Service Card 1: Winterizations -->
...
<!-- Service Card 8: Initial / Make-Ready -->
```

Each card follows the same `<article class="service-card">` pattern. Edit the `<p class="service-card__desc">` text to update copy.

### Updating Coverage Areas
County and city listings are in the `<section class="service-area">` block inside `.coverage-list` elements, split into Illinois and Indiana panels.

### Changing the Accent Color
Update a single token in `css/styles.css`:
```css
:root {
  --accent: #E8891F;        /* Change this hex value */
  --accent-dark: #C9720F;   /* And this darker variant */
  --accent-light: #F5A044;  /* And this lighter variant */
}
```

All buttons, icons, badges, hover states, and form focus rings update globally.

### Adding Google Analytics or Tag Manager
Add your tracking snippet to `index.html` immediately before the closing `</head>` tag. Do not add it to `main.js` — keep the analytics concern in HTML where it belongs, and update the `Content-Security-Policy` in `netlify.toml` to include your analytics domain.

---

*Unified Investments Inc. Landing Page — Engineered for Netlify static deployment. All rights reserved.*
