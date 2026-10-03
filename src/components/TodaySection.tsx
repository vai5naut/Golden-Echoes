import React, { useState } from 'react';
import { 
  Mic, Sparkles, Shuffle, ArrowRight, HeartHandshake, Compass,
  Volume2, VolumeX, ShieldCheck, Sun, Moon, Coffee, BookOpen, Music, MapPin, Mail, X
} from 'lucide-react';
import { MemoryPrompt, MemoryEntry } from '../types';
import { MEMORY_PROMPTS } from '../data/seedData';
import { SoundscapeType } from '../utils/soundscapes';

interface TodaySectionProps {
  onStartStoryWithPrompt: (promptText: string, suggestedTitle?: string) => void;
  onNavigateToStories: () => void;
  onNavigateToForward: () => void;
  memories: MemoryEntry[];
  isPlayingSoundscape: boolean;
  currentSoundscape: SoundscapeType | null;
  onSoundscapeChange: (type: SoundscapeType) => void;
  onToggleSoundscape: () => void;
}

export const TodaySection: React.FC<TodaySectionProps> = ({
  onStartStoryWithPrompt,
  onNavigateToStories,
  onNavigateToForward,
  memories,
  isPlayingSoundscape,
  currentSoundscape,
  onSoundscapeChange,
  onToggleSoundscape,
}) => {
  const [promptIndex, setPromptIndex] = useState(0);
  const [showNotToday, setShowNotToday] = useState(false);
  const [activeSensorySpace, setActiveSensorySpace] = useState<'none' | 'soundscapes' | 'walk' | 'music' | 'letter'>('none');

  // Mindful place walk state
  const [walkStep, setWalkStep] = useState(0);

  // Keepsake letter state
  const [letterRecipient, setLetterRecipient] = useState('');
  const [letterContent, setLetterContent] = useState('');
  const [letterSaved, setLetterSaved] = useState(false);

  // Music memory state
  const [favoriteSong, setFavoriteSong] = useState('');

  const currentPrompt: MemoryPrompt = MEMORY_PROMPTS[promptIndex % MEMORY_PROMPTS.length];

  const handleNextPrompt = () => {
    setShowNotToday(false);
    setPromptIndex(prev => (prev + 1) % MEMORY_PROMPTS.length);
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const GreetingIcon = hour < 12 ? Sun : hour < 17 ? Coffee : Moon;

  const walkSteps = [
    {
      title: 'Step 1: Choose Your Sanctuary',
      body: 'Close your eyes for a moment. Think of a peaceful place from your past—a sunlit garden bench, a quiet kitchen window, or the edge of a calm lake.',
    },
    {
      title: 'Step 2: Notice the Light & Air',
      body: 'Feel the temperature of the air on your skin. Is there a warm breeze? What does the light look like as it filters through the trees or curtains?',
    },
    {
      title: 'Step 3: Listen Closely',
      body: 'What sounds exist in this place? Leaves rustling, distant birds, the quiet hum of a kitchen kettle, or someone humming in the next room?',
    },
    {
      title: 'Step 4: Take the Peace With You',
      body: 'Take one deep, quiet breath. This place and its calm live inside you. You can return whenever your heart needs quiet.',
    }
  ];

  return (
    <div className="space-y-12 pb-16">
      
      {/* 1. Concise, Dignified Hero Banner */}
      <section className="text-center pt-2 sm:pt-6 max-w-3xl mx-auto px-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-amber-900/80 font-sans block mb-2">
          Golden Echo
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-stone-900 leading-[1.18] [text-wrap:balance]">
          Remember what shaped you.
          <br className="hidden sm:inline" /> Make room for what comes next.
        </h1>
        <p className="mt-3 text-base sm:text-lg text-stone-600 font-serif italic max-w-xl mx-auto">
          "A gentle place for stories, voices, people and moments worth keeping."
        </p>
      </section>

      {/* 2. TODAY'S ECHO: The spacious, central primary card */}
      <section className="max-w-3xl mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl border border-stone-200/90 bg-white p-7 sm:p-11 shadow-sm transition-all hover:border-stone-300">
          
          {/* Top Greeting & Label */}
          <div className="flex items-center justify-between border-b border-stone-100 pb-4 text-xs font-sans">
            <div className="flex items-center gap-2 text-stone-500 font-medium">
              <GreetingIcon className="h-4 w-4 text-amber-800" />
              <span>{greeting}</span>
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-900">
              Today's Echo
            </span>
          </div>

          {/* The Sensory Prompt */}
          {!showNotToday ? (
            <div className="mt-8 space-y-4">
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal leading-snug tracking-tight text-stone-900 [text-wrap:balance]">
                "{currentPrompt.text}"
              </h2>

              {currentPrompt.sensoryCue && (
                <p className="text-sm sm:text-base text-stone-500 font-serif italic leading-relaxed">
                  {currentPrompt.sensoryCue}
                </p>
              )}

              {/* Core Journey Primary Action & Controls */}
              <div className="pt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                {/* Large Voice/Story CTA */}
                <button
                  onClick={() => onStartStoryWithPrompt(currentPrompt.text, currentPrompt.eraLabel)}
                  className="flex-1 flex items-center justify-center gap-2.5 rounded-xl bg-stone-900 px-6 py-4 text-sm sm:text-base font-semibold text-white shadow-xs transition-all hover:bg-stone-800 active:scale-[0.99] cursor-pointer"
                >
                  <Mic className="h-5 w-5 text-amber-200" />
                  <span>Tell this story</span>
                </button>

                {/* Secondary: Give me another memory */}
                <button
                  onClick={handleNextPrompt}
                  className="flex items-center justify-center gap-2 rounded-xl border border-stone-300 bg-stone-50/70 px-5 py-3.5 text-xs sm:text-sm font-medium text-stone-800 transition-colors hover:bg-stone-100 cursor-pointer"
                  title="Show another sensory prompt"
                >
                  <Shuffle className="h-4 w-4 text-stone-500" />
                  <span>Give me another memory</span>
                </button>

                {/* Emotional Safety: Not today */}
                <button
                  onClick={() => setShowNotToday(true)}
                  className="flex items-center justify-center rounded-xl px-4 py-3.5 text-xs sm:text-sm font-medium text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
                  title="Skip without pressure"
                >
                  <span>Not today</span>
                </button>
              </div>

              {/* Tertiary Link */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <span>{currentPrompt.eraLabel}</span>
                <button
                  onClick={onNavigateToStories}
                  className="flex items-center gap-1 font-semibold text-amber-950 hover:underline cursor-pointer"
                >
                  <span>Visit one of my stories</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

            </div>
          ) : (
            /* Calmer, Respectful "Not Today" */
            <div className="mt-8 space-y-4 rounded-2xl bg-stone-50 p-6 border border-stone-200">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-normal text-stone-900">
                    This one can wait.
                  </h3>
                  <p className="mt-1 text-sm text-stone-600 font-serif">
                    Whenever you feel ready, here are a few gentle alternatives:
                  </p>
                </div>
                <button
                  onClick={() => setShowNotToday(false)}
                  className="text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
                  title="Close"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-2.5 text-xs sm:text-sm">
                <button
                  onClick={handleNextPrompt}
                  className="flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3.5 py-2 font-medium text-stone-800 hover:bg-stone-50 cursor-pointer"
                >
                  <Shuffle className="h-3.5 w-3.5 text-stone-500" />
                  <span>Another memory</span>
                </button>

                <button
                  onClick={onNavigateToStories}
                  className="flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3.5 py-2 font-medium text-stone-800 hover:bg-stone-50 cursor-pointer"
                >
                  <BookOpen className="h-3.5 w-3.5 text-stone-500" />
                  <span>Visit one of my stories</span>
                </button>

                <button
                  onClick={onNavigateToForward}
                  className="flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3.5 py-2 font-medium text-stone-800 hover:bg-stone-50 cursor-pointer"
                >
                  <Compass className="h-3.5 w-3.5 text-stone-500" />
                  <span>Looking Forward</span>
                </button>

                <button
                  onClick={() => {
                    onSoundscapeChange('fireplace');
                    if (!isPlayingSoundscape) onToggleSoundscape();
                    setActiveSensorySpace('soundscapes');
                    setShowNotToday(false);
                  }}
                  className="flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-2 font-medium text-amber-950 hover:bg-amber-100/70 cursor-pointer"
                >
                  <Volume2 className="h-3.5 w-3.5 text-amber-800" />
                  <span>A quiet moment</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* 3. Quiet Spaces & Sensory Reflection (Secondary Experiences) */}
      <section className="max-w-4xl mx-auto px-4 pt-4">
        
        <div className="border-t border-stone-200/80 pt-8 pb-4 text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-900/80 font-sans">
            Quiet Spaces & Sensory Reflection
          </span>
          <p className="mt-1 text-sm text-stone-600 font-serif">
            Calm practices to relax the senses, revisit fond places, or listen to familiar sounds.
          </p>
        </div>

        {/* 4 Quiet Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          
          {/* Card A: Ambient Soundscapes */}
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-2xs hover:border-stone-300 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm">
                <Volume2 className="h-4 w-4 text-amber-800" />
                <span>Ambient Soundscapes</span>
              </div>
              {isPlayingSoundscape && (
                <span className="text-xs text-amber-800 font-medium animate-pulse">Playing</span>
              )}
            </div>
            <p className="mt-1.5 text-xs text-stone-500 font-serif">
              Procedurally generated gentle acoustics synthesized right in your browser.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              {(['fireplace', 'garden_birds', 'rain', 'vinyl'] as SoundscapeType[]).map(type => {
                const names: Record<SoundscapeType, string> = {
                  fireplace: 'Hearth Fire',
                  garden_birds: 'Songbirds',
                  rain: 'Summer Rain',
                  vinyl: 'Vinyl Warmth',
                };
                const isSelected = isPlayingSoundscape && currentSoundscape === type;
                return (
                  <button
                    key={type}
                    onClick={() => {
                      onSoundscapeChange(type);
                      if (!isPlayingSoundscape) onToggleSoundscape();
                    }}
                    className={`px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-amber-400 bg-amber-100/90 text-amber-950 font-semibold'
                        : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {names[type]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card B: Mindful Place Walk */}
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-2xs hover:border-stone-300 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm">
                <MapPin className="h-4 w-4 text-amber-800" />
                <span>Mindful Place Walk</span>
              </div>
              <button
                onClick={() => setActiveSensorySpace(activeSensorySpace === 'walk' ? 'none' : 'walk')}
                className="text-xs text-amber-900 font-medium hover:underline cursor-pointer"
              >
                {activeSensorySpace === 'walk' ? 'Close' : 'Begin Walk'}
              </button>
            </div>
            <p className="mt-1.5 text-xs text-stone-500 font-serif">
              A 4-step mental visualization to revisit a sanctuary or favorite room from memory.
            </p>
            {activeSensorySpace === 'walk' && (
              <div className="mt-4 rounded-xl bg-amber-50/70 p-3.5 border border-amber-200/60 text-xs">
                <span className="font-semibold text-amber-950 block">{walkSteps[walkStep].title}</span>
                <p className="mt-1 text-stone-700 font-serif leading-relaxed">{walkSteps[walkStep].body}</p>
                <div className="mt-3 flex items-center justify-between pt-2 border-t border-amber-200/60">
                  <span className="text-stone-400">Step {walkStep + 1} of 4</span>
                  <button
                    onClick={() => setWalkStep(prev => (prev + 1) % 4)}
                    className="font-semibold text-amber-900 hover:underline cursor-pointer"
                  >
                    {walkStep === 3 ? 'Start Over' : 'Next Step →'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Card C: Music Memory Box */}
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-2xs hover:border-stone-300 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm">
                <Music className="h-4 w-4 text-amber-800" />
                <span>Music Memory Box</span>
              </div>
              <button
                onClick={() => setActiveSensorySpace(activeSensorySpace === 'music' ? 'none' : 'music')}
                className="text-xs text-amber-900 font-medium hover:underline cursor-pointer"
              >
                {activeSensorySpace === 'music' ? 'Close' : 'Explore'}
              </button>
            </div>
            <p className="mt-1.5 text-xs text-stone-500 font-serif">
              Recall a song or melody that instantly brings back a person or time of youth.
            </p>
            {activeSensorySpace === 'music' && (
              <div className="mt-4 space-y-2 text-xs">
                <input
                  type="text"
                  value={favoriteSong}
                  onChange={e => setFavoriteSong(e.target.value)}
                  placeholder="e.g. Moon River, Glenn Miller, or Mother's lullaby"
                  className="w-full rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-stone-800"
                />
                {favoriteSong.trim() && (
                  <button
                    onClick={() => onStartStoryWithPrompt(`The song "${favoriteSong}" and the memory it awakens.`)}
                    className="w-full rounded-lg bg-stone-900 text-white py-1.5 font-medium hover:bg-stone-800 cursor-pointer"
                  >
                    Tell the memory of this song →
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Card D: A Keepsake Letter */}
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-2xs hover:border-stone-300 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm">
                <Mail className="h-4 w-4 text-amber-800" />
                <span>A Keepsake Letter</span>
              </div>
              <button
                onClick={() => setActiveSensorySpace(activeSensorySpace === 'letter' ? 'none' : 'letter')}
                className="text-xs text-amber-900 font-medium hover:underline cursor-pointer"
              >
                {activeSensorySpace === 'letter' ? 'Close' : 'Write Words'}
              </button>
            </div>
            <p className="mt-1.5 text-xs text-stone-500 font-serif">
              Draft words of warmth, gratitude, or quiet wisdom for loved ones to preserve.
            </p>
            {activeSensorySpace === 'letter' && (
              <div className="mt-4 space-y-2 text-xs">
                <input
                  type="text"
                  value={letterRecipient}
                  onChange={e => setLetterRecipient(e.target.value)}
                  placeholder="Dear... (e.g. Dearest Loved Ones, Arthur, Rhea)"
                  className="w-full rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-stone-800"
                />
                <textarea
                  rows={2}
                  value={letterContent}
                  onChange={e => setLetterContent(e.target.value)}
                  placeholder="What is one true thing you hope they will remember?"
                  className="w-full rounded-lg border border-stone-300 bg-white p-2 text-stone-800 font-serif"
                />
                {letterContent.trim() && (
                  <button
                    onClick={() => {
                      onStartStoryWithPrompt(
                        `A Keepsake Letter for ${letterRecipient.trim() || 'Loved Ones'}.\n\n"${letterContent.trim()}"`,
                        `Letter for ${letterRecipient.trim() || 'Those I Cherish'}`
                      );
                    }}
                    className="w-full rounded-lg bg-stone-900 text-white py-1.5 font-medium hover:bg-stone-800 cursor-pointer"
                  >
                    Save as Keepsake Story →
                  </button>
                )}
              </div>
            )}
          </div>

        </div>

      </section>

      {/* 4. Local-First Privacy & Trust Footer */}
      <section className="max-w-2xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-xl bg-stone-100/80 px-4 py-2 text-xs text-stone-600 font-sans border border-stone-200/60">
          <ShieldCheck className="h-4 w-4 text-emerald-700" />
          <span>Local-first privacy: Your stories, voice notes, and hopes remain on your device.</span>
        </div>
      </section>

    </div>
  );
};
