import { MemoryEntry, VisionItem, MemoryPrompt, ComfortSettings, VisionCategory } from '../types';
import HERO_JOURNAL_IMAGE from '../assets/images/hero_keepsake_journal_1790947561735.jpg';
import COASTAL_WALK_IMAGE from '../assets/images/vision_coastal_walk_1790947575847.jpg';
import COTTAGE_GARDEN_IMAGE from '../assets/images/vision_cottage_garden_1790947586269.jpg';
import FAMILY_TABLE_IMAGE from '../assets/images/vision_family_table_1790947597913.jpg';
import COZY_MORNING_IMAGE from '../assets/images/vision_cozy_morning_1790948745200.jpg';
import ART_STUDIO_IMAGE from '../assets/images/vision_art_studio_1790948760388.jpg';
import MOUNTAIN_LAKE_IMAGE from '../assets/images/vision_mountain_lake_1790948776779.jpg';
import FIRESIDE_HEARTH_IMAGE from '../assets/images/vision_fireside_hearth_1790948788989.jpg';

export {
  HERO_JOURNAL_IMAGE,
  COASTAL_WALK_IMAGE,
  COTTAGE_GARDEN_IMAGE,
  FAMILY_TABLE_IMAGE,
  COZY_MORNING_IMAGE,
  ART_STUDIO_IMAGE,
  MOUNTAIN_LAKE_IMAGE,
  FIRESIDE_HEARTH_IMAGE,
};

export interface CuratedVisionImage {
  id: string;
  title: string;
  category: VisionCategory;
  description: string;
  url: string;
}

export const CURATED_VISION_IMAGES: CuratedVisionImage[] = [
  {
    id: 'img-coastal',
    title: 'Coastal Morning Seashore',
    category: 'Nature & Travel',
    description: 'A serene wooden boardwalk winding past coastal dunes toward gentle morning waves.',
    url: COASTAL_WALK_IMAGE,
  },
  {
    id: 'img-mountain-lake',
    title: 'Tranquil Mountain Lake',
    category: 'Nature & Travel',
    description: 'Mirror-still turquoise alpine waters with a quiet wooden dock and misty pine shores.',
    url: MOUNTAIN_LAKE_IMAGE,
  },
  {
    id: 'img-family-table',
    title: 'Warm Table Gathering',
    category: 'Loved Ones',
    description: 'An inviting outdoor banquet table set under lanterns for laughing and sharing memories.',
    url: FAMILY_TABLE_IMAGE,
  },
  {
    id: 'img-fireside',
    title: 'Fireside Hearth & Armchair',
    category: 'Loved Ones',
    description: 'A warm stone fireplace with glowing embers, soft wool blanket, and cozy reading lamp.',
    url: FIRESIDE_HEARTH_IMAGE,
  },
  {
    id: 'img-cottage-garden',
    title: 'Cottage Rose & Herb Garden',
    category: 'Creativity',
    description: 'Sunlit lavender bushes, heirloom climbing roses, and a peaceful garden reading bench.',
    url: COTTAGE_GARDEN_IMAGE,
  },
  {
    id: 'img-art-studio',
    title: 'Botanical Watercolor Studio',
    category: 'Creativity',
    description: 'Daylit wooden easel, natural watercolor brushes, dried herbs, and botanical studies.',
    url: ART_STUDIO_IMAGE,
  },
  {
    id: 'img-cozy-morning',
    title: 'Quiet Morning Tea & Book',
    category: 'Simple Joys',
    description: 'Warm morning light streaming through sheer curtains onto a ceramic teacup and open book.',
    url: COZY_MORNING_IMAGE,
  },
  {
    id: 'img-hero-journal',
    title: 'Heirloom Writing Desk',
    category: 'Legacy',
    description: 'Archival linen-bound journal, brass fountain pen, and pressed wildflowers on warm oak.',
    url: HERO_JOURNAL_IMAGE,
  },
];

export const DEFAULT_SETTINGS: ComfortSettings = {
  fontScale: 1.0,
  colorTheme: 'warm-parchment',
  reducedMotion: false,
  readingSpeed: 0.92,
};

// Clean initial collections with default items removed as requested
export const INITIAL_MEMORIES: MemoryEntry[] = [];
export const INITIAL_VISIONS: VisionItem[] = [];

export const MEMORY_PROMPTS: MemoryPrompt[] = [
  {
    id: 'p-1',
    text: 'Think of a meal that brings back a warm memory. Who was there with you and what aromas filled the room?',
    era: 'roots',
    eraLabel: 'Roots & Childhood',
    followUp: 'Was there a special dish that only appeared on holidays, or a simple soup that warmed a rainy day?'
  },
  {
    id: 'p-2',
    text: 'What was a journey you still remember clearly? What made it unforgettable?',
    era: 'youth',
    eraLabel: 'Youth & Coming of Age',
    followUp: 'Was it the destination, the travelling companion, or the unexpected detour along the way?'
  },
  {
    id: 'p-3',
    text: 'Who taught you something that stayed with you throughout your whole life?',
    era: 'roots',
    eraLabel: 'Roots & Childhood',
    followUp: 'Did they teach you with words, or simply by the quiet way they lived their daily life?'
  },
  {
    id: 'p-4',
    text: 'What did your childhood neighborhood sound and smell like on an early summer morning?',
    era: 'roots',
    eraLabel: 'Roots & Childhood',
    followUp: 'Think of milk bottles clinking, screen doors snapping shut, or fresh-cut lawn grass.'
  },
  {
    id: 'p-5',
    text: 'Remember a celebration or gathering that made you feel completely surrounded by people you loved.',
    era: 'family',
    eraLabel: 'Family & Traditions',
    followUp: 'Who was laughing the loudest? What songs were playing or stories being told?'
  },
  {
    id: 'p-6',
    text: 'What was your very first paid job, and what did you buy with your first pay packet?',
    era: 'youth',
    eraLabel: 'Youth & Coming of Age',
    followUp: 'How did that first taste of independence make you feel?'
  },
  {
    id: 'p-7',
    text: 'Which keepsake or heirloom in your home carries a story you would like someone else to cherish?',
    era: 'family',
    eraLabel: 'Family & Traditions',
    followUp: 'Where did it come from, and whose hands held it before yours?'
  },
  {
    id: 'p-8',
    text: 'What was a season of hardship or uncertainty you walked through, and what carried you to the other side?',
    era: 'wisdom',
    eraLabel: 'Life Wisdom & Legacy',
    followUp: 'What did that experience show you about your own quiet resilience?'
  },
  {
    id: 'p-9',
    text: 'Think of a loyal pet or animal companion that brought genuine joy to your life.',
    era: 'everyday',
    eraLabel: 'Everyday Joys & Habits',
    followUp: 'What funny or endearing habit did they have that always made you smile?'
  },
  {
    id: 'p-10',
    text: 'If you could whisper one gentle piece of advice to your twenty-year-old self, what would it be?',
    era: 'wisdom',
    eraLabel: 'Life Wisdom & Legacy',
    followUp: 'Would it be about worry, love, patience, or taking more chances?'
  },
  {
    id: 'p-11',
    text: 'Describe an ordinary afternoon from decades ago that now feels like pure gold.',
    era: 'everyday',
    eraLabel: 'Everyday Joys & Habits',
    followUp: 'What were you doing? Was there afternoon tea, rain on the roof, or gentle music?'
  },
  {
    id: 'p-12',
    text: 'What was a tradition your family held that you hope will continue for generations to come?',
    era: 'family',
    eraLabel: 'Family & Traditions',
    followUp: 'How did it begin, and what made everyone look forward to it?'
  }
];

export const REFLECTION_QUESTIONS = [
  'What is one small thing you could do this week that would bring one of your hopes a little closer?',
  'Looking back at your life, what is something that once seemed like a disaster, but turned out to be a quiet blessing?',
  'Which person from your past would you most like to thank if you had five minutes together today?',
  'What simple sensory pleasure made you smile most in the last twenty-four hours?',
  'What is a quality in yourself that you have come to appreciate more as the years have passed?'
];
