import type { Gemach } from './types'

// Simple fuzzy matching - returns a relevance score (0 = no match, higher = better)
function fuzzyScore(query: string, text: string): number {
  const q = query.toLowerCase()
  const t = text.toLowerCase()

  // Exact substring match is best
  if (t.includes(q)) return 100

  // Check if all query words appear somewhere in the text
  const queryWords = q.split(/\s+/).filter(Boolean)
  const allWordsMatch = queryWords.every(w => t.includes(w))
  if (allWordsMatch) return 80

  // Check individual word matches and count them
  const matchedWords = queryWords.filter(w => t.includes(w))
  if (matchedWords.length > 0) {
    return 50 + (matchedWords.length / queryWords.length) * 30
  }

  // Character-level fuzzy: check if characters appear in order
  let qi = 0
  let consecutive = 0
  let maxConsecutive = 0
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      qi++
      consecutive++
      maxConsecutive = Math.max(maxConsecutive, consecutive)
    } else {
      consecutive = 0
    }
  }

  if (qi === q.length) {
    // All chars found in order - score based on how consecutive they were
    return 20 + (maxConsecutive / q.length) * 20
  }

  // Partial character match
  if (qi > q.length * 0.6) {
    return 10 + (qi / q.length) * 10
  }

  return 0
}

// Keyword synonyms for common searches
const SYNONYMS: Record<string, string[]> = {
  'stroller': ['baby', 'carriage', 'buggy', 'kids'],
  'wheelchair': ['medical', 'equipment', 'mobility'],
  'crutches': ['medical', 'equipment'],
  'dress': ['gown', 'bridal', 'clothing', 'kallah'],
  'wedding': ['bridal', 'simcha', 'kallah', 'gown'],
  'money': ['loan', 'financial', 'free loan', 'interest'],
  'loan': ['financial', 'free loan', 'hebrew free loan'],
  'food': ['pantry', 'meals', 'kosher', 'shabbos'],
  'clothes': ['clothing', 'dress', 'gown'],
  'table': ['simcha', 'event', 'tables', 'chairs'],
  'chair': ['simcha', 'event', 'tables', 'chairs'],
  'book': ['seforim', 'judaica'],
  'tefillin': ['judaica', 'sofer', 'mezuzah'],
  'mezuzah': ['judaica', 'sofer', 'tefillin'],
  'hospital': ['medical', 'bikur cholim', 'equipment'],
  'sick': ['medical', 'bikur cholim', 'meals'],
  'baby': ['kids', 'infant', 'equipment', 'stroller', 'formula'],
  'costume': ['purim', 'dress up'],
  'furniture': ['household', 'table', 'chair'],
  'toy': ['kids', 'baby', 'children'],
  'shabbat': ['shabbos', 'meals', 'food'],
  'shabbos': ['shabbat', 'meals', 'food'],
  'chesed': ['community', 'volunteer', 'help'],
  'safety': ['shomrim', 'hatzalah', 'security'],
  'emergency': ['hatzalah', 'safety', 'medical'],
}

export function searchGemachs(gemachs: Gemach[], query: string): Gemach[] {
  if (!query.trim()) return gemachs

  const q = query.trim().toLowerCase()

  // Get synonym expansions
  const expandedTerms = [q]
  for (const [key, synonyms] of Object.entries(SYNONYMS)) {
    if (q.includes(key)) {
      expandedTerms.push(...synonyms)
    }
  }
  // Also check if the query itself is a synonym value
  for (const [key, synonyms] of Object.entries(SYNONYMS)) {
    if (synonyms.some(s => q.includes(s))) {
      expandedTerms.push(key)
    }
  }

  const scored = gemachs.map(gemach => {
    const searchableText = [
      gemach.name,
      gemach.description,
      gemach.category,
      gemach.location,
      gemach.notes || '',
      gemach.contact_name || '',
    ].join(' ')

    // Score against original query
    let bestScore = fuzzyScore(q, searchableText)

    // Score against expanded terms
    for (const term of expandedTerms) {
      if (term === q) continue
      const score = fuzzyScore(term, searchableText)
      // Synonym matches are weighted lower
      bestScore = Math.max(bestScore, score * 0.7)
    }

    return { gemach, score: bestScore }
  })

  // Return matches sorted by score, include anything with score > 10
  return scored
    .filter(s => s.score > 10)
    .sort((a, b) => b.score - a.score)
    .map(s => s.gemach)
}

// Generate suggestions based on partial input
export function getSuggestions(gemachs: Gemach[], query: string): string[] {
  if (!query.trim() || query.length < 2) return []

  const q = query.toLowerCase()
  const suggestions = new Set<string>()

  // Suggest category names
  const categories = [...new Set(gemachs.map(g => g.category))]
  for (const cat of categories) {
    if (cat.toLowerCase().includes(q)) {
      suggestions.add(cat)
    }
  }

  // Suggest location names
  const locations = [...new Set(gemachs.map(g => g.location))]
  for (const loc of locations) {
    if (loc.toLowerCase().includes(q)) {
      suggestions.add(loc)
    }
  }

  // Suggest gemach names (partial match)
  for (const g of gemachs) {
    if (g.name.toLowerCase().includes(q)) {
      suggestions.add(g.name)
    }
  }

  // Suggest relevant keywords from synonyms
  for (const [key, synonyms] of Object.entries(SYNONYMS)) {
    if (key.startsWith(q) || synonyms.some(s => s.startsWith(q))) {
      suggestions.add(key)
    }
  }

  return [...suggestions].slice(0, 5)
}
