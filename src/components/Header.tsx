import React from 'react';
import { RefreshCw, Sun, Moon, ShieldCheck, Car } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  onReset: () => void;
  onOpenQuickGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onReset, 
  onOpenQuickGuide
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#090b10]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-white/[0.08] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Lockup */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#dfb76c] to-[#1d4ed8] text-black flex items-center justify-center font-display font-bold text-sm shadow-sm ring-1 ring-black/10 dark:ring-white/10">
            ₹
          </div>
          <div>
            <a href="/" className="font-display text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white hover:opacity-90 transition-opacity">
              Resale Predictor
            </a>
          </div>
        </div>

        {/* Simplified Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
          <a href="#intake" className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1.5">
            <span>Specifications</span>
          </a>
          <a href="#valuation" className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1.5">
            <span>Valuation</span>
          </a>
          <button
            type="button"
            onClick={onOpenQuickGuide}
            className="hover:text-[#c5a059] dark:hover:text-[#dfb76c] transition-colors flex items-center gap-1.5 cursor-pointer uppercase tracking-wider font-semibold"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#c5a059] dark:text-[#dfb76c]" />
            <span>RTO & NGT Rules</span>
          </button>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] transition-colors cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#dfb76c]" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Reset Intake */}
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/[0.08] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            title="Reset to default vehicle"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};
