const { cache } = require("react");

const currentCache = 'cache-v1.0';
const files = [
    'admnistracion/index.html',
    'docente/inicio.html',
    'estudiantes  /index.html',
    //'./css/style.css',
    './js/app.js',
    //Poner una página de no hya conexión para que se mande a mostrar ahi
    '/.pages/offline.html',
];

    self.addEventListener('install', event => {
        console.log('SW Install: Instalando SW');

        event.waitUntil(
            //esta es la variable global de cache
            caches.open(currentCache).then(cache => {
            return cache.addAll(files);
            })
        );
    });

self.addEventListener('fetch', event => {
    const resp = fetch(event.request)
    .catch( ()=>
    {
        console.error("Recuperando la página sin conexión.", event);
        return caches
        .open(currentCache)
        .then((cache) => cache.match('pages/offline.html')); 
    })
})