import { useState, useMemo } from 'react';

/**
 * Hook para filtrar arrays de objetos localmente.
 * @param {Array} data - Array de datos fuente (ej: SPELLS).
 * @param {Array} keys - Claves por las que buscar (ej: ['name', 'desc']).
 */
export function useDataSearch(data = [], keys = ['name']) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query) return data;
    
    const lowerQuery = query.toLowerCase();
    
    return data.filter(item => {
      // Búsqueda "Fuzzy" simple: revisa si alguna de las claves contiene el texto
      return keys.some(key => {
        const val = item[key];
        return val && val.toString().toLowerCase().includes(lowerQuery);
      });
    });
  }, [data, query, keys]);

  return { query, setQuery, results };
}