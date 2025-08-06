import { Metadata } from 'next'
import PageHeader from '../../components/PageHeader'
import AdBanner from '../../components/AdBanner'

export const metadata: Metadata = {
  title: 'Cookie Policy - Pulse News',
  description: 'Learn about how Pulse News uses cookies and similar technologies to enhance your browsing experience. Understand your cookie preferences and privacy options.',
  keywords: 'cookie policy, cookies, tracking, privacy, pulse news cookies, website cookies',
  openGraph: {
    title: 'Cookie Policy - Pulse News',
    description: 'Learn about how Pulse News uses cookies and similar technologies to enhance your browsing experience.',
    url: 'https://www.pulsenews.publicvm.com/cookies',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cookie Policy - Pulse News',
    description: 'Learn about how Pulse News uses cookies and similar technologies to enhance your browsing experience.',
  },
}

export default function CookiesPage() {
  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Cookie Policy', href: '/cookies' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="Cookie Policy"
        description="How we use cookies and similar technologies to enhance your browsing experience"
        breadcrumbs={breadcrumbs}
      />
      
      <div className="container mx-auto px-4 py-12">
        {/* Ad Banner */}
        <div className="mb-12">
          <AdBanner className="mx-auto" />
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="prose prose-lg max-w-none">
              <p className="text-text-secondary mb-8">
                <strong>Last updated:</strong> January 5, 2024
              </p>

              <section className="mb-8">
                <h2 className="heading-secondary text-2xl text-text-primary mb-4">What Are Cookies?</h2>
                <p className="text-body mb-4">
                  Cookies are small text files that are stored on your device when you visit our website. 
                  They help us provide you with a better browsing experience by remembering your preferences 
                  and analyzing how you use our site.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="heading-secondary text-2xl text-text-primary mb-4">Types of Cookies We Use</h2>
                
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="heading-secondary text-xl text-pulse-red mb-3">Essential Cookies</h3>
                    <p className="text-body mb-2">
                      These cookies are necessary for the website to function properly and cannot be disabled.
                    </p>
                    <ul className="list-disc list-inside text-body text-sm space-y-1">
                      <li>Session management</li>
                      <li>Security features</li>
                      <li>Basic website functionality</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="heading-secondary text-xl text-pulse-red mb-3">Analytics Cookies</h3>
                    <p className="text-body mb-2">
                      These cookies help us understand how visitors interact with our website.
                    </p>
                    <ul className="list-disc list-inside text-body text-sm space-y-1">
                      <li>Page views and traffic analysis</li>
                      <li>User behavior patterns</li>
                      <li>Website performance metrics</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="heading-secondary text-xl text-pulse-red mb-3">Functional Cookies</h3>
                    <p className="text-body mb-2">
                      These cookies enable enhanced functionality and personalization.
                    </p>
                    <ul className="list-disc list-inside text-body text-sm space-y-1">
                      <li>Language preferences</li>
                      <li>Theme settings</li>
                      <li>Personalized content</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="heading-secondary text-xl text-pulse-red mb-3">Advertising Cookies</h3>
                    <p className="text-body mb-2">
                      These cookies are used to deliver relevant advertisements.
                    </p>
                    <ul className="list-disc list-inside text-body text-sm space-y-1">
                      <li>Targeted advertising</li>
                      <li>Ad performance measurement</li>
                      <li>Frequency capping</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="heading-secondary text-2xl text-text-primary mb-4">Third-Party Cookies</h2>
                <p className="text-body mb-4">
                  We may use third-party services that set their own cookies:
                </p>
                <ul className="list-disc list-inside text-body space-y-2 mb-4">
                  <li><strong>Google Analytics:</strong> For website analytics and performance monitoring</li>
                  <li><strong>Social Media Platforms:</strong> For social sharing and embedded content</li>
                  <li><strong>Advertising Networks:</strong> For displaying relevant advertisements</li>
                  <li><strong>Content Delivery Networks:</strong> For faster content loading</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="heading-secondary text-2xl text-text-primary mb-4">Managing Your Cookie Preferences</h2>
                <p className="text-body mb-4">
                  You have several options for managing cookies:
                </p>
                
                <h3 className="heading-secondary text-lg text-text-primary mb-3">Browser Settings</h3>
                <p className="text-body mb-4">
                  Most browsers allow you to control cookies through their settings:
                </p>
                <ul className="list-disc list-inside text-body space-y-2 mb-6">
                  <li>Block all cookies</li>
                  <li>Block third-party cookies only</li>
                  <li>Delete existing cookies</li>
                  <li>Receive notifications when cookies are set</li>
                </ul>

                <h3 className="heading-secondary text-lg text-text-primary mb-3">Opt-Out Links</h3>
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <p className="text-body text-sm mb-2">
                    <strong>Google Analytics:</strong> 
                    <a href="https://tools.google.com/dlpage/gaoptout" className="text-pulse-red hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                      Opt-out Browser Add-on
                    </a>
                  </p>
                  <p className="text-body text-sm">
                    <strong>Advertising:</strong> 
                    <a href="http://www.aboutads.info/choices/" className="text-pulse-red hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                      Digital Advertising Alliance
                    </a>
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="heading-secondary text-2xl text-text-primary mb-4">Impact of Disabling Cookies</h2>
                <p className="text-body mb-4">
                  Disabling cookies may affect your experience on our website:
                </p>
                <ul className="list-disc list-inside text-body space-y-2 mb-4">
                  <li>Some features may not work properly</li>
                  <li>Personalization will be limited</li>
                  <li>You may need to re-enter preferences</li>
                  <li>Analytics data will be incomplete</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="heading-secondary text-2xl text-text-primary mb-4">Updates to This Policy</h2>
                <p className="text-body mb-4">
                  We may update this Cookie Policy from time to time to reflect changes in our practices 
                  or for other operational, legal, or regulatory reasons. We will notify you of any 
                  significant changes by posting the updated policy on our website.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="heading-secondary text-2xl text-text-primary mb-4">Contact Us</h2>
                <p className="text-body mb-4">
                  If you have questions about our use of cookies, please contact us:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-body">
                    <strong>Email:</strong> privacy@pulsenews.publicvm.com<br />
                    <strong>Subject:</strong> Cookie Policy Inquiry
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}