import React from 'react';
import { Heart, Share2, Mail } from 'lucide-react';

const Footer = () => {
  return (
    // Changed bg-gray-100 to matches header's deep background, removed light border
    <footer className="bg-[#0B1528]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            {/* Kept text-emerald-600 as it stands out well on this dark background */}
            <h3 className="text-emerald-600 font-bold mb-4">About IPNS</h3>
            {/* Changed text-gray-600 to text-gray-300 for readability */}
            <p className="text-gray-300 text-sm leading-relaxed">
              Inter-Pharmacy Network System helps you find medicines and pharmacies in real-time.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-emerald-600 font-bold mb-4">Quick Links</h3>
            {/* Changed text-gray-600 to text-gray-300, changed hover color to white */}
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-gray-300 hover:text-white transition-colors">Home</a></li>
              <li><a href="/pharmacies" className="text-gray-300 hover:text-white transition-colors">Find Pharmacy</a></li>
              <li><a href="/medicines" className="text-gray-300 hover:text-white transition-colors">Search Medicine</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-white transition-colors">About</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-emerald-600 font-bold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="/faq" className="text-gray-300 hover:text-white transition-colors">FAQ</a></li>
              <li><a href="/privacy-policy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-emerald-600 font-bold mb-4">Connect</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:info@ipns.rw" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                  <Mail size={16} />
                  info@ipns.rw
                </a>
              </li>
              <li>
                <a href="/contact" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                  <Share2 size={16} />
                  Send us a message
                </a>
              </li>
              <li>
                <a href="/about" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                  <Heart size={16} />
                  Our Mission
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        {/* Changed border-gray-200 to a subtle dark border line matching the header style */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 IPNS. Built with <span className="text-emerald-600">❤️</span> in Rwanda.
          </p>
          <p className="text-gray-400 text-sm mt-4 md:mt-0">
            Version 1.0 - Empowering Pharmacy Access
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;