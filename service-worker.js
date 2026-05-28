const CACHE_NAME = "dav-lais-v3";

const urlsToCache = [

    "/",

    "/index.html",

    "/pages/dashboard.html",

    "/pages/pdv.html",

    "/pages/estoque.html",

    "/pages/financeiro.html",

    "/pages/analises.html",

    "/css/dashboard.css",

    "/js/firebase.js",

    "/js/pdv.js",

    "/js/dashboard.js",

    "/js/estoque.js",

    "/js/storage.js"
];


// =========================
// INSTALL
// =========================

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


// =========================
// FETCH
// =========================

self.addEventListener(

    "fetch",

    (event) => {

        event.respondWith(

            fetch(event.request)

            .then((response) => {

                return response;

            })

            .catch(() => {

                return caches.match(
                    event.request
                );
            })
        );
    }
);


// =========================
// ACTIVATE
// =========================

self.addEventListener(

    "activate",

    (event) => {

        event.waitUntil(

            caches.keys()

            .then((cacheNames) => {

                return Promise.all(

                    cacheNames.map((cache) => {

                        if(

                            cache !== CACHE_NAME

                        ){

                            return caches.delete(
                                cache
                            );
                        }
                    })
                );
            })
        );
    }
);