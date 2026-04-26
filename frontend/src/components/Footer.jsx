import React from 'react';
import { Heart, Share2, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-emerald-600 font-bold mb-4">About IPNS</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Inter-Pharmacy Network System helps you find medicines and pharmacies in real-time.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-emerald-600 font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-gray-600 hover:text-emerald-600 transition-colors">Home</a></li>
              <li><a href="/pharmacies" className="text-gray-600 hover:text-emerald-600 transition-colors">Find Pharmacy</a></li>
              <li><a href="/medicines" className="text-gray-600 hover:text-emerald-600 transition-colors">Search Medicine</a></li>
              <li><a href="/about" className="text-gray-600 hover:text-emerald-600 transition-colors">About</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-emerald-600 font-bold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-600 hover:text-emerald-600 transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-emerald-600 transition-colors">FAQ</a></li>
              <li><a href="#" className="text-gray-600 hover:text-emerald-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-emerald-600 transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-emerald-600 font-bold mb-4">Connect</h3>
            <div className="flex gap-4">
              <a href="#" className="text-gray-600 hover:text-emerald-600 transition-colors">
                <Share2 size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-emerald-600 transition-colors">
                <Mail size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-emerald-600 transition-colors">
                <Heart size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">
            © 2024 IPNS. Built with <span className="text-emerald-600">❤️</span> in Rwanda.
          </p>
          <p className="text-gray-600 text-sm mt-4 md:mt-0">
            Version 1.0 - Empowering Pharmacy Access
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
