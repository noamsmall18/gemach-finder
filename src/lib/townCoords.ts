export const TOWN_COORDS: Record<string, [number, number]> = {
  'Teaneck': [40.8976, -74.0160],
  'Bergenfield': [40.9276, -73.9976],
  'Englewood': [40.8926, -73.9726],
  'Fair Lawn': [40.9404, -74.1318],
  'Hackensack': [40.8859, -74.0435],
  'Passaic': [40.8568, -74.1285],
  'Clifton': [40.8584, -74.1638],
  'Paramus': [40.9445, -74.0754],
  'New Milford': [40.9353, -74.0182],
  'Bergen County-wide': [40.9595, -74.0738],
  'Teaneck & Bergenfield': [40.9126, -74.0068],
  'Spring Valley, NY': [41.1134, -74.0443],
  'Monsey, NY': [41.1126, -74.0685],
}

export function coordsFor(location: string): [number, number] | null {
  return TOWN_COORDS[location] || null
}
