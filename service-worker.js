const CACHE_NAME =
  "dav-lais-v1";


const urlsToCache = [

  "/",

  "/index.html",

  "/css/login.css",

  "/css/dashboard.css",

  "/js/auth.js",

  "/js/dashboard.js",

  "/js/estoque.js",

  "/js/firebase.js",

  "/js/pdv.js",

  "/js/storage.js",

  "/pages/dashboard.html",

  "/pages/pdv.html",

  "/pages/estoque.html",

  "/pages/financeiro.html",

  "/pages/analises.html"
];


// INSTALA CACHE
self.addEventListener(
  "install",
  (event) => {

    event.waitUntil(

      caches.open(CACHE_NAME)

        .then((cache) => {

          return cache.addAll(
            urlsToCache
          );
        })
    );
  }
);


// RESPONDE CACHE
self.addEventListener(
  "fetch",
  (event) => {

    event.respondWith(

      caches.match(event.request)

        .then((response) => {

          return (
            response ||
            fetch(event.request)
          );
        })
    );
  }
);