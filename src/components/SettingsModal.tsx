import React, { useRef, useState } from 'react';
import { X, Type, Eye, Download, Upload, RotateCcw, Volume2, ShieldCheck } from 'lucide-react';
import { ComfortSettings, ColorTheme, MemoryEntry, VisionItem } from '../types';
import { getAudioBlob, blobToBase64, base64ToBlob, saveAudioBlob, clearAllAudio } from '../utils/audioStorage';

interface SettingsModalProps {
  settings: ComfortSettings;
  onUpdateSettings: (newSettings: Partial<ComfortSettings>) => void;
  memories: MemoryEntry[];
  visions: VisionItem[];
  onImportData: (importedData: { memories: MemoryEntry[]; visions: VisionItem[]; settings?: ComfortSettings }) => void;
  onResetToDefaults: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  memories,
  visions,
  onImportData,
  onResetToDefaults,
  onClose,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const fontOptions = [
    { label: 'Standard', scale: 1.0, preview: 'Aa' },
    { label: 'Large', scale: 1.15, preview: 'Aa' },
    { label: 'Extra Large', scale: 1.3, preview: 'Aa' },
  ];

  const themeOptions: { id: ColorTheme; label: string; desc: string; bgClass: string }[] = [
    { id: 'warm-parchment', label: 'Warm Parchment', desc: 'Serene archival paper tone', bgClass: 'bg-[#FAF7F2] border-stone-300' },
    { id: 'sepia', label: 'Antique Sepia', desc: 'Warm amber glow', bgClass: 'bg-[#F4ECE1] border-amber-300' },
    { id: 'high-contrast', label: 'High Contrast', desc: 'Crisp white & dark ink for visual clarity', bgClass: 'bg-white border-black' },
    { id: 'twilight', label: 'Soft Twilight', desc: 'Gentle dark slate for evening reflection', bgClass: 'bg-stone-900 border-stone-700 text-white' },
  ];

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const memoriesWithAudio = await Promise.all(
        memories.map(async (m) => {
          if (m.hasVoiceNote) {
            try {
              const blob = await getAudioBlob(m.id);
              if (blob) {
                const base64 = await blobToBase64(blob);
                return { ...m, voiceNoteBase64: base64 };
              }
            } catch (e) {
              console.warn('Could not read audio blob for export:', e);
            }
          }
          return m;
        })
      );

      const backupData = {
        app: 'Golden Echo',
        version: '3.0',
        exportedAt: new Date().toISOString(),
        memories: memoriesWithAudio,
        visions,
        settings,
      };

      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `golden-echo-archive-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Export failed:', e);
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed.memories) && Array.isArray(parsed.visions)) {
          const sanitizedMemories = await Promise.all(
            parsed.memories.map(async (m: MemoryEntry & { voiceNoteBase64?: string }) => {
              const base64 = m.voiceNoteBase64 || (m.voiceNoteUrl?.startsWith('data:audio') ? m.voiceNoteUrl : undefined);
              if (base64) {
                try {
                  const blob = base64ToBlob(base64);
                  await saveAudioBlob(m.id, blob, m.voiceNoteDuration);
                  return {
                    ...m,
                    hasVoiceNote: true,
                    voiceNoteUrl: undefined,
                    voiceNoteBase64: undefined,
                  };
                } catch (err) {
                  console.warn('Could not restore audio blob:', err);
                }
              }
              return {
                ...m,
                voiceNoteBase64: undefined,
              };
            })
          );

          onImportData({
            memories: sanitizedMemories,
            visions: parsed.visions,
            settings: parsed.settings,
          });
          setNotice('Heirloom archive successfully restored.');
          setTimeout(() => onClose(), 800);
        } else {
          setNotice('The selected file does not appear to be a valid Golden Echo archive.');
        }
      } catch {
        setNotice('Could not parse the backup file.');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = async () => {
    if (confirm('Clear archive and start fresh with an empty canvas? (Settings will also reset to default)')) {
      await clearAllAudio();
      onResetToDefaults();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative my-8 w-full max-w-2xl rounded-2xl border border-stone-300 bg-white p-6 sm:p-8 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
              Preferences & Accessibility
            </span>
            <h2 className="font-serif text-2xl font-medium text-stone-900">
              Reading Comfort & Data Privacy
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 space-y-7">
          
          {/* 1. Text Sizing */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Type className="h-4 w-4 text-stone-500" />
              <label className="text-sm font-semibold text-stone-800">
                Text Sizing
              </label>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {fontOptions.map(opt => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => onUpdateSettings({ fontScale: opt.scale })}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-colors ${
                    settings.fontScale === opt.scale
                      ? 'border-stone-900 bg-stone-900 text-white font-semibold shadow-xs'
                      : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span className="text-lg font-serif mb-1">{opt.preview}</span>
                  <span className="text-xs">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Visual Contrast & Themes */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Eye className="h-4 w-4 text-stone-500" />
              <label className="text-sm font-semibold text-stone-800">
                Visual Contrast & Mood
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {themeOptions.map(theme => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => onUpdateSettings({ colorTheme: theme.id })}
                  className={`flex flex-col items-start p-3.5 rounded-xl border text-left transition-all ${theme.bgClass} ${
                    settings.colorTheme === theme.id
                      ? 'ring-2 ring-stone-900 shadow-xs'
                      : 'opacity-85 hover:opacity-100'
                  }`}
                >
                  <span className="font-semibold text-xs sm:text-sm">{theme.label}</span>
                  <span className="text-xs opacity-75 mt-0.5">{theme.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Read Aloud Cadence */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Volume2 className="h-4 w-4 text-stone-500" />
              <label className="text-sm font-semibold text-stone-800">
                Read-Aloud Voice Cadence
              </label>
            </div>
            <div className="flex gap-2">
              {[
                { label: 'Gentle & Measured (0.85x)', speed: 0.85 },
                { label: 'Natural Pace (1.0x)', speed: 1.0 },
                { label: 'Brisk (1.15x)', speed: 1.15 },
              ].map(opt => (
                <button
                  key={opt.speed}
                  type="button"
                  onClick={() => onUpdateSettings({ readingSpeed: opt.speed })}
                  className={`flex-1 py-2 px-3 rounded-lg border text-xs font-medium transition-colors ${
                    settings.readingSpeed === opt.speed
                      ? 'border-stone-900 bg-stone-900 text-white'
                      : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Reduced Motion */}
          <div className="flex items-center justify-between border-t border-stone-200 pt-4">
            <div>
              <span className="text-sm font-semibold text-stone-800 block">
                Reduced Motion
              </span>
              <span className="text-xs text-stone-500">
                Minimizes animations and page scrolling movement.
              </span>
            </div>
            <button
              type="button"
              onClick={() => onUpdateSettings({ reducedMotion: !settings.reducedMotion })}
              className={`h-6 w-11 rounded-full p-1 transition-colors ${
                settings.reducedMotion ? 'bg-amber-800' : 'bg-stone-300'
              }`}
            >
              <div
                className={`h-4 w-4 rounded-full bg-white transition-transform ${
                  settings.reducedMotion ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 5. Local-First Privacy Notice */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 text-xs text-emerald-950 flex items-start gap-2.5">
            <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block">Your Private Haven</span>
              <span>All your memories, thoughts, recordings, and vision items are saved securely in your browser's private storage. Nothing is transmitted to external servers without your action.</span>
            </div>
          </div>

          {/* 6. Archive Backup & Import */}
          <div className="border-t border-stone-200 pt-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-600 block mb-3">
              Backup & Family Archiving
            </span>
            {notice && (
              <div className="mb-3 rounded-xl bg-amber-50 border border-amber-200 p-2.5 text-xs text-stone-800">
                {notice}
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center gap-1.5 rounded-lg border border-stone-300 bg-stone-50 px-3.5 py-2 text-xs font-semibold text-stone-800 hover:bg-stone-100 disabled:opacity-50 cursor-pointer"
              >
                <Download className="h-3.5 w-3.5 text-stone-600" />
                <span>{isExporting ? 'Preparing Archive...' : 'Export Archive (.json)'}</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 rounded-lg border border-stone-300 bg-stone-50 px-3.5 py-2 text-xs font-semibold text-stone-800 hover:bg-stone-100 cursor-pointer"
              >
                <Upload className="h-3.5 w-3.5 text-stone-600" />
                <span>Restore Archive</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />

              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-semibold text-rose-800 hover:bg-rose-100 ml-auto cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5 text-rose-600" />
                <span>Start Fresh (Clear Archive)</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
