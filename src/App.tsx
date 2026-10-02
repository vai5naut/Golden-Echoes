/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MemoryEntry, VisionItem, ComfortSettings, MemoryPrompt } from './types';
import { 
  INITIAL_MEMORIES, INITIAL_VISIONS, DEFAULT_SETTINGS,
  HERO_JOURNAL_IMAGE, COASTAL_WALK_IMAGE, COTTAGE_GARDEN_IMAGE, FAMILY_TABLE_IMAGE,
  COZY_MORNING_IMAGE, ART_STUDIO_IMAGE, MOUNTAIN_LAKE_IMAGE, FIRESIDE_HEARTH_IMAGE
} from './data/seedData';
import { soundscapes, SoundscapeType } from './utils/soundscapes';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { JournalSection } from './components/JournalSection';
import { VisionBoard } from './components/VisionBoard';
import { GentleMoments } from './components/GentleMoments';
import { MemoryComposer } from './components/MemoryComposer';
import { BookletModal } from './components/BookletModal';
import { SettingsModal } from './components/SettingsModal';

const STORAGE_KEY_MEMORIES = 'golden_echo_memories_v3';
const STORAGE_KEY_VISIONS = 'golden_echo_visions_v3';
const STORAGE_KEY_SETTINGS = 'golden_echo_settings_v2';

const resolveImagePath = (url?: string): string | undefined => {
  if (!url) return undefined;
  if (url.includes('hero_keepsake_journal')) return HERO_JOURNAL_IMAGE;
  if (url.includes('vision_coastal_walk')) return COASTAL_WALK_IMAGE;
  if (url.includes('vision_cottage_garden')) return COTTAGE_GARDEN_IMAGE;
  if (url.includes('vision_family_table')) return FAMILY_TABLE_IMAGE;
  if (url.includes('vision_cozy_morning')) return COZY_MORNING_IMAGE;
  if (url.includes('vision_art_studio')) return ART_STUDIO_IMAGE;
  if (url.includes('vision_mountain_lake')) return MOUNTAIN_LAKE_IMAGE;
  if (url.includes('vision_fireside_hearth')) return FIRESIDE_HEARTH_IMAGE;
  return url;
};

export default function App() {
  // Application Data States with LocalStorage Persistence
  const [memories, setMemories] = useState<MemoryEntry[]>(() => {
    try {
      // Check v3 key first
      const savedV3 = localStorage.getItem(STORAGE_KEY_MEMORIES);
      if (savedV3) {
        const parsed: MemoryEntry[] = JSON.parse(savedV3);
        const filtered = parsed.filter(m => !['mem-1', 'mem-2', 'mem-3'].includes(m.id));
        return filtered.map(m => ({
          ...m,
          photoUrl: resolveImagePath(m.photoUrl),
        }));
      }

      // Check older v2 key and filter out default initial additions ('mem-1', 'mem-2', 'mem-3')
      const savedV2 = localStorage.getItem('golden_echo_memories_v2');
      if (savedV2) {
        const parsed: MemoryEntry[] = JSON.parse(savedV2);
        const userAddedOnly = parsed.filter(m => !['mem-1', 'mem-2', 'mem-3'].includes(m.id));
        return userAddedOnly.map(m => ({
          ...m,
          photoUrl: resolveImagePath(m.photoUrl),
        }));
      }

      return INITIAL_MEMORIES;
    } catch {
      return INITIAL_MEMORIES;
    }
  });

  const [visions, setVisions] = useState<VisionItem[]>(() => {
    try {
      // Check v3 key first
      const savedV3 = localStorage.getItem(STORAGE_KEY_VISIONS);
      if (savedV3) {
        const parsed: VisionItem[] = JSON.parse(savedV3);
        const filtered = parsed.filter(v => !['vis-1', 'vis-2', 'vis-3', 'vis-4', 'vis-5'].includes(v.id));
        return filtered.map(v => ({
          ...v,
          imageUrl: resolveImagePath(v.imageUrl),
        }));
      }

      // Check older v2 key and filter out default initial additions ('vis-1' to 'vis-5')
      const savedV2 = localStorage.getItem('golden_echo_visions_v2');
      if (savedV2) {
        const parsed: VisionItem[] = JSON.parse(savedV2);
        const userAddedOnly = parsed.filter(v => !['vis-1', 'vis-2', 'vis-3', 'vis-4', 'vis-5'].includes(v.id));
        return userAddedOnly.map(v => ({
          ...v,
          imageUrl: resolveImagePath(v.imageUrl),
        }));
      }

      return INITIAL_VISIONS;
    } catch {
      return INITIAL_VISIONS;
    }
  });

  const [settings, setSettings] = useState<ComfortSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<'journal' | 'vision' | 'moments'>('journal');

  // Modals & Composer States
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<MemoryEntry | null>(null);
  const [activePromptForDraft, setActivePromptForDraft] = useState<MemoryPrompt | null>(null);
  const [isBookletOpen, setIsBookletOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Soundscape State
  const [isPlayingSoundscape, setIsPlayingSoundscape] = useState(false);
  const [currentSoundscape, setCurrentSoundscape] = useState<SoundscapeType | null>('fireplace');

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MEMORIES, JSON.stringify(memories));
    } catch {
      // ignore quota errors
    }
  }, [memories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_VISIONS, JSON.stringify(visions));
    } catch {
      // ignore quota errors
    }
  }, [visions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  // Apply visual settings to document
  useEffect(() => {
    document.documentElement.style.setProperty('--app-font-scale', String(settings.fontScale));
    
    // Apply body theme classes
    document.body.classList.remove('theme-warm-parchment', 'theme-sepia', 'theme-high-contrast', 'theme-twilight');
    document.body.classList.add(`theme-${settings.colorTheme}`);

    // Manage scroll behavior for reduced motion
    if (settings.reducedMotion) {
      document.documentElement.style.scrollBehavior = 'auto';
    } else {
      document.documentElement.style.scrollBehavior = 'smooth';
    }
  }, [settings]);

  // Soundscape handlers
  const handleToggleSoundscape = () => {
    if (isPlayingSoundscape) {
      soundscapes.stop();
      setIsPlayingSoundscape(false);
    } else {
      const type = currentSoundscape || 'fireplace';
      soundscapes.play(type, 0.35);
      setCurrentSoundscape(type);
      setIsPlayingSoundscape(true);
    }
  };

  const handleChangeSoundscape = (type: SoundscapeType) => {
    setCurrentSoundscape(type);
    soundscapes.play(type, 0.35);
    setIsPlayingSoundscape(true);
  };

  // Memory CRUD
  const handleSaveMemory = (entryData: Omit<MemoryEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingMemory) {
      setMemories(prev => prev.map(m => m.id === editingMemory.id ? {
        ...m,
        ...entryData,
        updatedAt: new Date().toISOString(),
      } : m));
    } else {
      const newEntry: MemoryEntry = {
        ...entryData,
        id: `mem-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setMemories(prev => [newEntry, ...prev]);
    }

    setIsComposerOpen(false);
    setEditingMemory(null);
    setActivePromptForDraft(null);
  };

  const handleEditMemory = (memory: MemoryEntry) => {
    setEditingMemory(memory);
    setActivePromptForDraft(null);
    setIsComposerOpen(true);
  };

  const handleDeleteMemory = (id: string) => {
    setMemories(prev => prev.filter(m => m.id !== id));
  };

  const handleToggleFavorite = (id: string) => {
    setMemories(prev => prev.map(m => m.id === id ? { ...m, isFavorite: !m.isFavorite } : m));
  };

  const handlePromptSelect = (prompt: MemoryPrompt) => {
    setActivePromptForDraft(prompt);
    setEditingMemory(null);
    setIsComposerOpen(true);
  };

  const handleStartMemoryWithPrompt = (promptText: string, suggestedTitle?: string) => {
    setActivePromptForDraft({
      id: `custom-${Date.now()}`,
      text: promptText,
      era: 'everyday',
      eraLabel: 'Everyday Joys',
      followUp: ''
    });
    setEditingMemory({
      id: '',
      title: suggestedTitle || '',
      text: '',
      era: 'everyday',
      mood: 'Loved',
      createdAt: '',
      updatedAt: '',
    });
    setIsComposerOpen(true);
  };

  // Vision CRUD
  const handleAddVision = (visionData: Omit<VisionItem, 'id' | 'createdAt'>) => {
    const newItem: VisionItem = {
      ...visionData,
      id: `vis-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    setVisions(prev => [newItem, ...prev]);
  };

  const handleToggleVisionComplete = (id: string) => {
    setVisions(prev => prev.map(v => v.id === id ? {
      ...v,
      completed: !v.completed,
      completedAt: !v.completed ? new Date().toISOString() : undefined,
    } : v));
  };

  const handleDeleteVision = (id: string) => {
    setVisions(prev => prev.filter(v => v.id !== id));
  };

  // Archive restore & reset
  const handleImportData = (imported: { memories: MemoryEntry[]; visions: VisionItem[]; settings?: ComfortSettings }) => {
    setMemories(imported.memories);
    setVisions(imported.visions);
    if (imported.settings) setSettings(imported.settings);
  };

  const handleResetToDefaults = () => {
    setMemories([]);
    setVisions([]);
    setSettings(DEFAULT_SETTINGS);
    try {
      localStorage.removeItem(STORAGE_KEY_MEMORIES);
      localStorage.removeItem(STORAGE_KEY_VISIONS);
      localStorage.removeItem('golden_echo_memories_v2');
      localStorage.removeItem('golden_echo_visions_v2');
    } catch {
      // ignore
    }
  };

  // Dynamic theme container styling
  const themeBgClasses = {
    'warm-parchment': 'bg-[#FAF7F2] text-stone-900',
    'sepia': 'bg-[#F5EDE1] text-amber-950',
    'high-contrast': 'bg-white text-black',
    'twilight': 'bg-stone-900 text-stone-100',
  }[settings.colorTheme];

  const favoriteCount = memories.filter(m => m.isFavorite).length;

  return (
    <div className={`min-h-screen flex flex-col transition-colors ${themeBgClasses}`}>
      
      {/* Top Bar Contract (Brand - 4 Nav Links - Primary Utility Actions) */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenNewMemory={() => {
          setEditingMemory(null);
          setActivePromptForDraft(null);
          setIsComposerOpen(true);
        }}
        onOpenBooklet={() => setIsBookletOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isPlayingSoundscape={isPlayingSoundscape}
        currentSoundscape={currentSoundscape}
        onToggleSoundscape={handleToggleSoundscape}
      />

      {/* Main Content Viewport */}
      <main id="main" className="flex-1">
        
        {/* Editorial Hero Section with Archival Anchor */}
        <HeroSection
          memoryCount={memories.length}
          visionCount={visions.length}
          favoriteCount={favoriteCount}
          onWriteMemory={() => {
            setEditingMemory(null);
            setActivePromptForDraft(null);
            setIsComposerOpen(true);
          }}
          onExploreVisions={() => setActiveTab('vision')}
        />

        {/* Tabbed Content Sections */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          
          {activeTab === 'journal' && (
            <JournalSection
              memories={memories}
              onSelectPromptToDraft={handlePromptSelect}
              onOpenNewMemory={() => {
                setEditingMemory(null);
                setActivePromptForDraft(null);
                setIsComposerOpen(true);
              }}
              onEditMemory={handleEditMemory}
              onDeleteMemory={handleDeleteMemory}
              onToggleFavorite={handleToggleFavorite}
            />
          )}

          {activeTab === 'vision' && (
            <VisionBoard
              visions={visions}
              onAddVision={handleAddVision}
              onToggleComplete={handleToggleVisionComplete}
              onDeleteVision={handleDeleteVision}
            />
          )}

          {activeTab === 'moments' && (
            <GentleMoments
              onStartMemoryWithPrompt={handleStartMemoryWithPrompt}
              isPlayingSoundscape={isPlayingSoundscape}
              currentSoundscape={currentSoundscape}
              onSoundscapeChange={handleChangeSoundscape}
              onToggleSoundscape={handleToggleSoundscape}
            />
          )}

        </div>

      </main>

      {/* Modals & Dialogs */}
      {isComposerOpen && (
        <MemoryComposer
          initialPrompt={activePromptForDraft}
          editingEntry={editingMemory}
          onSave={handleSaveMemory}
          onCancel={() => {
            setIsComposerOpen(false);
            setEditingMemory(null);
            setActivePromptForDraft(null);
          }}
        />
      )}

      {isBookletOpen && (
        <BookletModal
          memories={memories}
          onClose={() => setIsBookletOpen(false)}
        />
      )}

      {isSettingsOpen && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={newS => setSettings(prev => ({ ...prev, ...newS }))}
          memories={memories}
          visions={visions}
          onImportData={handleImportData}
          onResetToDefaults={handleResetToDefaults}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {/* Dignified Archival Footer */}
      <footer className="border-t border-stone-200/80 bg-stone-100/70 py-10 text-stone-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans">
          <div className="flex items-center gap-2">
            <span className="font-serif font-semibold text-stone-900 text-sm">Golden Echo</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>A gentle home for memory, legacy, and hope</span>
          </div>

          <div className="flex items-center gap-4 text-stone-500">
            <button
              onClick={() => setIsBookletOpen(true)}
              className="hover:text-stone-900 transition-colors"
            >
              Print Heirloom Book
            </button>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="hover:text-stone-900 transition-colors"
            >
              Accessibility & Privacy
            </button>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>Local & Private</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
