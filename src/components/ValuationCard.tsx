import React, { useState } from 'react';
import { ValuationResult, VehicleInputs } from '../types/car';
import { formatIndianCurrency, formatLakh } from '../utils/valuationEngine';
import { 
  TrendingUp, 
  Layers, 
  ChevronDown, 
  ChevronUp, 
  Scale, 
  BarChart3,
  Sparkles,
  Calendar,
  MapPin,
  Gauge,
  Fuel,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';

interface ValuationCardProps {
  inputs: VehicleInputs;
  valuation: ValuationResult;
  onOpenInDepth: () => void;
  onOpenCompare: () => void;
  uploadedPhotoUrl?: string | null;
}

export const ValuationCard: React.FC<ValuationCardProps> = ({
  inputs,
  valuation,
  onOpenInDepth,
  onOpenCompare,
}) => {
  const [showShap, setShowShap] = useState(false);

  const isPositiveCondition = valuation.exteriorDeltaInr >= 0;

  return (
    <section
      id="valuation"
      aria-label="Valuation Report"
      className="rounded-2xl bg-white dark:bg-[#11141b] border border-slate-200/90 dark:border-white/[0.08] shadow-lg shadow-black/5 dark:shadow-black/40 overflow-hidden transition-all"
    >
      {/* 1. VEHICLE HEADER */}
      <div className="p-6 sm:p-7 border-b border-slate-100 dark:border-white/[0.06] bg-slate-50/60 dark:bg-white/[0.02]">
        {/* Compact Metadata Chips with icons */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 mb-2.5">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white dark:bg-white/[0.05] border border-slate-200/80 dark:border-white/[0.06] font-mono">
            <Calendar className="w-3.5 h-3.5 text-[#c5a059] dark:text-[#dfb76c]" />
            {inputs.registrationYear}
          </span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white dark:bg-white/[0.05] border border-slate-200/80 dark:border-white/[0.06]">
            <Fuel className="w-3.5 h-3.5 text-[#c5a059] dark:text-[#dfb76c]" />
            {inputs.fuelType}
          </span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white dark:bg-white/[0.05] border border-slate-200/80 dark:border-white/[0.06]">
            <Zap className="w-3.5 h-3.5 text-[#c5a059] dark:text-[#dfb76c]" />
            {inputs.transmission}
          </span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white dark:bg-white/[0.05] border border-slate-200/80 dark:border-white/[0.06] font-mono">
            <Gauge className="w-3.5 h-3.5 text-[#c5a059] dark:text-[#dfb76c]" />
            {inputs.kilometersDriven.toLocaleString('en-IN')} km
          </span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white dark:bg-white/[0.05] border border-slate-200/80 dark:border-white/[0.06]">
            <MapPin className="w-3.5 h-3.5 text-[#c5a059] dark:text-[#dfb76c]" />
            {inputs.rtoLocation.split(' ')[0]}
          </span>
        </div>

        {/* Title and Liquidity Score */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {inputs.make} {inputs.model}{' '}
              <span className="text-[#c5a059] dark:text-[#dfb76c] font-bold">{inputs.variant}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
              <span>{inputs.generation}</span>
              <span>·</span>
              <span>{inputs.owners} Owner</span>
              <span>·</span>
              <span>{inputs.insuranceStatus}</span>
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium self-start sm:self-auto">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Demand: <strong className="font-bold">{valuation.resaleDemandScore}/10</strong> ({valuation.marketLiquidity})</span>
          </div>
        </div>
      </div>

      {/* 2. FAIR MARKET VALUE & SPECTRUM */}
      <div className="p-6 sm:p-7 space-y-6">
        {/* Main Price Block */}
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
            Estimated Resale Value
          </span>
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
              {formatIndianCurrency(valuation.fairMarketValueInr)}
            </span>
            <span className="text-xl sm:text-2xl font-bold text-[#c5a059] dark:text-[#dfb76c] font-mono">
              ({formatLakh(valuation.fairMarketValueInr)})
            </span>
          </div>
        </div>

        {/* 3-Tier Price Range Spectrum */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.06] space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Instant Buyout</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">Market Price Range</span>
            <span>Direct Buyer</span>
          </div>

          {/* Spectrum Bar */}
          <div className="relative h-2 rounded-full bg-slate-200 dark:bg-white/[0.08] overflow-hidden">
            <div
              className="absolute top-0 bottom-0 bg-gradient-to-r from-[#c5a059] to-[#dfb76c] rounded-full"
              style={{ left: '15%', right: '15%' }}
            />
          </div>

          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-600 dark:text-slate-400">
              {formatLakh(valuation.instantBuyoutRangeInr[0])}
            </span>
            <span className="font-bold text-[#c5a059] dark:text-[#dfb76c]">
              {formatLakh(valuation.fairMarketValueInr)} (Fair)
            </span>
            <span className="text-slate-600 dark:text-slate-400">
              {formatLakh(valuation.peerToPeerRangeInr[1])}
            </span>
          </div>
        </div>

        {/* Condition Adjustment */}
        <div
          className={`p-3.5 rounded-xl border flex items-start gap-3 transition-colors ${
            isPositiveCondition
              ? 'bg-amber-500/5 dark:bg-[#dfb76c]/10 border-amber-500/20 dark:border-[#dfb76c]/25 text-slate-800 dark:text-slate-200'
              : 'bg-rose-500/5 dark:bg-rose-500/10 border-rose-500/20 dark:border-rose-500/25 text-slate-800 dark:text-slate-200'
          }`}
        >
          <Sparkles
            className={`w-4 h-4 shrink-0 mt-0.5 ${
              isPositiveCondition ? 'text-[#c5a059] dark:text-[#dfb76c]' : 'text-rose-500'
            }`}
          />
          <div className="text-xs leading-relaxed">
            <span className="font-semibold text-slate-900 dark:text-white">
              {isPositiveCondition
                ? `+${formatIndianCurrency(valuation.exteriorDeltaInr)} condition bonus`
                : `-${formatIndianCurrency(Math.abs(valuation.exteriorDeltaInr))} wear adjustment`}
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {valuation.exteriorDeltaText}
            </p>
          </div>
        </div>

        {/* Selling Channels */}
        <div className="space-y-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            Recommended Selling Channels
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Direct Buyer */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-[#c5a059]/40 dark:border-[#dfb76c]/30 hover:border-[#dfb76c] transition-colors">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-900 dark:text-white">Direct Buyer (P2P)</span>
                <span className="text-[10px] font-semibold text-[#c5a059] dark:text-[#dfb76c] uppercase">
                  Best Value (+6–8%)
                </span>
              </div>
              <p className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                {formatIndianCurrency(valuation.peerToPeerRangeInr[0])} – {formatIndianCurrency(valuation.peerToPeerRangeInr[1])}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Highest payout on OLX or verified buyers (~{valuation.avgDaysToSell} days).
              </p>
            </div>

            {/* Instant Dealer Buyout */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.06] hover:border-slate-300 dark:hover:border-white/[0.12] transition-colors">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-900 dark:text-white">Dealer Buyout</span>
                <span className="text-[10px] text-slate-400 uppercase">Instant Cash</span>
              </div>
              <p className="text-lg font-bold text-slate-800 dark:text-slate-200 font-mono">
                {formatIndianCurrency(valuation.instantBuyoutRangeInr[0])} – {formatIndianCurrency(valuation.instantBuyoutRangeInr[1])}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                24-hr payment with doorstep pickup (Spinny, Cars24).
              </p>
            </div>
          </div>
        </div>

        {/* Quick Specs */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-slate-200/70 dark:border-white/[0.05]">
            <span className="text-[10px] text-slate-400 uppercase block font-medium">Engine</span>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 font-mono">
              {valuation.spec.displacementCc} cc
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-slate-200/70 dark:border-white/[0.05]">
            <span className="text-[10px] text-slate-400 uppercase block font-medium">Mileage</span>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 font-mono">
              {valuation.spec.realWorldFuelEconomy} km/l
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-slate-200/70 dark:border-white/[0.05]">
            <span className="text-[10px] text-slate-400 uppercase block font-medium">Safety</span>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              {valuation.spec.safetyRatingStars}★
            </span>
          </div>
        </div>

        {/* Valuation Drivers / Remarks */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/70 dark:border-white/[0.05] space-y-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
            Key Resale Factors
          </span>
          {valuation.modelRemarks.slice(0, 3).map((rem, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#c5a059] dark:text-[#dfb76c] shrink-0 mt-0.5" />
              <span>{rem}</span>
            </div>
          ))}
        </div>

        {/* Optional SHAP Breakdown Drawer */}
        <div className="border border-slate-200/80 dark:border-white/[0.06] rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setShowShap(!showShap)}
            className="w-full px-4 py-3 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-white/[0.02] transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-[#c5a059] dark:text-[#dfb76c]" />
              <span>Valuation Driver Breakdown</span>
            </span>
            <span className="flex items-center gap-1 text-slate-400 text-xs font-normal">
              {showShap ? 'Hide' : 'View'}
              {showShap ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </span>
          </button>

          {showShap && (
            <div className="p-4 border-t border-slate-200/80 dark:border-white/[0.06] space-y-2 bg-slate-50/40 dark:bg-white/[0.01]">
              {valuation.shapBreakdown.map((item, idx) => {
                const isPositive = item.impactInr >= 0;
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 dark:border-white/[0.04] last:border-b-0"
                  >
                    <div>
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {item.featureName}
                      </span>
                      <p className="text-[11px] text-slate-400">{item.description}</p>
                    </div>
                    <span
                      className={`font-mono font-bold text-xs shrink-0 ${
                        isPositive
                          ? 'text-[#c5a059] dark:text-[#dfb76c]'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {isPositive ? '+' : ''}{formatIndianCurrency(item.impactInr)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Action Toolbar: Clean 2-column Primary & Secondary Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={onOpenInDepth}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 dark:bg-[#dfb76c] hover:bg-slate-800 dark:hover:bg-[#c5a059] text-white dark:text-black font-semibold text-xs tracking-tight transition-all shadow-sm active:scale-[0.99] cursor-pointer"
          >
            <BarChart3 className="w-4 h-4 text-[#dfb76c] dark:text-black" />
            <span>In-depth Analysis</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
          </button>

          <button
            type="button"
            onClick={onOpenCompare}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.1] text-slate-800 dark:text-slate-200 font-semibold text-xs tracking-tight border border-slate-200/90 dark:border-white/[0.08] transition-all cursor-pointer"
          >
            <Scale className="w-4 h-4 text-[#c5a059] dark:text-[#dfb76c]" />
            <span>Compare Rivals</span>
          </button>
        </div>
      </div>
    </section>
  );
};
