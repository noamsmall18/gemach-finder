interface EmptyStateProps {
  query: string
}

export default function EmptyState({ query }: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-4">
      <div className="text-6xl mb-4">🤲</div>
      <h3 className="font-heading text-xl text-slate-700">
        No gemachs found{query ? ` for "${query}"` : ''}
      </h3>
      <p className="text-slate-500 mt-2 max-w-md mx-auto">
        Try a different search term, or browse by category.
        Know of a gemach we&apos;re missing?
      </p>
      <a
        href="#suggest"
        className="inline-flex items-center mt-4 px-6 py-2 bg-gold text-white rounded-full font-semibold hover:bg-gold-bright transition-colors"
      >
        Suggest a Gemach
      </a>
    </div>
  )
}
