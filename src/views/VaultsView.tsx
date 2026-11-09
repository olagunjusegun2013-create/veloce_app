import React, { useState } from 'react';
import { 
  Coins, 
  ArrowLeftRight, 
  TrendingUp, 
  Globe, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  ArrowUpRight, 
  Lock, 
  Info,
  Sliders,
  Check
} from 'lucide-react';
import { CurrencyAccount, FXRate } from '../types';
import { INITIAL_FX_RATES } from '../data/mockData';

interface VaultsViewProps {
  accounts: CurrencyAccount[];
  onOpenExchangeModal: () => void;
}

export const VaultsView: React.FC<VaultsViewProps> = ({
  accounts,
  onOpenExchangeModal,
}) => {
  const [fxRates] = useState<FXRate[]>(INITIAL_FX_RATES);
  const [autoHedgeUSD, setAutoHedgeUSD] = useState(true);
  const [autoHedgeEUR, setAutoHedgeEUR] = useState(false);
  const [simulatedPrincipal, setSimulatedPrincipal] = useState(100000);

  // 4.85% APY compound calculation
  const apyRate = 0.0485;
  const year1Yield = simulatedPrincipal * apyRate;
  const year3Yield = simulatedPrincipal * (Math.pow(1 + apyRate, 3) - 1);

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Vault Header & Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#101a35] tracking-tight">
            Multi-Currency Treasury Vaults
          </h1>
          <p className="text-xs text-[#76767e] mt-1">
            Institutional yield accumulation, currency sub-accounts, and spot liquidity
          </p>
        </div>

        <button
          onClick={onOpenExchangeModal}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#477bff] hover:bg-[#386df2] text-white text-xs font-bold shadow-[0_2px_8px_rgba(71,123,255,0.25)] transition-all active:scale-[0.98] self-start"
        >
          <ArrowLeftRight className="w-4 h-4" />
          <span>Rebalance & Swap FX</span>
        </button>
      </div>

      {/* Live Interbank Spot Rate Ticker */}
      <div className="bg-white rounded-2xl border border-[#101a35]/8 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#477bff]" />
            <span className="font-heading font-bold text-xs text-[#101a35] uppercase tracking-wider">
              Institutional FX Spot Ticker (Real-Time Mid-Market)
            </span>
          </div>
          <span className="text-[10px] text-[#16a879] font-semibold bg-[#16a879]/10 px-2 py-0.5 rounded-full">
            ● 0.00% Spread Markup
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {fxRates.map((item) => (
            <div
              key={item.pair}
              className="p-3.5 rounded-xl border border-[#101a35]/6 bg-[#f7f9fd] flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#101a35]">{item.pair}</span>
                <span
                  className={`text-[10px] font-bold ${
                    item.change24h >= 0 ? 'text-[#16a879]' : 'text-[#e53935]'
                  }`}
                >
                  {item.change24h >= 0 ? '+' : ''}{item.change24h}%
                </span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="font-mono text-lg font-bold text-[#101a35] tabular-nums">
                  {item.rate.toFixed(4)}
                </span>
                <span className="text-[10px] text-[#76767e]">
                  H: {item.high.toFixed(4)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sub-Account Vaults Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className="bg-white rounded-2xl border border-[#101a35]/8 p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
          >
            {/* Top row */}
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#f2f4f8] flex items-center justify-center text-2xl border border-[#101a35]/6">
                    {acc.flag}
                  </div>
                  <div>
                    <h2 className="font-heading font-bold text-base text-[#101a35]">{acc.currencyName}</h2>
                    <span className="text-xs text-[#76767e] font-mono">{acc.currency} Primary Reserve</span>
                  </div>
                </div>

                {acc.apy ? (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#16a879]/10 text-[#16a879] flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {acc.apy}% APY
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#eceff8] text-[#45464d]">
                    Standard Yield
                  </span>
                )}
              </div>

              {/* Balance */}
              <div className="mt-6">
                <span className="text-xs text-[#76767e] uppercase font-bold tracking-wider block">
                  Available Vault Liquidity
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-mono text-3xl font-extrabold text-[#101a35] tabular-nums">
                    {acc.symbol}{acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className="text-sm font-bold text-[#76767e]">{acc.currency}</span>
                </div>
                <span className="text-xs text-[#76767e] block mt-1">
                  ≈ ${acc.usdEquivalent.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD Valuation
                </span>
              </div>

              {/* Banking coordinates */}
              <div className="mt-6 p-3 rounded-xl bg-[#f7f9fd] border border-[#101a35]/6 text-xs space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-[#76767e] font-sans">Account No:</span>
                  <span className="text-[#101a35] font-semibold">{acc.accountNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#76767e] font-sans">IBAN:</span>
                  <span className="text-[#101a35] font-semibold truncate max-w-[200px]">{acc.iban}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-[#101a35]/8 flex items-center justify-between">
              <span className="text-xs text-[#16a879] font-semibold">
                ● 24/7 Automated Sweep Active
              </span>
              <button
                onClick={onOpenExchangeModal}
                className="px-4 py-2 rounded-lg bg-[#101a35] hover:bg-[#1b2b54] text-white text-xs font-semibold shadow-xs transition-colors"
              >
                Rebalance
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Yield Simulator & Auto-Hedge Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Yield Compound Simulator (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#101a35]/8 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-[#16a879]" />
              <h2 className="font-heading font-bold text-base text-[#101a35]">
                Veloce High-Yield Reserve Simulator
              </h2>
            </div>
            <p className="text-xs text-[#76767e]">
              Institutional Treasury Bills (T-Bills) repo yield compounded daily at 4.85% APY
            </p>

            <div className="mt-5">
              <label className="text-xs font-bold text-[#101a35] uppercase tracking-wider block mb-2">
                Simulated Deposit Principal: ${simulatedPrincipal.toLocaleString()}
              </label>
              <input
                type="range"
                min="10000"
                max="1000000"
                step="10000"
                value={simulatedPrincipal}
                onChange={(e) => setSimulatedPrincipal(Number(e.target.value))}
                className="w-full accent-[#477bff] cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="p-4 rounded-xl bg-[#f7f9fd] border border-[#101a35]/8">
                <span className="text-xs text-[#76767e] block">12-Month Projected Yield</span>
                <span className="font-mono text-2xl font-bold text-[#16a879] mt-1 block tabular-nums">
                  +${year1Yield.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </span>
                <span className="text-[11px] text-[#76767e] mt-1 block">
                  Total Value: ${(simulatedPrincipal + year1Yield).toLocaleString()}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#f7f9fd] border border-[#101a35]/8">
                <span className="text-xs text-[#76767e] block">36-Month Compound Yield</span>
                <span className="font-mono text-2xl font-bold text-[#6847e8] mt-1 block tabular-nums">
                  +${year3Yield.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </span>
                <span className="text-[11px] text-[#76767e] mt-1 block">
                  Total Value: ${(simulatedPrincipal + year3Yield).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#101a35]/8 flex items-center justify-between text-xs text-[#76767e]">
            <span>FDIC pass-through liquidity protection</span>
            <span className="font-semibold text-[#101a35]">No minimum lockup period</span>
          </div>
        </div>

        {/* Automated Treasury Rules (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#101a35]/8 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sliders className="w-4 h-4 text-[#477bff]" />
              <h2 className="font-heading font-bold text-base text-[#101a35]">
                Algorithmic FX Sweeps
              </h2>
            </div>
            <p className="text-xs text-[#76767e]">
              Automate multi-currency risk mitigation and treasury hedging
            </p>

            <div className="flex flex-col gap-4 mt-6">
              <div className="flex items-start justify-between gap-3 p-3 rounded-xl bg-[#f7f9fd] border border-[#101a35]/6">
                <div>
                  <span className="text-xs font-bold text-[#101a35] block">
                    Auto-Convert EUR Revenue
                  </span>
                  <p className="text-[11px] text-[#76767e] leading-snug mt-0.5">
                    Automatically convert EUR inflows exceeding €50,000 into USD Treasury Vault.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={autoHedgeEUR}
                  onChange={(e) => setAutoHedgeEUR(e.target.checked)}
                  className="w-5 h-5 rounded text-[#477bff] accent-[#477bff] shrink-0 mt-1 cursor-pointer"
                />
              </div>

              <div className="flex items-start justify-between gap-3 p-3 rounded-xl bg-[#f7f9fd] border border-[#101a35]/6">
                <div>
                  <span className="text-xs font-bold text-[#101a35] block">
                    Overnight Yield Sweep
                  </span>
                  <p className="text-[11px] text-[#76767e] leading-snug mt-0.5">
                    Sweep idle USD balances above $25,000 into 4.85% APY overnight repo vault.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={autoHedgeUSD}
                  onChange={(e) => setAutoHedgeUSD(e.target.checked)}
                  className="w-5 h-5 rounded text-[#477bff] accent-[#477bff] shrink-0 mt-1 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#101a35]/8 flex items-center gap-1.5 text-xs text-[#16a879] font-semibold">
            <Check className="w-4 h-4" />
            <span>Policy active and audited by Risk Desk</span>
          </div>
        </div>
      </div>
    </div>
  );
};
