'use client';

import React, { useState } from 'react';
import Button from '../common/Button';

interface NewsletterSignupProps {
  className?: string;
}

const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  className = '',
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSubscribed(true);
      setEmail('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <div
        className={`bg-green-50 border border-green-200 rounded-lg p-6 text-center ${className}`}
      >
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-6 h-6 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          Successfully Subscribed!
        </h3>
        <p className="text-green-700">
          Thank you for subscribing to our newsletter. You&apos;ll receive the
          latest news updates in your inbox.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`bg-white border border-medium-gray rounded-lg p-6 ${className}`}
    >
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-text-primary mb-2">
          Stay Informed
        </h3>
        <p className="text-text-secondary">
          Get the latest news and updates delivered directly to your inbox. No
          spam, unsubscribe anytime.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full px-4 py-3 border border-medium-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={isLoading}
          />
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isLoading}
          className="w-full"
        >
          Subscribe to Newsletter
        </Button>
      </form>

      <p className="text-xs text-text-secondary text-center mt-4">
        By subscribing, you agree to our{' '}
        <a href="/privacy" className="text-primary hover:underline">
          Privacy Policy
        </a>{' '}
        and{' '}
        <a href="/terms" className="text-primary hover:underline">
          Terms of Service
        </a>
        .
      </p>
    </div>
  );
};

export default NewsletterSignup;
