import { Search } from 'lucide-react'

interface EmptyStateProps {
  query: string
}

export default function EmptyState({ query }: EmptyStateProps) {
  return (
    <div className="text-center py-20 px-4">
      <div className="w-16 h-16 rounded-2xl bg-slate-100/80 flex items-center justify-center mx-auto mb-4">
        <Search className="w-7 h-7 text-slate-300" />
      </div>
      <h3 className="font-heading text-xl text-slate-700">
        No gemachs found{query ? ` for "${query}"` : ''}
      </h3>
      <p className="text-slate-400 mt-2 max-w-md mx-auto text-sm leading-relaxed">
        Try a different search term, or browse by category.
        Know of a gemach we&apos;re missing?
      </p>
      <a
        href="#suggest"
        className="inline-flex items-center mt-5 px-6 py-2.5 bg-gradient-to-r from-navy to-navy-deep text-white rounded-full font-semibold text-sm hover:shadow-lg hover:shadow-navy/20 transition-all"
      >
        Suggest a Gemach
      </a>
    </div>
  )
}
