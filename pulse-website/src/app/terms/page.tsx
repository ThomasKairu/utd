import { Metadata } from 'next'
import PageHeader from '../../components/PageHeader'
import AdBanner from '../../components/AdBanner'

export const metadata: Metadata = {
  title: 'Terms of Service - Pulse News',
  description: 'Read Pulse News terms of service to understand the rules and guidelines for using our website and services. Learn about user responsibilities and our content policies.',
  keywords: 'terms of service, user agreement, website terms, content policy, pulse news terms',
  openGraph: {
    title: 'Terms of Service - Pulse News',
    description: 'Read Pulse News terms of service to understand the rules and guidelines for using our website and services.',
    url: 'https://www.pulsenews.publicvm.com/terms',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service - Pulse News',
    description: 'Read Pulse News terms of service to understand the rules and guidelines for using our website and services.',
  },
}

export default function TermsPage() {
  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Terms of Service', href: '/terms' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="Terms of Service"
        description="Please read these terms carefully before using our website and services."
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
                <h2 className="heading-secondary text-2xl text-text-primary mb-4">1. Acceptance of Terms</h2>
                <p className="text-body mb-4">
                  By accessing and using Pulse News website and services, you accept and agree to be bound 
                  by the terms and provision of this agreement. If you do not agree to abide by the above, 
                  please do not use this service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="heading-secondary text-2xl text-text-primary mb-4">2. Use License</h2>
                <p className="text-body mb-4">
                  Permission is granted to temporarily download one copy of the materials on Pulse News 
                  website for personal, non-commercial transitory viewing only. This is the grant of a 
                  license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc list-inside text-body space-y-2 mb-4">
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for any commercial purpose or for any public display</li>
                  <li>Attempt to reverse engineer any software contained on the website</li>
                  <li>Remove any copyright or other proprietary notations from the materials</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="heading-secondary text-2xl text-text-primary mb-4">3. User Content</h2>
                <p className="text-body mb-4">
                  Users may post comments, feedback, and other content. By posting content, you grant 
                  Pulse News a non-exclusive, royalty-free license to use, reproduce, and distribute 
                  your content. You are responsible for ensuring that your content:
                </p>
                <ul className="list-disc list-inside text-body space-y-2 mb-4">
                  <li>Does not violate any laws or regulations</li>
                  <li>Does not infringe on intellectual property rights</li>
                  <li>Is not defamatory, offensive, or harmful</li>
                  <li>Does not contain spam or malicious content</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="heading-secondary text-2xl text-text-primary mb-4">4. Prohibited Uses</h2>
                <p className="text-body mb-4">
                  You may not use our service:
                </p>
                <ul className="list-disc list-inside text-body space-y-2 mb-4">
                  <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                  <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                  <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                  <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                  <li>To submit false or misleading information</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="heading-secondary text-2xl text-text-primary mb-4">5. Disclaimer</h2>
                <p className="text-body mb-4">
                  The materials on Pulse News website are provided on an 'as is' basis. Pulse News makes 
                  no warranties, expressed or implied, and hereby disclaims and negates all other warranties 
                  including without limitation, implied warranties or conditions of merchantability, fitness 
                  for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="heading-secondary text-2xl text-text-primary mb-4">6. Limitations</h2>
                <p className="text-body mb-4">
                  In no event shall Pulse News or its suppliers be liable for any damages (including, 
                  without limitation, damages for loss of data or profit, or due to business interruption) 
                  arising out of the use or inability to use the materials on Pulse News website, even if 
                  Pulse News or an authorized representative has been notified orally or in writing of the 
                  possibility of such damage.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="heading-secondary text-2xl text-text-primary mb-4">7. Accuracy of Materials</h2>
                <p className="text-body mb-4">
                  The materials appearing on Pulse News website could include technical, typographical, 
                  or photographic errors. Pulse News does not warrant that any of the materials on its 
                  website are accurate, complete, or current. Pulse News may make changes to the materials 
                  contained on its website at any time without notice.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="heading-secondary text-2xl text-text-primary mb-4">8. Links</h2>
                <p className="text-body mb-4">
                  Pulse News has not reviewed all of the sites linked to our website and is not responsible 
                  for the contents of any such linked site. The inclusion of any link does not imply 
                  endorsement by Pulse News of the site. Use of any such linked website is at the user's own risk.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="heading-secondary text-2xl text-text-primary mb-4">9. Modifications</h2>
                <p className="text-body mb-4">
                  Pulse News may revise these terms of service for its website at any time without notice. 
                  By using this website, you are agreeing to be bound by the then current version of these 
                  terms of service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="heading-secondary text-2xl text-text-primary mb-4">10. Governing Law</h2>
                <p className="text-body mb-4">
                  These terms and conditions are governed by and construed in accordance with the laws of 
                  Kenya and you irrevocably submit to the exclusive jurisdiction of the courts in that 
                  state or location.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="heading-secondary text-2xl text-text-primary mb-4">11. Contact Information</h2>
                <p className="text-body mb-4">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-body">
                    <strong>Email:</strong> legal@pulsenews.publicvm.com<br />
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