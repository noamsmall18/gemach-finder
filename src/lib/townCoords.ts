export const TOWN_COORDS: Record<string, [number, number]> = {
  'Teaneck': [40.8976, -74.0160],
  'Bergenfield': [40.9276, -73.9976],
  'Englewood': [40.8926, -73.9726],
  'Fair Lawn': [40.9404, -74.1318],
  'Hackensack': [40.8859, -74.0435],
  'Paramus': [40.9445, -74.0754],
  'New Milford': [40.9353, -74.0182],
  'Bergen County': [40.9595, -74.0738],
  'Bergen County-wide': [40.9595, -74.0738],
  'Teaneck & Bergenfield': [40.9126, -74.0068],
  'Jersey City, NJ': [40.7178, -74.0431],
  'Westchester': [41.122, -73.7949],
}

export function coordsFor(location: string): [number, number] | null {
  return TOWN_COORDS[location] || null
}
