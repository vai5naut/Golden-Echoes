# Golden Echo 🕊️

> **A gentle emotional-wellbeing and reminiscence companion for older adults and families.**  
> *"Remember what shaped you. Make room for what comes next."*

Golden Echo helps people move through a continuous, life-affirming emotional loop:
$$\textbf{REMEMBER} \longrightarrow \textbf{REFLECT} \longrightarrow \textbf{LOOK FORWARD}$$

Rather than measuring vitals or acting like a productivity tool, Golden Echo feels like a warm digital heirloom—an emotionally safe space that an older adult can understand without instructions, and an experience a grandchild and grandparent can use together.

---

## ✨ Core Highlights

* **Today’s Echo**: A sensory-anchored home experience with gentle prompts (*"What sound instantly brings you back to your childhood?"*) rather than interrogation forms.
* **"This One Can Wait" Refusal**: Declining a memory is treated with complete dignity and no guilt—providing peaceful alternatives (*Another memory*, *Visit one of my stories*, *Looking Forward*, or *A quiet moment*).
* **Multi-Modal Voice Keepsakes**: High-fidelity microphone recording and playback stored directly as native `Blob` data in browser-local **IndexedDB**, eliminating `localStorage` quota restrictions.
* **Non-Interpretive AI Reflection**: Powered by **Gemini 3.8 Flash** via `@google/genai`. The model strictly *notices rather than interprets*, acknowledging only explicitly stated details without unsolicited emotional labeling.
* **"Looking Forward" Intentions**: Connects past memories directly to future micro-intentions (*"Make my mother's chai with Anya"*), each broken down into **One Gentle Next Step**.
* **Heirloom Keepsake Edition**: A print/PDF-ready digital book with a formal cover, chapter index, voice keepsake indicators, and elegant typography for physical binding or family sharing.
* **Zero-Pill Typography & Comfort**: Designed with dignified typographic separators, 4 comfort color themes (*Warm Parchment*, *Sepia*, *High Contrast*, *Twilight*), text scaling up to 130%, and native speech-to-text & text-to-speech.
* **Local-First Privacy**: 100% browser-local storage. No accounts, logins, advertising tracking, or data harvesting. Complete JSON archive export and import.

---

## 🧭 The 4 Primary Destinations

The interface avoids cluttered navigation, focusing on four clear destinations:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                 GOLDEN ECHO                                 │
│          Today    ·    My Stories    ·    Looking Forward    ·    Keepsake   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1. Today
* **Today’s Echo**: The primary card featuring an evocative sensory prompt.
* **Gentle Actions**: `Tell this story`, `Give me another memory`, or `Not today`.
* **Quiet Spaces & Sensory Reflection**:
  * **Ambient Soundscapes**: Synthesized hearth fire, summer rain, morning birds, and vinyl warmth generated directly in the browser via the Web Audio API.
  * **Mindful Place Walk**: A 4-step sensory grounding visualization to revisit a personal sanctuary.
  * **Music Memory Box**: Storing evocative songs that reconnect someone to a loved one or era.
  * **Keepsake Letters**: Writing private, heartfelt notes dedicated to family members.

### 2. My Stories
* **5-Chapter Life Taxonomy**:
  * *Chapter I: Roots & Childhood*
  * *Chapter II: Youth & Coming of Age*
  * *Chapter III: Loved Ones & Traditions*
  * *Chapter IV: Everyday Joys*
  * *Chapter V: Wisdom & Legacy*
* **Search & Filter**: Keyword search, decade selector (`1930s`–`Recent`), starred favorites, and sorting.
* **Story Cards**: Prominent voice playback (`Hear this story in my voice`), "Read Aloud" narration, and inline reflection sparks.

### 3. Looking Forward
* **Things I’m Looking Forward To**: Simple, positive aspirations (e.g., visiting a garden, making a family recipe, calling an old friend).
* **One Gentle Next Step**: Lowers cognitive friction by identifying one immediate, doable action.
* **Emotional Lineage**: Shows which memory sparked each intention (e.g., `Born from: "Sunday Bread"`).
* **Time Horizons**: Organized into *This Season*, *This Year*, or *Someday*.

### 4. Keepsake
* **Heirloom Edition**: Formats all preserved stories and future hopes into an editorial book layout.
* **Print / PDF Layout**: Strips away digital chrome for clean, margins-aware printing or digital PDF archival.
* **Voice Indicators**: Marks stories preserved in original spoken audio.

---

## 🔄 The Guided Story Journey

In the **Memory Composer**, users are gently guided through four interconnected steps:

1. **Remember**: Speak, dictate via speech-to-text, or type a sensory recollection.
2. **Preserve**: Choose who should remember this story (*Just me*, *My children*, *My grandchildren*, *Someone special*).
3. **Reflect**: Optionally click *"Linger with this memory"*. The AI notices sensory details and returns one observation and at most one gentle question.
4. **Look Forward**: Optionally carry a piece of the memory forward into a concrete hope with one gentle next step.

---

## 🛠️ Architecture & Tech Stack

```
Golden Echo Application
├── Client (Browser SPA)
│   ├── React 19 / TypeScript
│   ├── Tailwind CSS (Zero-pill typographic design)
│   ├── Lucide Icons
│   ├── IndexedDB Engine (voice recording Blobs in golden_echo_audio_db)
│   ├── Web Audio API (ambient soundscape generators)
│   └── Web Speech API (speech recognition & text-to-speech)
│
└── Backend Server (server.ts)
    ├── Express.js + Vite middleware
    └── POST /api/guide-reflection
        ├── Google Gen AI SDK (@google/genai)
        ├── Gemini 3.8 Flash model
        └── Deterministic heuristic fallback engine (offline-ready)
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: `v18.0.0` or higher
* **npm**: `v9.0.0` or higher
* **Gemini API Key**: (Optional, for live AI reflections; deterministic offline heuristics run automatically if omitted)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/golden-echo.git
   cd golden-echo
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   Add your Gemini API key inside `.env`:
   ```env
   GEMINI_API_KEY="your-gemini-api-key-here"
   PORT=3000
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

### Production Build

```bash
# Build the client bundle
npm run build

# Start the full-stack production server
npm start
```

---

## 🔒 Privacy, Safety & Ethical Guidelines

* **Zero Health/Medical Claims**: Golden Echo is an emotional-wellbeing and reminiscence companion designed with older adults and families in mind. It does **not** claim to diagnose, treat, prevent, or cure dementia, cognitive decline, depression, loneliness, or any clinical condition.
* **Local-First Data Ownership**: All memories, photos, and voice recordings remain entirely in the user's browser storage. No accounts or logins required.
* **Respectful AI Behavior**: The reflection prompt is engineered strictly to *notice rather than interpret*. It never tells users how they ought to feel and withdraws safely if a user indicates reluctance or discomfort (*"This one can wait"*).

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for details.
