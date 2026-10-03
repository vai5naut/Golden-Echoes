import React from 'react';
import { Sparkles, Settings, Volume2, VolumeX, Plus, Feather, BookMarked, Compass, BookOpen } from 'lucide-react';
import { SoundscapeType } from '../utils/soundscapes';

export type MainTabType = 'today' | 'stories' | 'forward' | 'keepsake';

interface HeaderProps {
  activeTab: MainTabType;
  onSelectTab: (tab: MainTabType) => void;
  onOpenNewMemory: () => void;
  onOpenSettings: () => void;
  isPlayingSoundscape: boolean;
  currentSoundscape: SoundscapeType | null;
  onToggleSoundscape: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenNewMemory,
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
    <header className="sticky top-0 z-30 w-full border-b border-stone-200/80 bg-[#FAF7F2]/95 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectTab('today')}
            className="text-left group cursor-pointer focus-visible:outline-2"
            aria-label="Golden Echo Home"
          >
            <span className="font-serif text-2xl font-semibold tracking-tight text-stone-900 group-hover:text-amber-950 transition-colors sm:text-3xl">
              Golden Echo
            </span>
          </button>
        </div>

        {/* 4 Clear Navigation Destinations: Today, My Stories, Looking Forward, Keepsake */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
          <button
            onClick={() => onSelectTab('today')}
            className={`pb-1 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'today'
                ? 'font-semibold text-stone-950 border-b-2 border-amber-800'
                : 'hover:text-stone-900 border-b-2 border-transparent'
            }`}
          >
            Today
          </button>

          <button
            onClick={() => onSelectTab('stories')}
            className={`pb-1 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'stories'
                ? 'font-semibold text-stone-950 border-b-2 border-amber-800'
                : 'hover:text-stone-900 border-b-2 border-transparent'
            }`}
          >
            My Stories
          </button>

          <button
            onClick={() => onSelectTab('forward')}
            className={`pb-1 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'forward'
                ? 'font-semibold text-stone-950 border-b-2 border-amber-800'
                : 'hover:text-stone-900 border-b-2 border-transparent'
            }`}
          >
            Looking Forward
          </button>

          <button
            onClick={() => onSelectTab('keepsake')}
            className={`pb-1 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'keepsake'
                ? 'font-semibold text-stone-950 border-b-2 border-amber-800'
                : 'hover:text-stone-900 border-b-2 border-transparent'
            }`}
          >
            Keepsake
          </button>
        </nav>

        {/* Primary Utility Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Ambient Sound Quick Toggle */}
          <button
            onClick={onToggleSoundscape}
            className={`group relative flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all cursor-pointer ${
              isPlayingSoundscape
                ? 'border-amber-300 bg-amber-100/80 text-amber-950 shadow-2xs'
                : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-100 hover:text-stone-900'
            }`}
            title={isPlayingSoundscape ? `Playing ${currentSoundscape ? soundscapeNames[currentSoundscape] : 'Audio'}` : 'Start relaxing ambient sound'}
            aria-label={isPlayingSoundscape ? 'Stop ambient audio' : 'Play ambient audio'}
          >
            {isPlayingSoundscape ? (
              <>
                <Volume2 className="h-4 w-4 text-amber-800 animate-pulse" />
                <span className="hidden xl:inline whitespace-nowrap">
                  {currentSoundscape ? soundscapeNames[currentSoundscape] : 'Ambient'}
                </span>
              </>
            ) : (
              <>
                <VolumeX className="h-4 w-4 text-stone-500" />
                <span className="hidden xl:inline whitespace-nowrap">Soundscapes</span>
              </>
            )}
          </button>

          {/* Reading & Comfort Settings */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-medium text-stone-700 transition-colors hover:bg-stone-100 hover:text-stone-950 cursor-pointer"
            title="Adjust text size and reading comfort"
            aria-label="Reading Comfort Settings"
          >
            <Settings className="h-4 w-4 text-stone-500" />
            <span className="hidden sm:inline whitespace-nowrap">Comfort</span>
          </button>

          {/* Primary Action Button */}
          <button
            onClick={onOpenNewMemory}
            className="flex items-center gap-1.5 rounded-lg bg-stone-900 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-stone-800 focus-visible:outline-2 cursor-pointer"
          >
            <Plus className="h-4 w-4 text-amber-200" />
            <span className="whitespace-nowrap">Tell a Memory</span>
          </button>
        </div>

      </div>

      {/* Mobile Navigation Bar: The same 4 destinations */}
      <div className="flex md:hidden border-t border-stone-200/80 bg-stone-100/90 px-2 py-2 justify-around text-xs font-medium">
        <button
          onClick={() => onSelectTab('today')}
          className={`flex-1 py-1.5 px-2 rounded-md text-center cursor-pointer ${
            activeTab === 'today' ? 'font-semibold text-stone-950 bg-white shadow-2xs' : 'text-stone-600'
          }`}
        >
          Today
        </button>

        <button
          onClick={() => onSelectTab('stories')}
          className={`flex-1 py-1.5 px-2 rounded-md text-center cursor-pointer ${
            activeTab === 'stories' ? 'font-semibold text-stone-950 bg-white shadow-2xs' : 'text-stone-600'
          }`}
        >
          My Stories
        </button>

        <button
          onClick={() => onSelectTab('forward')}
          className={`flex-1 py-1.5 px-2 rounded-md text-center cursor-pointer ${
            activeTab === 'forward' ? 'font-semibold text-stone-950 bg-white shadow-2xs' : 'text-stone-600'
          }`}
        >
          Looking Forward
        </button>

        <button
          onClick={() => onSelectTab('keepsake')}
          className={`flex-1 py-1.5 px-2 rounded-md text-center cursor-pointer ${
            activeTab === 'keepsake' ? 'font-semibold text-stone-950 bg-white shadow-2xs' : 'text-stone-600'
          }`}
        >
          Keepsake
        </button>
      </div>
    </header>
  );
};

