import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Image as ImageIcon, Mic, MicOff, Check, Heart, MapPin, Users,
  Sparkles, AlertCircle, Trash2, Play, Pause, Square, ShieldCheck, ArrowRight, Compass
} from 'lucide-react';
import { MemoryEntry, LifeEra, MoodType, MemoryPrompt, IntendedAudience, VisionCategory } from '../types';
import { createSpeechRecognizer, isSpeechRecognitionAvailable } from '../utils/speech';
import { fetchGuidedReflection } from '../utils/reflectionGuide';
import { getAudioUrl } from '../utils/audioStorage';

interface MemoryComposerProps {
  initialPrompt?: MemoryPrompt | null;
  editingEntry?: MemoryEntry | null;
  onSave: (
    entry: Omit<MemoryEntry, 'id' | 'createdAt' | 'updatedAt'>,
    carryForward?: { title: string; smallStep: string; category?: VisionCategory },
    audioBlob?: Blob
  ) => void;
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

  // Requirement 6: "Who should remember this story?"
  const [intendedAudience, setIntendedAudience] = useState<IntendedAudience>(
    editingEntry?.intendedAudience || 'Choose later'
  );
  const [intendedAudienceName, setIntendedAudienceName] = useState(
    editingEntry?.intendedAudienceName || ''
  );

  // Step 3: Gentle AI Reflection
  const [reflectionQuestion, setReflectionQuestion] = useState<string>('');
  const [isLoadingReflection, setIsLoadingReflection] = useState(false);
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(false);

  // Step 4: Look Forward (Carry Forward Intention)
  const [carryForwardEnabled, setCarryForwardEnabled] = useState(
    Boolean(editingEntry?.linkedForwardTitle)
  );
  const [forwardTitle, setForwardTitle] = useState(editingEntry?.linkedForwardTitle || '');
  const [forwardStep, setForwardStep] = useState(editingEntry?.linkedForwardStep || '');

  // Dictation state (Speech to text)
  const [isListening, setIsListening] = useState(false);
  const recognizerRef = useRef<ReturnType<typeof createSpeechRecognizer> | null>(null);

  // Audio recording state (IndexedDB Blob storage)
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState<Blob | null>(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | undefined>(editingEntry?.voiceNoteUrl);
  const [audioDuration, setAudioDuration] = useState<number>(editingEntry?.voiceNoteDuration || 0);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Load existing voice note from IndexedDB if editing
  useEffect(() => {
    if (editingEntry?.id && (editingEntry.hasVoiceNote || editingEntry.voiceNoteUrl)) {
      getAudioUrl(editingEntry.id).then(url => {
        if (url) setRecordedAudioUrl(url);
      });
    }
  }, [editingEntry]);

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
    setAudioError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setAudioError("Voice recording isn't available here. You can still write this story.");
        return;
      }

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
        const mimeType = mediaRecorderRef.current?.mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        setRecordedAudioBlob(audioBlob);
        const objectUrl = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(objectUrl);

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
      setAudioError("Voice recording isn't available here. You can still write this story.");
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
    setRecordedAudioBlob(null);
    setRecordedAudioUrl(undefined);
    setAudioDuration(0);
    setIsPlayingAudio(false);
  };

  const togglePlayback = () => {
    if (!audioPlayerRef.current) return;
    if (isPlayingAudio) {
      audioPlayerRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlayingAudio(true);
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
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
    if (!text.trim() && !recordedAudioBlob && !recordedAudioUrl) {
      return;
    }

    const memoryTitle = title.trim() || (initialPrompt ? initialPrompt.eraLabel : 'Treasured Memory');

    const carryForwardData = carryForwardEnabled && forwardTitle.trim() ? {
      title: forwardTitle.trim(),
      smallStep: forwardStep.trim() || 'Notice and welcome this possibility today.',
      category: (era === 'family' ? 'Loved Ones' : era === 'youth' ? 'Simple Joys' : 'Wellbeing') as VisionCategory,
    } : undefined;

    onSave({
      title: memoryTitle,
      text: text.trim() || (recordedAudioBlob || recordedAudioUrl ? 'Spoken memory keepsake preserved.' : ''),
      era,
      decade,
      people: people.trim() || undefined,
      location: location.trim() || undefined,
      mood,
      promptUsed: promptUsed || undefined,
      photoUrl: photoUrl || undefined,
      photoCaption: photoCaption.trim() || undefined,
      hasVoiceNote: Boolean(recordedAudioBlob || recordedAudioUrl),
      voiceNoteDuration: audioDuration > 0 ? audioDuration : undefined,
      intendedAudience,
      intendedAudienceName: intendedAudience === 'Someone special' ? intendedAudienceName.trim() : undefined,
      linkedForwardTitle: carryForwardData?.title,
      linkedForwardStep: carryForwardData?.smallStep,
      isFavorite,
    }, carryForwardData, recordedAudioBlob || undefined);
  };

  const eraOptions: { value: LifeEra; label: string }[] = [
    { value: 'roots', label: 'Roots & Childhood' },
    { value: 'youth', label: 'Youth & Coming of Age' },
    { value: 'family', label: 'Loved Ones & Traditions' },
    { value: 'everyday', label: 'Everyday Joys' },
    { value: 'wisdom', label: 'Wisdom & Legacy' },
  ];

  const audienceOptions: { value: IntendedAudience; label: string }[] = [
    { value: 'Just me', label: 'Just me' },
    { value: 'My children', label: 'My children' },
    { value: 'My grandchildren', label: 'My grandchildren' },
    { value: 'Someone special', label: 'Someone special...' },
    { value: 'Choose later', label: 'Choose later' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-3 sm:p-6 backdrop-blur-xs overflow-y-auto">
      <div className="relative my-6 w-full max-w-3xl rounded-3xl border border-stone-300 bg-white p-6 sm:p-9 shadow-2xl">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-900 font-sans">
              {editingEntry ? 'Revise Story' : 'Core Journey · Remember'}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-stone-900 mt-0.5">
              {editingEntry ? 'Edit Your Memory' : 'Preserve What You Remember'}
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="rounded-lg p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors cursor-pointer"
            aria-label="Close memory composer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Prompt Origin Banner */}
        {promptUsed && (
          <div className="mt-4 flex items-start justify-between rounded-2xl bg-amber-50/70 p-4 border border-amber-200/70 text-xs sm:text-sm text-stone-800">
            <div className="flex items-start gap-2.5">
              <Sparkles className="h-4 w-4 text-amber-800 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-amber-950 font-sans uppercase text-[11px] block">Prompt Spark</span>
                <p className="font-serif italic text-stone-900 text-sm sm:text-base mt-0.5">"{promptUsed}"</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPromptUsed('')}
              className="text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
              title="Remove prompt banner"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          
          {/* STEP 1: VOICE SIGNATURE CARD (Prominent & Calm) */}
          <div className="rounded-2xl border border-amber-200/90 bg-amber-50/40 p-4 sm:p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-900 font-sans flex items-center gap-1.5">
                <Mic className="h-4 w-4 text-amber-800" />
                <span>Your Voice Is Part of the Memory</span>
              </span>
              {recordedAudioUrl && (
                <span className="text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  Voice Preserved ({formatSeconds(audioDuration)})
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-stone-600 font-serif leading-relaxed mb-4">
              Speak naturally as if sitting across a table from someone you care for. You can record your actual voice, use voice typing, or simply write below.
            </p>

            {audioError && (
              <div className="mb-3 rounded-xl bg-stone-100 p-3 text-xs text-stone-700 border border-stone-200">
                {audioError}
              </div>
            )}

            {/* Recording Controls */}
            {!recordedAudioUrl ? (
              <div className="flex flex-wrap items-center gap-3">
                {!isRecordingAudio ? (
                  <button
                    type="button"
                    onClick={startAudioRecording}
                    className="flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-3 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-stone-800 active:scale-[0.99] cursor-pointer"
                  >
                    <Mic className="h-4 w-4 text-amber-200" />
                    <span>Record My Voice</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-3 bg-rose-50 border border-rose-300 rounded-xl px-4 py-2.5">
                    <span className="h-3 w-3 rounded-full bg-rose-600 animate-ping" />
                    <span className="text-xs font-bold text-rose-900 tabular-nums">
                      Recording: {formatSeconds(audioDuration)}
                    </span>
                    <button
                      type="button"
                      onClick={stopAudioRecording}
                      className="ml-2 flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 cursor-pointer"
                    >
                      <Square className="h-3.5 w-3.5 fill-current" />
                      <span>Finish Recording</span>
                    </button>
                  </div>
                )}

                {/* Voice Typing Option */}
                {isSpeechRecognitionAvailable() && (
                  <button
                    type="button"
                    onClick={toggleDictation}
                    className={`flex items-center gap-1.5 rounded-xl border px-4 py-3 text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                      isListening
                        ? 'border-amber-400 bg-amber-100 text-amber-950 font-semibold'
                        : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <Mic className="h-3.5 w-3.5 text-stone-500" />
                    <span>{isListening ? 'Voice Typing On (Listening...)' : 'Voice Typing (Speech to Text)'}</span>
                  </button>
                )}
              </div>
            ) : (
              /* Playback Preview */
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-amber-200/80">
                <audio
                  ref={audioPlayerRef}
                  src={recordedAudioUrl}
                  onEnded={() => setIsPlayingAudio(false)}
                  className="hidden"
                />
                
                <button
                  type="button"
                  onClick={togglePlayback}
                  className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-stone-900 hover:text-amber-900 cursor-pointer"
                >
                  {isPlayingAudio ? (
                    <>
                      <Pause className="h-4 w-4 text-amber-800" />
                      <span>Pause voice keepsake ({formatSeconds(audioDuration)})</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 text-amber-800 fill-amber-800" />
                      <span>Hear this story in my voice ({formatSeconds(audioDuration)})</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-3 text-xs">
                  <button
                    type="button"
                    onClick={removeVoiceNote}
                    className="text-stone-400 hover:text-rose-700 transition-colors"
                  >
                    Delete Recording
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Title Field */}
          <div>
            <label htmlFor="memory-title" className="block text-xs font-semibold text-stone-700 uppercase tracking-wide">
              Story Title or Landmark (Optional)
            </label>
            <input
              id="memory-title"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Sunday Morning Bread, The Seaside Train, Grandmother's Kitchen"
              className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-sm sm:text-base font-serif"
            />
          </div>

          {/* Narrative Body */}
          <div>
            <label htmlFor="memory-text" className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">
              The Memory (Written or Transcribed)
            </label>
            <textarea
              ref={textareaRef}
              id="memory-text"
              rows={6}
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Start with a sight, a sound, a familiar aroma, or what someone said. Write at your own pace..."
              className="w-full rounded-2xl border border-stone-300 bg-white p-4 font-serif text-base sm:text-lg leading-relaxed text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
            />

            {/* STEP 3: LINGER WITH THIS MEMORY (Optional AI Reflection) */}
            <div className="mt-3">
              {!reflectionQuestion ? (
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleAskForReflection}
                    disabled={isLoadingReflection || !text.trim()}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-amber-950 hover:underline transition-colors disabled:opacity-40 cursor-pointer"
                    title="Linger longer with sensory & emotional exploration"
                  >
                    <Sparkles className="h-4 w-4 text-amber-800" />
                    <span>
                      {isLoadingReflection ? 'Listening softly to your memory...' : 'Linger with this memory (Reflect with Golden Echo)'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowPrivacyNotice(!showPrivacyNotice)}
                    className="text-[11px] text-stone-400 hover:text-stone-600 flex items-center gap-1 cursor-pointer"
                  >
                    <ShieldCheck className="h-3 w-3" />
                    <span>How AI reflection works</span>
                  </button>
                </div>
              ) : (
                /* The AI Reflection Result */
                <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-xs sm:text-sm text-stone-800 shadow-2xs">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-900 font-sans block mb-1">
                        Golden Echo Reflection
                      </span>
                      <p className="font-serif italic text-stone-950 text-sm sm:text-base leading-relaxed">
                        "{reflectionQuestion}"
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setReflectionQuestion('')}
                      className="text-stone-400 hover:text-stone-600 p-1 cursor-pointer shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-amber-200/60 flex items-center justify-between text-xs">
                    <span className="text-stone-500">Take a moment to picture the scene.</span>
                    <button
                      type="button"
                      onClick={() => {
                        setText(prev => prev ? `${prev}\n\n` : '');
                        textareaRef.current?.focus();
                      }}
                      className="font-semibold text-amber-900 hover:underline cursor-pointer"
                    >
                      Add your thoughts into memory →
                    </button>
                  </div>
                </div>
              )}

              {/* Clear Non-Alarming Privacy Explanation */}
              {showPrivacyNotice && (
                <div className="mt-2.5 rounded-xl bg-stone-50 p-3 text-xs text-stone-600 border border-stone-200 leading-relaxed font-sans">
                  <span className="font-semibold text-stone-900 block mb-0.5">Local-First Privacy</span>
                  Your stories, photos, and voice notes are stored safely on your device. AI reflection is completely optional. When you choose to linger with a memory, only the selected text is sent to the configured AI service to generate a gentle reflection question. No account is required.
                </div>
              )}
            </div>
          </div>

          {/* STEP 2: WHO SHOULD REMEMBER THIS STORY? (Requirement 6) */}
          <div className="border-t border-stone-200 pt-5">
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-2">
              Who would you want to remember this story? <span className="text-stone-400 font-normal">(Optional)</span>
            </label>
            <div className="flex flex-wrap gap-2 text-xs">
              {audienceOptions.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setIntendedAudience(opt.value)}
                  className={`px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                    intendedAudience === opt.value
                      ? 'border-amber-900 bg-amber-900 text-white font-semibold shadow-2xs'
                      : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {intendedAudience === 'Someone special' && (
              <div className="mt-2.5">
                <input
                  type="text"
                  value={intendedAudienceName}
                  onChange={e => setIntendedAudienceName(e.target.value)}
                  placeholder="Enter their name (e.g. My daughter Anya, Arthur, Rhea)"
                  className="w-full max-w-sm rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs text-stone-900"
                />
              </div>
            )}
          </div>

          {/* Chapter & Context */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-stone-200 pt-4">
            <div>
              <label htmlFor="era-select" className="block text-xs font-semibold text-stone-700 uppercase tracking-wide">
                Life Chapter
              </label>
              <select
                id="era-select"
                value={era}
                onChange={e => setEra(e.target.value as LifeEra)}
                className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs sm:text-sm text-stone-800"
              >
                {eraOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="people-input" className="block text-xs font-semibold text-stone-700 uppercase tracking-wide">
                People Present <span className="text-stone-400 font-normal">(Optional)</span>
              </label>
              <input
                id="people-input"
                type="text"
                value={people}
                onChange={e => setPeople(e.target.value)}
                placeholder="e.g. Mother, Uncle Leo, Sister Sarah"
                className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs sm:text-sm text-stone-900"
              />
            </div>
          </div>

          {/* STEP 4: LOOK FORWARD (Carry a little of this memory forward) */}
          <div className="border-t border-stone-200 pt-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-900 font-sans block">
                  Step 4 · Looking Forward
                </span>
                <span className="text-xs sm:text-sm text-stone-700 font-medium">
                  Would you like to carry a little of this memory forward?
                </span>
              </div>
              <button
                type="button"
                onClick={() => setCarryForwardEnabled(!carryForwardEnabled)}
                className={`text-xs font-semibold px-3 py-1 rounded-lg border transition-colors cursor-pointer ${
                  carryForwardEnabled
                    ? 'border-amber-800 bg-amber-100 text-amber-950'
                    : 'border-stone-300 text-stone-600 hover:bg-stone-50'
                }`}
              >
                {carryForwardEnabled ? 'Yes, carry forward' : '+ Add an intention'}
              </button>
            </div>

            {carryForwardEnabled && (
              <div className="mt-3.5 space-y-3 rounded-2xl bg-amber-50/50 p-4 border border-amber-200/80">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wide">
                    Something to look forward to inspired by this story:
                  </label>
                  <input
                    type="text"
                    value={forwardTitle}
                    onChange={e => setForwardTitle(e.target.value)}
                    placeholder="e.g. Make her chai recipe with Anya, Sit beside the sea again"
                    className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs sm:text-sm text-stone-900 font-serif"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wide">
                    One gentle next step:
                  </label>
                  <input
                    type="text"
                    value={forwardStep}
                    onChange={e => setForwardStep(e.target.value)}
                    placeholder="e.g. Ask Anya which Sunday she is free, Find my sturdy shoes"
                    className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs sm:text-sm text-stone-900"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Form Action Controls */}
          <div className="flex items-center justify-between border-t border-stone-200 pt-5">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-stone-300 bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-stone-900 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-stone-800 cursor-pointer"
            >
              <Check className="h-4 w-4 text-amber-200" />
              <span>{editingEntry ? 'Update Memory' : 'Keep This Memory'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
