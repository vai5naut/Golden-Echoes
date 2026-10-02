import React from 'react';
import { X, Printer, BookOpen, Heart, Calendar, MapPin, Users } from 'lucide-react';
import { MemoryEntry, LifeEra } from '../types';

interface BookletModalProps {
  memories: MemoryEntry[];
  onClose: () => void;
}

export const BookletModal: React.FC<BookletModalProps> = ({ memories, onClose }) => {
  const eraLabels: Record<LifeEra, string> = {
    roots: 'Chapter I · Roots & Childhood',
    youth: 'Chapter II · Youth & Coming of Age',
    family: 'Chapter III · Family & Traditions',
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 p-2 sm:p-6 backdrop-blur-xs overflow-y-auto">
      <div className="relative my-6 w-full max-w-4xl rounded-2xl border border-stone-300 bg-[#FAF7F2] p-6 sm:p-12 shadow-2xl text-stone-900">
        
        {/* Top Floating Controls - hidden in print */}
        <div className="no-print sticky -top-4 z-20 flex items-center justify-between border-b border-stone-200 bg-[#FAF7F2]/90 pb-4 backdrop-blur-xs">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-amber-900" />
            <span className="font-serif text-lg font-semibold text-stone-900">
              Heirloom Memory Keepsake Edition
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg bg-stone-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-stone-800"
            >
              <Printer className="h-4 w-4 text-amber-200" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              onClick={onClose}
              className="rounded-lg p-2 text-stone-500 hover:bg-stone-200/60"
              aria-label="Close booklet"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* BOOKLET CONTENT - PRINTABLE */}
        <div className="booklet-printable-content mt-8 space-y-12">
          
          {/* Title Page */}
          <div className="text-center border-b-2 border-stone-300 pb-12 pt-4">
            <span className="text-xs uppercase tracking-widest text-stone-500 font-sans">
              Golden Echo · Archival Family Keepsake
            </span>
            <h1 className="mt-4 font-serif text-4xl sm:text-5xl font-medium tracking-tight text-stone-900 [text-wrap:balance]">
              Treasures of a Life Well Remembered
            </h1>
            <p className="mt-4 font-serif text-lg italic text-stone-600 max-w-lg mx-auto">
              A private collection of memories, cherished traditions, and enduring life lessons compiled for those we hold dear.
            </p>

            <div className="mt-8 flex justify-center items-center gap-4 text-xs text-stone-400 font-sans uppercase tracking-wider">
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
                  <div key={era} className="flex justify-between items-center py-1 border-b border-stone-200/60">
                    <span className="text-stone-800">{eraLabels[era]}</span>
                    <span className="text-stone-400 tabular-nums text-xs font-sans">
                      {count} {count === 1 ? 'memory' : 'memories'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Memory Chapters */}
          {erasOrder.map(era => {
            const eraMemories = memoriesByEra[era];
            if (eraMemories.length === 0) return null;

            return (
              <section key={era} className="space-y-8 pt-4">
                <div className="border-b border-stone-300 pb-2">
                  <h2 className="font-serif text-2xl font-semibold text-stone-900">
                    {eraLabels[era]}
                  </h2>
                </div>

                <div className="space-y-10">
                  {eraMemories.map((entry, idx) => (
                    <article key={entry.id} className="print-avoid-break space-y-3">
                      <div className="flex items-baseline justify-between border-b border-stone-200/70 pb-1.5 text-xs text-stone-500 font-sans">
                        <span className="font-mono text-stone-400 tabular-nums">
                          {String(idx + 1).padStart(2, '0')}.
                        </span>
                        <div className="flex items-center gap-2">
                          {entry.decade && <span className="tabular-nums">{entry.decade}</span>}
                          {entry.decade && entry.mood && <span>·</span>}
                          {entry.mood && <span>{entry.mood}</span>}
                        </div>
                      </div>

                      <h3 className="font-serif text-2xl font-medium tracking-tight text-stone-900">
                        {entry.title}
                      </h3>

                      {(entry.people || entry.location) && (
                        <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 font-sans italic">
                          {entry.people && <span>With: {entry.people}</span>}
                          {entry.people && entry.location && <span>—</span>}
                          {entry.location && <span>At: {entry.location}</span>}
                        </div>
                      )}

                      {entry.photoUrl && (
                        <div className="my-4 max-w-md">
                          <img
                            src={entry.photoUrl}
                            alt={entry.title}
                            className="rounded-lg border border-stone-300 aspect-4/3 object-cover"
                          />
                          {entry.photoCaption && (
                            <p className="mt-1.5 text-center font-serif text-xs italic text-stone-600">
                              {entry.photoCaption}
                            </p>
                          )}
                        </div>
                      )}

                      <p className="font-serif text-base sm:text-lg leading-relaxed text-stone-800 whitespace-pre-line first-letter:text-4xl first-letter:font-bold first-letter:font-serif first-letter:float-left first-letter:mr-2.5 first-letter:leading-none">
                        {entry.text}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}

          {/* Heirloom Book Closing Sign-Off */}
          <div className="print-avoid-break border-t-2 border-stone-300 pt-10 text-center space-y-3 font-serif">
            <p className="text-base text-stone-700 italic">
              "The life of the dead is placed in the memory of the living."
            </p>
            <p className="text-xs text-stone-400 font-sans uppercase tracking-widest">
              Preserved with Golden Echo
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
