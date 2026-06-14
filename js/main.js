(function () {
  "use strict";

  function img(seed, w, h) {
    return "https://picsum.photos/seed/baverotech-" + seed + "/" + w + "/" + h;
  }

  /* īsts faila ceļš (images/...) tiek lietots kā ir; citādi picsum vietturis */
  function resolve(ref, w, h) {
    return /^images\//.test(ref) ? ref : img(ref, w, h);
  }

  var PROJECTS = [
    {
      cat: "Daudzdzīvokļu nams",
      title: "Valcprofila jumta montāža daudzdzīvokļu namam Anklamā",
      desc: "Tradicionālā valcprofila jumta seguma montāža daudzdzīvokļu namam Anklamā, Vācijā. Pilns risinājums no seguma līdz jumta drošības elementiem.",
      meta: [["Segums", "Valcprofils"], ["Platība", "—"], ["Gads", "2024"], ["Cena", "—"], ["Lokācija", "Vācija"]],
      main: "images/Portfolio/Anklam/anklam_1.webp",
      gallery: [
        "images/Portfolio/Anklam/anklam_2.webp",
        "images/Portfolio/Anklam/anklam_3.webp",
        "images/Portfolio/Anklam/anklam_4.webp",
        "images/Portfolio/Anklam/anklam_5.webp",
        "images/Portfolio/Anklam/anklam_6.webp",
        "images/Portfolio/Anklam/anklam_7.webp",
        "images/Portfolio/Anklam/anklam_8.webp",
        "images/Portfolio/Anklam/anklam_9.webp",
        "images/Portfolio/Anklam/anklam_10.webp"
      ]
    },
    {
      cat: "Jumta konstrukcija",
      title: "Jumta konstrukcijas izbūve privātmājai",
      desc: "Jumta nesošās konstrukcijas izbūve privātmājai — karkasa montāža, sagatavojot pamatu seguma ieklāšanai.",
      meta: [["Segums", "—"], ["Platība", "—"], ["Gads", "—"], ["Cena", "—"], ["Lokācija", "Latvija"]],
      main: "images/Portfolio/Ziperkalns/ziperkalns.webp",
      gallery: [
        "images/Portfolio/Ziperkalns/ziperkalns_1.webp",
        "images/Portfolio/Ziperkalns/ziperkalns_2.webp",
        "images/Portfolio/Ziperkalns/ziperkalns_3.webp",
        "images/Portfolio/Ziperkalns/ziperkalns_4.webp",
        "images/Portfolio/Ziperkalns/ziperkalns_5.webp",
        "images/Portfolio/Ziperkalns/ziperkalns_6.webp",
        "images/Portfolio/Ziperkalns/ziperkalns_7.webp",
        "images/Portfolio/Ziperkalns/ziperkalns_8.webp",
        "images/Portfolio/Ziperkalns/ziperkalns_9.webp",
        "images/Portfolio/Ziperkalns/ziperkalns_10.webp"
      ]
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
               '<img src="' + resolve(seed, 320, 320) + '" alt="' + p.title + ', attēls ' + dataIdx + '" loading="lazy" /></button>';
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
      imgs.push({ src: resolve(seed, 1500, 1050), cap: PROJECTS[p].title });
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

  /* ---- galerijas karuselis ---- */
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

    /* lightbox */
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
      if (dir > 0 && viewport.scrollLeft >= set) viewport.scrollLeft -= set;
      else if (dir < 0 && viewport.scrollLeft < step) viewport.scrollLeft += set;
      viewport.scrollBy({ left: dir * step, behavior: "smooth" });
    }
    if (prev) prev.addEventListener("click", function () { go(-1); });
    if (next) next.addEventListener("click", function () { go(1); });

    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var timer = null;
    var inView = true;
    function startAuto() { if (!reduce && inView && !timer) timer = setInterval(function () { go(1); }, 3500); }
    function stopAuto() { if (timer) { clearInterval(timer); timer = null; } }
    gallery.addEventListener("mouseenter", stopAuto);
    gallery.addEventListener("mouseleave", startAuto);
    gallery.addEventListener("focusin", stopAuto);
    gallery.addEventListener("focusout", startAuto);
    document.addEventListener("visibilitychange", function () { document.hidden ? stopAuto() : startAuto(); });
    /* autoplay tikai tad, kad galerija ir redzeslokā */
    if ("IntersectionObserver" in window) {
      inView = false;
      var galIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          inView = en.isIntersecting;
          if (inView) startAuto(); else stopAuto();
        });
      }, { threshold: .2 });
      galIO.observe(gallery);
    }
    startAuto();
  })();

  /* ---- Sortiments produktu popup ---- */
  (function () {
    function g(name) { return "images/Galerija/" + name + ".webp"; }
    /* .svc--materials .svc__list */
    var PRODUCTS = {
      "Valcētā skārda segumi": { cat: "Jumta materiāli", img: g("stehfalzdach"), desc: "Tradicionālais valcētais skārda jumts ir izturīgs, pārbaudīts un tiek izmantots jau vairāk nekā 100 gadus. Tas izceļas ar klasisku vertikālo šuvju dizainu, kalpošanas laiku un izcilu aizsardzību pret laikapstākļiem. Valcprofili Klasika ir mūsdienīga tradicionālā falcētā jumta variants ar ērtu *Click* savienojuma sistēmu. Šo segumu iespējams ieklāt bez valcēšanas iekārtas un citiem speciāliem instrumentiem. Loksnes tiek stiprinātas ar skrūvēm vai naglām, bet stiprinājumu vietas paliek paslēptas valcē, saglabājot tīru un sakoptu jumta izskatu." },
      "Trapecveida profils": { cat: "Jumta materiāli", img: g("trapezblech-dachdeckung"), desc: "Trapecveida profils ir praktisks un izturīgs metāla lokšņu segums, ko izmanto gan jumtiem, gan ēku fasādēm. Materiāls ir salīdzinoši viegls, ātri montējams un ekonomisks, tāpēc tas ir piemērots gan privātmājām, gan saimniecības ēkām, angāriem, garāžām un lielākiem objektiem, kur svarīgas ir gan izmaksas, gan ilgmūžība." },
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

  /* ---- hero ievada animācija (GSAP) ---- */
  (function () {
    var reduceM = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var hero = document.querySelector(".hero");
    if (!hero || !window.gsap || reduceM) return; /* bez GSAP paliek CSS reveal */

    var topItems = hero.querySelectorAll(".hero__top span");
    var lines = hero.querySelectorAll(".hero__title .reveal-line > span");
    var asideP = hero.querySelectorAll(".hero__aside p");
    var photo = hero.querySelector(".hero__photo");
    var img = photo && photo.querySelector("img");
    var stats = hero.querySelectorAll(".hero__stats .hs");

    /* GSAP pārņem — neitralizē CSS reveal pārejas hero sekcijā */
    Array.prototype.forEach.call(hero.querySelectorAll(".reveal, .reveal-line, .reveal-line > span"), function (el) {
      el.style.transition = "none";
      el.classList.add("is-visible");
    });

    var tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(topItems, { y: -14, opacity: 0 }, { y: 0, opacity: 1, duration: .6, stagger: .08 }, 0)
      .fromTo(lines, { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: .14, ease: "power4.out" }, .1);
    if (photo && img) {
      tl.fromTo(photo, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 1.15, ease: "power4.inOut" }, .25)
        .fromTo(img, { scale: 1.16 }, { scale: 1, duration: 1.6, ease: "power2.out" }, .25);
    }
    tl.fromTo(asideP, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .7, stagger: .12 }, .6)
      .fromTo(stats, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: .7, stagger: .09 }, .8);

    /* maiga foto paralakse skrullējot */
    if (img) {
      var toY = gsap.quickTo(img, "yPercent", { duration: .5, ease: "power2.out" });
      window.addEventListener("scroll", function () {
        var k = Math.max(0, Math.min(window.scrollY / (hero.offsetHeight || 1), 1));
        toY(k * 7);
      }, { passive: true });
    }
  })();

  /* ---- GSAP ienākšanas animācijas: galerija un projekti ---- */
  (function () {
    var reduceM = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!window.gsap || reduceM || !("IntersectionObserver" in window)) return;

    function takeover(el) { el.style.transition = "none"; el.classList.add("is-visible"); }

    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        io2.unobserve(en.target);
        if (en.target.__play) en.target.__play();
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -6% 0px" });

    /* galerija: viss bloks ienāk kā viens (item netiek kustināti — netraucē
       karuseļa skrullam un lazy-load attēliem) */
    var gal = document.querySelector(".gallery");
    if (gal) {
      takeover(gal);
      var gView = gal.querySelector(".gallery__viewport");
      var gNav = gal.querySelectorAll(".gallery__nav");
      gsap.set(gView, { y: 56, opacity: 0 });
      gsap.set(gNav, { opacity: 0 });
      gal.__play = function () {
        gsap.timeline({ defaults: { ease: "power3.out" } })
          .to(gView, { y: 0, opacity: 1, duration: .9, clearProps: "transform,opacity" })
          .to(gNav, { opacity: 1, duration: .5, clearProps: "opacity" }, "-=.4");
      };
      io2.observe(gal);
    }

    /* projekti: attēla clip-wipe (pamīšus virziens) + satura stagger */
    Array.prototype.forEach.call(document.querySelectorAll(".proj"), function (proj, i) {
      takeover(proj);
      var wrap = proj.querySelector(".proj__img");
      var pimg = wrap && wrap.querySelector("img");
      var info = proj.querySelectorAll(".proj__cat, .proj__title, .proj__desc, .proj__meta");
      var thumbs = proj.querySelectorAll(".thumb");
      var fromRight = i % 2 === 1;
      if (wrap) gsap.set(wrap, { clipPath: fromRight ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)" });
      if (pimg) { pimg.style.transition = "none"; gsap.set(pimg, { scale: 1.15 }); }
      gsap.set(info, { y: 26, opacity: 0 });
      gsap.set(thumbs, { y: 16, opacity: 0 });
      proj.__play = function () {
        var tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        if (wrap) tl.to(wrap, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.05, ease: "power4.inOut", clearProps: "clipPath" }, 0);
        if (pimg) tl.to(pimg, { scale: 1.01, duration: 1.5, ease: "power2.out", onComplete: function () {
          gsap.set(pimg, { clearProps: "transform" }); pimg.style.transition = ""; /* atdod CSS hover */
        } }, 0);
        tl.to(info, { y: 0, opacity: 1, duration: .65, stagger: .09, clearProps: "all" }, .25)
          .to(thumbs, { y: 0, opacity: 1, duration: .5, stagger: .05, clearProps: "all" }, .5);
      };
      io2.observe(proj);
    });
  })();

  document.getElementById("year").textContent = new Date().getFullYear();
})();
