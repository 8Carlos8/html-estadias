const { cache } = require("react");

const currentCache = "cache-v1.0";
const files = [
  "admnistracion/index.html",
  "docente/inicio.html",
  "estudiantes  /index.html",
  //'./css/style.css',
  "./js/app.js",
  //Poner una página de no hay conexión para que se mande a mostrar ahí
  "pages/offline.html",
];

self.addEventListener("install", (event) => {
  console.log("SW Install: Instalando SW");

  event.waitUntil(
    caches.open(currentCache).then((cache) => {
      return cache.addAll(files);
    })
  );
});

//Actualizar okis :)
self.addEventListener("activate", (event) => {
  console.log("SW Activate: Activando nuevo SW");

  const cacheWhitelist = [currentCache];

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheWhitelist.includes(cacheName)) {
              console.log("SW Activate: Borrando caché antiguo", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Lógica de fallback offline
self.addEventListener("fetch", (event) => {
  const resp = fetch(event.request).catch(() => {
    console.error("Recuperando la página sin conexión.", event);
    return caches
      .open(currentCache)
      .then((cache) => cache.match("pages/offline.html"));
  });
});
