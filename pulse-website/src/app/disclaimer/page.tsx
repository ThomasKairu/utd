import { Metadata } from 'next'
import PageHeader from '../../components/PageHeader'
import AdBanner from '../../components/AdBanner'

export const metadata: Metadata = {
  title: 'Disclaimer - Pulse News',
  description: 'Read Pulse News disclaimer regarding content accuracy, liability limitations, and external links. Understand our terms for using news content and information.',
  keywords: 'disclaimer, liability, content accuracy, pulse news disclaimer, news disclaimer',
  openGraph: {
    title: 'Disclaimer - Pulse News',
    description: 'Read Pulse News disclaimer regarding content accuracy, liability limitations, and external links.',
    url: 'https://www.pulsenews.publicvm.com/disclaimer',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Disclaimer - Pulse News',
    description: 'Read Pulse News disclaimer regarding content accuracy, liability limitations, and external links.',
  },
}

export default function DisclaimerPage() {
  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Disclaimer', href: '/disclaimer' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="Disclaimer"
        description="Important information about content accuracy, liability, and the use of our news services"
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
                <h2 className="heading-secondary text-2xl text-text-primary mb-4">General Information</h2>
                <p className="text-body mb-4">
                  The information on this website is provided on an "as is" basis. To the fullest extent 
                  permitted by law, Pulse News excludes all representations, warranties, obligations, and 
                  liabilities arising out of or in connection with the information provided on this website.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="heading-secondary text-2xl text-text-primary mb-4">Content Accuracy</h2>
                <p className="text-body mb-4">
                  While we strive to provide accurate and up-to-date information:
                </p>
                <ul className="list-disc list-inside text-body space-y-2 mb-4">
                  <li>We make no representations or warranties about the accuracy, completeness, or suitability of the information</li>
                  <li>Information may become outdated and we are not obligated to update it</li>
                  <li>Errors or omissions may occur despite our best efforts</li>
                  <li>You should verify important information from other sources</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="heading-secondary text-2xl text-text-primary mb-4">Limitation of Liability</h2>
                <p className="text-body mb-4">
                  Pulse News will not be liable for any damages arising from:
                </p>
                <ul className="list-disc list-inside text-body space-y-2 mb-4">
                  <li>Use or inability to use our website or content</li>
                  <li>Reliance on information provided on our website</li>
                  <li>Interruptions or delays in service</li>
                  <li>Loss of data or business opportunities</li>
                  <li>Any indirect, consequential, or punitive damages</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="heading-secondary text-2xl text-text-primary mb-4">External Links</h2>
                <p className="text-body mb-4">
                  Our website may contain links to external websites:
                </p>
                <ul className="list-disc list-inside text-body space-y-2 mb-4">
                  <li>We are not responsible for the content of external websites</li>
                  <li>Links do not constitute endorsement of external sites</li>
                  <li>External sites have their own terms and privacy policies</li>
                  <li>We recommend reviewing external sites' policies before use</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="heading-secondary text-2xl text-text-primary mb-4">News Content</h2>
                <p className="text-body mb-4">
                  Regarding our news content:
                </p>
                <ul className="list-disc list-inside text-body space-y-2 mb-4">
                  <li>News is reported based on available information at the time of publication</li>
                  <li>Developing stories may have incomplete or changing details</li>
                  <li>We strive for accuracy but cannot guarantee complete precision</li>
                  <li>Opinions expressed in editorials are those of the authors</li>
                  <li>Reader comments do not reflect our editorial position</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="heading-secondary text-2xl text-text-primary mb-4">User-Generated Content</h2>
                <p className="text-body mb-4">
                  For content submitted by users:
                </p>
                <ul className="list-disc list-inside text-body space-y-2 mb-4">
                  <li>We do not endorse or verify user-submitted content</li>
                  <li>Users are responsible for their own submissions</li>
                  <li>We reserve the right to moderate or remove content</li>
                  <li>User content does not represent our views or opinions</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="heading-secondary text-2xl text-text-primary mb-4">Professional Advice</h2>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                  <p className="text-body">
                    <strong>Important:</strong> Information on this website should not be considered as 
                    professional advice. Always consult qualified professionals for:
                  </p>
                </div>
                <ul className="list-disc list-inside text-body space-y-2 mb-4">
                  <li>Legal matters</li>
                  <li>Financial decisions</li>
                  <li>Medical concerns</li>
                  <li>Technical issues</li>
                  <li>Business decisions</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="heading-secondary text-2xl text-text-primary mb-4">Copyright and Fair Use</h2>
                <p className="text-body mb-4">
                  Regarding copyrighted material:
                </p>
                <ul className="list-disc list-inside text-body space-y-2 mb-4">
                  <li>We respect intellectual property rights</li>
                  <li>Content is used under fair use provisions where applicable</li>
                  <li>Original sources are credited when possible</li>
                  <li>Copyright holders may request removal of content</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="heading-secondary text-2xl text-text-primary mb-4">Jurisdictional Issues</h2>
                <p className="text-body mb-4">
                  This website is operated from Kenya and governed by Kenyan law. Content may not be 
                  appropriate or available for use in other jurisdictions. Users are responsible for 
                  compliance with local laws and regulations.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="heading-secondary text-2xl text-text-primary mb-4">Changes to This Disclaimer</h2>
                <p className="text-body mb-4">
                  We reserve the right to modify this disclaimer at any time. Changes will be posted 
                  on this page with an updated revision date. Continued use of our website constitutes 
                  acceptance of any changes.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="heading-secondary text-2xl text-text-primary mb-4">Contact Information</h2>
                <p className="text-body mb-4">
                  If you have questions about this disclaimer:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-body">
                    <strong>Email:</strong> legal@pulsenews.publicvm.com<br />
                    <strong>Subject:</strong> Disclaimer Inquiry<br />
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