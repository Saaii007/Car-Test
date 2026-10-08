import React, { useState } from 'react';
import { 
  ValuationResult, 
  VehicleInputs, 
  DepreciationPoint 
} from '../types/car';
import { formatIndianCurrency } from '../utils/valuationEngine';
import { 
  X, 
  Gauge, 
  Zap, 
  Shield, 
  Fuel, 
  Wrench, 
  MapPin, 
  CheckCircle2, 
  Calendar,
  Layers
} from 'lucide-react';

interface InDepthAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputs: VehicleInputs;
  valuation: ValuationResult;
}

export const InDepthAnalysisModal: React.FC<InDepthAnalysisModalProps> = ({
  isOpen,
  onClose,
  inputs,
  valuation,
}) => {
  const [activeTab, setActiveTab] = useState<'depreciation' | 'tco' | 'risks' | 'arbitrage'>('depreciation');
  const [hoveredPoint, setHoveredPoint] = useState<DepreciationPoint | null>(null);

  if (!isOpen) return null;

  const spec = valuation.spec;
  const curve = valuation.depreciationCurve;

  // Chart Dimensions
  const chartWidth = 720;
  const chartHeight = 260;
  const paddingX = 45;
  const paddingY = 30;

  const maxVal = Math.max(...curve.map(c => c.marketValueLakh), spec.originalExShowroomLakh) * 1.05;
  const minVal = Math.min(...curve.map(c => c.marketValueLakh)) * 0.7;

  // Coordinate mapping
  const getX = (idx: number) => paddingX + (idx / (curve.length - 1)) * (chartWidth - 2 * paddingX);
  const getY = (val: number) => {
    const ratio = (val - minVal) / (maxVal - minVal || 1);
    return chartHeight - paddingY - ratio * (chartHeight - 2 * paddingY);
  };

  // Split curve into historic (<= CURRENT_YEAR) and projected (> CURRENT_YEAR)
  const currentYearIdx = curve.findIndex(c => c.calendarYear === 2026);
  const historicPoints = currentYearIdx >= 0 ? curve.slice(0, currentYearIdx + 1) : curve;
  const projectedPoints = currentYearIdx >= 0 ? curve.slice(currentYearIdx) : [];

  const historicPath = historicPoints.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(pt.marketValueLakh)}`).join(' ');
  const projectedPath = projectedPoints.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(currentYearIdx + i)} ${getY(pt.marketValueLakh)}`).join(' ');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
      <div 
        className="w-full max-w-5xl bg-white dark:bg-[#11141b] border border-slate-200 dark:border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-slate-900 dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between bg-slate-50 dark:bg-white/[0.02]">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>{inputs.registrationYear} {inputs.make} {inputs.model} {inputs.variant}</span>
              <span>·</span>
              <span className="text-[#c5a059] dark:text-[#dfb76c] font-semibold">Valuation Intelligence</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Depreciation Projections & Technical Specs
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-8 flex-1">
          {/* Section 1: Vehicle Identity & Key Technical Specifications Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-[#c5a059] dark:text-[#dfb76c]" />
              <span>1. Technical Specifications</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06]">
                <span className="text-[11px] text-slate-400 block mb-0.5">Displacement</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">{spec.displacementCc} cc</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06]">
                <span className="text-[11px] text-slate-400 block mb-0.5">Power & Torque</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">{spec.peakPowerBhp} bhp · {spec.peakTorqueNm} Nm</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06]">
                <span className="text-[11px] text-slate-400 block mb-0.5">Real Mileage</span>
                <span className="text-sm font-bold text-[#c5a059] dark:text-[#dfb76c] font-mono">{spec.realWorldFuelEconomy} km/l</span>
                <span className="text-[10px] text-slate-400 block">ARAI: {spec.araiFuelEconomy}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06]">
                <span className="text-[11px] text-slate-400 block mb-0.5">Boot Capacity</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">{spec.bootCapacityLiters} Liters</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06]">
                <span className="text-[11px] text-slate-400 block mb-0.5">Drivetrain</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">{spec.drivetrain}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06]">
                <span className="text-[11px] text-slate-400 block mb-0.5">Safety Rating</span>
                <span className="text-sm font-bold text-amber-500 flex items-center gap-1 font-mono">
                  {spec.safetyRatingStars} ★
                  <span className="text-[10px] text-slate-400 font-normal">{spec.safetyAgency}</span>
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06]">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5">Original MSRP</span>
                <span className="text-sm font-bold text-slate-900 dark:text-slate-200 font-mono">₹{spec.originalExShowroomLakh} Lakh</span>
              </div>
            </div>
          </div>

          {/* Section 2: Tab Navigation for Analysis Engines */}
          <div>
            <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-medium space-x-1">
              <button
                onClick={() => setActiveTab('depreciation')}
                className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'depreciation'
                    ? 'border-[#dfb76c] text-[#c5a059] dark:text-[#dfb76c] font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                Depreciation & Future Projection Curve
              </button>
              <button
                onClick={() => setActiveTab('tco')}
                className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'tco'
                    ? 'border-[#dfb76c] text-[#c5a059] dark:text-[#dfb76c] font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                5-Year Total Cost of Ownership (TCO)
              </button>
              <button
                onClick={() => setActiveTab('risks')}
                className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'risks'
                    ? 'border-[#dfb76c] text-[#c5a059] dark:text-[#dfb76c] font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                Component Failure Risk Matrix
              </button>
              <button
                onClick={() => setActiveTab('arbitrage')}
                className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'arbitrage'
                    ? 'border-[#dfb76c] text-[#c5a059] dark:text-[#dfb76c] font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                State Arbitrage & Inter-State Resale
              </button>
            </div>
          </div>

          {/* Tab 1: Interactive Depreciation & Predictive Curve */}
          {activeTab === 'depreciation' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
                <p>
                  Interactive timeline tracking vehicle value from purchase ({inputs.registrationYear}) to 5 years future ({2026 + 5}).
                </p>
                <div className="flex items-center gap-4 text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-[#dfb76c] inline-block" />
                    <span>Historical Trend</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 border-b border-dashed border-[#dfb76c] inline-block" />
                    <span>Projected Curve</span>
                  </span>
                </div>
              </div>

              {/* Responsive SVG Chart */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 relative">
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto overflow-visible select-none">
                  {[0.25, 0.5, 0.75].map((ratio) => {
                    const y = paddingY + ratio * (chartHeight - 2 * paddingY);
                    const labelVal = (maxVal - ratio * (maxVal - minVal)).toFixed(1);
                    return (
                      <g key={ratio}>
                        <line x1={paddingX} y1={y} x2={chartWidth - paddingX} y2={y} stroke="#94a3b8" strokeOpacity="0.3" strokeDasharray="3 3" />
                        <text x={paddingX - 8} y={y + 3} fill="#64748b" fontSize="9" textAnchor="end" fontFamily="monospace">
                          ₹{labelVal}L
                        </text>
                      </g>
                    );
                  })}

                  <path d={historicPath} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
                  {projectedPath && (
                    <path d={projectedPath} fill="none" stroke="#10b981" strokeWidth="2.5" strokeDasharray="4 4" strokeLinecap="round" />
                  )}

                  {curve.map((pt, idx) => {
                    const cx = getX(idx);
                    const cy = getY(pt.marketValueLakh);
                    const isHovered = hoveredPoint?.calendarYear === pt.calendarYear;
                    const isPresent = pt.calendarYear === 2026;

                    return (
                      <g 
                        key={pt.calendarYear}
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredPoint(pt)}
                      >
                        {isHovered && (
                          <line x1={cx} y1={paddingY} x2={cx} y2={chartHeight - paddingY} stroke="#0ea5e9" strokeWidth="1" strokeDasharray="2 2" />
                        )}

                        {pt.annotation && (
                          <g transform={`translate(${cx}, ${cy - 16})`}>
                            <rect x="-6" y="-12" width="12" height="12" rx="3" fill="#f59e0b" />
                            <text x="0" y="-3" textAnchor="middle" fill="#000" fontSize="8" fontWeight="bold">!</text>
                          </g>
                        )}

                        <circle
                          cx={cx}
                          cy={cy}
                          r={isPresent ? 5.5 : isHovered ? 5 : 3.5}
                          fill={isPresent ? '#0ea5e9' : pt.isProjected ? '#64748b' : '#10b981'}
                          stroke={isPresent ? '#fff' : '#10b981'}
                          strokeWidth={pt.isProjected ? 2 : 1.5}
                        />

                        <text
                          x={cx}
                          y={chartHeight - 8}
                          fill={isPresent ? '#0ea5e9' : '#64748b'}
                          fontSize="10"
                          textAnchor="middle"
                          fontFamily="monospace"
                          fontWeight={isPresent ? 'bold' : 'normal'}
                        >
                          '{pt.calendarYear.toString().slice(-2)}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {hoveredPoint ? (
                  <div className="mt-4 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-slate-100 font-mono text-sm">
                          Year {hoveredPoint.calendarYear} {hoveredPoint.isProjected ? '(Projected)' : ''}
                        </span>
                        <span className="text-slate-400">·</span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-mono font-semibold">
                          ₹{hoveredPoint.marketValueLakh} Lakh ({formatIndianCurrency(hoveredPoint.marketValueLakh * 100000)})
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        YoY Value Change: {hoveredPoint.yoyDepreciationPercent}%
                      </p>
                    </div>

                    {hoveredPoint.annotation && (
                      <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-500/40 text-amber-800 dark:text-amber-300 text-[11px] max-w-md">
                        <span className="font-semibold">{hoveredPoint.annotation.title}: </span>
                        <span>{hoveredPoint.annotation.description}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500 text-center mt-2 italic">
                    Hover over any year node on the curve to inspect valuation, YoY depreciation rate, and regulatory annotations.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: 5-Year TCO */}
          {activeTab === 'tco' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">5-Year Cumulative Running & Upkeep Projection</span>
                    <span className="text-2xl font-bold font-mono text-emerald-700 dark:text-emerald-300">
                      {formatIndianCurrency(valuation.tco.total5Yr)}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 text-right">
                    <span>Assumes 12,000 km/yr @ current fuel tariffs</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                      <span className="flex items-center gap-1.5"><Fuel className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Fuel Expenses</span>
                    </div>
                    <span className="text-lg font-bold text-slate-900 dark:text-slate-100 font-mono">
                      {formatIndianCurrency(valuation.tco.fuelCost5Yr)}
                    </span>
                    <p className="text-[10px] text-slate-500 mt-1">Based on {spec.realWorldFuelEconomy} km/l real-world economy</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                      <span className="flex items-center gap-1.5"><Wrench className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" /> Periodic Service</span>
                    </div>
                    <span className="text-lg font-bold text-slate-900 dark:text-slate-100 font-mono">
                      {formatIndianCurrency(valuation.tco.pmsMaintenanceCost5Yr)}
                    </span>
                    <p className="text-[10px] text-slate-500 mt-1">5 annual dealer scheduled maintenance cycles</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                      <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Insurance</span>
                    </div>
                    <span className="text-lg font-bold text-slate-900 dark:text-slate-100 font-mono">
                      {formatIndianCurrency(valuation.tco.insuranceRenewals5Yr)}
                    </span>
                    <p className="text-[10px] text-slate-500 mt-1">5-year renewals on declining IDV</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                      <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> Wear Parts</span>
                    </div>
                    <span className="text-lg font-bold text-slate-900 dark:text-slate-100 font-mono">
                      {formatIndianCurrency(valuation.tco.wearAndTearCost5Yr)}
                    </span>
                    <p className="text-[10px] text-slate-500 mt-1">Tyres, 12V battery, and brake pads</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Component Failure Risks */}
          {activeTab === 'risks' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Known generation-specific hardware failure vulnerabilities identified by Indian master technicians:
              </p>

              <div className="space-y-3">
                {valuation.failureRisks.map((risk, idx) => {
                  const badgeColor = {
                    'Critical': 'bg-rose-100 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800',
                    'High': 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900',
                    'Moderate': 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900',
                    'Low': 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900',
                  }[risk.riskLevel];

                  return (
                    <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${badgeColor}`}>
                            {risk.riskLevel} Risk
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-200">
                            {risk.component}
                          </h4>
                          <span className="text-xs text-slate-500 font-mono">({risk.system})</span>
                        </div>
                        <span className="text-xs font-mono text-slate-600 dark:text-slate-300">
                          Typical Repair: <strong className="text-rose-600 dark:text-rose-400">{formatIndianCurrency(risk.typicalRepairCostInr)}</strong>
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                        <p><strong className="text-slate-800 dark:text-slate-300">Failure Window: </strong>{risk.avgFailureKmRange}</p>
                        <p className="leading-relaxed"><strong className="text-slate-800 dark:text-slate-300">Symptoms & Remedy: </strong>{risk.symptomsAndRemedy}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 4: State Arbitrage */}
          {activeTab === 'arbitrage' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Resale value varies significantly by state road taxes and regulatory limits. Exporting via RTO NOC can yield substantial cash premiums:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {valuation.stateArbitrage.map((arb, idx) => {
                  const isPositive = arb.deltaPercentVsCurrent > 0;
                  return (
                    <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{arb.stateName}</h4>
                        </div>
                        <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                          isPositive ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                        }`}>
                          {isPositive ? '+' : ''}{arb.deltaPercentVsCurrent}% vs Current
                        </span>
                      </div>

                      <div className="flex items-baseline justify-between border-b border-slate-200 dark:border-slate-800/80 pb-2">
                        <span className="text-xs text-slate-500">Realizable Pre-Owned Value</span>
                        <span className="text-base font-bold font-mono text-emerald-700 dark:text-emerald-300">
                          {formatIndianCurrency(arb.projectedRealizedValueInr)}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {arb.marketDriverReason}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-medium text-xs rounded-xl transition-colors"
          >
            Close Analysis
          </button>
        </div>
      </div>
    </div>
  );
};
