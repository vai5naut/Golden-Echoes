// Speech Synthesis (Read Aloud) and Dictation Utilities

export interface SpeakOptions {
  rate?: number;
  pitch?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: unknown) => void;
}

export function isSpeechSynthesisAvailable(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function stopSpeaking(): void {
  if (isSpeechSynthesisAvailable()) {
    window.speechSynthesis.cancel();
  }
}

export function speakText(text: string, options: SpeakOptions = {}): boolean {
  if (!isSpeechSynthesisAvailable()) return false;

  stopSpeaking();

  const cleanText = text.replace(/[*_#`]/g, '').trim();
  if (!cleanText) return false;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.rate = options.rate || 0.92; // Slightly measured, gentle pacing for senior clarity
  utterance.pitch = options.pitch || 1.0;

  // Attempt to select a natural English voice if available
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(v => 
    v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Neural') || v.name.includes('Serena') || v.name.includes('Oliver') || v.name.includes('Google') || v.name.includes('Samantha'))
  ) || voices.find(v => v.lang.startsWith('en'));

  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  utterance.onstart = () => {
    if (options.onStart) options.onStart();
  };

  utterance.onend = () => {
    if (options.onEnd) options.onEnd();
  };

  utterance.onerror = (e) => {
    if (options.onError) options.onError(e);
  };

  window.speechSynthesis.speak(utterance);
  return true;
}

// Dictation helper (Speech-to-Text)
export function isSpeechRecognitionAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
}

export interface DictationController {
  start: () => void;
  stop: () => void;
}

export function createSpeechRecognizer(
  onResult: (transcript: string, isFinal: boolean) => void,
  onStateChange: (listening: boolean) => void,
  onError?: (error: string) => void
): DictationController | null {
  if (!isSpeechRecognitionAvailable()) return null;

  type SpeechRecognitionType = new () => {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start: () => void;
    stop: () => void;
    onstart: () => void;
    onend: () => void;
    onerror: (event: { error: string }) => void;
    onresult: (event: {
      resultIndex: number;
      results: {
        length: number;
        [index: number]: {
          isFinal: boolean;
          [index: number]: { transcript: string };
        };
      };
    }) => void;
  };

  const SpeechRec = (window as unknown as { SpeechRecognition: SpeechRecognitionType }).SpeechRecognition ||
    (window as unknown as { webkitSpeechRecognition: SpeechRecognitionType }).webkitSpeechRecognition;

  if (!SpeechRec) return null;

  const recognition = new SpeechRec();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  recognition.onstart = () => {
    onStateChange(true);
  };

  recognition.onend = () => {
    onStateChange(false);
  };

  recognition.onerror = (event) => {
    if (onError) onError(event.error);
    onStateChange(false);
  };

  recognition.onresult = (event) => {
    let transcript = '';
    let isFinal = false;
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      transcript += event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        isFinal = true;
      }
    }
    onResult(transcript, isFinal);
  };

  return {
    start: () => {
      try {
        recognition.start();
      } catch {
        // already started or busy
      }
    },
    stop: () => {
      try {
        recognition.stop();
      } catch {
        // ignore
      }
    }
  };
}
