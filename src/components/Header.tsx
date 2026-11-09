import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Globe, 
  ChevronDown, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle,
  X,
  ExternalLink
} from 'lucide-react';
import { NotificationItem, CurrencyCode } from '../types';

interface HeaderProps {
  notifications: NotificationItem[];
  onMarkNotificationAsRead: (id: string) => void;
  selectedDisplayCurrency: CurrencyCode;
  onChangeDisplayCurrency: (curr: CurrencyCode) => void;
  onOpenSendModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  notifications,
  onMarkNotificationAsRead,
  selectedDisplayCurrency,
  onChangeDisplayCurrency,
  onOpenSendModal,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="h-20 bg-white border-b border-[#101a35]/8 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20">
      {/* Left Search & Operational Health */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#76767e]" />
          <input
            type="text"
            placeholder="Search transactions, accounts, routing or beneficiaries... (/)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 text-xs bg-[#f2f4f8] rounded-lg border border-[#101a35]/6 text-[#101a35] placeholder:text-[#76767e] focus:outline-none focus:border-[#477bff] focus:bg-white focus:ring-2 focus:ring-[#477bff]/15 transition-all"
          />
        </div>

        {/* Operational Status indicator */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#16a879]/8 border border-[#16a879]/15">
          <span className="w-2 h-2 rounded-full bg-[#16a879] animate-pulse" />
          <span className="text-[11px] font-semibold text-[#16a879] tracking-wide">
            FedNow & SEPA Instant Active
          </span>
        </div>
      </div>

      {/* Right Actions & Profile */}
      <div className="flex items-center gap-3">
        {/* Quick Send CTA */}
        <button
          onClick={onOpenSendModal}
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#477bff] hover:bg-[#386df2] text-white text-xs font-semibold shadow-sm transition-all active:scale-[0.98]"
        >
          <span>Send Funds</span>
        </button>

        {/* Currency Switcher */}
        <div className="relative">
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#101a35]/8 bg-[#f2f4f8] text-xs font-semibold text-[#101a35]">
            <Globe className="w-3.5 h-3.5 text-[#76767e]" />
            <select
              value={selectedDisplayCurrency}
              onChange={(e) => onChangeDisplayCurrency(e.target.value as CurrencyCode)}
              className="bg-transparent text-xs font-bold text-[#101a35] focus:outline-none cursor-pointer pr-1"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="CHF">CHF (₣)</option>
            </select>
          </div>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 rounded-lg border border-[#101a35]/8 flex items-center justify-center text-[#45464d] hover:bg-[#eceff8] relative transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#e53935] ring-2 ring-white" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-[0_16px_36px_-6px_rgba(16,26,53,0.18)] border border-[#101a35]/8 p-4 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-[#101a35]/8">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-sm text-[#101a35]">Audit & Alerts</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e53935]/10 text-[#e53935]">
                      {unreadCount} New
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-[#76767e] hover:text-[#101a35] p-1 rounded-md"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="divide-y divide-[#101a35]/6 max-h-80 overflow-y-auto">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onMarkNotificationAsRead(item.id)}
                    className={`py-3 px-2 flex gap-3 cursor-pointer rounded-lg transition-colors ${
                      item.read ? 'opacity-70 hover:bg-[#f2f4f8]' : 'bg-[#f7f9fd] hover:bg-[#eceff8]'
                    }`}
                  >
                    <div className="mt-0.5">
                      {item.type === 'security' ? (
                        <AlertTriangle className="w-4 h-4 text-[#f5a623]" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-[#16a879]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-bold text-[#101a35] truncate">{item.title}</span>
                        <span className="text-[10px] text-[#76767e] whitespace-nowrap">{item.time}</span>
                      </div>
                      <p className="text-[11px] text-[#45464d] leading-normal">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <div className="flex items-center gap-3 pl-2 sm:border-l sm:border-[#101a35]/8">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="Marcus Vance"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-[#6847e8]/30 shadow-sm"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#16a879] ring-2 ring-white" />
          </div>

          <div className="hidden lg:flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[#101a35]">Marcus V. Aura</span>
              <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-[#6847e8]/10 text-[#6847e8]">
                Vault Black
              </span>
            </div>
            <span className="text-[11px] text-[#76767e] font-mono">Treasury Officer</span>
          </div>
        </div>
      </div>
    </header>
  );
};
