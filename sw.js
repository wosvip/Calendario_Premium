"use strict";

const CACHE_NAME = "calendario-wosvip-v2-visual";

const ARQUIVOS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/style.css",
  "./js/holidays.js",
  "./js/calendar.js",
  "./js/app.js",
  "./assets/icons/icone-192.png",
  "./assets/icons/icone-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ARQUIVOS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(chaves =>
      Promise.all(
        chaves
          .filter(chave => chave !== CACHE_NAME)
          .map(chave => caches.delete(chave))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if(event.request.method !== "GET"){
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(respostaRede => {
        const copia = respostaRede.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, copia);
        });
        return respostaRede;
      })
      .catch(() => caches.match(event.request))
      .then(resposta => resposta || caches.match("./index.html"))
  );
});
