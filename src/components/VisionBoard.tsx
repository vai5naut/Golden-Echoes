import React, { useState } from 'react';
import { 
  Sparkles, Plus, CheckCircle2, Circle, Shuffle, Calendar, 
  Trash2, X, Compass, Image as ImageIcon, Check, Filter
} from 'lucide-react';
import { VisionItem, VisionCategory, TimeHorizon } from '../types';
import { 
  CURATED_VISION_IMAGES, REFLECTION_QUESTIONS, CuratedVisionImage 
} from '../data/seedData';

interface VisionBoardProps {
  visions: VisionItem[];
  onAddVision: (vision: Omit<VisionItem, 'id' | 'createdAt'>) => void;
  onToggleComplete: (id: string) => void;
  onDeleteVision: (id: string) => void;
}

export const VisionBoard: React.FC<VisionBoardProps> = ({
  visions,
  onAddVision,
  onToggleComplete,
  onDeleteVision,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<VisionCategory | 'All'>('All');
  const [isAdding, setIsAdding] = useState(false);
  const [reflectionIndex, setReflectionIndex] = useState(0);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<VisionCategory>('Nature & Travel');
  const [timeHorizon, setTimeHorizon] = useState<TimeHorizon>('This Season');
  const [smallStep, setSmallStep] = useState('');
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState<string>(CURATED_VISION_IMAGES[0].url);
  const [imageFilterCategory, setImageFilterCategory] = useState<string>('matching');

  const categories: (VisionCategory | 'All')[] = [
    'All',
    'Nature & Travel',
    'Loved Ones',
    'Wellbeing',
    'Creativity',
    'Simple Joys',
    'Legacy',
  ];

  const filteredVisions = selectedCategory === 'All'
    ? visions
    : visions.filter(v => v.category === selectedCategory);

  const handleShuffleReflection = () => {
    setReflectionIndex(prev => (prev + 1) % REFLECTION_QUESTIONS.length);
  };

  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategoryChange = (newCat: VisionCategory) => {
    setCategory(newCat);
    // Find first matching generated image for this category if available
    const matching = CURATED_VISION_IMAGES.find(img => img.category === newCat);
    if (matching) {
      setImageUrl(matching.url);
    }
  };

  const displayedImages = imageFilterCategory === 'matching'
    ? CURATED_VISION_IMAGES.filter(img => img.category === category || (category === 'Wellbeing' && (img.category === 'Simple Joys' || img.category === 'Nature & Travel')))
    : imageFilterCategory === 'all'
    ? CURATED_VISION_IMAGES
    : CURATED_VISION_IMAGES.filter(img => img.category === imageFilterCategory);

  const currentSelectedImageMeta = CURATED_VISION_IMAGES.find(img => img.url === imageUrl);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddVision({
      title: title.trim(),
      category,
      timeHorizon,
      smallStep: smallStep.trim() || 'Notice and welcome this possibility today.',
      notes: notes.trim() || undefined,
      imageUrl: imageUrl || undefined,
      completed: false,
    });

    setTitle('');
    setSmallStep('');
    setNotes('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-8">
      
      {/* Top Banner & Introduction */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-900 font-sans">
            <Compass className="h-3.5 w-3.5 text-amber-700" />
            <span>Looking Forward</span>
          </div>
          <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-medium tracking-tight text-stone-900">
            Dynamic Vision Board
          </h2>
          <p className="mt-1.5 text-sm text-stone-600 max-w-2xl">
            A private tapestry of loved ones you want to spend time with, places you long to revisit, creative crafts to try, and simple habits that bring daily peace.
          </p>
        </div>

        <button
          onClick={() => {
            setIsAdding(true);
            const initialImg = CURATED_VISION_IMAGES.find(img => img.category === category) || CURATED_VISION_IMAGES[0];
            setImageUrl(initialImg.url);
          }}
          className="flex items-center gap-2 rounded-lg bg-stone-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-stone-800 self-start md:self-auto"
        >
          <Plus className="h-4 w-4 text-amber-200" />
          <span>Add a New Hope</span>
        </button>
      </div>

      {/* Daily Gentle Reflection Card */}
      <div className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-800">
            <Sparkles className="h-3.5 w-3.5 text-amber-700" />
            <span>Today’s Gentle Reflection</span>
          </div>
          <p className="font-serif text-lg font-normal text-stone-900">
            "{REFLECTION_QUESTIONS[reflectionIndex]}"
          </p>
        </div>

        <button
          onClick={handleShuffleReflection}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-950 hover:bg-amber-100/60 transition-colors"
          title="See another reflection thought"
        >
          <Shuffle className="h-3.5 w-3.5 text-amber-800" />
          <span>New Thought</span>
        </button>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-stone-100 pb-3">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors ${
              selectedCategory === cat
                ? 'bg-stone-900 text-white font-semibold'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80 hover:text-stone-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Vision Board Grid */}
      {filteredVisions.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-stone-200 p-12 text-center bg-white/40">
          <p className="font-serif text-xl text-stone-700">Your vision board is fresh and open.</p>
          <p className="mt-1.5 text-sm text-stone-500 max-w-md mx-auto">
            Choose a hope, a travel wish, a loved one to connect with, or a peaceful daily habit, and select an inspiring image to bring it to life.
          </p>
          <button
            onClick={() => {
              setIsAdding(true);
              const initialImg = CURATED_VISION_IMAGES.find(img => img.category === category) || CURATED_VISION_IMAGES[0];
              setImageUrl(initialImg.url);
            }}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-stone-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-stone-800"
          >
            <Plus className="h-4 w-4 text-amber-200" />
            <span>Add Your First Hope</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVisions.map(item => (
            <div
              key={item.id}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-white shadow-xs transition-all hover:shadow-md ${
                item.completed ? 'border-amber-200/80 bg-amber-50/20 opacity-90' : 'border-stone-200'
              }`}
            >
              {/* Visual Image Banner */}
              {item.imageUrl && (
                <div className="relative aspect-16/9 w-full overflow-hidden bg-stone-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  
                  {/* Category Label: clean text over media scrim */}
                  <span className="absolute bottom-2.5 left-3 text-xs font-semibold text-white drop-shadow-xs">
                    {item.category}
                  </span>
                </div>
              )}

              {/* Card Body */}
              <div className="flex-1 p-5 sm:p-6">
                
                {/* Meta without image */}
                {!item.imageUrl && (
                  <div className="text-xs font-medium uppercase tracking-wider text-amber-800 mb-2">
                    {item.category}
                  </div>
                )}

                <div className="flex items-start justify-between gap-3">
                  <h3 className={`font-serif text-xl font-medium tracking-tight text-stone-900 ${
                    item.completed ? 'line-through text-stone-500' : ''
                  }`}>
                    {item.title}
                  </h3>

                  {/* Complete Checkbox */}
                  <button
                    onClick={() => onToggleComplete(item.id)}
                    className="shrink-0 p-1 text-stone-400 hover:text-amber-800 transition-colors"
                    title={item.completed ? 'Mark as ongoing' : 'Mark as fulfilled/cherished'}
                  >
                    {item.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-amber-800 fill-amber-100" />
                    ) : (
                      <Circle className="h-5 w-5 text-stone-300 group-hover:text-amber-700" />
                    )}
                  </button>
                </div>

                {item.notes && (
                  <p className="mt-2 text-sm text-stone-600 line-clamp-3 font-serif">
                    {item.notes}
                  </p>
                )}

                {/* Small Step Container */}
                <div className="mt-4 rounded-lg bg-stone-50 p-3 border border-stone-100">
                  <span className="block text-xs font-semibold text-stone-500 uppercase tracking-wide">
                    One Small Step:
                  </span>
                  <span className="mt-0.5 block text-xs text-stone-800 font-medium">
                    {item.smallStep}
                  </span>
                </div>
              </div>

              {/* Card Footer: Metadata and Deletion */}
              <div className="flex items-center justify-between border-t border-stone-100 bg-stone-50/40 px-5 py-3 text-xs text-stone-500">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-stone-400" />
                  <span>{item.timeHorizon}</span>
                </span>

                <button
                  onClick={() => {
                    if (confirm(`Remove "${item.title}" from your vision board?`)) {
                      onDeleteVision(item.id);
                    }
                  }}
                  className="text-stone-400 hover:text-rose-700 transition-colors p-1"
                  title="Remove this hope"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Modal: Add a New Hope with Curated Generated Imagery Selection */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="relative my-8 w-full max-w-2xl rounded-2xl border border-stone-300 bg-white p-6 sm:p-8 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
                  Vision & Intention
                </span>
                <h3 className="font-serif text-2xl font-medium text-stone-900">
                  Add a Hope to Your Board
                </h3>
              </div>
              <button
                onClick={() => setIsAdding(false)}
                className="rounded-lg p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-stone-700">
                  A Hope, Dream, or Experience
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Visit the seaside with loved ones, Learn watercolor painting"
                  className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-stone-700">
                    Category Theme
                  </label>
                  <select
                    value={category}
                    onChange={e => handleCategoryChange(e.target.value as VisionCategory)}
                    className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800"
                  >
                    <option value="Nature & Travel">Nature & Travel</option>
                    <option value="Loved Ones">Loved Ones</option>
                    <option value="Wellbeing">Wellbeing</option>
                    <option value="Creativity">Creativity</option>
                    <option value="Simple Joys">Simple Joys</option>
                    <option value="Legacy">Legacy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-stone-700">
                    Time Horizon
                  </label>
                  <select
                    value={timeHorizon}
                    onChange={e => setTimeHorizon(e.target.value as TimeHorizon)}
                    className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800"
                  >
                    <option value="This Season">This Season</option>
                    <option value="This Year">This Year</option>
                    <option value="Someday">Someday</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-stone-700">
                  One Small Step You Can Take
                </label>
                <input
                  type="text"
                  value={smallStep}
                  onChange={e => setSmallStep(e.target.value)}
                  placeholder="e.g. Check the train times, Find my watercolor brushes"
                  className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2 text-sm text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-stone-700">
                  Personal Reflections or Details
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Why does this hope matter to you? How will it feel when experienced?"
                  className="mt-1 w-full rounded-lg border border-stone-300 bg-white p-3 text-sm text-stone-900"
                />
              </div>

              {/* Visual Card Image Selector with Generated Imagery */}
              <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-stone-800">
                      Select an Inspiring Image to Represent It
                    </label>
                    <span className="text-xs text-stone-500">
                      Choose from generated heirloom artwork or your own photo.
                    </span>
                  </div>

                  {/* Filter buttons for images */}
                  <div className="flex items-center gap-1.5 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setImageFilterCategory('matching')}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                        imageFilterCategory === 'matching' ? 'bg-stone-900 text-white' : 'bg-white text-stone-600 border border-stone-200'
                      }`}
                    >
                      Theme Match
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageFilterCategory('all')}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                        imageFilterCategory === 'all' ? 'bg-stone-900 text-white' : 'bg-white text-stone-600 border border-stone-200'
                      }`}
                    >
                      All ({CURATED_VISION_IMAGES.length})
                    </button>
                  </div>
                </div>

                {/* Grid of Generated Images */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-56 overflow-y-auto pr-1">
                  {displayedImages.map(img => {
                    const isSelected = imageUrl === img.url;
                    return (
                      <button
                        key={img.id}
                        type="button"
                        onClick={() => setImageUrl(img.url)}
                        className={`group relative flex flex-col text-left aspect-4/3 rounded-lg overflow-hidden border-2 transition-all ${
                          isSelected
                            ? 'border-amber-800 ring-2 ring-amber-800/40 shadow-xs'
                            : 'border-stone-200 opacity-80 hover:opacity-100 hover:border-stone-300'
                        }`}
                        title={img.description}
                      >
                        <img
                          src={img.url}
                          alt={img.title}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <span className="absolute bottom-1.5 left-1.5 right-1.5 text-[11px] font-medium text-white leading-tight line-clamp-2 drop-shadow-xs">
                          {img.title}
                        </span>
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full bg-amber-800 text-white flex items-center justify-center shadow-xs">
                            <Check className="h-3 w-3 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Selected Image Description Caption */}
                {currentSelectedImageMeta && (
                  <div className="mt-2.5 text-xs text-stone-600 bg-white p-2.5 rounded-lg border border-stone-200">
                    <span className="font-semibold text-stone-900">{currentSelectedImageMeta.title}: </span>
                    <span>{currentSelectedImageMeta.description}</span>
                  </div>
                )}

                {/* Upload own photo / Text-only toggle */}
                <div className="mt-3 flex items-center justify-between border-t border-stone-200 pt-2.5">
                  <label className="cursor-pointer text-xs font-medium text-amber-900 hover:underline flex items-center gap-1.5">
                    <ImageIcon className="h-3.5 w-3.5" />
                    <span>Upload a Custom Photo</span>
                    <input type="file" accept="image/*" onChange={handleCustomImageUpload} className="hidden" />
                  </label>

                  {imageUrl ? (
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="text-xs text-stone-500 hover:text-stone-800 underline"
                    >
                      Use No Image (Text-Only Card)
                    </button>
                  ) : (
                    <span className="text-xs text-stone-500 italic">
                      No image selected (clean text card)
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 border-t border-stone-200 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="rounded-lg border border-stone-300 px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-stone-900 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-stone-800"
                >
                  Add to Board
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

