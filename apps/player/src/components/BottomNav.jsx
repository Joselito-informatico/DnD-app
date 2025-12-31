import { useLocation, useNavigate } from "react-router-dom";
import { LayoutGrid, Book, Dices } from "lucide-react";

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    {
      id: "dashboard",
      path: "/",
      icon: LayoutGrid,
      label: "Héroes",
    },
    {
      id: "compendium",
      path: "/compendium",
      icon: Book,
      label: "Manual",
    },
    {
      id: "dice",
      path: "/dice",
      icon: Dices,
      label: "Dados",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-stone-900 border-t border-stone-800 pb-safe pt-2 px-6 z-50">
      <div className="flex justify-around items-center">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 ${
                isActive
                  ? "text-yellow-500 -translate-y-2"
                  : "text-stone-500 hover:text-stone-300"
              }`}
            >
              <div
                className={`p-2 rounded-full transition-all ${
                  isActive
                    ? "bg-yellow-500/10 shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                    : ""
                }`}
              >
                <tab.icon
                  size={24}
                  strokeWidth={isActive ? 2.5 : 2}
                  className="transition-transform duration-300"
                />
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  isActive ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
