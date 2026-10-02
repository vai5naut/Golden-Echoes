import React, { useState } from 'react';
import { Heart, Volume2, VolumeX, Edit3, Trash2, MapPin, Users, Sparkles, X } from 'lucide-react';
import { MemoryEntry } from '../types';
import { speakText, stopSpeaking, isSpeechSynthesisAvailable } from '../utils/speech';
import { fetchGuidedReflection } from '../utils/reflectionGuide';

interface MemoryCardProps {
  memory: MemoryEntry;
  onEdit: (memory: MemoryEntry) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({
  memory,
  onEdit,
  onDelete,
  onToggleFavorite,
}) => {
  const [isReading, setIsReading] = useState(false);
  const [showLinger, setShowLinger] = useState(false);
  const [lingerText, setLingerText] = useState('');
  const [isLoadingLinger, setIsLoadingLinger] = useState(false);

  const eraLabels: Record<string, string> = {
    roots: 'Roots & Childhood',
    youth: 'Youth & Coming of Age',
    family: 'Family & Traditions',
    everyday: 'Everyday Joys',
    wisdom: 'Wisdom & Legacy',
  };

  const handleToggleLinger = async () => {
    if (!showLinger && !lingerText) {
      setIsLoadingLinger(true);
      setShowLinger(true);
      const res = await fetchGuidedReflection(memory.text, {
        title: memory.title,
        era: memory.era,
        mood: memory.mood,
      });
      setLingerText(res);
      setIsLoadingLinger(false);
    } else {
      setShowLinger(!showLinger);
    }
  };

  const handleReadAloud = () => {
    if (!isSpeechSynthesisAvailable()) return;
    if (isReading) {
      stopSpeaking();
      setIsReading(false);
      return;
    }

    setIsReading(true);
    const spokenContent = `${memory.title}. Life Chapter: ${eraLabels[memory.era] || memory.era}. ${memory.text}`;
    speakText(spokenContent, {
      onEnd: () => setIsReading(false),
      onError: () => setIsReading(false),
    });
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(memory.createdAt));

  return (
    <article className="group relative rounded-2xl border border-stone-200 bg-white p-6 sm:p-7 shadow-xs transition-shadow hover:shadow-md">
      
      {/* Top Metadata Header: Zero-pill discipline with typographical separators */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3 text-xs text-stone-500 font-sans">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-amber-900">
            {eraLabels[memory.era] || memory.era}
          </span>
          {memory.decade && (
            <>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span className="tabular-nums font-medium text-stone-700">{memory.decade}</span>
            </>
          )}
          <span aria-hidden="true" className="text-stone-300">·</span>
          <span>{memory.mood}</span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <span className="tabular-nums">{formattedDate}</span>
        </div>

        {/* Favorite Bookmark */}
        <button
          onClick={() => onToggleFavorite(memory.id)}
          className="flex items-center gap-1 text-xs transition-colors hover:text-rose-600 focus-visible:outline-2"
          aria-label={memory.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            className={`h-4 w-4 ${
              memory.isFavorite ? 'fill-rose-600 text-rose-600' : 'text-stone-400 group-hover:text-stone-600'
            }`}
          />
        </button>
      </div>

      {/* Title */}
      <h3 className="mt-4 font-serif text-xl sm:text-2xl font-medium tracking-tight text-stone-900 [text-wrap:balance]">
        {memory.title}
      </h3>

      {/* People & Location Line if specified */}
      {(memory.people || memory.location) && (
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-stone-600">
          {memory.people && (
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-stone-400" />
              <span>{memory.people}</span>
            </span>
          )}
          {memory.people && memory.location && (
            <span aria-hidden="true" className="text-stone-300">/</span>
          )}
          {memory.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-stone-400" />
              <span>{memory.location}</span>
            </span>
          )}
        </div>
      )}

      {/* Narrative Prose */}
      <div className="mt-4 font-serif text-base sm:text-lg leading-relaxed text-stone-800 whitespace-pre-line">
        {memory.text}
      </div>

      {/* Optional Polaroid / Keepsake Attached Photograph */}
      {memory.photoUrl && (
        <div className="mt-5 rounded-xl border border-stone-200 bg-stone-50/70 p-3 max-w-md">
          <img
            src={memory.photoUrl}
            alt={memory.photoCaption || memory.title}
            className="w-full aspect-4/3 object-cover rounded-lg border border-stone-200"
          />
          {memory.photoCaption && (
            <p className="mt-2 text-center font-serif text-xs italic text-stone-600">
              {memory.photoCaption}
            </p>
          )}
        </div>
      )}

      {/* Voice Note Audio Playback if present */}
      {memory.voiceNoteUrl && (
        <div className="mt-4 rounded-xl border border-amber-200/60 bg-amber-50/40 p-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-medium text-amber-900">
            <Volume2 className="h-4 w-4 text-amber-700" />
            <span>Spoken Voice Keepsake {memory.voiceNoteDuration ? `(${memory.voiceNoteDuration}s)` : ''}</span>
          </div>
          <audio controls src={memory.voiceNoteUrl} className="h-8 max-w-xs" />
        </div>
      )}

      {/* Prompt origin if available */}
      {memory.promptUsed && (
        <div className="mt-4 flex items-center gap-1.5 text-xs text-stone-400 italic">
          <Sparkles className="h-3 w-3 text-amber-600" />
          <span>Written in response to: "{memory.promptUsed}"</span>
        </div>
      )}

      {/* Linger Longer Reflection Section */}
      {showLinger && (
        <div className="mt-4 rounded-xl border border-amber-200/80 bg-amber-50/60 p-4 transition-all text-xs sm:text-sm">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-900 font-sans flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-700" />
              <span>Gentle Reflection Spark</span>
            </span>
            <button
              onClick={() => setShowLinger(false)}
              className="text-stone-400 hover:text-stone-600 p-0.5"
              title="Close reflection"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {isLoadingLinger ? (
            <p className="font-serif italic text-stone-500 animate-pulse">
              Listening softly to your memory...
            </p>
          ) : (
            <p className="font-serif text-stone-900 leading-relaxed italic text-sm sm:text-base">
              "{lingerText}"
            </p>
          )}

          <div className="mt-2.5 pt-2 border-t border-amber-200/60 flex items-center justify-between text-xs text-stone-500">
            <span>Anchored in sensory & emotional details.</span>
            <button
              onClick={() => onEdit(memory)}
              className="font-semibold text-amber-900 hover:underline"
            >
              Add reflection to story →
            </button>
          </div>
        </div>
      )}

      {/* Card Action Footer */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 pt-4">
        <div className="flex items-center gap-3">
          {/* Read aloud affordance */}
          {isSpeechSynthesisAvailable() && (
            <button
              onClick={handleReadAloud}
              className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                isReading ? 'text-amber-800' : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Read this memory aloud"
            >
              {isReading ? (
                <>
                  <VolumeX className="h-3.5 w-3.5 text-amber-700 animate-pulse" />
                  <span>Stop Reading</span>
                </>
              ) : (
                <>
                  <Volume2 className="h-3.5 w-3.5 text-stone-400" />
                  <span>Read Aloud</span>
                </>
              )}
            </button>
          )}

          {/* Linger Longer Exploration Affordance */}
          <button
            onClick={handleToggleLinger}
            className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
              showLinger ? 'text-amber-900 font-bold' : 'text-stone-600 hover:text-stone-900'
            }`}
            title="Linger longer with sensory & emotional exploration"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-700" />
            <span>{showLinger ? 'Hide Question' : 'Linger With Memory'}</span>
          </button>
        </div>

        {/* Edit and Delete Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onEdit(memory)}
            className="flex items-center gap-1 text-xs font-medium text-stone-600 hover:text-stone-900"
            title="Edit this memory"
          >
            <Edit3 className="h-3.5 w-3.5 text-stone-400" />
            <span>Edit</span>
          </button>

          <button
            onClick={() => {
              if (confirm(`Are you sure you wish to delete "${memory.title}"?`)) {
                onDelete(memory.id);
              }
            }}
            className="flex items-center gap-1 text-xs font-medium text-rose-700 hover:text-rose-900"
            title="Delete this memory"
          >
            <Trash2 className="h-3.5 w-3.5 text-rose-400" />
            <span>Delete</span>
          </button>
        </div>
      </div>

    </article>
  );
};
