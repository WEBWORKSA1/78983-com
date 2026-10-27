# 78983.com — Step up your numbers

Free, private money, business & AI calculators. Static HTML/CSS/JS — no build step, runs on GitHub Pages free plan.

- **12 calculators** (compound interest, loan/EMI, mortgage, retirement, savings goal, inflation, ROI/CAGR, debt payoff, startup runway, AI API cost, freelance rate, percentage) + **Number Explorer**
- **Lead generation:** 3-step `get-matched.html` + inline lead band on every calculator
- **Revenue:** Google AdSense (Auto Ads, `ads.txt`), support tiers, sponsorships, contests, careers
- **Compliance:** privacy policy, terms, disclaimer/trademark notice, consent banner with Google Consent Mode v2

## Structure
```
index.html            home
calculators/          hub + 12 calculator pages
number-explorer.html  learn.html  get-matched.html  support.html  contests.html
careers.html  advertise.html  about.html  contact.html  privacy.html  terms.html  disclaimer.html
assets/css/style.css  assets/js/{main,calc,explorer,forms}.js
ads.txt  robots.txt  sitemap.xml  favicon.svg  site.webmanifest  404.html
```

## Forms
All forms post through FormSubmit's AJAX endpoint. The destination inbox is never written in markup; it's decoded in `forms.js` at submit time. **First submission triggers a one-time FormSubmit activation email — click it once to activate.**

## Custom domain
Site is published from the `gh-pages` branch. To serve on 78983.com: point DNS A records to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (and `www` CNAME → `webworksa1.github.io`), then add a `CNAME` file containing `78983.com` and tick "Enforce HTTPS" in Settings → Pages.

See `RESEARCH.md` for the strategy and `PROMPTS.md` for the phase-wise build prompts.

© 2026 78983.com. "78983" is used only as a domain identifier; no trademark is claimed in the numerals.
