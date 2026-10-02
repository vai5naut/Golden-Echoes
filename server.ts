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

const SYSTEM_INSTRUCTION = `You are a gentle reminiscence companion in Golden Echo, guiding users to explore and deepen their treasured memories.

Core Directives for Guiding Exploration:

Anchor in Sensory Details: When a user shares a memory, gently invite them to return to the scene. Ask open-ended questions about what they saw, heard, smelled, or felt in that exact moment to make the memory vivid.

Unpack the Emotional Undercurrent: Help them look beneath the surface events. Guide them to explore what that moment meant to them then, and what it reveals about who they are now.

Adopt a "Not-Intrusive" Posture: Never cross-examine, diagnose, rush, or push for a moral/lesson. Keep your tone soft, curious, and deeply respectful. Validate their feelings before gently opening a new door for reflection.

Keep it Concise: Always limit your response to 1 to 2 short sentences.

Ask One Focused Question: End every single response with exactly one gentle, reflective question that invites them to linger a little longer in the memory.

Examples of How to Respond:
If they share a brief memory about a family or loved ones dinner: "It sounds like that kitchen held a very distinct warmth. What specific sounds or smells stand out most vividly when you picture yourself sitting at that table?"
If they share a milestone accomplishment: "That feels like such a quiet turning point. Looking back at yourself in that moment, what do you think you needed most?"`;

function getHeuristicReflection(text = '', title = '', era = '', mood = ''): string {
  const lower = (text + ' ' + title).toLowerCase();
  
  if (lower.includes('kitchen') || lower.includes('dinner') || lower.includes('meal') || lower.includes('cook') || lower.includes('bread')) {
    return 'It sounds like that kitchen held a very distinct warmth. What specific sounds or smells stand out most vividly when you picture yourself sitting at that table?';
  }
  if (lower.includes('road') || lower.includes('trip') || lower.includes('drive') || lower.includes('car') || lower.includes('travel') || lower.includes('sea')) {
    return 'There is such a feeling of open horizon in that journey. What was the very first thing you felt on your skin when you arrived at that destination?';
  }
  if (lower.includes('school') || lower.includes('young') || lower.includes('child') || lower.includes('play') || lower.includes('yard')) {
    return 'That season of life seems filled with quiet wonder. When you look back at yourself back then, what sound from that neighborhood comes back first?';
  }
  if (lower.includes('work') || lower.includes('job') || lower.includes('proud') || mood === 'Proud') {
    return 'That feels like such a quiet turning point. Looking back at yourself in that moment, what do you think you needed most?';
  }
  if (mood === 'Loved' || lower.includes('grandmother') || lower.includes('mother') || lower.includes('friend')) {
    return 'The presence of that person clearly left a deep imprint. What expression on their face or tone in their voice do you remember most clearly?';
  }
  return 'That moment carries a very peaceful resonance. When you gently return to that exact scene, what small sensory detail stands out most clearly to you?';
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

Respond in accordance with the Core Directives: 1 to 2 short sentences total, validating the feeling and ending with exactly one gentle, reflective question inviting them to linger longer in sensory details or emotional undercurrents.`;

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
