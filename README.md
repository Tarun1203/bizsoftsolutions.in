# BizSoft Solutions website

Static marketing site for [bizsoftsolutions.in](https://bizsoftsolutions.in): product pages for Vyapar, Biz Analyst and Bill Touch, a blog, and a lead form that saves enquiries to Firebase.

## Structure

| Path | What it is |
|---|---|
| `index.html` | Home page |
| `Vyapar_index.html`, `BizAnalyst_index.html`, `Biltouch_index.html` | Product pages (pricing, FAQ, lead form) |
| `blog/` | Articles and comparisons |
| `404.html` | Custom not-found page |
| `form.js` | Lead form: saves to Firestore `leads`, pings the Apps Script email alert |
| `settings.js` | Reads Firestore `settings/config` for live prices and the offer banner |
| `bsm-admin-7k2x/` | Admin console (Firebase Auth sign-in, lead list, pricing editor). `noindex` |
| `firestore.rules` | Reference copy of the Firestore security rules |
| `sitemap.xml`, `robots.txt` | Search engine files |
| `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png` | Site icons |

## Deploying

Hosted on GitHub Pages from `main` (custom domain in `CNAME`). Pushing to `main` publishes the site.

`firestore.rules` is **not** deployed by a push. After changing it, paste the whole file into Firebase Console → Firestore Database → Rules and click Publish. It is the only up-to-date copy of the rules.

Every file in this repo is publicly served, so setup notes with internal details belong outside the repo.

## Adding a page

- Unique `<title>` (60 characters or fewer) and meta description (70–160 characters).
- `<link rel="canonical">`, Open Graph tags, and the favicon links from any existing page.
- Add the URL to `sitemap.xml`. Link to it from at least one related page.

## More

- [docs/architecture.md](docs/architecture.md): how the pages, Firebase and Apps Script fit together
- [docs/security.md](docs/security.md): security model and checklist status
