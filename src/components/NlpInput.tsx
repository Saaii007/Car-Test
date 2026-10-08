import React, { useState } from 'react';
import { Sparkles, Send, Check } from 'lucide-react';
import { SAMPLE_NLP_PROMPTS } from '../data/sampleUploads';
import { VehicleInputs } from '../types/car';

interface NlpInputProps {
  onAutoFill: (extracted: Partial<VehicleInputs>, rawPrompt: string) => void;
}

export const NlpInput: React.FC<NlpInputProps> = ({ onAutoFill }) => {
  const [prompt, setPrompt] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [lastExtractedSummary, setLastExtractedSummary] = useState<string | null>(null);

  const handleParse = async (textToParse?: string) => {
    const text = textToParse || prompt;
    if (!text.trim()) return;

    setIsParsing(true);
    setLastExtractedSummary(null);

    try {
      const response = await fetch('/api/parse-nlp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        const d = resData.data;
        const updates: Partial<VehicleInputs> = {};
        const fieldsParsed: string[] = [];

        if (d.make) { updates.make = d.make; fieldsParsed.push(d.make); }
        if (d.model) { updates.model = d.model; fieldsParsed.push(d.model); }
        if (d.variant) { updates.variant = d.variant; fieldsParsed.push(d.variant); }
        if (d.registrationYear) { updates.registrationYear = d.registrationYear; fieldsParsed.push(`${d.registrationYear}`); }
        if (d.fuelType) { updates.fuelType = d.fuelType; fieldsParsed.push(d.fuelType); }
        if (d.transmission) { updates.transmission = d.transmission; fieldsParsed.push(d.transmission); }
        if (d.kilometersDriven) { updates.kilometersDriven = d.kilometersDriven; fieldsParsed.push(`${(d.kilometersDriven / 1000)}k km`); }
        if (d.rtoLocation) { updates.rtoLocation = d.rtoLocation; fieldsParsed.push(d.rtoLocation.split(' ')[0]); }
        if (d.owners) { updates.owners = d.owners; fieldsParsed.push(`${d.owners} owner`); }
        if (d.insuranceStatus) { updates.insuranceStatus = d.insuranceStatus; }
        if (d.serviceHistory) { updates.serviceHistory = d.serviceHistory; }
        if (d.accidentalHistory) { updates.accidentalHistory = d.accidentalHistory; }
        if (d.damageReport) { 
          updates.damageReport = d.damageReport; 
          fieldsParsed.push(d.damageReport.severity === 'None' ? 'Showroom Condition' : `${d.damageReport.severity} Damage`); 
        }

        onAutoFill(updates, text);
        setLastExtractedSummary(`Extracted & Mapped: ${fieldsParsed.join(' · ')}`);
      }
    } catch (err) {
      console.error('NLP parse failed:', err);
    } finally {
      setIsParsing(false);
    }
  };

  const applySamplePrompt = (sample: string) => {
    setPrompt(sample);
    handleParse(sample);
  };

  return (
    <div className="space-y-4">
      {/* Prompt Box */}
      <div className="relative">
        <textarea
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. Selling 2018 white Hyundai Creta 1.6 SX diesel manual in Bangalore, 46,000 km, single owner..."
          className="w-full bg-white dark:bg-[#0c0e14] text-slate-900 dark:text-white placeholder:text-slate-400 text-xs border border-slate-200 dark:border-white/[0.08] rounded-xl p-3 pr-28 focus:outline-none focus:border-[#dfb76c] transition-all resize-none shadow-xs"
        />

        <div className="absolute right-3 bottom-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleParse()}
            disabled={isParsing || !prompt.trim()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#c5a059] to-[#dfb76c] text-black font-semibold text-xs rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap shadow-xs cursor-pointer"
          >
            {isParsing ? (
              <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>Extract</span>
          </button>
        </div>
      </div>

      {/* Confirmation feedback */}
      {lastExtractedSummary && (
        <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-2 text-xs text-[#c5a059] dark:text-[#dfb76c]">
          <Check className="w-4 h-4 shrink-0" />
          <span>{lastExtractedSummary}</span>
        </div>
      )}

      {/* Quick Clickable Sample Prompts */}
      <div>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#c5a059] dark:text-[#dfb76c]" />
          <span>Sample prompts:</span>
        </p>
        <div className="flex flex-col gap-1.5">
          {SAMPLE_NLP_PROMPTS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applySamplePrompt(sample)}
              className="text-left text-xs px-3 py-2 rounded-xl bg-slate-50/70 dark:bg-white/[0.02] hover:bg-slate-100 dark:hover:bg-white/[0.05] border border-slate-200/80 dark:border-white/[0.06] hover:border-[#dfb76c] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all flex items-center justify-between group cursor-pointer"
            >
              <span className="truncate pr-4 italic">"{sample}"</span>
              <span className="text-[11px] font-semibold text-[#c5a059] dark:text-[#dfb76c] opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                Apply →
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
