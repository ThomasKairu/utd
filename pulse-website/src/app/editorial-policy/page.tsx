import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import AdPlaceholder from '@/components/common/AdPlaceholder';
import Sidebar from '@/components/layout/Sidebar';

export const metadata: Metadata = {
  title: 'Editorial Policy | Pulse News',
  description: 'Read Pulse News editorial policy covering our standards for accuracy, fairness, ethics, and journalistic integrity in news reporting.',
  keywords: 'editorial policy, journalism ethics, news standards, media guidelines, pulse news policy',
  openGraph: {
    title: 'Editorial Policy | Pulse News',
    description: 'Read Pulse News editorial policy covering our standards for accuracy, fairness, ethics, and journalistic integrity.',
    url: 'https://www.pulsenews.publicvm.com/editorial-policy',
    siteName: 'Pulse News',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Editorial Policy | Pulse News',
    description: 'Our editorial standards and journalistic guidelines.',
  },
  alternates: {
    canonical: 'https://www.pulsenews.publicvm.com/editorial-policy',
  },
};

export default function EditorialPolicyPage() {
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
                <li>
                  <Link href="/about" className="hover:text-primary">
                    About
                  </Link>
                </li>
                <li>/</li>
                <li className="text-text-primary">Editorial Policy</li>
              </ol>
            </nav>

            {/* Page Header */}
            <header className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
                Editorial Policy
              </h1>
              <p className="text-xl text-text-secondary leading-relaxed">
                Our commitment to accuracy, fairness, and ethical journalism
              </p>
              <div className="mt-4 text-sm text-text-secondary">
                Last updated: December 2024
              </div>
            </header>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Introduction</h2>
                <p className="text-text-primary leading-relaxed mb-4">
                  This editorial policy outlines the standards and principles that guide Pulse News in our commitment to delivering accurate, fair, and ethical journalism. These guidelines ensure that our content meets the highest professional standards and serves the public interest.
                </p>
                <p className="text-text-primary leading-relaxed">
                  All members of our editorial team, contributors, and partners are expected to adhere to these principles in their work for Pulse News.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Core Principles</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-text-primary mb-3">1. Accuracy and Truth</h3>
                    <ul className="list-disc list-inside space-y-2 text-text-secondary">
                      <li>All facts must be verified through reliable sources before publication</li>
                      <li>We strive for accuracy in all our reporting and correct errors promptly when they occur</li>
                      <li>Sources must be credible and information must be cross-verified when possible</li>
                      <li>We distinguish clearly between fact and opinion in our content</li>
                      <li>Speculation and rumors are clearly labeled as such</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-text-primary mb-3">2. Fairness and Impartiality</h3>
                    <ul className="list-disc list-inside space-y-2 text-text-secondary">
                      <li>We present multiple perspectives on controversial issues</li>
                      <li>All parties involved in a story are given an opportunity to respond</li>
                      <li>We avoid bias in our reporting and present information objectively</li>
                      <li>Personal opinions of journalists do not influence news reporting</li>
                      <li>We respect the dignity of all individuals in our coverage</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-text-primary mb-3">3. Independence</h3>
                    <ul className="list-disc list-inside space-y-2 text-text-secondary">
                      <li>Our editorial decisions are made independently of commercial, political, or personal interests</li>
                      <li>We maintain clear separation between editorial content and advertising</li>
                      <li>Sponsored content is clearly labeled as such</li>
                      <li>We do not accept payment for editorial coverage</li>
                      <li>Conflicts of interest are disclosed when relevant</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* In-Content Ad */}
              <div className="my-8 flex justify-center">
                <AdPlaceholder width={728} height={90} label="In-Content Ad" />
              </div>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Source Protection and Attribution</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">Source Attribution</h3>
                    <ul className="list-disc list-inside space-y-2 text-text-secondary">
                      <li>We attribute information to its source whenever possible</li>
                      <li>Anonymous sources are used only when necessary and when the information is in the public interest</li>
                      <li>We verify the credibility and motivation of anonymous sources</li>
                      <li>The use of anonymous sources is approved by senior editorial staff</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">Source Protection</h3>
                    <ul className="list-disc list-inside space-y-2 text-text-secondary">
                      <li>We protect the identity of sources who request anonymity</li>
                      <li>We do not reveal confidential sources except in extraordinary circumstances</li>
                      <li>We take appropriate measures to protect source communications</li>
                      <li>We respect off-the-record agreements</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Content Standards</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-text-primary mb-3">Original Reporting</h3>
                    <ul className="list-disc list-inside space-y-2 text-text-secondary">
                      <li>We prioritize original reporting and investigation</li>
                      <li>When using content from other sources, we provide proper attribution</li>
                      <li>We add value through analysis, context, and local perspective</li>
                      <li>Plagiarism is strictly prohibited</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-text-primary mb-3">Language and Tone</h3>
                    <ul className="list-disc list-inside space-y-2 text-text-secondary">
                      <li>We use clear, accessible language appropriate for our audience</li>
                      <li>We avoid inflammatory or sensational language</li>
                      <li>We respect cultural sensitivities and avoid discriminatory language</li>
                      <li>Headlines accurately reflect the content of articles</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-text-primary mb-3">Visual Content</h3>
                    <ul className="list-disc list-inside space-y-2 text-text-secondary">
                      <li>Images and videos must be relevant to the story</li>
                      <li>We respect copyright and obtain proper permissions for visual content</li>
                      <li>Graphic content is used judiciously and with appropriate warnings</li>
                      <li>Photo manipulation beyond basic editing is disclosed</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Technology and Automation</h2>
                <p className="text-text-primary leading-relaxed mb-4">
                  Pulse News uses technology and automation to enhance our news gathering and distribution processes. However, all automated content is subject to human editorial oversight.
                </p>
                <ul className="list-disc list-inside space-y-2 text-text-secondary">
                  <li>AI-generated content is clearly labeled as such</li>
                  <li>Automated content aggregation is supervised by editorial staff</li>
                  <li>All content undergoes editorial review before publication</li>
                  <li>Technology is used to enhance, not replace, human journalism</li>
                  <li>We maintain transparency about our use of automated systems</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Corrections and Accountability</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">Error Correction</h3>
                    <ul className="list-disc list-inside space-y-2 text-text-secondary">
                      <li>We correct errors promptly and transparently</li>
                      <li>Corrections are clearly marked and explain what was changed</li>
                      <li>Significant errors are corrected with equal prominence to the original error</li>
                      <li>We maintain a record of corrections for transparency</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">Feedback and Complaints</h3>
                    <ul className="list-disc list-inside space-y-2 text-text-secondary">
                      <li>We welcome feedback from readers and the public</li>
                      <li>Complaints are investigated thoroughly and responded to promptly</li>
                      <li>We maintain open channels for public input</li>
                      <li>Editorial decisions are explained when requested</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Privacy and Consent</h2>
                <ul className="list-disc list-inside space-y-2 text-text-secondary">
                  <li>We respect individuals&apos; privacy rights</li>
                  <li>We obtain consent for interviews and use of personal information</li>
                  <li>We are particularly careful when reporting on minors</li>
                  <li>Private information is only published when it serves the public interest</li>
                  <li>We respect requests for privacy in sensitive situations</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Legal and Ethical Compliance</h2>
                <ul className="list-disc list-inside space-y-2 text-text-secondary">
                  <li>We comply with all applicable laws and regulations</li>
                  <li>We respect court orders and legal restrictions</li>
                  <li>We adhere to international journalism ethics standards</li>
                  <li>We respect intellectual property rights</li>
                  <li>We maintain professional standards in all our operations</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Contact Information</h2>
                <div className="bg-light-gray p-6 rounded-lg">
                  <p className="text-text-primary mb-4">
                    For questions about our editorial policy, to report errors, or to provide feedback:
                  </p>
                  <div className="space-y-2">
                    <p className="text-text-secondary">
                      <strong>Editorial Team:</strong> editorial@pulsenews.publicvm.com
                    </p>
                    <p className="text-text-secondary">
                      <strong>Corrections:</strong> corrections@pulsenews.publicvm.com
                    </p>
                    <p className="text-text-secondary">
                      <strong>General Feedback:</strong> feedback@pulsenews.publicvm.com
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-text-primary mb-4">Policy Updates</h2>
                <p className="text-text-primary leading-relaxed mb-4">
                  This editorial policy is reviewed regularly and updated as needed to reflect best practices in journalism and changes in our operations. All updates are published on this page with the revision date.
                </p>
                <p className="text-text-secondary">
                  This policy was last updated in December 2024.
                </p>
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