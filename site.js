/* site.js — BizSoft Solutions
   Small progressive enhancements. Every page must work without this file. */
(function(){
  "use strict";
  var calm  = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  // Mobile menu
  var menuBtn = document.querySelector(".menu-btn");
  var links   = document.getElementById("navLinks");
  if(menuBtn && links){
    var setMenu = function(open){
      links.classList.toggle("open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
    };
    menuBtn.addEventListener("click", function(){ setMenu(!links.classList.contains("open")); });
    links.addEventListener("click", function(e){ if(e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", function(e){ if(e.key === "Escape") setMenu(false); });
  }

  // Reveal sections as they scroll into view
  var items = document.querySelectorAll(".reveal");
  if(calm || !("IntersectionObserver" in window)){
    items.forEach(function(el){ el.classList.add("in"); });
  } else {
    var seen = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){ entry.target.classList.add("in"); seen.unobserve(entry.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    items.forEach(function(el){ seen.observe(el); });
  }

  if(calm) return;

  // Timeline fill follows the scroll position
  var steps = document.querySelector(".steps");
  if(steps){
    var queued = false;
    var paint = function(){
      queued = false;
      var box  = steps.getBoundingClientRect();
      var done = (window.innerHeight * .65 - box.top) / box.height;
      steps.style.setProperty("--progress", Math.min(1, Math.max(0, done)).toFixed(3));
    };
    var ask = function(){ if(!queued){ queued = true; requestAnimationFrame(paint); } };
    window.addEventListener("scroll", ask, { passive: true });
    window.addEventListener("resize", ask);
    paint();
  }

  if(!hover) return;

  // Hero spotlight follows the pointer
  var hero = document.querySelector(".hero");
  if(hero){
    hero.addEventListener("pointermove", function(e){
      var box = hero.getBoundingClientRect();
      hero.style.setProperty("--mx", (e.clientX - box.left) + "px");
      hero.style.setProperty("--my", (e.clientY - box.top) + "px");
    });
  }

  // Software cards tilt and glow under the pointer
  document.querySelectorAll(".product-card").forEach(function(card){
    card.addEventListener("pointermove", function(e){
      var box = card.getBoundingClientRect();
      var x = (e.clientX - box.left) / box.width;
      var y = (e.clientY - box.top) / box.height;
      card.style.setProperty("--cx", (x * 100) + "%");
      card.style.setProperty("--cy", (y * 100) + "%");
      card.style.setProperty("--ry", ((x - .5) * 7).toFixed(2) + "deg");
      card.style.setProperty("--rx", ((.5 - y) * 7).toFixed(2) + "deg");
    });
    card.addEventListener("pointerleave", function(){
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    });
  });
})();
