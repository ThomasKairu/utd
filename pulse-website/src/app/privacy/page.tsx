import { Metadata } from 'next'
import PageHeader from '../../components/PageHeader'
import AdBanner from '../../components/AdBanner'

export const metadata: Metadata = {
  title: 'Privacy Policy - Pulse News',
  description: 'Read Pulse News privacy policy to understand how we collect, use, and protect your personal information. Learn about your rights and our commitment to data privacy.',
  keywords: 'privacy policy, data protection, personal information, cookies, user rights, pulse news privacy',
  openGraph: {
    title: 'Privacy Policy - Pulse News',
    description: 'Read Pulse News privacy policy to understand how we collect, use, and protect your personal information.',
    url: 'https://www.pulsenews.publicvm.com/privacy',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy - Pulse News',
    description: 'Read Pulse News privacy policy to understand how we collect, use, and protect your personal information.',
  },
}

export default function PrivacyPage() {
  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Privacy Policy', href: '/privacy' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="Privacy Policy"
        description="Your privacy is important to us. Learn how we protect and handle your personal information."
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
                <h2 className="heading-secondary text-2xl text-text-primary mb-4">1. Information We Collect</h2>
                <p className="text-body mb-4">
                  We collect information you provide directly to us, such as when you create an account, 
                  subscribe to our newsletter, submit comments, or contact us. This may include:
                </p>
                <ul className="list-disc list-inside text-body space-y-2 mb-4">
                  <li>Name and email address</li>
                  <li>Contact information</li>
                  <li>Comments and feedback</li>
                  <li>Newsletter preferences</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="heading-secondary text-2xl text-text-primary mb-4">2. How We Use Your Information</h2>
                <p className="text-body mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside text-body space-y-2 mb-4">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Send you newsletters and updates</li>
                  <li>Respond to your comments and questions</li>
                  <li>Analyze usage patterns to improve user experience</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="heading-secondary text-2xl text-text-primary mb-4">3. Information Sharing</h2>
                <p className="text-body mb-4">
                  We do not sell, trade, or otherwise transfer your personal information to third parties 
                  without your consent, except in the following circumstances:
                </p>
                <ul className="list-disc list-inside text-body space-y-2 mb-4">
                  <li>To comply with legal requirements</li>
                  <li>To protect our rights and safety</li>
                  <li>With service providers who assist in our operations</li>
                  <li>In connection with a business transfer</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="heading-secondary text-2xl text-text-primary mb-4">4. Cookies and Tracking</h2>
                <p className="text-body mb-4">
                  We use cookies and similar tracking technologies to enhance your browsing experience. 
                  Cookies help us:
                </p>
                <ul className="list-disc list-inside text-body space-y-2 mb-4">
                  <li>Remember your preferences</li>
                  <li>Analyze website traffic</li>
                  <li>Provide personalized content</li>
                  <li>Improve website functionality</li>
                </ul>
                <p className="text-body">
                  You can control cookies through your browser settings, but disabling them may affect 
                  website functionality.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="heading-secondary text-2xl text-text-primary mb-4">5. Data Security</h2>
                <p className="text-body mb-4">
                  We implement appropriate security measures to protect your personal information against 
                  unauthorized access, alteration, disclosure, or destruction. However, no method of 
                  transmission over the internet is 100% secure.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="heading-secondary text-2xl text-text-primary mb-4">6. Your Rights</h2>
                <p className="text-body mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside text-body space-y-2 mb-4">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion of your information</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Data portability</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="heading-secondary text-2xl text-text-primary mb-4">7. Children's Privacy</h2>
                <p className="text-body mb-4">
                  Our services are not intended for children under 13. We do not knowingly collect 
                  personal information from children under 13. If we become aware that we have collected 
                  such information, we will take steps to delete it.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="heading-secondary text-2xl text-text-primary mb-4">8. Changes to This Policy</h2>
                <p className="text-body mb-4">
                  We may update this privacy policy from time to time. We will notify you of any changes 
                  by posting the new policy on this page and updating the "Last updated" date.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="heading-secondary text-2xl text-text-primary mb-4">9. Contact Us</h2>
                <p className="text-body mb-4">
                  If you have any questions about this privacy policy, please contact us at:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-body">
                    <strong>Email:</strong> privacy@pulsenews.publicvm.com<br />
                    <strong>Address:</strong> Pulse News, Nairobi, Kenya
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