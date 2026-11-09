import React from 'react';
import { X, CheckCircle2, Clock, ShieldCheck, Download, Share2, Building2, Hash, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Transaction } from '../types';

interface AuditReceiptModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export const AuditReceiptModal: React.FC<AuditReceiptModalProps> = ({ transaction, onClose }) => {
  if (!transaction) return null;

  const isPositive = transaction.amount > 0;

  const handleDownload = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(transaction, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Veloce_Receipt_${transaction.reference}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#101a35]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white rounded-2xl shadow-[0_24px_48px_-12px_rgba(16,26,53,0.24)] border border-[#101a35]/8 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Receipt Header */}
        <div className="p-6 bg-[#f7f9fd] border-b border-[#101a35]/8 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              isPositive ? 'bg-[#16a879]/15 text-[#16a879]' : 'bg-[#101a35]/10 text-[#101a35]'
            }`}>
              {isPositive ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-sm text-[#101a35] tracking-tight">
                  VELOCE AUDIT RECEIPT
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-[#101a35]/8 text-[#101a35]">
                  {transaction.rail} Rail
                </span>
              </div>
              <p className="text-xs text-[#76767e] font-mono mt-0.5">Ref: {transaction.reference}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#76767e] hover:bg-[#eceff8] hover:text-[#101a35] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount & Status Hero */}
        <div className="p-6 text-center border-b border-[#101a35]/8">
          <span className="text-xs uppercase font-bold tracking-wider text-[#76767e]">
            {isPositive ? 'Total Settlement Inbound' : 'Total Settlement Outbound'}
          </span>
          <div className={`font-mono text-3xl sm:text-4xl font-bold mt-2 tabular-nums ${
            isPositive ? 'text-[#16a879]' : 'text-[#101a35]'
          }`}>
            {isPositive ? '+' : '-'}${Math.abs(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            <span className="text-lg font-sans ml-1 text-[#76767e] font-medium">{transaction.currency}</span>
          </div>

          {/* Status Badge */}
          <div className="mt-3 flex justify-center">
            {transaction.status === 'completed' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#16a879]/10 text-[#16a879]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified & Immutable Ledger Entry
              </span>
            )}
            {transaction.status === 'hold' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#f5a623]/10 text-[#f5a623]">
                <Clock className="w-3.5 h-3.5" />
                Dual-Authorization Compliance Hold
              </span>
            )}
            {transaction.status === 'pending' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#f5a623]/10 text-[#f5a623]">
                <Clock className="w-3.5 h-3.5" />
                Awaiting Clearing Cycle
              </span>
            )}
          </div>
        </div>

        {/* Dense Audit Details */}
        <div className="p-6 flex flex-col gap-3.5 text-xs">
          <div className="flex items-center justify-between py-1 border-b border-[#101a35]/6">
            <span className="text-[#76767e] font-medium">Counterparty</span>
            <span className="font-semibold text-[#101a35]">{transaction.merchantOrBeneficiary}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-[#101a35]/6">
            <span className="text-[#76767e] font-medium">Description</span>
            <span className="font-medium text-[#101a35]">{transaction.title}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-[#101a35]/6">
            <span className="text-[#76767e] font-medium">Timestamp (UTC-5)</span>
            <span className="font-mono text-[#101a35]">{transaction.timestamp}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-[#101a35]/6">
            <span className="text-[#76767e] font-medium">Category</span>
            <span className="px-2 py-0.5 rounded-full bg-[#eceff8] text-[#101a35] font-semibold text-[11px]">
              {transaction.category}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-[#101a35]/6">
            <span className="text-[#76767e] font-medium">Network Clearing Fee</span>
            <span className="font-mono text-[#16a879] font-bold">
              {transaction.fee === 0 ? '$0.00 (Zero Fee)' : `$${transaction.fee.toFixed(2)}`}
            </span>
          </div>

          {transaction.cardLast4 && (
            <div className="flex items-center justify-between py-1 border-b border-[#101a35]/6">
              <span className="text-[#76767e] font-medium">Payment Method</span>
              <span className="font-mono text-[#101a35]">Virtual Card •••• {transaction.cardLast4}</span>
            </div>
          )}

          {transaction.note && (
            <div className="p-3 bg-[#f2f4f8] rounded-xl text-[11px] text-[#45464d] leading-relaxed">
              <span className="font-bold text-[#101a35] block mb-0.5">Audit Note:</span>
              {transaction.note}
            </div>
          )}

          <div className="flex items-center gap-2 pt-2 text-[11px] text-[#76767e]">
            <ShieldCheck className="w-4 h-4 text-[#16a879]" />
            <span>End-to-end cryptographic signature checked & approved.</span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-[#f7f9fd] border-t border-[#101a35]/8 flex items-center justify-end gap-3">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#101a35]/12 text-[#101a35] hover:bg-[#eceff8] text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Download Receipt
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg bg-[#101a35] hover:bg-[#1b2b54] text-white text-xs font-semibold shadow-sm transition-all active:scale-[0.98]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
