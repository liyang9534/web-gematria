import { calculateGematria } from "@/lib/gematria";
import { getNumerologyMeaning, reduceNumerologyNumber } from "@/lib/numerology";
import type {
  AngelNumber,
  AngelNumberPattern,
  AngelNumberPatternKind,
  GeneratedAngelNumberReading,
} from "@/types/angel-number";

const MAX_INTERPRETABLE_DIGITS = 12;

const SPECIAL_NUMBERS: Record<string, string> = {
  "7": "Sacred wisdom and spiritual completion",
  "12": "Order, cycles and divine structure",
  "40": "Testing, preparation and transformation",
  "108": "Sacred wholeness and devotional practice",
  "144": "Protection, chosen focus and spiritual structure",
  "666": "Realignment, care and material balance",
  "1212": "Alignment, mirrored growth and fresh spiritual order",
};

const ROOT_THEMES: Record<number, { short: string; verb: string; caution: string }> = {
  1: {
    short: "new beginnings, self-trust and intentional action",
    verb: "begin with clarity",
    caution: "avoid forcing the outcome before the first step has taught you something",
  },
  2: {
    short: "balance, partnership and emotional timing",
    verb: "restore balance",
    caution: "avoid mistaking patience for passivity",
  },
  3: {
    short: "expression, creativity and honest communication",
    verb: "say the true thing",
    caution: "avoid scattering your energy across too many signals",
  },
  4: {
    short: "foundation, protection and steady work",
    verb: "strengthen the structure",
    caution: "avoid confusing rigidity with safety",
  },
  5: {
    short: "change, freedom and adaptive movement",
    verb: "move with the change",
    caution: "avoid changing everything just because one thing feels restless",
  },
  6: {
    short: "care, responsibility and material harmony",
    verb: "return to care",
    caution: "avoid carrying what is not yours to carry",
  },
  7: {
    short: "insight, study and spiritual depth",
    verb: "listen inwardly",
    caution: "avoid isolating so much that guidance cannot become action",
  },
  8: {
    short: "abundance, power and wise stewardship",
    verb: "receive and steward value",
    caution: "avoid measuring your worth only through results",
  },
  9: {
    short: "completion, compassion and higher purpose",
    verb: "release what is complete",
    caution: "avoid reopening a finished lesson just because it feels familiar",
  },
  11: {
    short: "intuition, sensitivity and visionary awareness",
    verb: "trust the quiet signal",
    caution: "avoid treating every feeling as an instruction",
  },
  22: {
    short: "master building, practical vision and long-range structure",
    verb: "build the vision carefully",
    caution: "avoid skipping the boring systems that make the vision real",
  },
  33: {
    short: "compassion, teaching and healing service",
    verb: "serve without self-erasure",
    caution: "avoid giving past the point of truth",
  },
  44: {
    short: "disciplined power, protection and durable leadership",
    verb: "anchor the work",
    caution: "avoid turning discipline into self-punishment",
  },
};

export function interpretAnyNumber(input: string): GeneratedAngelNumberReading {
  const number = normalizeInterpretableNumber(input);
  const digits = number.split("").map(Number);
  const digitSum = digits.reduce((sum, digit) => sum + digit, 0);
  const rootNumber = reduceNumerologyNumber(digitSum);
  const pattern = classifyAngelNumberPattern(number);
  const theme = ROOT_THEMES[rootNumber] ?? ROOT_THEMES[reduceNumerologyNumber(rootNumber)];
  const gematria = calculateGematria(number);
  const relatedNumbers = buildRelatedNumbers(number, rootNumber);
  const shortMeaning = `${pattern.label} of ${theme.short}`;

  return {
    number,
    slug: number,
    title: `Angel Number ${number} Meaning`,
    shortMeaning,
    summary: `Angel number ${number} combines ${pattern.description.toLowerCase()} with the root influence of ${rootNumber}. Its message is to ${theme.verb}: notice where this number appears, what question you were holding when it arrived, and what steady action would make its guidance practical.`,
    meanings: {
      love: `In love, ${number} asks you to ${theme.verb} while noticing the ${pattern.label.toLowerCase()} pattern behind the connection. It points to emotional honesty, clearer timing, and a relationship dynamic that needs conscious attention instead of automatic reaction.`,
      career: `For career, ${number} highlights ${theme.short}. Use this number as a prompt to review your current direction, simplify the next decision, and choose one visible action that turns symbolic guidance into practical progress.`,
      money: `For money, ${number} encourages a grounded relationship with resources. Its root number ${rootNumber} asks for choices that support ${theme.short}, while the pattern warns you to ${theme.caution}.`,
      spiritual: `Spiritually, ${number} is a personal signal rather than a generic omen. The ${pattern.label.toLowerCase()} shape amplifies attention, and root ${rootNumber} adds ${getNumerologyMeaning(rootNumber).toLowerCase()}`,
      health: `For health, ${number} points toward one repeatable stabilizing practice. Start with the body, reduce noise, and choose a habit that lets the message become embodied instead of staying abstract.`,
      twinFlame: `For twin flames, ${number} asks both people to integrate the lesson represented by root ${rootNumber}. The sign is most useful when it creates maturity, boundaries and clarity rather than fixation on the sign itself.`,
    },
    gematriaValues: {
      hebrew: gematria.values.hebrewStandard || digitSum,
      english: gematria.values.englishGematria || digitSum * 6,
      simple: Number.parseInt(number, 10),
      jewish: gematria.values.jewish || digitSum * 3,
      reduction: rootNumber,
    },
    numerology: {
      rootNumber,
      rootMeaning: getNumerologyMeaning(rootNumber),
      calculation: `${digits.join("+")} = ${digitSum}${digitSum === rootNumber ? "" : ` -> ${String(digitSum).split("").join("+")} = ${rootNumber}`}`,
    },
    biblicalReferences: [
      {
        verse: "Symbolic note",
        text: `${number} is interpreted here through numerology, pattern recognition and reflective angel number symbolism.`,
        relevance: "Generated readings are designed for personal reflection and are not presented as a fixed doctrinal claim.",
      },
    ],
    affirmation: `I receive the message of ${number} and turn it into one grounded, truthful action.`,
    relatedNumbers,
    faqs: [
      {
        question: `What does angel number ${number} mean?`,
        answer: `Angel number ${number} means ${theme.short}, shaped by ${pattern.label.toLowerCase()}. Its practical message is to ${theme.verb}.`,
      },
      {
        question: `Why do I keep seeing ${number}?`,
        answer: `You may keep seeing ${number} when your attention is being drawn to a repeated life pattern, a decision point, or a lesson connected to root number ${rootNumber}.`,
      },
      {
        question: `What should I do after seeing ${number}?`,
        answer: `Pause, write down where the number appeared, then choose one grounded action connected to ${theme.short}.`,
      },
    ],
    meta: {
      title: `Angel Number ${number} Meaning - Instant Numerology Reading`,
      description: `Decode angel number ${number} with an instant numerology reading. Explore its pattern, root number, love, career, money and spiritual meaning.`,
      keywords: [
        `angel number ${number}`,
        `${number} meaning`,
        `what does ${number} mean`,
      ],
    },
    category: mapPatternToCategory(pattern.kind),
    isPriority: false,
    lastUpdated: "2026-05-04",
    source: "generated",
    pattern,
    seo: {
      shouldIndex: false,
      reason: "Generated arbitrary-number readings are noindex by default to protect SEO quality.",
    },
  };
}

export function classifyAngelNumberPattern(number: string): AngelNumberPattern {
  if (number.length === 1) {
    return {
      kind: "single",
      label: "Single-digit signal",
      description: "A pure root-number signal with minimal symbolic noise",
    };
  }

  if (SPECIAL_NUMBERS[number]) {
    return {
      kind: "special",
      label: "Special number",
      description: SPECIAL_NUMBERS[number],
    };
  }

  if (new Set(number).size === 1) {
    return {
      kind: "repeat",
      label: "Repeating-number signal",
      description: "A repeating pattern that amplifies one digit until its message becomes hard to ignore",
    };
  }

  if (number === [...number].reverse().join("")) {
    return {
      kind: "mirror",
      label: "Mirror-number signal",
      description: "A mirrored pattern that points to reflection, reciprocity and inner-outer alignment",
    };
  }

  if (isSequential(number)) {
    return {
      kind: "sequence",
      label: "Sequence-number signal",
      description: "A sequence pattern that suggests movement, progression and ordered change",
    };
  }

  return {
    kind: "general",
    label: "Composite-number signal",
    description: "A composite pattern that blends several digits into a personalized symbolic message",
  };
}

export function normalizeInterpretableNumber(input: string): string {
  const number = input.replace(/\D/g, "");

  if (!number || number.length > MAX_INTERPRETABLE_DIGITS) {
    throw new Error("Angel number must contain 1 to 12 digits.");
  }

  return number;
}

function buildRelatedNumbers(number: string, rootNumber: number): string[] {
  const related = new Set<string>();

  if (number.length > 1) {
    related.add(number.slice(0, -1));
    related.add(number.slice(1));
  }

  related.add(String(rootNumber));
  related.add(number[0]);
  related.add(number[number.length - 1]);

  if (number.length < 12) {
    related.add(`${number}${number[number.length - 1]}`);
  }

  return [...related].filter((item) => item && item !== number).slice(0, 6);
}

function isSequential(number: string): boolean {
  if (number.length < 3) {
    return false;
  }

  const digits = number.split("").map(Number);
  const ascending = digits.every((digit, index) => {
    if (index === 0) return true;
    return digit === (digits[index - 1] + 1) % 10;
  });
  const descending = digits.every((digit, index) => {
    if (index === 0) return true;
    return digit === (digits[index - 1] + 9) % 10;
  });

  return ascending || descending;
}

function mapPatternToCategory(kind: AngelNumberPatternKind): AngelNumber["category"] {
  switch (kind) {
    case "single":
      return "single";
    case "repeat":
      return "special";
    case "mirror":
      return "mirror";
    case "sequence":
      return "sequence";
    case "special":
      return "special";
    default:
      return "special";
  }
}
