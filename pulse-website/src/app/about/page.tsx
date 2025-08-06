import { Metadata } from 'next'
import PageHeader from '../../components/PageHeader'
import AdBanner from '../../components/AdBanner'

export const metadata: Metadata = {
  title: 'About Us - Pulse News',
  description: 'Learn about Pulse News, Kenya\'s trusted source for comprehensive news coverage. Discover our mission, values, and commitment to delivering accurate, timely news from Kenya and around the world.',
  keywords: 'about pulse news, kenya news organization, news mission, editorial team, journalism ethics',
  openGraph: {
    title: 'About Us - Pulse News',
    description: 'Learn about Pulse News, Kenya\'s trusted source for comprehensive news coverage.',
    url: 'https://www.pulsenews.publicvm.com/about',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us - Pulse News',
    description: 'Learn about Pulse News, Kenya\'s trusted source for comprehensive news coverage.',
  },
}

export default function AboutPage() {
  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="About Pulse News"
        description="Your trusted source for comprehensive news coverage from Kenya and around the world"
        breadcrumbs={breadcrumbs}
      />
      
      <div className="container mx-auto px-4 py-12">
        {/* Ad Banner */}
        <div className="mb-12">
          <AdBanner className="mx-auto" />
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <section>
                <h2 className="heading-secondary text-3xl text-text-primary mb-6">Our Mission</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-body text-lg leading-relaxed mb-6">
                    At Pulse News, we are committed to delivering accurate, timely, and comprehensive news coverage 
                    that keeps our readers informed about the events shaping Kenya and the world. Our mission is to 
                    provide reliable journalism that empowers citizens with the information they need to make informed decisions.
                  </p>
                  <p className="text-body text-lg leading-relaxed">
                    We believe in the power of journalism to drive positive change, promote transparency, and foster 
                    democratic discourse. Our team of dedicated journalists and editors work around the clock to bring 
                    you the stories that matter most.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="heading-secondary text-3xl text-text-primary mb-6">Our Values</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="heading-secondary text-xl text-pulse-red mb-3">Accuracy</h3>
                    <p className="text-body">
                      We are committed to factual reporting and rigorous fact-checking to ensure our readers receive accurate information.
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="heading-secondary text-xl text-pulse-red mb-3">Independence</h3>
                    <p className="text-body">
                      Our editorial independence allows us to report without bias and hold those in power accountable.
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="heading-secondary text-xl text-pulse-red mb-3">Transparency</h3>
                    <p className="text-body">
                      We believe in transparent journalism and clearly distinguish between news reporting and opinion content.
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="heading-secondary text-xl text-pulse-red mb-3">Community</h3>
                    <p className="text-body">
                      We serve our community by focusing on stories that matter to Kenyan citizens and the broader African diaspora.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="heading-secondary text-3xl text-text-primary mb-6">Our Coverage</h2>
                <div className="bg-white p-8 rounded-lg shadow-md">
                  <p className="text-body text-lg leading-relaxed mb-6">
                    Pulse News covers a wide range of topics to keep our readers fully informed:
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-body">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-pulse-red rounded-full mr-3"></span>
                      Politics and Government
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-pulse-red rounded-full mr-3"></span>
                      Business and Economy
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-pulse-red rounded-full mr-3"></span>
                      Technology and Innovation
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-pulse-red rounded-full mr-3"></span>
                      Sports and Recreation
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-pulse-red rounded-full mr-3"></span>
                      Entertainment and Culture
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-pulse-red rounded-full mr-3"></span>
                      International Affairs
                    </li>
                  </ul>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="heading-secondary text-xl text-text-primary mb-4">Contact Information</h3>
                  <div className="space-y-3 text-body">
                    <p>
                      <strong>Email:</strong><br />
                      info@pulsenews.publicvm.com
                    </p>
                    <p>
                      <strong>Editorial:</strong><br />
                      editorial@pulsenews.publicvm.com
                    </p>
                    <p>
                      <strong>Advertising:</strong><br />
                      ads@pulsenews.publicvm.com
                    </p>
                  </div>
                </div>

                <AdBanner width="100%" height="400px" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}