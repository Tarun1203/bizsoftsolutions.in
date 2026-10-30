/* config.js — BizSoft Solutions
   The one place for client-side keys and endpoints. Load it before
   settings.js, form.js and any inline script that talks to Firebase.

   These values are PUBLIC: every visitor's browser downloads them.
   What protects the data is firestore.rules plus the API key's
   website restriction (bizsoftsolutions.in/*) in Google Cloud Console.
   Never put a real secret (bot token, service-account key, password) here.
*/
window.BSF_CONFIG = Object.freeze({
  firebaseApiKey: "AIzaSyBVq7cI62VX-fGfQj32-mdyu30JygMFwWQ",
  firebaseProject: "bizsoftsolutions-7a47d",
  appsScriptUrl: "https://script.google.com/macros/s/AKfycbyd18400nxsS1JvSSl17hlx6ImC0tu5W1HINXT2Q_WQ6Q5NqtQo89dmdCKT6Tn_f3SR_Q/exec",
  alertToken: "bsft_alert_9x2k"
});
