# Pulse UTD News

An automated news platform that aggregates, processes, and publishes Kenyan news content using AI-powered content rewriting and automated workflows.

## 🌟 Features

- **Automated Content Aggregation**: RSS feed monitoring from major Kenyan news sources
- **AI-Powered Content Processing**: Intelligent article rewriting using OpenRouter AI models
- **Real-time Updates**: Cloudflare Workers with cron triggers for continuous content updates
- **SEO Optimized**: Built-in SEO best practices with structured data and meta tags
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Performance Focused**: Static site generation with Next.js 15
- **Database Integration**: Supabase for scalable data storage
- **Content Categorization**: Automatic categorization of news articles

## 🏗️ Architecture

### Frontend

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Static Site Generation** for optimal performance

### Backend

- **Supabase** for database and authentication
- **Cloudflare Workers** for automated content processing
- **OpenRouter** for AI-powered content rewriting
- **ScraperAPI** for reliable content extraction

### Deployment

- **GitHub Pages** for static site hosting
- **Cloudflare** for CDN and Workers
- **FreeDNS** for subdomain management

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- Git
- Supabase account
- Cloudflare account
- OpenRouter API key
- ScraperAPI key

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/ThomasKairu/utd.git
   cd utd/pulse-website
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.local.example .env.local
   ```

   Fill in your API keys and configuration:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   OPENROUTER_API_KEY=your_openrouter_key
   SCRAPER_API_KEY=your_scraper_api_key
   ```

4. **Set up the database**
   - Create a new Supabase project
   - Run the SQL schema from `database/schema.sql`

5. **Start development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
pulse-website/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── article/[slug]/  # Dynamic article pages
│   │   ├── category/[slug]/ # Category pages
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Homepage
│   ├── components/          # React components
│   │   ├── common/          # Reusable components
│   │   ├── layout/          # Layout components
│   │   └── ui/              # UI components
│   ├── lib/                 # Utility libraries
│   │   └── api/             # API functions
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Utility functions
├── worker/                  # Cloudflare Worker
│   ├── src/
│   │   └── index.ts         # Worker main file
│   ├── package.json
│   ├── tsconfig.json
│   └── wrangler.toml        # Worker configuration
├── database/
│   └── schema.sql           # Database schema
├── scripts/
│   └── deploy.sh            # Deployment script
├── public/                  # Static assets
├── DEPLOYMENT.md            # Deployment guide
└── README.md               # This file
```

## 🔧 Configuration

### Environment Variables

| Variable                        | Description                           | Required              |
| ------------------------------- | ------------------------------------- | --------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL                  | Yes                   |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key                | Yes                   |
| `SUPABASE_SERVICE_ROLE_KEY`     | Supabase service role key             | Yes                   |
| `OPENROUTER_API_KEY`            | OpenRouter API key for AI processing  | Yes                   |
| `SCRAPER_API_KEY`               | ScraperAPI key for content extraction | Yes                   |
| `CLOUDFLARE_API_TOKEN`          | Cloudflare API token                  | For worker deployment |
| `CLOUDFLARE_ACCOUNT_ID`         | Cloudflare account ID                 | For worker deployment |

### RSS Feed Sources

The platform monitors these Kenyan news sources:

- Nation Media Group
- Standard Media
- The Star
- Capital FM
- Kenya Broadcasting Corporation

## 🤖 Automated Workflow

### Content Processing Pipeline

1. **RSS Monitoring**: Worker checks RSS feeds every 5 minutes
2. **Content Extraction**: ScraperAPI extracts full article content
3. **AI Processing**: OpenRouter AI rewrites content for uniqueness
4. **Categorization**: Automatic categorization into predefined categories
5. **Database Storage**: Processed articles saved to Supabase
6. **SEO Optimization**: Meta tags and structured data generation

### AI Models Used

- **Primary**: GPT-4o-mini, Claude-3-Haiku, Gemini-1.5-Flash
- **Fallback**: Llama-3.1-70B, Mixtral-8x7B
- **Cost Optimization**: Automatic model selection based on task complexity

## 📊 Performance

### Core Web Vitals

- **LCP**: < 2.5s (Largest Contentful Paint)
- **FID**: < 100ms (First Input Delay)
- **CLS**: < 0.1 (Cumulative Layout Shift)

### Optimization Features

- Static site generation
- Image optimization with Next.js Image
- Lazy loading for images and components
- CDN caching with Cloudflare
- Efficient database queries with proper indexing

## 🔒 Security

### Data Protection

- Row Level Security (RLS) enabled on all database tables
- API key encryption and secure storage
- HTTPS enforcement across all endpoints
- Content Security Policy (CSP) headers

### Content Moderation

- AI-powered content filtering
- Source attribution and copyright compliance
- Manual review processes for sensitive content

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run type checking
npm run type-check

# Run linting
npm run lint

# Run formatting check
npm run format:check
```

### Test Coverage

- Unit tests for utility functions
- Integration tests for API endpoints
- Component testing with React Testing Library
- End-to-end testing with Playwright (planned)

## 📈 Monitoring

### Analytics

- Google Analytics integration
- Core Web Vitals monitoring
- User engagement tracking

### Error Tracking

- Cloudflare Workers analytics
- Supabase database monitoring
- Custom error logging

### Performance Monitoring

- Lighthouse CI integration
- Real User Monitoring (RUM)
- Database query performance tracking

## 🚀 Deployment

### Automated Deployment

```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

### Manual Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

### Deployment Checklist

- [ ] Environment variables configured
- [ ] Database schema deployed
- [ ] Cloudflare Worker deployed
- [ ] DNS records configured
- [ ] SSL certificates active
- [ ] Monitoring systems enabled

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Code Standards

- TypeScript strict mode
- ESLint and Prettier configuration
- Conventional commit messages
- Component documentation with JSDoc

### Pull Request Process

1. Update documentation if needed
2. Add tests for new features
3. Ensure CI/CD pipeline passes
4. Request review from maintainers

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help

- Check the [Issues](https://github.com/ThomasKairu/utd/issues) page
- Review the [DEPLOYMENT.md](./DEPLOYMENT.md) guide
- Contact the development team

### Reporting Issues

When reporting issues, please include:

- Environment details (Node.js version, OS)
- Steps to reproduce
- Expected vs actual behavior
- Error messages and logs

## 🗺️ Roadmap

### Phase 1: Core Platform ✅

- [x] Basic website structure
- [x] Database integration
- [x] Automated content processing
- [x] AI-powered content rewriting

### Phase 2: Enhanced Features 🚧

- [ ] User authentication and profiles
- [ ] Comment system
- [ ] Newsletter subscription
- [ ] Advanced search functionality
- [ ] Mobile app (React Native)

### Phase 3: Advanced Analytics 📋

- [ ] Real-time analytics dashboard
- [ ] Content performance metrics
- [ ] User engagement analytics
- [ ] A/B testing framework

### Phase 4: Monetization 💰

- [ ] Advertisement integration
- [ ] Premium subscription model
- [ ] Sponsored content system
- [ ] Revenue analytics

## 🏆 Acknowledgments

- **Next.js Team** for the amazing framework
- **Supabase** for the backend infrastructure
- **Cloudflare** for Workers and CDN services
- **OpenRouter** for AI model access
- **Tailwind CSS** for the utility-first CSS framework

## 📞 Contact

- **Project Maintainer**: Thomas Kairu
- **Email**: [your-email@example.com]
- **GitHub**: [@ThomasKairu](https://github.com/ThomasKairu)
- **Website**: [pulse.utdnews.com](https://pulse.utdnews.com)

---

**Built with ❤️ for the Kenyan news community**
