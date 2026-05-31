import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import logo from '../assets/images/LOGO.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const currentPath = window.location.pathname;

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Find Pharmacy', href: '/pharmacies' },
    { label: 'Search Medicine', href: '/medicines' },
    { label: 'About', href: '/about' },
  ];

  return (
    <header className="bg-[#0B1528] sticky top-0 z-[200] shadow-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex items-center">
            <img src={logo} alt="IPNS Logo" className="h-14 w-14 rounded-lg object-contain" />
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-6">
            {navLinks.map((link) => {
              const isActive = currentPath === link.href;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className={`relative text-sm font-medium transition-colors duration-200 pb-1
                    ${isActive
                      ? 'text-emerald-400'
                      : 'text-gray-300 hover:text-emerald-400'
                    }`}
                >
                  {link.label}
                  {/* Active underline indicator */}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-400 rounded-full" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="/register"
              className="px-5 py-2 border border-emerald-500/50 hover:border-emerald-400 text-emerald-400 hover:text-emerald-300 rounded-lg font-medium transition-colors duration-200 text-sm"
            >
              Register Pharmacy
            </a>
            <a
              href="/login"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors duration-200 text-sm"
            >
              Pharmacy Login
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="md:hidden text-gray-300 hover:text-white transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X size={38} /> : <Menu size={38} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 pt-2 space-y-1 border-t border-white/10">
            {navLinks.map((link) => {
              const isActive = currentPath === link.href;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200
                    ${isActive
                      ? 'text-emerald-400 bg-emerald-500/10'
                      : 'text-gray-200 hover:text-white hover:bg-slate-800/50'
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              );
            })}
            <div className="flex gap-3 pt-2 px-4">
              <a
                href="/register"
                className="flex-1 px-4 py-2 border border-emerald-500/50 text-emerald-400 rounded-lg font-medium transition-colors duration-200 text-center text-sm hover:border-emerald-400"
                onClick={() => setIsMenuOpen(false)}
              >
                Register Pharmacy
              </a>
              <a
                href="/login"
                className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors duration-200 text-center text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Pharmacy Login
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
