import React, { useState, useEffect } from 'react';
import { X, ArrowDownUp, RefreshCw, CheckCircle2, TrendingUp, ShieldAlert, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CurrencyAccount, CurrencyCode, Transaction } from '../types';

interface ExchangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: CurrencyAccount[];
  onExecuteExchange: (newTx: Transaction, updatedAccounts: CurrencyAccount[]) => void;
}

export const ExchangeModal: React.FC<ExchangeModalProps> = ({
  isOpen,
  onClose,
  accounts,
  onExecuteExchange,
}) => {
  const [fromCurrency, setFromCurrency] = useState<CurrencyCode>('USD');
  const [toCurrency, setToCurrency] = useState<CurrencyCode>('EUR');
  const [fromAmountStr, setFromAmountStr] = useState<string>('2500');
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(30);
  const [successTx, setSuccessTx] = useState<Transaction | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 30 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const fromAcc = accounts.find((a) => a.currency === fromCurrency) || accounts[0];
  const toAcc = accounts.find((a) => a.currency === toCurrency) || accounts[1] || accounts[0];

  // Derive FX Rate based on USD equivalents
  // 1 fromAcc.currency = (toAcc.rateToUSD / fromAcc.rateToUSD) or relative rates
  const fxRate = fromAcc.rateToUSD / toAcc.rateToUSD;
  const fromAmount = parseFloat(fromAmountStr) || 0;
  const toAmount = fromAmount * fxRate;
  const hasFunds = fromAcc.balance >= fromAmount;

  const handleFlip = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handlePercentage = (pct: number) => {
    const val = (fromAcc.balance * (pct / 100)).toFixed(2);
    setFromAmountStr(val);
  };

  const handleExecute = () => {
    if (fromAmount <= 0 || !hasFunds) return;

    setIsSwapping(true);

    setTimeout(() => {
      const updated = accounts.map((acc) => {
        if (acc.currency === fromCurrency) {
          const newBal = acc.balance - fromAmount;
          return { ...acc, balance: newBal, usdEquivalent: newBal * acc.rateToUSD };
        }
        if (acc.currency === toCurrency) {
          const newBal = acc.balance + toAmount;
          return { ...acc, balance: newBal, usdEquivalent: newBal * acc.rateToUSD };
        }
        return acc;
      });

      const newTx: Transaction = {
        id: `tx-fx-${Date.now()}`,
        reference: `VEL-FX-${Math.floor(100000 + Math.random() * 900000)}`,
        title: `FX Rebalance: ${fromCurrency} → ${toCurrency}`,
        merchantOrBeneficiary: 'Veloce Treasury Liquidity Pool',
        category: 'Treasury',
        type: 'exchange',
        status: 'completed',
        amount: toAmount,
        currency: toCurrency,
        usdAmount: toAmount * toAcc.rateToUSD,
        timestamp: 'Just now',
        rail: 'Internal',
        fee: 0.00,
        note: `Exchanged ${fromAcc.symbol}${fromAmount.toLocaleString()} at 1 ${fromCurrency} = ${fxRate.toFixed(4)} ${toCurrency} (0.00% markup guarantee)`,
      };

      onExecuteExchange(newTx, updated);
      setIsSwapping(false);
      setSuccessTx(newTx);

      try {
        confetti({
          particleCount: 70,
          spread: 55,
          origin: { y: 0.6 },
          colors: ['#6847e8', '#477bff', '#16a879'],
        });
      } catch (e) {}
    }, 1000);
  };

  const handleDone = () => {
    setSuccessTx(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#101a35]/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-[0_24px_48px_-12px_rgba(16,26,53,0.25)] border border-[#101a35]/8 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {successTx ? (
          <div className="p-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#16a879]/15 flex items-center justify-center text-[#16a879] mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="font-heading font-extrabold text-2xl text-[#101a35] tracking-tight">
              Liquidity Rebalanced
            </h2>
            <p className="text-xs text-[#76767e] mt-1 max-w-sm">
              Vault conversion settled immediately with 0.00% institutional markup guarantee.
            </p>

            <div className="my-6 p-4 rounded-xl bg-[#f7f9fd] border border-[#101a35]/8 w-full text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#76767e]">Sold:</span>
                <span className="font-mono font-bold text-[#101a35]">
                  {fromAcc.symbol}{fromAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} {fromCurrency}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#76767e]">Purchased:</span>
                <span className="font-mono font-bold text-[#16a879]">
                  +{toAcc.symbol}{toAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} {toCurrency}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#76767e]">Effective Rate:</span>
                <span className="font-mono text-[#477bff]">1 {fromCurrency} = {fxRate.toFixed(4)} {toCurrency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#76767e]">Spread Fee:</span>
                <span className="font-mono text-[#16a879] font-bold">$0.00 (Zero Markup)</span>
              </div>
            </div>

            <button
              onClick={handleDone}
              className="w-full py-3 rounded-lg bg-[#101a35] hover:bg-[#1b2b54] text-white text-xs font-semibold shadow-sm transition-all"
            >
              Done & Return to Treasury
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-6 bg-[#f7f9fd] border-b border-[#101a35]/8 flex items-center justify-between">
              <div>
                <span className="font-heading font-extrabold text-base text-[#101a35] tracking-tight">
                  Instant FX Vault Rebalancing
                </span>
                <p className="text-xs text-[#76767e] mt-0.5">
                  Interbank mid-market rate with zero spread markup
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#76767e] hover:bg-[#eceff8] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4">
              {/* Sell Module */}
              <div className="p-4 rounded-xl border border-[#101a35]/10 bg-white">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-[#76767e] uppercase tracking-wider">You Sell</span>
                  <span className="text-[#76767e]">
                    Balance: {fromAcc.symbol}{fromAcc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-baseline flex-1">
                    <span className="text-xl font-bold text-[#76767e] mr-1">{fromAcc.symbol}</span>
                    <input
                      type="number"
                      value={fromAmountStr}
                      onChange={(e) => setFromAmountStr(e.target.value)}
                      placeholder="0.00"
                      className="font-mono text-2xl font-bold text-[#101a35] w-full focus:outline-none tabular-nums"
                    />
                  </div>

                  {/* Select Currency */}
                  <select
                    value={fromCurrency}
                    onChange={(e) => {
                      const newCurr = e.target.value as CurrencyCode;
                      setFromCurrency(newCurr);
                      if (newCurr === toCurrency) {
                        setToCurrency(fromCurrency);
                      }
                    }}
                    className="h-10 px-3 rounded-lg border border-[#101a35]/12 bg-[#f2f4f8] text-xs font-bold text-[#101a35] focus:outline-none cursor-pointer"
                  >
                    {accounts.map((a) => (
                      <option key={a.id} value={a.currency}>
                        {a.flag} {a.currency}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Percentage Quick Presets */}
                <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-[#101a35]/6">
                  {[25, 50, 75, 100].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handlePercentage(pct)}
                      className="px-2.5 py-1 rounded text-[11px] font-semibold bg-[#f2f4f8] hover:bg-[#eceff8] text-[#45464d]"
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Inverted Flip Trigger */}
              <div className="flex justify-center -my-2 relative z-10">
                <button
                  type="button"
                  onClick={handleFlip}
                  className="w-9 h-9 rounded-full bg-white border border-[#101a35]/12 text-[#101a35] hover:bg-[#eceff8] shadow-sm flex items-center justify-center transition-transform hover:rotate-180"
                  title="Invert currencies"
                >
                  <ArrowDownUp className="w-4 h-4 text-[#477bff]" />
                </button>
              </div>

              {/* Buy Module */}
              <div className="p-4 rounded-xl border border-[#101a35]/10 bg-[#f7f9fd]">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-[#76767e] uppercase tracking-wider">You Receive</span>
                  <span className="text-[#16a879] font-medium">Guaranteed Payout</span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-baseline flex-1">
                    <span className="text-xl font-bold text-[#76767e] mr-1">{toAcc.symbol}</span>
                    <span className="font-mono text-2xl font-bold text-[#101a35] tabular-nums">
                      {toAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  <select
                    value={toCurrency}
                    onChange={(e) => {
                      const newCurr = e.target.value as CurrencyCode;
                      setToCurrency(newCurr);
                      if (newCurr === fromCurrency) {
                        setFromCurrency(toCurrency);
                      }
                    }}
                    className="h-10 px-3 rounded-lg border border-[#101a35]/12 bg-white text-xs font-bold text-[#101a35] focus:outline-none cursor-pointer"
                  >
                    {accounts.map((a) => (
                      <option key={a.id} value={a.currency}>
                        {a.flag} {a.currency}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Rate & Guarantee Pill */}
              <div className="p-3 bg-[#f2f4f8] rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-[#45464d]">
                  <TrendingUp className="w-4 h-4 text-[#477bff]" />
                  <span>1 {fromCurrency} = <strong className="font-mono">{fxRate.toFixed(4)}</strong> {toCurrency}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-[#76767e]">
                  <RefreshCw className="w-3 h-3 animate-spin text-[#76767e]" />
                  <span>Locked: {countdown}s</span>
                </div>
              </div>

              {!hasFunds && (
                <div className="p-2.5 bg-[#e53935]/10 border border-[#e53935]/20 rounded-lg text-xs text-[#e53935] flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>Exceeds balance in {fromCurrency} vault.</span>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-5 bg-[#f7f9fd] border-t border-[#101a35]/8 flex items-center justify-between">
              <span className="text-[11px] text-[#76767e]">
                No hidden spreads. 0.00% platform fee.
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-lg border border-[#101a35]/12 text-[#101a35] hover:bg-[#eceff8] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!hasFunds || fromAmount <= 0 || isSwapping}
                  onClick={handleExecute}
                  className="px-6 py-2.5 rounded-lg bg-[#477bff] hover:bg-[#386df2] text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] flex items-center gap-2"
                >
                  {isSwapping ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Execute Swap</span>
                      <Sparkles className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
