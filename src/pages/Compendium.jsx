import React, { useState, useEffect } from "react";
import { searchSpells, searchEquipment } from "../utils/dndApi";

export function Compendium() {
  const [activeTab, setActiveTab] = useState("spells"); // 'spells' | 'items'
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(null); // Para expandir tarjetas

  // Efecto de búsqueda instantánea (Debounce manual simple)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setExpandedId(null); // Colapsar al buscar nuevo
      let data = [];

      if (query.length === 0) {
        // Opcional: Mostrar algunos por defecto si está vacío
        // data = activeTab === "spells" ? await searchSpells("a") : await searchEquipment("a");
        setResults([]);
        setLoading(false);
        return;
      }

      if (activeTab === "spells") {
        data = await searchSpells(query);
      } else {
        data = await searchEquipment(query);
      }

      setResults(data);
      setLoading(false);
    };

    // Pequeño delay para no buscar en cada tecla si escribe muy rápido
    const timeoutId = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, activeTab]);

  const toggleExpand = (name) => {
    setExpandedId(expandedId === name ? null : name);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto pb-24">
      {" "}
      {/* pb-24 para dar espacio al BottomNav */}
      {/* --- HEADER & TABS --- */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-red-700 mb-4">Compendio</h1>

        {/* Barra de búsqueda */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder={`Buscar ${
              activeTab === "spells" ? "hechizo..." : "objeto..."
            }`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-3 pl-10 rounded-xl border border-stone-300 bg-white shadow-sm focus:ring-2 focus:ring-red-500 focus:outline-none transition-all"
          />
          <span className="absolute left-3 top-3.5 text-stone-400">🔍</span>
        </div>

        {/* Tabs Selector */}
        <div className="flex bg-stone-200 p-1 rounded-lg">
          <button
            onClick={() => {
              setActiveTab("spells");
              setQuery("");
              setResults([]);
            }}
            className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
              activeTab === "spells"
                ? "bg-white text-red-700 shadow-sm"
                : "text-stone-500 hover:text-stone-700"
            }`}
          >
            📖 Hechizos
          </button>
          <button
            onClick={() => {
              setActiveTab("items");
              setQuery("");
              setResults([]);
            }}
            className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
              activeTab === "items"
                ? "bg-white text-blue-700 shadow-sm"
                : "text-stone-500 hover:text-stone-700"
            }`}
          >
            🛡️ Equipo
          </button>
        </div>
      </header>
      {/* --- LISTA DE RESULTADOS --- */}
      <div className="space-y-3">
        {loading && (
          <p className="text-center text-stone-500 animate-pulse">
            Consultando los archivos...
          </p>
        )}

        {!loading && results.length === 0 && query.length > 0 && (
          <p className="text-center text-stone-500">
            No se encontraron resultados en los archivos locales.
          </p>
        )}

        {!loading && query.length === 0 && (
          <div className="text-center text-stone-400 mt-10">
            <p className="text-4xl mb-2">📜</p>
            <p>Escribe para buscar en la base de datos offline.</p>
          </div>
        )}

        {results.map((item, index) => (
          <Card
            key={index}
            item={item}
            type={activeTab}
            expanded={expandedId === item.name}
            onToggle={() => toggleExpand(item.name)}
          />
        ))}
      </div>
    </div>
  );
}

// --- SUB-COMPONENTE: TARJETA GENÉRICA ---
function Card({ item, type, expanded, onToggle }) {
  const isSpell = type === "spells";

  // Colores según tipo
  const borderClass = isSpell
    ? "border-l-4 border-red-500"
    : "border-l-4 border-blue-500";
  const bgClass = expanded
    ? "bg-white ring-2 ring-red-100"
    : "bg-white hover:bg-stone-50";

  return (
    <div
      onClick={onToggle}
      className={`relative p-4 rounded-lg shadow-sm border border-stone-200 cursor-pointer transition-all ${borderClass} ${bgClass}`}
    >
      {/* Cabecera Resumida */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-stone-800">{item.name}</h3>
          <p className="text-xs text-stone-500 uppercase tracking-wide">
            {isSpell
              ? `${item.level === 0 ? "Truco" : "Nivel " + item.level} • ${
                  item.school
                }`
              : `${getCategoryLabel(item)} • ${
                  item.type === "weapon"
                    ? item.damage
                    : item.ac
                    ? "CA " + item.ac
                    : item.cost
                }`}
          </p>
        </div>
        {/* Icono de expansión */}
        <div className="text-stone-400">{expanded ? "−" : "+"}</div>
      </div>

      {/* Detalles Expandidos */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-stone-100 text-sm text-stone-700 animate-fadeIn">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-2 mb-3 bg-stone-50 p-2 rounded">
            {isSpell ? (
              <>
                <p>
                  <strong>Tiempo:</strong> {item.time}
                </p>
                <p>
                  <strong>Alcance:</strong> {item.range}
                </p>
                <p>
                  <strong>Duración:</strong> {item.duration}
                </p>
                <p>
                  <strong>Compon.:</strong> {item.components}
                </p>
              </>
            ) : (
              <>
                <p>
                  <strong>Coste:</strong> {item.cost}
                </p>
                <p>
                  <strong>Peso:</strong> {item.weight}
                </p>
                {item.properties && (
                  <p className="col-span-2">
                    <strong>Propiedades:</strong> {item.properties}
                  </p>
                )}
                {item.strength !== "-" && (
                  <p>
                    <strong>Fuerza:</strong> {item.strength}
                  </p>
                )}
                {item.stealth !== "-" && (
                  <p>
                    <strong>Sigilo:</strong> {item.stealth}
                  </p>
                )}
              </>
            )}
          </div>

          {/* Descripción */}
          <div className="prose prose-sm max-w-none text-stone-600">
            <p className="whitespace-pre-line leading-relaxed">{item.desc}</p>
          </div>

          {/* Botón de Acción (Ejemplo para futuro: "Lanzar") */}
          {item.damage && (
            <div className="mt-3 text-right">
              <span className="inline-block bg-stone-100 text-stone-600 px-2 py-1 rounded text-xs font-mono border border-stone-300">
                🎲 Daño/Efecto: {item.damage}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Helper para etiquetas bonitas
function getCategoryLabel(item) {
  if (item.type === "weapon") return "Arma";
  if (item.type === "armor") return "Armadura";
  if (item.type === "gear") return "Equipo";
  if (item.type === "magic-item") return item.rarity;
  return "Objeto";
}
