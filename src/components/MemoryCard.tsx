import React, { useState, useRef, useEffect } from 'react';
import { 
  Heart, Volume2, VolumeX, Edit3, Trash2, MapPin, Users, Sparkles, X, 
  Play, Pause, Compass, ShieldCheck
} from 'lucide-react';
import { MemoryEntry } from '../types';
import { speakText, stopSpeaking, isSpeechSynthesisAvailable } from '../utils/speech';
import { fetchGuidedReflection } from '../utils/reflectionGuide';
import { getAudioUrl } from '../utils/audioStorage';

interface MemoryCardProps {
  memory: MemoryEntry;
  onEdit: (memory: MemoryEntry) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onCarryForward?: (memory: MemoryEntry) => void;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({
  memory,
  onEdit,
  onDelete,
  onToggleFavorite,
  onCarryForward,
}) => {
  const [isReading, setIsReading] = useState(false);
  const [showLinger, setShowLinger] = useState(false);
  const [lingerText, setLingerText] = useState('');
  const [isLoadingLinger, setIsLoadingLinger] = useState(false);

  // Audio note playback state
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(memory.voiceNoteUrl || null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const hasAudio = Boolean(memory.hasVoiceNote || memory.voiceNoteUrl);

  const eraLabels: Record<string, string> = {
    roots: 'Roots & Childhood',
    youth: 'Youth & Coming of Age',
    family: 'Loved Ones & Traditions',
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

  const handleToggleVoicePlayback = async () => {
    if (isPlayingVoice && audioRef.current) {
      audioRef.current.pause();
      setIsPlayingVoice(false);
      return;
    }

    if (!audioUrl) {
      setIsLoadingAudio(true);
      const fetchedUrl = await getAudioUrl(memory.id);
      setIsLoadingAudio(false);
      if (fetchedUrl) {
        setAudioUrl(fetchedUrl);
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play().then(() => setIsPlayingVoice(true)).catch(() => {});
          }
        }, 60);
      }
      return;
    }

    if (audioRef.current) {
      audioRef.current.play().then(() => setIsPlayingVoice(true)).catch(() => {});
    }
  };

  const formatDuration = (sec?: number) => {
    if (!sec) return 'Recorded';
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
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

  const audienceLabel = memory.intendedAudience === 'Someone special' && memory.intendedAudienceName
    ? memory.intendedAudienceName
    : memory.intendedAudience;

  return (
    <article className="group relative rounded-3xl border border-stone-200/90 bg-white p-6 sm:p-8 shadow-xs transition-shadow hover:shadow-md">
      
      {/* Top Metadata Header: Zero-pill discipline with typographical separators */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3.5 text-xs text-stone-500 font-sans">
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
          className="flex items-center gap-1 text-xs transition-colors hover:text-rose-600 focus-visible:outline-2 cursor-pointer"
          aria-label={memory.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            className={`h-4 w-4 ${
              memory.isFavorite ? 'fill-rose-600 text-rose-600' : 'text-stone-300 group-hover:text-stone-500'
            }`}
          />
        </button>
      </div>

      {/* Title */}
      <h3 className="mt-4 font-serif text-xl sm:text-2xl font-medium tracking-tight text-stone-900 [text-wrap:balance]">
        {memory.title}
      </h3>

      {/* People & Location Line */}
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

      {/* Prompt Origin Indicator */}
      {memory.promptUsed && (
        <p className="mt-2 text-xs text-amber-900/80 font-serif italic">
          Sparked by: "{memory.promptUsed}"
        </p>
      )}

      {/* SIGNATURE VOICE KEEPSAKE (Prominent presentation) */}
      {hasAudio && (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/70 p-4 transition-all">
          <audio
            ref={audioRef}
            src={audioUrl || memory.voiceNoteUrl || ''}
            onEnded={() => setIsPlayingVoice(false)}
            className="hidden"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <button
              onClick={handleToggleVoicePlayback}
              className="flex items-center gap-2.5 text-sm font-semibold text-stone-900 hover:text-amber-950 cursor-pointer text-left"
            >
              <div className="h-9 w-9 rounded-full bg-stone-900 text-white flex items-center justify-center shrink-0 shadow-xs hover:bg-stone-800">
                {isPlayingVoice ? (
                  <Pause className="h-4 w-4 fill-white" />
                ) : (
                  <Play className="h-4 w-4 fill-white translate-x-0.5" />
                )}
              </div>
              <div>
                <span className="block font-medium">
                  {isPlayingVoice ? 'Listening to story...' : isLoadingAudio ? 'Loading recording...' : 'Hear this story in my voice'}
                </span>
                <span className="block text-xs text-stone-500 font-sans tabular-nums">
                  Voice Keepsake · {formatDuration(memory.voiceNoteDuration)}
                </span>
              </div>
            </button>

            <span className="text-[11px] text-amber-900/80 font-sans italic self-start sm:self-auto">
              Preserved in original voice
            </span>
          </div>
        </div>
      )}

      {/* Narrative Prose */}
      <div className="mt-4 font-serif text-base sm:text-lg leading-relaxed text-stone-800 whitespace-pre-line">
        {memory.text}
      </div>

      {/* Attached Photo */}
      {memory.photoUrl && (
        <div className="mt-5 rounded-2xl border border-stone-200 bg-stone-50/70 p-3 max-w-md">
          <img
            src={memory.photoUrl}
            alt={memory.photoCaption || memory.title}
            className="w-full aspect-4/3 object-cover rounded-xl border border-stone-200"
          />
          {memory.photoCaption && (
            <p className="mt-2 text-center font-serif text-xs italic text-stone-600">
              {memory.photoCaption}
            </p>
          )}
        </div>
      )}

      {/* Requirement 6: Intended Audience Tag */}
      {audienceLabel && audienceLabel !== 'Choose later' && (
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-1.5 text-xs text-stone-500">
          <span className="font-semibold text-amber-950">Preserved for:</span>
          <span className="italic">{audienceLabel}</span>
        </div>
      )}

      {/* Linked Looking Forward Intention if present */}
      {memory.linkedForwardTitle && (
        <div className="mt-3 rounded-xl bg-amber-50/50 p-3 border border-amber-200/60 text-xs text-stone-700 flex items-start gap-2">
          <Compass className="h-4 w-4 text-amber-800 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-stone-900">Looking Forward: </span>
            <span>"{memory.linkedForwardTitle}"</span>
            {memory.linkedForwardStep && (
              <span className="block text-stone-500 mt-0.5">Gentle step: {memory.linkedForwardStep}</span>
            )}
          </div>
        </div>
      )}

      {/* Linger Longer Reflection Section */}
      {showLinger && (
        <div className="mt-4 rounded-2xl border border-amber-200/90 bg-amber-50/80 p-4 transition-all text-xs sm:text-sm">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-900 font-sans flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-700" />
              <span>Gentle Reflection Spark</span>
            </span>
            <button
              onClick={() => setShowLinger(false)}
              className="text-stone-400 hover:text-stone-600 p-0.5 cursor-pointer"
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
              className="font-semibold text-amber-900 hover:underline cursor-pointer"
            >
              Add reflection to story →
            </button>
          </div>
        </div>
      )}

      {/* Card Action Footer */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 pt-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Read aloud affordance */}
          {isSpeechSynthesisAvailable() && (
            <button
              onClick={handleReadAloud}
              className={`flex items-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer ${
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
            className={`flex items-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              showLinger ? 'text-amber-900 font-bold' : 'text-stone-600 hover:text-stone-900'
            }`}
            title="Linger longer with sensory & emotional exploration"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-700" />
            <span>{showLinger ? 'Hide Question' : 'Linger With Memory'}</span>
          </button>

          {/* Carry Forward to Looking Forward */}
          {onCarryForward && (
            <button
              onClick={() => onCarryForward(memory)}
              className="flex items-center gap-1 text-xs font-medium text-stone-600 hover:text-amber-950 transition-colors cursor-pointer"
              title="Carry forward a hope from this memory"
            >
              <Compass className="h-3.5 w-3.5 text-stone-400" />
              <span>Carry forward</span>
            </button>
          )}
        </div>

        {/* Edit and Delete Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onEdit(memory)}
            className="flex items-center gap-1 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
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
            className="flex items-center gap-1 text-xs font-medium text-rose-700 hover:text-rose-900 cursor-pointer"
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
