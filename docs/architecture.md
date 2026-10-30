# Architecture

There is no server of our own. Everything is static HTML on GitHub Pages, talking directly to Google services from the browser.

```
Visitor browser ──► GitHub Pages (static HTML/JS)
      │
      ├─► Firestore REST API  (project bizsoftsolutions-7a47d)
      │     create  leads/{id}          ← form.js, Vyapar_index.html inline form
      │     read    settings/config     ← settings.js (prices, offer banner)
      │
      ├─► Google Apps Script web app    ← form.js "new lead" email alert
      │
      └─► Google tag (Ads + GA4)        ← conversion + generate_lead events

Admin browser ──► /bsm-admin-7k2x/
      ├─► Firebase Auth (email/password) → ID token
      └─► Firestore REST with Bearer token
            read/update/delete leads, write settings/config
```

## Data

| Collection | Who writes | Who reads |
|---|---|---|
| `leads` | Public (create only, validated by rules) | Admin only |
| `settings` | Admin only | Public |
| `plans` | Admin only | Public (currently unused by the pages) |

Access is enforced only by `firestore.rules`. The web API key in `form.js` and `settings.js` is public by design and identifies the project; it does not grant access by itself.

## Lead flow

1. Visitor submits a form; `form.js` generates a ticket ID (`BSF-YYYYMMDD-NNNN`).
2. The lead is created in Firestore `leads`.
3. `form.js` posts the lead to the Apps Script web app, which emails the team.
4. Google Ads `conversion` and GA4 `generate_lead` events fire.
5. The admin console lists leads, and staff update status and decision there.
