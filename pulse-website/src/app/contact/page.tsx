import { Metadata } from 'next'
import PageHeader from '../../components/PageHeader'
import AdBanner from '../../components/AdBanner'

export const metadata: Metadata = {
  title: 'Contact Us - Pulse News',
  description: 'Get in touch with Pulse News. Contact our editorial team, submit news tips, or reach out for advertising opportunities. We\'re here to serve the Kenyan community with reliable news coverage.',
  keywords: 'contact pulse news, news tips, editorial contact, advertising inquiries, kenya news contact',
  openGraph: {
    title: 'Contact Us - Pulse News',
    description: 'Get in touch with Pulse News. Contact our editorial team, submit news tips, or reach out for advertising opportunities.',
    url: 'https://www.pulsenews.publicvm.com/contact',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us - Pulse News',
    description: 'Get in touch with Pulse News. Contact our editorial team, submit news tips, or reach out for advertising opportunities.',
  },
}

export default function ContactPage() {
  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Contact Us', href: '/contact' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="Contact Us"
        description="Get in touch with our team. We're here to serve you with the latest news and information."
        breadcrumbs={breadcrumbs}
      />
      
      <div className="container mx-auto px-4 py-12">
        {/* Ad Banner */}
        <div className="mb-12">
          <AdBanner className="mx-auto" />
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="heading-secondary text-3xl text-text-primary mb-6">Send us a Message</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-text-primary mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pulse-red focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-text-primary mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pulse-red focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pulse-red focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-text-primary mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pulse-red focus:border-transparent"
                  >
                    <option value="">Select a subject</option>
                    <option value="news-tip">News Tip</option>
                    <option value="editorial">Editorial Inquiry</option>
                    <option value="advertising">Advertising</option>
                    <option value="technical">Technical Support</option>
                    <option value="general">General Inquiry</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-text-primary mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pulse-red focus:border-transparent"
                    placeholder="Please provide details about your inquiry..."
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-pulse-red text-white py-3 px-6 rounded-lg font-medium hover:bg-pulse-red-dark transition-colors duration-200 btn-modern"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="heading-secondary text-3xl text-text-primary mb-6">Get in Touch</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-pulse-red rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="heading-secondary text-lg text-text-primary mb-2">Email</h3>
                      <p className="text-body text-text-secondary">info@pulsenews.publicvm.com</p>
                      <p className="text-body text-text-secondary">editorial@pulsenews.publicvm.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-pulse-red rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="heading-secondary text-lg text-text-primary mb-2">Address</h3>
                      <p className="text-body text-text-secondary">
                        Pulse News Headquarters<br />
                        Nairobi, Kenya
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-pulse-red rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="heading-secondary text-lg text-text-primary mb-2">Business Hours</h3>
                      <p className="text-body text-text-secondary">
                        Monday - Friday: 8:00 AM - 6:00 PM<br />
                        Saturday: 9:00 AM - 4:00 PM<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="heading-secondary text-xl text-text-primary mb-4">News Tips</h3>
                <p className="text-body text-text-secondary mb-4">
                  Have a story tip or breaking news? We want to hear from you. Send us your tips and we'll investigate.
                </p>
                <a
                  href="mailto:tips@pulsenews.publicvm.com"
                  className="inline-flex items-center text-pulse-red hover:text-pulse-red-dark font-medium transition-colors duration-200"
                >
                  tips@pulsenews.publicvm.com
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>

              <AdBanner width="100%" height="300px" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}