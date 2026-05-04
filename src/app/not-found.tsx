import Link from 'next/link'
import Footer from '@/components/Footer'
import { getGemachCount } from '@/lib/data'

export const revalidate = 300

export default async function NotFound() {
  const gemachCount = await getGemachCount()

  return (
    <>
      <main className="min-h-[70vh] flex items-center justify-center px-6 py-16">
        <div className="max-w-md text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">404</p>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-navy mt-2">
            Page not found
          </h1>
          <p className="text-slate-500 mt-3 leading-relaxed">
            That link isn&apos;t part of GemachFinder. The gemach may have been removed, or the URL was
            typed incorrectly.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl bg-navy text-white text-sm font-semibold hover:bg-navy-deep transition-colors"
            >
              Browse directory
            </Link>
            <Link
              href="/suggest"
              className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 transition-colors"
            >
              Suggest a gemach
            </Link>
          </div>
        </div>
      </main>
      <Footer gemachCount={gemachCount} />
    </>
  )
}
