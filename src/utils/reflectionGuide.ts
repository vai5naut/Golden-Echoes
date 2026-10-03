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

  // Fallback heuristic following the exact Core Directives and safety rules
  const lower = (memoryText + ' ' + (meta?.title || '')).toLowerCase();

  // Boundary check
  if (lower.includes('not today') || lower.includes("don't want to talk") || lower.includes("leave it") || lower.includes("stop") || lower.includes("uncomfortable")) {
    return "We can leave this memory here. We can choose another memory whenever you'd like.";
  }

  // Roti / chai / morning kitchen pattern
  if (lower.includes('roti') || lower.includes('chai') || (lower.includes('mother') && lower.includes('morning'))) {
    return 'Those quiet mornings seem to have stayed very vivid. What could you hear while she was cooking?';
  }

  if (lower.includes('kitchen') || lower.includes('dinner') || lower.includes('meal') || lower.includes('cook') || lower.includes('bread') || lower.includes('table')) {
    return 'That room seems to have had a very distinct warmth and rhythm. What specific sound or smell comes back first when you picture yourself there?';
  }
  if (lower.includes('road') || lower.includes('journey') || lower.includes('drive') || lower.includes('trip') || lower.includes('sea') || lower.includes('beach')) {
    return 'There is such a sense of open air in that journey. What was the very first sensation you remember feeling when you arrived?';
  }
  if (lower.includes('work') || lower.includes('job') || lower.includes('proud') || meta?.mood === 'Proud') {
    return 'That feels like such a quiet turning point. Looking back at yourself in that moment, what do you think you needed most?';
  }
  if (meta?.mood === 'Loved' || lower.includes('grandmother') || lower.includes('friend') || lower.includes('together')) {
    return 'The presence of that person clearly left a lasting impression. What expression on their face or phrase they often said stands out most?';
  }
  if (lower.includes('hate') || lower.includes('hard') || lower.includes('sad') || lower.includes('difficult') || lower.includes('hurt')) {
    return 'That moment clearly carries some weight. What do you remember most clearly about the surroundings right then?';
  }

  return 'That moment holds a very vivid thread. When you gently return to that scene, what small sensory detail stands out most clearly to you?';
}

