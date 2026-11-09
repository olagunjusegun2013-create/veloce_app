import React from 'react';
import { LayoutDashboard, ArrowLeftRight, Coins, CreditCard, TrendingUp } from 'lucide-react';
import { NavTab } from './Sidebar';

interface MobileNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentTab, onSelectTab }) => {
  const tabs = [
    { id: 'dashboard' as NavTab, label: 'Treasury', icon: LayoutDashboard },
    { id: 'transfers' as NavTab, label: 'Transfers', icon: ArrowLeftRight },
    { id: 'vaults' as NavTab, label: 'Vaults', icon: Coins },
    { id: 'cards' as NavTab, label: 'Cards', icon: CreditCard },
    { id: 'analytics' as NavTab, label: 'Yield', icon: TrendingUp },
  ];

  return (
    <nav className="md:hidden fixed bottom-4 left-4 right-4 z-40">
      <div className="glass-dock rounded-2xl shadow-[0_12px_32px_rgba(16,26,53,0.12)] p-2 flex items-center justify-around border border-white/60">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all relative ${
                isActive ? 'text-[#101a35]' : 'text-[#76767e]'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1 w-6 h-1 rounded-full bg-[#477bff]" />
              )}
              <Icon className={`w-5 h-5 ${isActive ? 'text-[#477bff]' : 'text-[#76767e]'}`} />
              <span className={`text-[10px] font-bold ${isActive ? 'font-bold text-[#101a35]' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
