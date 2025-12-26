import { ArrowLeft } from 'lucide-react';

export function CharacterCreator({ onBack }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <header className="flex items-center gap-4 mb-8">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-stone-800 rounded-full transition text-stone-400 hover:text-stone-100"
        >
          <ArrowLeft />
        </button>
        <h1 className="text-2xl font-bold text-stone-100">Create New Hero</h1>
      </header>
      
      <div className="p-6 bg-stone-800 rounded-xl border border-stone-700 border-dashed text-center">
        <p className="text-stone-500">Aquí irá el formulario paso a paso...</p>
      </div>
    </div>
  );
}