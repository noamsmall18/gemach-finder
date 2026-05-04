const DARK_ROUTE_BY_LIGHT_PATH: Record<string, string> = {
  '/': '/v2',
  '/map': '/v2/map',
}

const LIGHT_ROUTE_BY_DARK_PATH: Record<string, string> = {
  '/v2': '/',
  '/v2/map': '/map',
}

export function toDarkPath(pathname: string): string | null {
  return DARK_ROUTE_BY_LIGHT_PATH[pathname] || null
}

export function toLightPath(pathname: string): string | null {
  return LIGHT_ROUTE_BY_DARK_PATH[pathname] || null
}
