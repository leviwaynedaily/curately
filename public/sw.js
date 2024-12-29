const CACHE_NAME = 'curately-cache-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Get the pathname from the request URL
  const url = new URL(event.request.url);
  
  // Don't cache cross-origin requests (like Supabase API calls)
  if (url.origin !== location.origin) {
    return;
  }

  const pathname = url.pathname;

  // Check if this is a storefront request
  if (pathname.startsWith('/storefront/')) {
    // Extract storefront ID from the URL
    const storefrontId = pathname.split('/')[2];
    
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((fetchResponse) => {
          // Clone the response as it can only be used once
          const responseToCache = fetchResponse.clone();

          // Cache the fetched response for this specific storefront
          caches.open(`${CACHE_NAME}-${storefrontId}`).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return fetchResponse;
        });
      })
    );
  } else {
    // For non-storefront requests, use default caching strategy
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});