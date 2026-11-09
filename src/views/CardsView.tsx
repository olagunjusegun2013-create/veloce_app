import React, { useState } from 'react';
import { 
  CreditCard, 
  Plus, 
  ShieldCheck, 
  Lock, 
  Snowflake, 
  Sliders, 
  Globe, 
  Wifi, 
  Check, 
  AlertCircle,
  Copy
} from 'lucide-react';
import { Card, Transaction } from '../types';
import { SpatialCard } from '../components/SpatialCard';
import { TransactionLedger } from '../components/TransactionLedger';

interface CardsViewProps {
  cards: Card[];
  transactions: Transaction[];
  onToggleFreeze: (cardId: string) => void;
  onOpenNewCardModal: () => void;
  onUpdateSpendLimit: (cardId: string, newLimit: number) => void;
}

export const CardsView: React.FC<CardsViewProps> = ({
  cards,
  transactions,
  onToggleFreeze,
  onOpenNewCardModal,
  onUpdateSpendLimit,
}) => {
  const [selectedCardId, setSelectedCardId] = useState<string>(cards[0]?.id || '');

  const activeCard = cards.find((c) => c.id === selectedCardId) || cards[0];

  const cardTransactions = transactions.filter((tx) => tx.type === 'card_spend');

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#101a35] tracking-tight">
            Spatial Card Treasury
          </h1>
          <p className="text-xs text-[#76767e] mt-1">
            Titanium physical hardware & ephemeral encrypted virtual cards with discrete spend limits
          </p>
        </div>

        <button
          onClick={onOpenNewCardModal}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#477bff] hover:bg-[#386df2] text-white text-xs font-bold shadow-[0_2px_8px_rgba(71,123,255,0.25)] transition-all active:scale-[0.98] self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Issue New Spatial Card</span>
        </button>
      </div>

      {/* Main Grid: Card Selector + Spatial Card Display & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Cards List & Active Card Display (6 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          {/* Card Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {cards.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCardId(c.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  selectedCardId === c.id
                    ? 'border-[#101a35] bg-[#101a35] text-white shadow-xs'
                    : 'border-[#101a35]/8 bg-white text-[#45464d] hover:bg-[#eceff8]'
                }`}
              >
                {c.name} (•••{c.last4})
              </button>
            ))}
          </div>

          {/* Active Spatial Card */}
          {activeCard && (
            <div className="flex justify-center">
              <SpatialCard
                card={activeCard}
                onToggleFreeze={onToggleFreeze}
                showSpendBar={true}
              />
            </div>
          )}
        </div>

        {/* Right Column: Card Configuration & Security Controls (6 cols) */}
        {activeCard && (
          <div className="lg:col-span-6 bg-white rounded-2xl border border-[#101a35]/8 p-6 shadow-xs flex flex-col gap-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#101a35]/8">
              <div>
                <h2 className="font-heading font-bold text-base text-[#101a35]">
                  Card Security & Parameters
                </h2>
                <span className="text-xs text-[#76767e]">
                  Managing: {activeCard.name} • Ending in {activeCard.last4}
                </span>
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                activeCard.isFrozen ? 'bg-[#e53935]/10 text-[#e53935]' : 'bg-[#16a879]/10 text-[#16a879]'
              }`}>
                {activeCard.isFrozen ? 'Frozen' : 'Active & Protected'}
              </span>
            </div>

            {/* Monthly Limit Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-[#101a35] uppercase tracking-wider">
                  Adjust Monthly Spend Limit
                </label>
                <span className="font-mono text-sm font-bold text-[#101a35] tabular-nums">
                  ${activeCard.spendLimit.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="5000"
                max="100000"
                step="5000"
                value={activeCard.spendLimit}
                onChange={(e) => onUpdateSpendLimit(activeCard.id, Number(e.target.value))}
                className="w-full accent-[#477bff] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#76767e] mt-1">
                <span>$5,000 Min</span>
                <span>$100,000 Max Institutional</span>
              </div>
            </div>

            {/* Toggle Switches */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#f7f9fd] border border-[#101a35]/6">
                <div>
                  <span className="text-xs font-bold text-[#101a35] block">Online Card Purchases</span>
                  <span className="text-[11px] text-[#76767e]">E-commerce and SaaS subscriptions</span>
                </div>
                <input
                  type="checkbox"
                  checked={activeCard.allowOnline}
                  readOnly
                  className="w-4 h-4 text-[#477bff] accent-[#477bff] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#f7f9fd] border border-[#101a35]/6">
                <div>
                  <span className="text-xs font-bold text-[#101a35] block">International Roaming</span>
                  <span className="text-[11px] text-[#76767e]">Zero foreign exchange transaction fees</span>
                </div>
                <input
                  type="checkbox"
                  checked={activeCard.allowInternational}
                  readOnly
                  className="w-4 h-4 text-[#477bff] accent-[#477bff] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#f7f9fd] border border-[#101a35]/6">
                <div>
                  <span className="text-xs font-bold text-[#101a35] block">ATM Cash Withdrawals</span>
                  <span className="text-[11px] text-[#76767e]">Worldwide Cirrus and Plus network ATMs</span>
                </div>
                <input
                  type="checkbox"
                  checked={activeCard.allowAtm}
                  readOnly
                  className="w-4 h-4 text-[#477bff] accent-[#477bff] cursor-pointer"
                />
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="pt-4 border-t border-[#101a35]/8 flex items-center justify-between">
              <button
                type="button"
                onClick={() => onToggleFreeze(activeCard.id)}
                className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeCard.isFrozen
                    ? 'bg-[#101a35] text-white hover:bg-[#1b2b54]'
                    : 'bg-[#e53935]/10 text-[#e53935] hover:bg-[#e53935]/20'
                }`}
              >
                <Snowflake className="w-4 h-4" />
                <span>{activeCard.isFrozen ? 'Unfreeze Card' : 'Freeze Card Immediately'}</span>
              </button>

              <div className="text-right">
                <span className="text-[10px] text-[#76767e] block">Card PIN</span>
                <span className="font-mono text-xs font-bold text-[#101a35] tracking-widest">
                  •••• ({activeCard.pin})
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Card-Specific Transaction Ledger */}
      <TransactionLedger
        transactions={cardTransactions}
        title="Card Spend & Ephemeral Key Activity"
        subtitle="Recent purchases authenticated via physical chip and virtual tokens"
      />
    </div>
  );
};
