import React, { useState, useEffect } from "react";
import {
  searchSpells,
  searchEquipment,
  searchRules,
  searchCharacterOptions,
} from "../utils/dndApi";
import { rollDamage } from "../utils/dice";
import { useToast } from "../context/ToastContext";
import { CLASSES } from "../data/character";

// Listas estáticas para filtros de hechizos
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
  const [activeTab, setActiveTab] = useState("spells"); // 'spells', 'items', 'rules', 'options'
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({
    level: "",
    class: "",
    school: "",
    category: "",
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const { showToast } = useToast();

  // Limpiar al cambiar pestaña
  useEffect(() => {
    setFilters({ level: "", class: "", school: "", category: "" });
    setQuery("");
    setResults([]);
  }, [activeTab]);

  // Búsqueda
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setExpandedId(null);
      let data = [];

      // Si no hay query ni filtros, vaciamos (o podríamos mostrar todo)
      if (
        query.length === 0 &&
        !filters.level &&
        !filters.class &&
        !filters.school &&
        !filters.category
      ) {
        // Excepción: Para reglas y opciones, quizás queramos ver la lista completa por defecto si no es muy larga
        if (activeTab === "rules" || activeTab === "options") {
          // Dejar pasar para cargar todo
        } else {
          setResults([]);
          setLoading(false);
          return;
        }
      }

      if (activeTab === "spells") {
        data = await searchSpells(query, {
          level: filters.level,
          class: filters.class,
          school: filters.school,
        });
      } else if (activeTab === "items") {
        data = await searchEquipment(query, {
          category: filters.category,
        });
      } else if (activeTab === "rules") {
        data = await searchRules(query);
      } else if (activeTab === "options") {
        data = await searchCharacterOptions(query);
      }

      setResults(data);
      setLoading(false);
    };

    const timeoutId = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, activeTab, filters]);

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

  const tabs = [
    { id: "spells", label: "📖 Hechizos", color: "text-red-700" },
    { id: "items", label: "🛡️ Equipo", color: "text-blue-700" },
    { id: "rules", label: "⚖️ Reglas", color: "text-yellow-700" },
    { id: "options", label: "👤 Opciones", color: "text-purple-700" },
  ];

  return (
    <div className="p-4 max-w-4xl mx-auto pb-24">
      {/* --- HEADER --- */}
      <header className="mb-4">
        <h1 className="text-3xl font-bold text-stone-800 mb-4">Compendio</h1>

        {/* TABS SCROLLABLE */}
        <div className="flex bg-stone-200 p-1 rounded-lg mb-4 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[80px] py-2 text-xs sm:text-sm font-bold rounded-md transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? `bg-white ${tab.color} shadow-sm`
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* BUSCADOR */}
        <div className="relative mb-3">
          <input
            type="text"
            placeholder={`Buscar en ${
              tabs.find((t) => t.id === activeTab)?.label.split(" ")[1]
            }...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-3 pl-10 rounded-xl border border-stone-300 bg-white shadow-sm focus:ring-2 focus:ring-stone-500 focus:outline-none"
          />
          <span className="absolute left-3 top-3.5 text-stone-400">🔍</span>
        </div>

        {/* FILTROS (Solo visible en Hechizos y Objetos) */}
        {activeTab === "spells" && (
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            <select
              value={filters.level}
              onChange={(e) =>
                setFilters({ ...filters, level: e.target.value })
              }
              className="px-3 py-2 rounded-lg bg-stone-100 border border-stone-300 text-sm font-medium text-stone-700 outline-none"
            >
              <option value="">Nivel</option>
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
              className="px-3 py-2 rounded-lg bg-stone-100 border border-stone-300 text-sm font-medium text-stone-700 outline-none"
            >
              <option value="">Clase</option>
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
              className="px-3 py-2 rounded-lg bg-stone-100 border border-stone-300 text-sm font-medium text-stone-700 outline-none"
            >
              <option value="">Escuela</option>
              {SCHOOLS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}

        {activeTab === "items" && (
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
            className="w-full px-3 py-2 rounded-lg bg-stone-100 border border-stone-300 text-sm font-medium text-stone-700 outline-none"
          >
            <option value="">Todas las Categorías</option>
            {ITEM_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}
      </header>

      {/* --- RESULTADOS --- */}
      <div className="space-y-3">
        {loading && (
          <p className="text-center text-stone-500 animate-pulse">
            Consultando archivos...
          </p>
        )}

        {!loading && results.length === 0 && (
          <div className="text-center text-stone-400 mt-10">
            <p className="text-4xl mb-2">📜</p>
            <p>No se encontraron resultados.</p>
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
  // Determinamos el color del borde según el tipo
  let borderClass = "border-l-4 border-stone-400";
  if (type === "spells") borderClass = "border-l-4 border-red-500";
  if (type === "items") borderClass = "border-l-4 border-blue-500";
  if (type === "rules") borderClass = "border-l-4 border-yellow-500";
  if (type === "options") borderClass = "border-l-4 border-purple-500";

  const bgClass = expanded
    ? "bg-white ring-2 ring-stone-200 shadow-md"
    : "bg-white hover:bg-stone-50 shadow-sm";

  return (
    <div
      onClick={onToggle}
      className={`relative p-4 rounded-lg border border-stone-200 cursor-pointer transition-all ${borderClass} ${bgClass}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-stone-800">{item.name}</h3>

          {/* Subtítulo Dinámico */}
          <div className="text-xs text-stone-500 uppercase tracking-wide flex gap-2">
            {type === "spells" && (
              <>
                <span className="font-bold text-red-600">
                  {item.level === 0 ? "Truco" : "Nvl " + item.level}
                </span>
                <span>•</span>
                <span>{item.school}</span>
              </>
            )}
            {type === "items" && (
              <>
                <span className="font-bold text-blue-600">
                  {item.category || item.type}
                </span>
                {item.damage && <span>• {item.damage}</span>}
                {item.ac && <span>• CA {item.ac}</span>}
              </>
            )}
            {(type === "rules" || type === "options") && (
              <span className="font-bold text-stone-600">{item.category}</span>
            )}
          </div>
        </div>
        <div className="text-stone-400 font-mono text-xl">
          {expanded ? "−" : "+"}
        </div>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-stone-100 text-sm text-stone-700 animate-fadeIn">
          {/* Grid de detalles para Hechizos/Objetos */}
          {(type === "spells" || type === "items") && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3 bg-stone-50 p-3 rounded border border-stone-100">
              {type === "spells" ? (
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
                    <span className="font-semibold">Comp:</span>{" "}
                    {item.components}
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <span className="font-semibold">Coste:</span>{" "}
                    {item.cost || "-"}
                  </p>
                  <p>
                    <span className="font-semibold">Peso:</span>{" "}
                    {item.weight || "-"}
                  </p>
                  {item.properties && (
                    <p className="col-span-2 border-t border-stone-200 mt-1 pt-1">
                      <span className="font-semibold">Propiedades:</span>{" "}
                      {item.properties}
                    </p>
                  )}
                </>
              )}
            </div>
          )}

          {/* Detalles extra para Razas/Clases */}
          {item.details && (
            <div className="mb-3 p-2 bg-purple-50 text-purple-900 rounded text-xs font-mono">
              {item.details}
            </div>
          )}

          <div className="prose prose-sm max-w-none text-stone-600">
            <p className="whitespace-pre-line leading-relaxed">{item.desc}</p>
          </div>

          {item.damage && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={onRoll}
                className="flex items-center gap-2 bg-white hover:bg-stone-100 text-stone-800 px-4 py-2 rounded-lg text-sm font-bold border border-stone-300 shadow-sm active:scale-95 transition-all"
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
