# BizSoft Solutions — Setup Guide

## What's in This Folder

| File | Purpose |
|------|---------|
| `index.html` | Main website homepage |
| `Code.gs` | Google Apps Script (paste into script.google.com) |
| `SETUP-GUIDE.md` | This file |

---

## STEP 1 — Set Up Google Sheet + Apps Script

### 1.1 Create the Google Sheet
1. Go to [sheets.google.com](https://sheets.google.com) → Create a new blank sheet
2. Name it **"BizSoft Leads"** (or anything you like)

### 1.2 Open Apps Script
1. In the sheet: **Extensions → Apps Script**
2. Delete all existing code in the editor
3. Open `Code.gs` from this folder and paste the entire contents
4. Update the two config values at the top:
   ```
   const YOUR_WHATSAPP_NUMBER = "91XXXXXXXXXX";  ← your mobile with 91 prefix, no +
   const CALLMEBOT_API_KEY    = "YOUR_KEY_HERE"; ← get this in Step 2
   ```
5. Click 💾 **Save** (Ctrl+S)

### 1.3 Run setupSheet (once)
1. In the Apps Script editor, select function `setupSheet` from the dropdown
2. Click ▶ **Run**
3. Grant permissions when asked → click "Allow"
4. Your sheet will now have all columns created with headers

### 1.4 Deploy as Web App
1. Click **Deploy → New Deployment**
2. Click the ⚙️ gear icon → select **Web App**
3. Settings:
   - **Description:** BizSoft Leads API
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**
5. **Copy the Web App URL** — you'll need it in Step 4

---

## STEP 2 — Set Up CallMeBot (Free WhatsApp Alerts)

CallMeBot sends you a WhatsApp message every time someone submits the lead form.

1. Save this number in your contacts: **+34 644 44 44 45** (name it "CallMeBot")
2. Open WhatsApp → send this exact message to that number:
   ```
   I allow callmebot to send me messages
   ```
3. Within 2 minutes you'll receive a reply with your **API Key** (e.g., `123456`)
4. Copy that API key → paste it in `Code.gs`:
   ```
   const CALLMEBOT_API_KEY = "123456";
   ```
5. Re-deploy the Apps Script (Deploy → Manage Deployments → Edit → Version: New → Deploy)

> ⚠️ If you don't do this step, leads will still save to the sheet — you just won't get WhatsApp alerts.

**Test it:** In Apps Script editor, run the `testWhatsApp` function — you should receive a WhatsApp in seconds.

---

## STEP 3 — Connect Website to Apps Script

1. Open `index.html` in a text editor
2. Find this line near the bottom:
   ```js
   const APPS_SCRIPT_URL = "YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";
   ```
3. Replace with your deployed Web App URL from Step 1.4:
   ```js
   const APPS_SCRIPT_URL = "https://script.google.com/macros/s/XXXXX/exec";
   ```
4. Also update your WhatsApp number (used for click-to-chat fallback):
   ```js
   const YOUR_WA_NUMBER = "919876543210";
   ```
5. Save the file

---

## STEP 4 — Deploy on GitHub Pages (Free Hosting)

### 4.1 Create GitHub Repository
1. Go to [github.com](https://github.com) → Sign in (or create account)
2. Click **New Repository**
3. Name it exactly: `bizsoftsolutions.in` (or any name)
4. Set to **Public**
5. Click **Create Repository**

### 4.2 Upload Files
Option A — GitHub Website (easiest):
1. Click **Add file → Upload files**
2. Drag and drop `index.html`
3. Click **Commit changes**

Option B — Git (if you have it installed):
```bash
git init
git add index.html
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/bizsoftsolutions.in.git
git push -u origin main
```

### 4.3 Enable GitHub Pages
1. In your repository → **Settings → Pages**
2. Source: **Deploy from a branch**
3. Branch: **main** → folder: **/ (root)**
4. Click **Save**
5. Your site will be live at: `https://YOUR_USERNAME.github.io/bizsoftsolutions.in/`

### 4.4 Connect Custom Domain (bizsoftsolutions.in)
1. In GitHub Pages settings → Custom domain → enter `bizsoftsolutions.in`
2. At your domain registrar (e.g., Hostinger, BigRock, GoDaddy):
   - Add 4 A records pointing to GitHub:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - Add CNAME record: `www` → `YOUR_USERNAME.github.io`
3. Back in GitHub → check **Enforce HTTPS**
4. DNS changes take 24–48 hours to propagate

---

## STEP 5 — Update Referral Links

Before going live, open `index.html` and update these:

| Software | Where in the code | Replace with |
|----------|------------------|--------------|
| Vyapar | `href="https://vyaparapp.in/?referrer_code=Z7Y1WP"` | ✅ Already set |
| Biz Analyst | Uses lead form | Uses partner code `TARUNC` at purchase |
| Bill Touch | Uses lead form | Pending — update when available |

---

## Google Sheet — Follow-Up Status Guide

The sheet has a **Status** dropdown for each lead. Update it as you follow up:

| Status | When to use |
|--------|-------------|
| **New Lead** | Just submitted — not yet contacted |
| **Contacted** | Called / WhatsApp'd the lead |
| **Demo Scheduled** | Demo/call booked |
| **Qualified** | Lead is interested and serious |
| **Proposal Sent** | Sent pricing or plan details |
| **Won** | Purchase done — commission earned ✅ |
| **Lost** | Not interested or chose another product |
| **Not Interested** | Explicitly said no |

The **Follow-Up Notes** column is free text — add call notes, dates, anything useful.
The **Last Updated** column auto-updates when you change the Status.

---

## Lead Flow Summary

```
Visitor fills form on website
        ↓
Apps Script saves to Google Sheet (Status: "New Lead")
        ↓
CallMeBot sends WhatsApp alert to you instantly
        ↓
You call/WhatsApp the lead
        ↓
Update Status in Google Sheet as you progress
        ↓
For Biz Analyst / Bill Touch: apply partner code TARUNC at purchase
For Vyapar: commission tracked automatically via referral link
```

---

## Checklist Before Going Live

- [ ] Apps Script deployed and Web App URL copied
- [ ] CallMeBot set up and WhatsApp test passed
- [ ] `APPS_SCRIPT_URL` updated in index.html
- [ ] Vyapar referral link verified
- [ ] Domain registered (bizsoftsolutions.in)
- [ ] GitHub Pages enabled
- [ ] Custom domain connected
- [ ] Tested form submission — lead appears in sheet + WhatsApp received
- [ ] Affiliate disclaimer visible on homepage ✅ (already in the HTML)

---

*Setup guide for bizsoftsolutions.in | June 2026*
