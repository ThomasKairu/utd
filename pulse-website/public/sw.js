// Service Worker for Pulse UTD News
// Version 1.0.0

const CACHE_NAME = 'pulse-news-v1';
const STATIC_CACHE_NAME = 'pulse-news-static-v1';
const DYNAMIC_CACHE_NAME = 'pulse-news-dynamic-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/favicon.ico',
  // Add other critical assets
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /^https:\/\/.*\.supabase\.co\/rest\/v1\/articles/,
  /^\/api\/search/,
];

// Image cache patterns
const IMAGE_CACHE_PATTERNS = [
  /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
  /^https:\/\/images\.unsplash\.com/,
  /^https:\/\/.*\.supabase\.co\/storage/,
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');

  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Static assets cached');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Failed to cache static assets', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');

  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (
              cacheName !== STATIC_CACHE_NAME &&
              cacheName !== DYNAMIC_CACHE_NAME &&
              cacheName !== CACHE_NAME
            ) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!request.url.startsWith('http')) {
    return;
  }

  // Handle different types of requests with appropriate strategies
  if (isStaticAsset(request)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE_NAME));
  } else if (isAPIRequest(request)) {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE_NAME));
  } else if (isImageRequest(request)) {
    event.respondWith(cacheFirst(request, DYNAMIC_CACHE_NAME));
  } else if (isNavigationRequest(request)) {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE_NAME));
  } else {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE_NAME));
  }
});

// Cache strategies
async function cacheFirst(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      console.log('Service Worker: Serving from cache', request.url);
      return cachedResponse;
    }

    console.log('Service Worker: Fetching from network', request.url);
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const responseClone = networkResponse.clone();
      await cache.put(request, responseClone);
    }

    return networkResponse;
  } catch (error) {
    console.error('Service Worker: Cache first failed', error);

    // Return offline page for navigation requests
    if (isNavigationRequest(request)) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      return (
        cache.match('/offline') || new Response('Offline', { status: 503 })
      );
    }

    throw error;
  }
}

async function networkFirst(request, cacheName) {
  try {
    console.log('Service Worker: Fetching from network', request.url);
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      const responseClone = networkResponse.clone();

      // Don't cache large responses
      if (responseClone.headers.get('content-length') < 5000000) {
        // 5MB limit
        await cache.put(request, responseClone);
      }
    }

    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Network failed, trying cache', request.url);
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline page for navigation requests
    if (isNavigationRequest(request)) {
      const staticCache = await caches.open(STATIC_CACHE_NAME);
      return (
        staticCache.match('/offline') ||
        new Response('Offline', { status: 503 })
      );
    }

    throw error;
  }
}

// Helper functions
function isStaticAsset(request) {
  const url = new URL(request.url);
  return (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.includes('.css') ||
    url.pathname.includes('.js') ||
    url.pathname === '/manifest.json' ||
    url.pathname === '/favicon.ico'
  );
}

function isAPIRequest(request) {
  const url = new URL(request.url);
  return (
    API_CACHE_PATTERNS.some(pattern => pattern.test(request.url)) ||
    url.pathname.startsWith('/api/')
  );
}

function isImageRequest(request) {
  return IMAGE_CACHE_PATTERNS.some(pattern => pattern.test(request.url));
}

function isNavigationRequest(request) {
  return (
    request.mode === 'navigate' ||
    (request.method === 'GET' &&
      request.headers.get('accept').includes('text/html'))
  );
}

// Background sync for offline actions
self.addEventListener('sync', event => {
  console.log('Service Worker: Background sync', event.tag);

  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Implement background sync logic here
    // For example, sync offline form submissions, analytics, etc.
    console.log('Service Worker: Performing background sync');
  } catch (error) {
    console.error('Service Worker: Background sync failed', error);
  }
}

// Push notifications (for future implementation)
self.addEventListener('push', event => {
  console.log('Service Worker: Push received', event);

  const options = {
    body: event.data ? event.data.text() : 'New article available!',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: 'explore',
        title: 'Read Article',
        icon: '/icon-explore.png',
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-close.png',
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification('Pulse UTD News', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  console.log('Service Worker: Notification clicked', event);

  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(clients.openWindow('/'));
  }
});

// Message handler for communication with main thread
self.addEventListener('message', event => {
  console.log('Service Worker: Message received', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

console.log('Service Worker: Loaded successfully');
