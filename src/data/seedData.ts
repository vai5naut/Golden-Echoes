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
    id: 'p-sensory-1',
    text: 'What sound instantly brings you back to your childhood?',
    era: 'roots',
    eraLabel: 'Roots & Childhood',
    sensoryCue: 'Think of morning milk bottles, the radio playing in the kitchen, birds outside the screen door, or rain on the roof.',
    followUp: 'What did that sound feel like to wake up to or fall asleep with?'
  },
  {
    id: 'p-sensory-2',
    text: 'What smell reminds you immediately of home?',
    era: 'roots',
    eraLabel: 'Roots & Childhood',
    sensoryCue: 'Woodsmoke, toasted bread, cardamom, clean linen, damp garden soil, or fresh floor wax.',
    followUp: 'Who was usually nearby when that smell filled the rooms?'
  },
  {
    id: 'p-sensory-3',
    text: 'Was there a place you went when you wanted some peace?',
    era: 'youth',
    eraLabel: 'Youth & Coming of Age',
    sensoryCue: 'A secret garden bench, the library corner, an attic window, or a bend in the river.',
    followUp: 'What could you see and hear when you sat there alone?'
  },
  {
    id: 'p-sensory-4',
    text: 'What song takes you back to a particular person?',
    era: 'youth',
    eraLabel: 'Youth & Coming of Age',
    sensoryCue: 'A melody playing on a car radio, someone humming while peeling apples, or a dance hall tune.',
    followUp: 'What were you wearing or doing the first time you heard it together?'
  },
  {
    id: 'p-sensory-5',
    text: 'What could you hear outside your childhood home in the morning?',
    era: 'roots',
    eraLabel: 'Roots & Childhood',
    sensoryCue: 'Early morning birds, a neighbor sweeping the porch, distant train whistles, or rattling teacups.',
    followUp: 'Did the world outside feel quiet, bustling, or full of possibilities?'
  },
  {
    id: 'p-sensory-6',
    text: 'What meal made an ordinary day feel special?',
    era: 'everyday',
    eraLabel: 'Everyday Joys & Habits',
    sensoryCue: 'Hot fresh rotis or bread with butter, a simmering pot of soup, or sweet tea poured into glass tumblers.',
    followUp: 'Whose hands prepared it, and what did the kitchen feel like?'
  },
  {
    id: 'p-sensory-7',
    text: 'Was there something someone used to say that you still remember?',
    era: 'wisdom',
    eraLabel: 'Life Wisdom & Legacy',
    sensoryCue: 'A quiet phrase of comfort, a witty proverb, or a daily goodbye at the door.',
    followUp: 'What tone of voice did they use when they spoke those words?'
  },
  {
    id: 'p-sensory-8',
    text: 'What did celebrations feel like in your home?',
    era: 'family',
    eraLabel: 'Family & Traditions',
    sensoryCue: 'Lanterns, rustling festival clothes, laughter echoing across long dining tables, and warm sweet treats.',
    followUp: 'Who was laughing the loudest, and what traditions were kept?'
  },
  {
    id: 'p-sensory-9',
    text: 'Describe an ordinary afternoon from decades ago that now feels like pure gold.',
    era: 'everyday',
    eraLabel: 'Everyday Joys & Habits',
    sensoryCue: 'Sitting on the veranda watching the clouds, mending socks, listening to classical records, or walking slowly.',
    followUp: 'What made that ordinary hour stay with you across a lifetime?'
  },
  {
    id: 'p-sensory-10',
    text: 'What was a journey you still remember clearly? What was the first thing you felt when you arrived?',
    era: 'youth',
    eraLabel: 'Youth & Coming of Age',
    sensoryCue: 'The smell of salt sea spray, cold mountain pine air, or the clatter of a railway platform.',
    followUp: 'Who was beside you, and what did you laugh about along the way?'
  }
];

export const REFLECTION_QUESTIONS = [
  'What is one small thing you could do this week that would bring one of your hopes a little closer?',
  'Looking back at your life, what is something that once seemed like a disaster, but turned out to be a quiet blessing?',
  'Which person from your past would you most like to thank if you had five minutes together today?',
  'What simple sensory pleasure made you smile most in the last twenty-four hours?',
  'What is a quality in yourself that you have come to appreciate more as the years have passed?'
];
