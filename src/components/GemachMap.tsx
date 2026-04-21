'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet.markercluster'
import type { Gemach } from '@/lib/types'
import { TOWN_COORDS } from '@/lib/townCoords'
import { getCategoryEmoji } from '@/lib/constants'

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
}

function MarkersLayer({ gemachs }: GemachMapProps) {
  const map = useMap()

  useEffect(() => {
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
          html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:#1E3A64;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-family:system-ui,-apple-system,sans-serif;font-size:${size < 40 ? 13 : 15}px;box-shadow:0 3px 10px rgba(30,58,100,.35);border:3px solid #fff;">${n}</div>`,
          className: 'gemach-cluster',
          iconSize: [size, size],
        })
      },
    })

    const preciseIcon = L.divIcon({
      html: `<div style="width:24px;height:24px;border-radius:50% 50% 50% 0;background:#1E3A64;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.3);transform:rotate(-45deg);"></div>`,
      className: 'gemach-pin',
      iconSize: [24, 24],
      iconAnchor: [12, 22],
      popupAnchor: [0, -20],
    })

    const approxIcon = L.divIcon({
      html: `<div style="width:22px;height:22px;border-radius:50%;background:#5E94B8;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.25);opacity:.9;"></div>`,
      className: 'gemach-pin-approx',
      iconSize: [22, 22],
      iconAnchor: [11, 11],
      popupAnchor: [0, -10],
    })

    const markers: L.Marker[] = []
    for (const g of gemachs) {
      const r = resolveCoord(g)
      if (!r) continue
      const marker = L.marker(r.coord, { icon: r.precise ? preciseIcon : approxIcon })
      const emoji = getCategoryEmoji(g.category)
      const checkmark = g.operator_confirmed
        ? '<span style="display:inline-block;background:#1E3A64;color:#fff;font-size:10px;padding:1px 6px;border-radius:999px;margin-left:6px;font-weight:600;">VERIFIED</span>'
        : ''
      const approxNote = r.precise
        ? ''
        : '<div style="color:#94a3b8;font-size:11px;margin-top:4px;font-style:italic;">Approximate location</div>'
      marker.bindPopup(
        `<div style="min-width:220px;font-family:system-ui,-apple-system,sans-serif;">
          <div style="font-weight:700;color:#1E3A64;font-size:15px;margin-bottom:4px;line-height:1.25;">
            <span style="margin-right:4px;">${emoji}</span>${escapeHtml(g.name)}${checkmark}
          </div>
          <div style="color:#64748b;font-size:12px;margin-bottom:10px;">${escapeHtml(g.location)} · ${escapeHtml(g.category)}</div>
          <a href="/?open=${g.id}" style="color:#1E3A64;font-weight:600;font-size:13px;text-decoration:underline;">View details →</a>
          ${approxNote}
        </div>`
      )
      markers.push(marker)
      cluster.addLayer(marker)
    }

    map.addLayer(cluster)

    return () => {
      map.removeLayer(cluster)
    }
  }, [map, gemachs])

  return null
}

export default function GemachMap({ gemachs }: GemachMapProps) {
  return (
    <MapContainer
      center={[40.97, -74.03]}
      zoom={11}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={20}
      />
      <MarkersLayer gemachs={gemachs} />
    </MapContainer>
  )
}
