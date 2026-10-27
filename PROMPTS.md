# 78983.com — Phase-wise Build Prompts

Copy each prompt into your AI builder in order. Every phase assumes the previous one is done. Global rules apply to **every** phase.

## Global rules (paste at the top of every prompt)
```
Project: 78983.com — "Step up your numbers": free money, business & AI calculators.
Stack: static HTML/CSS/vanilla JS only, no build step, hostable on GitHub Pages free plan. Relative links only.
Every page: <head> includes exactly
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6620975821265271" crossorigin="anonymous"></script>
plus <meta name="google-adsense-account" content="ca-pub-6620975821265271"> and Google Consent Mode v2 defaults (denied until accepted).
Top of every page, first element: a bar with the text "contact, if you are interested in this website/domain name/Sponsorship/Advertisement/Partnership" linking to https://web.works/contact.
All forms deliver to ONE inbox via FormSubmit AJAX. The address must never appear in HTML, JS strings, mailto links or comments — store it only as an encoded char-code array decoded at submit time.
No copyrighted text or images from other sites. Original copy only. No trademark claims on "78983".
Accessibility: labelled inputs, keyboard support, prefers-reduced-motion, no horizontal scroll at 360px. Light + dark theme.
```

## Phase 1 — Foundation & design system
```
Create the repo skeleton: index.html, assets/css/style.css, assets/js/main.js, favicon.svg (three ascending bars + gold dot), site.webmanifest, robots.txt, sitemap.xml, ads.txt ("google.com, pub-6620975821265271, DIRECT, f08c47fec0942fa0"), .nojekyll, 404.html.
Design tokens on :root (ink #0d1526, emerald brand #0f9f6e, gold #e6a400) with dark-mode overrides via prefers-color-scheme and [data-theme]. Fonts: Space Grotesk (display) + Inter (body).
Build a shared header (logo, nav: Calculators, Number Explorer, Learn, Contests, Get Matched, Support; theme toggle; mobile burger), footer (newsletter form, link columns, trademark/copyright notice), cookie-consent banner wired to gtag consent update, back-to-top, toast helper, scroll-reveal.
```

## Phase 2 — Calculator engine
```
Write assets/js/calc.js: a dependency-free engine. Each calculator is a config {inputs:[{id,label,min,max,step,v,money}], calc(values)->{results, chart, table, note}}.
Engine renders: currency selector (USD, CAD, INR, EUR, GBP, AUD via Intl.NumberFormat), number field + synced range slider per input, live results cards (first one highlighted), canvas chart (line or stacked bar with legend and axis labels, HiDPI aware), collapsible schedule table, actions: Share (navigator.share / copy link), Download CSV, Print, "Get a free expert review" linking to get-matched.html?topic=…&source=….
Inputs are mirrored into the URL query string so any result is shareable, and read back on load. Reset-to-defaults button.
```

## Phase 3 — 12 calculator pages + hub
```
Generate calculators/<slug>.html for: compound-interest, loan-emi, mortgage (with tax & insurance), retirement (nominal vs inflation-adjusted + withdrawal income), savings-goal, inflation, roi (ROI + CAGR), debt-payoff (with extra-payment comparison), startup-runway (growth-modeled, break-even month), ai-cost (tokens, cache share, cache discount; prices are user inputs), freelance-rate, percentage.
Each page: breadcrumb, H1, 2-sentence intro, calculator, "How to use" steps, formula block, worked example, tips, one embedded YouTube lesson (privacy-enhanced, click-to-load), 3–4 FAQs, related-calculators sidebar, support CTA, lead-gen band. JSON-LD: WebApplication + FAQPage + BreadcrumbList. "Estimates only — last reviewed <date>" line.
calculators/index.html: search, category filter chips, card grid, "Request a calculator" form.
```

## Phase 4 — Home page & Number Explorer
```
index.html: hero with headline "Step up your numbers. Decide with the math.", site search with autocomplete, inline quick compound-interest widget with two sliders, stats row, most-used calculators grid, Number Explorer teaser (78983 = 19 × 4157, digital root 8), 3 video lessons, lead-gen band, contests/careers/support cards, FAQ with FAQPage schema, WebSite + Organization schema.
number-explorer.html + assets/js/explorer.js: input any whole number → words, prime test, prime factorization, divisors, digit sum/digital root, binary/hex/octal, Roman numeral, square/root, patterns (palindrome, ascending run, repdigit), cultural notes per digit framed as folklore. Long-form section "Why numbers matter in commerce" and a factual note on 78983 (incl. unrelated Mexican postal code).
```

## Phase 5 — Lead generation (highest-value section)
```
get-matched.html: 3-step form with progress bar — (1) topic radio tiles: mortgage, loans, debt, investing, retirement, tax, business & funding, AI automation; (2) amount range, timeline, country, details; (3) name, email, optional phone, contact preference, consent checkbox. Prefill topic/source from URL. Side panel: benefits, how-it-works, referral-fee disclosure, "Are you a professional? Become a partner".
Reusable short lead band (name, email, goal, consent) on home, learn and every calculator page. Fire gtag('event','generate_lead') on success. Honeypot field on every form.
```

## Phase 6 — Community & revenue pages
```
support.html: 4 support tiers (Supporter $5/mo, Builder $25/mo featured, Patron $100/mo, one-time), transparent funding-goal progress bars (new tools, hosting, prizes, hiring, marketing), pledge form that replies with a secure payment link (no card data on site), sponsor/prize/partner cards. State that support is not tax-deductible.
contests.html: monthly "Step Up" Money Tip Challenge with prizes, judging criteria, entry form, more ways to win, official rules (no purchase necessary, 18+, void where prohibited, skill-based, licensing of entries).
careers.html: 6 roles (writer, JS dev, video creator, SEO, community ambassador, partnerships) + application form.
advertise.html: sponsorship packages, newsletter, contest sponsor, partner network, content partnership, domain inquiry + media-kit request form.
learn.html: quick guides + 8 verified YouTube lessons each linked to a calculator.
```

## Phase 7 — AdSense compliance & legal
```
Create about.html (mission, editorial standards), contact.html (form + owner contact button to web.works/contact), privacy.html (AdSense/Google cookie disclosure with opt-out links, consent mode, FormSubmit, YouTube, rights under GDPR/CCPA/PIPEDA/DPDP, children), terms.html, disclaimer.html (trademark disclosure: "78983" used only as a domain identifier, no trademark claimed, no affiliation with any entity using the digits; copyright disclosure; financial, cultural and advertising disclaimers).
Checklist: original content on every page, clear navigation, no ads above calculator inputs, no click-encouraging language near ads, ads.txt at root, sitemap, robots, working contact page, privacy policy linked in footer.
```

## Phase 8 — QA, deploy & growth
```
QA: run every page in headless Chromium; zero JS errors; no broken internal links; no horizontal scroll at 390px; grep the repo to confirm the inbox address appears nowhere.
Deploy: push to GitHub WEBWORKSA1/78983-com, branches main and gh-pages; GitHub Pages serves gh-pages root. When DNS for 78983.com points to GitHub (A records 185.199.108-111.153, CNAME www → webworksa1.github.io), add a CNAME file containing 78983.com and enable HTTPS.
After launch: submit sitemap in Google Search Console, apply to AdSense with the custom domain, verify FormSubmit on first submission, publish 2 new calculators + 4 guides per month, seed contest, start YouTube Shorts explaining one calculator each.
```
