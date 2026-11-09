import React from 'react';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  Coins, 
  CreditCard, 
  TrendingUp, 
  ShieldCheck, 
  Lock, 
  ChevronRight,
  Sparkles,
  Layers
} from 'lucide-react';

export type NavTab = 'dashboard' | 'transfers' | 'vaults' | 'cards' | 'analytics' | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const navItems = [
    { id: 'dashboard' as NavTab, label: 'Treasury Overview', icon: LayoutDashboard, badge: undefined },
    { id: 'transfers' as NavTab, label: 'Transfers & Wires', icon: ArrowLeftRight, badge: 'FedNow' },
    { id: 'vaults' as NavTab, label: 'Multi-Currency Vaults', icon: Coins, badge: '5.15% APY' },
    { id: 'cards' as NavTab, label: 'Spatial Cards', icon: CreditCard, badge: '3 Active' },
    { id: 'analytics' as NavTab, label: 'Cash Flow & Yield', icon: TrendingUp, badge: undefined },
    { id: 'settings' as NavTab, label: 'Security & Limits', icon: ShieldCheck, badge: undefined },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col border-r border-[#101a35]/8 bg-white transition-all duration-300 z-30 select-none ${
        isCollapsed ? 'w-20' : 'w-[280px]'
      }`}
    >
      {/* Brand Header */}
      <div className="h-20 px-6 flex items-center justify-between border-b border-[#101a35]/8">
        <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={() => onSelectTab('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-[#101a35] flex items-center justify-center text-white shadow-sm shrink-0">
            <span className="font-heading font-extrabold text-xl tracking-tight text-white flex items-center justify-center">
              <span className="text-[#477bff]">V</span>
            </span>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-heading font-bold text-lg text-[#101a35] tracking-tight leading-none">
                VELOCE
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#45464d] mt-1">
                Private Treasury
              </span>
            </div>
          )}
        </div>

        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex w-7 h-7 rounded-lg items-center justify-center text-[#45464d] hover:bg-[#eceff8] transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-180'}`} />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <div className="flex-1 py-6 px-3 flex flex-col gap-1.5 overflow-y-auto">
        {!isCollapsed && (
          <div className="px-3 pb-2 text-[11px] font-bold tracking-wider uppercase text-[#76767e]">
            Treasury Architecture
          </div>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`relative flex items-center gap-3.5 px-3.5 py-3 rounded-lg text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-[#101a35] text-white shadow-[0_2px_8px_rgba(16,26,53,0.12)]'
                  : 'text-[#45464d] hover:text-[#101a35] hover:bg-[#eceff8]'
              }`}
            >
              <Icon
                className={`w-5 h-5 shrink-0 transition-colors ${
                  isActive ? 'text-[#477bff]' : 'text-[#76767e] group-hover:text-[#101a35]'
                }`}
              />

              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between text-left">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        isActive
                          ? 'bg-[#477bff]/20 text-[#a3c2ff]'
                          : item.badge.includes('APY')
                          ? 'bg-[#16a879]/10 text-[#16a879]'
                          : 'bg-[#6847e8]/10 text-[#6847e8]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Institutional Clearance Tier Footer */}
      {!isCollapsed ? (
        <div className="p-4 m-3 rounded-xl bg-[#f2f4f8] border border-[#101a35]/6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#16a879] animate-pulse" />
              <span className="text-[11px] font-bold text-[#101a35] uppercase tracking-wide">
                Black Tier Clearance
              </span>
            </div>
            <Sparkles className="w-3.5 h-3.5 text-[#6847e8]" />
          </div>
          <p className="text-xs text-[#45464d] leading-relaxed mb-3">
            FDIC Insured up to $25,000,000 via sweep program network.
          </p>
          <div className="flex items-center justify-between pt-2 border-t border-[#101a35]/8 text-[11px] text-[#76767e]">
            <span className="font-mono">ID: 884-VA-90</span>
            <span className="text-[#16a879] font-semibold">Verified</span>
          </div>
        </div>
      ) : (
        <div className="p-3 flex justify-center border-t border-[#101a35]/8">
          <div className="w-8 h-8 rounded-full bg-[#16a879]/15 flex items-center justify-center text-[#16a879]" title="Verified Active">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
      )}
    </aside>
  );
};
