/**
 * Client service for Guiding Exploration of memories
 * Follows Core Directives:
 * - Anchor in sensory details
 * - Unpack emotional undercurrents
 * - Not-intrusive, soft, respectful posture
 * - Concise 1-2 short sentences
 * - Ends with exactly one focused question
 */

export async function fetchGuidedReflection(
  memoryText: string,
  meta?: { title?: string; era?: string; mood?: string }
): Promise<string> {
  try {
    const res = await fetch('/api/guide-reflection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        memoryText,
        title: meta?.title,
        era: meta?.era,
        mood: meta?.mood,
      }),
    });

    if (!res.ok) {
      throw new Error(`Server returned status ${res.status}`);
    }

    const data = await res.json();
    if (data.reflection) {
      return data.reflection;
    }
  } catch (e) {
    console.warn('Using client-side heuristic reflection:', e);
  }

  // Fallback heuristic following the exact Core Directives
  const lower = (memoryText + ' ' + (meta?.title || '')).toLowerCase();

  if (lower.includes('kitchen') || lower.includes('dinner') || lower.includes('meal') || lower.includes('cook') || lower.includes('bread') || lower.includes('table')) {
    return 'It sounds like that kitchen held a very distinct warmth. What specific sounds or smells stand out most vividly when you picture yourself sitting at that table?';
  }
  if (lower.includes('road') || lower.includes('journey') || lower.includes('drive') || lower.includes('trip') || lower.includes('sea') || lower.includes('beach')) {
    return 'There is such a feeling of open horizon in that journey. What was the very first sensation you felt on your skin when you arrived at that destination?';
  }
  if (lower.includes('work') || lower.includes('job') || lower.includes('proud') || meta?.mood === 'Proud') {
    return 'That feels like such a quiet turning point. Looking back at yourself in that moment, what do you think you needed most?';
  }
  if (meta?.mood === 'Loved' || lower.includes('grandmother') || lower.includes('friend') || lower.includes('together')) {
    return 'The presence of that person clearly left a deep and lasting imprint. What expression on their face or tone in their voice do you remember most clearly?';
  }

  return 'That moment carries a very peaceful and heartfelt resonance. When you gently return to that exact scene, what small sensory detail stands out most clearly to you?';
}
