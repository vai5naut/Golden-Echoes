import React from 'react';
import { BookOpen, Sparkles, HeartHandshake, BookMarked, Settings, Volume2, VolumeX, Plus } from 'lucide-react';
import { SoundscapeType } from '../utils/soundscapes';

interface HeaderProps {
  activeTab: 'journal' | 'vision' | 'moments';
  onSelectTab: (tab: 'journal' | 'vision' | 'moments') => void;
  onOpenNewMemory: () => void;
  onOpenBooklet: () => void;
  onOpenSettings: () => void;
  isPlayingSoundscape: boolean;
  currentSoundscape: SoundscapeType | null;
  onToggleSoundscape: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenNewMemory,
  onOpenBooklet,
  onOpenSettings,
  isPlayingSoundscape,
  currentSoundscape,
  onToggleSoundscape,
}) => {
  const soundscapeNames: Record<SoundscapeType, string> = {
    fireplace: 'Hearth Fire',
    rain: 'Summer Rain',
    garden_birds: 'Songbirds',
    vinyl: 'Vinyl Warmth',
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-stone-200/80 bg-stone-50/90 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Zone 1: Single text element Brand Wordmark */}
        <a
          href="#main"
          className="font-serif text-2xl font-semibold tracking-tight text-stone-900 transition-opacity hover:opacity-85 sm:text-3xl"
          aria-label="Golden Echo Home"
        >
          Golden Echo
        </a>

        {/* Zone 2: Clean 4 Nav links with subtle hover underlines */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
          <button
            onClick={() => onSelectTab('journal')}
            className={`flex items-center gap-2 pb-0.5 transition-colors ${
              activeTab === 'journal'
                ? 'font-semibold text-stone-950 underline decoration-amber-700 decoration-2 underline-offset-8'
                : 'hover:text-stone-900'
            }`}
          >
            <BookOpen className="h-4 w-4 text-stone-500" />
            <span className="whitespace-nowrap">Memory Journal</span>
          </button>

          <button
            onClick={() => onSelectTab('vision')}
            className={`flex items-center gap-2 pb-0.5 transition-colors ${
              activeTab === 'vision'
                ? 'font-semibold text-stone-950 underline decoration-amber-700 decoration-2 underline-offset-8'
                : 'hover:text-stone-900'
            }`}
          >
            <Sparkles className="h-4 w-4 text-stone-500" />
            <span className="whitespace-nowrap">Vision Board</span>
          </button>

          <button
            onClick={() => onSelectTab('moments')}
            className={`flex items-center gap-2 pb-0.5 transition-colors ${
              activeTab === 'moments'
                ? 'font-semibold text-stone-950 underline decoration-amber-700 decoration-2 underline-offset-8'
                : 'hover:text-stone-900'
            }`}
          >
            <HeartHandshake className="h-4 w-4 text-stone-500" />
            <span className="whitespace-nowrap">Gentle Moments</span>
          </button>

          <button
            onClick={onOpenBooklet}
            className="flex items-center gap-2 pb-0.5 text-stone-600 transition-colors hover:text-stone-950"
            title="Read or print your memories as an heirloom booklet"
          >
            <BookMarked className="h-4 w-4 text-stone-500" />
            <span className="whitespace-nowrap">Heirloom Book</span>
          </button>
        </nav>

        {/* Zone 3: Primary utility actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Ambient Sound Quick Toggle */}
          <button
            onClick={onToggleSoundscape}
            className={`group relative flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
              isPlayingSoundscape
                ? 'border-amber-300 bg-amber-100/80 text-amber-950 shadow-xs'
                : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-100 hover:text-stone-900'
            }`}
            title={isPlayingSoundscape ? `Playing ${currentSoundscape ? soundscapeNames[currentSoundscape] : 'Audio'}` : 'Start relaxing ambient sound'}
            aria-label={isPlayingSoundscape ? 'Stop ambient audio' : 'Play ambient audio'}
          >
            {isPlayingSoundscape ? (
              <>
                <Volume2 className="h-4 w-4 text-amber-800 animate-pulse" />
                <span className="hidden lg:inline whitespace-nowrap">
                  {currentSoundscape ? soundscapeNames[currentSoundscape] : 'Ambient'}
                </span>
              </>
            ) : (
              <>
                <VolumeX className="h-4 w-4 text-stone-500" />
                <span className="hidden lg:inline whitespace-nowrap">Soundscapes</span>
              </>
            )}
          </button>

          {/* Reading & Comfort Settings */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-medium text-stone-700 transition-colors hover:bg-stone-100 hover:text-stone-950"
            title="Adjust text size and reading comfort"
            aria-label="Reading Comfort Settings"
          >
            <Settings className="h-4 w-4 text-stone-500" />
            <span className="hidden sm:inline whitespace-nowrap">Comfort</span>
          </button>

          {/* Primary Action Button */}
          <button
            onClick={onOpenNewMemory}
            className="flex items-center gap-1.5 rounded-lg bg-stone-900 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-stone-800 focus-visible:outline-2"
          >
            <Plus className="h-4 w-4 text-amber-200" />
            <span className="whitespace-nowrap">New Memory</span>
          </button>
        </div>

      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="flex md:hidden border-t border-stone-200/80 bg-stone-100/90 px-3 py-2 justify-around text-xs">
        <button
          onClick={() => onSelectTab('journal')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-md ${
            activeTab === 'journal' ? 'font-semibold text-stone-950 bg-stone-200/60' : 'text-stone-600'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Journal</span>
        </button>

        <button
          onClick={() => onSelectTab('vision')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-md ${
            activeTab === 'vision' ? 'font-semibold text-stone-950 bg-stone-200/60' : 'text-stone-600'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>Vision Board</span>
        </button>

        <button
          onClick={() => onSelectTab('moments')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-md ${
            activeTab === 'moments' ? 'font-semibold text-stone-950 bg-stone-200/60' : 'text-stone-600'
          }`}
        >
          <HeartHandshake className="h-4 w-4" />
          <span>Moments</span>
        </button>

        <button
          onClick={onOpenBooklet}
          className="flex flex-col items-center gap-1 py-1 px-2 rounded-md text-stone-600"
        >
          <BookMarked className="h-4 w-4" />
          <span>Booklet</span>
        </button>
      </div>
    </header>
  );
};
