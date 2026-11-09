import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  CreditCard, 
  ArrowLeftRight,
  Download,
  Building,
  Coins
} from 'lucide-react';
import { Transaction } from '../types';
import { AuditReceiptModal } from './AuditReceiptModal';

interface TransactionLedgerProps {
  transactions: Transaction[];
  title?: string;
  subtitle?: string;
  limit?: number;
  showFilters?: boolean;
}

export const TransactionLedger: React.FC<TransactionLedgerProps> = ({
  transactions,
  title = 'Treasury Transaction Ledger',
  subtitle = 'Real-time multi-rail clearing records and settlement logs',
  limit,
  showFilters = true,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'inbound' | 'outbound' | 'holds' | 'cards'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const filteredTransactions = transactions.filter((tx) => {
    // Search query matching
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      tx.title.toLowerCase().includes(query) ||
      tx.merchantOrBeneficiary.toLowerCase().includes(query) ||
      tx.reference.toLowerCase().includes(query) ||
      tx.category.toLowerCase().includes(query);

    if (!matchesSearch) return false;

    // Filter type matching
    if (activeFilter === 'inbound') return tx.amount > 0;
    if (activeFilter === 'outbound') return tx.amount < 0 && tx.type !== 'card_spend';
    if (activeFilter === 'holds') return tx.status === 'hold' || tx.status === 'pending';
    if (activeFilter === 'cards') return tx.type === 'card_spend';

    return true;
  });

  const displayedTransactions = limit ? filteredTransactions.slice(0, limit) : filteredTransactions;

  const handleExportCSV = () => {
    const headers = ['Reference,Title,Counterparty,Type,Category,Amount,Currency,Status,Rail,Timestamp\n'];
    const rows = filteredTransactions.map(tx => 
      `"${tx.reference}","${tx.title}","${tx.merchantOrBeneficiary}","${tx.type}","${tx.category}",${tx.amount},"${tx.currency}","${tx.status}","${tx.rail}","${tx.timestamp}"`
    );
    const blob = new Blob([...headers, rows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Veloce_Ledger_Export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="bg-white rounded-2xl border border-[#101a35]/8 shadow-[0px_2px_8px_rgba(16,26,53,0.04)] overflow-hidden">
      {/* Ledger Header */}
      <div className="p-6 border-b border-[#101a35]/8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-bold text-lg text-[#101a35] tracking-tight">{title}</h2>
          <p className="text-xs text-[#76767e] mt-0.5">{subtitle}</p>
        </div>

        {showFilters && (
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#76767e]" />
              <input
                type="text"
                placeholder="Search ledger..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-8 pr-3 text-xs bg-[#f2f4f8] rounded-lg border border-[#101a35]/8 text-[#101a35] focus:outline-none focus:border-[#477bff] focus:bg-white transition-all w-40 sm:w-52"
              />
            </div>

            <button
              onClick={handleExportCSV}
              className="h-9 px-3 rounded-lg border border-[#101a35]/12 hover:bg-[#eceff8] text-xs font-semibold text-[#101a35] flex items-center gap-1.5 transition-colors"
              title="Export ledger as CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      {showFilters && (
        <div className="px-6 py-2.5 bg-[#f7f9fd] border-b border-[#101a35]/8 flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'all', label: 'All Operations' },
            { id: 'inbound', label: 'Inbound Settlements' },
            { id: 'outbound', label: 'Outbound Wires' },
            { id: 'holds', label: 'Pending & Holds' },
            { id: 'cards', label: 'Virtual Cards' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeFilter === tab.id
                  ? 'bg-[#101a35] text-white shadow-xs'
                  : 'text-[#45464d] hover:bg-[#eceff8]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Dense Transaction Rows */}
      <div className="divide-y divide-[#101a35]/6">
        {displayedTransactions.length === 0 ? (
          <div className="py-12 text-center text-[#76767e]">
            <p className="text-sm font-medium">No transactions matched your criteria.</p>
            <p className="text-xs mt-1 text-[#76767e]">Try adjusting your search or active filters.</p>
          </div>
        ) : (
          displayedTransactions.map((tx) => {
            const isPositive = tx.amount > 0;

            return (
              <div
                key={tx.id}
                onClick={() => setSelectedTransaction(tx)}
                className="group flex items-center justify-between px-6 py-3.5 min-h-[56px] hover:bg-[#f7f9fd] cursor-pointer transition-colors"
              >
                {/* Left: Avatar / Category Icon + Descriptions */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative shrink-0">
                    {tx.counterpartyAvatar ? (
                      <img
                        src={tx.counterpartyAvatar}
                        alt={tx.merchantOrBeneficiary}
                        className="w-10 h-10 rounded-full object-cover border border-[#101a35]/8"
                      />
                    ) : (
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isPositive
                            ? 'bg-[#16a879]/15 text-[#16a879]'
                            : tx.type === 'card_spend'
                            ? 'bg-[#6847e8]/10 text-[#6847e8]'
                            : 'bg-[#eceff8] text-[#101a35]'
                        }`}
                      >
                        {isPositive ? (
                          <ArrowDownLeft className="w-5 h-5" />
                        ) : tx.type === 'card_spend' ? (
                          <CreditCard className="w-5 h-5" />
                        ) : tx.type === 'exchange' ? (
                          <ArrowLeftRight className="w-5 h-5" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5" />
                        )}
                      </div>
                    )}
                    {tx.cardLast4 && (
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#101a35] text-white flex items-center justify-center text-[8px] font-mono">
                        ••
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-semibold text-sm text-[#101a35] truncate group-hover:text-[#477bff] transition-colors">
                        {tx.title}
                      </span>
                      <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.2 rounded bg-[#eceff8] text-[#45464d] uppercase tracking-wider">
                        {tx.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#76767e] mt-0.5 truncate">
                      <span className="truncate">{tx.merchantOrBeneficiary}</span>
                      <span>•</span>
                      <span className="shrink-0">{tx.timestamp}</span>
                      <span className="hidden md:inline shrink-0 font-mono text-[11px] text-[#76767e]">
                        ({tx.rail})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Status badge & High-density Tabular Numbers */}
                <div className="flex items-center gap-4 shrink-0 text-right">
                  {/* Status Chip */}
                  <div className="hidden sm:block">
                    {tx.status === 'completed' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#16a879]/10 text-[#16a879] inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#16a879]" />
                        Cleared
                      </span>
                    )}
                    {tx.status === 'hold' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#f5a623]/10 text-[#f5a623] inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Dual-Hold
                      </span>
                    )}
                    {tx.status === 'pending' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#f5a623]/10 text-[#f5a623] inline-flex items-center gap-1">
                        Pending
                      </span>
                    )}
                  </div>

                  {/* Financial Numerical Alignment: tabular-nums lining-nums */}
                  <div className="flex flex-col items-end">
                    <span
                      className={`font-mono text-sm sm:text-base font-bold tabular-nums tracking-tight ${
                        isPositive ? 'text-[#16a879]' : 'text-[#101a35]'
                      }`}
                    >
                      {isPositive ? '+' : '-'}${Math.abs(tx.amount).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-[#76767e] tracking-wider">
                      {tx.currency}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Selected Transaction Detail Modal */}
      {selectedTransaction && (
        <AuditReceiptModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  );
};
