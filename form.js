/* ─── BizSoft Solutions — Form Handler v3 ──────────────────────
   Handles all lead capture forms across the site.
   Security : honeypot trap + SECRET_TOKEN on every submission.
   Ticket   : auto-generates BSF-YYYYMMDD-XXXX ref on each lead.
──────────────────────────────────────────────────────────────── */
(function () {
  "use strict";

  const FB_API_KEY   = "AIzaSyB8mlpremZdKi66fbHag-SGFAb49MS1Tr4";
  const FB_PROJECT   = "bizsoftsolutions-8846b";
  const APPS_SCRIPT  = "https://script.google.com/macros/s/AKfycbyd18400nxsS1JvSSl17hlx6ImC0tu5W1HINXT2Q_WQ6Q5NqtQo89dmdCKT6Tn_f3SR_Q/exec";
  const SECRET_TOKEN = "bsft_alert_9x2k";

  /* ── Ticket number generator ──────────────────────────────────
     Format: BSF-YYYYMMDD-XXXX  (e.g. BSF-20260611-4821)
     Uses date + 4-digit random so each lead gets a unique ref.
  ────────────────────────────────────────────────────────────── */
  function generateTicket() {
    const now  = new Date();
    const yyyy = now.getFullYear();
    const mm   = String(now.getMonth() + 1).padStart(2, "0");
    const dd   = String(now.getDate()).padStart(2, "0");
    const rand = String(Math.floor(1000 + Math.random() * 9000)); // 1000–9999
    return `BSF-${yyyy}${mm}${dd}-${rand}`;
  }

  /* ── Email / Telegram alert ───────────────────────────────── */
  function pingEmailAlert(data) {
    const payload = Object.assign({}, data, { _token: SECRET_TOKEN });
    fetch(APPS_SCRIPT, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).catch(() => {});
  }

  /* ── Save lead to Firestore ───────────────────────────────── */
  async function saveToFirestore(data) {
    const url = `https://firestore.googleapis.com/v1/projects/${FB_PROJECT}/databases/(default)/documents/leads?key=${FB_API_KEY}`;
    const fields = {};
    Object.entries(data).forEach(([k, v]) => {
      fields[k] = { stringValue: String(v) };
    });
    fields.timestamp = { stringValue: new Date().toISOString() };
    fields.source    = { stringValue: window.location.href };
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields })
    });
  }

  /* ── Wire a form ──────────────────────────────────────────── */
  window.BIZSFT = {
    wire({ formId, btnId, msgId, softwareOverride }) {
      const form = document.getElementById(formId);
      const btn  = document.getElementById(btnId);
      const msg  = document.getElementById(msgId);
      if (!form || !btn || !msg) return;

      form.addEventListener("submit", async function (e) {
        e.preventDefault();

        /* Honeypot — bots fill hidden field, humans don't */
        const honey = form.querySelector('[name="_honey"]');
        if (honey && honey.value) return;

        /* Collect form data */
        const data = {};
        new FormData(form).forEach((v, k) => { data[k] = v.trim(); });
        if (softwareOverride) data.software = softwareOverride;
        delete data._honey;

        /* Generate ticket number and attach to lead */
        const ticket = generateTicket();
        data.ticketId = ticket;

        /* Update UI */
        const originalText = btn.textContent;
        btn.disabled    = true;
        btn.textContent = "Submitting…";
        msg.style.display = "none";

        try {
          await saveToFirestore(data);
          pingEmailAlert(data);
          msg.innerHTML = `✅ <strong>Thank you!</strong> Your ticket is <strong>${ticket}</strong>.<br/>Our expert will call you within 2 hours.`;
          msg.style.color   = "#2e7d32";
          msg.style.display = "block";
          form.reset();
        } catch (err) {
          msg.textContent   = "❌ Something went wrong. Please try again.";
          msg.style.color   = "#c62828";
          msg.style.display = "block";
        } finally {
          btn.disabled    = false;
          btn.textContent = originalText;
        }
      });
    }
  };
})();
