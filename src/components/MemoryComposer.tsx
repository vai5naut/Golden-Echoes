import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Image as ImageIcon, Mic, MicOff, Check, Heart, MapPin, Users,
  Sparkles, AlertCircle, Trash2, Play, Square
} from 'lucide-react';
import { MemoryEntry, LifeEra, MoodType, MemoryPrompt } from '../types';
import { createSpeechRecognizer, isSpeechRecognitionAvailable } from '../utils/speech';
import { fetchGuidedReflection } from '../utils/reflectionGuide';

interface MemoryComposerProps {
  initialPrompt?: MemoryPrompt | null;
  editingEntry?: MemoryEntry | null;
  onSave: (entry: Omit<MemoryEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export const MemoryComposer: React.FC<MemoryComposerProps> = ({
  initialPrompt,
  editingEntry,
  onSave,
  onCancel,
}) => {
  const [title, setTitle] = useState(editingEntry?.title || '');
  const [text, setText] = useState(editingEntry?.text || '');
  const [era, setEra] = useState<LifeEra>(editingEntry?.era || initialPrompt?.era || 'roots');
  const [decade, setDecade] = useState(editingEntry?.decade || '1960s');
  const [people, setPeople] = useState(editingEntry?.people || '');
  const [location, setLocation] = useState(editingEntry?.location || '');
  const [mood, setMood] = useState<MoodType>(editingEntry?.mood || 'Loved');
  const [promptUsed, setPromptUsed] = useState(editingEntry?.promptUsed || initialPrompt?.text || '');
  const [photoUrl, setPhotoUrl] = useState(editingEntry?.photoUrl || '');
  const [photoCaption, setPhotoCaption] = useState(editingEntry?.photoCaption || '');
  const [isFavorite, setIsFavorite] = useState(editingEntry?.isFavorite || false);

  // Gentle Guided Exploration state
  const [reflectionQuestion, setReflectionQuestion] = useState<string>('');
  const [isLoadingReflection, setIsLoadingReflection] = useState(false);

  // Dictation state
  const [isListening, setIsListening] = useState(false);
  const recognizerRef = useRef<ReturnType<typeof createSpeechRecognizer> | null>(null);

  // Voice recording state (MediaRecorder)
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | undefined>(editingEntry?.voiceNoteUrl);
  const [audioDuration, setAudioDuration] = useState<number>(editingEntry?.voiceNoteDuration || 0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Set up speech recognizer on mount if available
  useEffect(() => {
    if (isSpeechRecognitionAvailable()) {
      recognizerRef.current = createSpeechRecognizer(
        (transcript, isFinal) => {
          if (isFinal) {
            setText(prev => (prev ? `${prev} ${transcript}` : transcript));
          }
        },
        listening => setIsListening(listening)
      );
    }
  }, []);

  const handleAskForReflection = async () => {
    if (!text.trim()) return;
    setIsLoadingReflection(true);
    const question = await fetchGuidedReflection(text, { title, era, mood });
    setReflectionQuestion(question);
    setIsLoadingReflection(false);
  };

  const toggleDictation = () => {
    if (!recognizerRef.current) return;
    if (isListening) {
      recognizerRef.current.stop();
    } else {
      recognizerRef.current.start();
    }
  };

  // Audio recording handlers
  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          setRecordedAudioUrl(reader.result as string);
        };
        reader.readAsDataURL(audioBlob);

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecordingAudio(true);
      setAudioDuration(0);

      const startTime = Date.now();
      recordingTimerRef.current = window.setInterval(() => {
        setAudioDuration(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    } catch {
      alert('Microphone access was denied or is unavailable on this device.');
    }
  };

  const stopAudioRecording = () => {
    if (mediaRecorderRef.current && isRecordingAudio) {
      mediaRecorderRef.current.stop();
      setIsRecordingAudio(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    }
  };

  const removeVoiceNote = () => {
    setRecordedAudioUrl(undefined);
    setAudioDuration(0);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      alert('Please write a few words about your memory before saving.');
      return;
    }

    onSave({
      title: title.trim() || 'Treasured Memory',
      text: text.trim(),
      era,
      decade,
      people: people.trim() || undefined,
      location: location.trim() || undefined,
      mood,
      promptUsed: promptUsed || undefined,
      photoUrl: photoUrl || undefined,
      photoCaption: photoCaption.trim() || undefined,
      voiceNoteUrl: recordedAudioUrl,
      voiceNoteDuration: audioDuration > 0 ? audioDuration : undefined,
      isFavorite,
    });
  };

  const eraOptions: { value: LifeEra; label: string }[] = [
    { value: 'roots', label: 'Roots & Childhood' },
    { value: 'youth', label: 'Youth & Coming of Age' },
    { value: 'family', label: 'Family & Traditions' },
    { value: 'everyday', label: 'Everyday Joys' },
    { value: 'wisdom', label: 'Wisdom & Legacy' },
  ];

  const moodOptions: { value: MoodType; label: string }[] = [
    { value: 'Joyful', label: 'Joyful' },
    { value: 'Peaceful', label: 'Peaceful' },
    { value: 'Loved', label: 'Loved' },
    { value: 'Nostalgic', label: 'Nostalgic' },
    { value: 'Proud', label: 'Proud' },
    { value: 'Bittersweet', label: 'Bittersweet' },
  ];

  const decadeOptions = ['1930s', '1940s', '1950s', '1960s', '1970s', '1980s', '1990s', '2000s', 'Recent'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative my-8 w-full max-w-3xl rounded-2xl border border-stone-300 bg-white p-6 sm:p-8 shadow-2xl">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
              {editingEntry ? 'Edit Keepsake' : 'Preserve a Memory'}
            </span>
            <h2 className="font-serif text-2xl font-medium text-stone-900">
              {editingEntry ? 'Revise Your Story' : 'Record What You Remember'}
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="rounded-lg p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors"
            aria-label="Close memory composer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Optional Prompt Reference Banner */}
        {promptUsed && (
          <div className="mt-4 flex items-start justify-between rounded-xl bg-amber-50/70 p-3.5 border border-amber-200/70 text-xs sm:text-sm text-stone-800">
            <div className="flex items-start gap-2">
              <Sparkles className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-amber-950">Prompt: </span>
                <span className="italic">{promptUsed}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPromptUsed('')}
              className="text-stone-400 hover:text-stone-600 ml-2"
              title="Remove prompt banner"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          
          {/* Title Field */}
          <div>
            <label htmlFor="memory-title" className="block text-sm font-semibold text-stone-800">
              Title or Chapter Name
            </label>
            <input
              id="memory-title"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Summer Evenings on Willow Creek, The Blue Bicycle"
              className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
              maxLength={80}
            />
          </div>

          {/* Narrative Body with Dictation Affordance */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="memory-text" className="block text-sm font-semibold text-stone-800">
                Your Memory <span className="text-amber-700 font-normal">(as detailed or simple as you wish)</span>
              </label>

              {/* Dictation Button */}
              {isSpeechRecognitionAvailable() && (
                <button
                  type="button"
                  onClick={toggleDictation}
                  className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                    isListening
                      ? 'bg-rose-100 text-rose-800 animate-pulse'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                  title={isListening ? 'Stop voice typing' : 'Speak your memory aloud to type'}
                >
                  {isListening ? (
                    <>
                      <MicOff className="h-3.5 w-3.5 text-rose-600" />
                      <span>Listening... (click to stop)</span>
                    </>
                  ) : (
                    <>
                      <Mic className="h-3.5 w-3.5 text-stone-600" />
                      <span>Voice Typing</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <textarea
              ref={textareaRef}
              id="memory-text"
              rows={7}
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Start with a sight, a sound, a familiar scent, or the feeling in the air. Who was with you? What was spoken? Write at your own pace..."
              required
              className="w-full rounded-xl border border-stone-300 bg-white p-4 font-serif text-base sm:text-lg leading-relaxed text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
            />

            {/* Guided Exploration: Linger Longer in Sensory & Emotional Details */}
            <div className="mt-2.5">
              {!reflectionQuestion && (
                <button
                  type="button"
                  onClick={handleAskForReflection}
                  disabled={isLoadingReflection || !text.trim()}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-900 hover:text-amber-950 transition-colors disabled:opacity-40"
                  title="Ask a gentle question to help linger and explore sensory details"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-700" />
                  <span>{isLoadingReflection ? 'Listening gently to your memory...' : 'Linger With This Memory (Sensory & Emotional Reflection)'}</span>
                </button>
              )}

              {reflectionQuestion && (
                <div className="rounded-xl border border-amber-200/90 bg-amber-50/70 p-4 text-xs sm:text-sm text-stone-800 transition-all shadow-2xs">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-900 block font-sans">
                        Gentle Exploration
                      </span>
                      <p className="font-serif italic text-stone-900 text-sm sm:text-base leading-relaxed">
                        "{reflectionQuestion}"
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setReflectionQuestion('')}
                      className="text-stone-400 hover:text-stone-600 p-0.5 shrink-0"
                      title="Dismiss reflection"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-amber-200/60 pt-2.5 text-xs">
                    <span className="text-stone-500">Take your time to picture the scene.</span>
                    <button
                      type="button"
                      onClick={() => {
                        setText(prev => prev ? `${prev}\n\n` : '');
                        textareaRef.current?.focus();
                      }}
                      className="font-semibold text-amber-900 hover:underline"
                    >
                      Write your thoughts into memory →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Classification: Era & Decade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="era-select" className="block text-xs font-semibold text-stone-700 uppercase tracking-wide">
                Life Chapter
              </label>
              <select
                id="era-select"
                value={era}
                onChange={e => setEra(e.target.value as LifeEra)}
                className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2 text-sm text-stone-800"
              >
                {eraOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="decade-select" className="block text-xs font-semibold text-stone-700 uppercase tracking-wide">
                Era / Approximate Decade
              </label>
              <select
                id="decade-select"
                value={decade}
                onChange={e => setDecade(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2 text-sm text-stone-800"
              >
                {decadeOptions.map(dec => (
                  <option key={dec} value={dec}>{dec}</option>
                ))}
              </select>
            </div>
          </div>

          {/* People & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="memory-people" className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 uppercase tracking-wide">
                <Users className="h-3.5 w-3.5 text-stone-500" />
                <span>People Involved</span>
              </label>
              <input
                id="memory-people"
                type="text"
                value={people}
                onChange={e => setPeople(e.target.value)}
                placeholder="e.g. Aunt Nora, Arthur, Childhood Friends"
                className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2 text-sm text-stone-800 placeholder:text-stone-400"
              />
            </div>

            <div>
              <label htmlFor="memory-location" className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 uppercase tracking-wide">
                <MapPin className="h-3.5 w-3.5 text-stone-500" />
                <span>Place or Town</span>
              </label>
              <input
                id="memory-location"
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Brighton Pier, The Old Farmhouse"
                className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2 text-sm text-stone-800 placeholder:text-stone-400"
              />
            </div>
          </div>

          {/* Mood Selector - clean segmented control */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-2">
              Emotional Tone
            </label>
            <div className="flex flex-wrap gap-2">
              {moodOptions.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setMood(opt.value)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                    mood === opt.value
                      ? 'border-amber-700 bg-amber-50 font-semibold text-amber-950 shadow-2xs'
                      : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Attached Keepsake Photo */}
          <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50/60 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-stone-500" />
                <span className="text-sm font-semibold text-stone-800">
                  Treasured Photograph (Optional)
                </span>
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-md border border-stone-300 bg-white px-3 py-1 text-xs font-medium text-stone-700 hover:bg-stone-100"
              >
                {photoUrl ? 'Change Photo' : 'Upload Photo'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>

            {photoUrl && (
              <div className="mt-4 flex flex-col sm:flex-row gap-4 items-start border-t border-stone-200 pt-3">
                <img
                  src={photoUrl}
                  alt="Keepsake preview"
                  className="h-28 w-36 object-cover rounded-lg border border-stone-300 shadow-xs"
                />
                <div className="flex-1 w-full">
                  <label htmlFor="photo-caption" className="block text-xs font-medium text-stone-600 mb-1">
                    Photo Caption or Inscription
                  </label>
                  <input
                    id="photo-caption"
                    type="text"
                    value={photoCaption}
                    onChange={e => setPhotoCaption(e.target.value)}
                    placeholder="e.g. Summer picnic by the willow tree, 1968"
                    className="w-full rounded-md border border-stone-300 bg-white px-3 py-1.5 text-xs text-stone-800"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoUrl('');
                      setPhotoCaption('');
                    }}
                    className="mt-2 text-xs text-rose-700 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Remove Photo</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Voice Keepsake Recording */}
          <div className="rounded-xl border border-stone-200 bg-stone-50/60 p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-stone-800 block">
                  Voice Keepsake Recording
                </span>
                <span className="text-xs text-stone-500">
                  Record your spoken voice telling this memory for loved ones to hear.
                </span>
              </div>

              {!isRecordingAudio && !recordedAudioUrl && (
                <button
                  type="button"
                  onClick={startAudioRecording}
                  className="flex items-center gap-1.5 rounded-md border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-800 hover:bg-stone-100"
                >
                  <Mic className="h-3.5 w-3.5 text-amber-800" />
                  <span>Record Voice</span>
                </button>
              )}

              {isRecordingAudio && (
                <button
                  type="button"
                  onClick={stopAudioRecording}
                  className="flex items-center gap-1.5 rounded-md bg-rose-600 px-3 py-1.5 text-xs font-medium text-white animate-pulse"
                >
                  <Square className="h-3.5 w-3.5 fill-white" />
                  <span>Stop Recording ({audioDuration}s)</span>
                </button>
              )}
            </div>

            {recordedAudioUrl && (
              <div className="mt-3 flex items-center justify-between border-t border-stone-200 pt-2.5">
                <audio controls src={recordedAudioUrl} className="h-8 max-w-xs" />
                <button
                  type="button"
                  onClick={removeVoiceNote}
                  className="text-xs text-rose-700 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Remove Voice Note</span>
                </button>
              </div>
            )}
          </div>

          {/* Favorite Toggle */}
          <div className="flex items-center justify-between border-t border-stone-200 pt-4">
            <button
              type="button"
              onClick={() => setIsFavorite(!isFavorite)}
              className={`flex items-center gap-2 text-sm font-medium ${
                isFavorite ? 'text-rose-700' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-rose-600 text-rose-600' : 'text-stone-400'}`} />
              <span>{isFavorite ? 'Marked as Starred Keepsake' : 'Star as Favorite Memory'}</span>
            </button>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-lg bg-stone-900 px-5 py-2 text-sm font-semibold text-white shadow-xs hover:bg-stone-800"
              >
                Save Keepsake
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
