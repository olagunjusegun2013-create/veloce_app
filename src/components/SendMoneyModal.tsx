import React, { useState } from 'react';
import { X, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2, UserCheck, Zap, Globe, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Beneficiary, CurrencyAccount, CurrencyCode, Transaction } from '../types';

interface SendMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: CurrencyAccount[];
  beneficiaries: Beneficiary[];
  onExecuteTransfer: (newTx: Transaction, updatedAccounts: CurrencyAccount[]) => void;
}

export const SendMoneyModal: React.FC<SendMoneyModalProps> = ({
  isOpen,
  onClose,
  accounts,
  beneficiaries,
  onExecuteTransfer,
}) => {
  const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState<string>(beneficiaries[0]?.id || '');
  const [selectedAccountCurrency, setSelectedAccountCurrency] = useState<CurrencyCode>('USD');
  const [amountStr, setAmountStr] = useState<string>('5000');
  const [selectedRail, setSelectedRail] = useState<'FedNow' | 'SEPA Instant' | 'SWIFT'>('FedNow');
  const [note, setNote] = useState<string>('Treasury Allocation & Vendor Settlement');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [dualAuthStep, setDualAuthStep] = useState<boolean>(false);
  const [successTx, setSuccessTx] = useState<Transaction | null>(null);

  if (!isOpen) return null;

  const currentAccount = accounts.find((a) => a.currency === selectedAccountCurrency) || accounts[0];
  const selectedBeneficiary = beneficiaries.find((b) => b.id === selectedBeneficiaryId) || beneficiaries[0];

  const amount = parseFloat(amountStr) || 0;
  const isHighValue = amount >= 10000;
  const fee = selectedRail === 'SWIFT' ? 12.00 : 0.00;
  const totalDeduction = amount + fee;
  const hasSufficientFunds = currentAccount.balance >= totalDeduction;

  const handleQuickAmount = (val: number) => {
    setAmountStr(val.toString());
  };

  const handleStartSend = () => {
    if (amount <= 0 || !hasSufficientFunds) return;

    if (isHighValue && !dualAuthStep) {
      setDualAuthStep(true);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Calculate updated accounts
      const updated = accounts.map((acc) => {
        if (acc.currency === selectedAccountCurrency) {
          const newBal = Math.max(0, acc.balance - totalDeduction);
          return {
            ...acc,
            balance: newBal,
            usdEquivalent: newBal * acc.rateToUSD,
          };
        }
        return acc;
      });

      const newTx: Transaction = {
        id: `tx-${Date.now()}`,
        reference: `VEL-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
        title: `Outbound Transfer to ${selectedBeneficiary.name}`,
        merchantOrBeneficiary: `${selectedBeneficiary.organization || selectedBeneficiary.name}`,
        category: 'Treasury',
        type: 'outbound',
        status: isHighValue ? 'hold' : 'completed',
        amount: -amount,
        currency: selectedAccountCurrency,
        usdAmount: -(amount * currentAccount.rateToUSD),
        timestamp: 'Just now',
        rail: selectedRail,
        fee: fee,
        note: note,
        counterpartyAvatar: selectedBeneficiary.avatar,
      };

      onExecuteTransfer(newTx, updated);
      setIsSubmitting(false);
      setSuccessTx(newTx);

      // Trigger Confetti Celebration
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#477bff', '#6847e8', '#16a879', '#101a35'],
        });
      } catch (e) {
        // Safe fallback
      }
    }, 1200);
  };

  const handleCloseAll = () => {
    setDualAuthStep(false);
    setSuccessTx(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#101a35]/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-[0_24px_48px_-12px_rgba(16,26,53,0.25)] border border-[#101a35]/8 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success View */}
        {successTx ? (
          <div className="p-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#16a879]/15 flex items-center justify-center text-[#16a879] mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <span className="font-heading font-extrabold text-2xl text-[#101a35] tracking-tight">
              Transfer Dispatched
            </span>
            <p className="text-xs text-[#76767e] mt-1 max-w-sm">
              {successTx.status === 'hold'
                ? 'Your transfer exceeds $10,000 threshold and is queued with Dual-Authorization Hold clearance.'
                : 'Settlement initiated instantaneously through institutional high-velocity rail.'}
            </p>

            <div className="my-6 p-4 rounded-xl bg-[#f7f9fd] border border-[#101a35]/8 w-full text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#76767e]">Settlement Amount:</span>
                <span className="font-mono font-bold text-[#101a35]">
                  ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} {selectedAccountCurrency}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#76767e]">Beneficiary:</span>
                <span className="font-semibold text-[#101a35]">{selectedBeneficiary.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#76767e]">Routing Rail:</span>
                <span className="font-mono text-[#477bff] font-semibold">{selectedRail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#76767e]">Reference:</span>
                <span className="font-mono text-[#101a35]">{successTx.reference}</span>
              </div>
            </div>

            <button
              onClick={handleCloseAll}
              className="w-full py-3 rounded-lg bg-[#101a35] hover:bg-[#1b2b54] text-white text-xs font-semibold shadow-sm transition-all"
            >
              Done & Return to Ledger
            </button>
          </div>
        ) : dualAuthStep ? (
          /* Dual-Authorization Compliance Screen */
          <div className="p-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#101a35]/8">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#6847e8]" />
                <span className="font-heading font-bold text-sm text-[#101a35]">
                  Dual-Authorization Security Gate
                </span>
              </div>
              <button onClick={() => setDualAuthStep(false)} className="text-[#76767e] p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#6847e8]/10 text-[#6847e8] flex items-center justify-center mx-auto mb-3">
                <UserCheck className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-bold text-lg text-[#101a35]">
                High-Value Transfer Clearance
              </h3>
              <p className="text-xs text-[#45464d] max-w-sm mx-auto mt-1 leading-relaxed">
                Transfers equal or greater than $10,000.00 require secondary biometric confirmation and treasury audit logging.
              </p>

              <div className="mt-6 p-4 rounded-xl bg-[#f2f4f8] text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#76767e]">Transfer Amount:</span>
                  <span className="font-mono font-bold text-[#101a35]">${amount.toLocaleString()} {selectedAccountCurrency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#76767e]">Beneficiary:</span>
                  <span className="font-medium text-[#101a35]">{selectedBeneficiary.name} ({selectedBeneficiary.organization})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#76767e]">Compliance Policy:</span>
                  <span className="font-semibold text-[#16a879]">Rule #992 (FedNow Tier 4)</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setDualAuthStep(false)}
                className="flex-1 py-2.5 rounded-lg border border-[#101a35]/12 text-xs font-semibold text-[#101a35] hover:bg-[#eceff8]"
              >
                Cancel
              </button>
              <button
                disabled={isSubmitting}
                onClick={handleStartSend}
                className="flex-1 py-2.5 rounded-lg bg-[#477bff] hover:bg-[#386df2] text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Authorize & Dispatch</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Normal Transfer Form */
          <>
            {/* Modal Header */}
            <div className="p-6 bg-[#f7f9fd] border-b border-[#101a35]/8 flex items-center justify-between">
              <div>
                <span className="font-heading font-extrabold text-base text-[#101a35] tracking-tight">
                  Instant Wire & Transfer
                </span>
                <p className="text-xs text-[#76767e] mt-0.5">
                  Direct FedNow, SEPA Instant & Swift multi-currency rails
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#76767e] hover:bg-[#eceff8] hover:text-[#101a35] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-5 overflow-y-auto max-h-[75vh]">
              {/* Select Source Vault */}
              <div>
                <label className="block text-xs font-bold text-[#101a35] mb-2 uppercase tracking-wider">
                  Source Vault
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {accounts.map((acc) => (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => setSelectedAccountCurrency(acc.currency)}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                        selectedAccountCurrency === acc.currency
                          ? 'border-[#477bff] bg-[#477bff]/5 ring-1 ring-[#477bff]'
                          : 'border-[#101a35]/8 bg-white hover:bg-[#f2f4f8]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm">{acc.flag}</span>
                          <span className="text-xs font-bold text-[#101a35]">{acc.currency}</span>
                        </div>
                        <span className="font-mono text-xs text-[#76767e] block mt-1">
                          {acc.symbol}{acc.balance.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                        </span>
                      </div>
                      {selectedAccountCurrency === acc.currency && (
                        <div className="w-2 h-2 rounded-full bg-[#477bff]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipient Picker */}
              <div>
                <label className="block text-xs font-bold text-[#101a35] mb-2 uppercase tracking-wider">
                  Select Beneficiary
                </label>
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {beneficiaries.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        setSelectedBeneficiaryId(b.id);
                        setSelectedRail(b.defaultRail);
                      }}
                      className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all min-w-[72px] ${
                        selectedBeneficiaryId === b.id
                          ? 'bg-[#101a35] text-white shadow-sm'
                          : 'bg-[#f2f4f8] text-[#45464d] hover:bg-[#eceff8]'
                      }`}
                    >
                      <img
                        src={b.avatar}
                        alt={b.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-white/50"
                      />
                      <span className="text-[11px] font-semibold truncate max-w-[68px]">
                        {b.name.split(' ')[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Input with Dynamic Display Typography */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#101a35] uppercase tracking-wider">
                    Amount to Transfer
                  </label>
                  <span className="text-xs text-[#76767e]">
                    Available: {currentAccount.symbol}{currentAccount.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="relative rounded-xl border border-[#101a35]/12 p-3 bg-white focus-within:border-[#477bff] focus-within:ring-2 focus-within:ring-[#477bff]/15 transition-all">
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold text-[#76767e] mr-1">{currentAccount.symbol}</span>
                    <input
                      type="number"
                      value={amountStr}
                      onChange={(e) => setAmountStr(e.target.value)}
                      placeholder="0.00"
                      className="font-mono text-3xl font-extrabold text-[#101a35] w-full focus:outline-none tabular-nums"
                    />
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-2 mt-2">
                  {[1000, 5000, 10000, 25000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleQuickAmount(preset)}
                      className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#f2f4f8] hover:bg-[#eceff8] text-[#101a35] border border-[#101a35]/6"
                    >
                      +{currentAccount.symbol}{preset.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Settlement Rail Selection */}
              <div>
                <label className="block text-xs font-bold text-[#101a35] mb-2 uppercase tracking-wider">
                  Clearing Rail
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'FedNow', name: 'FedNow', eta: 'Instant', fee: '$0.00' },
                    { id: 'SEPA Instant', name: 'SEPA Instant', eta: 'Instant', fee: '$0.00' },
                    { id: 'SWIFT', name: 'SWIFT Priority', eta: '1-2 hrs', fee: '$12.00' },
                  ].map((rail) => (
                    <button
                      key={rail.id}
                      type="button"
                      onClick={() => setSelectedRail(rail.id as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        selectedRail === rail.id
                          ? 'border-[#477bff] bg-[#477bff]/5 ring-1 ring-[#477bff]'
                          : 'border-[#101a35]/8 bg-white hover:bg-[#f2f4f8]'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <Zap className={`w-3.5 h-3.5 ${selectedRail === rail.id ? 'text-[#477bff]' : 'text-[#76767e]'}`} />
                        <span className="text-xs font-bold text-[#101a35]">{rail.name}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-[#76767e] mt-1.5">
                        <span>{rail.eta}</span>
                        <span className="font-mono font-semibold text-[#16a879]">{rail.fee}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Transfer Note */}
              <div>
                <label className="block text-xs font-bold text-[#101a35] mb-1.5 uppercase tracking-wider">
                  Remittance Reference Note
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Q4 Consulting Retainer Settlement"
                  className="w-full h-11 px-3 text-xs bg-white rounded-lg border border-[#101a35]/12 text-[#101a35] focus:outline-none focus:border-[#477bff] focus:ring-2 focus:ring-[#477bff]/15"
                />
              </div>

              {!hasSufficientFunds && (
                <div className="p-3 bg-[#e53935]/10 border border-[#e53935]/20 rounded-xl flex items-center gap-2 text-xs text-[#e53935]">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Insufficient balance in selected vault. Please adjust amount.</span>
                </div>
              )}

              {isHighValue && hasSufficientFunds && (
                <div className="p-3 bg-[#f5a623]/10 border border-[#f5a623]/20 rounded-xl flex items-center gap-2 text-xs text-[#9a6700]">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-[#f5a623]" />
                  <span>Amount exceeds $10,000 threshold. Will require Dual-Authorization sign-off.</span>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-5 bg-[#f7f9fd] border-t border-[#101a35]/8 flex items-center justify-between">
              <div className="text-xs text-[#76767e]">
                <span>Total deduction: </span>
                <span className="font-mono font-bold text-[#101a35]">
                  {currentAccount.symbol}{totalDeduction.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>

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
                  disabled={!hasSufficientFunds || amount <= 0 || isSubmitting}
                  onClick={handleStartSend}
                  className="px-6 py-2.5 rounded-lg bg-[#477bff] hover:bg-[#386df2] text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] flex items-center gap-2"
                >
                  <span>{isHighValue ? 'Verify Clearance' : 'Send Immediately'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
