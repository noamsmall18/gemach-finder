'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { MapContainer, TileLayer, CircleMarker, Tooltip, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import type { Gemach } from '@/lib/types'
import { TOWN_COORDS, coordsFor } from '@/lib/townCoords'
import { getCategoryEmoji } from '@/lib/constants'

interface GemachMapProps {
  gemachs: Gemach[]
}

interface TownCluster {
  town: string
  coords: [number, number]
  gemachs: Gemach[]
}

export default function GemachMap({ gemachs }: GemachMapProps) {
  const clusters = useMemo<TownCluster[]>(() => {
    const byTown: Record<string, Gemach[]> = {}
    for (const g of gemachs) {
      const coords = coordsFor(g.location)
      if (!coords) continue
      if (!byTown[g.location]) byTown[g.location] = []
      byTown[g.location].push(g)
    }
    return Object.entries(byTown)
      .map(([town, list]) => ({
        town,
        coords: TOWN_COORDS[town],
        gemachs: list,
      }))
      .sort((a, b) => b.gemachs.length - a.gemachs.length)
  }, [gemachs])

  const maxCount = clusters[0]?.gemachs.length || 1

  return (
    <MapContainer
      center={[40.93, -74.03]}
      zoom={11}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {clusters.map((c) => {
        const scale = Math.max(12, Math.min(36, 12 + (c.gemachs.length / maxCount) * 24))
        return (
          <CircleMarker
            key={c.town}
            center={c.coords}
            radius={scale}
            pathOptions={{
              color: '#1E3A64',
              fillColor: '#5E94B8',
              fillOpacity: 0.65,
              weight: 2,
            }}
          >
            <Tooltip direction="top" offset={[0, -scale]} opacity={1} permanent>
              <span className="font-semibold text-navy">
                {c.town} · {c.gemachs.length}
              </span>
            </Tooltip>
            <Popup maxHeight={260}>
              <div className="min-w-[220px]">
                <div className="font-heading text-base font-bold text-navy mb-2">
                  {c.town} <span className="text-slate-500 font-normal text-sm">({c.gemachs.length})</span>
                </div>
                <ul className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {c.gemachs.map((g) => (
                    <li key={g.id}>
                      <Link
                        href={`/?open=${g.id}`}
                        className="block text-sm text-slate-700 hover:text-navy"
                      >
                        <span className="mr-1">{getCategoryEmoji(g.category)}</span>
                        {g.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Popup>
          </CircleMarker>
        )
      })}
    </MapContainer>
  )
}
