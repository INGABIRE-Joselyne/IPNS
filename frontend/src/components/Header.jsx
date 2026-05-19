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
    // Changed bg-white to a dark blue/black background, removed light border, and adjusted shadow
    <header className="bg-[#0B1528] sticky top-0 z-50 shadow-md">
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
                // Changed text color from emerald-600 to text-gray-200, hovering to white
                className="text-gray-200 hover:text-emerald-400 transition-colors duration-200 text-sm font-medium"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <a
              href="/medicines"
              // Darkened the search button container to match the dark theme outline style
              className="inline-flex items-center gap-2 px-4 py-2 border border-emerald-500/30 bg-emerald-950/20 hover:bg-gray-200 text-emerald-400 rounded-lg font-medium transition-colors duration-200"
            >
              
              Search Here ....
              <Search size={18} />
            </a>

            <a
              href="/login"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors duration-200 inline-block"
            >
              Login 
            </a>
          </div>

          {/* Mobile menu button color adjusted to stand out on dark background */}
          <button
            type="button"
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X size={30} /> : <Menu size={30} />}
          </button>
        </div>

        {/* Mobile dropdown menu styles updated for dark mode consistency */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block px-4 py-2 text-gray-200 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="/medicines"
              className="flex w-full items-center justify-center gap-2 px-4 py-2 border border-emerald-500/30 bg-emerald-950/20 hover:bg-emerald-950/40 text-emerald-400 rounded-lg font-medium transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              
              Search Here ....
              <Search size={18} />
            </a>

            <a
              href="/login"
              className="block w-full mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors duration-200 text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </a>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;