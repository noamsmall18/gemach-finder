// Best-effort parser for free-text hours strings like:
//   "Sun-Thu 9am-8pm"
//   "Mon-Fri 9:00-17:00, Sun 10am-1pm"
//   "By appointment"
// Returns whether the gemach is open at a given moment.

const DAY_MAP: Record<string, number> = {
  sun: 0, sunday: 0,
  mon: 1, monday: 1,
  tue: 2, tues: 2, tuesday: 2,
  wed: 3, weds: 3, wednesday: 3,
  thu: 4, thur: 4, thurs: 4, thursday: 4,
  fri: 5, friday: 5,
  sat: 6, saturday: 6,
}

interface Window {
  days: Set<number>
  startMin: number
  endMin: number
}

function parseDays(token: string): Set<number> | null {
  const cleaned = token.toLowerCase().replace(/\./g, '').trim()
  if (!cleaned) return null
  const result = new Set<number>()

  const parts = cleaned.split(/[,&]/).map((p) => p.trim()).filter(Boolean)
  for (const part of parts) {
    if (/^(every\s*day|daily|everyday)$/.test(part)) {
      for (let i = 0; i < 7; i++) result.add(i)
      continue
    }
    if (/^(weekdays?|weekday)$/.test(part)) {
      for (let i = 1; i <= 5; i++) result.add(i)
      continue
    }
    if (/^(weekends?|weekend)$/.test(part)) {
      result.add(0)
      result.add(6)
      continue
    }
    const rangeMatch = part.match(/^([a-z]+)\s*[-–]\s*([a-z]+)$/)
    if (rangeMatch) {
      const a = DAY_MAP[rangeMatch[1]]
      const b = DAY_MAP[rangeMatch[2]]
      if (a === undefined || b === undefined) continue
      let cur = a
      for (let i = 0; i < 7; i++) {
        result.add(cur)
        if (cur === b) break
        cur = (cur + 1) % 7
      }
      continue
    }
    const single = DAY_MAP[part]
    if (single !== undefined) result.add(single)
  }

  return result.size ? result : null
}

function parseTime(raw: string): number | null {
  const s = raw.toLowerCase().trim().replace(/\s+/g, '')
  if (!s) return null

  const ampmMatch = s.match(/^(\d{1,2})(?::(\d{2}))?(am|pm|a|p)$/)
  if (ampmMatch) {
    let hour = parseInt(ampmMatch[1], 10)
    const minute = ampmMatch[2] ? parseInt(ampmMatch[2], 10) : 0
    const ampm = ampmMatch[3][0]
    if (hour === 12) hour = 0
    if (ampm === 'p') hour += 12
    return hour * 60 + minute
  }

  const militaryMatch = s.match(/^(\d{1,2}):(\d{2})$/)
  if (militaryMatch) {
    return parseInt(militaryMatch[1], 10) * 60 + parseInt(militaryMatch[2], 10)
  }

  const hourOnly = s.match(/^(\d{1,2})$/)
  if (hourOnly) return parseInt(hourOnly[1], 10) * 60

  return null
}

function parseTimeRange(raw: string): { start: number; end: number } | null {
  const match = raw.toLowerCase().match(/(\d{1,2}(?::\d{2})?(?:\s*[ap]m?)?)\s*[-–to]+\s*(\d{1,2}(?::\d{2})?(?:\s*[ap]m?)?)/)
  if (!match) return null

  const rawStart = match[1].trim()
  const rawEnd = match[2].trim()

  let start = parseTime(rawStart)
  let end = parseTime(rawEnd)

  // If start has no am/pm but end does, infer from end
  if (start !== null && end !== null) {
    const startHasAmpm = /[ap]m?/.test(rawStart)
    const endHasAmpm = /[ap]m?/.test(rawEnd)
    if (!startHasAmpm && endHasAmpm) {
      const endHour = Math.floor(end / 60)
      if (endHour >= 12) {
        // PM end - if start hour < 12, leave as-is if that makes sense ordering
        const startHour = Math.floor(start / 60)
        if (startHour < endHour && startHour !== 12) {
          // ambiguous; assume same half as end if raw start < 12
          // keep morning start only if end is clearly morning
        }
      }
    }
  }

  if (start === null || end === null) return null
  return { start, end }
}

export function parseHours(raw: string | null | undefined): Window[] | null {
  if (!raw) return null
  const text = raw.toLowerCase()
  if (/by\s*appointment|call\s*ahead|contact|varies|flexible/.test(text) && !/\d/.test(text)) {
    return null
  }

  // Split on newlines and semicolons/commas that separate distinct windows
  const segments = raw.split(/\n|;|\//).map((s) => s.trim()).filter(Boolean)
  const windows: Window[] = []

  for (const segment of segments) {
    // Find day portion and time portion
    const timeMatch = segment.match(/(\d{1,2}(?::\d{2})?(?:\s*[ap]m?)?)\s*[-–to]+\s*(\d{1,2}(?::\d{2})?(?:\s*[ap]m?)?)/i)
    if (!timeMatch) continue
    const range = parseTimeRange(timeMatch[0])
    if (!range) continue

    const dayText = segment.slice(0, timeMatch.index).trim().replace(/[,:]$/, '').trim()
    const days = parseDays(dayText)
    if (!days) continue

    windows.push({ days, startMin: range.start, endMin: range.end })
  }

  return windows.length ? windows : null
}

export function isOpenNow(raw: string | null | undefined, now: Date = new Date()): boolean {
  const windows = parseHours(raw)
  if (!windows) return false
  const day = now.getDay()
  const minute = now.getHours() * 60 + now.getMinutes()
  for (const w of windows) {
    if (!w.days.has(day)) continue
    if (w.startMin <= minute && minute < w.endMin) return true
    // Overnight range (rare for gemachs, but handle it)
    if (w.endMin < w.startMin) {
      if (minute >= w.startMin || minute < w.endMin) return true
    }
  }
  return false
}
