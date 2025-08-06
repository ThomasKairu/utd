'use client'

import { useState } from 'react'
import Link from 'next/link'
import SearchModal from './SearchModal'

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const navigationItems = [
    { name: 'Latest', href: '/' },
    { name: 'Politics', href: '/?category=politics' },
    { name: 'Entertainment', href: '/?category=entertainment' },
    { name: 'Sports', href: '/?category=sports' },
    { name: 'Business', href: '/?category=business' },
    { name: 'Technology', href: '/?category=technology' },
  ]

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
              <div className="w-10 h-10 bg-pulse-red rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl font-roboto">P</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-pulse-red font-roboto hidden sm:block">Pulse</span>
                <span className="text-xs text-gray-600 hidden sm:block -mt-1">News</span>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-pulse-red font-medium transition-colors duration-200 link-hover"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            
            {/* Search and Mobile Menu */}
            <div className="flex items-center space-x-3">
              <button 
                className="p-2 text-gray-600 hover:text-pulse-red transition-colors duration-200"
                onClick={() => setIsSearchOpen(true)}
              >
                <SearchIcon />
              </button>
              <button 
                className="lg:hidden p-2 text-gray-600 hover:text-pulse-red transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out">
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-8">
                <div className="w-8 h-8 bg-pulse-red rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg font-roboto">P</span>
                </div>
                <span className="text-xl font-bold text-pulse-red font-roboto">Pulse</span>
              </div>
              <nav className="space-y-4">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block text-gray-700 hover:text-pulse-red font-medium py-2 transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}