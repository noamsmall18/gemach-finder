'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Route error:', error)
  }, [error])

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-6 py-16">
      <div className="max-w-md text-center">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Error</p>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-navy mt-2">
          Something went wrong
        </h1>
        <p className="text-slate-500 mt-3 leading-relaxed">
          The page hit an unexpected error. You can try again, or head back to the directory.
        </p>
        {error.digest && (
          <p className="mt-3 text-[11px] font-mono text-slate-400">Ref: {error.digest}</p>
        )}
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="px-5 py-2.5 rounded-xl bg-navy text-white text-sm font-semibold hover:bg-navy-deep transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 transition-colors"
          >
            Back home
          </Link>
        </div>
      </div>
    </main>
  )
}
