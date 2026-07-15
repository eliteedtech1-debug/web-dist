/**
 * Chunk Loading Error Recovery
 * Handles failed chunk loading in production
 */

// Add to existing service worker or create new one
self.addEventListener('fetch', (event) => {
  // Handle chunk loading failures
  if (event.request.url.includes('/assets/') && event.request.url.endsWith('.js')) {
    event.respondWith(
      fetch(event.request)
        .catch((error) => {
          console.warn('Chunk loading failed, attempting cache fallback:', event.request.url);
          
          // Try to get from cache
          return caches.match(event.request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                console.log('Serving chunk from cache:', event.request.url);
                return cachedResponse;
              }
              
              // If not in cache, try one more fetch with different headers
              return fetch(event.request, {
                cache: 'reload',
                headers: {
                  'Cache-Control': 'no-cache'
                }
              });
            })
            .catch(() => {
              // Last resort: return a script that triggers page reload
              console.error('All chunk loading attempts failed for:', event.request.url);
              
              const reloadScript = `
                console.warn('Chunk loading failed completely. Reloading page...');
                setTimeout(() => window.location.reload(), 1000);
              `;
              
              return new Response(reloadScript, {
                headers: { 'Content-Type': 'application/javascript' }
              });
            });
        })
    );
  }
});

// Cache chunks when they load successfully
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/assets/') && event.request.url.endsWith('.js')) {
    event.respondWith(
      caches.open('chunks-v1').then((cache) => {
        return fetch(event.request).then((response) => {
          // Cache successful chunk loads
          if (response.ok) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    );
  }
});
