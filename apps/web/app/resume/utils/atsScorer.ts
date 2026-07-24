/**
 * Client-side ATS resume scorer.
 * No external dependencies — runs entirely in the browser.
 */

const STOP_WORDS = new Set([
  "a","an","the","and","or","but","in","on","at","to","for","of","with","by",
  "from","is","are","was","were","be","been","being","have","has","had","do",
  "does","did","will","would","could","should","may","might","shall","can",
  "that","this","these","those","it","its","we","you","your","our","their",
  "i","my","me","us","he","she","they","him","her","them","what","which",
  "who","how","when","where","why","all","each","any","both","more","most",
  "other","some","such","no","not","only","same","so","than","too","very",
  "just","also","then","there","about","up","out","if","because","as","while"
]);

/** Tokenize text into meaningful lowercase words, removing stop words */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9#+.\-/]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

/** Count term frequency in an array of tokens */
function termFreq(tokens: string[]): Map<string, number> {
  const freq = new Map<string, number>();
  for (const t of tokens) freq.set(t, (freq.get(t) ?? 0) + 1);
  return freq;
}

/** Extract top N keywords from text by frequency */
function extractKeywords(text: string, topN = 30): string[] {
  const tokens = tokenize(text);
  const freq = termFreq(tokens);
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([word]) => word);
}

/** Capitalise first letter of each word for display */
function titleCase(w: string): string {
  return w.charAt(0).toUpperCase() + w.slice(1);
}

export interface ATSSectionScore {
  name: string;
  score: number;
  status: "pass" | "warn" | "fail";
}

export interface ATSResult {
  score: number;
  keywords: { found: string[]; missing: string[] };
  sections: ATSSectionScore[];
  suggestions: string[];
}

export function scoreResume(resumeText: string, jobDesc: string): ATSResult {
  const resumeTokens = tokenize(resumeText);
  const jobKeywords = extractKeywords(jobDesc, 40);
  const resumeFreq = termFreq(resumeTokens);

  // ── Keyword match ─────────────────────────────────────────
  const found: string[] = [];
  const missing: string[] = [];

  for (const kw of jobKeywords) {
    if (resumeFreq.has(kw)) {
      found.push(titleCase(kw));
    } else {
      missing.push(titleCase(kw));
    }
  }

  const keywordScore = jobKeywords.length > 0
    ? Math.round((found.length / jobKeywords.length) * 100)
    : 50;

  // ── Section detection ─────────────────────────────────────
  const lower = resumeText.toLowerCase();
  const sections: ATSSectionScore[] = [
    {
      name: "Contact Info",
      score: /\b[\w.+-]+@[\w-]+\.[a-z]{2,}\b/.test(lower) ? 100 : 40,
      status: /\b[\w.+-]+@[\w-]+\.[a-z]{2,}\b/.test(lower) ? "pass" : "warn"
    },
    {
      name: "Professional Summary",
      score: lower.includes("summary") || lower.includes("objective") || lower.includes("profile") ? 90 : 50,
      status: lower.includes("summary") || lower.includes("objective") ? "pass" : "warn"
    },
    {
      name: "Work Experience",
      score: lower.includes("experience") || lower.includes("employment") || lower.includes("work history") ? 95 : 30,
      status: lower.includes("experience") || lower.includes("employment") ? "pass" : "fail"
    },
    {
      name: "Skills Section",
      score: lower.includes("skill") ? Math.min(60 + found.length * 3, 100) : 20,
      status: lower.includes("skill") && found.length > 3 ? "pass" : lower.includes("skill") ? "warn" : "fail"
    },
    {
      name: "Education",
      score: lower.includes("education") || lower.includes("university") || lower.includes("degree") || lower.includes("bachelor") || lower.includes("master") ? 95 : 50,
      status: lower.includes("education") || lower.includes("degree") ? "pass" : "warn"
    },
    {
      name: "Formatting",
      score: resumeText.split("\n").filter((l) => l.trim().length > 0).length > 10 ? 80 : 50,
      status: resumeText.split("\n").filter((l) => l.trim().length > 0).length > 10 ? "pass" : "warn"
    }
  ];

  // ── Overall score ─────────────────────────────────────────
  const sectionAvg = Math.round(sections.reduce((a, s) => a + s.score, 0) / sections.length);
  const score = Math.round(keywordScore * 0.6 + sectionAvg * 0.4);

  // ── Suggestions ───────────────────────────────────────────
  const suggestions: string[] = [];
  if (missing.length > 0) {
    suggestions.push(
      `Add these missing keywords from the job description: ${missing.slice(0, 5).join(", ")}`
    );
  }
  if (!lower.includes("summary") && !lower.includes("objective")) {
    suggestions.push("Add a professional summary section at the top of your resume");
  }
  if (!lower.includes("skill")) {
    suggestions.push("Add a dedicated Skills section listing your technical and soft skills individually");
  }
  const bulletCount = (resumeText.match(/^[•\-*]/gm) ?? []).length;
  if (bulletCount < 5) {
    suggestions.push("Use bullet points starting with strong action verbs (Led, Built, Improved, Delivered)");
  }
  const percentMatch = resumeText.match(/\d+%/g);
  if (!percentMatch || percentMatch.length < 2) {
    suggestions.push("Quantify your achievements with specific metrics and percentages");
  }
  if (resumeText.length < 400) {
    suggestions.push("Your resume is quite short — aim for at least 300–500 words with detailed experience bullets");
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    keywords: { found: found.slice(0, 10), missing: missing.slice(0, 10) },
    sections,
    suggestions: suggestions.slice(0, 5)
  };
}
