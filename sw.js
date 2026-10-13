// Dedar offline support. Change VERSION after every update so phones fetch the new files.
const VERSION = "dedar-v3";
const FILES = ["./","./apple-touch-icon.png","./atkinson-hyperlegible-latin-400-normal.woff2","./atkinson-hyperlegible-latin-700-normal.woff2","./bricolage-grotesque-latin-600-normal.woff2","./bricolage-grotesque-latin-800-normal.woff2","./icon-192.png","./icon-512.png","./icon-maskable-512.png","./index.html","./manifest.json","./noto-naskh-arabic-arabic-400-normal.woff2","./noto-naskh-arabic-arabic-600-normal.woff2","./noto-sans-devanagari-devanagari-400-normal.woff2","./noto-sans-devanagari-devanagari-600-normal.woff2","./noto-sans-devanagari-devanagari-700-normal.woff2"];
self.addEventListener("install", e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request, {ignoreSearch: true}).then(r => r || fetch(e.request).then(res => {
    if (res.ok && e.request.url.endsWith(".mp3")) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); }
    return res;
  })));
});
