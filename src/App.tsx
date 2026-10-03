import React, { useState, useEffect } from 'react';
import { MemoryEntry, VisionItem, ComfortSettings, MemoryPrompt, VisionCategory } from './types';
import { 
  INITIAL_MEMORIES, INITIAL_VISIONS, DEFAULT_SETTINGS,
  HERO_JOURNAL_IMAGE, COASTAL_WALK_IMAGE, COTTAGE_GARDEN_IMAGE, FAMILY_TABLE_IMAGE,
  COZY_MORNING_IMAGE, ART_STUDIO_IMAGE, MOUNTAIN_LAKE_IMAGE, FIRESIDE_HEARTH_IMAGE
} from './data/seedData';
import { soundscapes, SoundscapeType } from './utils/soundscapes';
import { saveAudioBlob, deleteAudioBlob, clearAllAudio, base64ToBlob } from './utils/audioStorage';
import { Header, MainTabType } from './components/Header';
import { TodaySection } from './components/TodaySection';
import { JournalSection } from './components/JournalSection';
import { VisionBoard } from './components/VisionBoard';
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
      const savedV3 = localStorage.getItem(STORAGE_KEY_MEMORIES);
      if (savedV3) {
        const parsed: MemoryEntry[] = JSON.parse(savedV3);
        const filtered = parsed.filter(m => !['mem-1', 'mem-2', 'mem-3'].includes(m.id));
        return filtered.map(m => ({
          ...m,
          photoUrl: resolveImagePath(m.photoUrl),
        }));
      }

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
      const savedV3 = localStorage.getItem(STORAGE_KEY_VISIONS);
      if (savedV3) {
        const parsed: VisionItem[] = JSON.parse(savedV3);
        const filtered = parsed.filter(v => !['vis-1', 'vis-2', 'vis-3', 'vis-4', 'vis-5'].includes(v.id));
        return filtered.map(v => ({
          ...v,
          imageUrl: resolveImagePath(v.imageUrl),
        }));
      }

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

  // 4 Primary Navigation Destinations: Today, My Stories, Looking Forward, Keepsake
  const [activeTab, setActiveTab] = useState<MainTabType>('today');

  // Modals & Composer States
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<MemoryEntry | null>(null);
  const [activePromptForDraft, setActivePromptForDraft] = useState<MemoryPrompt | null>(null);
  const [isBookletOpen, setIsBookletOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Seed data when carrying forward a hope from a memory
  const [forwardSeed, setForwardSeed] = useState<{ title?: string; step?: string; origin?: string } | null>(null);

  // Soundscape State
  const [isPlayingSoundscape, setIsPlayingSoundscape] = useState(false);
  const [currentSoundscape, setCurrentSoundscape] = useState<SoundscapeType | null>('fireplace');

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MEMORIES, JSON.stringify(memories));
    } catch {
      // ignore quota
    }
  }, [memories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_VISIONS, JSON.stringify(visions));
    } catch {
      // ignore quota
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
    
    document.body.classList.remove('theme-warm-parchment', 'theme-sepia', 'theme-high-contrast', 'theme-twilight');
    document.body.classList.add(`theme-${settings.colorTheme}`);

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

  // Graceful migration: move any legacy base64 audio recordings into IndexedDB Blobs
  useEffect(() => {
    const legacyMemories = memories.filter(m => m.voiceNoteUrl && m.voiceNoteUrl.startsWith('data:audio'));
    if (legacyMemories.length > 0) {
      Promise.all(
        legacyMemories.map(async m => {
          try {
            const blob = base64ToBlob(m.voiceNoteUrl!);
            await saveAudioBlob(m.id, blob, m.voiceNoteDuration);
          } catch (e) {
            console.warn('Migration failed for voice note:', m.id, e);
          }
        })
      ).then(() => {
        setMemories(prev =>
          prev.map(m =>
            m.voiceNoteUrl?.startsWith('data:audio')
              ? { ...m, hasVoiceNote: true, voiceNoteUrl: undefined }
              : m
          )
        );
      });
    }
  }, []);

  // Memory CRUD & Core Journey Flow: REMEMBER → PRESERVE → REFLECT → LOOK FORWARD
  const handleSaveMemory = async (
    entryData: Omit<MemoryEntry, 'id' | 'createdAt' | 'updatedAt'>,
    carryForward?: { title: string; smallStep: string; category?: VisionCategory },
    audioBlob?: Blob
  ) => {
    let memoryId = editingMemory?.id;

    if (editingMemory && memoryId) {
      if (audioBlob) {
        await saveAudioBlob(memoryId, audioBlob, entryData.voiceNoteDuration);
      } else if (!entryData.hasVoiceNote && editingMemory.hasVoiceNote) {
        // User explicitly cleared/removed the voice note
        await deleteAudioBlob(memoryId);
      }

      setMemories(prev => prev.map(m => m.id === memoryId ? {
        ...m,
        ...entryData,
        hasVoiceNote: Boolean(audioBlob || (entryData.hasVoiceNote && m.hasVoiceNote)),
        voiceNoteUrl: undefined, // keep large base64 data out of localStorage
        updatedAt: new Date().toISOString(),
      } : m));
    } else {
      memoryId = `mem-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      if (audioBlob) {
        await saveAudioBlob(memoryId, audioBlob, entryData.voiceNoteDuration);
      }
      const newEntry: MemoryEntry = {
        ...entryData,
        id: memoryId,
        hasVoiceNote: Boolean(audioBlob || entryData.hasVoiceNote),
        voiceNoteUrl: undefined, // keep large base64 data out of localStorage
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setMemories(prev => [newEntry, ...prev]);
    }

    // Step 4: If user chose to carry forward a little of this memory into a future intention
    if (carryForward && carryForward.title.trim()) {
      const newHope: VisionItem = {
        id: `vis-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        title: carryForward.title.trim(),
        category: carryForward.category || 'Simple Joys',
        timeHorizon: 'This Season',
        smallStep: carryForward.smallStep.trim() || 'Notice and welcome this possibility today.',
        originMemoryId: memoryId,
        originMemoryTitle: entryData.title,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setVisions(prev => [newHope, ...prev]);
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
    deleteAudioBlob(id).catch(console.error);
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

  const handleStartStoryWithPrompt = (promptText: string, suggestedTitle?: string) => {
    setActivePromptForDraft({
      id: `prompt-${Date.now()}`,
      text: promptText,
      era: 'roots',
      eraLabel: 'Roots & Childhood',
      followUp: '',
    });
    setEditingMemory({
      id: '',
      title: suggestedTitle || '',
      text: '',
      era: 'roots',
      mood: 'Loved',
      createdAt: '',
      updatedAt: '',
    });
    setIsComposerOpen(true);
  };

  const handleCarryForwardFromMemory = (memory: MemoryEntry) => {
    setForwardSeed({
      title: `Experience or make something inspired by "${memory.title}"`,
      step: 'Notice a time this week to carry this forward',
      origin: memory.title,
    });
    setActiveTab('forward');
  };

  // Vision / Looking Forward CRUD
  const handleAddVision = (visionData: Omit<VisionItem, 'id' | 'createdAt'>) => {
    const newItem: VisionItem = {
      ...visionData,
      id: `vis-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    setVisions(prev => [newItem, ...prev]);
    setForwardSeed(null);
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

  const handleResetToDefaults = async () => {
    await clearAllAudio().catch(console.error);
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

  return (
    <div className={`min-h-screen flex flex-col transition-colors ${themeBgClasses}`}>
      
      {/* Top Header: Brand Wordmark & 4 Clear Destinations: Today, My Stories, Looking Forward, Keepsake */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenNewMemory={() => {
          setEditingMemory(null);
          setActivePromptForDraft(null);
          setIsComposerOpen(true);
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isPlayingSoundscape={isPlayingSoundscape}
        currentSoundscape={currentSoundscape}
        onToggleSoundscape={handleToggleSoundscape}
      />

      {/* Main Content Viewport */}
      <main id="main" className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          
          {/* 1. Destination: TODAY (Home experience with Today's Echo) */}
          {activeTab === 'today' && (
            <TodaySection
              onStartStoryWithPrompt={handleStartStoryWithPrompt}
              onNavigateToStories={() => setActiveTab('stories')}
              onNavigateToForward={() => setActiveTab('forward')}
              memories={memories}
              isPlayingSoundscape={isPlayingSoundscape}
              currentSoundscape={currentSoundscape}
              onSoundscapeChange={handleChangeSoundscape}
              onToggleSoundscape={handleToggleSoundscape}
            />
          )}

          {/* 2. Destination: MY STORIES (Memory Archive) */}
          {activeTab === 'stories' && (
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
              onCarryForward={handleCarryForwardFromMemory}
            />
          )}

          {/* 3. Destination: LOOKING FORWARD (Things I'm Looking Forward To) */}
          {activeTab === 'forward' && (
            <VisionBoard
              visions={visions}
              onAddVision={handleAddVision}
              onToggleComplete={handleToggleVisionComplete}
              onDeleteVision={handleDeleteVision}
              initialAddTitle={forwardSeed?.title}
              initialAddStep={forwardSeed?.step}
              originMemoryTitle={forwardSeed?.origin}
            />
          )}

          {/* 4. Destination: KEEPSAKE (Heirloom Book Experience) */}
          {activeTab === 'keepsake' && (
            <BookletModal
              isInlineView={true}
              memories={memories}
              visions={visions}
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
          visions={visions}
          onClose={() => setIsBookletOpen(false)}
        />
      )}

      {isSettingsOpen && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={(newSettings) => setSettings(prev => ({ ...prev, ...newSettings }))}
          onResetToDefaults={handleResetToDefaults}
          memories={memories}
          visions={visions}
          onImportData={handleImportData}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

    </div>
  );
}
