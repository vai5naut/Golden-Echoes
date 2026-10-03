# Golden Echo

Golden Echo is an emotional wellbeing and reminiscence app for older adults and their families.

I built it around a simple idea: wellbeing as we grow older is not only about physical health. Memory, identity, relationships, and having things to look forward to matter too.

The app helps someone remember a story, preserve it in their own voice, reflect on it, and sometimes turn it into something they want to do in the future.

**Remember → Reflect → Look Forward**

## What you can do

On the home screen, Golden Echo gives one memory prompt at a time, usually based on sensory details:

> What sound instantly brings you back to your childhood?

A person can type the story, dictate it, or record it in their own voice.

They can then:

- save the memory to their personal archive
- choose who they would want to remember it
- ask for an optional AI reflection
- connect the memory to something they want to do in the future
- turn their collection into a printable keepsake

If someone does not want to answer a prompt, they can simply choose **Not today**. The app moves on without streaks, reminders, or pressure.

## Why I built it this way

Golden Echo draws on ideas from reminiscence and narrative approaches to wellbeing, where telling and revisiting personal stories can help people make sense of identity, relationships, and life experiences.

I did not want the product to feel like a medical app or a productivity dashboard. I wanted it to feel closer to a family journal.

One part I cared about especially was connecting memory with the future.

For example, remembering Sunday chai with your mother might lead to:

**I want to make her chai recipe with Anya.**

Golden Echo then asks for one small next step, such as:

**Ask Anya which Sunday she is free.**

This means the product is not only an archive of the past. Memories can become reasons to reconnect, revisit a place, make something again, or spend time with someone.

## AI reflection

AI reflection is optional.

Golden Echo uses Gemini through a server endpoint. I deliberately limited what the model is allowed to do.

It is asked to notice details in the story rather than interpret the person's emotions. It returns one short observation and, where useful, one question.

For example, instead of saying:

> That sounds like a deeply emotional memory.

it might notice:

> You remembered the sound of the pressure cooker and everyone sitting together at the table. Is there one part of that evening you can still picture clearly?

If someone indicates that they do not want to continue, the reflection stops.

## Main sections

### Today

One memory prompt, with the option to tell the story, choose another prompt, or leave it for another day.

There are also a few quieter activities such as ambient sounds, a sensory place exercise, a music memory box, and private letters.

### My Stories

Saved memories are organised into five broad life chapters:

- Roots & Childhood
- Youth & Coming of Age
- Loved Ones & Traditions
- Everyday Joys
- Wisdom & Legacy

Stories can include the original voice recording and can also be read aloud.

### Looking Forward

People can save things they still want to experience, from making an old family recipe to visiting a familiar place or calling an old friend.

An intention can also be linked back to the memory that inspired it.

### Keepsake

Saved stories can be arranged into a simple book-style layout and printed or saved as a PDF.

## Accessibility

Because the app is designed with older adults in mind, I included:

- larger text settings
- high-contrast and low-light themes
- large tap targets
- speech-to-text
- text-to-speech
- adjustable reading speed
- reduced-motion support

## Privacy

Stories, photos, settings, and voice recordings are stored in the browser.

There is no account or login.

Voice recordings are stored as `Blob` files in IndexedDB rather than being placed in `localStorage`.

When someone chooses to use the optional AI reflection, the text required for that reflection is sent to the Gemini API through the server.

Users can export their archive as JSON and import it again later.

## Tech

- React
- TypeScript
- Tailwind CSS
- Express
- IndexedDB
- Web Audio API
- Web Speech API
- Google Gen AI SDK
- Gemini

The AI reflection is handled through:

`POST /api/guide-reflection`

If Gemini is unavailable, the app falls back to a small rule-based reflection system.

## Running locally

Requirements:

- Node.js 18+
- npm 9+
- Gemini API key, if you want live AI reflection

Clone the repository:

```bash
git clone https://github.com/your-username/golden-echo.git
cd golden-echo
