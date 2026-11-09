import React, { useState } from 'react';
import { ShieldCheck, Key, Lock, Bell, Users, Check, Copy, AlertTriangle, Sparkles } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [dualAuthThreshold, setDualAuthThreshold] = useState<number>(10000);
  const [instantFedNowAlerts, setInstantFedNowAlerts] = useState(true);
  const [foreignSpendAlerts, setForeignSpendAlerts] = useState(true);
  const [apiKeyCopied, setApiKeyCopied] = useState(false);

  const mockApiKey = 'velo_live_sec_9941a80c9213be78f302910408c5';

  const handleCopyKey = () => {
    navigator.clipboard?.writeText(mockApiKey);
    setApiKeyCopied(true);
    setTimeout(() => setApiKeyCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-8 pb-16 max-w-4xl">
      <div>
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#101a35] tracking-tight">
          Institutional Security & Compliance
        </h1>
        <p className="text-xs text-[#76767e] mt-1">
          Configure dual-authorization thresholds, API access credentials, and clearing notifications
        </p>
      </div>

      {/* Dual Authorization Threshold Panel */}
      <div className="bg-white rounded-2xl border border-[#101a35]/8 p-6 shadow-xs">
        <div className="flex items-start justify-between pb-4 border-b border-[#101a35]/8">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#6847e8]" />
              <h2 className="font-heading font-bold text-base text-[#101a35]">
                Dual-Authorization Threshold Governance
              </h2>
            </div>
            <p className="text-xs text-[#76767e] mt-0.5">
              Outbound wires exceeding this limit require 2-person sign-off before network broadcast
            </p>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#6847e8]/10 text-[#6847e8]">
            Enforced
          </span>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-[#101a35] uppercase tracking-wider">
              Secondary Approval Threshold ($)
            </label>
            <span className="font-mono text-base font-bold text-[#101a35] tabular-nums">
              ${dualAuthThreshold.toLocaleString()}
            </span>
          </div>

          <input
            type="range"
            min="2500"
            max="50000"
            step="2500"
            value={dualAuthThreshold}
            onChange={(e) => setDualAuthThreshold(Number(e.target.value))}
            className="w-full accent-[#477bff] cursor-pointer"
          />

          <div className="flex justify-between text-[11px] text-[#76767e] mt-1">
            <span>$2,500 High-Strictness</span>
            <span>$50,000 Enterprise Loose</span>
          </div>
        </div>

        {/* Authorized Approvers */}
        <div className="mt-6 pt-4 border-t border-[#101a35]/6">
          <span className="text-xs font-bold text-[#101a35] uppercase tracking-wider block mb-3">
            Designated Corporate Approvers
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-[#f7f9fd] border border-[#101a35]/6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Marcus Aura"
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <span className="text-xs font-bold text-[#101a35] block">Marcus V. Aura</span>
                  <span className="text-[10px] text-[#76767e]">Primary Treasury Officer</span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#16a879]/10 text-[#16a879]">
                Active
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#f7f9fd] border border-[#101a35]/6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  alt="Elena Rostova"
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <span className="text-xs font-bold text-[#101a35] block">Elena Rostova</span>
                  <span className="text-[10px] text-[#76767e]">Chief Risk & Compliance</span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#16a879]/10 text-[#16a879]">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Programmatic API Keys & Webhooks */}
      <div className="bg-white rounded-2xl border border-[#101a35]/8 p-6 shadow-xs">
        <div className="flex items-start justify-between pb-4 border-b border-[#101a35]/8">
          <div>
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-[#477bff]" />
              <h2 className="font-heading font-bold text-base text-[#101a35]">
                Programmatic Treasury API Key
              </h2>
            </div>
            <p className="text-xs text-[#76767e] mt-0.5">
              Direct access for ERP reconciliation, payroll webhooks, and automated sweeps
            </p>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#16a879]/10 text-[#16a879]">
            Live Production
          </span>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <label className="text-xs font-bold text-[#101a35] uppercase tracking-wider">
            Secret Key (Bearer Token)
          </label>
          <div className="flex items-center gap-2 p-3 bg-[#f2f4f8] rounded-xl border border-[#101a35]/8">
            <span className="font-mono text-xs text-[#101a35] flex-1 truncate">
              {mockApiKey}
            </span>
            <button
              onClick={handleCopyKey}
              className="p-1.5 rounded-lg bg-white border border-[#101a35]/8 text-[#101a35] hover:bg-[#eceff8] text-xs font-semibold flex items-center gap-1 shadow-2xs"
            >
              {apiKeyCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{apiKeyCopied ? 'Copied' : 'Copy Key'}</span>
            </button>
          </div>
          <span className="text-[11px] text-[#76767e]">
            Never expose this secret key in client-side applications. IP restricted to authorized VPC subnets.
          </span>
        </div>
      </div>

      {/* Clearing & Settlement Notification Preferences */}
      <div className="bg-white rounded-2xl border border-[#101a35]/8 p-6 shadow-xs">
        <h2 className="font-heading font-bold text-base text-[#101a35] pb-4 border-b border-[#101a35]/8">
          Transactional Dispatch & Audit Alerts
        </h2>

        <div className="flex flex-col gap-4 mt-6">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="text-xs font-bold text-[#101a35] block">
                Instant FedNow & SEPA Inbound Confirmations
              </span>
              <span className="text-[11px] text-[#76767e]">
                Receive instant push & webhook notifications upon fund arrival
              </span>
            </div>
            <input
              type="checkbox"
              checked={instantFedNowAlerts}
              onChange={(e) => setInstantFedNowAlerts(e.target.checked)}
              className="w-5 h-5 rounded text-[#477bff] accent-[#477bff] cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer pt-3 border-t border-[#101a35]/6">
            <div>
              <span className="text-xs font-bold text-[#101a35] block">
                High-Volume Debit & Foreign Currency Alerts
              </span>
              <span className="text-[11px] text-[#76767e]">
                Immediate SMS notifications when transactions exceed $5,000
              </span>
            </div>
            <input
              type="checkbox"
              checked={foreignSpendAlerts}
              onChange={(e) => setForeignSpendAlerts(e.target.checked)}
              className="w-5 h-5 rounded text-[#477bff] accent-[#477bff] cursor-pointer"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
