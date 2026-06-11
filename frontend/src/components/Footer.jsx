import React from 'react';
import { Heart, Share2, Mail } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#0B1528]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          {/* About */}
          <div>
            <h3 className="text-emerald-600 font-bold mb-4">About IPNS</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {t('footer_about')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-emerald-600 font-bold mb-4">{t('footer_quick_links')}</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-gray-300 hover:text-white transition-colors">{t('nav_home')}</a></li>
              <li><a href="/pharmacies" className="text-gray-300 hover:text-white transition-colors">{t('nav_find_pharmacy')}</a></li>
              <li><a href="/medicines" className="text-gray-300 hover:text-white transition-colors">{t('nav_search_medicine')}</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-white transition-colors">{t('nav_about')}</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-emerald-600 font-bold mb-4">{t('footer_support')}</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/contact" className="text-gray-300 hover:text-white transition-colors">{t('footer_contact_us')}</a></li>
              <li><a href="/faq" className="text-gray-300 hover:text-white transition-colors">{t('footer_faq')}</a></li>
              <li><a href="/privacy-policy" className="text-gray-300 hover:text-white transition-colors">{t('footer_privacy')}</a></li>
              <li><a href="/terms" className="text-gray-300 hover:text-white transition-colors">{t('footer_terms')}</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-emerald-600 font-bold mb-4">{t('footer_connect')}</h3>
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
                  {t('footer_send_message')}
                </a>
              </li>
              <li>
                <a href="/about" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                  <Heart size={16} />
                  {t('footer_our_mission')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">{t('footer_copyright')}</p>
          <p className="text-gray-400 text-sm mt-4 md:mt-0">{t('footer_version')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
