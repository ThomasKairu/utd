import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import AdPlaceholder from '@/components/common/AdPlaceholder';
import Sidebar from '@/components/layout/Sidebar';

export const metadata: Metadata = {
  title: 'About Us | Pulse News',
  description: 'Learn about Pulse News, Kenya&apos;s leading digital news platform providing breaking news, analysis, and insights from across Africa and the world.',
  keywords: 'about pulse news, kenya news, african journalism, digital media, news platform',
  openGraph: {
    title: 'About Us | Pulse News',
    description: 'Learn about Pulse News, Kenya&apos;s leading digital news platform providing breaking news, analysis, and insights from across Africa and the world.',
    url: 'https://www.pulsenews.publicvm.com/about',
    siteName: 'Pulse News',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'About Us | Pulse News',
    description: 'Learn about Pulse News, Kenya&apos;s leading digital news platform.',
  },
  alternates: {
    canonical: 'https://www.pulsenews.publicvm.com/about',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Ad Bar */}
      <div className="bg-light-gray border-b border-medium-gray">
        <div className="container mx-auto px-4 h-24 flex items-center justify-center">
          <AdPlaceholder
            width={970}
            height={90}
            className="hidden lg:block"
            label="Leaderboard Ad"
          />
          <AdPlaceholder
            width={728}
            height={90}
            className="hidden md:block lg:hidden"
            label="Leaderboard Ad"
          />
          <AdPlaceholder
            width={320}
            height={50}
            className="md:hidden"
            label="Mobile Ad"
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Breadcrumb */}
            <nav className="mb-6">
              <ol className="flex items-center space-x-2 text-sm text-text-secondary">
                <li>
                  <Link href="/" className="hover:text-primary">
                    Home
                  </Link>
                </li>
                <li>/</li>
                <li className="text-text-primary">About Us</li>
              </ol>
            </nav>

            {/* Page Header */}
            <header className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
                About Pulse News
              </h1>
              <p className="text-xl text-text-secondary leading-relaxed">
                Kenya&apos;s premier digital news platform, delivering breaking news, in-depth analysis, and insights that matter to you.
              </p>
            </header>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Our Mission</h2>
                <p className="text-text-primary leading-relaxed mb-4">
                  At Pulse News, we are committed to delivering accurate, timely, and relevant news that keeps Kenyans and the global community informed about the events shaping our world. We believe in the power of journalism to drive positive change, foster transparency, and empower citizens with the information they need to make informed decisions.
                </p>
                <p className="text-text-primary leading-relaxed">
                  Our mission is to be the most trusted source of news in Kenya, providing comprehensive coverage of politics, business, technology, sports, and entertainment while maintaining the highest standards of journalistic integrity.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-4">What We Cover</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg border border-medium-gray">
                    <h3 className="text-lg font-semibold text-primary mb-2">Politics</h3>
                    <p className="text-text-secondary">
                      Comprehensive coverage of Kenyan politics, government policies, elections, and political developments across East Africa.
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg border border-medium-gray">
                    <h3 className="text-lg font-semibold text-primary mb-2">Business</h3>
                    <p className="text-text-secondary">
                      Economic news, market analysis, business trends, and financial insights that impact Kenya and the region.
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg border border-medium-gray">
                    <h3 className="text-lg font-semibold text-primary mb-2">Technology</h3>
                    <p className="text-text-secondary">
                      Latest tech innovations, startup news, digital transformation, and technology&apos;s impact on society.
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg border border-medium-gray">
                    <h3 className="text-lg font-semibold text-primary mb-2">Sports</h3>
                    <p className="text-text-secondary">
                      Sports news, results, athlete profiles, and coverage of local and international sporting events.
                    </p>
                  </div>
                </div>
              </section>

              {/* In-Content Ad */}
              <div className="my-8 flex justify-center">
                <AdPlaceholder width={728} height={90} label="In-Content Ad" />
              </div>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Our Values</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">Accuracy</h3>
                    <p className="text-text-secondary">
                      We are committed to factual reporting and verify all information before publication. Our editorial team follows strict fact-checking protocols to ensure the accuracy of every story.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">Independence</h3>
                    <p className="text-text-secondary">
                      We maintain editorial independence and are not influenced by political, commercial, or other external pressures. Our reporting is guided solely by the public interest.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">Transparency</h3>
                    <p className="text-text-secondary">
                      We believe in transparency in our reporting process. We clearly identify our sources when possible and acknowledge when information cannot be independently verified.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">Innovation</h3>
                    <p className="text-text-secondary">
                      We embrace technology and innovation to deliver news in the most accessible and engaging formats, ensuring our audience stays informed in the digital age.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Our Team</h2>
                <p className="text-text-primary leading-relaxed mb-4">
                  Pulse News is powered by a dedicated team of experienced journalists, editors, and digital media professionals who are passionate about delivering quality news content. Our editorial team combines decades of experience in traditional journalism with cutting-edge digital media expertise.
                </p>
                <p className="text-text-primary leading-relaxed">
                  We are proud to be a Kenyan-owned and operated news platform, with deep roots in the communities we serve. Our team understands the local context while maintaining a global perspective on the stories that matter.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Technology & Innovation</h2>
                <p className="text-text-primary leading-relaxed mb-4">
                  Pulse News leverages advanced technology to deliver news efficiently and accurately. Our platform uses automated content aggregation, AI-powered content optimization, and real-time updates to ensure our readers receive the latest news as it happens.
                </p>
                <p className="text-text-primary leading-relaxed">
                  We are committed to digital innovation while maintaining the human touch that makes journalism meaningful. Every automated process is overseen by our editorial team to ensure quality and accuracy.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Contact Us</h2>
                <div className="bg-light-gray p-6 rounded-lg">
                  <p className="text-text-primary mb-4">
                    We value feedback from our readers and are always looking to improve our coverage. Get in touch with us:
                  </p>
                  <div className="space-y-2">
                    <p className="text-text-secondary">
                      <strong>Email:</strong> editorial@pulsenews.publicvm.com
                    </p>
                    <p className="text-text-secondary">
                      <strong>Tips & News:</strong> tips@pulsenews.publicvm.com
                    </p>
                    <p className="text-text-secondary">
                      <strong>Business Inquiries:</strong> business@pulsenews.publicvm.com
                    </p>
                    <p className="text-text-secondary">
                      <strong>Follow us:</strong> @pulsenews on social media
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-text-primary mb-4">Editorial Policy</h2>
                <p className="text-text-primary leading-relaxed mb-4">
                  Our editorial policy ensures that all content published on Pulse News meets the highest standards of journalism. We are committed to accuracy, fairness, and ethical reporting.
                </p>
                <Link 
                  href="/editorial-policy" 
                  className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Read Our Full Editorial Policy
                </Link>
              </section>
            </div>
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <Sidebar />
          </aside>
        </div>
      </div>
    </div>
  );
}