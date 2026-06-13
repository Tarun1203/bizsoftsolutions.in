# BizSoft Solutions — Setup Guide

The site is static HTML + Firebase (project: `bizsoftsolutions-8846b`). Lead forms already work. Two one-time steps activate the admin console and live pricing.

## 1. Enable admin login (Firebase Authentication)

1. Firebase Console → **Authentication** → **Sign-in method** → enable **Email/Password**.
2. Authentication → **Users** → **Add user** → create your admin email + a strong password.

That account is the only one able to read/manage leads and edit plans.

## 2. Update Firestore security rules

Firebase Console → **Firestore Database** → **Rules** → replace everything with the contents of `firestore.rules` in this folder → **Publish**.

What the new rules do: leads can still be created by the public forms (with validation), but reading/updating leads and writing plans now requires a signed-in admin. The `plans` collection is publicly readable so the website can show live prices.

## 3. First login to the admin console

1. Open `bsf-console.html` on your site (e.g. `https://yourdomain/bsf-console.html`). It is hidden: not linked anywhere, `noindex`, and not in the sitemap. Bookmark it — don't link to it from any page.
2. Sign in with the admin user from step 1.
3. **Plans & Pricing tab → "🌱 Seed Default Plans"** creates starter plans for all 4 softwares. Edit prices to your real rates — changes appear on the website instantly.

## Leads dashboard

- **Status:** New / Attended / Closed / Notintrested — colored pill per lead.
- **Discussion:** Intersted / Time Nedded / Demo / Payment / Dicussion / Purchased.
- Notes save on click-away; WhatsApp/call links per lead; CSV export; search + filters; stats cards on top.
- Every form submission auto-creates a lead with ticket `BSF-YYYYMMDD-XXXX`, status `New`.

## Live pricing

Product pages contain `<div data-plans="vyapar">` etc. `assets/plans.js` fetches the `plans` collection and renders cards. Software keys: `vyapar`, `bizanalyst`, `billtouch-pos`, `billtouch-liquor`. A plan with "Visible on site? = No" stays in the console but is hidden from the website.

## Before going live — replace placeholders

- **Domain:** `https://bizsoftsolutions.in/` is used in `sitemap.xml`, `robots.txt` and canonical tags — replace with your real domain (search-and-replace across files).
- **Phone:** `919999999999` in the floating WhatsApp/call buttons (`index.html`).
- Prices seeded by the console are **indicative** — set your real partner rates in the Plans tab.

## File map

| File | Purpose |
|---|---|
| `index.html` | Home: products, comparison, FAQs, blogs, ticket form |
| `vyapar.html`, `bizanalyst.html`, `billtouch-pos.html`, `billtouch-liquor.html` | Product deep-dives with live pricing + lead forms |
| `blog-*.html` | 4 SEO blog guides |
| `compare-*.html` | 2 detailed comparison pages |
| `bsf-console.html` | **Hidden admin console** (leads CRM + plans CRUD) |
| `assets/style.css` | Shared styles |
| `assets/form.js` | Lead capture (Firestore + ticket + email alert) |
| `assets/plans.js` | Live pricing renderer |
| `firestore.rules` | Security rules — paste in Firebase Console |
| `sitemap.xml`, `robots.txt`, `404.html` | SEO/infra |
