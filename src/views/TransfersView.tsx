import React, { useState } from 'react';
import { 
  ArrowLeftRight, 
  ArrowUpRight, 
  Plus, 
  Search, 
  Building2, 
  Zap, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Copy, 
  Check,
  Send,
  X,
  Filter
} from 'lucide-react';
import { Beneficiary, Transaction, CurrencyAccount, CurrencyCode } from '../types';
import { TransactionLedger } from '../components/TransactionLedger';

interface TransfersViewProps {
  transactions: Transaction[];
  beneficiaries: Beneficiary[];
  accounts: CurrencyAccount[];
  onOpenSendModal: () => void;
  onAddBeneficiary: (b: Beneficiary) => void;
}

export const TransfersView: React.FC<TransfersViewProps> = ({
  transactions,
  beneficiaries,
  accounts,
  onOpenSendModal,
  onAddBeneficiary,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<'ALL' | CurrencyCode>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBenName, setNewBenName] = useState('');
  const [newBenOrg, setNewBenOrg] = useState('');
  const [newBenAccount, setNewBenAccount] = useState('');
  const [newBenRouting, setNewBenRouting] = useState('');

  // Filter transactions by merchant name or currency type
  const filteredTransactions = transactions.filter((tx) => {
    const query = searchQuery.trim().toLowerCase();

    // Check currency type filter from quick-select pills
    const matchesCurrencyPill = selectedCurrency === 'ALL' || tx.currency === selectedCurrency;
    if (!matchesCurrencyPill) return false;

    if (!query) return true;

    // Check merchant / beneficiary name OR currency type
    const matchesMerchant = 
      tx.merchantOrBeneficiary.toLowerCase().includes(query) ||
      tx.title.toLowerCase().includes(query);

    const matchesCurrency = 
      tx.currency.toLowerCase() === query ||
      tx.currency.toLowerCase().includes(query);

    return matchesMerchant || matchesCurrency;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateBen = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBenName.trim()) return;

    const newB: Beneficiary = {
      id: `ben-${Date.now()}`,
      name: newBenName,
      organization: newBenOrg || newBenName,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      email: `${newBenName.toLowerCase().replace(/\s+/g, '')}@enterprise.org`,
      accountNumber: newBenAccount || '982019488',
      routingNumber: newBenRouting || '021000021',
      currency: 'USD',
      defaultRail: 'FedNow',
      category: 'Vendors',
    };

    onAddBeneficiary(newB);
    setShowAddModal(false);
    setNewBenName('');
    setNewBenOrg('');
    setNewBenAccount('');
    setNewBenRouting('');
  };

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Top Banner & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#101a35] tracking-tight">
            Transfers & High-Velocity Wires
          </h1>
          <p className="text-xs text-[#76767e] mt-1">
            Global settlement network across FedNow, SEPA Instant, and SWIFT Priority
          </p>
        </div>

        <button
          onClick={onOpenSendModal}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#477bff] hover:bg-[#386df2] text-white text-xs font-bold shadow-[0_2px_8px_rgba(71,123,255,0.25)] transition-all active:scale-[0.98] self-start"
        >
          <Send className="w-4 h-4" />
          <span>New Wire Transfer</span>
        </button>
      </div>

      {/* Top Search Input Bar for Merchant Name or Currency Type */}
      <div className="bg-white rounded-2xl border border-[#101a35]/8 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#76767e]" />
          <input
            type="text"
            placeholder="Search by merchant name or currency type (e.g. Amazon, Vanguard, Credit Suisse, USD, EUR, CHF)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-10 text-xs sm:text-sm bg-[#f2f4f8] rounded-xl border border-[#101a35]/8 text-[#101a35] placeholder:text-[#76767e] focus:outline-none focus:border-[#477bff] focus:bg-white focus:ring-2 focus:ring-[#477bff]/15 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#76767e] hover:text-[#101a35] p-1 rounded-md"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Currency Quick-Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 shrink-0">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#76767e] mr-1 hidden sm:inline flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Currency:
          </span>
          {(['ALL', 'USD', 'EUR', 'GBP', 'CHF'] as const).map((curr) => (
            <button
              key={curr}
              onClick={() => setSelectedCurrency(curr)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCurrency === curr
                  ? 'bg-[#101a35] text-white shadow-xs'
                  : 'bg-[#f2f4f8] text-[#45464d] hover:bg-[#eceff8] hover:text-[#101a35]'
              }`}
            >
              {curr === 'ALL' ? 'All Currencies' : curr}
            </button>
          ))}
        </div>
      </div>

      {/* Active Filter Results Indicator */}
      {(searchQuery || selectedCurrency !== 'ALL') && (
        <div className="-mt-4 flex items-center justify-between text-xs px-2 text-[#76767e]">
          <span>
            Found <strong className="text-[#101a35] font-mono">{filteredTransactions.length}</strong> matching transaction{filteredTransactions.length === 1 ? '' : 's'}
            {searchQuery && (
              <span> for term &ldquo;<strong className="text-[#477bff]">{searchQuery}</strong>&rdquo;</span>
            )}
            {selectedCurrency !== 'ALL' && (
              <span> in <strong className="text-[#101a35]">{selectedCurrency}</strong> currency</span>
            )}
          </span>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCurrency('ALL');
            }}
            className="text-[#e53935] hover:underline font-semibold text-[11px]"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-[#101a35]/8 p-5 shadow-xs">
          <div className="flex items-center justify-between text-[#76767e] text-xs">
            <span>Average Clearing Speed</span>
            <Zap className="w-4 h-4 text-[#477bff]" />
          </div>
          <span className="font-mono text-2xl font-extrabold text-[#101a35] mt-2 block">
            1.8 seconds
          </span>
          <span className="text-[11px] text-[#16a879] font-medium mt-1 block">
            ✓ 99.98% instant straight-through processing
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-[#101a35]/8 p-5 shadow-xs">
          <div className="flex items-center justify-between text-[#76767e] text-xs">
            <span>Monthly Wire Outbound</span>
            <ArrowUpRight className="w-4 h-4 text-[#101a35]" />
          </div>
          <span className="font-mono text-2xl font-extrabold text-[#101a35] mt-2 block tabular-nums">
            $48,250.00
          </span>
          <span className="text-[11px] text-[#76767e] font-medium mt-1 block">
            Across 14 institutional counterparties
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-[#101a35]/8 p-5 shadow-xs">
          <div className="flex items-center justify-between text-[#76767e] text-xs">
            <span>Dual-Auth Threshold Gate</span>
            <ShieldCheck className="w-4 h-4 text-[#6847e8]" />
          </div>
          <span className="font-mono text-2xl font-extrabold text-[#101a35] mt-2 block">
            $10,000.00
          </span>
          <span className="text-[11px] text-[#6847e8] font-medium mt-1 block">
            Secondary biometric check enforced
          </span>
        </div>
      </div>

      {/* Beneficiaries Directory */}
      <div className="bg-white rounded-2xl border border-[#101a35]/8 p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-[#101a35]/8">
          <div>
            <h2 className="font-heading font-bold text-base text-[#101a35]">
              Verified Counterparty Directory
            </h2>
            <p className="text-xs text-[#76767e]">
              Saved bank routing, IBANs, and preferred clearing channels
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#101a35]/12 hover:bg-[#eceff8] text-xs font-semibold text-[#101a35] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Beneficiary</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {beneficiaries.map((b) => (
            <div
              key={b.id}
              className="p-4 rounded-xl border border-[#101a35]/8 bg-[#f7f9fd] hover:border-[#477bff]/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <img
                    src={b.avatar}
                    alt={b.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-xs"
                  />
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#45464d] border border-[#101a35]/6">
                    {b.defaultRail}
                  </span>
                </div>

                <div className="mt-3">
                  <span className="font-heading font-bold text-sm text-[#101a35] block truncate">
                    {b.name}
                  </span>
                  <span className="text-xs text-[#76767e] block truncate">
                    {b.organization}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-[#101a35]/6 text-[11px] space-y-1">
                  <div className="flex justify-between items-center text-[#76767e]">
                    <span>Routing:</span>
                    <span className="font-mono font-medium text-[#101a35]">{b.routingNumber}</span>
                  </div>
                  <div className="flex justify-between items-center text-[#76767e]">
                    <span>Account:</span>
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-[#101a35]">•••{b.accountNumber.slice(-4)}</span>
                      <button
                        onClick={() => handleCopy(b.id, b.accountNumber)}
                        className="text-[#76767e] hover:text-[#101a35]"
                        title="Copy account number"
                      >
                        {copiedId === b.id ? (
                          <Check className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={onOpenSendModal}
                className="mt-4 w-full py-2 rounded-lg bg-white border border-[#101a35]/10 text-xs font-semibold text-[#101a35] hover:bg-[#101a35] hover:text-white transition-all flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <span>Send Funds</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Complete Historical Ledger */}
      <TransactionLedger
        transactions={filteredTransactions}
        title={
          searchQuery || selectedCurrency !== 'ALL'
            ? `Filtered Settlement History (${filteredTransactions.length} results)`
            : 'Comprehensive Wire Settlement History'
        }
        subtitle={
          searchQuery || selectedCurrency !== 'ALL'
            ? `Filtered by merchant counterparty or currency type`
            : 'Filterable audit log with transaction hashes and cryptographic proofs'
        }
      />

      {/* Add Beneficiary Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#101a35]/65 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 border border-[#101a35]/8 shadow-xl">
            <h3 className="font-heading font-bold text-base text-[#101a35] mb-1">
              Add Corporate Beneficiary
            </h3>
            <p className="text-xs text-[#76767e] mb-4">
              Save counterparty banking details for one-click settlement
            </p>

            <form onSubmit={handleCreateBen} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="block font-bold text-[#101a35] mb-1 uppercase tracking-wider text-[10px]">
                  Recipient Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Arthur Pendelton"
                  value={newBenName}
                  onChange={(e) => setNewBenName(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-[#101a35]/12 text-[#101a35] focus:outline-none focus:border-[#477bff]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#101a35] mb-1 uppercase tracking-wider text-[10px]">
                  Organization / Entity
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cambridge Quantum Research"
                  value={newBenOrg}
                  onChange={(e) => setNewBenOrg(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-[#101a35]/12 text-[#101a35] focus:outline-none focus:border-[#477bff]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#101a35] mb-1 uppercase tracking-wider text-[10px]">
                  Account Number / IBAN
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 482019488319"
                  value={newBenAccount}
                  onChange={(e) => setNewBenAccount(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-[#101a35]/12 text-[#101a35] focus:outline-none focus:border-[#477bff]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#101a35] mb-1 uppercase tracking-wider text-[10px]">
                  Routing / Swift / Fedwire Code
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 021000021"
                  value={newBenRouting}
                  onChange={(e) => setNewBenRouting(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-[#101a35]/12 text-[#101a35] focus:outline-none focus:border-[#477bff]"
                />
              </div>

              <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-[#101a35]/8">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border border-[#101a35]/12 text-[#101a35] hover:bg-[#eceff8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#477bff] text-white font-bold hover:bg-[#386df2]"
                >
                  Save Beneficiary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
