import { Metadata } from 'next';
import Link from 'next/link';
import { WifiIcon } from '@heroicons/react/24/outline';
import RetryButton from './RetryButton';

export const metadata: Metadata = {
  title: 'Offline - Pulse UTD News',
  description:
    'You are currently offline. Please check your internet connection.',
  robots: 'noindex, nofollow',
};

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <WifiIcon className="h-24 w-24 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            You&apos;re Offline
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            It looks like you&apos;ve lost your internet connection. Don&apos;t
            worry, you can still browse some cached content.
          </p>
        </div>

        <div className="space-y-4">
          <RetryButton />

          <Link
            href="/"
            className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
          >
            Go to Homepage
          </Link>
        </div>

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
            Offline Features Available:
          </h3>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Browse recently viewed articles</li>
            <li>• Access cached content</li>
            <li>• View saved articles</li>
          </ul>
        </div>

        <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
          <p>
            Once you&apos;re back online, new content will be automatically
            loaded.
          </p>
        </div>
      </div>
    </div>
  );
}
