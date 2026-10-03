import React, { useState } from 'react';
import { Search, Heart, SlidersHorizontal, BookOpen, Plus } from 'lucide-react';
import { MemoryEntry, LifeEra, MemoryPrompt } from '../types';
import { PromptCarousel } from './PromptCarousel';
import { MemoryCard } from './MemoryCard';

interface JournalSectionProps {
  memories: MemoryEntry[];
  onSelectPromptToDraft: (prompt: MemoryPrompt) => void;
  onOpenNewMemory: () => void;
  onEditMemory: (memory: MemoryEntry) => void;
  onDeleteMemory: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onCarryForward?: (memory: MemoryEntry) => void;
}

export const JournalSection: React.FC<JournalSectionProps> = ({
  memories,
  onSelectPromptToDraft,
  onOpenNewMemory,
  onEditMemory,
  onDeleteMemory,
  onToggleFavorite,
  onCarryForward,
}) => {
  const [selectedEra, setSelectedEra] = useState<LifeEra | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedDecade, setSelectedDecade] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'decade'>('newest');

  const eraTabs: { id: LifeEra | 'all'; label: string }[] = [
    { id: 'all', label: 'All Chapters' },
    { id: 'roots', label: 'Roots & Childhood' },
    { id: 'youth', label: 'Youth & Coming of Age' },
    { id: 'family', label: 'Loved Ones & Traditions' },
    { id: 'everyday', label: 'Everyday Joys' },
    { id: 'wisdom', label: 'Wisdom & Legacy' },
  ];

  const decades = ['all', '1930s', '1940s', '1950s', '1960s', '1970s', '1980s', '1990s', '2000s', 'Recent'];

  // Filter logic
  const filteredMemories = memories.filter(item => {
    if (selectedEra !== 'all' && item.era !== selectedEra) return false;
    if (showFavoritesOnly && !item.isFavorite) return false;
    if (selectedDecade !== 'all' && item.decade !== selectedDecade) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchText = item.text.toLowerCase().includes(q);
      const matchPeople = item.people?.toLowerCase().includes(q);
      const matchLoc = item.location?.toLowerCase().includes(q);
      const matchMood = item.mood.toLowerCase().includes(q);
      return matchTitle || matchText || matchPeople || matchLoc || matchMood;
    }

    return true;
  });

  // Sort logic
  const sortedMemories = [...filteredMemories].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (sortBy === 'decade') {
      return (a.decade || '').localeCompare(b.decade || '');
    }
    return 0;
  });

  return (
    <div className="space-y-8">
      
      {/* 1. Prompt Spark Carousel */}
      <PromptCarousel onSelectPrompt={onSelectPromptToDraft} />

      {/* 2. Filter & Search Utility Header */}
      <div className="space-y-4 rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 shadow-xs">
        
        {/* Row 1: Search & Favorite Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by keywords, loved ones, towns, or memories..."
              className="w-full rounded-lg border border-stone-300 bg-stone-50/50 pl-10 pr-4 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:bg-white focus:ring-1 focus:ring-stone-900"
            />
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* Favorites Only Toggle */}
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                showFavoritesOnly
                  ? 'border-rose-300 bg-rose-50 text-rose-800'
                  : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
              }`}
            >
              <Heart className={`h-3.5 w-3.5 ${showFavoritesOnly ? 'fill-rose-600 text-rose-600' : 'text-stone-400'}`} />
              <span>Starred Keepsakes</span>
            </button>

            {/* Decade Selector */}
            <select
              value={selectedDecade}
              onChange={e => setSelectedDecade(e.target.value)}
              className="rounded-lg border border-stone-200 bg-stone-50 px-2.5 py-2 text-xs font-medium text-stone-700"
              aria-label="Filter by decade"
            >
              <option value="all">All Decades</option>
              {decades.filter(d => d !== 'all').map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as 'newest' | 'oldest' | 'decade')}
              className="rounded-lg border border-stone-200 bg-stone-50 px-2.5 py-2 text-xs font-medium text-stone-700"
              aria-label="Sort memories"
            >
              <option value="newest">Recent First</option>
              <option value="oldest">Oldest First</option>
              <option value="decade">By Era Decade</option>
            </select>
          </div>
        </div>

        {/* Row 2: Life Era Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 border-t border-stone-100 pt-3">
          {eraTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedEra(tab.id)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedEra === tab.id
                  ? 'bg-stone-900 text-white font-semibold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80 hover:text-stone-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

      </div>

      {/* 3. Memory Stream */}
      <div className="space-y-6">
        
        {/* Stream Header & Count */}
        <div className="flex items-center justify-between text-xs text-stone-500 font-sans">
          <span>
            Showing <strong className="font-semibold text-stone-800 tabular-nums">{sortedMemories.length}</strong> {sortedMemories.length === 1 ? 'keepsake' : 'keepsakes'}
            {searchQuery && ` matching "${searchQuery}"`}
            {showFavoritesOnly && ' (Starred Only)'}
          </span>

          <button
            onClick={onOpenNewMemory}
            className="flex items-center gap-1 text-xs font-semibold text-amber-900 hover:underline"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Write a Memory</span>
          </button>
        </div>

        {/* Memory Cards */}
        {sortedMemories.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-stone-200 p-12 text-center bg-white/50">
            <BookOpen className="h-8 w-8 text-stone-300 mx-auto mb-3" />
            <p className="font-serif text-lg text-stone-600">No memories found for this view.</p>
            <p className="mt-1 text-sm text-stone-400">
              Try choosing "All Chapters" or clear your search term, or write a new story today.
            </p>
            <button
              onClick={onOpenNewMemory}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-stone-900 px-4 py-2 text-xs font-semibold text-white hover:bg-stone-800"
            >
              <Plus className="h-3.5 w-3.5 text-amber-200" />
              <span>Write a Memory</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {sortedMemories.map(memory => (
              <MemoryCard
                key={memory.id}
                memory={memory}
                onEdit={onEditMemory}
                onDelete={onDeleteMemory}
                onToggleFavorite={onToggleFavorite}
                onCarryForward={onCarryForward}
              />
            ))}
          </div>
        )}

      </div>

    </div>
  );
};
