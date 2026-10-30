# Security

## Model

- The site is static. The only data store is Firestore, and **`firestore.rules` is the only thing protecting it**. Never rely on the front end to restrict access.
- Admin access = Firebase Auth user whose email matches `isAdmin()` in `firestore.rules`. Public sign-up must stay **disabled** in Firebase Console → Authentication → Settings → User actions.
- The Firebase web API key is public by design. Keep it restricted in Google Cloud Console to the `bizsoftsolutions.in/*` referrer and to the Firestore and Identity Toolkit APIs.
- Never commit real secrets (bot tokens, service-account keys, passwords). GitHub secret scanning is on; treat any alert as "rotate first, then clean up".

## Checklist status

| Item | Status |
|---|---|
| Access control on data | `firestore.rules`: leads create-only for public, admin-only reads/writes |
| Never trust the front end | Field validation in rules, not just in `form.js` |
| Sanitize user input | Admin console escapes all lead fields before rendering. CSV export neutralises spreadsheet formulas |
| Hide admin pages | `noindex, nofollow` meta. Path not listed in `robots.txt`. Data protected by rules, not by the obscure URL |
| HTTPS everywhere | GitHub Pages with "Enforce HTTPS" (check it's ticked in repo Settings → Pages) |
| Security headers (CSP, HSTS, X-Frame-Options) | **Not possible on GitHub Pages.** Needs a proxy such as Cloudflare in front of the domain |
| Rate limiting | **Gap.** Anyone can spam the lead form and the Apps Script alert. Options: Firebase App Check, or Cloudflare Turnstile verified in Apps Script |
| Apps Script `SECRET_TOKEN` | Visible in `form.js`, so it isn't secret. Rely on rate limiting, not the token |
| Dependencies | Only Firebase JS SDK 10.12.0 (admin page). Bump when Firebase publishes security fixes |
| Leaked secrets | Revoke the Telegram bot token from history. Delete the old Google API keys |
| Logging user actions | Not implemented. Firestore audit logs can be enabled in Google Cloud if needed |

Items from generic web-app checklists that don't apply here: SQL/parameterized queries, API-route auth, CORS, webhook signatures, file uploads, storage buckets, debug mode.
