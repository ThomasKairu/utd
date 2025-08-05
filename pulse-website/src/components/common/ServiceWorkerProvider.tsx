'use client';

import { useEffect, useState } from 'react';
import {
  register,
  addConnectivityListeners,
  isOnline,
} from '@/utils/serviceWorker';

interface ServiceWorkerProviderProps {
  children: React.ReactNode;
}

export function ServiceWorkerProvider({
  children,
}: ServiceWorkerProviderProps) {
  const [isOffline, setIsOffline] = useState(false);
  const [showUpdateAvailable, setShowUpdateAvailable] = useState(false);
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    // Set initial online status
    setIsOffline(!isOnline());

    // Register service worker
    register({
      onSuccess: registration => {
        console.log('Service Worker registered successfully');
        setRegistration(registration);
      },
      onUpdate: registration => {
        console.log('Service Worker update available');
        setRegistration(registration);
        setShowUpdateAvailable(true);
      },
      onError: error => {
        console.error('Service Worker registration failed:', error);
      },
    });

    // Listen for connectivity changes
    const removeListeners = addConnectivityListeners(
      () => {
        setIsOffline(false);
        console.log('App is back online');
      },
      () => {
        setIsOffline(true);
        console.log('App is offline');
      }
    );

    return removeListeners;
  }, []);

  const handleUpdate = () => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  };

  const dismissUpdate = () => {
    setShowUpdateAvailable(false);
  };

  return (
    <>
      {children}

      {/* Offline Indicator */}
      {isOffline && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-yellow-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-slide-up">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">You&apos;re offline</p>
              <p className="text-xs opacity-90">Some features may be limited</p>
            </div>
          </div>
        </div>
      )}

      {/* Update Available Notification */}
      {showUpdateAvailable && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-slide-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">Update available</p>
                <p className="text-xs opacity-90">
                  Refresh to get the latest version
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleUpdate}
                className="text-xs bg-white text-blue-600 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
              >
                Update
              </button>
              <button
                onClick={dismissUpdate}
                className="text-xs text-white opacity-75 hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ServiceWorkerProvider;
