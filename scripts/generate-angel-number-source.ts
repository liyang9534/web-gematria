import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type {
  AngelNumber,
  AngelNumberCategory,
  AngelNumberMeaningSet,
} from "../types/angel-number";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const sourceDir = path.join(rootDir, "data", "angel-numbers", "source", "en");

const EXISTING_AUTHORIAL_SLUGS = new Set([
  "111",
  "222",
  "333",
  "444",
  "555",
  "666",
  "777",
  "888",
  "999",
]);

const PRIORITY_SLUGS = new Set([
  "11",
  "22",
  "33",
  "44",
  "55",
  "66",
  "77",
  "88",
  "99",
  "111",
  "222",
  "333",
  "444",
  "555",
  "666",
  "777",
  "888",
  "999",
  "1111",
  "1212",
]);

const MIRROR_NUMBERS = [
  "101",
  "202",
  "303",
  "404",
  "505",
  "606",
  "707",
  "808",
  "909",
  "1001",
  "1221",
  "1331",
  "1441",
  "1551",
  "2002",
  "2112",
  "2332",
  "2442",
  "3003",
  "3113",
];

const SEQUENCE_NUMBERS = [
  "123",
  "234",
  "345",
  "456",
  "567",
  "678",
  "789",
  "1234",
  "2345",
  "3456",
];

const SPECIAL_NUMBERS = [
  "12",
  "24",
  "40",
  "50",
  "70",
  "72",
  "108",
  "120",
  "144",
  "153",
  "318",
  "365",
  "390",
  "490",
  "613",
  "616",
  "1000",
  "1212",
  "1260",
  "144000",
];

const ROOT_THEMES: Record<
  number,
  {
    noun: string;
    action: string;
    shadow: string;
    love: string;
    career: string;
    money: string;
    spiritual: string;
    health: string;
    twinFlame: string;
  }
> = {
  0: {
    noun: "potential, stillness and the open field before a new cycle",
    action: "pause long enough to hear what wants to begin",
    shadow: "treating emptiness as failure instead of fertile space",
    love: "space, renewal and the possibility of a cleaner pattern",
    career: "a reset point before direction becomes visible",
    money: "clearing noise before choosing the next commitment",
    spiritual: "the void, source awareness and receptive trust",
    health: "rest, breath and the permission to begin again gently",
    twinFlame: "the space between cycles where both people return to themselves",
  },
  1: {
    noun: "initiative, self-trust and fresh intention",
    action: "begin with one honest step",
    shadow: "forcing certainty before the first signal has time to mature",
    love: "clear desire and direct communication",
    career: "visible initiative and a cleaner direction",
    money: "a specific goal that guides daily choices",
    spiritual: "awakening, attention and conscious creation",
    health: "a simple reset practiced consistently",
    twinFlame: "self-recognition before projection",
  },
  2: {
    noun: "balance, partnership and emotional timing",
    action: "restore balance before making the next move",
    shadow: "mistaking waiting for wisdom",
    love: "patience, listening and mutual care",
    career: "collaboration and tactful timing",
    money: "steady planning instead of reactive spending",
    spiritual: "trust, receptivity and inner alignment",
    health: "rhythms that calm the nervous system",
    twinFlame: "maturity in the space between closeness and distance",
  },
  3: {
    noun: "expression, creativity and truthful communication",
    action: "say the true thing in a useful way",
    shadow: "scattering energy across too many signals",
    love: "warm honesty and playful repair",
    career: "creative presentation and clearer messaging",
    money: "turning talent into practical value",
    spiritual: "joy, voice and inspired connection",
    health: "movement, breath and emotional release",
    twinFlame: "growth through dialogue rather than silence",
  },
  4: {
    noun: "foundation, protection and disciplined progress",
    action: "strengthen the structure that supports you",
    shadow: "turning safety into rigidity",
    love: "trust built through consistent behavior",
    career: "systems, craft and reliable execution",
    money: "budgets, reserves and long-range stability",
    spiritual: "grounded guidance that becomes daily practice",
    health: "sleep, posture, nutrition and follow-through",
    twinFlame: "a bond tested by boundaries and steadiness",
  },
  5: {
    noun: "change, freedom and adaptive movement",
    action: "move with change without abandoning your center",
    shadow: "changing everything because one thing feels restless",
    love: "space, honesty and a livelier pattern",
    career: "experimentation, travel or a flexible pivot",
    money: "adaptable income choices and impulse control",
    spiritual: "liberation from stale assumptions",
    health: "variety that still respects the body",
    twinFlame: "a turning point that asks for freedom and truth",
  },
  6: {
    noun: "care, responsibility and material harmony",
    action: "return to what genuinely needs care",
    shadow: "carrying obligations that are not yours",
    love: "repair, devotion and healthy responsibility",
    career: "service, quality and relational leadership",
    money: "household harmony and values-based spending",
    spiritual: "compassion with clear limits",
    health: "nourishment, rest and sustainable routines",
    twinFlame: "care that does not erase either person",
  },
  7: {
    noun: "insight, study and spiritual depth",
    action: "listen inwardly, then test the insight in life",
    shadow: "isolating until guidance cannot become action",
    love: "quiet truth and deeper emotional discernment",
    career: "research, strategy and specialized mastery",
    money: "patient evaluation before commitment",
    spiritual: "wisdom, prayer, study and subtle signs",
    health: "stillness, recovery and attention to signals",
    twinFlame: "inner work that matters more than chasing proof",
  },
  8: {
    noun: "abundance, power and wise stewardship",
    action: "receive value and steward it responsibly",
    shadow: "measuring worth only through results",
    love: "balanced exchange and mature commitment",
    career: "leadership, negotiation and material outcomes",
    money: "wealth building, repayment and wise authority",
    spiritual: "power used with humility",
    health: "strength, endurance and sustainable ambition",
    twinFlame: "karmic balance and equal energetic exchange",
  },
  9: {
    noun: "completion, compassion and higher purpose",
    action: "release what is complete with dignity",
    shadow: "reopening a finished lesson because it feels familiar",
    love: "forgiveness, closure and larger-hearted truth",
    career: "finishing cycles and serving a wider purpose",
    money: "generosity balanced with endings and cleanup",
    spiritual: "integration, compassion and sacred completion",
    health: "letting the body finish a stress cycle",
    twinFlame: "closure or integration without clinging",
  },
  11: {
    noun: "intuition, sensitivity and visionary awareness",
    action: "trust the quiet signal while staying grounded",
    shadow: "treating every feeling as an instruction",
    love: "intuitive honesty and emotional sensitivity",
    career: "visionary work that needs practical anchors",
    money: "listening to instinct while checking facts",
    spiritual: "heightened intuition and symbolic awareness",
    health: "gentle routines that lower overstimulation",
    twinFlame: "recognition that must mature into real choice",
  },
  22: {
    noun: "master building, practical vision and long-range structure",
    action: "build the vision carefully",
    shadow: "skipping the ordinary systems that make the vision real",
    love: "a serious foundation for shared plans",
    career: "large projects, systems and durable leadership",
    money: "patient wealth architecture and responsible risk",
    spiritual: "turning spiritual vision into useful form",
    health: "structures that hold up during busy seasons",
    twinFlame: "building something real rather than living on intensity",
  },
  33: {
    noun: "compassion, teaching and healing service",
    action: "serve without self-erasure",
    shadow: "giving past the point of truth",
    love: "healing communication and generous presence",
    career: "mentorship, care work and creative service",
    money: "resources used to support meaningful care",
    spiritual: "devotion, healing and wise compassion",
    health: "restoring energy after emotional labor",
    twinFlame: "compassion that still honors boundaries",
  },
  44: {
    noun: "disciplined power, protection and durable leadership",
    action: "anchor the work in disciplined care",
    shadow: "turning discipline into self-punishment",
    love: "strong boundaries and dependable commitment",
    career: "executive focus and long-range construction",
    money: "protected assets, reserves and practical authority",
    spiritual: "guarded guidance and grounded protection",
    health: "durable routines that protect energy",
    twinFlame: "stable leadership from both people",
  },
};

const SPECIAL_THEMES: Record<string, { label: string; note: string; verse: string }> = {
  "12": {
    label: "sacred order and complete cycles",
    note: "often associated with tribes, apostles, months and structured wholeness",
    verse: "Revelation 21:12",
  },
  "24": {
    label: "devotional service and ordered worship",
    note: "linked with priestly divisions and a rhythm of service",
    verse: "1 Chronicles 24:4",
  },
  "40": {
    label: "testing, preparation and transformation",
    note: "frequently appears around wilderness, fasting and preparation periods",
    verse: "Matthew 4:2",
  },
  "50": {
    label: "release, renewal and jubilee",
    note: "evokes restoration, freedom and a reset of burdens",
    verse: "Leviticus 25:10",
  },
  "70": {
    label: "restoration, nations and fulfilled counsel",
    note: "often marks appointed elders, years and wider community order",
    verse: "Numbers 11:16",
  },
  "72": {
    label: "messenger work and expanded mission",
    note: "points to a message carried beyond the private self",
    verse: "Luke 10:1",
  },
  "108": {
    label: "sacred wholeness and devotional practice",
    note: "used across contemplative traditions as a count of prayerful repetition",
    verse: "Psalm 108:1",
  },
  "120": {
    label: "appointed completion and gathered readiness",
    note: "suggests a threshold where preparation becomes collective movement",
    verse: "Acts 1:15",
  },
  "144": {
    label: "protection, chosen focus and spiritual structure",
    note: "combines twelve-fold order with completion and protection",
    verse: "Revelation 7:4",
  },
  "153": {
    label: "abundance, recognition and gathered blessing",
    note: "the number of fish in a resurrection sign of provision",
    verse: "John 21:11",
  },
  "318": {
    label: "rescue, covenant and decisive action",
    note: "associated with Abram's household force in a rescue story",
    verse: "Genesis 14:14",
  },
  "365": {
    label: "daily devotion and whole-year practice",
    note: "a reminder that guidance becomes real through everyday repetition",
    verse: "Deuteronomy 31:8",
  },
  "390": {
    label: "accountability, endurance and prophetic weight",
    note: "appears in a prophetic sign of carried consequence",
    verse: "Ezekiel 4:5",
  },
  "490": {
    label: "forgiveness beyond ordinary counting",
    note: "draws from the seventy-times-seven teaching about mercy",
    verse: "Matthew 18:22",
  },
  "613": {
    label: "commandments, discipline and sacred practice",
    note: "traditionally associated with the count of Torah commandments",
    verse: "Deuteronomy 6:4",
  },
  "616": {
    label: "discernment, correction and material caution",
    note: "a textual variant that invites careful discernment rather than fear",
    verse: "Revelation 13:18",
  },
  "1000": {
    label: "fullness, abundance and divine scale",
    note: "often signals a magnitude beyond ordinary counting",
    verse: "Psalm 50:10",
  },
  "1212": {
    label: "alignment, mirrored order and fresh spiritual structure",
    note: "blends twelve-fold order with a mirrored call to realign",
    verse: "Romans 12:12",
  },
  "1260": {
    label: "endurance, appointed time and protected witness",
    note: "appears in apocalyptic timing as a symbol of perseverance",
    verse: "Revelation 12:6",
  },
  "144000": {
    label: "sealed protection, devotion and vast spiritual belonging",
    note: "a highly symbolic image of guarded devotion and collective identity",
    verse: "Revelation 14:1",
  },
};

function reduceNumerologyNumber(value: number): number {
  if ([11, 22, 33, 44].includes(value)) {
    return value;
  }

  let current = value;
  while (current > 9 && ![11, 22, 33, 44].includes(current)) {
    current = String(current)
      .split("")
      .reduce((sum, digit) => sum + Number(digit), 0);
  }
  return current;
}

function digitSum(number: string) {
  return number.split("").reduce((sum, digit) => sum + Number(digit), 0);
}

function categoryFor(number: string): AngelNumberCategory {
  if (number.length === 1) {
    return "single";
  }
  if (SPECIAL_NUMBERS.includes(number)) {
    return "special";
  }
  if (new Set(number).size === 1) {
    return number.length === 2 ? "double" : number.length === 3 ? "triple" : "quad";
  }
  if (MIRROR_NUMBERS.includes(number)) {
    return "mirror";
  }
  if (SEQUENCE_NUMBERS.includes(number)) {
    return "sequence";
  }
  return "special";
}

function categoryPhrase(category: AngelNumberCategory, number: string) {
  switch (category) {
    case "single":
      return "single-digit root signal";
    case "double":
      return "two-digit repeating signal";
    case "triple":
      return "classic triple angel number";
    case "quad":
      return "four-digit amplified repeating signal";
    case "mirror":
      return "mirror number for reflection and alignment";
    case "sequence":
      return "sequence number for movement and progression";
    case "special":
      return SPECIAL_THEMES[number]?.label ?? "symbolic biblical and numerology signal";
  }
}

function titleCase(value: string) {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getTheme(number: string) {
  const rootNumber = reduceNumerologyNumber(digitSum(number));
  return {
    rootNumber,
    theme: ROOT_THEMES[rootNumber] ?? ROOT_THEMES[reduceNumerologyNumber(rootNumber)],
  };
}

function buildCalculation(number: string, rootNumber: number) {
  const sum = digitSum(number);
  const first = number.split("").join("+");
  if (sum === rootNumber) {
    return `${first} = ${rootNumber}`;
  }
  const second = String(sum).split("").join("+");
  return `${first} = ${sum} -> ${second} = ${rootNumber}`;
}

function buildMeanings(
  number: string,
  category: AngelNumberCategory,
  rootNumber: number,
  theme: (typeof ROOT_THEMES)[number],
): AngelNumberMeaningSet {
  const phrase = categoryPhrase(category, number);
  const specialNote = SPECIAL_THEMES[number]?.note;

  return {
    love: `In love, angel number ${number} highlights ${theme.love}. The ${phrase} asks you to notice what is being repeated between people: the tone, the timing and the choice that keeps returning. Its guidance is to ${theme.action}, especially before turning a sign into a story about someone else.`,
    career: `For career, ${number} points toward ${theme.career}. Treat the number as a checkpoint for direction, workload and visibility. If the same concern has appeared more than once, the practical message is to choose one next action that makes the work clearer and more stable.`,
    money: `For money, ${number} speaks to ${theme.money}. It is not a promise of sudden luck; it is a prompt to review patterns around spending, earning, saving and obligation. The warning is to avoid ${theme.shadow}, then make one grounded financial decision today.`,
    spiritual: `Spiritually, ${number} blends ${phrase} with root number ${rootNumber}, which carries ${theme.noun}. ${specialNote ? `Its symbolic background also points to ${specialNote}. ` : ""}The message becomes useful when it leads to reflection, prayer, journaling or a quieter decision that changes how you move through the day.`,
    health: `For health, ${number} encourages ${theme.health}. Start with the body before chasing a dramatic interpretation: sleep, hydration, breath, movement and medical follow-through all count as spiritual obedience when they help you become steady enough to hear yourself.`,
    twinFlame: `For twin flames, ${number} emphasizes ${theme.twinFlame}. It can feel meaningful when the number appears around contact, silence or reunion, but its healthiest use is to create maturity. Ask what both people are learning, not only whether the sign proves the connection.`,
  };
}

function buildRelatedNumbers(number: string, category: AngelNumberCategory, rootNumber: number) {
  const related = new Set<string>();
  const firstDigit = number[0];
  const lastDigit = number[number.length - 1];

  related.add(String(rootNumber));
  related.add(firstDigit);
  related.add(lastDigit);

  if (number.length === 1) {
    related.add(`${number}${number}`);
    related.add(`${number}${number}${number}`);
    related.add(`${number}${number}${number}${number}`);
  }

  if (category === "double") {
    related.add(firstDigit);
    related.add(`${firstDigit}${firstDigit}${firstDigit}`);
    related.add(`${firstDigit}${firstDigit}${firstDigit}${firstDigit}`);
  }

  if (category === "triple") {
    related.add(`${firstDigit}${firstDigit}`);
    related.add(`${firstDigit}${firstDigit}${firstDigit}${firstDigit}`);
    related.add(firstDigit);
  }

  if (category === "quad") {
    related.add(`${firstDigit}${firstDigit}${firstDigit}`);
    related.add(`${firstDigit}${firstDigit}`);
    related.add(firstDigit);
  }

  if (category === "mirror") {
    related.add(number.slice(0, Math.ceil(number.length / 2)));
    related.add(`${firstDigit}${lastDigit}`);
    related.add(`${rootNumber}${rootNumber}`);
  }

  if (category === "sequence") {
    related.add(number.slice(0, -1));
    related.add(number.slice(1));
    related.add("1234");
  }

  if (category === "special") {
    related.add("12");
    related.add("144");
    related.add("1212");
  }

  return [...related]
    .filter((item) => item && item !== number && /^\d{1,12}$/.test(item))
    .slice(0, 6);
}

function buildReference(number: string, category: AngelNumberCategory) {
  const special = SPECIAL_THEMES[number];
  if (special) {
    return {
      verse: special.verse,
      text: `${number} is treated here as a symbolic number connected with ${special.label}.`,
      relevance: `This reference gives ${number} a reflective layer without turning it into a fixed doctrinal claim.`,
    };
  }

  if (category === "single") {
    return {
      verse: `Psalm ${Number(number) + 1}:1`,
      text: `Single-digit angel numbers are read through root-number symbolism and personal reflection.`,
      relevance: `${number} keeps the message close to a primary numerology archetype.`,
    };
  }

  return {
    verse: "Symbolic note",
    text: `${number} is interpreted through pattern, numerology and reflective angel number symbolism.`,
    relevance: `The ${categoryPhrase(category, number)} shape gives the number its emphasis while root numerology gives it direction.`,
  };
}

function buildAngelNumber(number: string): AngelNumber {
  const category = categoryFor(number);
  const { rootNumber, theme } = getTheme(number);
  const phrase = categoryPhrase(category, number);
  const shortMeaning = titleCase(
    SPECIAL_THEMES[number]?.label ?? `${theme.noun} through a ${phrase}`,
  );
  const meanings = buildMeanings(number, category, rootNumber, theme);
  const relatedNumbers = buildRelatedNumbers(number, category, rootNumber);
  const sum = digitSum(number);

  return {
    number,
    slug: number,
    title: `Angel Number ${number} Meaning`,
    shortMeaning,
    summary: `Angel number ${number} is a ${phrase} shaped by root number ${rootNumber}. Its core message is ${theme.noun}: a reminder to ${theme.action} while noticing where this exact number keeps appearing. Use ${number} as a practical prompt, not a superstition: record the context, name the repeated pattern and choose the next grounded action.`,
    meanings,
    gematriaValues: {
      hebrew: Number(number) || sum,
      english: sum * 6,
      simple: Number(number),
      jewish: sum * 3,
      reduction: rootNumber,
    },
    numerology: {
      rootNumber,
      rootMeaning: `Root number ${rootNumber} brings ${theme.noun}.`,
      calculation: buildCalculation(number, rootNumber),
    },
    biblicalReferences: [buildReference(number, category)],
    affirmation: `I receive the message of ${number} and let it become one grounded, honest action.`,
    relatedNumbers,
    faqs: [
      {
        question: `What does angel number ${number} mean?`,
        answer: `Angel number ${number} means ${theme.noun}, expressed through ${phrase}. Its practical message is to ${theme.action}.`,
      },
      {
        question: `Why do I keep seeing ${number}?`,
        answer: `You may keep seeing ${number} when your attention is being drawn to a repeated pattern, decision point or lesson connected with root number ${rootNumber}.`,
      },
      {
        question: `What should I do after seeing ${number}?`,
        answer: `Pause, write down where ${number} appeared, then choose one concrete action that supports ${theme.noun} instead of only collecting more signs.`,
      },
    ],
    meta: {
      title: `Angel Number ${number} Meaning - Love, Career, Money & Spiritual Guide`,
      description: `Discover angel number ${number} meaning for love, career, money, twin flames and spiritual growth. Learn why ${number} appears and what to do next.`,
      keywords: [
        `angel number ${number}`,
        `${number} meaning`,
        `${number} spiritual meaning`,
        `${number} love meaning`,
      ],
    },
    category,
    isPriority: PRIORITY_SLUGS.has(number),
    lastUpdated: "2026-05-09",
  };
}

async function readExistingAuthorialContent() {
  const records = new Map<string, AngelNumber>();
  const filenames = await readdir(sourceDir).catch(() => []);

  for (const filename of filenames) {
    if (!filename.endsWith(".json")) {
      continue;
    }
    const slug = filename.replace(/\.json$/, "");
    if (!EXISTING_AUTHORIAL_SLUGS.has(slug)) {
      continue;
    }
    const raw = await readFile(path.join(sourceDir, filename), "utf8");
    const item = JSON.parse(raw) as AngelNumber;
    records.set(slug, {
      ...item,
      isPriority: PRIORITY_SLUGS.has(slug),
      lastUpdated: item.lastUpdated || "2026-05-09",
    });
  }

  return records;
}

export function getPlannedAngelNumberSlugs() {
  return [
    ...Array.from({ length: 10 }, (_, index) => String(index)),
    ...Array.from({ length: 9 }, (_, index) => String(index + 1).repeat(2)),
    ...Array.from({ length: 9 }, (_, index) => String(index + 1).repeat(3)),
    ...Array.from({ length: 9 }, (_, index) => String(index + 1).repeat(4)),
    ...MIRROR_NUMBERS,
    ...SEQUENCE_NUMBERS,
    ...SPECIAL_NUMBERS,
  ]
    .filter((slug, index, list) => list.indexOf(slug) === index)
    .sort((a, b) => Number(a) - Number(b));
}

async function main() {
  await mkdir(sourceDir, { recursive: true });

  const existingAuthorialContent = await readExistingAuthorialContent();
  const slugs = getPlannedAngelNumberSlugs();

  await Promise.all(
    slugs.map(async (slug) => {
      const item = existingAuthorialContent.get(slug) ?? buildAngelNumber(slug);
      const filePath = path.join(sourceDir, `${slug}.json`);
      await writeFile(filePath, `${JSON.stringify(item, null, 2)}\n`);
    }),
  );

  console.log(`Wrote ${slugs.length} angel number source records.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
