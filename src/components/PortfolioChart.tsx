import React, { useState } from 'react';
import { TrendingUp, ArrowUpRight, Calendar, DollarSign } from 'lucide-react';
import { HISTORICAL_CHART_DATA } from '../data/mockData';

export const PortfolioChart: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y' | 'ALL'>('1Y');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // SVG coordinate calculations
  const width = 640;
  const height = 180;
  const paddingX = 20;
  const paddingY = 25;

  const data = HISTORICAL_CHART_DATA;
  const values = data.map((d) => d.value);
  const minVal = Math.min(...values) * 0.95;
  const maxVal = Math.max(...values) * 1.05;

  const getX = (index: number) => paddingX + (index / (data.length - 1)) * (width - paddingX * 2);
  const getY = (val: number) => height - paddingY - ((val - minVal) / (maxVal - minVal)) * (height - paddingY * 2);

  // Build SVG path
  const points = data.map((d, i) => `${getX(i)},${getY(d.value)}`);
  const linePath = `M ${points.join(' L ')}`;
  const areaPath = `${linePath} L ${getX(data.length - 1)},${height} L ${getX(0)},${height} Z`;

  const activeDataPoint = hoverIndex !== null ? data[hoverIndex] : data[data.length - 1];

  return (
    <div className="bg-white rounded-2xl border border-[#101a35]/8 p-6 shadow-[0px_2px_8px_rgba(16,26,53,0.04)] flex flex-col justify-between">
      {/* Chart Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#101a35]/6 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-[#76767e]">
              Treasury Capital Velocity & Inflow
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#16a879]/10 text-[#16a879]">
              <TrendingUp className="w-3 h-3" />
              +4.82% Annualized Yield
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[#101a35] tabular-nums">
              ${activeDataPoint.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-xs font-semibold text-[#76767e]">
              ({activeDataPoint.label} 2026 Snapshot)
            </span>
          </div>
        </div>

        {/* Timeframe Controls */}
        <div className="flex items-center gap-1 bg-[#f2f4f8] p-1 rounded-xl border border-[#101a35]/6 self-start sm:self-center">
          {(['1D', '1W', '1M', '1Y', 'ALL'] as const).map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                timeframe === tf
                  ? 'bg-white text-[#101a35] shadow-xs'
                  : 'text-[#76767e] hover:text-[#101a35]'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive SVG Chart */}
      <div className="relative mt-4 w-full h-[180px]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#477bff" stopOpacity="0.28" />
              <stop offset="70%" stopColor="#6847e8" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#6847e8" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines */}
          <line x1={paddingX} y1={getY(minVal + (maxVal - minVal) * 0.33)} x2={width - paddingX} y2={getY(minVal + (maxVal - minVal) * 0.33)} stroke="rgba(16, 26, 53, 0.05)" strokeDasharray="3 3" />
          <line x1={paddingX} y1={getY(minVal + (maxVal - minVal) * 0.66)} x2={width - paddingX} y2={getY(minVal + (maxVal - minVal) * 0.66)} stroke="rgba(16, 26, 53, 0.05)" strokeDasharray="3 3" />

          {/* Area fill */}
          <path d={areaPath} fill="url(#chartGradient)" />

          {/* Primary stroke line */}
          <path
            d={linePath}
            fill="none"
            stroke="#477bff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive Data Nodes */}
          {data.map((d, i) => {
            const cx = getX(i);
            const cy = getY(d.value);
            const isHovered = hoverIndex === i;

            return (
              <g key={i}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 6 : 3.5}
                  fill={isHovered ? '#101a35' : '#477bff'}
                  stroke="#ffffff"
                  strokeWidth={isHovered ? 2.5 : 1.5}
                  className="transition-all duration-150 cursor-pointer"
                />
                <rect
                  x={cx - 15}
                  y={0}
                  width={30}
                  height={height}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoverIndex(i)}
                  onMouseLeave={() => setHoverIndex(null)}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Chart Footer with Inflow vs Outflow */}
      <div className="pt-4 mt-2 border-t border-[#101a35]/6 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <span className="text-[#76767e] block text-[11px]">30-Day Liquidity Inflow</span>
          <span className="font-mono font-bold text-[#16a879] text-sm tabular-nums">
            +${activeDataPoint.inflow.toLocaleString()}
          </span>
        </div>
        <div>
          <span className="text-[#76767e] block text-[11px]">Operational Outflow</span>
          <span className="font-mono font-bold text-[#101a35] text-sm tabular-nums">
            -${activeDataPoint.outflow.toLocaleString()}
          </span>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <span className="text-[#76767e] block text-[11px]">Net Treasury Retention</span>
          <span className="font-mono font-bold text-[#477bff] text-sm tabular-nums">
            +${(activeDataPoint.inflow - activeDataPoint.outflow).toLocaleString()} (66.2%)
          </span>
        </div>
      </div>
    </div>
  );
};
