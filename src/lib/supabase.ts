import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
)

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type Role = 'super_admin' | 'govt_admin' | 'ngo_admin' | 'volunteer' | 'super' | 'govt' | 'ngo'
export type SubscriptionTier = 'nonprofit' | 'profit'
export type AlertType = 'disaster' | 'health' | 'notice'
export type RegistrationStatus = 'pending' | 'approved' | 'rejected'
export type RequestedRole = 'govt_admin' | 'ngo_admin'
export type MembershipStatus = 'pending' | 'approved' | 'rejected'

export interface DBUser {
  id: string
  full_name: string
  email: string
  phone?: string
  role: Role
  org_name?: string
  is_verified: boolean
  is_active: boolean
  is_suspended: boolean
  is_visually_impaired?: boolean
  preferred_language?: string
  location_lat?: number
  location_lng?: number
  rating_avg?: number
  total_calls?: number
  created_at: string
  updated_at?: string
}

export interface VolunteerProfile {
  user_id: string
  skills: string[]
  crisis_tags: string[]
  badge?: string
  available_now: boolean
  duty_mode: boolean
  languages_known?: string[]
  female_only_filter?: boolean
  preferred_time_limit?: number
  translation_enabled?: boolean
  govt_certified: boolean
  ngo_certified: boolean
  created_at: string
  // joined from users
  full_name?: string
  email?: string
  org_name?: string
  rating_avg?: number
  total_calls?: number
  is_suspended?: boolean
  is_active?: boolean
}

export interface NGO {
  id: string
  name: string
  registration_number: string
  contact_email: string
  contact_phone: string
  description?: string
  area_of_work?: string
  verified_badge: boolean
  verified_by_admin: boolean
  verified_by_super_admin: boolean
  darpan_api_verified: boolean
  is_active: boolean
  is_disabled: boolean
  subscription_tier: SubscriptionTier
  created_at: string
}

export interface Alert {
  id: string
  title: string
  description: string
  alert_type: AlertType
  issued_by?: string
  official_url?: string
  is_active: boolean
  expires_at: string
  created_at: string
}

export interface Rating {
  id: string
  call_id?: string
  rated_by: string
  rated_to: string
  rating: number
  feedback?: string
  call_type_label?: string
  created_at: string
}

export interface AdminRegistration {
  id: string
  full_name: string
  email: string
  requested_role: RequestedRole
  org_name: string
  status: RegistrationStatus
  created_at: string
}

export interface AuditLog {
  id: string
  admin_id: string
  action_type: string
  target_type?: string
  target_id?: string
  metadata?: Record<string, unknown>
  created_at: string
}

export interface Announcement {
  id: string
  title: string
  content: string
  is_active: boolean
  created_at: string
}

export interface NgoMembership {
  id: string
  user_id: string
  ngo_id: string
  role?: string
  status: MembershipStatus
  created_at: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Auth
// ─────────────────────────────────────────────────────────────────────────────

export const signIn = (email: string, password: string) =>
  supabase.auth.signInWithPassword({ email, password })

export const signOut = () =>
  supabase.auth.signOut()

export const getSession = () =>
  supabase.auth.getSession()

export const updatePassword = (newPassword: string) =>
  supabase.auth.updateUser({ password: newPassword })

export const signUp = (email: string, password: string) =>
  supabase.auth.signUp({ email, password })

// ─────────────────────────────────────────────────────────────────────────────
// Users
// ─────────────────────────────────────────────────────────────────────────────

export const getAllUsers = () =>
  supabase.from('users').select('*').order('created_at', { ascending: false })

export const getUserById = (id: string) =>
  supabase.from('users').select('*').eq('id', id).single()

export const getAdminUsers = () =>
  supabase
    .from('users')
    .select('*')
    .in('role', ['govt', 'ngo', 'govt_admin', 'ngo_admin'])
    .order('created_at', { ascending: false })

export const suspendUser = (id: string) =>
  supabase.from('users').update({ is_suspended: true }).eq('id', id)

export const unsuspendUser = (id: string) =>
  supabase.from('users').update({ is_suspended: false }).eq('id', id)

export const setUserActive = (id: string, is_active: boolean) =>
  supabase.from('users').update({ is_active }).eq('id', id)

// ─────────────────────────────────────────────────────────────────────────────
// Volunteer Profiles
// ─────────────────────────────────────────────────────────────────────────────

/** All volunteers with user info (rating_avg, total_calls on users table) */
export const getAllVolunteers = () =>
  supabase
    .from('volunteer_profiles')
    .select('*, users!inner(full_name, email, org_name, rating_avg, total_calls, is_suspended, is_active)')

/** Govt-certified volunteers */
export const getGovtVolunteers = () =>
  supabase
    .from('volunteer_profiles')
    .select('*, users!inner(full_name, email, org_name, rating_avg, total_calls, is_suspended, is_active)')
    .eq('govt_certified', true)

/**
 * NGO-certified volunteers for a specific NGO.
 * Resolved via ngo_memberships since volunteer_profiles has no ngo_id column.
 */
export const getNgoVolunteers = (ngoId: string) =>
  supabase
    .from('ngo_memberships')
    .select('user_id, status, users!inner(full_name, email, org_name, rating_avg, total_calls, is_suspended, is_active, volunteer_profiles(skills, crisis_tags, badge, available_now, duty_mode, govt_certified, ngo_certified))')
    .eq('ngo_id', ngoId)
    .eq('status', 'approved')

export const revokeGovtCertification = (userId: string) =>
  supabase.from('volunteer_profiles').update({ govt_certified: false }).eq('user_id', userId)

export const revokeNgoCertification = (userId: string) =>
  supabase.from('volunteer_profiles').update({ ngo_certified: false }).eq('user_id', userId)

export const banVolunteer = (userId: string) =>
  supabase.from('users').update({ is_active: false, is_suspended: true }).eq('id', userId)

// ─────────────────────────────────────────────────────────────────────────────
// NGOs
// ─────────────────────────────────────────────────────────────────────────────

export const getAllNGOs = () =>
  supabase.from('ngos').select('*').order('name')

export const getNgoById = (id: string) =>
  supabase.from('ngos').select('*').eq('id', id).single()

export const createNGO = (data: Omit<NGO, 'id' | 'created_at' | 'verified_by_super_admin'>) =>
  supabase.from('ngos').insert(data).select().single()

export const toggleNgoVerified = (id: string, verified: boolean) =>
  supabase.from('ngos').update({ verified_badge: verified }).eq('id', id)

export const toggleNgoDisabled = (id: string, disabled: boolean) =>
  supabase.from('ngos').update({ is_disabled: disabled }).eq('id', id)

// ─────────────────────────────────────────────────────────────────────────────
// Alerts
// ─────────────────────────────────────────────────────────────────────────────

export const getAllAlerts = () =>
  supabase.from('alerts').select('*').order('created_at', { ascending: false })

export const getActiveAlerts = (limit = 5) =>
  supabase.from('alerts').select('*').eq('is_active', true).limit(limit).order('created_at', { ascending: false })

export const createAlert = (data: Omit<Alert, 'id' | 'created_at'>) =>
  supabase.from('alerts').insert(data).select().single()

export const toggleAlert = (id: string, is_active: boolean) =>
  supabase.from('alerts').update({ is_active }).eq('id', id)

// ─────────────────────────────────────────────────────────────────────────────
// Ratings
// ─────────────────────────────────────────────────────────────────────────────

export const getRatingsForVolunteer = (userId: string) =>
  supabase
    .from('ratings')
    .select('*, caller:rated_by(full_name)')
    .eq('rated_to', userId)
    .order('created_at', { ascending: false })

// ─────────────────────────────────────────────────────────────────────────────
// Admin Registrations
// ─────────────────────────────────────────────────────────────────────────────

export const getRegistrations = () =>
  supabase.from('admin_registrations').select('*').order('created_at', { ascending: false })

export const createRegistration = (data: Omit<AdminRegistration, 'id' | 'created_at' | 'status'>) =>
  supabase.from('admin_registrations').insert({ ...data, status: 'pending' }).select().single()

export const approveRegistration = (id: string) =>
  supabase.from('admin_registrations').update({ status: 'approved' }).eq('id', id)

export const rejectRegistration = (id: string) =>
  supabase.from('admin_registrations').update({ status: 'rejected' }).eq('id', id)

// ─────────────────────────────────────────────────────────────────────────────
// Audit Log
// ─────────────────────────────────────────────────────────────────────────────

export const getAuditLog = () =>
  supabase.from('admin_actions_log').select('*').order('created_at', { ascending: false })

export const logAction = (entry: Omit<AuditLog, 'id' | 'created_at'>) =>
  supabase.from('admin_actions_log').insert(entry)

// ─────────────────────────────────────────────────────────────────────────────
// Announcements
// ─────────────────────────────────────────────────────────────────────────────

export const getAnnouncements = () =>
  supabase.from('announcements').select('*').order('created_at', { ascending: false })

export const createAnnouncement = (data: Omit<Announcement, 'id' | 'created_at'>) =>
  supabase.from('announcements').insert(data).select().single()

export const toggleAnnouncement = (id: string, is_active: boolean) =>
  supabase.from('announcements').update({ is_active }).eq('id', id)

// ─────────────────────────────────────────────────────────────────────────────
// NGO Memberships (Join Requests)
// ─────────────────────────────────────────────────────────────────────────────

export const getMembershipsForNgo = (ngoId: string) =>
  supabase
    .from('ngo_memberships')
    .select('*, users:user_id(full_name, email)')
    .eq('ngo_id', ngoId)

export const approveMembership = (id: string) =>
  supabase.from('ngo_memberships').update({ status: 'approved' }).eq('id', id)

export const rejectMembership = (id: string) =>
  supabase.from('ngo_memberships').update({ status: 'rejected' }).eq('id', id)
