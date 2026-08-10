import { prisma } from "./prisma";

export interface KnowledgeMatch {
  question: string;
  answer: string;
  score: number;
}

function simpleSimilarity(a: string, b: string): number {
  const wordsA = new Set(a.toLowerCase().split(/\s+/));
  const wordsB = new Set(b.toLowerCase().split(/\s+/));
  if (wordsA.size === 0 || wordsB.size === 0) return 0;
  const intersection = new Set([...wordsA].filter((w) => wordsB.has(w)));
  return intersection.size / Math.max(wordsA.size, wordsB.size);
}

export async function searchKnowledgeBase(query: string, limit = 3): Promise<KnowledgeMatch[]> {
  const entries = await prisma.knowledgeEntry.findMany();
  const results: KnowledgeMatch[] = entries.map((entry) => ({
    question: entry.question,
    answer: entry.answer,
    score: simpleSimilarity(query, entry.question),
  }));
  results.sort((a, b) => b.score - a.score);
  return results.filter((r) => r.score > 0.1).slice(0, limit);
}

export function buildRAGContext(matches: KnowledgeMatch[]): string {
  if (matches.length === 0) return "";
  return matches
    .map((m) => `Pertanyaan: ${m.question}\nJawaban: ${m.answer}`)
    .join("\n\n");
}
