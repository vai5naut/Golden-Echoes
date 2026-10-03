import React from 'react';
import { X, Printer, BookOpen, Heart, Calendar, MapPin, Users, Mic, Compass } from 'lucide-react';
import { MemoryEntry, LifeEra, VisionItem } from '../types';

interface BookletModalProps {
  memories: MemoryEntry[];
  visions?: VisionItem[];
  onClose?: () => void;
  isInlineView?: boolean;
}

export const BookletModal: React.FC<BookletModalProps> = ({
  memories,
  visions = [],
  onClose,
  isInlineView = false,
}) => {
  const eraLabels: Record<LifeEra, string> = {
    roots: 'Chapter I · Roots & Childhood',
    youth: 'Chapter II · Youth & Coming of Age',
    family: 'Chapter III · Loved Ones & Traditions',
    everyday: 'Chapter IV · Everyday Joys',
    wisdom: 'Chapter V · Wisdom & Legacy',
  };

  const erasOrder: LifeEra[] = ['roots', 'youth', 'family', 'everyday', 'wisdom'];

  const memoriesByEra = erasOrder.reduce<Record<LifeEra, MemoryEntry[]>>((acc, era) => {
    acc[era] = memories.filter(m => m.era === era);
    return acc;
  }, { roots: [], youth: [], family: [], everyday: [], wisdom: [] });

  const handlePrint = () => {
    window.print();
  };

  const totalWords = memories.reduce((acc, m) => acc + m.text.split(/\s+/).length, 0);

  const containerClasses = isInlineView
    ? 'w-full max-w-4xl mx-auto rounded-3xl border border-stone-300 bg-[#FAF7F2] p-6 sm:p-12 shadow-sm text-stone-900 my-4'
    : 'relative my-6 w-full max-w-4xl rounded-3xl border border-stone-300 bg-[#FAF7F2] p-6 sm:p-12 shadow-2xl text-stone-900';

  const content = (
    <div className={containerClasses}>
      
      {/* Top Floating Controls - hidden in print */}
      <div className="no-print sticky -top-4 z-20 flex items-center justify-between border-b border-stone-200 bg-[#FAF7F2]/95 pb-4 backdrop-blur-xs">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-amber-900" />
          <span className="font-serif text-lg font-semibold text-stone-900">
            Heirloom Keepsake Edition
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-stone-800 cursor-pointer"
          >
            <Printer className="h-4 w-4 text-amber-200" />
            <span>Print / Save as PDF</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-stone-500 hover:bg-stone-200/60 cursor-pointer"
              aria-label="Close keepsake"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* BOOKLET CONTENT - PRINTABLE */}
      <div className="booklet-printable-content mt-8 space-y-12">
        
        {/* Title Cover Page */}
        <div className="text-center border-b-2 border-stone-300 pb-12 pt-6">
          <span className="text-xs uppercase tracking-widest text-stone-500 font-sans block">
            Golden Echo · Archival Family Keepsake
          </span>
          <h1 className="mt-4 font-serif text-4xl sm:text-5xl font-medium tracking-tight text-stone-900 [text-wrap:balance]">
            Treasures of a Life Well Remembered
          </h1>
          <p className="mt-4 font-serif text-lg sm:text-xl italic text-stone-600 max-w-lg mx-auto leading-relaxed">
            "A gentle space for stories, voices, people and moments worth keeping."
          </p>

          <div className="mt-8 flex flex-wrap justify-center items-center gap-3 sm:gap-4 text-xs text-stone-500 font-sans uppercase tracking-wider">
            <span>{memories.length} Memories Preserved</span>
            <span>·</span>
            <span className="tabular-nums">{totalWords} Words</span>
            <span>·</span>
            <span>Compiled {new Date().getFullYear()}</span>
          </div>
        </div>

        {/* Table of Chapters */}
        <div className="border-b border-stone-200 pb-8">
          <h2 className="text-xs uppercase tracking-widest text-stone-500 font-sans mb-4">
            Contents by Chapter
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-serif">
            {erasOrder.map(era => {
              const count = memoriesByEra[era].length;
              return (
                <div key={era} className="flex justify-between items-center py-1.5 border-b border-stone-200/60">
                  <span className="text-stone-800">{eraLabels[era]}</span>
                  <span className="text-stone-400 tabular-nums text-xs font-sans">
                    {count} {count === 1 ? 'memory' : 'memories'}
                  </span>
                </div>
              );
            })}
            {visions.length > 0 && (
              <div className="flex justify-between items-center py-1.5 border-b border-stone-200/60">
                <span className="text-stone-800">Appendix · Things Looking Forward To</span>
                <span className="text-stone-400 tabular-nums text-xs font-sans">
                  {visions.length} {visions.length === 1 ? 'intention' : 'intentions'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Chapters and Memories */}
        {memories.length === 0 ? (
          <div className="py-12 text-center text-stone-500 font-serif">
            <p className="text-lg">No memories have been written into the keepsake yet.</p>
            <p className="text-sm mt-1 text-stone-400">Begin with today's echo or write any treasured recollection.</p>
          </div>
        ) : (
          erasOrder.map(era => {
            const eraMemories = memoriesByEra[era];
            if (eraMemories.length === 0) return null;

            return (
              <div key={era} className="space-y-8 pt-4">
                
                {/* Chapter Heading Banner */}
                <div className="border-b-2 border-stone-800 pb-2">
                  <h2 className="font-serif text-2xl sm:text-3xl font-normal text-stone-900 tracking-tight">
                    {eraLabels[era]}
                  </h2>
                </div>

                {/* Chapter Entries */}
                <div className="space-y-10">
                  {eraMemories.map(entry => (
                    <article key={entry.id} className="space-y-4 border-b border-stone-200/70 pb-8 last:border-b-0">
                      
                      {/* Entry Header */}
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="font-serif text-xl sm:text-2xl font-medium text-stone-900">
                          {entry.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-stone-500 font-sans">
                          {entry.decade && <span>{entry.decade}</span>}
                          {entry.decade && <span>·</span>}
                          <span>{entry.mood}</span>
                        </div>
                      </div>

                      {/* Prompt and People info */}
                      {(entry.people || entry.location) && (
                        <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 font-sans">
                          {entry.people && (
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3 text-stone-400" />
                              <span>{entry.people}</span>
                            </span>
                          )}
                          {entry.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-stone-400" />
                              <span>{entry.location}</span>
                            </span>
                          )}
                        </div>
                      )}

                      {/* Voice Indicator: Tells reader audio was preserved */}
                      {(entry.hasVoiceNote || entry.voiceNoteUrl) && (
                        <div className="inline-flex items-center gap-1.5 rounded-lg bg-amber-100/70 border border-amber-300 px-2.5 py-1 text-xs text-amber-950 font-sans">
                          <Mic className="h-3.5 w-3.5 text-amber-800" />
                          <span>Spoken voice keepsake preserved {entry.voiceNoteDuration ? `(${entry.voiceNoteDuration}s)` : ''}</span>
                        </div>
                      )}

                      {/* Photo if present */}
                      {entry.photoUrl && (
                        <div className="max-w-md my-4">
                          <img
                            src={entry.photoUrl}
                            alt={entry.title}
                            className="rounded-xl border border-stone-300 object-cover max-h-72 w-auto"
                          />
                          {entry.photoCaption && (
                            <p className="mt-1 text-center font-serif text-xs italic text-stone-500">
                              {entry.photoCaption}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Memory Story Prose */}
                      <p className="font-serif text-base sm:text-lg leading-relaxed text-stone-800 whitespace-pre-line text-justify">
                        {entry.text}
                      </p>

                      {/* Intended Audience Tag */}
                      {entry.intendedAudience && entry.intendedAudience !== 'Choose later' && (
                        <p className="text-xs text-stone-500 font-sans italic pt-2">
                          Preserved for: {entry.intendedAudience === 'Someone special' && entry.intendedAudienceName ? entry.intendedAudienceName : entry.intendedAudience}
                        </p>
                      )}

                    </article>
                  ))}
                </div>

              </div>
            );
          })
        )}

        {/* Appendix: Looking Forward (Things I'm Looking Forward To) */}
        {visions.length > 0 && (
          <div className="pt-8 border-t-2 border-stone-800 space-y-6">
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-stone-900 tracking-tight">
              Appendix · Hopes on the Horizon
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {visions.map(item => (
                <div key={item.id} className="p-4 rounded-xl border border-stone-200 bg-white/70">
                  <span className="text-xs text-amber-900 font-sans uppercase font-semibold">{item.category}</span>
                  <h4 className="font-serif text-lg font-medium text-stone-900 mt-0.5">{item.title}</h4>
                  <p className="text-xs text-stone-600 mt-1 font-serif">Next step: {item.smallStep}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Archival Colophon */}
        <div className="text-center border-t border-stone-300 pt-8 pb-4 text-xs text-stone-400 font-sans">
          <span>Golden Echo Keepsake Edition · Preserving what shaped us · Created with care</span>
        </div>

      </div>

    </div>
  );

  if (isInlineView) {
    return content;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 p-2 sm:p-6 backdrop-blur-xs overflow-y-auto">
      {content}
    </div>
  );
};
