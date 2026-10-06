import { Stemmer } from "sastrawijs";

export type PipelineOptions = {
  removeUrls: boolean;
  removeMentions: boolean;
  lowercase: boolean;
  normalizeRepeated: boolean;
  normalizeSlang: boolean;
  removePunctuation: boolean;
  keepEmoji: boolean;
  keepHashtag: boolean;
  keepNumbers: boolean;
  removeStopwords: boolean;
  stemming: boolean;
};

export type TraceStep = {
  id: string;
  label: string;
  value: string;
  note?: string;
};

export type PreprocessResult = {
  original: string;
  finalText: string;
  tokens: string[];
  traces: TraceStep[];
  warnings: string[];
  stats: {
    originalCharacters: number;
    finalCharacters: number;
    tokenCount: number;
  };
};

export const DEFAULT_OPTIONS: PipelineOptions = {
  removeUrls: true,
  removeMentions: false,
  lowercase: true,
  normalizeRepeated: true,
  normalizeSlang: true,
  removePunctuation: true,
  keepEmoji: true,
  keepHashtag: true,
  keepNumbers: true,
  removeStopwords: false,
  stemming: false,
};

export const PRESETS: Record<string, PipelineOptions> = {
  minimal: {
    removeUrls: true,
    removeMentions: false,
    lowercase: false,
    normalizeRepeated: false,
    normalizeSlang: false,
    removePunctuation: true,
    keepEmoji: true,
    keepHashtag: true,
    keepNumbers: true,
    removeStopwords: false,
    stemming: false,
  },
  sentiment: {
    removeUrls: true,
    removeMentions: true,
    lowercase: true,
    normalizeRepeated: true,
    normalizeSlang: true,
    removePunctuation: true,
    keepEmoji: true,
    keepHashtag: true,
    keepNumbers: true,
    removeStopwords: false,
    stemming: false,
  },
  ner: {
    removeUrls: true,
    removeMentions: true,
    lowercase: false,
    normalizeRepeated: true,
    normalizeSlang: false,
    removePunctuation: true,
    keepEmoji: false,
    keepHashtag: true,
    keepNumbers: true,
    removeStopwords: false,
    stemming: false,
  },
  agresif: {
    removeUrls: true,
    removeMentions: true,
    lowercase: true,
    normalizeRepeated: true,
    normalizeSlang: true,
    removePunctuation: true,
    keepEmoji: false,
    keepHashtag: false,
    keepNumbers: false,
    removeStopwords: true,
    stemming: true,
  },
};

const SLANG_MAP: Record<string, string> = {
  gak: "tidak",
  nggak: "tidak",
  ngga: "tidak",
  gk: "tidak",
  ga: "tidak",
  bgt: "sangat",
  banget: "sangat",
  yg: "yang",
  dgn: "dengan",
  krn: "karena",
  karna: "karena",
  udah: "sudah",
  uda: "sudah",
  blm: "belum",
  sm: "sama",
  tp: "tetapi",
  tapi: "tetapi",
  jd: "jadi",
  aja: "saja",
  klo: "kalau",
  kalo: "kalau",
  sy: "saya",
  gw: "saya",
  gue: "saya",
  aku: "saya",
  km: "kamu",
  kamu: "kamu",
  org: "orang",
  dr: "dari",
  utk: "untuk",
  dpt: "dapat",
  kyk: "seperti",
  kayak: "seperti",
  nih: "ini",
  sih: "",
  dong: "",
  deh: "",
  coy: "",
};

const STOPWORDS = new Set([
  "ada", "adalah", "agar", "akan", "aku", "anda", "atau", "bagi", "bahwa",
  "banyak", "beberapa", "bila", "dalam", "dan", "dari", "dengan", "dia",
  "di", "itu", "ini", "jika", "juga", "karena", "ke", "kepada", "kami",
  "kamu", "maka", "mereka", "oleh", "pada", "para", "saat", "saja", "saya",
  "sebagai", "sebuah", "secara", "seperti", "serta", "tetapi", "untuk", "yang",
  "tidak", "bukan", "belum", "jangan", "tanpa"
]);

const NEGATIONS = new Set(["tidak", "bukan", "belum", "jangan", "tanpa"]);
const stemmer = new Stemmer();

function cleanSpaces(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

function removeUrls(text: string) {
  return text.replace(/https?:\/\/\S+|www\.\S+/gi, " ");
}

function removeMentions(text: string) {
  return text.replace(/(^|\s)@[\p{L}\p{N}_]+/gu, "$1 ");
}

function normalizeRepeatedCharacters(text: string) {
  return text.replace(/([\p{L}])\1{2,}/gu, "$1");
}

export function tokenize(text: string): string[] {
  const pattern = /#[\p{L}\p{N}_]+|@[\p{L}\p{N}_]+|\p{L}[\p{L}\p{M}\p{N}'’-]*(?:-\p{L}[\p{L}\p{M}\p{N}'’-]*)*|\p{N}+(?:[.,:-]\p{N}+)*|\p{Regional_Indicator}{2}|\p{Extended_Pictographic}(?:\uFE0F|\u200D\p{Extended_Pictographic})*|[^\s]/gu;
  return text.match(pattern) ?? [];
}

function isEmoji(token: string) {
  return /\p{Extended_Pictographic}|\p{Regional_Indicator}/u.test(token);
}

function isPunctuation(token: string) {
  return /^\p{P}+$/u.test(token);
}

function isNumber(token: string) {
  return /^\p{N}+(?:[.,:-]\p{N}+)*$/u.test(token);
}

function normalizeSlang(tokens: string[]) {
  return tokens.flatMap((token) => {
    const key = token.toLocaleLowerCase("id-ID");
    if (!(key in SLANG_MAP)) return [token];
    const replacement = SLANG_MAP[key];
    return replacement ? [replacement] : [];
  });
}

function shouldStem(token: string) {
  return /^\p{L}[\p{L}\p{M}'’-]*$/u.test(token) && !token.startsWith("#");
}

function snapshot(id: string, label: string, value: string, note?: string): TraceStep {
  return { id, label, value: value || "∅", note };
}

export function preprocessText(
  input: string,
  partialOptions: Partial<PipelineOptions> = {},
): PreprocessResult {
  const options = { ...DEFAULT_OPTIONS, ...partialOptions };
  const traces: TraceStep[] = [];
  const warnings: string[] = [];

  const original = input;
  let text = cleanSpaces(input);
  traces.push(snapshot("raw", "Teks awal", text));

  if (options.removeUrls) {
    text = cleanSpaces(removeUrls(text));
    traces.push(snapshot("url", "Pembersihan URL", text));
  }

  if (options.removeMentions) {
    text = cleanSpaces(removeMentions(text));
    traces.push(snapshot("mention", "Pembersihan sebutan pengguna", text));
  }

  if (options.lowercase) {
    text = text.toLocaleLowerCase("id-ID");
    traces.push(
      snapshot(
        "lowercase",
        "Penyeragaman huruf kecil",
        text,
        "Periksa kembali bila tugas NLP memerlukan informasi kapitalisasi, misalnya NER.",
      ),
    );
  }

  if (options.normalizeRepeated) {
    text = normalizeRepeatedCharacters(text);
    traces.push(snapshot("repeat", "Normalisasi pengulangan huruf", text));
  }

  let tokens = tokenize(text);
  traces.push(snapshot("tokenize", "Tokenisasi", JSON.stringify(tokens)));

  if (options.normalizeSlang) {
    tokens = normalizeSlang(tokens);
    traces.push(snapshot("slang", "Normalisasi bahasa informal", JSON.stringify(tokens)));
  }

  if (options.removePunctuation) {
    tokens = tokens.filter((token) => !isPunctuation(token));
    traces.push(snapshot("punct", "Penyaringan tanda baca", JSON.stringify(tokens)));
  }

  if (!options.keepEmoji) {
    const hadEmoji = tokens.some(isEmoji);
    tokens = tokens.filter((token) => !isEmoji(token));
    if (hadEmoji) {
      warnings.push("Emoji dihapus. Untuk analisis sentimen, emoji dapat membawa informasi afektif yang penting.");
    }
    traces.push(snapshot("emoji", "Penyaringan emoji", JSON.stringify(tokens)));
  }

  if (!options.keepHashtag) {
    tokens = tokens.filter((token) => !token.startsWith("#"));
    traces.push(snapshot("hashtag", "Penyaringan tagar", JSON.stringify(tokens)));
  }

  if (!options.keepNumbers) {
    tokens = tokens.filter((token) => !isNumber(token));
    traces.push(snapshot("number", "Penyaringan angka", JSON.stringify(tokens)));
  }

  if (options.removeStopwords) {
    const removedNegation = tokens.some((token) => NEGATIONS.has(token.toLocaleLowerCase("id-ID")));
    tokens = tokens.filter((token) => !STOPWORDS.has(token.toLocaleLowerCase("id-ID")));
    if (removedNegation) {
      warnings.push("Kata negasi ikut terhapus. Hal ini dapat membalik atau mengaburkan makna pada analisis sentimen.");
    }
    traces.push(
      snapshot(
        "stopword",
        "Penghapusan kata henti",
        JSON.stringify(tokens),
        "Daftar kata henti bersifat demonstratif dan harus disesuaikan dengan korpus serta tujuan analisis.",
      ),
    );
  }

  if (options.stemming) {
    tokens = tokens.map((token) => (shouldStem(token) ? stemmer.stem(token) : token));
    traces.push(
      snapshot(
        "stemming",
        "Stemming (pengakaran kata)",
        JSON.stringify(tokens),
        "Stemming menggunakan SastrawiJs. Tinjau hasilnya karena bentuk dasar tidak selalu cocok untuk setiap tugas NLP.",
      ),
    );
  }

  const finalText = tokens.join(" ");

  if (options.lowercase && /\b[A-Z][\p{L}]+/u.test(original)) {
    warnings.push("Kapitalisasi telah diseragamkan. Pada NER, kapitalisasi dapat membantu membedakan nama diri.");
  }

  if (options.stemming) {
    warnings.push("Stemming dapat mengurangi variasi bentuk kata, tetapi dapat pula menghilangkan nuansa morfologis.");
  }

  return {
    original,
    finalText,
    tokens,
    traces,
    warnings: [...new Set(warnings)],
    stats: {
      originalCharacters: original.length,
      finalCharacters: finalText.length,
      tokenCount: tokens.length,
    },
  };
}
