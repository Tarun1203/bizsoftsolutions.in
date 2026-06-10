// ============================================================
//  BizSoft Solutions — form.js
//  Lead handler: saves to Firebase Firestore + email via Apps Script
//
//  Firebase Firestore: primary storage (100% reliable, free tier)
//  Apps Script: email alert to owner (fire-and-forget)
// ============================================================

const BIZSFT = {

  // ── Firebase config ────────────────────────────────────────
  FIREBASE_API_KEY  : "AIzaSyB8mlpremZdKi66fbHag-SGFAb49MS1Tr4",
  FIREBASE_PROJECT  : "bizsoftsolutions-8846b",
  COLLECTION        : "leads",

  // ── Apps Script (email + Telegram alert) ─────────────────
  APPS_SCRIPT_URL   : "https://script.google.com/macros/s/AKfycbyd18400nxsS1JvSSl17hlx6ImC0tu5W1HINXT2Q_WQ6Q5NqtQo89dmdCKT6Tn_f3SR_Q/exec",
  SECRET_TOKEN      : "bsft_alert_9x2k",

  // ── Save lead to Firestore via REST API ───────────────────
  async saveToFirestore(data) {
    const url = `https://firestore.googleapis.com/v1/projects/${this.FIREBASE_PROJECT}/databases/(default)/documents/${this.COLLECTION}?key=${this.FIREBASE_API_KEY}`;

    // Convert flat object → Firestore field format
    const fields = {};
    Object.entries(data).forEach(([k, v]) => {
      fields[k] = { stringValue: String(v || "") };
    });

    const res = await fetch(url, {
      method  : "POST",
      headers : { "Content-Type": "application/json" },
      body    : JSON.stringify({ fields })
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error("Firestore error: " + err);
    }
    return res.json();
  },

  // ── Send email + Telegram alert via Apps Script ──────────
  pingEmailAlert(data) {
    const payload = Object.assign({}, data, { _token: this.SECRET_TOKEN });
    fetch(this.APPS_SCRIPT_URL, {
      method  : "POST",
      mode    : "no-cors",
      headers : { "Content-Type": "application/json" },
      body    : JSON.stringify(payload)
    }).catch(() => {}); // silent fail — Firestore is the source of truth
  },

  // ── Toast notification ────────────────────────────────────
  showToast(msg, color) {
    let t = document.getElementById("bizsft-toast");
    if (!t) {
      t = document.createElement("div");
      t.id = "bizsft-toast";
      t.style.cssText = [
        "position:fixed","bottom:1.5rem","right:1.5rem",
        "padding:.9rem 1.4rem","border-radius:10px",
        "font-family:Segoe UI,Arial,sans-serif",
        "font-size:.92rem","font-weight:700","color:#fff",
        "box-shadow:0 4px 20px rgba(0,0,0,.3)",
        "transform:translateY(120px)","opacity:0",
        "transition:all .4s cubic-bezier(.175,.885,.32,1.275)",
        "z-index:9999","max-width:320px","line-height:1.4"
      ].join(";");
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.background = color || "#1565c0";
    setTimeout(() => { t.style.transform = "translateY(0)"; t.style.opacity = "1"; }, 10);
    setTimeout(() => { t.style.transform = "translateY(120px)"; t.style.opacity = "0"; }, 4500);
  },

  // ── Inline message helper ─────────────────────────────────
  setMsg(el, type, text) {
    if (!el) return;
    const s = {
      success : "background:#e8f5e9;color:#2e7d32;border:1px solid #a5d6a7",
      error   : "background:#ffebee;color:#c62828;border:1px solid #ef9a9a",
      info    : "background:#e3f2fd;color:#1565c0;border:1px solid #90caf9"
    };
    el.style.cssText = `display:block;padding:.8rem 1rem;border-radius:8px;
      text-align:center;font-weight:600;font-size:.93rem;margin-top:.8rem;
      ${s[type] || s.info}`;
    el.textContent = text;
  },

  // ── Main submit handler ───────────────────────────────────
  async submit({ formEl, btnEl, msgEl, softwareOverride, onSuccess }) {
    if (btnEl) {
      btnEl.disabled    = true;
      btnEl._orig       = btnEl._orig || btnEl.textContent;
      btnEl.textContent = "Submitting…";
    }

    const fd   = new FormData(formEl);
    const data = Object.fromEntries(fd.entries());

    // ── Honeypot check — bots fill hidden field, humans don't ──
    if (data._honey) {
      if (btnEl) { btnEl.disabled = false; btnEl.textContent = btnEl._orig || "Submit"; }
      return;
    }
    delete data._honey;

    if (softwareOverride) data.software = softwareOverride;
    data.timestamp   = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    data.status      = "New Lead";
    data.source      = window.location.href;

    try {
      // 1. Save to Firestore (primary)
      await this.saveToFirestore(data);

      // 2. Ping Apps Script for email alert (non-blocking)
      this.pingEmailAlert(data);

      // 3. Success UI
      this.setMsg(msgEl, "success",
        "✅ Details received! Our expert will contact you within 24 hours.");
      this.showToast("✅ Lead saved! We'll be in touch soon.", "#2e7d32");

      if (typeof onSuccess === "function") onSuccess();
      formEl.reset();

    } catch (err) {
      console.error("Submit error:", err);
      this.setMsg(msgEl, "error",
        "⚠️ Something went wrong. Please try again or email us directly.");
      this.showToast("⚠️ Error — please retry", "#c62828");
    } finally {
      if (btnEl) {
        btnEl.disabled    = false;
        btnEl.textContent = btnEl._orig || "Submit";
      }
    }
  },

  // ── Wire a form ───────────────────────────────────────────
  wire({ formId, btnId, msgId, softwareOverride, onSuccess }) {
    const formEl = document.getElementById(formId);
    if (!formEl) return;
    const btnEl = btnId ? document.getElementById(btnId)
                        : formEl.querySelector("button[type=submit]");
    const msgEl = msgId ? document.getElementById(msgId) : null;

    formEl.addEventListener("submit", (e) => {
      e.preventDefault();
      this.submit({ formEl, btnEl, msgEl, softwareOverride, onSuccess });
    });
  }
};
