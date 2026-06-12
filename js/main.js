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

  /* ---- Sortiments produktu popup ---- */
  (function () {
    function g(name) { return "images/Galerija/" + name + ".webp"; }
    /* PLACEHOLDER saturs — aizvieto bildes (img) un aprakstus (desc) ar īstajiem.
       Atslēga = saraksta vienuma teksts index.html (.svc--materials .svc__list li). */
    var PRODUCTS = {
      "Valcētā skārda segumi": { cat: "Jumta materiāli", img: g("stehfalzdach"), desc: "Nepārtraukti valcēts skārda segums ar slēptu savienojumu — hermētisks un izturīgs risinājums gan vienkāršām, gan sarežģītām jumta formām." },
      "Valcprofils klik, trapecveida profils": { cat: "Jumta materiāli", img: g("trapezblech-dachdeckung"), desc: "Tērauda loksnes profili ar ātru klik savienojumu vai klasisko trapecveida formu — ekonomisks un ātri montējams jumta segums." },
      "Bezazbesta šīferis": { cat: "Jumta materiāli", img: g("asbestfreie-wellplatten"), desc: "Mūsdienīgs šķiedru cementa vilnītis bez azbesta — drošs un ilgmūžīgs segums ar tradicionālu izskatu." },
      "Māla un betona dakstiņi": { cat: "Jumta materiāli", img: g("tondachziegel"), desc: "Dabīgi māla un betona dakstiņi ar augstu izturību un plašu krāsu klāstu reprezentablam jumtam." },
      "Skursteņu cepures": { cat: "Jumta materiāli", img: g("blechformteile"), desc: "Skursteņu pārsegi un cepures, kas pasargā dūmvadu no nokrišņiem un uzlabo vilkmi." },
      "Jumta laipas un citi piekļuves risinājumi": { cat: "Jumta materiāli", img: g("stehfalz-detailausbildung"), desc: "Drošas jumta laipas, kāpšļi un servisa platformas ērtai un drošai piekļuvei apkopes darbiem." },
      "Sniega aiztures un jumta drošības elementi": { cat: "Jumta materiāli", img: g("stehfalzblechdach"), desc: "Sniega barjeras, drošības āķi un norobežojumi, kas pasargā cilvēkus un īpašumu zem jumta." },
      "Ventilācijas sistēmas": { cat: "Jumta materiāli", img: g("dachbelueftung"), desc: "Jumta ventilācijas elementi, kas nodrošina pareizu gaisa apmaiņu un pasargā konstrukciju no mitruma." },
      "Lietus ūdens novadīšanas sistēmas": { cat: "Jumta materiāli", img: g("dachrinne"), desc: "Pilnas lietusūdens sistēmas — renes, notekcaurules un piederumi efektīvai ūdens novadīšanai." },

      "Fasāžu apšuvuma materiāli": { cat: "Fasādes", img: g("holzfassade"), desc: "Daudzveidīgi fasādes apšuvuma materiāli — metāls, kompozīts un koks — estētiskam un izturīgam ēkas veidolam." },
      "Ventilējamās fasādes sistēmas": { cat: "Fasādes", img: g("dach-und-fassadenmaterialien"), desc: "Ventilējamās fasādes ar gaisa spraugu, kas uzlabo ēkas energoefektivitāti un pagarina apdares kalpošanas laiku." },
      "Stiprinājumi un profili": { cat: "Fasādes", img: g("blechprofile-und-formteile"), desc: "Apakškonstrukcijas profili un stiprinājumi, kas nodrošina drošu un precīzu fasādes montāžu." },
      "Sistēmu komplektācija un montāža": { cat: "Fasādes", img: g("metalldachmaterialien"), desc: "Pilna fasādes sistēmas komplektācija ar saskaņotiem elementiem un profesionālu montāžas atbalstu." },
      "Sendvičpaneļi": { cat: "Fasādes", img: g("stehfalzblechdach"), desc: "Siltinātie sendvičpaneļi ātrai fasāžu un jumtu montāžai ar augstu siltumizolāciju." },

      "Zāģmateriāli": { cat: "Koka un metāla konstrukcijas", img: g("bauholz"), desc: "Kvalitatīvi zāģmateriāli būvniecībai — žāvēti, kalibrēti un gatavi lietošanai." },
      "Konstrukciju kokmateriāli": { cat: "Koka un metāla konstrukcijas", img: g("sparren-und-konstruktionsholz"), desc: "Konstrukciju un nesošie kokmateriāli ar sertificētu izturību jumta un karkasa risinājumiem." },
      "Tērauda konstruktīvie profili": { cat: "Koka un metāla konstrukcijas", img: g("dachbinder"), desc: "Tērauda konstruktīvie profili nesošajām konstrukcijām — izturīgi, precīzi un ilgmūžīgi." },

      "Kamīna malka": { cat: "Siltumenerģija", img: g("bauholz"), desc: "Žāvēta lapu koku malka ar augstu siltumatdevi kamīniem un krāsnīm." },
      "Kokogles": { cat: "Siltumenerģija", img: g("dachmaterialien"), desc: "Tīras kokogles stabilai temperatūrai un ilgai, vienmērīgai degšanai." },
      "Briketes": { cat: "Siltumenerģija", img: g("sparren-und-konstruktionsholz"), desc: "Presētas kurināmā briketes ar augstu enerģijas blīvumu un minimāliem pelniem." },
      "Granulas": { cat: "Siltumenerģija", img: g("bauholz"), desc: "Koksnes granulas automātiskajiem apkures katliem — efektīvs un ekoloģisks kurināmais." }
    };

    var pop = document.getElementById("productPopup");
    if (!pop) return;
    var card = pop.querySelector(".pop__card");
    var backdrop = pop.querySelector(".pop__backdrop");
    var popImage = document.getElementById("popImage");
    var popCat = document.getElementById("popCat");
    var popTitle = document.getElementById("popTitle");
    var popDesc = document.getElementById("popDesc");
    var bodyEls = pop.querySelectorAll(".pop__body > *");
    var lastFocus = null;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var hasGsap = !!window.gsap && !reduce;

    function openProduct(p) {
      popCat.textContent = p.cat;
      popTitle.textContent = p.title;
      popDesc.textContent = p.desc;
      popImage.src = p.img; popImage.alt = p.title;
      lastFocus = document.activeElement;
      pop.classList.add("is-open"); pop.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      document.getElementById("popClose").focus();

      if (hasGsap) {
        gsap.killTweensOf([backdrop, card, popImage, bodyEls]);
        gsap.timeline()
          .fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: .35, ease: "power2.out" })
          .fromTo(card, { opacity: 0, y: 26, scale: .96 }, { opacity: 1, y: 0, scale: 1, duration: .5, ease: "power3.out" }, "-=.18")
          .fromTo(popImage, { scale: 1.1 }, { scale: 1, duration: .9, ease: "power2.out" }, "<")
          .fromTo(bodyEls, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .45, stagger: .07, ease: "power2.out" }, "-=.32");
      } else {
        backdrop.style.opacity = 1; card.style.opacity = 1;
      }
    }
    function finishClose() {
      pop.classList.remove("is-open"); pop.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    function closeProduct() {
      if (hasGsap) {
        gsap.killTweensOf([backdrop, card]);
        gsap.timeline({ onComplete: finishClose })
          .to(card, { opacity: 0, y: 14, scale: .98, duration: .28, ease: "power2.in" })
          .to(backdrop, { opacity: 0, duration: .28, ease: "power2.in" }, "-=.18");
      } else { finishClose(); }
    }

    /* uzlabo saraksta vienumus -> klikšķināmi produkti */
    var items = document.querySelectorAll(".svc--materials .svc__list li");
    Array.prototype.forEach.call(items, function (li) {
      var name = li.textContent.trim();
      var p = PRODUCTS[name];
      if (!p) return;
      p.title = name;
      li.classList.add("prod");
      var idx = Array.prototype.indexOf.call(li.parentElement.children, li) + 1;
      li.innerHTML =
        '<span class="prod__idx mono">' + (idx < 10 ? "0" + idx : idx) + '</span>' +
        '<span class="prod__name">' + name + '</span>' +
        '<span class="prod__desc">' + p.desc + '</span>' +
        '<i class="prod__go" aria-hidden="true">↗</i>';
      li.setAttribute("role", "button");
      li.setAttribute("tabindex", "0");
      li.setAttribute("aria-haspopup", "dialog");
      li.setAttribute("aria-label", name + " — atvērt informāciju");
      li.addEventListener("click", function () { openProduct(p); });
      li.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openProduct(p); }
      });
    });

    pop.addEventListener("click", function (e) {
      if (e.target.closest("[data-pop-close]")) closeProduct();
    });
    document.getElementById("popClose").addEventListener("click", closeProduct);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && pop.classList.contains("is-open")) closeProduct();
    });
  })();

  document.getElementById("year").textContent = new Date().getFullYear();
})();
