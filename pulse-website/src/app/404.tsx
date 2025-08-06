import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 - Page Not Found | Pulse News',
  description: 'The page you are looking for could not be found. Return to Pulse News homepage for the latest news from Kenya and around the world.',
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-pulse-red rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-4xl font-roboto">P</span>
          </div>
          <h1 className="heading-primary text-6xl font-bold text-pulse-red mb-4">404</h1>
          <h2 className="heading-secondary text-2xl text-text-primary mb-4">Page Not Found</h2>
          <p className="text-body text-text-secondary mb-8">
            Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block w-full bg-pulse-red text-white py-3 px-6 rounded-lg font-medium hover:bg-pulse-red-dark transition-colors duration-200 btn-modern"
          >
            Return to Homepage
          </Link>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Link
              href="/?category=politics"
              className="flex-1 bg-white text-pulse-red border border-pulse-red py-2 px-4 rounded-lg font-medium hover:bg-pulse-red hover:text-white transition-colors duration-200"
            >
              Politics
            </Link>
            <Link
              href="/?category=business"
              className="flex-1 bg-white text-pulse-red border border-pulse-red py-2 px-4 rounded-lg font-medium hover:bg-pulse-red hover:text-white transition-colors duration-200"
            >
              Business
            </Link>
            <Link
              href="/?category=sports"
              className="flex-1 bg-white text-pulse-red border border-pulse-red py-2 px-4 rounded-lg font-medium hover:bg-pulse-red hover:text-white transition-colors duration-200"
            >
              Sports
            </Link>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-text-secondary">
            If you believe this is an error, please{' '}
            <Link href="/contact" className="text-pulse-red hover:underline">
              contact us
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}