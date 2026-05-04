import { headers } from 'next/headers'
import { createHash } from 'node:crypto'

const SALT = process.env.RATE_LIMIT_SALT || 'gemach-finder-rl-v1'

export async function getClientIpHash(): Promise<string> {
  const h = await headers()
  const forwarded = h.get('x-forwarded-for')
  const ip =
    forwarded?.split(',')[0]?.trim() ||
    h.get('x-real-ip') ||
    h.get('cf-connecting-ip') ||
    'unknown'
  return createHash('sha256').update(`${SALT}:${ip}`).digest('hex').slice(0, 32)
}

export function isRateLimitError(err: { message?: string } | null | undefined): boolean {
  return !!err?.message && /rate_limited/.test(err.message)
}
