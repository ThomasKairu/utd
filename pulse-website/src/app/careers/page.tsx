import { Metadata } from 'next'
import PageHeader from '../../components/PageHeader'
import AdBanner from '../../components/AdBanner'

export const metadata: Metadata = {
  title: 'Careers - Pulse News',
  description: 'Join the Pulse News team! Explore career opportunities in journalism, digital media, and news production. Build your career with Kenya\'s trusted news source.',
  keywords: 'pulse news careers, journalism jobs, media careers, news jobs kenya, editorial positions',
  openGraph: {
    title: 'Careers - Pulse News',
    description: 'Join the Pulse News team! Explore career opportunities in journalism, digital media, and news production.',
    url: 'https://www.pulsenews.publicvm.com/careers',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Careers - Pulse News',
    description: 'Join the Pulse News team! Explore career opportunities in journalism, digital media, and news production.',
  },
}

export default function CareersPage() {
  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Careers', href: '/careers' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="Join Our Team"
        description="Build your career with Kenya's trusted news source. Explore opportunities in journalism and digital media."
        breadcrumbs={breadcrumbs}
      />
      
      <div className="container mx-auto px-4 py-12">
        {/* Ad Banner */}
        <div className="mb-12">
          <AdBanner className="mx-auto" />
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <section>
                <h2 className="heading-secondary text-3xl text-text-primary mb-6">Why Work at Pulse News?</h2>
                <div className="bg-white p-8 rounded-lg shadow-md">
                  <p className="text-body text-lg leading-relaxed mb-6">
                    At Pulse News, we're passionate about delivering quality journalism that makes a difference. 
                    Join our dynamic team of professionals who are committed to informing and empowering communities 
                    across Kenya and beyond.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="heading-secondary text-lg text-pulse-red mb-3">Growth Opportunities</h3>
                      <p className="text-body text-sm">
                        Advance your career with mentorship, training programs, and leadership development opportunities.
                      </p>
                    </div>
                    <div>
                      <h3 className="heading-secondary text-lg text-pulse-red mb-3">Competitive Benefits</h3>
                      <p className="text-body text-sm">
                        Comprehensive health coverage, retirement plans, and performance-based incentives.
                      </p>
                    </div>
                    <div>
                      <h3 className="heading-secondary text-lg text-pulse-red mb-3">Flexible Work</h3>
                      <p className="text-body text-sm">
                        Modern workplace with flexible schedules and remote work options for eligible positions.
                      </p>
                    </div>
                    <div>
                      <h3 className="heading-secondary text-lg text-pulse-red mb-3">Impact</h3>
                      <p className="text-body text-sm">
                        Make a meaningful difference by contributing to quality journalism that serves the public interest.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="heading-secondary text-3xl text-text-primary mb-6">Open Positions</h2>
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-pulse-red">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="heading-secondary text-xl text-text-primary mb-2">Senior Reporter</h3>
                        <p className="text-sm text-text-secondary">Full-time • Nairobi</p>
                      </div>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                        Open
                      </span>
                    </div>
                    <p className="text-body mb-4">
                      Seeking an experienced journalist to cover politics and government affairs. 
                      Must have 3+ years of reporting experience and strong investigative skills.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">Journalism</span>
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">Politics</span>
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">Investigation</span>
                    </div>
                    <button className="text-pulse-red hover:text-pulse-red-dark font-medium transition-colors duration-200">
                      Learn More →
                    </button>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-pulse-red">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="heading-secondary text-xl text-text-primary mb-2">Digital Content Producer</h3>
                        <p className="text-sm text-text-secondary">Full-time • Remote/Nairobi</p>
                      </div>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                        Open
                      </span>
                    </div>
                    <p className="text-body mb-4">
                      Create engaging digital content across our platforms. Experience with social media, 
                      video production, and content management systems required.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">Digital Media</span>
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">Social Media</span>
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">Video</span>
                    </div>
                    <button className="text-pulse-red hover:text-pulse-red-dark font-medium transition-colors duration-200">
                      Learn More →
                    </button>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-gray-300">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="heading-secondary text-xl text-text-primary mb-2">Copy Editor</h3>
                        <p className="text-sm text-text-secondary">Part-time • Remote</p>
                      </div>
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">
                        Coming Soon
                      </span>
                    </div>
                    <p className="text-body mb-4">
                      Review and edit articles for grammar, style, and accuracy. Strong command of English 
                      and experience with AP style preferred.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">Editing</span>
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">Proofreading</span>
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">AP Style</span>
                    </div>
                    <button className="text-gray-500 font-medium cursor-not-allowed">
                      Coming Soon
                    </button>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="heading-secondary text-3xl text-text-primary mb-6">Application Process</h2>
                <div className="bg-white p-8 rounded-lg shadow-md">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-pulse-red rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white font-bold">1</span>
                      </div>
                      <h3 className="heading-secondary text-lg text-text-primary mb-2">Apply</h3>
                      <p className="text-body text-sm">
                        Submit your resume, cover letter, and portfolio samples.
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-pulse-red rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white font-bold">2</span>
                      </div>
                      <h3 className="heading-secondary text-lg text-text-primary mb-2">Interview</h3>
                      <p className="text-body text-sm">
                        Initial screening followed by interviews with our editorial team.
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-pulse-red rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white font-bold">3</span>
                      </div>
                      <h3 className="heading-secondary text-lg text-text-primary mb-2">Join</h3>
                      <p className="text-body text-sm">
                        Complete onboarding and start making an impact with our team.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="heading-secondary text-xl text-text-primary mb-4">Quick Apply</h3>
                  <p className="text-body text-sm mb-4">
                    Interested in joining our team? Send us your resume and we'll keep you in mind for future opportunities.
                  </p>
                  <a
                    href="mailto:careers@pulsenews.publicvm.com"
                    className="inline-block w-full bg-pulse-red text-white py-3 px-4 rounded-lg font-medium hover:bg-pulse-red-dark transition-colors duration-200 text-center"
                  >
                    Send Resume
                  </a>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="heading-secondary text-xl text-text-primary mb-4">Internship Program</h3>
                  <p className="text-body text-sm mb-4">
                    Gain hands-on experience in journalism and digital media through our internship program.
                  </p>
                  <a
                    href="mailto:internships@pulsenews.publicvm.com"
                    className="text-pulse-red hover:text-pulse-red-dark font-medium transition-colors duration-200"
                  >
                    Learn More →
                  </a>
                </div>

                <AdBanner width="100%" height="300px" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}