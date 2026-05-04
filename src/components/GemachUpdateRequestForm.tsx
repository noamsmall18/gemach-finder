'use client'

import { useState, useTransition } from 'react'
import { Check, PencilLine } from 'lucide-react'
import { submitGemachUpdateAction } from '@/app/g/[slug]/actions'
import type { Gemach } from '@/lib/types'

const MAX_CONTACT = 180
const MAX_NAME = 120

interface Props {
  gemach: Gemach
}

export default function GemachUpdateRequestForm({ gemach }: Props) {
  const [open, setOpen] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [claimsOperator, setClaimsOperator] = useState(false)
  const [form, setForm] = useState({
    contact_name: '',
    contact_phone: '',
    contact_email: '',
    contact_website: '',
    hours: '',
    address: '',
    notes: '',
    submitted_by: '',
    submitted_by_contact: '',
  })
  const [isPending, startTransition] = useTransition()

  function updateField<K extends keyof typeof form>(field: K, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function reset() {
    setForm({
      contact_name: '',
      contact_phone: '',
      contact_email: '',
      contact_website: '',
      hours: '',
      address: '',
      notes: '',
      submitted_by: '',
      submitted_by_contact: '',
    })
    setClaimsOperator(false)
    setError('')
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    startTransition(async () => {
      const result = await submitGemachUpdateAction({
        gemachId: gemach.id,
        gemachSlug: gemach.slug,
        gemachName: gemach.name,
        category: gemach.category,
        submittedBy: form.submitted_by,
        submittedByContact: form.submitted_by_contact,
        claimsOperator,
        contact_name: form.contact_name,
        contact_phone: form.contact_phone,
        contact_email: form.contact_email,
        contact_website: form.contact_website,
        hours: form.hours,
        address: form.address,
        notes: form.notes,
      })

      if (!result.ok) {
        if (result.error === 'invalid') {
          setError('Add at least one change and a way for us to reach you back.')
        } else if (result.error === 'rate_limited') {
          setError('You have sent a few updates recently. Please try again in a bit.')
        } else {
          setError('Something went wrong. Please try again.')
        }
        return
      }

      setSent(true)
      reset()
    })
  }

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => {
          setOpen((current) => !current)
          setError('')
        }}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium bg-slate-50 text-slate-700 hover:bg-sky-50 hover:text-sky-700 border border-slate-200 hover:border-sky-200 transition-all"
      >
        {sent ? <Check className="w-4 h-4 text-emerald-600" /> : <PencilLine className="w-4 h-4" />}
        {sent ? 'Update submitted' : 'Update this listing'}
      </button>

      {open && (
        <form
          onSubmit={handleSubmit}
          className="mt-3 p-4 rounded-xl border border-sky-200 bg-sky-50/60 space-y-4"
        >
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-sky-800">
              Send a correction
            </div>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              Leave anything unchanged blank. We review each update before it goes live.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="text-xs font-semibold text-slate-600">
              Contact name
              <input
                value={form.contact_name}
                onChange={(e) => updateField('contact_name', e.target.value)}
                maxLength={120}
                placeholder={gemach.contact_name || 'Who should people ask for?'}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-sky-100 bg-white text-sm text-slate-800 outline-none focus:border-sky-300"
              />
            </label>
            <label className="text-xs font-semibold text-slate-600">
              Phone
              <input
                value={form.contact_phone}
                onChange={(e) => updateField('contact_phone', e.target.value)}
                maxLength={120}
                placeholder={gemach.contact_phone || 'Updated phone number'}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-sky-100 bg-white text-sm text-slate-800 outline-none focus:border-sky-300"
              />
            </label>
            <label className="text-xs font-semibold text-slate-600">
              Email
              <input
                value={form.contact_email}
                onChange={(e) => updateField('contact_email', e.target.value)}
                maxLength={160}
                placeholder={gemach.contact_email || 'Updated email'}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-sky-100 bg-white text-sm text-slate-800 outline-none focus:border-sky-300"
              />
            </label>
            <label className="text-xs font-semibold text-slate-600">
              Website
              <input
                value={form.contact_website}
                onChange={(e) => updateField('contact_website', e.target.value)}
                maxLength={200}
                placeholder={gemach.contact_website || 'Updated website'}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-sky-100 bg-white text-sm text-slate-800 outline-none focus:border-sky-300"
              />
            </label>
            <label className="text-xs font-semibold text-slate-600">
              Hours
              <input
                value={form.hours}
                onChange={(e) => updateField('hours', e.target.value)}
                maxLength={160}
                placeholder={gemach.hours || 'Updated hours'}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-sky-100 bg-white text-sm text-slate-800 outline-none focus:border-sky-300"
              />
            </label>
            <label className="text-xs font-semibold text-slate-600">
              Address
              <input
                value={form.address}
                onChange={(e) => updateField('address', e.target.value)}
                maxLength={220}
                placeholder={gemach.address || 'Updated address'}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-sky-100 bg-white text-sm text-slate-800 outline-none focus:border-sky-300"
              />
            </label>
          </div>

          <label className="block text-xs font-semibold text-slate-600">
            Additional details
            <textarea
              value={form.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              maxLength={320}
              rows={3}
              placeholder={gemach.notes || 'Anything else we should update?'}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-sky-100 bg-white text-sm text-slate-800 outline-none focus:border-sky-300 resize-none"
            />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="text-xs font-semibold text-slate-600">
              Your name
              <input
                value={form.submitted_by}
                onChange={(e) => updateField('submitted_by', e.target.value)}
                maxLength={MAX_NAME}
                placeholder="Optional"
                className="mt-1 w-full px-3 py-2 rounded-lg border border-sky-100 bg-white text-sm text-slate-800 outline-none focus:border-sky-300"
              />
            </label>
            <label className="text-xs font-semibold text-slate-600">
              Your contact <span className="text-red-500">*</span>
              <input
                value={form.submitted_by_contact}
                onChange={(e) => updateField('submitted_by_contact', e.target.value)}
                maxLength={MAX_CONTACT}
                placeholder="Email or phone so we can follow up"
                className="mt-1 w-full px-3 py-2 rounded-lg border border-sky-100 bg-white text-sm text-slate-800 outline-none focus:border-sky-300"
              />
            </label>
          </div>

          <label className="flex items-start gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={claimsOperator}
              onChange={(e) => setClaimsOperator(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
            />
            <span>I run this gemach or help manage it.</span>
          </label>

          {error && (
            <p className="text-sm text-red-700 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          {sent && !error && (
            <p className="text-sm text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg">
              Thanks, your update was sent for review.
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-60 transition-colors"
            >
              {isPending ? 'Sending...' : 'Submit update'}
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                reset()
              }}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
