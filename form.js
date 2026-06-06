// ============================================================
//  BizSoft Solutions — form.js
//  Shared form handler for ALL pages
//
//  HOW IT WORKS (zero API keys needed):
//    1. Form data is POSTed to Google Apps Script → saved to Sheet
//    2. Apps Script sends an email alert to the owner (free)
//    3. Browser auto-opens wa.me/OWNER_NUMBER?text=... in new tab
//       → Lead's WhatsApp opens with details pre-filled
//       → Lead taps Send → Owner gets the WhatsApp directly
//
//  SETUP:
//    1. Replace APPS_SCRIPT_URL with your deployed Web App URL
//    2. Replace OWNER_WA_NUMBER with your WhatsApp number
//       (country code + number, no + sign, no spaces)
//       Example: India 98765 43210  →  "919876543210"
// ============================================================

const BIZSFT = {

  // ── CONFIG — update these two values ──────────────────────
  APPS_SCRIPT_URL : "https://script.google.com/macros/s/AKfycbxTth1KmROkse9uY4wQ5N5RipEXxmQNxlYMBeeeNinduR9f00JX6w8ktIbnk_KOBcfMVw/exec",
  OWNER_WA_NUMBER : "919876543210",   // ← your WhatsApp number
  // ──────────────────────────────────────────────────────────

  // Build WhatsApp wa.me URL with lead details pre-filled
  buildWaURL(data) {
    const msg = [
      `Hi BizSoft Solutions! 👋`,
      ``,
      `I just filled out your enquiry form. Here are my details:`,
      ``,
      `👤 Name: ${data.name || "—"}`,
      `📱 Mobile: ${data.phone || "—"}`,
      `💼 Business: ${data.businessType || "—"}`,
      `🖥 Software: ${data.software || "—"}`,
      `📍 City: ${data.city || "—"}`,
      `💬 Message: ${data.message || "—"}`,
      ``,
      `Please get in touch with me. Thank you!`
    ].join("\n");

    return `https://wa.me/${this.OWNER_WA_NUMBER}?text=${encodeURIComponent(msg)}`;
  },

  // Show a toast notification
  showToast(msg, color) {
    let toast = document.getElementById("bizsft-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "bizsft-toast";
      toast.style.cssText = [
        "position:fixed", "bottom:1.5rem", "right:1.5rem",
        "padding:.9rem 1.4rem", "border-radius:10px",
        "font-family:Segoe UI,Arial,sans-serif",
        "font-size:.92rem", "font-weight:700", "color:#fff",
        "box-shadow:0 4px 20px rgba(0,0,0,.3)",
        "transform:translateY(120px)", "opacity:0",
        "transition:all .4s cubic-bezier(.175,.885,.32,1.275)",
        "z-index:9999", "max-width:320px", "line-height:1.4"
      ].join(";");
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.background = color || "#1565c0";
    setTimeout(() => { toast.style.transform = "translateY(0)"; toast.style.opacity = "1"; }, 10);
    setTimeout(() => { toast.style.transform = "translateY(120px)"; toast.style.opacity = "0"; }, 4500);
  },

  // Set a message element's state
  setMsg(el, type, text) {
    if (!el) return;
    const styles = {
      success: "background:#e8f5e9;color:#2e7d32;border:1px solid #a5d6a7",
      error:   "background:#ffebee;color:#c62828;border:1px solid #ef9a9a",
      info:    "background:#e3f2fd;color:#1565c0;border:1px solid #90caf9"
    };
    el.style.cssText = `display:block;padding:.8rem 1rem;border-radius:8px;
      text-align:center;font-weight:600;font-size:.93rem;margin-top:.8rem;
      ${styles[type] || styles.info}`;
    el.textContent = text;
  },

  // Main submit function
  async submit({ formEl, btnEl, msgEl, softwareOverride, onSuccess }) {
    if (btnEl) { btnEl.disabled = true; btnEl._orig = btnEl._orig || btnEl.textContent; btnEl.textContent = "Saving…"; }

    const fd   = new FormData(formEl);
    const data = Object.fromEntries(fd.entries());
    if (softwareOverride) data.software = softwareOverride;
    data.timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    data.status    = "New Lead";
    data.source    = window.location.href;

    try {
      // Step 1 — save to Google Sheet via Apps Script
      await fetch(this.APPS_SCRIPT_URL, {
        method:  "POST",
        mode:    "no-cors",   // required for Apps Script; response is opaque
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data)
      });

      // Step 2 — show success
      this.showToast("✅ Details saved! We'll contact you within 24 hours.", "#2e7d32");

      // Update UI
      this.setMsg(msgEl, "success",
        "✅ Details received! Our expert will call/WhatsApp you within 24 hours.");

      if (typeof onSuccess === "function") onSuccess();
      formEl.reset();

    } catch (err) {
      this.setMsg(msgEl, "error",
        "⚠️ Something went wrong. Please try again or WhatsApp us directly.");
      this.showToast("⚠️ Error — please retry", "#c62828");
    } finally {
      if (btnEl) {
        btnEl.disabled = false;
        btnEl.textContent = btnEl._orig || "Submit";
      }
    }
  },

  // Wire up a form automatically
  // Usage: BIZSFT.wire({ formId, btnId, msgId, softwareOverride, onSuccess })
  wire({ formId, btnId, msgId, softwareOverride, onSuccess }) {
    const formEl = document.getElementById(formId);
    if (!formEl) return;
    const btnEl  = btnId  ? document.getElementById(btnId)  : formEl.querySelector("button[type=submit]");
    const msgEl  = msgId  ? document.getElementById(msgId)  : null;

    formEl.addEventListener("submit", (e) => {
      e.preventDefault();
      this.submit({ formEl, btnEl, msgEl, softwareOverride, onSuccess });
    });
  }
};
