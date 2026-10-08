import React, { useState } from 'react';
import { 
  VehicleInputs, 
  ValuationResult 
} from './types/car';
import { calculateValuation } from './utils/valuationEngine';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/Header';
import { ManualForm } from './components/ManualForm';
import { VisionUploader } from './components/VisionUploader';
import { NlpInput } from './components/NlpInput';
import { ValuationCard } from './components/ValuationCard';
import { InDepthAnalysisModal } from './components/InDepthAnalysisModal';
import { CompareModal } from './components/CompareModal';
import { RegulatoryGuideModal } from './components/RegulatoryGuideModal';
import { CAR_DATABASE } from './data/carDatabase';
import { 
  FileText, 
  Camera, 
  MessageSquareText, 
  CheckCircle2, 
  Car,
  ShieldCheck,
  TrendingUp,
  MapPin,
  SlidersHorizontal,
  Sparkles
} from 'lucide-react';

const INITIAL_VEHICLE: VehicleInputs = {
  make: 'Maruti Suzuki',
  model: 'Swift',
  generation: '3rd Gen Facelift (2021 – 2024)',
  variant: 'ZXi+',
  registrationYear: 2021,
  fuelType: 'Petrol',
  transmission: 'Manual',
  kilometersDriven: 32000,
  rtoLocation: 'DL-01 (North Delhi / Mall Road)',
  owners: '1st',
  insuranceStatus: 'Zero Depreciation',
  serviceHistory: 'Authorized Dealer Full History',
  accidentalHistory: 'Clean',
  tireConditionPercent: 80,
  batteryHealthPercent: 90,
  damageReport: {
    severity: 'None',
    affectedPanels: [],
    scratchDepth: 'None',
    repaintedPanelsCount: 0,
    estimatedRepairCostInr: 0,
    damageDeductionInr: 0,
    maintenanceConditionText: '+ ₹12,000 for showroom exterior condition (flawless original paint & zero panel damage)',
    maintenanceConditionDeltaInr: 12000,
  },
};

const POPULAR_PRESETS = [
  { make: 'Maruti Suzuki', model: 'Swift', label: 'Swift' },
  { make: 'Hyundai', model: 'Creta', label: 'Creta' },
  { make: 'Honda', model: 'City', label: 'City' },
  { make: 'Mahindra', model: 'Thar', label: 'Thar' },
  { make: 'Toyota', model: 'Innova Crysta', label: 'Innova' },
  { make: 'Tata', model: 'Nexon', label: 'Nexon' },
  { make: 'Kia', model: 'Seltos', label: 'Seltos' },
  { make: 'Mahindra', model: 'Scorpio-N', label: 'Scorpio-N' },
];

function MainApp() {
  const [vehicleInputs, setVehicleInputs] = useState<VehicleInputs>(INITIAL_VEHICLE);
  const [valuationResult, setValuationResult] = useState<ValuationResult>(() => calculateValuation(INITIAL_VEHICLE));
  const [isCalculating, setIsCalculating] = useState(false);
  
  // Ingestion Mode tab: 'manual' | 'vision' | 'nlp'
  const [ingestionMode, setIngestionMode] = useState<'manual' | 'vision' | 'nlp'>('manual');
  
  // Highlighted fields that received auto-fill
  const [highlightedFields, setHighlightedFields] = useState<string[]>([]);
  const [autoFillNotification, setAutoFillNotification] = useState<string | null>(null);

  // Modal states
  const [isInDepthOpen, setIsInDepthOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Quick Preset Selection
  const handleQuickPreset = (make: string, model: string) => {
    const targetCar = CAR_DATABASE.find(c => c.make === make && c.model === model);
    if (!targetCar) return;
    const firstGen = targetCar.generations[0];
    const updated: VehicleInputs = {
      ...vehicleInputs,
      make,
      model,
      generation: firstGen?.name || '',
      variant: firstGen?.variants[0] || 'Base',
      fuelType: firstGen?.allowedFuels[0] || 'Petrol',
      transmission: firstGen?.allowedTransmissions[0] || 'Manual',
      registrationYear: firstGen?.endYear ? Math.min(2024, firstGen.endYear) : 2022,
    };
    setVehicleInputs(updated);
    setValuationResult(calculateValuation(updated));
  };

  // Auto calculate when manual form changes or submitted
  const handleCalculate = async () => {
    setIsCalculating(true);
    try {
      const response = await fetch('/api/calculate-valuation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehicleInputs),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.result) {
          setValuationResult(data.result);
          setIsCalculating(false);
          return;
        }
      }
    } catch {
      // Fallback local calculation
    }

    setTimeout(() => {
      setValuationResult(calculateValuation(vehicleInputs));
      setIsCalculating(false);
    }, 250);
  };

  // Handle Vision Auto-Fill
  const handleVisionAutoFill = (
    detected: Partial<VehicleInputs>,
    summary: string,
  ) => {
    const updated = { ...vehicleInputs, ...detected };
    setVehicleInputs(updated);
    
    const keys = Object.keys(detected);
    setHighlightedFields(keys);
    setAutoFillNotification(`AI Photo Scanner recognized vehicle details: ${summary}`);

    setIngestionMode('manual');
    setTimeout(() => {
      setValuationResult(calculateValuation(updated));
    }, 200);

    setTimeout(() => {
      setHighlightedFields([]);
    }, 4000);
  };

  // Handle NLP Auto-Fill
  const handleNlpAutoFill = (extracted: Partial<VehicleInputs>) => {
    const updated = { ...vehicleInputs, ...extracted };
    setVehicleInputs(updated);

    const keys = Object.keys(extracted);
    setHighlightedFields(keys);
    setAutoFillNotification(`Extracted vehicle attributes from description.`);

    setIngestionMode('manual');
    setTimeout(() => {
      setValuationResult(calculateValuation(updated));
    }, 200);

    setTimeout(() => {
      setHighlightedFields([]);
    }, 4000);
  };

  const handleReset = () => {
    setVehicleInputs(INITIAL_VEHICLE);
    setValuationResult(calculateValuation(INITIAL_VEHICLE));
    setHighlightedFields([]);
    setAutoFillNotification(null);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-[#090b10] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Header */}
      <Header 
        onReset={handleReset} 
        onOpenQuickGuide={() => setIsGuideOpen(true)} 
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
        {/* Hero Context Banner */}
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563eb] dark:text-[#dfb76c] uppercase tracking-wider mb-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Indian Pre-Owned Automotive Intelligence</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Resale Predictor
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mt-1.5 leading-relaxed">
                Fair market valuations calibrated against verified pre-owned platforms (Spinny, Cars24, CarDekho).
              </p>
            </div>

            {/* Unboxed Trust Indicators with Icons */}
            <div className="flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400 py-1">
              <div>
                <span className="text-[10px] uppercase tracking-wider block font-semibold text-slate-400">Database</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  <Car className="w-3 h-3 text-[#2563eb] dark:text-[#dfb76c]" />
                  <span>140+ Trims</span>
                </span>
              </div>
              <div className="w-px h-7 bg-slate-200 dark:bg-white/[0.08]" />
              <div>
                <span className="text-[10px] uppercase tracking-wider block font-semibold text-slate-400">Jurisdiction</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#2563eb] dark:text-[#dfb76c]" />
                  <span>22 States</span>
                </span>
              </div>
              <div className="w-px h-7 bg-slate-200 dark:bg-white/[0.08]" />
              <div>
                <span className="text-[10px] uppercase tracking-wider block font-semibold text-slate-400">Market Index</span>
                <span className="font-bold text-[#2563eb] dark:text-[#dfb76c] flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-[#2563eb] dark:text-[#dfb76c]" />
                  <span>Weekly</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Presets Bar for Instant 1-Click Testing */}
          <div className="flex items-center gap-2.5 overflow-x-auto py-1 scrollbar-none">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#2563eb] dark:text-[#dfb76c]" />
              <span>Popular:</span>
            </span>
            <div className="flex items-center gap-2">
              {POPULAR_PRESETS.map(sc => {
                const isSelected = vehicleInputs.make === sc.make && vehicleInputs.model === sc.model;
                return (
                  <button
                    key={sc.model}
                    type="button"
                    onClick={() => handleQuickPreset(sc.make, sc.model)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer whitespace-nowrap font-medium ${
                      isSelected
                        ? 'bg-slate-900 dark:bg-[#dfb76c] text-white dark:text-black border-slate-900 dark:border-[#dfb76c] font-semibold shadow-xs'
                        : 'bg-white dark:bg-white/[0.03] border-slate-200/90 dark:border-white/[0.08] text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/[0.16]'
                    }`}
                  >
                    {sc.label}
                  </button>
                );
              })}
            </div>
          </div>

          {autoFillNotification && (
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between text-xs text-slate-800 dark:text-slate-200 animate-in fade-in">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2563eb] dark:text-[#dfb76c] shrink-0" />
                <span>{autoFillNotification}</span>
              </span>
              <button
                type="button"
                onClick={() => setAutoFillNotification(null)}
                className="text-[#2563eb] dark:text-[#dfb76c] hover:underline font-semibold ml-4 text-[11px] cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}
        </section>

        {/* User-Friendly Proportional Dual-Column Command Layout (7 cols inputs : 5 cols valuation) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (Inputs & Specifications) */}
          <div id="intake" className="lg:col-span-7 space-y-4">
            <div className="rounded-2xl bg-white dark:bg-[#11141b] border border-slate-200/90 dark:border-white/[0.08] p-5 sm:p-6 shadow-sm space-y-5">
              {/* Intake Mode Tabs */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/[0.06] pb-4">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                    Vehicle Specifications
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Fine-tune trim, kilometers, and body condition
                  </p>
                </div>

                {/* Segmented Mode Control */}
                <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-white/[0.04] rounded-xl border border-slate-200/80 dark:border-white/[0.06] self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setIngestionMode('manual')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-all cursor-pointer ${
                      ingestionMode === 'manual'
                        ? 'bg-white dark:bg-[#0c0e14] text-slate-900 dark:text-white shadow-xs font-semibold'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 text-[#2563eb] dark:text-[#dfb76c]" />
                    <span>Form</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIngestionMode('vision')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-all cursor-pointer ${
                      ingestionMode === 'vision'
                        ? 'bg-white dark:bg-[#0c0e14] text-slate-900 dark:text-white shadow-xs font-semibold'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium'
                    }`}
                  >
                    <Camera className="w-3.5 h-3.5 text-[#2563eb] dark:text-[#dfb76c]" />
                    <span>Photo Scan</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIngestionMode('nlp')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-all cursor-pointer ${
                      ingestionMode === 'nlp'
                        ? 'bg-white dark:bg-[#0c0e14] text-slate-900 dark:text-white shadow-xs font-semibold'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium'
                    }`}
                  >
                    <MessageSquareText className="w-3.5 h-3.5 text-[#2563eb] dark:text-[#dfb76c]" />
                    <span>Prompt</span>
                  </button>
                </div>
              </div>

              {/* Mode 1: Manual Form */}
              {ingestionMode === 'manual' && (
                <ManualForm
                  values={vehicleInputs}
                  onChange={(newVals) => {
                    setVehicleInputs(newVals);
                    setValuationResult(calculateValuation(newVals));
                  }}
                  onSubmit={handleCalculate}
                  isCalculating={isCalculating}
                  highlightedFields={highlightedFields}
                />
              )}

              {/* Mode 2: Photo Analyzer */}
              {ingestionMode === 'vision' && (
                <div className="space-y-4">
                  <div className="p-3 bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06] rounded-xl text-xs text-slate-500 flex items-center justify-between">
                    <span>Upload a car photo or select sample photos to identify make, trim, and body damage.</span>
                    <button
                      type="button"
                      onClick={() => setIngestionMode('manual')}
                      className="text-[#2563eb] dark:text-[#dfb76c] hover:underline font-semibold ml-2 cursor-pointer"
                    >
                      Form →
                    </button>
                  </div>
                  <VisionUploader onAutoFill={handleVisionAutoFill} />
                </div>
              )}

              {/* Mode 3: Text Prompt */}
              {ingestionMode === 'nlp' && (
                <div className="space-y-4">
                  <div className="p-3 bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06] rounded-xl text-xs text-slate-500 flex items-center justify-between">
                    <span>Type or paste any used car listing text. Attributes will map automatically.</span>
                    <button
                      type="button"
                      onClick={() => setIngestionMode('manual')}
                      className="text-[#2563eb] dark:text-[#dfb76c] hover:underline font-semibold ml-2 cursor-pointer"
                    >
                      Form →
                    </button>
                  </div>
                  <NlpInput onAutoFill={handleNlpAutoFill} />
                </div>
              )}
            </div>
          </div>

          {/* Right Column (Valuation Output Card - Sticky on Desktop) */}
          <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
            <ValuationCard
              inputs={vehicleInputs}
              valuation={valuationResult}
              onOpenInDepth={() => setIsInDepthOpen(true)}
              onOpenCompare={() => setIsCompareOpen(true)}
            />
          </div>
        </div>
      </main>

      {/* Minimal Luxury Footer */}
      <footer className="mt-auto border-t border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#090b10] py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200 font-display">Resale Predictor</span>
            <span>·</span>
            <span>Pre-Owned Automotive Market Valuation</span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2563eb] dark:text-[#dfb76c]" />
              <span>Spinny · Cars24 · CarDekho Calibrated</span>
            </span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <InDepthAnalysisModal
        isOpen={isInDepthOpen}
        onClose={() => setIsInDepthOpen(false)}
        inputs={vehicleInputs}
        valuation={valuationResult}
      />

      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        inputs={vehicleInputs}
        valuation={valuationResult}
      />

      <RegulatoryGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}
