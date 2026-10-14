import React, { useState, useRef } from 'react';
import { useClinic } from '../../context/ClinicContext';
import {
  Upload,
  Palette,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Eye,
  Sliders,
  ArrowRight,
  ShieldCheck,
  Check,
  Stethoscope,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import { extractPaletteFromImage, getDefaultPalette } from '../../utils/colorExtraction';
import { PRESET_LOGOS } from '../../data/mockData';

export const ScreenLogoBranding: React.FC = () => {
  const { brandTheme, setBrandTheme, setCurrentStep } = useClinic();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [themeAppliedSuccess, setThemeAppliedSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processUploadedImage = async (dataUrl: string, fileName: string) => {
    setIsAnalyzing(true);
    try {
      // Analyze logo colors via canvas algorithm
      const palette = await extractPaletteFromImage(dataUrl);
      setBrandTheme({
        url: dataUrl,
        name: fileName,
        palette,
        isCustom: true,
        extractedAt: new Date().toISOString(),
      });
      setThemeAppliedSuccess(true);
      setTimeout(() => setThemeAppliedSuccess(false), 3000);
    } catch (err) {
      console.error('Error extracting palette:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          processUploadedImage(event.target.result as string, file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          processUploadedImage(event.target.result as string, file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const selectPresetLogo = (preset: typeof PRESET_LOGOS[0]) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setBrandTheme({
        url: preset.svgDataUri,
        name: preset.name,
        palette: getDefaultPalette(preset.primaryColor),
        isCustom: false,
        extractedAt: new Date().toISOString(),
      });
      setIsAnalyzing(false);
      setThemeAppliedSuccess(true);
      setTimeout(() => setThemeAppliedSuccess(false), 3000);
    }, 350);
  };

  return (
    <div className="py-10 px-4 sm:px-6 max-w-4xl mx-auto space-y-8">
      {/* Step Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-3">
          <Palette className="w-3.5 h-3.5" />
          <span>Automatic Brand Detection</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Let’s personalize your clinic
        </h2>
        <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-2xl">
          Upload your clinic logo or brand emblem. We'll automatically detect dominant colors,
          generate an accessible healthcare theme, and adapt your clinic workspace instantly.
        </p>

        {/* Preset Selector for quick testing */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Or Choose A Pre-Crafted Medical Emblem Preset:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PRESET_LOGOS.map((preset) => {
              const isSelected = brandTheme.name === preset.name;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => selectPresetLogo(preset)}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center space-x-3 ${
                    isSelected
                      ? 'border-slate-800 bg-slate-50 ring-2 ring-slate-800/10 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/60'
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                    <img
                      src={preset.svgDataUri}
                      alt={preset.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {preset.name}
                    </p>
                    <div className="flex items-center space-x-1 mt-0.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block"
                        style={{ backgroundColor: preset.primaryColor }}
                      />
                      <span className="text-[10px] text-slate-500 truncate">
                        {preset.specialtyTag}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Upload Zone */}
        <div className="mt-6">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/svg+xml, image/webp"
            onChange={handleFileChange}
            className="hidden"
          />

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-slate-800 bg-slate-50'
                : 'border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50'
            }`}
          >
            <div className="flex flex-col items-center justify-center">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-transform group-hover:scale-105"
                style={{
                  backgroundColor: brandTheme.palette.lightTint,
                  color: brandTheme.palette.primary,
                }}
              >
                {isAnalyzing ? (
                  <RefreshCw className="w-7 h-7 animate-spin" />
                ) : (
                  <Upload className="w-7 h-7" />
                )}
              </div>

              <h4 className="text-sm font-bold text-slate-900 mb-1">
                {isAnalyzing
                  ? 'Analyzing logo pixels & generating accessible palette...'
                  : 'Click to upload clinic logo or drag and drop'}
              </h4>
              <p className="text-xs text-slate-500">
                Supports PNG, JPG, SVG, or WebP (transparent or solid emblem)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Screen 9 & 10: Brand Extraction Result & Live Adaptation Preview */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <Sparkles
                className="w-4 h-4"
                style={{ color: brandTheme.palette.primary }}
              />
              <h3 className="text-lg font-bold text-slate-900">
                Your clinic theme is ready
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Automatically extracted colors with WCAG accessibility contrast adjustments.
            </p>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 underline"
          >
            Change Logo
          </button>
        </div>

        {/* Extracted Swatches row */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          {/* Active Logo Badge */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 p-1.5 shadow-2xs flex items-center justify-center">
              <img
                src={brandTheme.url}
                alt="Emblem"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Detected Emblem
              </span>
              <p className="text-xs font-semibold text-slate-900 truncate">
                {brandTheme.name}
              </p>
            </div>
          </div>

          {/* Primary Color */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-xl shadow-2xs shrink-0 border border-black/10 flex items-center justify-center"
              style={{ backgroundColor: brandTheme.palette.primary }}
            >
              <span
                className="text-[10px] font-bold"
                style={{ color: brandTheme.palette.primaryContrast }}
              >
                Aa
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Primary Brand
              </span>
              <p className="text-xs font-mono font-bold text-slate-800">
                {brandTheme.palette.primary}
              </p>
              <span className="text-[10px] text-emerald-600 font-medium">WCAG AA Pass</span>
            </div>
          </div>

          {/* Secondary Color */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-xl shadow-2xs shrink-0 border border-black/10"
              style={{ backgroundColor: brandTheme.palette.secondary }}
            />
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Secondary Color
              </span>
              <p className="text-xs font-mono font-bold text-slate-800">
                {brandTheme.palette.secondary}
              </p>
              <span className="text-[10px] text-slate-500">Supporting UI</span>
            </div>
          </div>

          {/* Accent Color */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-xl shadow-2xs shrink-0 border border-black/10"
              style={{ backgroundColor: brandTheme.palette.accent }}
            />
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Accent Color
              </span>
              <p className="text-xs font-mono font-bold text-slate-800">
                {brandTheme.palette.accent}
              </p>
              <span className="text-[10px] text-slate-500">Badges & Focus</span>
            </div>
          </div>
        </div>

        {/* Live UI Theme Adaptation Preview Sandbox */}
        <div className="rounded-xl border border-slate-200 p-5 bg-slate-50/50">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1.5">
              <Eye className="w-3.5 h-3.5" />
              <span>Theme Applied Live To Clinic Interface Components</span>
            </span>
            <span className="text-[11px] text-slate-500">Interactive Components Preview</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Primary & Secondary Buttons */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <span className="text-[11px] font-semibold text-slate-400 block uppercase">
                Branded Buttons
              </span>
              <button
                className="w-full py-2.5 px-4 rounded-lg font-semibold text-xs transition-opacity hover:opacity-95 shadow-xs"
                style={{
                  backgroundColor: brandTheme.palette.primary,
                  color: brandTheme.palette.primaryContrast,
                }}
              >
                Primary Clinic CTA
              </button>
              <button
                className="w-full py-2 px-4 rounded-lg font-medium text-xs border transition-colors"
                style={{
                  borderColor: brandTheme.palette.borderTint,
                  backgroundColor: brandTheme.palette.lightTint,
                  color: brandTheme.palette.primary,
                }}
              >
                Secondary Tonal Button
              </button>
            </div>

            {/* 2. Navigation Tab / Badge */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <span className="text-[11px] font-semibold text-slate-400 block uppercase">
                Active Nav & Indicators
              </span>
              <div className="flex items-center space-x-1 p-1 bg-slate-100 rounded-lg">
                <span
                  className="px-3 py-1 rounded-md text-xs font-bold shadow-2xs"
                  style={{
                    backgroundColor: brandTheme.palette.primary,
                    color: brandTheme.palette.primaryContrast,
                  }}
                >
                  Active Tab
                </span>
                <span className="px-3 py-1 text-xs text-slate-600 font-medium">
                  Inactive
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center space-x-1"
                  style={{
                    backgroundColor: brandTheme.palette.lightTint,
                    color: brandTheme.palette.primary,
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full mr-1"
                    style={{ backgroundColor: brandTheme.palette.primary }}
                  />
                  Open Today
                </span>
              </div>
            </div>

            {/* 3. Service Card Highlight */}
            <div
              className="bg-white p-4 rounded-xl border shadow-2xs"
              style={{ borderColor: brandTheme.palette.borderTint }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900">
                  General Consultation
                </span>
                <span
                  className="text-xs font-bold"
                  style={{ color: brandTheme.palette.primary }}
                >
                  ETB 800
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
                30-min clinical evaluation with affiliated doctor.
              </p>
              <div
                className="w-full h-1 rounded-full"
                style={{ backgroundColor: brandTheme.palette.primary }}
              />
            </div>
          </div>
        </div>

        {/* Continue Actions */}
        <div className="mt-8 pt-4 flex items-center justify-between border-t border-slate-100">
          <button
            type="button"
            onClick={() => setCurrentStep('account')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900"
          >
            Back
          </button>

          <div className="flex items-center space-x-3">
            {themeAppliedSuccess && (
              <span className="text-xs text-emerald-600 font-medium flex items-center space-x-1">
                <Check className="w-3.5 h-3.5" />
                <span>Theme generated!</span>
              </span>
            )}
            <button
              id="use-theme-continue-btn"
              onClick={() => setCurrentStep('info')}
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl font-semibold text-white shadow-xs transition-all hover:opacity-90 active:scale-[0.99]"
              style={{
                backgroundColor: brandTheme.palette.primary,
                color: brandTheme.palette.primaryContrast,
              }}
            >
              <span>Use this theme</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
