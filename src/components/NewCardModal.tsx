import React, { useState } from 'react';
import { X, CreditCard, Sparkles, Shield, Check } from 'lucide-react';
import { Card, CurrencyCode } from '../types';

interface NewCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCardCreated: (newCard: Card) => void;
}

export const NewCardModal: React.FC<NewCardModalProps> = ({
  isOpen,
  onClose,
  onCardCreated,
}) => {
  const [name, setName] = useState('Production SaaS Reserve');
  const [theme, setTheme] = useState<'titanium' | 'purple' | 'emerald'>('purple');
  const [spendLimit, setSpendLimit] = useState<number>(20000);
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [allowOnline, setAllowOnline] = useState(true);
  const [allowInternational, setAllowInternational] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const last4 = Math.floor(1000 + Math.random() * 9000).toString();
    const newCard: Card = {
      id: `card-${Date.now()}`,
      name: name.trim() || 'New Virtual Key',
      type: 'custom',
      theme: theme,
      cardNumber: `4829 •••• •••• ${last4}`,
      last4: last4,
      expMonth: '12',
      expYear: '30',
      cvv: Math.floor(100 + Math.random() * 900).toString(),
      cardholder: 'MARCUS V. AURA',
      spendLimit: spendLimit,
      currentSpend: 0,
      currency: currency,
      isFrozen: false,
      allowOnline: allowOnline,
      allowInternational: allowInternational,
      allowAtm: false,
      pin: '3941',
    };

    onCardCreated(newCard);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#101a35]/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-[0_24px_48px_-12px_rgba(16,26,53,0.25)] border border-[#101a35]/8 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 bg-[#f7f9fd] border-b border-[#101a35]/8 flex items-center justify-between">
          <div>
            <span className="font-heading font-extrabold text-base text-[#101a35] tracking-tight">
              Issue Spatial Card
            </span>
            <p className="text-xs text-[#76767e] mt-0.5">
              Instant virtual provisioning with encrypted tokenization
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#76767e] hover:bg-[#eceff8] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-[#101a35] mb-1.5 uppercase tracking-wider">
              Card Purpose Label
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. OpenAI & Cloud Compute Key"
              required
              className="w-full h-11 px-3 text-xs bg-white rounded-lg border border-[#101a35]/12 text-[#101a35] focus:outline-none focus:border-[#477bff] focus:ring-2 focus:ring-[#477bff]/15"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#101a35] mb-2 uppercase tracking-wider">
              Spatial Finish & Hue
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'titanium', label: 'Titanium Navy', color: 'from-[#101a35] to-[#202a4e]' },
                { id: 'purple', label: 'Royal Violet', color: 'from-[#5228ce] to-[#7d57f5]' },
                { id: 'emerald', label: 'Cyber Emerald', color: 'from-[#0d845e] to-[#1bc48d]' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t.id as any)}
                  className={`p-3 rounded-xl border text-left flex flex-col gap-2 transition-all ${
                    theme === t.id
                      ? 'border-[#477bff] ring-2 ring-[#477bff]/20 bg-[#f7f9fd]'
                      : 'border-[#101a35]/8 hover:bg-[#f2f4f8]'
                  }`}
                >
                  <div className={`w-full h-6 rounded-md bg-gradient-to-r ${t.color}`} />
                  <span className="text-[11px] font-bold text-[#101a35]">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#101a35] mb-1.5 uppercase tracking-wider">
              Monthly Limit ($)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1000"
                max="100000"
                step="1000"
                value={spendLimit}
                onChange={(e) => setSpendLimit(Number(e.target.value))}
                className="w-full accent-[#477bff] cursor-pointer"
              />
              <span className="font-mono text-sm font-bold text-[#101a35] shrink-0 w-24 text-right tabular-nums">
                ${spendLimit.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2 border-t border-[#101a35]/6">
            <label className="flex items-center justify-between text-xs cursor-pointer">
              <span className="text-[#45464d] font-medium">Enable Online E-Commerce Swipes</span>
              <input
                type="checkbox"
                checked={allowOnline}
                onChange={(e) => setAllowOnline(e.target.checked)}
                className="w-4 h-4 rounded text-[#477bff] accent-[#477bff]"
              />
            </label>
            <label className="flex items-center justify-between text-xs cursor-pointer">
              <span className="text-[#45464d] font-medium">Enable Foreign & Multi-Currency Spend</span>
              <input
                type="checkbox"
                checked={allowInternational}
                onChange={(e) => setAllowInternational(e.target.checked)}
                className="w-4 h-4 rounded text-[#477bff] accent-[#477bff]"
              />
            </label>
          </div>

          <div className="pt-4 flex items-center justify-end gap-2 border-t border-[#101a35]/8">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-[#101a35]/12 text-[#101a35] hover:bg-[#eceff8] text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-[#477bff] hover:bg-[#386df2] text-white text-xs font-bold shadow-sm transition-all active:scale-[0.98] flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Issue Immediately</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
