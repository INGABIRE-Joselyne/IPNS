import React, { useState } from 'react';
import { Menu, Search, X } from 'lucide-react';
import logo from '../assets/images/LOGO.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Find Pharmacy', href: '/pharmacies' },
    { label: 'Search Medicine', href: '/medicines' },
    { label: 'About', href: '/about' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          <div className="flex items-center gap-2">
            <img src={logo} alt="IPNS Logo" className="h-24 w-24 rounded-lg object-contain" />
          </div>

          <nav className="hidden md:flex gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-emerald-600 hover:text-emerald-700 transition-colors duration-200 text-sm font-medium"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <a
              href="/medicines"
              className="inline-flex items-center gap-2 px-4 py-2 border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg font-medium transition-colors duration-200"
            >
              <Search size={18} />
              Search
            </a>

            <a
              href="/login"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors duration-200 inline-block"
            >
              Get Started
            </a>
          </div>

          <button
            type="button"
            className="md:hidden text-gray-600 hover:text-emerald-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block px-4 py-2 text-emerald-600 hover:text-emerald-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}

            <a
              href="/medicines"
              className="flex w-full items-center justify-center gap-2 px-4 py-2 border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg font-medium transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              <Search size={18} />
              Search
            </a>

            <a
              href="/login"
              className="block w-full mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors duration-200 text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Get Started
            </a>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
