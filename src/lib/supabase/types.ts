// Shared Database shape aligned with docs/data-model/property-listings-schema.md.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type ListingStatus = 'draft' | 'published' | 'archived'

export type Database = {
  public: {
    Tables: {
      property_listings: {
        Row: {
          id: string
          owner_id: string
          title: string
          description: string | null
          address_line1: string
          city: string
          region: string | null
          postal_code: string | null
          country: string
          price: number
          status: ListingStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          title: string
          description?: string | null
          address_line1: string
          city: string
          region?: string | null
          postal_code?: string | null
          country?: string
          price: number
          status?: ListingStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          title?: string
          description?: string | null
          address_line1?: string
          city?: string
          region?: string | null
          postal_code?: string | null
          country?: string
          price?: number
          status?: ListingStatus
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
