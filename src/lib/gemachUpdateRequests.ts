import type { Gemach } from './types'

export const GEMACH_UPDATE_REQUEST_PREFIX = '__GF_UPDATE__'

export const GEMACH_UPDATE_FIELDS = [
  'contact_name',
  'contact_phone',
  'contact_email',
  'contact_website',
  'hours',
  'address',
  'notes',
] as const

export type GemachUpdateField = (typeof GEMACH_UPDATE_FIELDS)[number]

export type GemachUpdateChanges = Partial<Pick<Gemach, GemachUpdateField>>

export interface GemachUpdateRequestPayload {
  kind: 'gemach_update'
  gemachId: string
  gemachSlug: string | null
  claimsOperator: boolean
  changes: GemachUpdateChanges
}

export const GEMACH_UPDATE_FIELD_LABELS: Record<GemachUpdateField, string> = {
  contact_name: 'Contact name',
  contact_phone: 'Phone',
  contact_email: 'Email',
  contact_website: 'Website',
  hours: 'Hours',
  address: 'Address',
  notes: 'Additional info',
}

export const GEMACH_UPDATE_FIELD_LIMITS: Record<GemachUpdateField, number> = {
  contact_name: 120,
  contact_phone: 120,
  contact_email: 160,
  contact_website: 200,
  hours: 160,
  address: 220,
  notes: 320,
}

function trimTo(value: string | null | undefined, max: number): string | null {
  const trimmed = (value || '').trim()
  if (!trimmed) return null
  return trimmed.slice(0, max)
}

export function buildGemachUpdateChanges(input: Partial<Record<GemachUpdateField, string>>): GemachUpdateChanges {
  const changes: GemachUpdateChanges = {}

  for (const field of GEMACH_UPDATE_FIELDS) {
    const value = trimTo(input[field], GEMACH_UPDATE_FIELD_LIMITS[field])
    if (value) {
      changes[field] = value
    }
  }

  return changes
}

export function hasGemachUpdateChanges(changes: GemachUpdateChanges): boolean {
  return GEMACH_UPDATE_FIELDS.some((field) => Boolean(changes[field]))
}

export function serializeGemachUpdateRequest(payload: GemachUpdateRequestPayload): string {
  return `${GEMACH_UPDATE_REQUEST_PREFIX}${JSON.stringify(payload)}`
}

export function parseGemachUpdateRequest(description: string | null | undefined): GemachUpdateRequestPayload | null {
  if (!description || !description.startsWith(GEMACH_UPDATE_REQUEST_PREFIX)) return null

  const raw = description.slice(GEMACH_UPDATE_REQUEST_PREFIX.length)

  try {
    const parsed = JSON.parse(raw) as Partial<GemachUpdateRequestPayload>
    if (
      parsed.kind !== 'gemach_update' ||
      typeof parsed.gemachId !== 'string' ||
      !parsed.gemachId ||
      typeof parsed.claimsOperator !== 'boolean' ||
      typeof parsed.changes !== 'object' ||
      parsed.changes === null
    ) {
      return null
    }

    const changes = buildGemachUpdateChanges(parsed.changes as Partial<Record<GemachUpdateField, string>>)

    return {
      kind: 'gemach_update',
      gemachId: parsed.gemachId,
      gemachSlug: typeof parsed.gemachSlug === 'string' ? parsed.gemachSlug : null,
      claimsOperator: parsed.claimsOperator,
      changes,
    }
  } catch {
    return null
  }
}

export function listGemachUpdateChanges(changes: GemachUpdateChanges): Array<{
  field: GemachUpdateField
  label: string
  value: string
}> {
  return GEMACH_UPDATE_FIELDS
    .map((field) => {
      const value = changes[field]
      if (!value) return null
      return {
        field,
        label: GEMACH_UPDATE_FIELD_LABELS[field],
        value,
      }
    })
    .filter((entry): entry is { field: GemachUpdateField; label: string; value: string } => Boolean(entry))
}
