// ============================================================
// BizSoft Solutions — Google Apps Script  (Code.gs)
// ✅ Saves lead to Google Sheet
// ✅ Sends email alert to owner
// ✅ Sends Telegram alert to owner
//
// DEPLOY STEPS:
//   1. Go to script.google.com → paste this code
//   2. Fill OWNER_EMAIL, TELEGRAM_TOKEN, TELEGRAM_CHAT_ID below
//   3. Deploy → New Deployment → Web App
//      Execute as: Me  |  Access: Anyone
//   4. Copy the Web App URL → paste in form.js CONFIG block
// ============================================================

const OWNER_EMAIL      = "bizsofsolution@gmail.com"; // ← your Gmail
const SECRET_TOKEN     = "bsft_alert_9x2k";          // must match token in all form pages

// ── Telegram Bot Alert ─────────────────────────────────────────
// SETUP (one-time, 2 minutes):
//   1. Open Telegram → search @BotFather → send /newbot
//   2. Give it any name (e.g. BizSoftLeads) → get the TOKEN
//   3. Open your new bot in Telegram → press START (send any message)
//   4. Visit: https://api.telegram.org/bot<TOKEN>/getUpdates
//      Find "id" inside "chat" — that is your CHAT_ID
//   5. Paste both values below and re-deploy
const TELEGRAM_TOKEN   = "8665647725:AAFg93QDBKU5_Gjx-okY85FcGmAe1fSUb8E";
const TELEGRAM_CHAT_ID = "734717201";
const SHEET_NAME  = "Leads";

// Column positions
const COL = {
  TIMESTAMP:     1,
  NAME:          2,
  PHONE:         3,
  BUSINESS_TYPE: 4,
  SOFTWARE:      5,
  CITY:          6,
  MESSAGE:       7,
  STATUS:        8,
  FOLLOWUP:      9,
  LAST_UPDATED:  10,
  SOURCE:        11
};

// ── Health check ────────────────────────────────────────────
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok", service: "BizSoft Leads API" }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── Receive new lead ────────────────────────────────────────
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // ── Token check — reject requests without valid secret ──
    if (data._token !== SECRET_TOKEN) {
      return ContentService
        .createTextOutput(JSON.stringify({ result: "unauthorized" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    delete data._token; // don't save token to sheet

    const sheet = getOrCreateSheet();
    const now   = Utilities.formatDate(new Date(), "Asia/Kolkata", "dd/MM/yyyy HH:mm:ss");

    // 1. Save row to Google Sheet
    sheet.appendRow([
      now,
      data.name          || "",
      data.phone         || "",
      data.businessType  || "",
      data.software      || "",
      data.city          || "",
      data.message       || "",
      "New Lead",           // default status
      "",                   // follow-up notes — fill manually
      now,
      data.source        || "website"
    ]);

    const lastRow = sheet.getLastRow();
    applyStatusDropdown(sheet, lastRow);
    colorRow(sheet, lastRow, "New Lead");

    // 2. Send email alert to owner
    sendEmailAlert(data, now);

    // 3. Send Telegram alert to owner
    sendTelegramAlert(data, now);

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success", row: lastRow }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    Logger.log("Error: " + err.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── Email alert to owner (MailApp is built-in — 100% free) ──
function sendEmailAlert(data, timestamp) {
  try {
    const subject = `🔔 New Lead: ${data.name || "Unknown"} — ${data.software || "BizSoft"}`;

    const body =
`New lead received on BizSoft Solutions!

──────────────────────────────
👤  Name          : ${data.name         || "N/A"}
📱  Mobile        : ${data.phone        || "N/A"}
💼  Business Type : ${data.businessType || "N/A"}
🖥   Software      : ${data.software     || "N/A"}
📍  City          : ${data.city         || "N/A"}
💬  Message       : ${data.message      || "—"}
🕐  Submitted at  : ${timestamp}
🌐  Source        : ${data.source       || "website"}
──────────────────────────────

Open Google Sheet to update status:
https://docs.google.com/spreadsheets/

Reply or WhatsApp the lead directly:
wa.me/${(data.phone || "").replace(/\D/g, "")}

──────────────────────────────
BizSoft Solutions — Lead Alerts
`;

    MailApp.sendEmail({
      to:      OWNER_EMAIL,
      subject: subject,
      body:    body
    });

    Logger.log("Email alert sent to " + OWNER_EMAIL);
  } catch (err) {
    Logger.log("Email failed: " + err.toString());
    // Don't throw — lead is already saved to sheet
  }
}

// ── Telegram alert ──────────────────────────────────────────
function sendTelegramAlert(data, timestamp) {
  try {
    if (!TELEGRAM_TOKEN || TELEGRAM_TOKEN === "YOUR_BOT_TOKEN") return;

    const msg =
`🔔 *New Lead — BizSoft Solutions*

👤 Name      : ${data.name         || "N/A"}
📱 Mobile    : ${data.phone        || "N/A"}
💼 Business  : ${data.businessType || "N/A"}
🖥 Software  : ${data.software     || "N/A"}
📍 City      : ${data.city         || "N/A"}
💬 Message   : ${data.message      || "—"}
🕐 Time      : ${timestamp}
🌐 Source    : ${data.source       || "website"}`;

    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
    UrlFetchApp.fetch(url, {
      method            : "post",
      contentType       : "application/json",
      payload           : JSON.stringify({
        chat_id    : TELEGRAM_CHAT_ID,
        text       : msg,
        parse_mode : "Markdown"
      }),
      muteHttpExceptions: true
    });
    Logger.log("Telegram alert sent.");
  } catch(err) {
    Logger.log("Telegram failed: " + err.toString());
  }
}

// ── Create / get the Leads sheet ────────────────────────────
function getOrCreateSheet() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  let   sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);

    const headers = [
      "Timestamp", "Name", "Mobile", "Business Type",
      "Software Interest", "City", "Message",
      "Status", "Follow-Up Notes", "Last Updated", "Source"
    ];
    sheet.appendRow(headers);

    const hr = sheet.getRange(1, 1, 1, headers.length);
    hr.setBackground("#1565c0")
      .setFontColor("#ffffff")
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setFontSize(10);

    sheet.setFrozenRows(1);

    sheet.setColumnWidth(COL.TIMESTAMP,     158);
    sheet.setColumnWidth(COL.NAME,          140);
    sheet.setColumnWidth(COL.PHONE,         130);
    sheet.setColumnWidth(COL.BUSINESS_TYPE, 155);
    sheet.setColumnWidth(COL.SOFTWARE,      145);
    sheet.setColumnWidth(COL.CITY,          110);
    sheet.setColumnWidth(COL.MESSAGE,       240);
    sheet.setColumnWidth(COL.STATUS,        135);
    sheet.setColumnWidth(COL.FOLLOWUP,      225);
    sheet.setColumnWidth(COL.LAST_UPDATED,  158);
    sheet.setColumnWidth(COL.SOURCE,        160);
  }
  return sheet;
}

// ── Status dropdown ─────────────────────────────────────────
function applyStatusDropdown(sheet, row) {
  const options = [
    "New Lead", "Contacted", "Demo Scheduled",
    "Qualified", "Proposal Sent", "Won", "Lost", "Not Interested"
  ];
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(options, true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange(row, COL.STATUS).setDataValidation(rule);
}

// ── Row colour by status ─────────────────────────────────────
function colorRow(sheet, row, status) {
  const map = {
    "New Lead":       { bg: "#e3f2fd", fg: "#0d47a1" },
    "Contacted":      { bg: "#fff9c4", fg: "#f57f17" },
    "Demo Scheduled": { bg: "#e8eaf6", fg: "#283593" },
    "Qualified":      { bg: "#e8f5e9", fg: "#1b5e20" },
    "Proposal Sent":  { bg: "#ede7f6", fg: "#4a148c" },
    "Won":            { bg: "#1b5e20", fg: "#ffffff" },
    "Lost":           { bg: "#ffebee", fg: "#b71c1c" },
    "Not Interested": { bg: "#f5f5f5", fg: "#9e9e9e" }
  };
  const c = map[status] || { bg: "#ffffff", fg: "#000000" };
  sheet.getRange(row, COL.STATUS)
    .setBackground(c.bg)
    .setFontColor(c.fg)
    .setFontWeight("bold")
    .setHorizontalAlignment("center");
}

// ── Auto-update colour + Last Updated when status changes ────
function onEdit(e) {
  if (!e || !e.range) return;
  const sheet = e.range.getSheet();
  if (sheet.getName() !== SHEET_NAME) return;
  if (e.range.getColumn() !== COL.STATUS) return;
  const row = e.range.getRow();
  if (row <= 1) return;

  colorRow(sheet, row, e.range.getValue());

  const now = Utilities.formatDate(new Date(), "Asia/Kolkata", "dd/MM/yyyy HH:mm:ss");
  sheet.getRange(row, COL.LAST_UPDATED).setValue(now);
}

// ── Run once manually to initialise the sheet ────────────────
function setupSheet() {
  getOrCreateSheet();
  SpreadsheetApp.getUi().alert("✅ BizSoft Leads sheet is ready!");
}

// ── Test email alert (run from editor to verify) ─────────────
function testEmail() {
  sendEmailAlert({
    name: "Test User", phone: "9999999999",
    businessType: "Retail Shop", software: "Vyapar",
    city: "Mumbai", message: "Test lead"
  }, Utilities.formatDate(new Date(), "Asia/Kolkata", "dd/MM/yyyy HH:mm:ss"));
  Logger.log("Test email sent to " + OWNER_EMAIL);
}
