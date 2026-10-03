/**
 * Lightweight, native IndexedDB helper for audio recording storage.
 * Keeps large audio Blobs out of localStorage so storage quotas are never exceeded.
 * Zero external dependencies.
 */

const DB_NAME = 'golden_echo_audio_db';
const DB_VERSION = 1;
const STORE_NAME = 'voice_notes';

interface AudioRecord {
  id: string; // matches memoryId
  blob: Blob;
  mimeType: string;
  duration?: number;
  createdAt: string;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment.'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Saves an audio Blob into IndexedDB associated with a memory id.
 */
export async function saveAudioBlob(id: string, blob: Blob, duration?: number): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const record: AudioRecord = {
        id,
        blob,
        mimeType: blob.type || 'audio/webm',
        duration,
        createdAt: new Date().toISOString(),
      };
      const req = store.put(record);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (error) {
    console.error('Failed to save audio to IndexedDB:', error);
  }
}

/**
 * Retrieves an audio Blob by memory id.
 */
export async function getAudioBlob(id: string): Promise<Blob | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => {
        const record = req.result as AudioRecord | undefined;
        resolve(record ? record.blob : null);
      };
      req.onerror = () => reject(req.error);
    });
  } catch (error) {
    console.error('Failed to get audio from IndexedDB:', error);
    return null;
  }
}

/**
 * Creates and returns an Object URL for playback of a stored audio note.
 */
export async function getAudioUrl(id: string): Promise<string | null> {
  const blob = await getAudioBlob(id);
  if (!blob) return null;
  return URL.createObjectURL(blob);
}

/**
 * Deletes an audio record from IndexedDB when a memory is removed.
 */
export async function deleteAudioBlob(id: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (error) {
    console.error('Failed to delete audio from IndexedDB:', error);
  }
}

/**
 * Converts a Blob to a base64 string for archive exports.
 */
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Converts a base64 data URL back into a Blob.
 */
export function base64ToBlob(base64: string, defaultType = 'audio/webm'): Blob {
  try {
    const parts = base64.split(',');
    const mimeMatch = parts[0].match(/:(.*?);/);
    const mimeType = mimeMatch ? mimeMatch[1] : defaultType;
    const bstr = atob(parts[1] || parts[0]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mimeType });
  } catch (e) {
    return new Blob([], { type: defaultType });
  }
}

/**
 * Wipes all audio records (for "Start Fresh").
 */
export async function clearAllAudio(): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (error) {
    console.error('Failed to clear audio database:', error);
  }
}
