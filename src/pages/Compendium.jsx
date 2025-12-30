import React, { useState, useEffect } from "react";
import { searchSpells, searchEquipment } from "../utils/dndApi";
import { rollDamage } from "../utils/dice";
import { useToast } from "../context/ToastContext";
import { CLASSES } from "../data/srd"; // Importamos las clases para el filtro

// Listas estáticas para filtros
const SCHOOLS = [
  "Abjuración",
  "Adivinación",
  "Conjuración",
  "Encantamiento",
  "Evocación",
  "Ilusión",
  "Nigromancia",
  "Transmutación",
];
const ITEM_CATEGORIES = [
  "Simple",
  "Marcial",
  "Ligera",
  "Media",
  "Pesada",
  "Escudo",
  "Poción",
  "Anillo",
  "Objeto Maravilloso",
];

export function Compendium() {
  const [activeTab, setActiveTab] = useState("spells"); // 'spells' | 'items'
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({
    level: "",
    class: "",
    school: "",
    category: "",
  }); // Estado para filtros
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const { showToast } = useToast();

  // Limpiar filtros al cambiar de pestaña
  useEffect(() => {
    setFilters({ level: "", class: "", school: "", category: "" });
    setQuery("");
    setResults([]);
  }, [activeTab]);

  // Efecto de búsqueda (Reacciona a query O filtros)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setExpandedId(null);
      let data = [];

      // Si no hay búsqueda ni filtros, no mostrar nada (o mostrar todo si prefieres)
      if (
        query.length === 0 &&
        !filters.level &&
        !filters.class &&
        !filters.school &&
        !filters.category
      ) {
        setResults([]);
        setLoading(false);
        return;
      }

      if (activeTab === "spells") {
        // Pasamos query Y filtros a la API
        data = await searchSpells(query, {
          level: filters.level,
          class: filters.class,
          school: filters.school,
        });
      } else {
        // Filtros para objetos
        data = await searchEquipment(query, {
          category: filters.category,
        });
      }

      setResults(data);
      setLoading(false);
    };

    const timeoutId = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, activeTab, filters]); // Se ejecuta si cambia query, tab o FILTROS

  const toggleExpand = (name) => {
    setExpandedId(expandedId === name ? null : name);
  };

  const handleRoll = (item, e) => {
    e.stopPropagation();
    if (!item.damage) return;
    const result = rollDamage(item.damage);
    showToast(
      `🎲 ${item.name}: ${result.finalTotal} (${result.rolls.join("+")}${
        result.damageMod ? "+" + result.damageMod : ""
      })`,
      "success"
    );
  };

  return (
    <div className="p-4 max-w-4xl mx-auto pb-24">
      {/* --- HEADER --- */}
      <header className="mb-4">
        <h1 className="text-3xl font-bold text-stone-800 mb-4">Compendio</h1>

        {/* TABS */}
        <div className="flex bg-stone-200 p-1 rounded-lg mb-4">
          <button
            onClick={() => setActiveTab("spells")}
            className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
              activeTab === "spells"
                ? "bg-white text-red-700 shadow-sm"
                : "text-stone-500"
            }`}
          >
            📖 Hechizos
          </button>
          <button
            onClick={() => setActiveTab("items")}
            className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
              activeTab === "items"
                ? "bg-white text-blue-700 shadow-sm"
                : "text-stone-500"
            }`}
          >
            🛡️ Equipo
          </button>
        </div>

        {/* BUSCADOR PRINCIPAL */}
        <div className="relative mb-3">
          <input
            type="text"
            placeholder={`Buscar por nombre...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-3 pl-10 rounded-xl border border-stone-300 bg-white shadow-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
          <span className="absolute left-3 top-3.5 text-stone-400">🔍</span>
        </div>

        {/* --- BARRA DE FILTROS (Dinámica) --- */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {/* Filtros para Hechizos */}
          {activeTab === "spells" && (
            <>
              <select
                value={filters.level}
                onChange={(e) =>
                  setFilters({ ...filters, level: e.target.value })
                }
                className="px-3 py-2 rounded-lg bg-stone-100 border border-stone-300 text-sm font-medium text-stone-700 focus:ring-2 focus:ring-red-500 outline-none"
              >
                <option value="">Nivel (Todos)</option>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((l) => (
                  <option key={l} value={l}>
                    {l === 0 ? "Truco" : `Nivel ${l}`}
                  </option>
                ))}
              </select>

              <select
                value={filters.class}
                onChange={(e) =>
                  setFilters({ ...filters, class: e.target.value })
                }
                className="px-3 py-2 rounded-lg bg-stone-100 border border-stone-300 text-sm font-medium text-stone-700 focus:ring-2 focus:ring-red-500 outline-none"
              >
                <option value="">Clase (Todas)</option>
                {CLASSES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                value={filters.school}
                onChange={(e) =>
                  setFilters({ ...filters, school: e.target.value })
                }
                className="px-3 py-2 rounded-lg bg-stone-100 border border-stone-300 text-sm font-medium text-stone-700 focus:ring-2 focus:ring-red-500 outline-none"
              >
                <option value="">Escuela (Todas)</option>
                {SCHOOLS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </>
          )}

          {/* Filtros para Objetos */}
          {activeTab === "items" && (
            <select
              value={filters.category}
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg bg-stone-100 border border-stone-300 text-sm font-medium text-stone-700 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Categoría (Todas)</option>
              {ITEM_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}
        </div>
      </header>

      {/* --- RESULTADOS --- */}
      <div className="space-y-3">
        {loading && (
          <p className="text-center text-stone-500 animate-pulse">
            Filtrando...
          </p>
        )}

        {!loading && results.length === 0 && (
          <div className="text-center text-stone-400 mt-10">
            <p className="text-4xl mb-2">📜</p>
            <p>
              {query || filters.level || filters.class
                ? "No se encontraron resultados."
                : "Usa los filtros o busca por nombre."}
            </p>
          </div>
        )}

        {results.map((item, index) => (
          <Card
            key={index}
            item={item}
            type={activeTab}
            expanded={expandedId === item.name}
            onToggle={() => toggleExpand(item.name)}
            onRoll={(e) => handleRoll(item, e)}
          />
        ))}
      </div>
    </div>
  );
}

// --- SUB-COMPONENTE: TARJETA ---
function Card({ item, type, expanded, onToggle, onRoll }) {
  const isSpell = type === "spells";
  const borderClass = isSpell
    ? "border-l-4 border-red-500"
    : "border-l-4 border-blue-500";
  const bgClass = expanded
    ? "bg-white ring-2 ring-red-100 shadow-md"
    : "bg-white hover:bg-stone-50 shadow-sm";

  return (
    <div
      onClick={onToggle}
      className={`relative p-4 rounded-lg border border-stone-200 cursor-pointer transition-all ${borderClass} ${bgClass}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-stone-800">{item.name}</h3>
          <div className="text-xs text-stone-500 uppercase tracking-wide flex gap-2">
            {isSpell ? (
              <>
                <span className="font-bold text-red-600">
                  {item.level === 0 ? "Truco" : "Nvl " + item.level}
                </span>
                <span>•</span>
                <span>{item.school}</span>
              </>
            ) : (
              <>
                <span className="font-bold text-blue-600">
                  {getCategoryLabel(item)}
                </span>
                {item.damage && <span>• {item.damage}</span>}
                {item.ac && <span>• CA {item.ac}</span>}
              </>
            )}
          </div>
        </div>
        <div className="text-stone-400 font-mono text-xl">
          {expanded ? "−" : "+"}
        </div>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-stone-100 text-sm text-stone-700 animate-fadeIn">
          {/* Grid de detalles */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3 bg-stone-50 p-3 rounded border border-stone-100">
            {isSpell ? (
              <>
                <p>
                  <span className="font-semibold">Tiempo:</span> {item.time}
                </p>
                <p>
                  <span className="font-semibold">Alcance:</span> {item.range}
                </p>
                <p>
                  <span className="font-semibold">Duración:</span>{" "}
                  {item.duration}
                </p>
                <p>
                  <span className="font-semibold">Comp:</span> {item.components}
                </p>
                <p className="col-span-2 text-xs text-stone-500 mt-1">
                  <span className="font-semibold">Clases:</span>{" "}
                  {item.classes ? item.classes.join(", ") : "Varias"}
                </p>
              </>
            ) : (
              <>
                <p>
                  <span className="font-semibold">Coste:</span> {item.cost}
                </p>
                <p>
                  <span className="font-semibold">Peso:</span> {item.weight}
                </p>
                {item.strength !== "-" && item.strength && (
                  <p>
                    <span className="font-semibold">Fuerza:</span>{" "}
                    {item.strength}
                  </p>
                )}
                {item.stealth !== "-" && item.stealth && (
                  <p>
                    <span className="font-semibold">Sigilo:</span>{" "}
                    {item.stealth}
                  </p>
                )}
                {item.properties && (
                  <p className="col-span-2 border-t border-stone-200 mt-1 pt-1">
                    <span className="font-semibold">Propiedades:</span>{" "}
                    {item.properties}
                  </p>
                )}
              </>
            )}
          </div>

          <div className="prose prose-sm max-w-none text-stone-600">
            <p className="whitespace-pre-line leading-relaxed">{item.desc}</p>
          </div>

          {item.damage && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={onRoll}
                className="flex items-center gap-2 bg-white hover:bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm font-bold border border-red-200 shadow-sm active:scale-95 transition-all"
              >
                🎲 Tirar {item.damage}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function getCategoryLabel(item) {
  if (item.type === "weapon") return "Arma";
  if (item.type === "armor") return "Armadura";
  if (item.type === "gear") return "Equipo";
  if (item.type === "magic-item") return item.rarity;
  return item.category || "Objeto";
}
