import React, { useState } from 'react';
import { 
  HeartHandshake, Music, MapPin, Mail, Volume2, VolumeX, 
  Play, Pause, ArrowRight, Check, Sparkles, Clock, Sliders
} from 'lucide-react';
import { soundscapes, SoundscapeType } from '../utils/soundscapes';

interface GentleMomentsProps {
  onStartMemoryWithPrompt: (promptText: string, suggestedTitle?: string) => void;
  isPlayingSoundscape: boolean;
  currentSoundscape: SoundscapeType | null;
  onSoundscapeChange: (type: SoundscapeType) => void;
  onToggleSoundscape: () => void;
}

export const GentleMoments: React.FC<GentleMomentsProps> = ({
  onStartMemoryWithPrompt,
  isPlayingSoundscape,
  currentSoundscape,
  onSoundscapeChange,
  onToggleSoundscape,
}) => {
  const [activeExercise, setActiveExercise] = useState<'audio' | 'music' | 'place' | 'letter'>('audio');
  
  // Soundscape volume & timer
  const [volume, setVolume] = useState(0.35);
  const [timerMinutes, setTimerMinutes] = useState<number | null>(null);

  // Music Memory Box
  const [favoriteSong, setFavoriteSong] = useState('');
  const [favoriteArtist, setFavoriteArtist] = useState('');

  // Mindful Place Walk Step
  const [placeStep, setPlaceStep] = useState(1);
  const [placeName, setPlaceName] = useState('');

  // Keepsake Letter
  const [recipient, setRecipient] = useState('');
  const [letterWisdom, setLetterWisdom] = useState('');

  const soundscapeOptions: { type: SoundscapeType; label: string; desc: string; icon: string }[] = [
    { type: 'fireplace', label: 'Hearth Fire', desc: 'Warm oak crackle and soft glowing embers', icon: '🪵' },
    { type: 'rain', label: 'Summer Rain', desc: 'Gentle raindrops on leaves with a soft breeze', icon: '🌧️' },
    { type: 'garden_birds', label: 'Garden Songbirds', desc: 'Serene morning robins and rustling trees', icon: '🌿' },
    { type: 'vinyl', label: 'Vintage Vinyl', desc: 'Soothing 50Hz turntable hum and nostalgic needle warmth', icon: '📻' },
  ];

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    soundscapes.setVolume(newVol);
  };

  const handleCreateMusicMemory = () => {
    if (!favoriteSong.trim()) return;
    const prompt = `Remembering the song "${favoriteSong.trim()}"${favoriteArtist ? ` by ${favoriteArtist.trim()}` : ''}. Where were you when you first heard it? What does it bring back?`;
    onStartMemoryWithPrompt(prompt, `The Melody of "${favoriteSong.trim()}"`);
  };

  const handleCreatePlaceMemory = () => {
    const pName = placeName.trim() || 'A Beloved Place';
    const prompt = `A mindful journey back to ${pName}. What could be seen, heard, smelled, and felt there?`;
    onStartMemoryWithPrompt(prompt, `Visiting ${pName} in My Memory`);
  };

  const handleCreateLetterMemory = () => {
    if (!recipient.trim() && !letterWisdom.trim()) return;
    const prompt = `A keepsake letter written with love for ${recipient.trim() || 'My Loved Ones'}.\n\n"${letterWisdom.trim()}"`;
    onStartMemoryWithPrompt(prompt, `A Letter for ${recipient.trim() || 'Those I Cherish'}`);
  };

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="border-b border-stone-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-900 font-sans">
          <HeartHandshake className="h-3.5 w-3.5 text-amber-700" />
          <span>Mindful Reminiscence</span>
        </div>
        <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-medium tracking-tight text-stone-900">
          Gentle Moments & Sensory Exercises
        </h2>
        <p className="mt-1.5 text-sm text-stone-600 max-w-2xl">
          Quiet activities designed to evoke sensory recollections, calm the nervous system, and preserve heartfelt messages.
        </p>
      </div>

      {/* Exercise Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveExercise('audio')}
          className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all ${
            activeExercise === 'audio'
              ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
              : 'border-stone-200 bg-white text-stone-800 hover:border-stone-300'
          }`}
        >
          <Volume2 className="h-5 w-5 mb-2 text-amber-300" />
          <span className="font-semibold text-sm">Calming Audio</span>
          <span className="text-xs opacity-75 mt-0.5">Procedural soundscapes</span>
        </button>

        <button
          onClick={() => setActiveExercise('music')}
          className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all ${
            activeExercise === 'music'
              ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
              : 'border-stone-200 bg-white text-stone-800 hover:border-stone-300'
          }`}
        >
          <Music className="h-5 w-5 mb-2 text-amber-300" />
          <span className="font-semibold text-sm">Music Memory Box</span>
          <span className="text-xs opacity-75 mt-0.5">Songs of your youth</span>
        </button>

        <button
          onClick={() => setActiveExercise('place')}
          className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all ${
            activeExercise === 'place'
              ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
              : 'border-stone-200 bg-white text-stone-800 hover:border-stone-300'
          }`}
        >
          <MapPin className="h-5 w-5 mb-2 text-amber-300" />
          <span className="font-semibold text-sm">Mindful Place Walk</span>
          <span className="text-xs opacity-75 mt-0.5">Guided mental visit</span>
        </button>

        <button
          onClick={() => setActiveExercise('letter')}
          className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all ${
            activeExercise === 'letter'
              ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
              : 'border-stone-200 bg-white text-stone-800 hover:border-stone-300'
          }`}
        >
          <Mail className="h-5 w-5 mb-2 text-amber-300" />
          <span className="font-semibold text-sm">Keepsake Letter</span>
          <span className="text-xs opacity-75 mt-0.5">Words for loved ones</span>
        </button>
      </div>

      {/* Exercise Content Area */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-xs">
        
        {/* 1. Ambient Audio Soundscape Station */}
        {activeExercise === 'audio' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-medium text-stone-900">
                Calming Sensory Soundscapes
              </h3>
              <p className="mt-1 text-sm text-stone-600">
                Synthesized directly inside your browser. No internet streaming or audio files required—pure, continuous, and relaxing background atmosphere.
              </p>
            </div>

            {/* Soundscape Choices */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {soundscapeOptions.map(opt => {
                const isSelected = currentSoundscape === opt.type && isPlayingSoundscape;
                return (
                  <button
                    key={opt.type}
                    onClick={() => {
                      if (currentSoundscape === opt.type && isPlayingSoundscape) {
                        onToggleSoundscape();
                      } else {
                        onSoundscapeChange(opt.type);
                      }
                    }}
                    className={`flex items-start gap-4 p-5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-amber-700 bg-amber-50/70 shadow-xs'
                        : 'border-stone-200 bg-stone-50/50 hover:bg-stone-100/70 hover:border-stone-300'
                    }`}
                  >
                    <span className="text-2xl" aria-hidden="true">{opt.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-stone-900">{opt.label}</span>
                        {isSelected ? (
                          <span className="flex items-center gap-1 text-xs font-semibold text-amber-900">
                            <Volume2 className="h-3.5 w-3.5 animate-pulse" />
                            <span>Playing</span>
                          </span>
                        ) : (
                          <Play className="h-3.5 w-3.5 text-stone-400" />
                        )}
                      </div>
                      <p className="mt-1 text-xs text-stone-600">{opt.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Controls Bar: Volume & Master Play */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-stone-200 bg-stone-50 p-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={onToggleSoundscape}
                  className="flex items-center gap-2 rounded-lg bg-stone-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-stone-800"
                >
                  {isPlayingSoundscape ? (
                    <>
                      <Pause className="h-4 w-4" />
                      <span>Pause Sound</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 text-amber-200" />
                      <span>Start Listening</span>
                    </>
                  )}
                </button>

                <span className="text-xs text-stone-600">
                  {isPlayingSoundscape ? 'Playing peaceful ambient sound' : 'Sound is paused'}
                </span>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-3 w-full sm:w-64">
                <Sliders className="h-4 w-4 text-stone-500 shrink-0" />
                <label htmlFor="volume-slider" className="sr-only">Volume</label>
                <input
                  id="volume-slider"
                  type="range"
                  min="0.05"
                  max="0.9"
                  step="0.05"
                  value={volume}
                  onChange={e => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-full accent-amber-800"
                />
                <span className="text-xs text-stone-500 tabular-nums w-8">
                  {Math.round(volume * 100)}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 2. Music Memory Box */}
        {activeExercise === 'music' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-medium text-stone-900">
                Music Memory Box
              </h3>
              <p className="mt-1 text-sm text-stone-600">
                A single song can instantly transport us across decades. What melody was playing at the summer dance, on your car radio, or hummed by your mother?
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wide">
                  Song or Tune Title
                </label>
                <input
                  type="text"
                  value={favoriteSong}
                  onChange={e => setFavoriteSong(e.target.value)}
                  placeholder="e.g. Moon River, In the Mood, La Vie en Rose"
                  className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2 text-sm text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wide">
                  Singer or Orchestra (Optional)
                </label>
                <input
                  type="text"
                  value={favoriteArtist}
                  onChange={e => setFavoriteArtist(e.target.value)}
                  placeholder="e.g. Glenn Miller, Nat King Cole, Ella Fitzgerald"
                  className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2 text-sm text-stone-900"
                />
              </div>
            </div>

            <div className="rounded-xl bg-amber-50/60 border border-amber-200/60 p-5">
              <h4 className="font-serif text-base font-semibold text-stone-900">
                Questions to prompt your recollection:
              </h4>
              <ul className="mt-2 space-y-1.5 text-xs sm:text-sm text-stone-700 list-disc list-inside">
                <li>Who were you with when you first heard this recording?</li>
                <li>Were you dancing, driving, celebrating, or resting on a quiet Sunday?</li>
                <li>What feelings or scents come back whenever the first few notes play?</li>
              </ul>
            </div>

            <button
              onClick={handleCreateMusicMemory}
              disabled={!favoriteSong.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-stone-900 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-stone-800 disabled:opacity-50"
            >
              <span>Write a Memory Around This Song</span>
              <ArrowRight className="h-3.5 w-3.5 text-amber-200" />
            </button>
          </div>
        )}

        {/* 3. Mindful Place Walk */}
        {activeExercise === 'place' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-medium text-stone-900">
                Mindful Place Walk
              </h3>
              <p className="mt-1 text-sm text-stone-600">
                A 4-step mental revisit to a beloved home, front porch, childhood garden, or holiday retreat.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wide">
                Name of the Place to Visit
              </label>
              <input
                type="text"
                value={placeName}
                onChange={e => setPlaceName(e.target.value)}
                placeholder="e.g. The Screened Porch at Willow Creek, Grandma's Pantry"
                className="mt-1.5 w-full max-w-md rounded-lg border border-stone-300 bg-white px-3.5 py-2 text-sm text-stone-900"
              />
            </div>

            {/* Stepper Guide */}
            <div className="rounded-xl border border-stone-200 bg-stone-50/60 p-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-800 text-xs font-bold text-white">
                  {placeStep}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-900">
                  Step {placeStep} of 4
                </span>
              </div>

              {placeStep === 1 && (
                <div>
                  <h4 className="font-serif text-lg font-medium text-stone-900">
                    The Threshold & Approach
                  </h4>
                  <p className="mt-1.5 text-sm text-stone-700 leading-relaxed">
                    Close your eyes gently for a few seconds. Picture yourself walking up to the entrance. What does the gate, door handle, or step feel like beneath your feet or fingers? What is the weather like on your skin?
                  </p>
                </div>
              )}

              {placeStep === 2 && (
                <div>
                  <h4 className="font-serif text-lg font-medium text-stone-900">
                    Sights, Colors & Light
                  </h4>
                  <p className="mt-1.5 text-sm text-stone-700 leading-relaxed">
                    Step inside or into the garden. Notice the quality of the light—is it morning sun, late afternoon gold, or soft lamp glow? Look around: what colors, pictures on the wall, or plants do you see?
                  </p>
                </div>
              )}

              {placeStep === 3 && (
                <div>
                  <h4 className="font-serif text-lg font-medium text-stone-900">
                    Sounds & Familiar Aromas
                  </h4>
                  <p className="mt-1.5 text-sm text-stone-700 leading-relaxed">
                    Listen closely. Do floorboards creak? Is a kettle boiling, clock ticking, or birds singing outside? What scent meets you—fresh pastry, cedar wood, salt sea air, or rain on soil?
                  </p>
                </div>
              )}

              {placeStep === 4 && (
                <div>
                  <h4 className="font-serif text-lg font-medium text-stone-900">
                    Gratitude & Safe Keeping
                  </h4>
                  <p className="mt-1.5 text-sm text-stone-700 leading-relaxed">
                    Take a deep, peaceful breath. Know that this place will always live within you. Give thanks for the comfort and shelter it gave you, and know you can return here whenever you wish.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between border-t border-stone-200 pt-4">
                <button
                  type="button"
                  disabled={placeStep === 1}
                  onClick={() => setPlaceStep(p => Math.max(1, p - 1))}
                  className="text-xs font-medium text-stone-600 hover:text-stone-900 disabled:opacity-30"
                >
                  Previous Step
                </button>

                {placeStep < 4 ? (
                  <button
                    type="button"
                    onClick={() => setPlaceStep(p => Math.min(4, p + 1))}
                    className="rounded-lg bg-stone-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-stone-800"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleCreatePlaceMemory}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-amber-800 px-4 py-1.5 text-xs font-semibold text-white hover:bg-amber-900"
                  >
                    <span>Save This Visit as a Memory</span>
                    <ArrowRight className="h-3.5 w-3.5 text-amber-200" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 4. Keepsake Letter */}
        {activeExercise === 'letter' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-medium text-stone-900">
                A Keepsake Letter
              </h3>
              <p className="mt-1 text-sm text-stone-600">
                Write down words of love, life advice, or gratitude for a loved one, partner, dear friend, or future generations. It will be preserved in your heirloom archive.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wide">
                Dear... (Recipient Name or Relation)
              </label>
              <input
                type="text"
                value={recipient}
                onChange={e => setRecipient(e.target.value)}
                placeholder="e.g. Dearest Loved Ones, Dearest Arthur, A Cherished Friend"
                className="mt-1.5 w-full max-w-md rounded-lg border border-stone-300 bg-white px-3.5 py-2 text-sm text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wide">
                What would you most want them to remember or know?
              </label>
              <textarea
                rows={6}
                value={letterWisdom}
                onChange={e => setLetterWisdom(e.target.value)}
                placeholder="Write from the heart. What brought you through difficult days? What do you hope they always hold onto? How proud are you of them?..."
                className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white p-4 font-serif text-base leading-relaxed text-stone-900"
              />
            </div>

            <button
              onClick={handleCreateLetterMemory}
              disabled={!letterWisdom.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-stone-900 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-stone-800 disabled:opacity-50"
            >
              <span>Preserve This Letter in Memory Journal</span>
              <ArrowRight className="h-3.5 w-3.5 text-amber-200" />
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
