'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet.markercluster'
import { Navigation, X as XIcon } from 'lucide-react'
import type { Gemach } from '@/lib/types'
import { TOWN_COORDS } from '@/lib/townCoords'
import { CATEGORIES, CATEGORY_ACCENT_COLORS, getCategoryEmoji } from '@/lib/constants'

type MapTheme = 'light' | 'dark'

function hashOffset(id: string): [number, number] {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0
  const a = (Math.abs(h) & 0xffff) / 0xffff
  const b = (Math.abs(h >> 16) & 0xffff) / 0xffff
  const radius = 0.0008 + a * 0.0035
  const angle = b * Math.PI * 2
  return [Math.cos(angle) * radius, Math.sin(angle) * radius]
}

function resolveCoord(g: Gemach): { coord: [number, number]; precise: boolean } | null {
  if (typeof g.lat === 'number' && typeof g.lng === 'number') {
    return { coord: [g.lat, g.lng], precise: true }
  }
  const town = TOWN_COORDS[g.location]
  if (!town) return null
  const [dLat, dLng] = hashOffset(g.id)
  return { coord: [town[0] + dLat, town[1] + dLng], precise: false }
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string)
  )
}

interface GemachMapProps {
  gemachs: Gemach[]
  theme?: MapTheme
}

function iconForCategory(category: string, precise: boolean) {
  const color = CATEGORY_ACCENT_COLORS[category] || '#1E3A64'
  if (precise) {
    return L.divIcon({
      html: `<div style="width:24px;height:24px;border-radius:50% 50% 50% 0;background:${color};border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.3);transform:rotate(-45deg);"></div>`,
      className: 'gemach-pin',
      iconSize: [24, 24],
      iconAnchor: [12, 22],
      popupAnchor: [0, -20],
    })
  }
  return L.divIcon({
    html: `<div style="width:20px;height:20px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.22);opacity:.85;"></div>`,
    className: 'gemach-pin-approx',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
  })
}

function popupPalette(theme: MapTheme) {
  if (theme === 'dark') {
    return {
      title: '#F8FAFC',
      text: '#CBD5E1',
      muted: '#94A3B8',
      chipBgOpacity: '22',
      popupClassName: 'gemach-popup gemach-popup-dark',
      clusterBackground: '#0F172A',
      clusterShadow: 'rgba(15,23,42,.45)',
      clusterBorder: 'rgba(255,255,255,.72)',
    }
  }

  return {
    title: '#1E3A64',
    text: '#64748B',
    muted: '#94A3B8',
    chipBgOpacity: '15',
    popupClassName: 'gemach-popup',
    clusterBackground: '#1E3A64',
    clusterShadow: 'rgba(30,58,100,.35)',
    clusterBorder: '#fff',
  }
}

function MarkersLayer({ gemachs, theme = 'light' }: GemachMapProps) {
  const map = useMap()

  useEffect(() => {
    const palette = popupPalette(theme)
    const cluster = (L as unknown as {
      markerClusterGroup: (opts: Record<string, unknown>) => L.LayerGroup
    }).markerClusterGroup({
      maxClusterRadius: 50,
      showCoverageOnHover: false,
      chunkedLoading: true,
      spiderfyOnMaxZoom: true,
      iconCreateFunction: (c: { getChildCount: () => number }) => {
        const n = c.getChildCount()
        const size = n < 10 ? 34 : n < 25 ? 40 : n < 50 ? 46 : 52
        return L.divIcon({
          html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${palette.clusterBackground};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-family:system-ui,-apple-system,sans-serif;font-size:${size < 40 ? 13 : 15}px;box-shadow:0 3px 10px ${palette.clusterShadow};border:3px solid ${palette.clusterBorder};">${n}</div>`,
          className: 'gemach-cluster',
          iconSize: [size, size],
        })
      },
    })

    for (const g of gemachs) {
      const r = resolveCoord(g)
      if (!r) continue
      const icon = iconForCategory(g.category, r.precise)
      const marker = L.marker(r.coord, { icon })
      const emoji = getCategoryEmoji(g.category)
      const accent = CATEGORY_ACCENT_COLORS[g.category] || '#1E3A64'
      const checkmark = g.operator_confirmed
        ? '<span style="display:inline-block;background:#0ea5e9;color:#fff;font-size:10px;padding:1px 6px;border-radius:999px;margin-left:6px;font-weight:600;letter-spacing:.04em;">VERIFIED</span>'
        : ''
      const approxNote = r.precise
        ? ''
        : `<div style="color:${palette.muted};font-size:11px;margin-top:6px;font-style:italic;">Approximate location</div>`
      const detailsLink = g.slug
        ? `<a href="/g/${g.slug}" style="display:inline-flex;align-items:center;gap:4px;color:${accent};font-weight:600;font-size:13px;text-decoration:none;border-bottom:1px solid ${accent}44;">View details →</a>`
        : ''
      marker.bindPopup(
        `<div style="min-width:220px;font-family:system-ui,-apple-system,sans-serif;padding:2px 0;">
          <div style="display:inline-flex;align-items:center;gap:4px;padding:1px 8px;border-radius:6px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;background:${accent}${palette.chipBgOpacity};color:${accent};margin-bottom:6px;">
            <span style="text-transform:none;">${emoji}</span>${escapeHtml(g.category)}
          </div>
          <div style="font-weight:700;color:${palette.title};font-size:15px;margin-bottom:4px;line-height:1.25;">
            ${escapeHtml(g.name)}${checkmark}
          </div>
          <div style="color:${palette.text};font-size:12px;margin-bottom:10px;">${escapeHtml(g.location)}</div>
          ${detailsLink}
          ${approxNote}
        </div>`,
        { className: palette.popupClassName, closeButton: true, maxWidth: 300 }
      )
      cluster.addLayer(marker)
    }

    map.addLayer(cluster)

    return () => {
      map.removeLayer(cluster)
    }
  }, [map, gemachs, theme])

  return null
}

function NearMeButton({ theme }: { theme: MapTheme }) {
  const map = useMap()
  const [state, setState] = useState<'idle' | 'locating' | 'active' | 'error'>('idle')
  const markerRef = useRef<L.CircleMarker | null>(null)

  function clearMarker() {
    if (markerRef.current) {
      map.removeLayer(markerRef.current)
      markerRef.current = null
    }
  }

  function handleClick() {
    if (state === 'active') {
      clearMarker()
      setState('idle')
      return
    }
    if (!navigator.geolocation) {
      setState('error')
      setTimeout(() => setState('idle'), 2500)
      return
    }
    setState('locating')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const ll: [number, number] = [pos.coords.latitude, pos.coords.longitude]
        map.flyTo(ll, 14, { duration: 0.8 })
        clearMarker()
        const m = L.circleMarker(ll, {
          radius: 8,
          color: '#0ea5e9',
          fillColor: '#0ea5e9',
          fillOpacity: 0.9,
          weight: 3,
        })
          .addTo(map)
          .bindTooltip('You', { permanent: true, direction: 'top', offset: [0, -10] })
        markerRef.current = m
        setState('active')
      },
      () => {
        setState('error')
        setTimeout(() => setState('idle'), 2500)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    )
  }

  useEffect(() => () => clearMarker(), [])  // eslint-disable-line react-hooks/exhaustive-deps

  const label =
    state === 'locating'
      ? 'Locating...'
      : state === 'error'
      ? 'Location blocked'
      : state === 'active'
      ? 'Clear'
      : 'Near me'

  return (
    <button
      onClick={handleClick}
      className={`absolute top-3 right-3 z-[400] inline-flex items-center gap-1.5 px-3 py-2 rounded-lg shadow-md border text-xs font-semibold transition-colors ${
        state === 'active'
          ? 'bg-sky-500 text-white border-sky-600 hover:bg-sky-600'
          : theme === 'dark'
            ? 'bg-slate-950/80 text-white border-white/10 hover:bg-slate-900 active:bg-slate-950'
            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 active:bg-slate-100'
      }`}
      type="button"
      aria-label={state === 'active' ? 'Clear my location marker' : 'Center map on my location'}
    >
      {state === 'active' ? (
        <XIcon className="w-3.5 h-3.5" />
      ) : (
        <Navigation className={`w-3.5 h-3.5 ${state === 'locating' ? 'animate-pulse' : ''}`} />
      )}
      {label}
    </button>
  )
}

function CategoryChips({
  selected,
  onSelect,
  counts,
  theme,
}: {
  selected: string | null
  onSelect: (c: string | null) => void
  counts: Map<string, number>
  theme: MapTheme
}) {
  return (
    <div className="absolute top-3 left-3 right-[110px] sm:right-auto sm:max-w-[calc(100%-140px)] z-[400] overflow-x-auto scrollbar-hide">
      <div className="flex items-center gap-1.5 pb-1">
        <button
          onClick={() => onSelect(null)}
          className={`shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm border transition-colors ${
            selected === null
              ? theme === 'dark'
                ? 'bg-slate-950/90 text-white border-white/10'
                : 'bg-navy text-white border-navy'
              : theme === 'dark'
                ? 'bg-slate-950/80 text-white/80 border-white/10 hover:bg-slate-900'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          All
        </button>
        {CATEGORIES.map((c) => {
          const count = counts.get(c.name) || 0
          if (count === 0) return null
          const active = selected === c.name
          const accent = CATEGORY_ACCENT_COLORS[c.name]
          return (
            <button
              key={c.name}
              onClick={() => onSelect(active ? null : c.name)}
              className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm border transition-colors ${
                active
                  ? 'text-white border-transparent'
                  : theme === 'dark'
                    ? 'bg-slate-950/80 text-white/80 border-white/10 hover:bg-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              style={active ? { background: accent } : undefined}
              aria-pressed={active}
            >
              <span className="not-italic">{c.emoji}</span>
              <span className="hidden sm:inline">{c.name}</span>
              <span className={`text-[10px] ${active ? 'text-white/80' : 'text-slate-400'} tabular-nums`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function GemachMap({ gemachs, theme = 'light' }: GemachMapProps) {
  const [category, setCategory] = useState<string | null>(null)
  const tileUrl =
    theme === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'

  const counts = useMemo(() => {
    const m = new Map<string, number>()
    for (const g of gemachs) m.set(g.category, (m.get(g.category) || 0) + 1)
    return m
  }, [gemachs])

  const filtered = useMemo(
    () => (category ? gemachs.filter((g) => g.category === category) : gemachs),
    [gemachs, category]
  )

  return (
    <MapContainer
      className={theme === 'dark' ? 'gemach-map gemach-map-dark' : 'gemach-map'}
      center={[40.97, -74.03]}
      zoom={11}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url={tileUrl}
        subdomains="abcd"
        maxZoom={20}
      />
      <MarkersLayer gemachs={filtered} theme={theme} />
      <CategoryChips selected={category} onSelect={setCategory} counts={counts} theme={theme} />
      <NearMeButton theme={theme} />
    </MapContainer>
  )
}
