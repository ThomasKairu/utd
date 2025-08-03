import React from 'react';
import Link from 'next/link';
import Card from '../common/Card';
import AdPlaceholder from '../common/AdPlaceholder';

const Sidebar: React.FC = () => {
  const trendingTopics = [
    'Kenya Elections 2024',
    'Economic Recovery',
    'Climate Change',
    'Technology Innovation',
    'Sports Updates',
  ];

  const categories = [
    { name: 'Politics', count: 45, href: '/politics' },
    { name: 'Business', count: 32, href: '/business' },
    { name: 'Technology', count: 28, href: '/technology' },
    { name: 'Sports', count: 24, href: '/sports' },
    { name: 'Entertainment', count: 18, href: '/entertainment' },
  ];

  return (
    <aside className="space-y-6">
      {/* Trending Topics */}
      <Card>
        <h3 className="font-semibold text-lg mb-4 text-primary">
          Trending Now
        </h3>
        <ul className="space-y-2">
          {trendingTopics.map((topic, index) => (
            <li key={index}>
              <a
                href="#"
                className="text-text-primary hover:text-primary transition-colors text-sm"
              >
                #{topic.replace(/\s+/g, '')}
              </a>
            </li>
          ))}
        </ul>
      </Card>

      {/* Categories */}
      <Card>
        <h3 className="font-semibold text-lg mb-4 text-primary">Categories</h3>
        <ul className="space-y-3">
          {categories.map(category => (
            <li
              key={category.name}
              className="flex justify-between items-center"
            >
              <Link
                href={category.href}
                className="text-text-primary hover:text-primary transition-colors"
              >
                {category.name}
              </Link>
              <span className="text-text-secondary text-sm bg-light-gray px-2 py-1 rounded">
                {category.count}
              </span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Newsletter Signup */}
      <div className="bg-primary text-white p-4 rounded-lg shadow-md">
        <h3 className="font-semibold text-lg mb-2">Stay Updated</h3>
        <p className="text-sm mb-4 opacity-90">
          Get the latest news delivered to your inbox daily.
        </p>
        <form className="space-y-3">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-3 py-2 rounded text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            type="submit"
            className="w-full bg-accent hover:opacity-90 text-white py-2 rounded text-sm font-medium transition-opacity"
          >
            Subscribe
          </button>
        </form>
      </div>

      {/* Advertisement Placeholder */}
      <AdPlaceholder width={300} height={250} />
    </aside>
  );
};

export default Sidebar;
