import React, { useMemo, useState } from 'react';
import { 
  TrendingUp, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Download, 
  PieChart, 
  Calendar, 
  Sparkles, 
  ShieldCheck, 
  FileText,
  BarChart3,
  Activity
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { Transaction, CurrencyAccount } from '../types';

interface AnalyticsViewProps {
  transactions: Transaction[];
  accounts: CurrencyAccount[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ transactions, accounts }) => {
  const [activeMetric, setActiveMetric] = useState<'all' | 'net' | 'flows'>('all');
  const totalBalance = accounts.reduce((acc, curr) => acc + curr.usdEquivalent, 0);

  // Compute monthly cash flow trends based on transaction history and historical baselines
  const cashFlowData = useMemo(() => {
    const liveInflow = transactions
      .filter((tx) => tx.amount > 0)
      .reduce((sum, tx) => sum + tx.amount, 0);

    const liveOutflow = transactions
      .filter((tx) => tx.amount < 0)
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

    return [
      { month: 'Jun', inflow: 48000, outflow: 31000, net: 17000 },
      { month: 'Jul', inflow: 51000, outflow: 27000, net: 24000 },
      { month: 'Aug', inflow: 55000, outflow: 30000, net: 25000 },
      { month: 'Sep', inflow: 42000, outflow: 36000, net: 6000 },
      { month: 'Oct', inflow: 59000, outflow: 28000, net: 31000 },
      { 
        month: 'Nov (Live)', 
        inflow: Math.round(liveInflow), 
        outflow: Math.round(liveOutflow), 
        net: Math.round(liveInflow - liveOutflow) 
      },
    ];
  }, [transactions]);

  // Category aggregations
  const categories = [
    { name: 'Executive & Core Payroll', amount: 18500.00, color: 'bg-[#101a35]', pct: 54 },
    { name: 'Cloud & GPU Compute Infrastructure', amount: 3412.80, color: 'bg-[#477bff]', pct: 19 },
    { name: 'Real Estate & Safe-Haven Deposits', amount: 13666.25, color: 'bg-[#6847e8]', pct: 23 },
    { name: 'Enterprise SaaS & Tools', amount: 450.00, color: 'bg-[#16a879]', pct: 4 },
  ];

  const handleDownloadFullAudit = () => {
    const report = {
      reportType: "Veloce Institutional Treasury & Yield Audit",
      generatedAt: new Date().toISOString(),
      masterPortfolioBalanceUSD: totalBalance,
      accounts: accounts.map(a => ({
        currency: a.currency,
        balance: a.balance,
        usdEquivalent: a.usdEquivalent,
        apy: a.apy || 0
      })),
      recentTransactionsCount: transactions.length,
      complianceStatus: "PASSED_LEVEL_4_CLEARED",
      clearingRails: ["FedNow", "SEPA Instant", "SWIFT Priority", "ACH"],
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Veloce_Comprehensive_Treasury_Audit_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  // Custom Recharts Tooltip styled to Neo-Fintech Precision specs
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-[#101a35]/10 shadow-[0_8px_20px_rgba(16,26,53,0.12)] text-xs">
          <span className="font-heading font-bold text-xs text-[#101a35] block mb-2">{label}</span>
          <div className="space-y-1.5 font-mono tabular-nums">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5 text-[#45464d] text-[11px]">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                  {entry.name}:
                </span>
                <span className="font-bold text-[#101a35]">
                  ${entry.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#101a35] tracking-tight">
            Treasury Analytics & Yield Ledger
          </h1>
          <p className="text-xs text-[#76767e] mt-1">
            Real-time capital velocity, category distributions, and compound yield trajectories
          </p>
        </div>

        <button
          onClick={handleDownloadFullAudit}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#101a35] hover:bg-[#1b2b54] text-white text-xs font-bold shadow-sm transition-all active:scale-[0.98] self-start"
        >
          <FileText className="w-4 h-4 text-[#477bff]" />
          <span>Export Full Audit Report</span>
        </button>
      </div>

      {/* Top 3 High-Velocity KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-[#101a35]/8 p-6 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#76767e]">
            <span>Net Monthly Inflow</span>
            <ArrowDownLeft className="w-4 h-4 text-[#16a879]" />
          </div>
          <span className="font-mono text-3xl font-extrabold text-[#16a879] mt-2 block tabular-nums">
            +$68,000.00
          </span>
          <span className="text-[11px] text-[#76767e] mt-1 block">
            Series B tranches & enterprise billing
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-[#101a35]/8 p-6 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#76767e]">
            <span>Operational Burn Rate</span>
            <ArrowUpRight className="w-4 h-4 text-[#101a35]" />
          </div>
          <span className="font-mono text-3xl font-extrabold text-[#101a35] mt-2 block tabular-nums">
            -$23,412.80
          </span>
          <span className="text-[11px] text-[#16a879] font-medium mt-1 block">
            Runway exceeds 48 months
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-[#101a35]/8 p-6 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#76767e]">
            <span>Cumulative Yield Credited</span>
            <Sparkles className="w-4 h-4 text-[#6847e8]" />
          </div>
          <span className="font-mono text-3xl font-extrabold text-[#6847e8] mt-2 block tabular-nums">
            +$4,821.90
          </span>
          <span className="text-[11px] text-[#76767e] mt-1 block">
            Annualized 4.85% APY compounding
          </span>
        </div>
      </div>

      {/* Monthly Cash Flow Trends: Recharts Line Chart */}
      <div className="bg-white rounded-2xl border border-[#101a35]/8 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#101a35]/6 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#477bff]" />
              <h2 className="font-heading font-bold text-base text-[#101a35]">
                Monthly Cash Flow Trends
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#16a879]/10 text-[#16a879]">
                Live Recharts Engine
              </span>
            </div>
            <p className="text-xs text-[#76767e] mt-0.5">
              Historical performance and live ledger settlement telemetry
            </p>
          </div>

          {/* Metric View Controls */}
          <div className="flex items-center gap-1 bg-[#f2f4f8] p-1 rounded-xl border border-[#101a35]/6 self-start sm:self-center">
            {[
              { id: 'all', label: 'All Curves' },
              { id: 'flows', label: 'Inflow vs Outflow' },
              { id: 'net', label: 'Net Cash Flow' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveMetric(tab.id as any)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeMetric === tab.id
                    ? 'bg-white text-[#101a35] shadow-xs'
                    : 'text-[#76767e] hover:text-[#101a35]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recharts LineChart Container */}
        <div className="h-[280px] w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cashFlowData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="rgba(16, 26, 53, 0.06)" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="month"
                stroke="#76767e"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: 'rgba(16, 26, 53, 0.1)' }}
              />
              <YAxis
                stroke="#76767e"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', fontWeight: 600 }}
              />

              {(activeMetric === 'all' || activeMetric === 'flows') && (
                <Line
                  type="monotone"
                  dataKey="inflow"
                  name="Inflow"
                  stroke="#16a879"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#16a879', stroke: '#ffffff', strokeWidth: 1.5 }}
                  activeDot={{ r: 5, stroke: '#16a879', strokeWidth: 2 }}
                />
              )}

              {(activeMetric === 'all' || activeMetric === 'flows') && (
                <Line
                  type="monotone"
                  dataKey="outflow"
                  name="Outflow"
                  stroke="#101a35"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#101a35', stroke: '#ffffff', strokeWidth: 1.5 }}
                  activeDot={{ r: 5, stroke: '#101a35', strokeWidth: 2 }}
                />
              )}

              {(activeMetric === 'all' || activeMetric === 'net') && (
                <Line
                  type="monotone"
                  dataKey="net"
                  name="Net Cash Flow"
                  stroke="#477bff"
                  strokeWidth={2.5}
                  strokeDasharray={activeMetric === 'all' ? '4 4' : undefined}
                  dot={{ r: 3.5, fill: '#477bff', stroke: '#ffffff', strokeWidth: 1.5 }}
                  activeDot={{ r: 5.5, stroke: '#477bff', strokeWidth: 2 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Legend Summary Details */}
        <div className="pt-3 mt-1 border-t border-[#101a35]/6 flex flex-wrap items-center justify-between text-xs text-[#76767e] gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#16a879]" />
              <span>Inflow</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#101a35]" />
              <span>Outflow</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#477bff]" />
              <span>Net Retention</span>
            </span>
          </div>

          <span className="font-mono text-[11px] text-[#101a35]">
            Dynamic Live Ledger Integration: <strong>{transactions.length} records processed</strong>
          </span>
        </div>
      </div>

      {/* Category Breakdown & Spend Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#101a35]/8 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#101a35]/8">
              <div>
                <h2 className="font-heading font-bold text-base text-[#101a35]">
                  Capital Allocation by Expense Category
                </h2>
                <p className="text-xs text-[#76767e]">
                  Distribution of monthly disbursements across operational cost centers
                </p>
              </div>
              <BarChart3 className="w-5 h-5 text-[#477bff]" />
            </div>

            {/* Segmented Bar visual */}
            <div className="w-full h-4 bg-[#eceff8] rounded-full overflow-hidden flex mt-6">
              {categories.map((cat, i) => (
                <div
                  key={i}
                  className={`h-full ${cat.color}`}
                  style={{ width: `${cat.pct}%` }}
                  title={`${cat.name}: ${cat.pct}%`}
                />
              ))}
            </div>

            {/* Detailed Categories List */}
            <div className="flex flex-col gap-4 mt-6">
              {categories.map((cat, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-3 h-3 rounded-full ${cat.color}`} />
                    <span className="font-semibold text-[#101a35]">{cat.name}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-[#76767e] font-mono">{cat.pct}%</span>
                    <span className="font-mono font-bold text-[#101a35] tabular-nums w-24 text-right">
                      ${cat.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-[#101a35]/8 flex items-center justify-between text-xs text-[#76767e]">
            <span>Automated AI expense categorisation</span>
            <span className="font-bold text-[#16a879]">100% Tax Compliant</span>
          </div>
        </div>

        {/* Treasury Reserve Health Card (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#101a35]/8 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-5 h-5 text-[#16a879]" />
              <h2 className="font-heading font-bold text-base text-[#101a35]">
                Basel III Liquidity Coverage
              </h2>
            </div>
            <p className="text-xs text-[#76767e]">
              Institutional capital adequacy and stress test parameters
            </p>

            <div className="mt-6 space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-[#f7f9fd] border border-[#101a35]/8">
                <span className="text-[#76767e] block">Liquidity Coverage Ratio (LCR)</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="font-mono text-2xl font-bold text-[#101a35]">342%</span>
                  <span className="text-xs font-semibold text-[#16a879]">Minimum: 100%</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#f7f9fd] border border-[#101a35]/8">
                <span className="text-[#76767e] block">Multi-Currency FX Value-at-Risk (VaR 99%)</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="font-mono text-2xl font-bold text-[#101a35]">0.18%</span>
                  <span className="text-xs font-semibold text-[#16a879]">Extreme Low Risk</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#f7f9fd] border border-[#101a35]/8">
                <span className="text-[#76767e] block">FDIC Sweep Syndicate Protection</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="font-mono text-xl font-bold text-[#101a35]">$25,000,000.00</span>
                  <span className="text-xs font-semibold text-[#6847e8]">Active</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#101a35]/8 flex items-center justify-between text-xs text-[#76767e]">
            <span>Audited quarterly by PwC LLP</span>
            <span className="font-mono font-semibold text-[#101a35]">SOC-2 Type II</span>
          </div>
        </div>
      </div>
    </div>
  );
};
