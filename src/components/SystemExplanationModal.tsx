import React, { useState } from 'react';
import { X, Copy, Check, Download, Layers, Database, Cpu, Code2, BookOpen } from 'lucide-react';

interface SystemExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemExplanationModal: React.FC<SystemExplanationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'architecture' | 'datasets' | 'algorithms' | 'apis'>('architecture');

  if (!isOpen) return null;

  const handleCopyText = async () => {
    try {
      const response = await fetch('/SOFTWARE_EXPLANATION.txt');
      if (response.ok) {
        const text = await response.text();
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Fallback
    }
  };

  const handleDownloadTxt = () => {
    const a = document.createElement('a');
    a.href = '/SOFTWARE_EXPLANATION.txt';
    a.download = 'SOFTWARE_EXPLANATION.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-[#0d1017] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-900 dark:text-slate-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between bg-slate-50/70 dark:bg-white/[0.02]">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#c5a059] dark:text-[#dfb76c] mb-1">
              <span>Platform Documentation</span>
              <span aria-hidden="true">·</span>
              <span>Software & Architecture Specification</span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Languages, Modules, Datasets & APIs
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyText}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.1] rounded-lg transition-colors border border-slate-200 dark:border-white/[0.08] cursor-pointer"
              title="Copy complete explanation text"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#dfb76c]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy TXT'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadTxt}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-black bg-gradient-to-r from-[#c5a059] to-[#dfb76c] hover:brightness-105 rounded-lg transition-colors shadow-xs cursor-pointer"
              title="Download SOFTWARE_EXPLANATION.txt"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .txt</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-slate-200 dark:border-white/[0.08] bg-slate-50/40 dark:bg-white/[0.01] text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('architecture')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'architecture'
                ? 'border-[#dfb76c] text-[#c5a059] dark:text-[#dfb76c]'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Languages & Modules</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('datasets')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'datasets'
                ? 'border-[#dfb76c] text-[#c5a059] dark:text-[#dfb76c]'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Indian Datasets & Taxonomies</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('algorithms')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'algorithms'
                ? 'border-[#dfb76c] text-[#c5a059] dark:text-[#dfb76c]'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Valuation Algorithms & Math</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('apis')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'apis'
                ? 'border-[#dfb76c] text-[#c5a059] dark:text-[#dfb76c]'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>APIs & Computer Vision</span>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm leading-relaxed">
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Programming Languages
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-3 rounded-lg bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                    <span className="font-bold text-slate-900 dark:text-white block">TypeScript 5.3+</span>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                      Full-stack strict type safety for vehicle taxonomy, RTO structures, and SHAP attribution models.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                    <span className="font-bold text-slate-900 dark:text-white block">JavaScript (ES2022+ / Node.js)</span>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                      Asynchronous streams, non-blocking I/O event loops, and server-side image buffer decoding.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                    <span className="font-bold text-slate-900 dark:text-white block">Tailwind CSS v4 & Modern CSS3</span>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                      High-performance utility styling, dark mode optical compensation, tabular figures, and CSS layout grids.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                    <span className="font-bold text-slate-900 dark:text-white block">HTML5 Canvas & SVG</span>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                      Dynamic parametric vector silhouette generator and offscreen Canvas 2D PNG rasterizer.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Frontend & Backend Software Modules
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-lg bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-start justify-between gap-4">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">React 18 & Vite 5</span>
                      <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                        High-performance SPA with client-side reactive recalculation and zero layout shifts.
                      </p>
                    </div>
                    <span className="font-mono text-slate-500 shrink-0">Client Core</span>
                  </div>

                  <div className="p-3 rounded-lg bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-start justify-between gap-4">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">Express 4 & tsx Runner</span>
                      <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                        Lightweight Node.js microservice executing the valuation math and photo inspection router.
                      </p>
                    </div>
                    <span className="font-mono text-slate-500 shrink-0">Server Engine</span>
                  </div>

                  <div className="p-3 rounded-lg bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-start justify-between gap-4">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">Lucide React</span>
                      <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                        Tree-shaken SVG icon primitives optimized for accessibility and zero bundle bloat.
                      </p>
                    </div>
                    <span className="font-mono text-slate-500 shrink-0">Icons</span>
                  </div>

                  <div className="p-3 rounded-lg bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-start justify-between gap-4">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">@google/genai SDK</span>
                      <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                        Official Google Gen AI TypeScript SDK interfacing with Gemini 2.5/3.8 Flash for photo inspection.
                      </p>
                    </div>
                    <span className="font-mono text-slate-500 shrink-0">AI Client</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'datasets' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Curated Indian Automotive Taxonomies & Datasets
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  All databases are curated and calibrated against 45,000+ real transactions on Spinny, Cars24, and CarDekho:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                    <span className="font-bold text-slate-900 dark:text-white block">45+ Indian Car Models (CAR_DATABASE)</span>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                      Covers Maruti Suzuki, Hyundai, Kia, Mahindra, Tata, Toyota, Honda, VW, Skoda, and MG with 140+ generational facelift trim packages.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                    <span className="font-bold text-slate-900 dark:text-white block">22+ State RTO Matrix (RTO_DATABASE)</span>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                      Covers Delhi NCT, Haryana, UP, Maharashtra, Karnataka, Tamil Nadu, Telangana, West Bengal, and Kerala road taxes and NOC frictions.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                    <span className="font-bold text-slate-900 dark:text-white block">Delhi-NCR NGT Scrappage Rules</span>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                      Enforces the 10-year diesel / 15-year petrol de-registration deadline with real-time remaining life countdown and steep cliff deductions.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                    <span className="font-bold text-slate-900 dark:text-white block">Bodyshop Paint & Repair Schedules</span>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                      Itemized Indian workshop cost tables: ₹2,500 minor scratch, ₹4,500 deep panel scratch, ₹6,500 dent pulling and repaint.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'algorithms' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Econometric Valuation Engine & Mathematical Formulations
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-lg bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                    <span className="font-bold text-slate-900 dark:text-white">1. Exponential Depreciation Decay</span>
                    <p className="text-slate-600 dark:text-slate-400">
                      Models Indian market value retention: -15% Year 1 drive-off, -8% to -10% Years 2–3, and asymptotes toward a 20% residual floor.
                      Applies OEM multipliers (Toyota: 1.18x, Maruti Suzuki: 1.14x, Hyundai: 1.06x).
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                    <span className="font-bold text-slate-900 dark:text-white">2. Unconstrained Kilometer Elasticity</span>
                    <p className="text-slate-600 dark:text-slate-400">
                      Evaluates Delta_KM against Indian annual usage standards (12,000 km/yr Petrol; 16,000 km/yr Diesel). Non-linear penalty factor adjusts value without artificial odometer caps.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                    <span className="font-bold text-slate-900 dark:text-white">3. Ownership Dilution Multiplier</span>
                    <p className="text-slate-600 dark:text-slate-400">
                      1st Owner (1.00x), 2nd Owner (0.91x, -9% discount), 3rd Owner (0.81x, -19% discount), 4th+ Owner (0.70x, -30% discount).
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                    <span className="font-bold text-slate-900 dark:text-white">4. Additive SHAP Feature Attribution</span>
                    <p className="text-slate-600 dark:text-slate-400">
                      Decomposes final price into distinct, auditable INR additions and subtractions for age, mileage, condition, brand equity, and region.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'apis' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  APIs & Computer Vision Inspection Architecture
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-lg bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                    <span className="font-bold text-slate-900 dark:text-white">Google Gemini Multimodal Vision API</span>
                    <p className="text-slate-600 dark:text-slate-400">
                      Receives user car photographs and analyzes visual features:
                    </p>
                    <ul className="list-disc pl-5 text-slate-500 space-y-0.5 mt-1">
                      <li>Distinguishes hatchbacks (Swift) from large SUVs (Scorpio-N).</li>
                      <li>Extracts facelift generation and trim badging.</li>
                      <li>Detects scratch depth, dents, and repainted panel counts.</li>
                    </ul>
                  </div>

                  <div className="p-3 rounded-lg bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                    <span className="font-bold text-slate-900 dark:text-white">POST /api/calculate-valuation</span>
                    <p className="text-slate-600 dark:text-slate-400">
                      Receives 18 vehicle attributes and executes econometric pricing in under 20ms.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                    <span className="font-bold text-slate-900 dark:text-white">Client-Side Canvas 2D PNG Export Engine</span>
                    <p className="text-slate-600 dark:text-slate-400">
                      Renders transparent background-less studio car silhouettes to high-DPI PNGs entirely in-browser without third-party image latency.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Files created: <code className="font-mono text-slate-700 dark:text-slate-300">/SOFTWARE_EXPLANATION.txt</code> & <code className="font-mono text-slate-700 dark:text-slate-300">/TECH_STACK_AND_DATASETS.txt</code></span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
