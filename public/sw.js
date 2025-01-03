const CACHE_NAME = 'curately-cache-v1';
const DOMAIN = 'https://www.curately.shop';

self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
        '/offline.html'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);
  
  // Don't cache cross-origin requests (like Supabase API calls)
  if (url.origin !== location.origin && url.origin !== DOMAIN) {
    return fetch(event.request);
  }

  const pathname = url.pathname;
  
  // Check if this is a direct storefront access (short URL) or regular storefront path
  const isStorefrontAccess = pathname.startsWith('/storefront/');
  
  if (isStorefrontAccess) {
    console.log('Handling storefront request:', pathname);
    
    // Extract storefront ID from path
    const storefrontId = pathname.split('/')[2];
    
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            console.log('Found cached response for:', pathname);
            return response;
          }

          console.log('Fetching new response for:', pathname);
          return fetch(event.request)
            .then((fetchResponse) => {
              if (!fetchResponse || fetchResponse.status !== 200) {
                console.log('Received non-200 response for:', pathname);
                return fetchResponse;
              }

              // Clone the response as it can only be used once
              const responseToCache = fetchResponse.clone();

              // Cache the fetched response for this specific storefront
              caches.open(`${CACHE_NAME}-${storefrontId}`).then((cache) => {
                console.log('Caching new response for:', pathname);
                cache.put(event.request, responseToCache);
              });

              return fetchResponse;
            })
            .catch(error => {
              console.error('Fetch failed:', error);
              // Return the offline page if available
              return caches.match('/offline.html');
            });
        })
    );
  } else {
    // For non-storefront requests, use network-first strategy
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(event.request))
    );
  }
});

// Clean up old caches on activation
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName.startsWith(CACHE_NAME) && cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});