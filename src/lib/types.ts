export interface Gemach {
  id: string
  name: string
  category: string
  description: string
  location: string
  contact_name: string | null
  contact_phone: string | null
  contact_email: string | null
  contact_website: string | null
  address: string | null
  hours: string | null
  notes: string | null
  verified: boolean
  operator_confirmed: boolean
  lat: number | null
  lng: number | null
  priority: number
  created_at: string
}

export interface Suggestion {
  gemach_name: string
  category: string
  description: string
  contact_info: string
  submitted_by: string | null
}

export interface WishlistItem {
  id: string
  name: string
  category: string
  description: string | null
  requested_by: string | null
  vote_count: number
  status: 'open' | 'fulfilled'
  created_at: string
}
