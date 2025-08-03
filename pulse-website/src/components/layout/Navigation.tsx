'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationProps extends React.HTMLAttributes<HTMLElement> {
  mobile?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({
  mobile = false,
  ...props
}) => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Latest' },
    { href: '/category/politics', label: 'Politics' },
    { href: '/category/business', label: 'Business' },
    { href: '/category/technology', label: 'Technology' },
    { href: '/category/sports', label: 'Sports' },
    { href: '/category/entertainment', label: 'Entertainment' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  if (mobile) {
    return (
      <nav className="flex flex-col space-y-2" role="navigation" {...props}>
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`px-4 py-2 rounded-lg transition-colors font-medium ${
              isActive(item.href)
                ? 'bg-primary text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-primary'
            }`}
          >
            {item.label}
          </Link>
        ))}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
          <Link
            href="/search"
            className="px-4 py-2 rounded-lg transition-colors font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-primary block"
          >
            Search
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="flex items-center space-x-8" role="navigation" {...props}>
      {navItems.map(item => (
        <Link
          key={item.href}
          href={item.href}
          className={`transition-colors font-medium relative ${
            isActive(item.href)
              ? 'text-primary'
              : 'text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary'
          }`}
        >
          {item.label}
          {isActive(item.href) && (
            <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"></span>
          )}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
