'use client';

import { ArrowPathIcon } from '@heroicons/react/24/outline';

export default function RetryButton() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <button
      onClick={handleRetry}
      className="w-full flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
    >
      <ArrowPathIcon className="h-5 w-5 mr-2" />
      Try Again
    </button>
  );
}