import { useState } from "react";
import {
  Search,
  Book,
  Sword,
  Shield,
  Zap,
  Skull,
  ScrollText,
  X,
  ChevronRight,
  Filter,
} from "lucide-react";

// Importamos TODA la data local disponible
import { SPELLS } from "../data/spells";
import { WEAPONS, ARMOR, ADVENTURING_GEAR, MAGIC_ITEMS } from "../data/items";
import { CONDITIONS, SKILLS } from "../data/rules";
import { CLASSES, RACES } from "../data/character";
import { useDataSearch } from "../hooks/useDataSearch";

export function Compendium() {
  const [activeTab, setActiveTab] = useState("spells");
  const [selectedItem, setSelectedItem] = useState(null);

  // Unificamos inventario para la búsqueda de objetos
  const ALL_ITEMS = [
    ...WEAPONS,
    ...ARMOR,
    ...ADVENTURING_GEAR,
    ...(MAGIC_ITEMS || []),
  ];

  // Configuración de las pestañas y sus fuentes de datos
  const TABS = {
    spells: {
      label: "Conjuros",
      icon: Zap,
      data: SPELLS,
      keys: ["name", "school", "level"],
      renderItem: (spell) => (
        <div className="flex justify-between items-center w-full">
          <div>
            <p className="font-bold text-stone-200">{spell.name}</p>
            <p className="text-[10px] text-stone-500">
              {spell.level === 0 ? "Truco" : `Nivel ${spell.level}`} •{" "}
              {spell.school}
            </p>
          </div>
          {spell.damage && (
            <span className="text-xs bg-stone-900 px-2 py-1 rounded text-stone-400 font-mono">
              {spell.damage}
            </span>
          )}
        </div>
      ),
    },
    items: {
      label: "Equipo",
      icon: Sword,
      data: ALL_ITEMS,
      keys: ["name", "category", "type"],
      renderItem: (item) => (
        <div className="flex justify-between items-center w-full">
          <div>
            <p className="font-bold text-stone-200">{item.name}</p>
            <p className="text-[10px] text-stone-500">
              {item.category || item.type} • {item.cost || "-"}
            </p>
          </div>
          {item.ac && (
            <span className="text-xs text-blue-400 font-bold">
              CA {item.ac}
            </span>
          )}
          {item.damage && (
            <span className="text-xs text-red-400 font-bold">
              {item.damage}
            </span>
          )}
        </div>
      ),
    },
    rules: {
      label: "Reglas",
      icon: Book,
      data: [...CONDITIONS, ...SKILLS],
      keys: ["name", "desc"],
      renderItem: (rule) => (
        <div>
          <p className="font-bold text-stone-200">{rule.name}</p>
          <p className="text-[10px] text-stone-500 truncate max-w-[200px]">
            {rule.desc || "Regla básica"}
          </p>
        </div>
      ),
    },
    classes: {
      label: "Clases/Razas",
      icon: Shield,
      data: [...CLASSES, ...RACES],
      keys: ["name"],
      renderItem: (entry) => (
        <div className="flex justify-between items-center w-full">
          <p className="font-bold text-stone-200">{entry.name}</p>
          <span className="text-[10px] bg-stone-800 px-2 rounded text-stone-500">
            {entry.hitDie ? "Clase" : "Raza"}
          </span>
        </div>
      ),
    },
  };

  const currentTab = TABS[activeTab];

  // Usamos el Hook para filtrar la data de la pestaña actual
  const { query, setQuery, results } = useDataSearch(
    currentTab.data,
    currentTab.keys
  );

  return (
    <div className="flex flex-col h-screen bg-neutral-900 pb-24">
      {/* HEADER DE BÚSQUEDA */}
      <div className="p-6 pb-4 bg-neutral-900 sticky top-0 z-10 border-b border-stone-800">
        <h1 className="text-2xl font-bold text-stone-100 mb-4 flex items-center gap-2">
          <Book className="text-yellow-500" /> Compendio
        </h1>

        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500"
            size={18}
          />
          <input
            type="text"
            placeholder={`Buscar en ${currentTab.label}...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-stone-800 border border-stone-700 rounded-xl py-3 pl-10 pr-4 text-stone-100 outline-none focus:border-yellow-500 transition shadow-lg"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* TABS DE NAVEGACIÓN */}
      <div className="flex px-4 gap-2 overflow-x-auto no-scrollbar py-2 bg-neutral-900">
        {Object.entries(TABS).map(([key, config]) => {
          const Icon = config.icon;
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => {
                setActiveTab(key);
                setQuery("");
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                isActive
                  ? "bg-yellow-500 text-stone-900 border-yellow-500 shadow-lg shadow-yellow-500/20"
                  : "bg-stone-800 text-stone-400 border-stone-700 hover:bg-stone-700"
              }`}
            >
              <Icon size={14} />
              {config.label}
            </button>
          );
        })}
      </div>

      {/* LISTA DE RESULTADOS */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {results.length === 0 ? (
          <div className="text-center py-10 opacity-50">
            <ScrollText size={48} className="mx-auto mb-2 text-stone-600" />
            <p className="text-stone-500">No se encontraron resultados.</p>
          </div>
        ) : (
          results.map((item, idx) => (
            <button
              key={item.id || idx} // Fallback a idx si no hay id
              onClick={() => setSelectedItem(item)}
              className="w-full bg-stone-800/50 hover:bg-stone-800 p-4 rounded-xl border border-stone-800 hover:border-stone-600 transition text-left flex items-center justify-between group"
            >
              {currentTab.renderItem(item)}
              <ChevronRight
                size={16}
                className="text-stone-600 group-hover:text-yellow-500 transition"
              />
            </button>
          ))
        )}
      </div>

      {/* MODAL DE DETALLE (EL "POP-UP" DEL LIBRO) */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-stone-900 border border-stone-700 w-full max-w-lg h-[85vh] sm:h-auto sm:max-h-[80vh] rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col relative animate-in slide-in-from-bottom duration-300">
            {/* Header del Modal */}
            <div className="p-6 border-b border-stone-800 bg-stone-900 sticky top-0 z-10">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-stone-100 leading-tight">
                    {selectedItem.name}
                  </h2>
                  <p className="text-sm text-stone-400 mt-1">
                    {selectedItem.level !== undefined
                      ? selectedItem.level === 0
                        ? "Truco"
                        : `Nivel ${selectedItem.level}`
                      : ""}
                    {selectedItem.school && ` • ${selectedItem.school}`}
                    {selectedItem.category && ` • ${selectedItem.category}`}
                    {selectedItem.type &&
                      !selectedItem.category &&
                      ` • ${selectedItem.type}`}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-2 bg-stone-800 rounded-full text-stone-400 hover:text-white hover:bg-stone-700 transition"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Contenido Scrollable */}
            <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
              {/* Stats Grid (Si tiene datos numéricos) */}
              {(selectedItem.time ||
                selectedItem.range ||
                selectedItem.duration ||
                selectedItem.ac ||
                selectedItem.damage) && (
                <div className="grid grid-cols-2 gap-3">
                  {selectedItem.time && (
                    <div className="bg-stone-950 p-2 rounded-lg border border-stone-800">
                      <span className="text-[10px] uppercase font-bold text-stone-500 block">
                        Tiempo
                      </span>
                      <span className="text-sm text-stone-200">
                        {selectedItem.time}
                      </span>
                    </div>
                  )}
                  {selectedItem.range && (
                    <div className="bg-stone-950 p-2 rounded-lg border border-stone-800">
                      <span className="text-[10px] uppercase font-bold text-stone-500 block">
                        Alcance
                      </span>
                      <span className="text-sm text-stone-200">
                        {selectedItem.range}
                      </span>
                    </div>
                  )}
                  {selectedItem.duration && (
                    <div className="bg-stone-950 p-2 rounded-lg border border-stone-800">
                      <span className="text-[10px] uppercase font-bold text-stone-500 block">
                        Duración
                      </span>
                      <span className="text-sm text-stone-200">
                        {selectedItem.duration}
                      </span>
                    </div>
                  )}
                  {selectedItem.damage && (
                    <div className="bg-stone-950 p-2 rounded-lg border border-red-900/30">
                      <span className="text-[10px] uppercase font-bold text-red-500 block">
                        Daño
                      </span>
                      <span className="text-sm text-stone-200 font-mono">
                        {selectedItem.damage}
                      </span>
                    </div>
                  )}
                  {selectedItem.ac && (
                    <div className="bg-stone-950 p-2 rounded-lg border border-blue-900/30">
                      <span className="text-[10px] uppercase font-bold text-blue-500 block">
                        Clase de Armadura
                      </span>
                      <span className="text-sm text-stone-200 font-mono">
                        {selectedItem.ac}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Descripción Principal */}
              <div className="prose prose-invert prose-sm max-w-none text-stone-300 leading-relaxed">
                {/* Renderizamos descripción, manejando saltos de línea si es texto plano */}
                {selectedItem.desc?.split("\n").map((par, i) => (
                  <p key={i} className="mb-2 last:mb-0">
                    {par}
                  </p>
                ))}

                {/* Propiedades de Items */}
                {selectedItem.properties && (
                  <p className="mt-4 text-stone-400">
                    <strong className="text-stone-200">Propiedades:</strong>{" "}
                    {selectedItem.properties}
                  </p>
                )}

                {/* Rasgos de Raza/Clase */}
                {selectedItem.traits && (
                  <div className="mt-4 space-y-2">
                    <strong className="text-stone-200 block mb-2">
                      Rasgos:
                    </strong>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.traits.map((t) => (
                        <span
                          key={t}
                          className="bg-stone-800 px-2 py-1 rounded text-xs border border-stone-700"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Fijo (Opcional: Botones de Acción Futura) */}
            <div className="p-4 bg-stone-900 border-t border-stone-800 text-center">
              <button
                onClick={() => setSelectedItem(null)}
                className="text-sm text-stone-500 hover:text-stone-300 font-bold uppercase tracking-wider"
              >
                Cerrar Referencia
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
