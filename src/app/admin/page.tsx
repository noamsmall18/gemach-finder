import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { adminLogin, isAdmin } from './actions'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Admin - GemachFinder',
  robots: { index: false, follow: false },
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  if (await isAdmin()) redirect('/admin/suggestions')
  const { error } = await searchParams

  return (
    <main className="max-w-sm mx-auto px-4 py-20">
      <h1 className="font-heading text-3xl font-bold text-navy mb-2">Admin</h1>
      <p className="text-sm text-slate-500 mb-6">Enter the admin password to review suggestions.</p>

      <form action={adminLogin} className="space-y-3">
        <input
          name="password"
          type="password"
          autoFocus
          required
          placeholder="Password"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 text-sm"
        />
        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">Incorrect password.</p>
        )}
        <button
          type="submit"
          className="w-full px-4 py-3 bg-navy text-white rounded-xl font-bold hover:bg-navy-deep transition-colors text-sm"
        >
          Sign in
        </button>
      </form>
    </main>
  )
}
