import { useState } from "react";
import { ArrowLeft, BookOpen, Skull, Shield, Sword } from "lucide-react";
import { CONDITIONS, COMBAT_ACTIONS, CLASSES } from "../data/srd";

export function Compendium({ onBack }) {
  const [section, setSection] = useState("actions");

  return (
    <div className="flex flex-col h-screen bg-neutral-900 pb-20">
      <header className="flex items-center gap-4 p-6 bg-stone-900 border-b border-stone-800">
        <button
          onClick={onBack}
          className="p-2 text-stone-400 hover:text-white"
        >
          <ArrowLeft />
        </button>
        <h1 className="text-xl font-bold text-stone-100 flex items-center gap-2">
          <BookOpen className="text-yellow-500" /> Compendio SRD
        </h1>
      </header>

      <div className="flex p-4 gap-2 overflow-x-auto border-b border-stone-800">
        <button
          onClick={() => setSection("actions")}
          className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition ${
            section === "actions"
              ? "bg-yellow-500 text-black"
              : "bg-stone-800 text-stone-400"
          }`}
        >
          Acciones
        </button>
        <button
          onClick={() => setSection("conditions")}
          className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition ${
            section === "conditions"
              ? "bg-yellow-500 text-black"
              : "bg-stone-800 text-stone-400"
          }`}
        >
          Estados
        </button>
        <button
          onClick={() => setSection("classes")}
          className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition ${
            section === "classes"
              ? "bg-yellow-500 text-black"
              : "bg-stone-800 text-stone-400"
          }`}
        >
          Clases
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {section === "actions" &&
          COMBAT_ACTIONS.map((act, i) => (
            <div
              key={i}
              className="bg-stone-800 p-4 rounded-xl border border-stone-700"
            >
              <h3 className="font-bold text-yellow-500 flex items-center gap-2">
                <Sword size={16} /> {act.name}
              </h3>
              <p className="text-sm text-stone-300 mt-1">{act.desc}</p>
            </div>
          ))}

        {section === "conditions" &&
          CONDITIONS.map((cond, i) => (
            <div
              key={i}
              className="bg-stone-800 p-4 rounded-xl border border-stone-700"
            >
              <h3 className="font-bold text-red-400 flex items-center gap-2">
                <Skull size={16} /> {cond.name}
              </h3>
              <p className="text-sm text-stone-300 mt-1">{cond.desc}</p>
            </div>
          ))}

        {section === "classes" &&
          CLASSES.map((cls, i) => (
            <div
              key={i}
              className="bg-stone-800 p-4 rounded-xl border border-stone-700"
            >
              <h3 className="font-bold text-blue-400 flex items-center gap-2">
                <Shield size={16} /> {cls.name}
              </h3>
              <p className="text-xs text-stone-500 mb-2">
                DG: {cls.hitDie} | Principal: {cls.primaryStat.toUpperCase()}
              </p>
              <div className="flex flex-wrap gap-1">
                {cls.proficiencies.map((p, j) => (
                  <span
                    key={j}
                    className="text-[10px] bg-stone-900 px-2 py-1 rounded text-stone-400"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
