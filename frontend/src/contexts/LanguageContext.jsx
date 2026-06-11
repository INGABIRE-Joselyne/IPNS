import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, languages } from '../utils/translations';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [currentLang, setCurrentLang] = useState(
    localStorage.getItem('ipns_language') || 'en'
  );

  const t = (key) => {
    return translations[currentLang]?.[key] || translations['en']?.[key] || key;
  };

  const changeLanguage = (code) => {
    setCurrentLang(code);
    localStorage.setItem('ipns_language', code);
    // Set text direction for Arabic
    const lang = languages.find(l => l.code === code);
    document.documentElement.dir = lang?.dir || 'ltr';
    document.documentElement.lang = code;
  };

  useEffect(() => {
    const lang = languages.find(l => l.code === currentLang);
    document.documentElement.dir = lang?.dir || 'ltr';
    document.documentElement.lang = currentLang;
  }, []);

  return (
    <LanguageContext.Provider value={{ currentLang, changeLanguage, t, languages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
