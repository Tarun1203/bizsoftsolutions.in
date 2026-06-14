/* settings.js — BizSoft Solutions
   Fetches settings/config from Firestore and:
   1. Updates all [data-pk="KEY"] price elements
   2. Shows the offer ticker banner if active
   Include this script on every product page and index.html
*/
(function(){
  "use strict";
  var FB_API_KEY = "AIzaSyBVq7cI62VX-fGfQj32-mdyu30JygMFwWQ";
  var FB_PROJECT = "bizsoftsolutions-7a47d";

  function fmtINR(n){
    var num = parseInt(String(n).replace(/,/g,""), 10);
    return isNaN(num) ? n : num.toLocaleString("en-IN");
  }

  function applySettings(fields){
    var get = function(k){ return (fields[k] && fields[k].stringValue) || ""; };

    // ── Update every [data-pk] price element ──────────────────
    Object.keys(fields).forEach(function(k){
      var val = get(k);
      if(!val) return;
      document.querySelectorAll('[data-pk="' + k + '"]').forEach(function(el){
        el.textContent = fmtINR(val);
      });
    });

    // ── Offer ticker banner ───────────────────────────────────
    var banner = document.getElementById("offerBanner");
    if(!banner) return;
    var msg    = get("offer_msg");
    var active = get("offer_active");
    if(active === "true" && msg){
      var bg    = get("offer_bg") || "#c62828";
      var color = get("offer_color") || "#ffffff";
      banner.style.background = bg;
      banner.style.color      = color;
      var inner = banner.querySelector(".ticker-inner");
      if(inner) inner.textContent = (msg + "   ·   ").repeat(6);
      banner.style.display = "block";
    }
  }

  async function loadSettings(){
    try {
      var url = "https://firestore.googleapis.com/v1/projects/" + FB_PROJECT
              + "/databases/(default)/documents/settings/config?key=" + FB_API_KEY;
      var res = await fetch(url);
      if(!res.ok) return;
      var data = await res.json();
      if(data.fields) applySettings(data.fields);
    } catch(e){ /* silent fail — hardcoded prices remain */ }
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", loadSettings);
  } else {
    loadSettings();
  }
})();
