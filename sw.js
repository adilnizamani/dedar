// Dedar offline support. Change VERSION after every update.
const VERSION = "dedar-v30";
const FILES = ["./","./apple-touch-icon.png","./atkinson-hyperlegible-latin-400-normal.woff2","./atkinson-hyperlegible-latin-700-normal.woff2","./bricolage-grotesque-latin-600-normal.woff2","./bricolage-grotesque-latin-800-normal.woff2","./icon-192.png","./icon-512.png","./icon-maskable-512.png","./index.html","./manifest.json","./noto-naskh-arabic-arabic-400-normal.woff2","./noto-naskh-arabic-arabic-600-normal.woff2","./noto-sans-devanagari-devanagari-400-normal.woff2","./noto-sans-devanagari-devanagari-600-normal.woff2","./noto-sans-devanagari-devanagari-700-normal.woff2"];

// Install: always download fresh copies, never from the browser's short-term cache.
self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES.map(u => new Request(u, {cache: "reload"})))));
  self.skipWaiting();
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // The app page itself: try the internet first so updates show right away. Offline: use the saved copy.
  if (req.mode === "navigate" || url.pathname.endsWith("/index.html")) {
    e.respondWith(fetch(req.url, {cache: "no-cache"}).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put("./", copy)); }
      return res;
    }).catch(() => caches.match("./")));
    return;
  }
  // Everything else (fonts, icons, recordings): saved copy first, then the internet.
  e.respondWith(caches.match(req, {ignoreSearch: true}).then(r => r || fetch(req).then(res => {
    if (res.ok && url.pathname.endsWith(".mp3")) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
    return res;
  })));
});
