export const CATEGORIES = [
  { name: 'Baby & Kids', emoji: '👶' },
  { name: 'Medical Equipment', emoji: '🏥' },
  { name: 'Simcha & Events', emoji: '🎉' },
  { name: 'Clothing', emoji: '👗' },
  { name: 'Costumes', emoji: '🎭' },
  { name: 'Wigs', emoji: '💇' },
  { name: 'Household', emoji: '🏠' },
  { name: 'Sports', emoji: '🏀' },
  { name: 'Food', emoji: '🍞' },
  { name: 'Financial/Loans', emoji: '💰' },
  { name: 'Seforim & Judaica', emoji: '📚' },
] as const

export const LOCATIONS = [
  'Teaneck',
  'Bergenfield',
  'Englewood',
  'Fair Lawn',
  'Hackensack',
  'Paramus',
  'New Milford',
  'Bergen County',
  'Bergen County-wide',
  'Teaneck & Bergenfield',
  'Jersey City, NJ',
  'Westchester',
] as const

export const CATEGORY_COLORS: Record<string, { text: string; bg: string }> = {
  'Baby & Kids': { text: 'text-amber-700', bg: 'bg-amber-50' },
  'Medical Equipment': { text: 'text-emerald-700', bg: 'bg-emerald-50' },
  'Simcha & Events': { text: 'text-purple-700', bg: 'bg-purple-50' },
  'Clothing': { text: 'text-orange-700', bg: 'bg-orange-50' },
  'Costumes': { text: 'text-fuchsia-700', bg: 'bg-fuchsia-50' },
  'Wigs': { text: 'text-rose-700', bg: 'bg-rose-50' },
  'Household': { text: 'text-yellow-800', bg: 'bg-yellow-50' },
  'Sports': { text: 'text-green-700', bg: 'bg-green-50' },
  'Food': { text: 'text-rose-700', bg: 'bg-rose-50' },
  'Financial/Loans': { text: 'text-navy', bg: 'bg-sea-soft' },
  'Seforim & Judaica': { text: 'text-blue-700', bg: 'bg-blue-50' },
}

export const CATEGORY_ACCENT_COLORS: Record<string, string> = {
  'Baby & Kids': '#D4930F',
  'Medical Equipment': '#0D8A6A',
  'Simcha & Events': '#8B5AB8',
  'Clothing': '#C4572A',
  'Costumes': '#A21CAF',
  'Wigs': '#BE123C',
  'Household': '#7A6840',
  'Sports': '#15803D',
  'Food': '#B8415A',
  'Financial/Loans': '#1E3A64',
  'Seforim & Judaica': '#3B7BA8',
}

export function getCategoryEmoji(category: string): string {
  return CATEGORIES.find(c => c.name === category)?.emoji || '🤝'
}

export function getCategoryColors(category: string) {
  return CATEGORY_COLORS[category] || { text: 'text-slate-600', bg: 'bg-slate-100' }
}
