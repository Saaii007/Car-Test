import React from 'react';
import { X, ShieldAlert, MapPin, AlertTriangle } from 'lucide-react';
import { RTO_LIST } from '../data/rtoDatabase';

interface RegulatoryGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegulatoryGuideModal: React.FC<RegulatoryGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
      <div 
        className="w-full max-w-3xl bg-white dark:bg-[#11141b] border border-slate-200 dark:border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col text-slate-900 dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between bg-slate-50 dark:bg-white/[0.02]">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white">
            <ShieldAlert className="w-5 h-5 text-[#dfb76c]" />
            <h3 className="text-base font-bold">Indian Secondary Auto Regulations & RTO Road Tax Guide</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-600 dark:text-slate-300">
          {/* NGT Rule Card */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-semibold text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
              <span>National Green Tribunal (NGT) 10-Year Diesel / 15-Year Petrol Rule</span>
            </div>
            <p className="leading-relaxed">
              In the National Capital Region (NCR encompassing Delhi, Gurugram, Noida, Ghaziabad, Faridabad), diesel vehicles older than 10 years and petrol vehicles older than 15 years cannot legally ply on public roads or undergo fitness re-registration.
            </p>
            <p className="text-slate-700 dark:text-slate-400">
              <strong>Impact on Valuation:</strong> Diesel vehicles approaching 7–8 years in Delhi face a steep 30–45% price markdown locally. However, obtaining a No Objection Certificate (NOC) to transfer registration to states like Rajasthan, Punjab, Uttar Pradesh (non-NCR), or Kerala recovers up to 20% higher realized cash.
            </p>
          </div>

          {/* Road Tax Multipliers Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#dfb76c]" />
              <span>State Lifetime Road Tax Multiplier Benchmark</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {RTO_LIST.slice(0, 10).map((r, i) => (
                <div key={i} className="p-3 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block">{r.code} ({r.state})</span>
                    <span className="text-[11px] text-slate-400">{r.name}</span>
                  </div>
                  <span className={`font-mono font-bold text-xs ${
                    r.roadTaxMultiplier > 1.05 ? 'text-amber-500' : 'text-[#dfb76c]'
                  }`}>
                    {r.roadTaxMultiplier > 1 ? `+${Math.round((r.roadTaxMultiplier - 1) * 100)}%` : 'Base (0%)'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
