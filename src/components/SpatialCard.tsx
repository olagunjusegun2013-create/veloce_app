import React, { useState } from 'react';
import { Wifi, Eye, EyeOff, Snowflake, Copy, Check, Shield, Sparkles } from 'lucide-react';
import { Card } from '../types';

interface SpatialCardProps {
  card: Card;
  onToggleFreeze?: (cardId: string) => void;
  showSpendBar?: boolean;
}

export const SpatialCard: React.FC<SpatialCardProps> = ({
  card,
  onToggleFreeze,
  showSpendBar = true,
}) => {
  const [showNumbers, setShowNumbers] = useState(false);
  const [copied, setCopied] = useState(false);

  const getThemeClass = (theme: Card['theme']) => {
    switch (theme) {
      case 'purple':
        return 'card-spatial-purple';
      case 'emerald':
        return 'card-spatial-emerald';
      case 'titanium':
      default:
        return 'card-spatial-titanium';
    }
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const fullNumber = showNumbers ? card.cardNumber.replace(/•/g, '9') : `4532 9812 4019 ${card.last4}`;
    navigator.clipboard?.writeText(fullNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const spendPercentage = Math.min(100, Math.round((card.currentSpend / card.spendLimit) * 100));

  return (
    <div className="flex flex-col gap-3 w-full max-w-[420px]">
      {/* The Physical/Virtual Spatial Card */}
      <div
        className={`relative aspect-[1.586] w-full rounded-2xl p-6 text-white flex flex-col justify-between overflow-hidden transition-all duration-300 select-none ${getThemeClass(
          card.theme
        )} ${card.isFrozen ? 'saturate-50 contrast-75' : 'hover:scale-[1.01]'}`}
      >
        {/* Frozen Frosted Overlay if frozen */}
        {card.isFrozen && (
          <div className="absolute inset-0 bg-blue-950/60 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-2 border border-blue-400/30">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-blue-200 shadow-inner">
              <Snowflake className="w-6 h-6 animate-pulse" />
            </div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-blue-200">
              Card Frozen
            </span>
            <span className="text-[10px] text-white/70">Tap below to unfreeze</span>
          </div>
        )}

        {/* Ambient Top Glow */}
        <div className="absolute -top-20 -right-20 w-52 h-52 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        {/* Card Header */}
        <div className="flex items-start justify-between relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-sm tracking-wider text-white">
                VELOCE
              </span>
              <span className="text-[9px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full bg-white/15 text-white/90 backdrop-blur-md">
                {card.type === 'titanium' ? 'Titanium Metal' : card.type === 'virtual_saas' ? 'Virtual Vault' : 'Multi-Currency'}
              </span>
            </div>
            <span className="text-[11px] text-white/60 font-medium tracking-tight block mt-0.5">
              {card.name}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Wifi className="w-5 h-5 text-white/80 rotate-90" />
            <div className="flex -space-x-2">
              <span className="w-6 h-6 rounded-full bg-red-500/80 inline-block backdrop-blur-xs" />
              <span className="w-6 h-6 rounded-full bg-amber-400/80 inline-block backdrop-blur-xs" />
            </div>
          </div>
        </div>

        {/* Smart EMV Chip */}
        <div className="relative z-10 my-auto flex items-center gap-3">
          <div className="w-11 h-8 rounded-md bg-gradient-to-tr from-amber-200 via-amber-300 to-yellow-500 p-0.5 shadow-inner border border-amber-400/40">
            <div className="w-full h-full rounded-[4px] border border-black/20 flex flex-col justify-around p-1 opacity-80">
              <div className="h-[1px] bg-black/30 w-full" />
              <div className="h-[1px] bg-black/30 w-full" />
            </div>
          </div>
          <Sparkles className="w-4 h-4 text-white/40" />
        </div>

        {/* Card Number & Details */}
        <div className="relative z-10 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="font-mono text-base sm:text-lg tracking-[0.2em] font-semibold text-white/95">
              {showNumbers
                ? `4532 9410 8821 ${card.last4}`
                : `4532 •••• •••• ${card.last4}`}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowNumbers(!showNumbers)}
                className="p-1 rounded-md bg-white/10 hover:bg-white/20 transition-colors text-white/80"
                title={showNumbers ? 'Hide details' : 'Reveal details'}
              >
                {showNumbers ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="p-1 rounded-md bg-white/10 hover:bg-white/20 transition-colors text-white/80"
                title="Copy card number"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="flex items-end justify-between pt-1">
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-wider text-white/50 font-semibold">
                Cardholder
              </span>
              <span className="text-xs font-semibold tracking-wide text-white/90">
                {card.cardholder}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col text-right">
                <span className="text-[9px] uppercase tracking-wider text-white/50 font-semibold">
                  Expires
                </span>
                <span className="font-mono text-xs font-semibold text-white/90">
                  {card.expMonth}/{card.expYear}
                </span>
              </div>

              <div className="flex flex-col text-right">
                <span className="text-[9px] uppercase tracking-wider text-white/50 font-semibold">
                  CVV
                </span>
                <span className="font-mono text-xs font-semibold text-white/90">
                  {showNumbers ? card.cvv : '•••'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spend Tracker & Action Toolbar */}
      {showSpendBar && (
        <div className="bg-white rounded-xl p-3 border border-[#101a35]/8 shadow-sm flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#45464d] font-medium">Monthly Spend Limit</span>
            <span className="font-mono font-bold text-[#101a35]">
              ${card.currentSpend.toLocaleString('en-US', { minimumFractionDigits: 2 })} / ${card.spendLimit.toLocaleString()}
            </span>
          </div>

          <div className="w-full h-1.5 bg-[#eceff8] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                spendPercentage > 85 ? 'bg-[#e53935]' : 'bg-[#477bff]'
              }`}
              style={{ width: `${spendPercentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between pt-1 text-[11px]">
            <span className="text-[#76767e]">
              {spendPercentage}% of monthly limit utilized
            </span>
            {onToggleFreeze && (
              <button
                type="button"
                onClick={() => onToggleFreeze(card.id)}
                className={`font-semibold flex items-center gap-1 transition-colors ${
                  card.isFrozen
                    ? 'text-[#477bff] hover:underline'
                    : 'text-[#e53935] hover:underline'
                }`}
              >
                <Snowflake className="w-3 h-3" />
                {card.isFrozen ? 'Unfreeze Card' : 'Freeze Card'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
