import { Users, Dices, Book } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function BottomNav({ activeTab, onChange }) {
  const { t } = useLanguage();

  const tabs = [
    { id: 'heroes', icon: Users, label: t('navHeroes') },
    { id: 'dice', icon: Dices, label: t('navDice') },
    { id: 'compendium', icon: Book, label: t('navCompendium') },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-stone-950 border-t border-stone-800 px-6 py-3 flex justify-between items-center z-50 shadow-2xl">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive ? 'text-yellow-500 scale-110' : 'text-stone-500 hover:text-stone-300'}`}
          >
            <tab.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}