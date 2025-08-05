// Service Worker Registration and Management
// This utility handles service worker registration, updates, and communication

interface ServiceWorkerConfig {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onError?: (error: Error) => void;
}

const isLocalhost = typeof window !== 'undefined' && Boolean(
  window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

export function register(config?: ServiceWorkerConfig) {
  if ('serviceWorker' in navigator) {
    const publicUrl = new URL(
      process.env.PUBLIC_URL || '',
      window.location.href
    );
    if (publicUrl.origin !== window.location.origin) {
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = '/sw.js';

      if (isLocalhost) {
        checkValidServiceWorker(swUrl, config);
        navigator.serviceWorker.ready.then(() => {
          console.log(
            'This web app is being served cache-first by a service worker.'
          );
        });
      } else {
        registerValidSW(swUrl, config);
      }
    });
  }
}

function registerValidSW(swUrl: string, config?: ServiceWorkerConfig) {
  navigator.serviceWorker
    .register(swUrl)
    .then(registration => {
      console.log('Service Worker registered successfully:', registration);

      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }

        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              console.log(
                'New content is available and will be used when all tabs for this page are closed.'
              );

              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              console.log('Content is cached for offline use.');

              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch(error => {
      console.error('Error during service worker registration:', error);
      if (config && config.onError) {
        config.onError(error);
      }
    });
}

function checkValidServiceWorker(swUrl: string, config?: ServiceWorkerConfig) {
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then(response => {
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        navigator.serviceWorker.ready.then(registration => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log(
        'No internet connection found. App is running in offline mode.'
      );
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister();
      })
      .catch(error => {
        console.error(error.message);
      });
  }
}

// Update service worker
export function updateServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.update();
    });
  }
}

// Skip waiting and activate new service worker
export function skipWaiting() {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
  }
}

// Get service worker version
export function getServiceWorkerVersion(): Promise<string> {
  return new Promise((resolve, reject) => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      const messageChannel = new MessageChannel();

      messageChannel.port1.onmessage = event => {
        if (event.data && event.data.version) {
          resolve(event.data.version);
        } else {
          reject(new Error('No version received'));
        }
      };

      navigator.serviceWorker.controller.postMessage({ type: 'GET_VERSION' }, [
        messageChannel.port2,
      ]);
    } else {
      reject(new Error('Service worker not available'));
    }
  });
}

// Check if app is running in standalone mode (PWA)
export function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone ===
      true
  );
}

// Check if device is online
export function isOnline(): boolean {
  return navigator.onLine;
}

// Listen for online/offline events
export function addConnectivityListeners(
  onOnline?: () => void,
  onOffline?: () => void
) {
  if (onOnline) {
    window.addEventListener('online', onOnline);
  }

  if (onOffline) {
    window.addEventListener('offline', onOffline);
  }

  return () => {
    if (onOnline) {
      window.removeEventListener('online', onOnline);
    }
    if (onOffline) {
      window.removeEventListener('offline', onOffline);
    }
  };
}

// Cache management utilities
export async function clearCache(cacheName?: string) {
  if ('caches' in window) {
    if (cacheName) {
      await caches.delete(cacheName);
    } else {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
    }
  }
}

export async function getCacheSize(): Promise<number> {
  if (
    'caches' in window &&
    'storage' in navigator &&
    'estimate' in navigator.storage
  ) {
    const estimate = await navigator.storage.estimate();
    return estimate.usage || 0;
  }
  return 0;
}

// Background sync utilities (for future implementation)
export function requestBackgroundSync(tag: string) {
  if (
    'serviceWorker' in navigator &&
    'sync' in window.ServiceWorkerRegistration.prototype
  ) {
    navigator.serviceWorker.ready.then(registration => {
      return (
        registration as ServiceWorkerRegistration & {
          sync: { register: (tag: string) => Promise<void> };
        }
      ).sync.register(tag);
    });
  }
}

// Push notification utilities (for future implementation)
export async function subscribeToPushNotifications(): Promise<PushSubscription | null> {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      });
      return subscription;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return null;
    }
  }
  return null;
}

export async function unsubscribeFromPushNotifications(): Promise<boolean> {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        return await subscription.unsubscribe();
      }
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
    }
  }
  return false;
}
