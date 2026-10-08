import React, { useState } from 'react';
import { 
  ValuationResult, 
  VehicleInputs, 
  ComparisonVehicle 
} from '../types/car';
import { getComparisonAlternatives, formatIndianCurrency } from '../utils/valuationEngine';
import { 
  X, 
  Scale, 
  Check, 
  Shield, 
  Fuel, 
  Zap, 
  TrendingUp, 
  Wrench, 
  ChevronRight,
  ArrowRightLeft
} from 'lucide-react';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputs: VehicleInputs;
  valuation: ValuationResult;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  inputs,
  valuation,
}) => {
  const alternatives = getComparisonAlternatives(inputs, valuation);
  const [selectedAlt, setSelectedAlt] = useState<ComparisonVehicle>(alternatives[0]);
  const [filterType, setFilterType] = useState<'all' | 'rivals' | 'budget'>('all');

  if (!isOpen) return null;

  const currentRunningCost = +((95 / valuation.spec.realWorldFuelEconomy).toFixed(1));

  const filtered = alternatives.filter(a => {
    if (filterType === 'rivals') return a.isDirectRival;
    if (filterType === 'budget') return !a.isDirectRival;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div 
        className="w-full max-w-5xl bg-white dark:bg-[#11141b] border border-slate-200 dark:border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-slate-900 dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between bg-slate-50 dark:bg-white/[0.02]">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>Cross-Shopping Engine</span>
              <span>·</span>
              <span className="text-[#c5a059] dark:text-[#dfb76c] font-semibold">Market Alternatives</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#c5a059] dark:text-[#dfb76c]" />
              <span>Direct Rivals & Alternative Choices</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Filter segment */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-white/[0.06] pb-4">
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-white/[0.04] rounded-xl border border-slate-200 dark:border-white/[0.06]">
              <button
                type="button"
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  filterType === 'all' ? 'bg-white dark:bg-[#0c0e14] text-slate-900 dark:text-white shadow-xs font-semibold' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All ({alternatives.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterType('rivals')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  filterType === 'rivals' ? 'bg-white dark:bg-[#0c0e14] text-slate-900 dark:text-white shadow-xs font-semibold' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Segment Rivals ({alternatives.filter(a => a.isDirectRival).length})
              </button>
              <button
                type="button"
                onClick={() => setFilterType('budget')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  filterType === 'budget' ? 'bg-white dark:bg-[#0c0e14] text-slate-900 dark:text-white shadow-xs font-semibold' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Budget Equivalents ({alternatives.filter(a => !a.isDirectRival).length})
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select a vehicle for side-by-side analysis:
            </p>
          </div>

          {/* Horizontal Alternatives Carousel / Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {filtered.map((item) => {
              const isSelected = selectedAlt.id === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedAlt(item)}
                  className={`text-left p-3.5 rounded-xl border transition-all relative ${
                    isSelected 
                      ? 'bg-slate-50 dark:bg-slate-800/90 border-emerald-500 shadow-sm ring-1 ring-emerald-500/40' 
                      : 'bg-white dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                    <span className="font-mono">{item.yearBracket}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                      item.isDirectRival
                        ? 'bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300'
                        : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                    }`}>
                      {item.isDirectRival ? 'Segment Rival' : 'Budget Trade'}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                    {item.name}
                  </h4>
                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 font-mono mt-1">
                    ₹{item.estimatedResaleLakh} Lakh
                  </p>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5 leading-tight">
                    {item.rationale}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Side-by-Side Dual Comparison Matrix */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 overflow-hidden space-y-4 p-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Head-to-Head Detailed Comparison Matrix</span>
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Comparing Your Vehicle vs Selected Alternative
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                    <th className="py-2.5 px-3 w-1/3">Evaluation Metric</th>
                    <th className="py-2.5 px-3 w-1/3 text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/20">
                      Your Vehicle ({inputs.make} {inputs.model})
                    </th>
                    <th className="py-2.5 px-3 w-1/3 text-sky-700 dark:text-sky-300 font-bold bg-sky-50 dark:bg-sky-950/20">
                      {selectedAlt.name}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
                  <tr>
                    <td className="py-2.5 px-3 font-medium">Estimated Secondary Value</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      {formatIndianCurrency(valuation.fairMarketValueInr)}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-sky-700 dark:text-sky-300">
                      ₹{selectedAlt.estimatedResaleLakh} Lakh
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium">Engine Output / Performance</td>
                    <td className="py-2.5 px-3 font-mono">{valuation.spec.peakPowerBhp} bhp · {valuation.spec.displacementCc} cc</td>
                    <td className="py-2.5 px-3 font-mono">{selectedAlt.engineOutput}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium">Fuel Economy (Real World)</td>
                    <td className="py-2.5 px-3 font-mono">{valuation.spec.realWorldFuelEconomy} km/l</td>
                    <td className="py-2.5 px-3 font-mono">{selectedAlt.realWorldMileage}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium">Running Cost / km</td>
                    <td className="py-2.5 px-3 font-mono">₹{currentRunningCost} / km</td>
                    <td className="py-2.5 px-3 font-mono">₹{selectedAlt.runningCostPerKmInr} / km</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium">Safety Score & Airbags</td>
                    <td className="py-2.5 px-3 font-mono">{valuation.spec.safetyRatingStars} ★ ({valuation.spec.safetyAgency})</td>
                    <td className="py-2.5 px-3 font-mono">{selectedAlt.safetyScore} ({selectedAlt.airbagCount} airbags)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium">3-Year Resale Value Retention</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-700 dark:text-emerald-400">~{valuation.resaleDemandScore * 9}%</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-sky-700 dark:text-sky-300">~{selectedAlt.resaleRetentionScore3Yr}%</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium">Key Features & Highlights</td>
                    <td className="py-2.5 px-3 font-mono text-[11px]">{inputs.variant} Trim Equipment</td>
                    <td className="py-2.5 px-3 font-mono text-[11px]">{selectedAlt.keyFeatures.slice(0, 2).join(' · ')}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Pros and Cons Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-200 dark:border-slate-800">
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> Why Choose Your Current Vehicle:
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Proven reliability baseline, established service network in India, verified history with known mechanical pedigree.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <span className="text-xs font-semibold text-sky-700 dark:text-sky-300 flex items-center gap-1.5">
                  <ChevronRight className="w-4 h-4" /> Why Cross-Shop {selectedAlt.name}:
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {selectedAlt.rationale}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
