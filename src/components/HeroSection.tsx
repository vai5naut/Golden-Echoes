import React from 'react';
import { PenLine, Compass, Heart, Calendar } from 'lucide-react';
import { HERO_JOURNAL_IMAGE } from '../data/seedData';

interface HeroSectionProps {
  memoryCount: number;
  visionCount: number;
  favoriteCount: number;
  onWriteMemory: () => void;
  onExploreVisions: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  memoryCount,
  visionCount,
  favoriteCount,
  onWriteMemory,
  onExploreVisions,
}) => {
  // Current formatted date
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <section className="relative overflow-hidden border-b border-stone-200/80 bg-stone-100/60 pb-12 pt-8 sm:pt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Top date kicker - zero pill, clean text */}
        <div className="flex flex-wrap items-center gap-3 text-xs tracking-wider uppercase text-stone-500 font-sans">
          <span className="flex items-center gap-1.5 font-medium text-stone-700">
            <Calendar className="h-3.5 w-3.5 text-stone-400" />
            {todayFormatted}
          </span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <span>{greeting}</span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <span>Curated Reminiscence & Future Hopes</span>
        </div>

        {/* 2-Column Editorial Grid: Narrative & Heirloom Keepsake Visual */}
        <div className="mt-6 grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          
          {/* Column 1: Narrative & Prompts */}
          <div className="lg:col-span-7">
            <h1 className="font-serif text-3xl font-medium tracking-tight text-stone-900 sm:text-5xl lg:text-5xl [text-wrap:balance] leading-[1.15]">
              Hold on to what matters. Imagine what comes next.
            </h1>

            <p className="mt-5 text-base sm:text-lg leading-relaxed text-stone-600 [text-wrap:pretty]">
              A quiet, dignified sanctuary crafted for reflecting upon treasured life stories, recording personal wisdom for future generations, and nurturing peaceful aspirations for the days ahead.
            </p>

            {/* Primary Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <button
                onClick={onWriteMemory}
                className="flex items-center gap-2 rounded-lg bg-stone-900 px-5 py-3 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-stone-800"
              >
                <PenLine className="h-4 w-4 text-amber-200" />
                <span>Write a Memory</span>
              </button>

              <button
                onClick={onExploreVisions}
                className="flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-800 shadow-2xs transition-colors hover:bg-stone-50"
              >
                <Compass className="h-4 w-4 text-stone-500" />
                <span>Open Vision Board</span>
              </button>
            </div>

            {/* Quantitative Archive Stats - No badge pills, clean tabular figures */}
            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-stone-200/90 pt-6">
              <div>
                <span className="block font-serif text-2xl sm:text-3xl font-semibold tabular-nums text-stone-900">
                  {memoryCount}
                </span>
                <span className="text-xs text-stone-500 sm:text-sm">
                  {memoryCount === 1 ? 'Memory Preserved' : 'Memories Preserved'}
                </span>
              </div>

              <div>
                <span className="block font-serif text-2xl sm:text-3xl font-semibold tabular-nums text-stone-900">
                  {visionCount}
                </span>
                <span className="text-xs text-stone-500 sm:text-sm">
                  {visionCount === 1 ? 'Vision Charted' : 'Visions Charted'}
                </span>
              </div>

              <div>
                <span className="block font-serif text-2xl sm:text-3xl font-semibold tabular-nums text-stone-900">
                  {favoriteCount}
                </span>
                <span className="text-xs text-stone-500 sm:text-sm flex items-center gap-1">
                  <Heart className="h-3 w-3 text-rose-500 inline fill-rose-500" />
                  <span>Starred Keepsakes</span>
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: High-Fidelity Editorial Visual Anchor */}
          <div className="lg:col-span-5">
            <div className="group relative overflow-hidden rounded-2xl border border-stone-300/80 bg-stone-200/60 shadow-md">
              <img
                src={HERO_JOURNAL_IMAGE}
                alt="Heirloom memory journal bound in natural linen open on an oak table next to pressed wildflowers and fountain pen"
                referrerPolicy="no-referrer"
                className="aspect-16/10 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.01]"
              />
              <div className="p-4 bg-white/95 border-t border-stone-200">
                <p className="font-serif text-sm italic text-stone-700">
                  "We do not remember days; we remember moments."
                </p>
                <div className="mt-1 flex items-center justify-between text-xs text-stone-400">
                  <span>Cesare Pavese</span>
                  <span>Archival Keepsake Edition</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
