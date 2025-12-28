import { createContext, useState, useContext } from 'react';
import { dictionary } from '../data/locales';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  // Leemos el idioma guardado o usamos español por defecto
  const [language, setLanguage] = useState(() => localStorage.getItem('dnd_lang') || 'es');

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'es' : 'en';
    setLanguage(newLang);
    localStorage.setItem('dnd_lang', newLang);
  };

  // La función mágica de traducción "t"
  const t = (key) => {
    return dictionary[language][key] || key; // Si no encuentra la traducción, devuelve la llave
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook personalizado para usarlo fácil
export const useLanguage = () => useContext(LanguageContext);