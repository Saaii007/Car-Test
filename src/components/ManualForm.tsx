import React, { useState } from 'react';
import { 
  FuelType, 
  TransmissionType, 
  OwnerCount, 
  InsuranceType, 
  ServiceHistoryType, 
  AccidentalHistoryType,
  DamagePanel,
  DamageSeverity,
  ScratchDepth,
  VehicleInputs 
} from '../types/car';
import { CAR_DATABASE } from '../data/carDatabase';
import { RTO_LIST } from '../data/rtoDatabase';
import { 
  Sliders, 
  ChevronDown, 
  ChevronUp, 
  AlertTriangle, 
  Sparkles,
  Calculator,
  Car,
  Wrench,
  Check,
  Calendar,
  Layers,
  MapPin,
  Fuel,
  Zap,
  Gauge,
  Users,
  ShieldAlert
} from 'lucide-react';

interface ManualFormProps {
  values: VehicleInputs;
  onChange: (newValues: VehicleInputs) => void;
  onSubmit: () => void;
  isCalculating: boolean;
  highlightedFields: string[];
}

export const ManualForm: React.FC<ManualFormProps> = ({
  values,
  onChange,
  onSubmit,
  isCalculating,
  highlightedFields,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Available makes
  const makes = Array.from(new Set(CAR_DATABASE.map(c => c.make)));
  
  // Available models for current make
  const models = CAR_DATABASE.filter(c => c.make === values.make).map(c => c.model);
  
  // Current car entry
  const selectedCar = CAR_DATABASE.find(c => c.make === values.make && c.model === values.model);
  
  // Available generations
  const generations = selectedCar?.generations || [];
  const currentGen = generations.find(g => g.name === values.generation) || generations[0];

  // Available variants
  const variants = currentGen?.variants || ['Standard'];
  const allowedFuels = currentGen?.allowedFuels || ['Petrol', 'Diesel'];
  const allowedTransmissions = currentGen?.allowedTransmissions || ['Manual', 'Torque Converter AT'];

  // Handle Make change
  const handleMakeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMake = e.target.value;
    const firstCarOfMake = CAR_DATABASE.find(c => c.make === newMake);
    const firstGen = firstCarOfMake?.generations[0];
    
    onChange({
      ...values,
      make: newMake,
      model: firstCarOfMake?.model || '',
      generation: firstGen?.name || '',
      variant: firstGen?.variants[0] || 'Base',
      fuelType: firstGen?.allowedFuels[0] || 'Petrol',
      transmission: firstGen?.allowedTransmissions[0] || 'Manual',
      registrationYear: firstGen?.endYear ? Math.min(2024, firstGen.endYear) : 2022,
    });
  };

  // Handle Model change
  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newModel = e.target.value;
    const targetCar = CAR_DATABASE.find(c => c.make === values.make && c.model === newModel);
    const firstGen = targetCar?.generations[0];

    onChange({
      ...values,
      model: newModel,
      generation: firstGen?.name || '',
      variant: firstGen?.variants[0] || 'Base',
      fuelType: firstGen?.allowedFuels[0] || 'Petrol',
      transmission: firstGen?.allowedTransmissions[0] || 'Manual',
      registrationYear: firstGen?.endYear ? Math.min(2024, firstGen.endYear) : 2022,
    });
  };

  // Handle Generation change
  const handleGenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const genName = e.target.value;
    const genObj = generations.find(g => g.name === genName);

    onChange({
      ...values,
      generation: genName,
      variant: genObj?.variants[0] || values.variant,
      fuelType: genObj?.allowedFuels.includes(values.fuelType) ? values.fuelType : (genObj?.allowedFuels[0] || 'Petrol'),
      transmission: genObj?.allowedTransmissions.includes(values.transmission) ? values.transmission : (genObj?.allowedTransmissions[0] || 'Manual'),
      registrationYear: genObj?.endYear ? Math.min(2024, genObj.endYear) : values.registrationYear,
    });
  };

  const isHighlighted = (field: string) => highlightedFields.includes(field);
  const currentRto = RTO_LIST.find(r => values.rtoLocation.includes(r.code));

  return (
    <form 
      onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
      className="space-y-6"
    >
      {/* 1. VEHICLE IDENTITY */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
          <Car className="w-3.5 h-3.5 text-[#c5a059] dark:text-[#dfb76c]" />
          <span>Vehicle Identity</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* Make */}
          <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.06] focus-within:border-[#dfb76c] transition-colors">
            <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              <Car className="w-3 h-3 text-[#c5a059] dark:text-[#dfb76c]" />
              <span>Make / Brand</span>
            </label>
            <select
              value={values.make}
              onChange={handleMakeChange}
              className="w-full bg-white dark:bg-[#0c0e14] text-slate-900 dark:text-white text-xs font-medium border border-slate-200 dark:border-white/[0.08] rounded-lg px-2.5 py-2 focus:outline-none focus:border-[#dfb76c]"
            >
              {makes.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Model */}
          <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.06] focus-within:border-[#dfb76c] transition-colors">
            <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              <Layers className="w-3 h-3 text-[#c5a059] dark:text-[#dfb76c]" />
              <span>Model</span>
            </label>
            <select
              value={values.model}
              onChange={handleModelChange}
              className="w-full bg-white dark:bg-[#0c0e14] text-slate-900 dark:text-white text-xs font-medium border border-slate-200 dark:border-white/[0.08] rounded-lg px-2.5 py-2 focus:outline-none focus:border-[#dfb76c]"
            >
              {models.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.06] focus-within:border-[#dfb76c] transition-colors">
            <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              <Calendar className="w-3 h-3 text-[#c5a059] dark:text-[#dfb76c]" />
              <span>Registration Year</span>
            </label>
            <select
              value={values.registrationYear}
              onChange={(e) => onChange({ ...values, registrationYear: parseInt(e.target.value, 10) })}
              className="w-full bg-white dark:bg-[#0c0e14] text-slate-900 dark:text-white text-xs font-medium border border-slate-200 dark:border-white/[0.08] rounded-lg px-2.5 py-2 focus:outline-none focus:border-[#dfb76c] font-mono"
            >
              {Array.from({ length: 2026 - 2005 + 1 }, (_, i) => 2026 - i).map(yr => (
                <option key={yr} value={yr}>{yr}</option>
              ))}
            </select>
          </div>

          {/* Generation */}
          <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.06] focus-within:border-[#dfb76c] transition-colors">
            <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              <Sliders className="w-3 h-3 text-[#c5a059] dark:text-[#dfb76c]" />
              <span>Generation / Phase</span>
            </label>
            <select
              value={values.generation}
              onChange={handleGenChange}
              className="w-full bg-white dark:bg-[#0c0e14] text-slate-900 dark:text-white text-xs font-medium border border-slate-200 dark:border-white/[0.08] rounded-lg px-2.5 py-2 focus:outline-none focus:border-[#dfb76c]"
            >
              {generations.map(g => (
                <option key={g.name} value={g.name}>{g.name}</option>
              ))}
            </select>
          </div>

          {/* Variant */}
          <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.06] focus-within:border-[#dfb76c] transition-colors sm:col-span-2">
            <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              <Sparkles className="w-3 h-3 text-[#c5a059] dark:text-[#dfb76c]" />
              <span>Variant / Trim</span>
            </label>
            <select
              value={values.variant}
              onChange={(e) => onChange({ ...values, variant: e.target.value })}
              className="w-full bg-white dark:bg-[#0c0e14] text-slate-900 dark:text-white text-xs font-medium border border-slate-200 dark:border-white/[0.08] rounded-lg px-2.5 py-2 focus:outline-none focus:border-[#dfb76c]"
            >
              {variants.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. USAGE, FUEL & LOCATION */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
          <Gauge className="w-3.5 h-3.5 text-[#c5a059] dark:text-[#dfb76c]" />
          <span>Usage, Fuel & Location</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* Kilometers Driven */}
          <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.06] focus-within:border-[#dfb76c] transition-colors sm:col-span-2">
            <div className="flex items-center justify-between mb-1">
              <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                <Gauge className="w-3 h-3 text-[#c5a059] dark:text-[#dfb76c]" />
                <span>Kilometers Driven</span>
              </label>
              <span className="text-xs font-mono font-bold text-[#c5a059] dark:text-[#dfb76c]">
                {values.kilometersDriven.toLocaleString('en-IN')} km
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={values.kilometersDriven === 0 ? '' : values.kilometersDriven}
                placeholder="e.g. 32000"
                onChange={(e) => {
                  const val = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
                  onChange({ ...values, kilometersDriven: isNaN(val) ? 0 : val });
                }}
                className="w-1/2 bg-white dark:bg-[#0c0e14] text-slate-900 dark:text-white text-xs border border-slate-200 dark:border-white/[0.08] rounded-lg px-2.5 py-2 focus:outline-none focus:border-[#dfb76c] font-mono"
              />
              <div className="flex items-center gap-1">
                {[15000, 30000, 50000, 75000].map(km => (
                  <button
                    key={km}
                    type="button"
                    onClick={() => onChange({ ...values, kilometersDriven: km })}
                    className={`text-[10px] px-2.5 py-1.5 rounded-md border transition-all cursor-pointer font-medium ${
                      values.kilometersDriven === km
                        ? 'bg-[#c5a059]/20 border-[#c5a059] text-slate-900 dark:text-white font-bold'
                        : 'border-slate-200 dark:border-white/[0.08] text-slate-500 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-transparent'
                    }`}
                  >
                    {km / 1000}k
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RTO Location */}
          <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.06] focus-within:border-[#dfb76c] transition-colors">
            <div className="flex items-center justify-between mb-1">
              <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                <MapPin className="w-3 h-3 text-[#c5a059] dark:text-[#dfb76c]" />
                <span>RTO Jurisdiction</span>
              </label>
              {currentRto?.isNcrRegion && (
                <span className="text-[10px] text-amber-500 font-semibold flex items-center gap-0.5">
                  <AlertTriangle className="w-2.5 h-2.5" /> NCR
                </span>
              )}
            </div>
            <select
              value={values.rtoLocation}
              onChange={(e) => onChange({ ...values, rtoLocation: e.target.value })}
              className="w-full bg-white dark:bg-[#0c0e14] text-slate-900 dark:text-white text-xs font-medium border border-slate-200 dark:border-white/[0.08] rounded-lg px-2.5 py-2 focus:outline-none focus:border-[#dfb76c]"
            >
              {RTO_LIST.map(r => (
                <option key={r.code} value={r.name}>{r.name}</option>
              ))}
            </select>
          </div>

          {/* Fuel Type */}
          <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.06] focus-within:border-[#dfb76c] transition-colors">
            <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              <Fuel className="w-3 h-3 text-[#c5a059] dark:text-[#dfb76c]" />
              <span>Fuel Type</span>
            </label>
            <select
              value={values.fuelType}
              onChange={(e) => onChange({ ...values, fuelType: e.target.value as FuelType })}
              className="w-full bg-white dark:bg-[#0c0e14] text-slate-900 dark:text-white text-xs font-medium border border-slate-200 dark:border-white/[0.08] rounded-lg px-2.5 py-2 focus:outline-none focus:border-[#dfb76c]"
            >
              {allowedFuels.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          {/* Transmission */}
          <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.06] focus-within:border-[#dfb76c] transition-colors">
            <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              <Zap className="w-3 h-3 text-[#c5a059] dark:text-[#dfb76c]" />
              <span>Transmission</span>
            </label>
            <select
              value={values.transmission}
              onChange={(e) => onChange({ ...values, transmission: e.target.value as TransmissionType })}
              className="w-full bg-white dark:bg-[#0c0e14] text-slate-900 dark:text-white text-xs font-medium border border-slate-200 dark:border-white/[0.08] rounded-lg px-2.5 py-2 focus:outline-none focus:border-[#dfb76c]"
            >
              {allowedTransmissions.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Owners */}
          <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.06] focus-within:border-[#dfb76c] transition-colors">
            <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              <Users className="w-3 h-3 text-[#c5a059] dark:text-[#dfb76c]" />
              <span>Ownership History</span>
            </label>
            <div className="grid grid-cols-4 gap-1">
              {(['1st', '2nd', '3rd', '4th+'] as OwnerCount[]).map(own => (
                <button
                  key={own}
                  type="button"
                  onClick={() => onChange({ ...values, owners: own })}
                  className={`py-1.5 text-xs rounded-md transition-all cursor-pointer font-medium ${
                    values.owners === own
                      ? 'bg-slate-900 dark:bg-[#dfb76c] text-white dark:text-black font-bold shadow-2xs'
                      : 'bg-white dark:bg-[#0c0e14] border border-slate-200 dark:border-white/[0.08] text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {own}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. EXTERIOR CONDITION & WEAR */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5 text-[#c5a059] dark:text-[#dfb76c]" />
            <span>Exterior Condition & Paint Wear</span>
          </h3>
          <span className="text-[11px] text-[#c5a059] dark:text-[#dfb76c] font-bold">
            {(values.damageReport?.severity || 'None') === 'None'
              ? '+ ₹12,000 showroom bonus'
              : `- ₹${(values.damageReport?.damageDeductionInr || 8500).toLocaleString('en-IN')} deduction`}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { id: 'None', label: 'Showroom', desc: 'Original paint (+₹12k)' },
            { id: 'Minor', label: 'Minor Scratches', desc: 'Light swirl marks' },
            { id: 'Moderate', label: 'Dent & Panel Scrapes', desc: 'Repaint needed' },
            { id: 'Severe', label: 'Severe Damage', desc: 'Deep dent / structural' },
          ].map(s => {
            const isSelected = (values.damageReport?.severity || 'None') === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  const sev = s.id as DamageSeverity;
                  if (sev === 'None') {
                    onChange({
                      ...values,
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
                    });
                  } else {
                    const base = sev === 'Minor' ? 8500 : sev === 'Moderate' ? 22000 : 48000;
                    onChange({
                      ...values,
                      damageReport: {
                        severity: sev,
                        affectedPanels: ['Front Bumper' as DamagePanel],
                        scratchDepth: 'Clearcoat Cut',
                        repaintedPanelsCount: 1,
                        damageDeductionInr: base,
                        estimatedRepairCostInr: base,
                        maintenanceConditionText: `- ₹${base.toLocaleString('en-IN')} for ${sev.toLowerCase()} wear & exterior repaint`,
                        maintenanceConditionDeltaInr: -base,
                      },
                    });
                  }
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#c5a059] dark:border-[#dfb76c] bg-[#c5a059]/10 dark:bg-[#dfb76c]/10 text-slate-900 dark:text-white shadow-2xs'
                    : 'border-slate-200/80 dark:border-white/[0.06] bg-slate-50/50 dark:bg-white/[0.02] text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{s.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#c5a059] dark:text-[#dfb76c]" />}
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 leading-snug">{s.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. OPTIONAL ADVANCED SPECIFICATIONS */}
      <div className="border border-slate-200/80 dark:border-white/[0.06] rounded-xl overflow-hidden bg-slate-50/40 dark:bg-white/[0.02]">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full px-4 py-3 flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-[#c5a059] dark:text-[#dfb76c]" />
            <span>Insurance & Maintenance Records (Optional Details)</span>
          </span>
          {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showAdvanced && (
          <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3.5 border-t border-slate-200/80 dark:border-white/[0.06]">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Insurance Type
              </label>
              <select
                value={values.insuranceStatus}
                onChange={(e) => onChange({ ...values, insuranceStatus: e.target.value as InsuranceType })}
                className="w-full bg-white dark:bg-[#0c0e14] text-slate-900 dark:text-white text-xs border border-slate-200 dark:border-white/[0.08] rounded-lg px-2.5 py-2 font-medium"
              >
                <option value="Zero Depreciation">Zero Depreciation</option>
                <option value="Comprehensive">Comprehensive</option>
                <option value="Third-Party">Third-Party Only</option>
                <option value="Expired">Expired</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Service History
              </label>
              <select
                value={values.serviceHistory}
                onChange={(e) => onChange({ ...values, serviceHistory: e.target.value as ServiceHistoryType })}
                className="w-full bg-white dark:bg-[#0c0e14] text-slate-900 dark:text-white text-xs border border-slate-200 dark:border-white/[0.08] rounded-lg px-2.5 py-2 font-medium"
              >
                <option value="Authorized Dealer Full History">Authorized Dealer Records</option>
                <option value="Partial">Partial Records</option>
                <option value="Independent Garage">Independent Garage</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Accidental History
              </label>
              <select
                value={values.accidentalHistory}
                onChange={(e) => onChange({ ...values, accidentalHistory: e.target.value as AccidentalHistoryType })}
                className="w-full bg-white dark:bg-[#0c0e14] text-slate-900 dark:text-white text-xs border border-slate-200 dark:border-white/[0.08] rounded-lg px-2.5 py-2 font-medium"
              >
                <option value="Clean">Clean (Zero Accidental Damage)</option>
                <option value="Minor Bodywork">Minor Panel Work</option>
                <option value="Structural Repairs">Major Repair History</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Recalculate CTA */}
      <div className="flex justify-end pt-1">
        <button
          type="submit"
          disabled={isCalculating}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#c5a059] to-[#dfb76c] text-black font-bold text-xs rounded-xl shadow-sm hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
        >
          {isCalculating ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              <span>Valuating...</span>
            </>
          ) : (
            <>
              <Calculator className="w-3.5 h-3.5" />
              <span>Update Valuation</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
