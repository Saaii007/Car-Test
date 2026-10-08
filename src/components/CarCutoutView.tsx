import React, { useState } from 'react';
import { getCarCutout, POPULAR_CAR_COLORS, CarColorOption } from '../data/carCutouts';
import { Sparkles, Palette, Check, Image as ImageIcon, Camera, Download } from 'lucide-react';

interface CarCutoutViewProps {
  make: string;
  model: string;
  variant: string;
  year: number;
  segment?: string;
  fuelType?: string;
  uploadedPhotoUrl?: string | null;
}

export const CarCutoutView: React.FC<CarCutoutViewProps> = ({
  make,
  model,
  variant,
  year,
  segment,
  fuelType,
  uploadedPhotoUrl,
}) => {
  const cutoutConfig = getCarCutout(make, model, segment);
  const [selectedColor, setSelectedColor] = useState<CarColorOption>(cutoutConfig.defaultColor);
  const [viewMode, setViewMode] = useState<'studio' | 'photo'>(uploadedPhotoUrl ? 'photo' : 'studio');

  // Update selected color if model changes default
  React.useEffect(() => {
    setSelectedColor(cutoutConfig.defaultColor);
  }, [make, model]);

  const svgHtml = cutoutConfig.renderSvg(selectedColor.hex, selectedColor.secondaryHex);

  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadPng = () => {
    try {
      const img = new Image();
      const svgBlob = new Blob([svgHtml], { type: 'image/svg+xml;charset=utf-8' });
      const URL = window.URL || window.webkitURL || window;
      const blobURL = URL.createObjectURL(svgBlob);

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1080;
        canvas.height = 520;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const pngUrl = canvas.toDataURL('image/png');
          const a = document.createElement('a');
          a.download = `${make}_${model}_${selectedColor.name.toLowerCase().replace(/\s+/g, '_')}_cutout.png`;
          a.href = pngUrl;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setDownloadSuccess(true);
          setTimeout(() => setDownloadSuccess(false), 2500);
        }
        URL.revokeObjectURL(blobURL);
      };
      img.src = blobURL;
    } catch (e) {
      console.error('PNG export failed', e);
    }
  };

  return (
    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-slate-100/90 via-slate-50 to-white dark:from-[#0d1017] dark:via-[#090b10] dark:to-[#080a0e] border border-slate-200/90 dark:border-slate-800/90 p-5 sm:p-6 transition-all duration-300 shadow-sm">
      {/* Top Bar: Clean unboxed metadata and Studio/Photo Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 text-xs">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">Studio Stage</span>
          <span aria-hidden="true">·</span>
          <span>{cutoutConfig.modelBadge}</span>
          <span aria-hidden="true">·</span>
          <span>Transparent Alpha PNG</span>
        </div>

        {/* Studio Cutout vs Real Photo Toggle (if photo available) */}
        {uploadedPhotoUrl && (
          <div className="inline-flex items-center p-1 rounded-lg bg-slate-200/70 dark:bg-slate-800/80 border border-slate-300/50 dark:border-slate-700/60 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('studio')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all ${
                viewMode === 'studio'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Studio Cutout</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('photo')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all ${
                viewMode === 'photo'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Inspected Photo</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Showcase Stage */}
      <div className="relative min-h-[200px] sm:min-h-[240px] flex items-center justify-center py-3 overflow-hidden">
        {/* Soft Radial Ambient Turntable Lighting */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-[85%] h-[70%] rounded-full bg-radial from-slate-200/60 to-transparent dark:from-emerald-500/10 dark:via-slate-800/30 dark:to-transparent filter blur-2xl" />
        </div>

        {viewMode === 'studio' || !uploadedPhotoUrl ? (
          <div className="relative w-full max-w-lg mx-auto z-10 transition-transform duration-300 hover:scale-[1.015]">
            {/* The Background-less Studio Car Cutout */}
            <div
              className="w-full h-auto flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: svgHtml }}
            />
          </div>
        ) : (
          <div className="relative z-10 w-full max-w-md mx-auto rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 shadow-md">
            <img
              src={uploadedPhotoUrl}
              alt={`${year} ${make} ${model}`}
              className="w-full h-48 sm:h-56 object-cover"
            />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent p-3 text-white text-xs">
              <span className="font-semibold">{year} {make} {model} {variant}</span>
              <p className="text-[11px] text-slate-300">Exterior Inspection Scan</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Bar: Interactive Paint Swatches & Vehicle Identification */}
      <div className="mt-3 pt-3 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Palette className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span className="text-slate-500 dark:text-slate-400">Paint Finish:</span>
          <span className="font-semibold text-slate-900 dark:text-slate-200">{selectedColor.name}</span>
        </div>

        {/* Color Palette Chips & Download Cutout Action */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            {POPULAR_CAR_COLORS.map((c) => {
              const isSelected = selectedColor.name === c.name;
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  title={c.name}
                  className={`relative w-6 h-6 rounded-full border transition-all duration-150 flex items-center justify-center cursor-pointer ${
                    isSelected
                      ? 'ring-2 ring-emerald-500 scale-110 border-white shadow-sm'
                      : 'border-slate-300 dark:border-slate-700 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                >
                  {isSelected && (
                    <Check
                      className={`w-3 h-3 ${
                        c.hex === '#f8fafc' ? 'text-slate-900' : 'text-white'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleDownloadPng}
            title="Download transparent background-less PNG of this vehicle"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300/80 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-xs cursor-pointer active:scale-95"
          >
            {downloadSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Downloaded PNG</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>PNG Cutout</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
