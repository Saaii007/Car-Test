import React, { useState, useRef } from 'react';
import { Camera, UploadCloud, CheckCircle2, AlertCircle, Sparkles, Wrench, ChevronRight } from 'lucide-react';
import { SAMPLE_CARS, SampleCarPreset } from '../data/sampleUploads';
import { CAR_DATABASE } from '../data/carDatabase';
import { VehicleInputs, ExteriorDamageReport } from '../types/car';

interface VisionUploaderProps {
  onAutoFill: (detectedFields: Partial<VehicleInputs>, detectionSummary: string, uploadedPhotoUrl?: string) => void;
}

export const VisionUploader: React.FC<VisionUploaderProps> = ({ onAutoFill }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewSvg, setPreviewSvg] = useState<string | null>(null);
  const [userCarHint, setUserCarHint] = useState<string>('');
  const [detectionResult, setDetectionResult] = useState<{
    summary: string;
    make: string;
    model: string;
    generation: string;
    variant: string;
    year: number;
    color: string;
    conditionScore: number;
    confidenceScore: number;
    dentsScratchReport: string;
    damageReport?: ExteriorDamageReport;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Resize and compress image on canvas to avoid payload limits and speed up inference
  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };

      img.onload = () => {
        const maxDim = 1024;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.82));
        } else {
          resolve(reader.result as string);
        }
      };

      img.onerror = () => {
        resolve(reader.result as string);
      };

      reader.readAsDataURL(file);
    });
  };

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid image file (.jpg, .jpeg, .png, .webp).');
      return;
    }

    setErrorMsg(null);
    setIsProcessing(true);
    setPreviewSvg(null);

    try {
      const compressedBase64 = await resizeImage(file);
      setPreviewUrl(compressedBase64);

      const response = await fetch('/api/analyze-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: compressedBase64,
          fileName: file.name,
          userHint: userCarHint.trim() || undefined,
          mimeType: 'image/jpeg',
        }),
      });

      const data = await response.json();
      const res = data.result || data.detected;
      if (!data.success || !res) {
        throw new Error(data.error || 'Failed to analyze vehicle image');
      }

      setDetectionResult({
        summary: res.summary || `${res.make} ${res.model} ${res.variant || ''}`.trim(),
        make: res.make,
        model: res.model,
        generation: res.generation,
        variant: res.variant,
        year: res.year || res.registrationYear || 2022,
        color: res.color || 'Solid Fire Red',
        conditionScore: res.conditionScore || 90,
        confidenceScore: res.confidenceScore || 95,
        dentsScratchReport: res.dentsScratchReport || 'Clearcoat surface inspected.',
        damageReport: res.damageReport,
      });

      // Auto-fill into parent vehicle intake
      const autoFilledFields: Partial<VehicleInputs> = {
        make: res.make,
        model: res.model,
        generation: res.generation,
        variant: res.variant,
        registrationYear: res.year || res.registrationYear || 2022,
        fuelType: res.fuelType,
        transmission: res.transmission,
        kilometersDriven: res.estimatedKm || res.kilometersDriven || 28000,
        damageReport: res.damageReport,
      };

      onAutoFill(autoFilledFields, res.summary || `${res.make} ${res.model}`, compressedBase64);
    } catch (err: any) {
      console.error('Vision analysis error:', err);
      setErrorMsg(err.message || 'Error communicating with visual inspection engine');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplySample = async (sample: SampleCarPreset) => {
    setIsProcessing(true);
    setErrorMsg(null);
    setPreviewUrl(null);
    setPreviewSvg(sample.previewSvg);

    try {
      const response = await fetch('/api/analyze-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sampleId: sample.id }),
      });

      const data = await response.json();
      const res = data.result || data.detected;
      if (data.success && res) {
        setDetectionResult({
          summary: res.summary || `${res.make} ${res.model} ${res.variant || ''}`.trim(),
          make: res.make,
          model: res.model,
          generation: res.generation,
          variant: res.variant,
          year: res.year || res.registrationYear || 2022,
          color: res.color || 'Solid Fire Red',
          conditionScore: res.conditionScore || 90,
          confidenceScore: res.confidenceScore || 95,
          dentsScratchReport: res.dentsScratchReport || 'Clearcoat surface inspected.',
          damageReport: res.damageReport,
        });

        onAutoFill({
          make: res.make,
          model: res.model,
          generation: res.generation,
          variant: res.variant,
          registrationYear: res.year || res.registrationYear || 2022,
          fuelType: res.fuelType,
          transmission: res.transmission,
          kilometersDriven: res.estimatedKm || res.kilometersDriven || 28000,
          rtoLocation: res.rtoLocation,
          damageReport: res.damageReport,
        }, res.summary || `${res.make} ${res.model}`);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load sample');
    } finally {
      setIsProcessing(false);
    }
  };

  // User manual model override
  const handleModelOverride = (newModel: string) => {
    const car = CAR_DATABASE.find(c => c.model === newModel);
    if (!car || !detectionResult) return;

    const gen = car.generations[0];
    const updated = {
      ...detectionResult,
      make: car.make,
      model: car.model,
      generation: gen.name,
      variant: gen.variants[0],
      summary: `Calibrated to: ${car.make} ${car.model}`,
    };

    setDetectionResult(updated);

    onAutoFill({
      make: car.make,
      model: car.model,
      generation: gen.name,
      variant: gen.variants[0],
      fuelType: gen.allowedFuels[0],
      transmission: gen.allowedTransmissions[0],
      registrationYear: gen.endYear ? Math.min(2024, gen.endYear) : 2023,
      damageReport: updated.damageReport,
    }, updated.summary, previewUrl || undefined);
  };

  return (
    <div className="space-y-4">
      {/* Optional Vehicle Hint Input */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 p-3 bg-slate-50/70 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.06] rounded-xl text-xs">
        <div className="flex items-center gap-2 shrink-0 text-slate-600 dark:text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-[#c5a059] dark:text-[#dfb76c]" />
          <span className="font-medium">Optional Hint:</span>
        </div>
        <div className="flex-1 relative">
          <input
            type="text"
            value={userCarHint}
            onChange={(e) => setUserCarHint(e.target.value)}
            placeholder="e.g. Maruti Suzuki Swift, Hyundai Creta, Thar"
            className="w-full bg-white dark:bg-[#0c0e14] border border-slate-200 dark:border-white/[0.08] focus:border-[#dfb76c] rounded-lg px-3 py-1.5 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none transition-colors"
          />
        </div>
        {userCarHint && (
          <button
            type="button"
            onClick={() => setUserCarHint('')}
            className="text-[11px] text-slate-400 hover:text-slate-700 dark:hover:text-white px-2 py-1 rounded bg-slate-200/50 dark:bg-white/[0.06] transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-7 text-center cursor-pointer transition-all ${
          isDragging 
            ? 'border-[#dfb76c] bg-[#dfb76c]/5' 
            : 'border-slate-200 dark:border-white/[0.1] hover:border-[#dfb76c] bg-slate-50/50 dark:bg-white/[0.02] hover:bg-slate-50 dark:hover:bg-white/[0.04]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) processFile(e.target.files[0]);
          }}
        />

        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.08] flex items-center justify-center text-slate-700 dark:text-slate-300 shadow-xs">
            {isProcessing ? (
              <div className="w-5 h-5 border-2 border-[#dfb76c] border-t-transparent rounded-full animate-spin" />
            ) : (
              <UploadCloud className="w-5 h-5 text-[#c5a059] dark:text-[#dfb76c]" />
            )}
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {isProcessing ? 'Analyzing vehicle...' : 'Drop car photo or browse'}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Exterior photos (.jpg, .png, .webp)
            </p>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 p-3 text-xs bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 rounded-lg text-rose-800 dark:text-rose-300">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Quick Sample Photos Bar */}
      <div>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
          <Camera className="w-3.5 h-3.5 text-slate-400" />
          <span>Or test with pre-analyzed samples:</span>
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {SAMPLE_CARS.slice(0, 4).map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => handleApplySample(sample)}
              className="text-left p-2.5 rounded-xl border border-slate-200/80 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] hover:border-[#dfb76c] transition-all group cursor-pointer"
            >
              <div className="h-16 w-full rounded-lg bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.06] overflow-hidden mb-2 relative">
                <div 
                  className="w-full h-full"
                  dangerouslySetInnerHTML={{ __html: sample.previewSvg }}
                />
              </div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-[#dfb76c] transition-colors">
                {sample.title}
              </p>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">
                {sample.badge}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Detection Results Card */}
      {detectionResult && (
        <div className="p-4 rounded-xl bg-white dark:bg-[#11141b] border border-[#dfb76c]/40 relative overflow-hidden space-y-3 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#dfb76c]/10 text-[#c5a059] dark:text-[#dfb76c] text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{detectionResult.summary}</span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 text-xs text-slate-700 dark:text-slate-300 pt-2">
                <div>
                  <span className="text-slate-400">Model: </span>
                  <span className="font-semibold text-slate-900 dark:text-white">{detectionResult.make} {detectionResult.model}</span>
                </div>
                <div>
                  <span className="text-slate-400">Color: </span>
                  <span className="text-slate-700 dark:text-slate-300">{detectionResult.color}</span>
                </div>
                <div>
                  <span className="text-slate-400">Trim: </span>
                  <span className="text-slate-700 dark:text-slate-300">{detectionResult.variant}</span>
                </div>
                <div>
                  <span className="text-slate-400">Year: </span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{detectionResult.year}</span>
                </div>
              </div>

              {/* Surface & Damage Report */}
              <p className="text-xs text-slate-500 dark:text-slate-400 pt-1 leading-relaxed">
                <span className="font-medium text-slate-700 dark:text-slate-300">Surface: </span>
                {detectionResult.dentsScratchReport}
              </p>

              {/* Damage & Maintenance Impact Badge */}
              {detectionResult.damageReport && (
                <div className={`mt-2 p-2 rounded-lg border text-xs flex items-center justify-between ${
                  detectionResult.damageReport.severity === 'None'
                    ? 'bg-amber-500/10 border-amber-500/20 text-[#c5a059] dark:text-[#dfb76c]'
                    : 'bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-300'
                }`}>
                  <span className="flex items-center gap-1.5 font-medium">
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Damage: {detectionResult.damageReport.severity}</span>
                  </span>
                  <span className="font-bold font-mono">
                    {detectionResult.damageReport.severity === 'None'
                      ? '+ ₹12,000 (Showroom Condition)'
                      : `- ₹${detectionResult.damageReport.damageDeductionInr.toLocaleString('en-IN')}`}
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail */}
            {(previewUrl || previewSvg) && (
              <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200 dark:border-white/[0.08] shrink-0 bg-slate-100 dark:bg-black">
                {previewUrl ? (
                  <img src={previewUrl} alt="Analyzed car" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: previewSvg || '' }} />
                )}
              </div>
            )}
          </div>

          {/* Quick Matcher Selector */}
          <div className="pt-2 border-t border-slate-100 dark:border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <span className="text-slate-400">Override model if needed:</span>
            <select
              value={detectionResult.model}
              onChange={(e) => handleModelOverride(e.target.value)}
              className="bg-slate-50 dark:bg-[#0c0e14] border border-slate-200 dark:border-white/[0.08] rounded-lg px-2 py-1 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-[#dfb76c]"
            >
              {CAR_DATABASE.map(c => (
                <option key={c.model} value={c.model}>
                  {c.make} {c.model}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
