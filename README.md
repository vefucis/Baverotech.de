# Baverotech — Landing page

Profesionāla, animēta vienas lapas mājaslapa būvniecības uzņēmumam.
Krāsas: balts / melns / oranžs. Bez ietvariem — tīrs HTML, CSS un JS.

## Apskate

```powershell
node server.js
```

Pēc tam atver http://localhost:4173

(Var atvērt arī `index.html` tieši pārlūkā, bet ar serveri viss strādā droši.)

## Faili

| Fails | Saturs |
|-------|--------|
| `index.html` | Lapas struktūra un saturs |
| `css/styles.css` | Viss dizains un animācijas |
| `js/main.js` | Projekti, lightbox galerija, animācijas, forma |
| `server.js` | Vienkāršs lokāls serveris apskatei |

## Saturs ko nomainīt

**Kontakti** (`index.html`): tālrunis, e-pasts, darba laiks — sadaļa `#contact` un footer.

**Atsauksmes** (`index.html`): sadaļa `#reviews` — teksts, vārdi, pilsētas.

**Projekti un bildes** (`js/main.js`):
- Pašlaik bildes nāk no `picsum.photos` kā demo (vajadzīgs internets).
- Lai liktu īstos foto: ieliec attēlus mapē `images/` un masīvā `PROJECTS`
  nomaini `main` un `gallery` vērtības uz failu ceļiem, piem.:
  ```js
  main: "images/ozoli-main.jpg",
  gallery: ["images/ozoli-1.jpg", "images/ozoli-2.jpg", ...]
  ```
- Katram projektam: 1 galvenā bilde + tik thumbu, cik vēlies (rāda 5,
  pārējie paslēpjas zem "+N" pogas, bet visi atveras lightbox).

**Forma**: pašlaik demo režīmā (parāda paldies ziņu). Lai sūtītu e-pastu,
jāpieslēdz backend vai serviss (piem., Formspree) — varu palīdzēt.

## Logo un krāsas

- Logo: `images/logo.svg` — oriģinālais vektorfails (caurspīdīgs fons), izmantots
  header. `images/logo.png` — 2320×1156 caurspīdīgs PNG (favicon/social/druka).
- Brenda krāsas: navy `#172944`, oranžs `#ca672e`, pelēks `#8a8d92`,
  papīra balts `#f4f2ed`. Definētas `css/styles.css` (`:root`).
- Nosaukums "Bavero GmbH" lietots visā lapā. E-pasts `info@bavero.de` ir
  placeholder — nomaini uz īsto.
