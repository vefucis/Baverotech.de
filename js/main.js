(function () {
  "use strict";

  function img(seed, w, h) {
    return "https://picsum.photos/seed/baverotech-" + seed + "/" + w + "/" + h;
  }

  var PROJECTS = [
    {
      cat: "Privātmāja",
      title: "Privātmājas dakstiņu jumts",
      desc: "Keramikas dakstiņu jumts ar pilnu komplektāciju. Pasegums, ventilācija, lietusūdens un sniega aizturi.",
      meta: [["Segums", "Dakstiņi"], ["Platība", "240 m²"], ["Gads", "2024"], ["Cena", "Pēc tāmes"], ["Lokācija", "Latvija"]],
      main: img("1-main", 1280, 960),
      gallery: ["1-a", "1-b", "1-c", "1-d", "1-e", "1-f", "1-g"]
    },
    {
      cat: "Fasāde",
      title: "Fasādes apšuvums un siltināšana",
      desc: "Ventilējamā fasāde ar jaunu apšuvumu. Materiāli un montāža saskaņoti vienā risinājumā.",
      meta: [["Sistēma", "Ventilējamā"], ["Platība", "310 m²"], ["Gads", "2023"], ["Cena", "Pēc tāmes"], ["Lokācija", "Latvija"]],
      main: img("2-main", 1280, 960),
      gallery: ["2-a", "2-b", "2-c", "2-d", "2-e", "2-f"]
    },
    {
      cat: "Industriāls objekts",
      title: "Industriāls trapecprofila jumts",
      desc: "Lielas platības segums ar trapecprofilu, drošības elementiem un ūdens novadīšanu. Nodots grafikā.",
      meta: [["Segums", "Trapecprofils"], ["Platība", "2 400 m²"], ["Gads", "2025"], ["Cena", "Pēc tāmes"], ["Lokācija", "Latvija"]],
      main: img("3-main", 1280, 960),
      gallery: ["3-a", "3-b", "3-c", "3-d", "3-e", "3-f", "3-g", "3-h"]
    }
  ];

  var listEl = document.getElementById("projectList");

  function buildThumbs(p, pIndex) {
    var visible = p.gallery.slice(0, 5);
    return visible.map(function (seed, i) {
      var dataIdx = i + 1;
      if (i === 4 && p.gallery.length > 5) {
        return '<button class="thumb thumb--more" data-project="' + pIndex + '" data-index="' + dataIdx + '" aria-label="Atvērt galeriju">+' + (p.gallery.length - 4) + '</button>';
      }
      return '<button class="thumb" data-project="' + pIndex + '" data-index="' + dataIdx + '" aria-label="Atvērt attēlu">' +
               '<img src="' + img(seed, 320, 320) + '" alt="' + p.title + ', attēls ' + dataIdx + '" loading="lazy" /></button>';
    }).join("");
  }

  PROJECTS.forEach(function (p, i) {
    var no = ("0" + (i + 1)).slice(-2);
    var meta = p.meta.map(function (m) {
      return '<div><dt>' + m[0] + '</dt><dd>' + m[1] + '</dd></div>';
    }).join("");

    var el = document.createElement("article");
    el.className = "proj reveal";
    el.innerHTML =
      '<a class="proj__img" data-project="' + i + '" data-index="0" role="button" tabindex="0" aria-label="' + p.title + ', atvērt galeriju">' +
        '<span class="proj__idx">PROJEKTS ' + no + '</span>' +
        '<img src="' + p.main + '" alt="' + p.title + '" loading="lazy" />' +
        '<span class="proj__open">Galerija <i aria-hidden="true">↗</i></span>' +
      '</a>' +
      '<div class="proj__info">' +
        '<span class="proj__cat">' + p.cat + '</span>' +
        '<h3 class="proj__title">' + p.title + '</h3>' +
        '<p class="proj__desc">' + p.desc + '</p>' +
        '<dl class="proj__meta">' + meta + '</dl>' +
        '<div class="thumbs">' + buildThumbs(p, i) + '</div>' +
      '</div>';
    listEl.appendChild(el);
  });

  /* ---- lightb ---- */
  var lb = document.getElementById("lightbox");
  var lbImage = document.getElementById("lbImage");
  var lbCaption = document.getElementById("lbCaption");
  var lbCounter = document.getElementById("lbCounter");
  var current = { images: [], index: 0 };

  function projectImages(p) {
    var imgs = [{ src: PROJECTS[p].main, cap: PROJECTS[p].title }];
    PROJECTS[p].gallery.forEach(function (seed) {
      imgs.push({ src: img(seed, 1500, 1050), cap: PROJECTS[p].title });
    });
    return imgs;
  }
  function showImage() {
    var imgs = current.images;
    if (!imgs.length) return;
    if (current.index < 0) current.index = imgs.length - 1;
    if (current.index >= imgs.length) current.index = 0;
    var it = imgs[current.index];
    lbImage.style.opacity = 0;
    var img2 = new Image();
    img2.onload = function () { lbImage.src = it.src; lbImage.alt = it.cap; lbImage.style.opacity = ""; };
    img2.src = it.src;
    lbCaption.textContent = it.cap;
    lbCounter.textContent = (current.index + 1) + " / " + imgs.length;
  }
  function openImages(imgs, idx) {
    current.images = imgs; current.index = idx; showImage();
    lb.classList.add("is-open"); lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function openLightbox(project, idx) {
    openImages(projectImages(project), idx);
  }
  function closeLightbox() {
    lb.classList.remove("is-open"); lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  function step(d) { current.index += d; showImage(); }

  listEl.addEventListener("click", function (e) {
    var t = e.target.closest("[data-project]");
    if (!t) return;
    openLightbox(parseInt(t.dataset.project, 10), parseInt(t.dataset.index, 10));
  });
  listEl.addEventListener("keydown", function (e) {
    if (e.key !== "Enter" && e.key !== " ") return;
    var t = e.target.closest(".proj__img");
    if (!t) return;
    e.preventDefault();
    openLightbox(parseInt(t.dataset.project, 10), parseInt(t.dataset.index, 10));
  });

  document.getElementById("lbClose").addEventListener("click", closeLightbox);
  document.getElementById("lbPrev").addEventListener("click", function () { step(-1); });
  document.getElementById("lbNext").addEventListener("click", function () { step(1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) closeLightbox(); });
  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });

  /* ---- hero ---- */
  var revealEls = document.querySelectorAll(".reveal, .reveal-line");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---- skrūlef ---- */
  var header = document.getElementById("header");
  function onScroll() { header.classList.toggle("is-scrolled", window.scrollY > 24); }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- mnav ---- */
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");
  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") { nav.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); }
  });

  var form = document.getElementById("contactForm");
  var note = document.getElementById("formNote");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    note.hidden = false;
    form.querySelectorAll("input, textarea, select").forEach(function (f) { if (f.type !== "submit") f.value = ""; });
  });

  /* ---- galerijas karuselis (bezgalīgs loops) ---- */
  (function () {
    var gallery = document.getElementById("gallery");
    if (!gallery) return;
    var viewport = gallery.querySelector(".gallery__viewport");
    var track = gallery.querySelector(".gallery__track");
    var prev = gallery.querySelector(".gallery__nav--prev");
    var next = gallery.querySelector(".gallery__nav--next");
    if (!viewport || !track) return;

    /* dublē attēlu kopu, lai loops būtu nemanāms */
    var originals = Array.prototype.slice.call(track.children);
    originals.forEach(function (node) {
      var clone = node.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    });

    /* lightbox: pilna izmēra attēli (no oriģinālajiem, ne klonētajiem) */
    var lbImages = originals.map(function (node) {
      var im = node.querySelector("img");
      return { src: im.getAttribute("src"), cap: im.getAttribute("alt") || "" };
    });
    track.addEventListener("click", function (e) {
      var item = e.target.closest(".gallery__item");
      if (!item) return;
      var idx = Array.prototype.indexOf.call(track.children, item) % originals.length;
      openImages(lbImages, idx);
    });

    function itemStep() {
      var first = track.firstElementChild;
      if (!first) return viewport.clientWidth;
      return first.getBoundingClientRect().width + 5; /* attēls + margin-right */
    }
    function oneSet() { return track.scrollWidth / 2; } /* vienas kopas platums */

    function go(dir) {
      var step = itemStep();
      var set = oneSet();
      /* pirms soļa nemanāmi pārlecam uz ekvivalento pozīciju otrā kopā, lai vienmēr ir vieta kustēties */
      if (dir > 0 && viewport.scrollLeft >= set) viewport.scrollLeft -= set;
      else if (dir < 0 && viewport.scrollLeft < step) viewport.scrollLeft += set;
      viewport.scrollBy({ left: dir * step, behavior: "smooth" });
    }
    if (prev) prev.addEventListener("click", function () { go(-1); });
    if (next) next.addEventListener("click", function () { go(1); });

    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var timer = null;
    function startAuto() { if (!reduce && !timer) timer = setInterval(function () { go(1); }, 3500); }
    function stopAuto() { if (timer) { clearInterval(timer); timer = null; } }
    gallery.addEventListener("mouseenter", stopAuto);
    gallery.addEventListener("mouseleave", startAuto);
    gallery.addEventListener("focusin", stopAuto);
    gallery.addEventListener("focusout", startAuto);
    document.addEventListener("visibilitychange", function () { document.hidden ? stopAuto() : startAuto(); });
    startAuto();
  })();

  document.getElementById("year").textContent = new Date().getFullYear();
})();
