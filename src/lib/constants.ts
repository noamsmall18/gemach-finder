export const CATEGORIES = [
  { name: 'Baby & Kids', emoji: '👶' },
  { name: 'Medical Equipment', emoji: '🏥' },
  { name: 'Simcha & Events', emoji: '🎉' },
  { name: 'Clothing', emoji: '👗' },
  { name: 'Household', emoji: '🏠' },
  { name: 'Financial/Loans', emoji: '💰' },
  { name: 'Food', emoji: '🍞' },
  { name: 'Seforim & Judaica', emoji: '📚' },
  { name: 'Other', emoji: '🤝' },
] as const

export const LOCATIONS = [
  'Teaneck',
  'Bergenfield',
  'Englewood',
  'Fair Lawn',
  'Paramus',
  'New Milford',
  'Bergen County-wide',
  'Teaneck & Bergenfield',
  'Other',
] as const

export const CATEGORY_COLORS: Record<string, { text: string; bg: string }> = {
  'Baby & Kids': { text: 'text-amber-700', bg: 'bg-amber-50' },
  'Medical Equipment': { text: 'text-emerald-700', bg: 'bg-emerald-50' },
  'Simcha & Events': { text: 'text-purple-700', bg: 'bg-purple-50' },
  'Clothing': { text: 'text-orange-700', bg: 'bg-orange-50' },
  'Household': { text: 'text-yellow-800', bg: 'bg-yellow-50' },
  'Financial/Loans': { text: 'text-navy', bg: 'bg-indigo-50' },
  'Food': { text: 'text-yellow-700', bg: 'bg-yellow-50' },
  'Seforim & Judaica': { text: 'text-blue-700', bg: 'bg-blue-50' },
  'Other': { text: 'text-slate-600', bg: 'bg-slate-100' },
}

export function getCategoryEmoji(category: string): string {
  return CATEGORIES.find(c => c.name === category)?.emoji || '🤝'
}

export function getCategoryColors(category: string) {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS['Other']
}
