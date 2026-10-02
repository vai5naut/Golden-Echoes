import React, { useState } from 'react';
import { Sparkles, Shuffle, Volume2, ArrowRight } from 'lucide-react';
import { MemoryPrompt, LifeEra } from '../types';
import { MEMORY_PROMPTS } from '../data/seedData';
import { speakText, isSpeechSynthesisAvailable } from '../utils/speech';

interface PromptCarouselProps {
  onSelectPrompt: (prompt: MemoryPrompt) => void;
}

export const PromptCarousel: React.FC<PromptCarouselProps> = ({ onSelectPrompt }) => {
  const [activeEra, setActiveEra] = useState<LifeEra | 'all'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const filteredPrompts = activeEra === 'all'
    ? MEMORY_PROMPTS
    : MEMORY_PROMPTS.filter(p => p.era === activeEra);

  const safeIndex = currentIndex % filteredPrompts.length;
  const currentPrompt = filteredPrompts[safeIndex] || MEMORY_PROMPTS[0];

  const handleNextPrompt = () => {
    setCurrentIndex(prev => (prev + 1) % filteredPrompts.length);
  };

  const handleReadAloud = () => {
    if (!isSpeechSynthesisAvailable()) return;
    setIsSpeaking(true);
    speakText(`${currentPrompt.text} ${currentPrompt.followUp}`, {
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const eraTabs: { id: LifeEra | 'all'; label: string }[] = [
    { id: 'all', label: 'All Chapters' },
    { id: 'roots', label: 'Roots & Childhood' },
    { id: 'youth', label: 'Youth & Coming of Age' },
    { id: 'family', label: 'Family & Traditions' },
    { id: 'everyday', label: 'Everyday Joys' },
    { id: 'wisdom', label: 'Wisdom & Legacy' },
  ];

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-7 shadow-xs">
      
      {/* Top Header & Era Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-stone-100 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-900 font-sans">
            <Sparkles className="h-3.5 w-3.5 text-amber-700" />
            <span>Reminiscence Spark</span>
          </div>
          <h2 className="mt-1 font-serif text-xl sm:text-2xl font-medium text-stone-900">
            A Thought to Stir the Memory
          </h2>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {isSpeechSynthesisAvailable() && (
            <button
              onClick={handleReadAloud}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                isSpeaking
                  ? 'border-amber-400 bg-amber-50 text-amber-900'
                  : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
              }`}
              title="Listen to this prompt spoken aloud"
              aria-label="Read prompt aloud"
            >
              <Volume2 className="h-3.5 w-3.5 text-stone-600" />
              <span>{isSpeaking ? 'Reading...' : 'Listen'}</span>
            </button>
          )}

          <button
            onClick={handleNextPrompt}
            className="flex items-center gap-1.5 rounded-lg border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-medium text-stone-700 transition-colors hover:bg-stone-100"
            title="Show another question"
          >
            <Shuffle className="h-3.5 w-3.5 text-stone-600" />
            <span>Another Prompt</span>
          </button>
        </div>
      </div>

      {/* Era Filter segmented button tabs */}
      <div className="mt-4 flex flex-wrap gap-1.5 pb-2">
        {eraTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveEra(tab.id);
              setCurrentIndex(0);
            }}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
              activeEra === tab.id
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80 hover:text-stone-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Prompt Card Body */}
      <div className="mt-4 rounded-xl border border-amber-200/60 bg-amber-50/40 p-5 sm:p-6 transition-all">
        <div className="text-xs font-medium uppercase tracking-wider text-amber-800">
          Chapter · {currentPrompt.eraLabel}
        </div>

        <p className="mt-2.5 font-serif text-lg sm:text-xl font-normal text-stone-900 leading-snug">
          "{currentPrompt.text}"
        </p>

        {currentPrompt.followUp && (
          <p className="mt-2 text-sm text-stone-600 italic">
            {currentPrompt.followUp}
          </p>
        )}

        <div className="mt-5 flex items-center justify-end">
          <button
            onClick={() => onSelectPrompt(currentPrompt)}
            className="inline-flex items-center gap-2 rounded-lg bg-stone-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-stone-800"
          >
            <span>Write About This Memory</span>
            <ArrowRight className="h-3.5 w-3.5 text-amber-200" />
          </button>
        </div>
      </div>

    </div>
  );
};
