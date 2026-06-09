// Vienkāršs statisks failu serveris lokālai apskatei: `node server.js`
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 4173;
const ROOT = __dirname;
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".json": "application/json"
};

http.createServer((req, res) => {
  // Lokāls augšupielādes galapunkts (logo PNG eksportam no pārlūka)
  if (req.method === "POST" && req.url.split("?")[0] === "/__save") {
    const name = (new URL(req.url, "http://x").searchParams.get("name") || "out.png").replace(/[^\w.-]/g, "");
    let body = "";
    req.on("data", (c) => { body += c; });
    req.on("end", () => {
      const b64 = body.replace(/^data:[^;]+;base64,/, "");
      fs.writeFile(path.join(ROOT, "images", name), Buffer.from(b64, "base64"), (e) => {
        res.writeHead(e ? 500 : 200, { "Content-Type": "text/plain" }).end(e ? "ERR" : "OK");
      });
    });
    return;
  }

  let urlPath = decodeURIComponent(req.url.split("?")[0]);
  if (urlPath === "/") urlPath = "/index.html";
  const filePath = path.join(ROOT, path.normalize(urlPath));
  if (!filePath.startsWith(ROOT)) { res.writeHead(403).end(); return; }
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404, { "Content-Type": "text/plain" }).end("404"); return; }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(filePath)] || "application/octet-stream" });
    res.end(data);
  });
}).listen(PORT, () => console.log("Baverotech → http://localhost:" + PORT));
