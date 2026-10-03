import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const SYSTEM_INSTRUCTION = `You are Golden Echo, a gentle companion helping someone linger with a personal memory.

Your purpose is not to analyze the person, diagnose them, teach them, summarize their life, or turn the conversation toward yourself.

The AI should primarily NOTICE rather than INTERPRET.

Acknowledge only emotions, relationships, or interpretations that the person has explicitly expressed. Never assign an emotion to the person or characterize a memory as happy, sad, beautiful, meaningful, traumatic, loving, or painful unless their words clearly support that description.

Pay close attention to:
- sensory details
- people
- places
- objects
- sounds
- smells
- food
- rituals
- small actions
- facts explicitly shared

Keep responses short.
One observation.
One question maximum.
If no question would be appropriate, it is acceptable to end without one.

Example:
User: "My father sat outside every evening repairing things."
Avoid: "That sounds like a comforting ritual with your father."
Prefer: "You remember him working outside in the evenings. What kinds of things did he usually repair?"

Prefer concrete sensory questions such as:
"What could you hear from the kitchen?"
"What did the room look like?"
"Do you remember what she used to say?"
"What happened just before that?"
"What smell comes back most strongly?"

Do not automatically praise memories.
Never say "What a beautiful memory", "That sounds wonderful", or "How heartwarming" unless the person's own words explicitly describe it that way.
Do not assume a family relationship was loving or positive.
Do not rewrite the person's memory into a more positive story.

If the memory is painful, acknowledge it neutrally and gently.
Example:
User: "Every Sunday we had to visit my uncle. I hated it."
Better: "Those Sunday visits seem to have stayed vivid for you, though not fondly. What do you remember most strongly about arriving there?"

IMPORTANT SAFETY RULE:
The person never owes you another memory.
If they indicate discomfort, grief, distress, unwillingness, "I don't want to talk about this", "not today", or similar boundaries:
Do NOT ask them to go deeper.
Instead respond briefly with:
"We can leave this memory here."
or
"We don't have to stay with this one. We can choose another memory whenever you'd like."

Never pressure the person to continue.
Do not diagnose dementia, trauma, depression or any mental-health condition.
Do not act as a therapist.
Do not provide clinical interpretations.`;

function getHeuristicReflection(text = '', title = '', _era = '', mood = ''): string {
  const lower = (text + ' ' + title).toLowerCase();
  
  // Boundary check
  if (lower.includes('not today') || lower.includes("don't want to talk") || lower.includes("leave it") || lower.includes("stop") || lower.includes("uncomfortable")) {
    return "We can leave this memory here. We can choose another memory whenever you'd like.";
  }

  // Roti / chai / morning kitchen pattern (as in 60s demo spec)
  if (lower.includes('roti') || lower.includes('chai') || (lower.includes('mother') && lower.includes('morning'))) {
    return 'Those quiet mornings seem to have stayed very vivid. What could you hear while she was cooking?';
  }

  if (lower.includes('kitchen') || lower.includes('dinner') || lower.includes('meal') || lower.includes('cook') || lower.includes('bread') || lower.includes('baking')) {
    return 'That room seems to have had a very distinct warmth and rhythm. What specific sound or smell comes back first when you picture yourself there?';
  }
  if (lower.includes('road') || lower.includes('trip') || lower.includes('drive') || lower.includes('car') || lower.includes('travel') || lower.includes('sea') || lower.includes('beach')) {
    return 'There is such a sense of open air in that journey. What was the very first sensation you remember feeling when you arrived?';
  }
  if (lower.includes('school') || lower.includes('young') || lower.includes('child') || lower.includes('play') || lower.includes('yard') || lower.includes('street')) {
    return 'That scene has a very particular atmosphere. When you look back at that street or yard, what sound from outside comes back first?';
  }
  if (lower.includes('work') || lower.includes('job') || lower.includes('proud') || mood === 'Proud') {
    return 'That feels like such a quiet turning point. Looking back at yourself in that moment, what do you think you needed most?';
  }
  if (mood === 'Loved' || lower.includes('grandmother') || lower.includes('father') || lower.includes('friend')) {
    return 'The presence of that person clearly left a lasting impression. What expression on their face or phrase they often said stands out most?';
  }
  if (lower.includes('hate') || lower.includes('hard') || lower.includes('sad') || lower.includes('difficult') || lower.includes('hurt')) {
    return 'That moment clearly carries some weight. What do you remember most clearly about the surroundings right then?';
  }
  return 'That moment holds a very vivid thread. When you gently return to that scene, what small sensory detail stands out most clearly to you?';
}

app.post('/api/guide-reflection', async (req: Request, res: Response) => {
  try {
    const { memoryText, title, era, mood } = req.body || {};
    if (!memoryText || typeof memoryText !== 'string' || !memoryText.trim()) {
      return res.status(400).json({ error: 'Memory text is required.' });
    }

    if (!ai) {
      return res.json({
        reflection: getHeuristicReflection(memoryText, title, era, mood),
        source: 'local',
      });
    }

    const prompt = `Here is a memory the user has shared:
Title: ${title || 'Untitled Memory'}
Life Chapter: ${era || 'General'}
Mood: ${mood || 'Reflective'}
Memory Content:
"${memoryText.trim()}"

Respond in accordance with the Core Directives: 1 to 2 short sentences total. Primarily notice rather than interpret, and ask at most one gentle, concrete sensory question inviting them to linger in the memory.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const reflection = response.text?.trim() || getHeuristicReflection(memoryText, title, era, mood);
    return res.json({ reflection, source: 'ai' });
  } catch (error) {
    console.error('Error generating reflection:', error);
    const { memoryText, title, era, mood } = req.body || {};
    return res.json({
      reflection: getHeuristicReflection(memoryText, title, era, mood),
      source: 'fallback',
    });
  }
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Golden Echo server listening on http://0.0.0.0:${PORT} (${isProduction ? 'production' : 'development'})`);
  });
}

startServer();
