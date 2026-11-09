import React from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  TrendingUp, 
  ArrowLeftRight, 
  Plus, 
  CreditCard, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight,
  Globe,
  Coins
} from 'lucide-react';
import { CurrencyAccount, Transaction, Card, Beneficiary } from '../types';
import { SpatialCard } from '../components/SpatialCard';
import { PortfolioChart } from '../components/PortfolioChart';
import { TransactionLedger } from '../components/TransactionLedger';
import { NavTab } from '../components/Sidebar';

interface DashboardViewProps {
  accounts: CurrencyAccount[];
  transactions: Transaction[];
  cards: Card[];
  beneficiaries: Beneficiary[];
  onOpenSendModal: () => void;
  onOpenExchangeModal: () => void;
  onOpenNewCardModal: () => void;
  onToggleFreezeCard: (cardId: string) => void;
  onNavigateTab: (tab: NavTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  accounts,
  transactions,
  cards,
  beneficiaries,
  onOpenSendModal,
  onOpenExchangeModal,
  onOpenNewCardModal,
  onToggleFreezeCard,
  onNavigateTab,
}) => {
  // Total treasury balance in USD
  const totalBalanceUSD = accounts.reduce((acc, curr) => acc + curr.usdEquivalent, 0);

  const primaryCard = cards[0] || null;

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Top Banner: Master Portfolio Liquidity Card */}
      <div className="bg-white rounded-2xl border border-[#101a35]/8 p-6 sm:p-8 shadow-[0px_2px_8px_rgba(16,26,53,0.04)] relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#477bff]/8 to-transparent rounded-full pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-[#76767e]">
                Master Treasury Liquidity
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#6847e8]/10 text-[#6847e8] inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Institutional Tier
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-3">
              <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#101a35] tracking-tight tabular-nums">
                ${totalBalanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h1>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#16a879]/10 text-[#16a879] text-xs font-bold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+4.82% ($6,840.12 this month)</span>
              </div>
            </div>

            <p className="text-xs text-[#76767e] mt-2 font-medium">
              4 multi-currency vaults active • FedNow & SEPA Instant real-time clearance
            </p>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenSendModal}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#477bff] hover:bg-[#386df2] text-white text-xs font-bold shadow-[0_2px_8px_rgba(71,123,255,0.25)] transition-all active:scale-[0.98]"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Send Money</span>
            </button>

            <button
              onClick={onOpenExchangeModal}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#101a35] hover:bg-[#1b2b54] text-white text-xs font-bold shadow-sm transition-all active:scale-[0.98]"
            >
              <ArrowLeftRight className="w-4 h-4 text-[#477bff]" />
              <span>Exchange FX</span>
            </button>

            <button
              onClick={() => onNavigateTab('vaults')}
              className="flex items-center gap-2 px-4 py-3 rounded-xl border border-[#101a35]/12 hover:bg-[#eceff8] text-[#101a35] text-xs font-semibold transition-all"
            >
              <Coins className="w-4 h-4 text-[#6847e8]" />
              <span>Vaults</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Spatial Card Highlight & Performance Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Spatial Card Column (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-base text-[#101a35]">Active Spatial Card</h2>
            <button
              onClick={() => onNavigateTab('cards')}
              className="text-xs font-semibold text-[#477bff] hover:underline flex items-center gap-1"
            >
              <span>Manage Cards ({cards.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {primaryCard && (
            <SpatialCard
              card={primaryCard}
              onToggleFreeze={onToggleFreezeCard}
              showSpendBar={true}
            />
          )}

          {/* Quick Beneficiaries Strip */}
          <div className="bg-white rounded-2xl border border-[#101a35]/8 p-4 shadow-[0px_2px_8px_rgba(16,26,53,0.04)]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#76767e]">
                Frequent Counterparties
              </span>
              <button
                onClick={onOpenSendModal}
                className="text-xs font-semibold text-[#477bff] hover:underline"
              >
                + New Wire
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {beneficiaries.map((b) => (
                <button
                  key={b.id}
                  onClick={onOpenSendModal}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-[#f2f4f8] transition-colors text-center group"
                >
                  <img
                    src={b.avatar}
                    alt={b.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#101a35]/10 group-hover:scale-105 transition-transform"
                  />
                  <span className="text-[11px] font-semibold text-[#101a35] truncate w-full">
                    {b.name.split(' ')[0]}
                  </span>
                  <span className="text-[9px] font-mono text-[#76767e]">
                    {b.currency}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Portfolio Chart Column (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <PortfolioChart />

          {/* Sub-account multi-currency vault tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {accounts.map((acc) => (
              <div
                key={acc.id}
                onClick={onOpenExchangeModal}
                className="bg-white rounded-xl border border-[#101a35]/8 p-3.5 shadow-xs hover:border-[#477bff]/40 hover:shadow-sm transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">{acc.flag}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#eceff8] text-[#101a35]">
                    {acc.currency}
                  </span>
                </div>
                <div className="mt-2">
                  <span className="font-mono text-base font-bold text-[#101a35] tabular-nums block">
                    {acc.symbol}{acc.balance.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </span>
                  <span className="text-[11px] text-[#76767e] block">
                    ≈ ${acc.usdEquivalent.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="mt-2 pt-2 border-t border-[#101a35]/6 flex items-center justify-between text-[10px]">
                  <span className="text-[#16a879] font-semibold">{acc.apy ? `${acc.apy}% APY` : 'Active'}</span>
                  <span className="text-[#477bff] font-bold group-hover:underline">Swap</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* High-Density Transaction Ledger */}
      <div>
        <TransactionLedger
          transactions={transactions}
          limit={6}
          title="Recent High-Velocity Operations"
          subtitle="Showing latest verified transactions across all accounts"
        />
        <div className="mt-3 text-center">
          <button
            onClick={() => onNavigateTab('transfers')}
            className="text-xs font-bold text-[#477bff] hover:underline inline-flex items-center gap-1"
          >
            <span>View Full Financial Transaction Ledger</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
