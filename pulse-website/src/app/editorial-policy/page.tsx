import { Metadata } from 'next'
import PageHeader from '../../components/PageHeader'
import AdBanner from '../../components/AdBanner'

export const metadata: Metadata = {
  title: 'Editorial Policy - Pulse News',
  description: 'Learn about Pulse News editorial standards, journalism ethics, and our commitment to accurate, unbiased reporting. Discover our editorial guidelines and principles.',
  keywords: 'editorial policy, journalism ethics, news standards, editorial guidelines, pulse news editorial',
  openGraph: {
    title: 'Editorial Policy - Pulse News',
    description: 'Learn about Pulse News editorial standards, journalism ethics, and our commitment to accurate, unbiased reporting.',
    url: 'https://www.pulsenews.publicvm.com/editorial-policy',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Editorial Policy - Pulse News',
    description: 'Learn about Pulse News editorial standards, journalism ethics, and our commitment to accurate, unbiased reporting.',
  },
}

export default function EditorialPolicyPage() {
  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Editorial Policy', href: '/editorial-policy' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="Editorial Policy"
        description="Our commitment to journalistic excellence, accuracy, and ethical reporting standards"
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
                <h2 className="heading-secondary text-2xl text-text-primary mb-4">Our Editorial Mission</h2>
                <p className="text-body mb-4">
                  Pulse News is committed to providing accurate, fair, and comprehensive news coverage that serves 
                  the public interest. Our editorial mission is to inform, educate, and empower our readers with 
                  reliable journalism that upholds the highest standards of integrity and professionalism.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="heading-secondary text-2xl text-text-primary mb-4">Editorial Standards</h2>
                <h3 className="heading-secondary text-xl text-text-primary mb-3">Accuracy and Verification</h3>
                <ul className="list-disc list-inside text-body space-y-2 mb-4">
                  <li>All facts are verified through multiple reliable sources</li>
                  <li>We correct errors promptly and transparently</li>
                  <li>Sources are identified whenever possible</li>
                  <li>Anonymous sources are used only when necessary and verified</li>
                </ul>

                <h3 className="heading-secondary text-xl text-text-primary mb-3">Fairness and Balance</h3>
                <ul className="list-disc list-inside text-body space-y-2 mb-4">
                  <li>Multiple perspectives are presented in controversial stories</li>
                  <li>We strive for proportional coverage</li>
                  <li>Personal opinions are clearly distinguished from news reporting</li>
                  <li>We avoid sensationalism and inflammatory language</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="heading-secondary text-2xl text-text-primary mb-4">Independence and Integrity</h2>
                <p className="text-body mb-4">
                  Pulse News maintains editorial independence from all external influences, including:
                </p>
                <ul className="list-disc list-inside text-body space-y-2 mb-4">
                  <li>Political parties and government entities</li>
                  <li>Corporate sponsors and advertisers</li>
                  <li>Special interest groups</li>
                  <li>Personal relationships and financial interests</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="heading-secondary text-2xl text-text-primary mb-4">Conflict of Interest</h2>
                <p className="text-body mb-4">
                  Our journalists and editors are required to:
                </p>
                <ul className="list-disc list-inside text-body space-y-2 mb-4">
                  <li>Disclose any potential conflicts of interest</li>
                  <li>Avoid covering stories where they have personal involvement</li>
                  <li>Refuse gifts or favors that could influence reporting</li>
                  <li>Maintain professional distance from sources</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="heading-secondary text-2xl text-text-primary mb-4">Privacy and Sensitivity</h2>
                <p className="text-body mb-4">
                  We respect individual privacy while serving the public interest:
                </p>
                <ul className="list-disc list-inside text-body space-y-2 mb-4">
                  <li>Private individuals' privacy is protected unless there's clear public interest</li>
                  <li>Victims of crimes are treated with sensitivity</li>
                  <li>Children's identities are protected in sensitive stories</li>
                  <li>Graphic content is used only when necessary and with appropriate warnings</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="heading-secondary text-2xl text-text-primary mb-4">Corrections and Accountability</h2>
                <p className="text-body mb-4">
                  When errors occur, we:
                </p>
                <ul className="list-disc list-inside text-body space-y-2 mb-4">
                  <li>Acknowledge mistakes promptly and prominently</li>
                  <li>Provide clear corrections with explanations</li>
                  <li>Learn from errors to prevent future occurrences</li>
                  <li>Welcome feedback from readers and sources</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="heading-secondary text-2xl text-text-primary mb-4">Social Media and Digital Standards</h2>
                <p className="text-body mb-4">
                  Our digital and social media content follows the same editorial standards:
                </p>
                <ul className="list-disc list-inside text-body space-y-2 mb-4">
                  <li>Social media posts are fact-checked and verified</li>
                  <li>Breaking news is confirmed before publication</li>
                  <li>User-generated content is verified when used</li>
                  <li>Online comments are moderated for civility</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="heading-secondary text-2xl text-text-primary mb-4">Contact Our Editorial Team</h2>
                <p className="text-body mb-4">
                  For editorial concerns, corrections, or feedback:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-body">
                    <strong>Editorial Email:</strong> editorial@pulsenews.publicvm.com<br />
                    <strong>Editor-in-Chief:</strong> editor@pulsenews.publicvm.com<br />
                    <strong>Corrections:</strong> corrections@pulsenews.publicvm.com
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