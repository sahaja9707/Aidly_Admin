export type Role = 'govt' | 'ngo' | 'super'
export type Status = 'pending' | 'approved' | 'rejected'
export type AlertType = 'disaster' | 'health' | 'notice'
export type TargetScope = 'all' | 'volunteers' | 'govt_volunteers'
export type SubscriptionTier = 'profit' | 'nonprofit'

export interface Volunteer {
    id: string
    full_name: string
    email: string
    rating_avg: number
    total_calls: number
    govt_certified: boolean
    ngo_certified: boolean
    skills: string[]
    crisis_tags: string[]
    duty_mode: boolean
    available_now: boolean
    ngo_name?: string
}

export interface NGO {
    id: string
    name: string
    registration_number: string
    contact_email: string
    contact_phone: string
    verified_badge: boolean
    darpan_api_verified: boolean
    is_disabled: boolean
    verified_by_admin: boolean
    subscription_tier: SubscriptionTier
    volunteer_count: number
    created_at: string
}

export interface AdminUser {
    id: string
    full_name: string
    email: string
    role: Role
    org_name: string
    is_suspended: boolean
    is_active: boolean
    created_at: string
}

export interface AdminRegistration {
    id: string
    full_name: string
    email: string
    requested_role: 'govt_admin' | 'ngo_admin'
    org_name: string
    status: Status
    created_at: string
}

export interface Alert {
    id: string
    title: string
    description: string
    alert_type: AlertType
    issued_by: string
    is_active: boolean
    official_url?: string
    target_scope: TargetScope
    created_at: string
    expires_at: string
}

export interface Announcement {
    id: string
    title: string
    content: string
    is_active: boolean
    created_at: string
}

export interface AuditLog {
    id: string
    admin_name: string
    action_type: string
    target: string
    metadata: string
    created_at: string
}

// ── Mock Volunteers ────────────────────────────────────────────────────────────
export const mockVolunteers: Volunteer[] = [
    { id: 'v1', full_name: 'Arjun Sharma', email: 'arjun@example.com', rating_avg: 4.8, total_calls: 142, govt_certified: true, ngo_certified: true, skills: ['First Aid', 'Rescue'], crisis_tags: ['flood', 'earthquake'], duty_mode: true, available_now: true, ngo_name: 'HelpIndia NGO' },
    { id: 'v2', full_name: 'Priya Patel', email: 'priya@example.com', rating_avg: 4.6, total_calls: 98, govt_certified: true, ngo_certified: false, skills: ['Medical', 'Counseling'], crisis_tags: ['drought', 'fire'], duty_mode: true, available_now: false, ngo_name: 'NGO Relief Fund' },
    { id: 'v3', full_name: 'Ravi Kumar', email: 'ravi@example.com', rating_avg: 4.5, total_calls: 87, govt_certified: false, ngo_certified: true, skills: ['Logistics', 'Transport'], crisis_tags: ['flood'], duty_mode: false, available_now: true, ngo_name: 'HelpIndia NGO' },
    { id: 'v4', full_name: 'Sneha Joshi', email: 'sneha@example.com', rating_avg: 4.3, total_calls: 65, govt_certified: true, ngo_certified: true, skills: ['Communication', 'Tech'], crisis_tags: ['cyclone', 'earthquake'], duty_mode: true, available_now: true, ngo_name: 'CareFirst' },
    { id: 'v5', full_name: 'Vikram Singh', email: 'vikram@example.com', rating_avg: 2.8, total_calls: 45, govt_certified: true, ngo_certified: false, skills: ['Security'], crisis_tags: ['riot'], duty_mode: false, available_now: false, ngo_name: 'CareFirst' },
    { id: 'v6', full_name: 'Deepa Nair', email: 'deepa@example.com', rating_avg: 4.9, total_calls: 201, govt_certified: true, ngo_certified: true, skills: ['Medical', 'Rescue', 'Counseling'], crisis_tags: ['flood', 'earthquake', 'drought'], duty_mode: true, available_now: true, ngo_name: 'HelpIndia NGO' },
    { id: 'v7', full_name: 'Rohit Gupta', email: 'rohit@example.com', rating_avg: 3.2, total_calls: 22, govt_certified: false, ngo_certified: true, skills: ['Logistics'], crisis_tags: ['fire'], duty_mode: false, available_now: true, ngo_name: 'NGO Relief Fund' },
    { id: 'v8', full_name: 'Kavitha Menon', email: 'kavitha@example.com', rating_avg: 4.7, total_calls: 156, govt_certified: true, ngo_certified: true, skills: ['Medical', 'First Aid'], crisis_tags: ['cyclone', 'flood'], duty_mode: true, available_now: false, ngo_name: 'CareFirst' },
    { id: 'v9', full_name: 'Anil Verma', email: 'anil@example.com', rating_avg: 1.9, total_calls: 78, govt_certified: false, ngo_certified: false, skills: ['Transport'], crisis_tags: ['flood'], duty_mode: false, available_now: false, ngo_name: 'HelpIndia NGO' },
    { id: 'v10', full_name: 'Lakshmi Rao', email: 'lakshmi@example.com', rating_avg: 4.4, total_calls: 112, govt_certified: true, ngo_certified: true, skills: ['Rescue', 'First Aid'], crisis_tags: ['earthquake', 'fire'], duty_mode: true, available_now: true, ngo_name: 'NGO Relief Fund' },
]

// ── Mock NGOs ──────────────────────────────────────────────────────────────────
export const mockNGOs: NGO[] = [
    { id: 'n1', name: 'HelpIndia NGO', registration_number: 'NGO-2019-HIN-001', contact_email: 'contact@helpindia.org', contact_phone: '+91-9800000001', verified_badge: true, darpan_api_verified: true, is_disabled: false, verified_by_admin: true, subscription_tier: 'nonprofit', volunteer_count: 48, created_at: '2024-01-15' },
    { id: 'n2', name: 'NGO Relief Fund', registration_number: 'NGO-2020-NRF-002', contact_email: 'info@relieffund.org', contact_phone: '+91-9800000002', verified_badge: true, darpan_api_verified: false, is_disabled: false, verified_by_admin: true, subscription_tier: 'profit', volunteer_count: 32, created_at: '2024-03-20' },
    { id: 'n3', name: 'CareFirst', registration_number: 'NGO-2021-CF-003', contact_email: 'hello@carefirst.in', contact_phone: '+91-9800000003', verified_badge: false, darpan_api_verified: false, is_disabled: false, verified_by_admin: false, subscription_tier: 'nonprofit', volunteer_count: 21, created_at: '2024-06-01' },
    { id: 'n4', name: 'DisasterGuard', registration_number: 'NGO-2022-DG-004', contact_email: 'ops@disasterguard.org', contact_phone: '+91-9800000004', verified_badge: true, darpan_api_verified: true, is_disabled: true, verified_by_admin: true, subscription_tier: 'profit', volunteer_count: 0, created_at: '2024-08-10' },
]

// ── Mock Registrations ─────────────────────────────────────────────────────────
export const mockRegistrations: AdminRegistration[] = [
    { id: 'r1', full_name: 'Suresh Pillai', email: 'suresh@kerala.gov.in', requested_role: 'govt_admin', org_name: 'Kerala Disaster Management Authority', status: 'pending', created_at: '2026-02-20' },
    { id: 'r2', full_name: 'Meena Kumari', email: 'meena@helpindia.org', requested_role: 'ngo_admin', org_name: 'HelpIndia NGO', status: 'pending', created_at: '2026-02-21' },
    { id: 'r3', full_name: 'Ramesh Chandra', email: 'ramesh@odisha.gov.in', requested_role: 'govt_admin', org_name: 'Odisha SDMA', status: 'approved', created_at: '2026-02-10' },
    { id: 'r4', full_name: 'Preethi Soman', email: 'preethi@carefirst.in', requested_role: 'ngo_admin', org_name: 'CareFirst', status: 'rejected', created_at: '2026-02-05' },
]

// ── Mock Alerts ────────────────────────────────────────────────────────────────
export const mockAlerts: Alert[] = [
    { id: 'a1', title: 'Cyclone Remal Alert — Coastal Regions', description: 'Severe cyclonic storm approaching West Bengal and Odisha coasts. Evacuation ordered.', alert_type: 'disaster', issued_by: 'Govt Admin', is_active: true, official_url: 'https://ndma.gov.in/alerts/2024-cyclone-remal', target_scope: 'all', created_at: '2026-02-22', expires_at: '2026-02-25' },
    { id: 'a2', title: 'Flood Warning — Bihar Districts', description: 'IMD has issued flood alert for Muzaffarpur, Sitamarhi and surrounding districts.', alert_type: 'disaster', issued_by: 'Govt Admin', is_active: true, official_url: 'https://ndma.gov.in/floods/bihar-2024', target_scope: 'volunteers', created_at: '2026-02-20', expires_at: '2026-02-28' },
    { id: 'a3', title: 'Heatwave Health Advisory', description: 'Extreme heat conditions expected in Rajasthan. Vulnerable populations urged to stay indoors.', alert_type: 'health', issued_by: 'Govt Admin', is_active: true, official_url: '', target_scope: 'all', created_at: '2026-02-18', expires_at: '2026-02-24' },
    { id: 'a4', title: 'Emergency Volunteer Activation', description: 'All certified government volunteers requested to report availability immediately.', alert_type: 'notice', issued_by: 'Govt Admin', is_active: false, official_url: '', target_scope: 'govt_volunteers', created_at: '2026-02-10', expires_at: '2026-02-15' },
]

// ── Mock Announcements ─────────────────────────────────────────────────────────
export const mockAnnouncements: Announcement[] = [
    { id: 'an1', title: 'New Volunteer Certification Drive', content: 'The government is launching a state-wide volunteer certification drive in March 2026. All interested volunteers should apply by February 28.', is_active: true, created_at: '2026-02-20' },
    { id: 'an2', title: 'Disaster Response Protocol Update', content: 'Updated disaster response protocols now available. All certified volunteers must review the new handbook before deployment.', is_active: true, created_at: '2026-02-15' },
    { id: 'an3', title: 'Annual Review Complete', content: 'The annual volunteer performance review for 2025 has been completed. Results are now available in the volunteer portal.', is_active: false, created_at: '2026-01-30' },
]

// ── Mock Admin Users ───────────────────────────────────────────────────────────
export const mockAdminUsers: AdminUser[] = [
    { id: 'u1', full_name: 'Raj Mohan', email: 'raj@kerala.gov.in', role: 'govt', org_name: 'Kerala SDMA', is_suspended: false, is_active: true, created_at: '2026-01-01' },
    { id: 'u2', full_name: 'Anita Roy', email: 'anita@helpindia.org', role: 'ngo', org_name: 'HelpIndia NGO', is_suspended: false, is_active: true, created_at: '2026-01-15' },
    { id: 'u3', full_name: 'Venkat Reddy', email: 'venkat@ap.gov.in', role: 'govt', org_name: 'Andhra Pradesh SDMA', is_suspended: true, is_active: false, created_at: '2025-12-01' },
    { id: 'u4', full_name: 'Fatima Sheikh', email: 'fatima@ngorelief.org', role: 'ngo', org_name: 'NGO Relief Fund', is_suspended: false, is_active: true, created_at: '2026-02-01' },
]

// ── Mock Audit Logs ────────────────────────────────────────────────────────────
export const mockAuditLogs: AuditLog[] = [
    { id: 'al1', admin_name: 'Super Admin', action_type: 'approve_registration', target: 'Ramesh Chandra (Odisha SDMA)', metadata: 'role: govt_admin', created_at: '2026-02-10 09:15' },
    { id: 'al2', admin_name: 'Raj Mohan', action_type: 'revoke_gov_tag', target: 'Vikram Singh', metadata: 'rating: 2.8, calls: 45', created_at: '2026-02-12 14:30' },
    { id: 'al3', admin_name: 'Super Admin', action_type: 'add_ngo', target: 'CareFirst', metadata: 'tier: nonprofit, darpan: false', created_at: '2026-02-14 11:00' },
    { id: 'al4', admin_name: 'Super Admin', action_type: 'suspend_user', target: 'Venkat Reddy', metadata: 'reason: misconduct', created_at: '2026-02-16 16:45' },
    { id: 'al5', admin_name: 'Anita Roy', action_type: 'approve_volunteer', target: 'Rohit Gupta', metadata: 'ngo: HelpIndia NGO', created_at: '2026-02-18 10:20' },
    { id: 'al6', admin_name: 'Raj Mohan', action_type: 'create_alert', target: 'Cyclone Remal Alert', metadata: 'type: disaster, scope: all', created_at: '2026-02-22 08:00' },
    { id: 'al7', admin_name: 'Super Admin', action_type: 'disable_ngo', target: 'DisasterGuard', metadata: 'reason: compliance failure', created_at: '2026-02-19 13:30' },
]

// ── Mock Join Requests ─────────────────────────────────────────────────────────
export interface JoinRequest {
    id: string
    volunteer_name: string
    email: string
    skills: string[]
    rating_avg: number
    total_calls: number
    requested_at: string
    status: Status
}

export const mockJoinRequests: JoinRequest[] = [
    { id: 'jr1', volunteer_name: 'Pooja Iyer', email: 'pooja@example.com', skills: ['Medical', 'First Aid'], rating_avg: 4.2, total_calls: 18, requested_at: '2026-02-21', status: 'pending' },
    { id: 'jr2', volunteer_name: 'Kiran Bhat', email: 'kiran@example.com', skills: ['Rescue', 'Logistics'], rating_avg: 3.9, total_calls: 7, requested_at: '2026-02-22', status: 'pending' },
    { id: 'jr3', volunteer_name: 'Maya Das', email: 'maya@example.com', skills: ['Counseling'], rating_avg: 4.5, total_calls: 32, requested_at: '2026-02-20', status: 'approved' },
    { id: 'jr4', volunteer_name: 'Sanjay Verma', email: 'sanjay@example.com', skills: ['Logistics', 'Security'], rating_avg: 3.8, total_calls: 14, requested_at: '2026-02-18', status: 'approved' },
    { id: 'jr5', volunteer_name: 'Nandita Roy', email: 'nandita@example.com', skills: ['Medical'], rating_avg: 2.1, total_calls: 10, requested_at: '2026-02-15', status: 'rejected' },
]

// ── Mock Volunteer Feedback ────────────────────────────────────────────────────
export interface VolunteerFeedback {
    id: string
    volunteer_id: string
    rated_by: string       // name of caller who left feedback
    rating: number         // 1–5
    feedback: string
    call_type: string
    created_at: string
}

export const mockFeedbacks: VolunteerFeedback[] = [
    // Arjun Sharma (v1) — high rated
    { id: 'f1', volunteer_id: 'v1', rated_by: 'Riya Kapoor', rating: 5, feedback: 'Arjun was incredibly calm and helpful during the flood evacuation. Arrived quickly and coordinated well with the local team.', call_type: 'Disaster Response', created_at: '2026-02-18' },
    { id: 'f2', volunteer_id: 'v1', rated_by: 'Mohit Sharma', rating: 5, feedback: 'Outstanding first aid skills. He stayed on the line until ambulance arrived. Extremely professional.', call_type: 'Medical Emergency', created_at: '2026-02-10' },
    { id: 'f3', volunteer_id: 'v1', rated_by: 'Sara Thomas', rating: 4, feedback: 'Very responsive and knowledgeable. Minor delay in arrival but the quality of help was excellent.', call_type: 'Rescue', created_at: '2026-01-28' },
    { id: 'f4', volunteer_id: 'v1', rated_by: 'Dilip Jain', rating: 5, feedback: 'Provided excellent rescue assistance during the earthquake. Would definitely call again.', call_type: 'Earthquake Relief', created_at: '2026-01-15' },
    // Priya Patel (v2) — high rated
    { id: 'f5', volunteer_id: 'v2', rated_by: 'Ananya Gupta', rating: 5, feedback: "Priya's counseling helped me cope after the disaster. Compassionate and very professional.", call_type: 'Psychological Support', created_at: '2026-02-20' },
    { id: 'f6', volunteer_id: 'v2', rated_by: 'Rahul Mehta', rating: 4, feedback: 'Very helpful medical advice. Knew exactly what to do in the situation.', call_type: 'Medical Emergency', created_at: '2026-02-12' },
    { id: 'f7', volunteer_id: 'v2', rated_by: 'Sunita Chari', rating: 5, feedback: 'Exceptional care and immediate response. She is a gem of a volunteer.', call_type: 'Medical Emergency', created_at: '2026-01-30' },
    // Deepa Nair (v6) — top rated
    { id: 'f8', volunteer_id: 'v6', rated_by: 'Vinod Kumar', rating: 5, feedback: 'Deepa is the best volunteer I have ever seen. Handled multiple patients simultaneously with calm precision.', call_type: 'Disaster Response', created_at: '2026-02-22' },
    { id: 'f9', volunteer_id: 'v6', rated_by: 'Lalita Menon', rating: 5, feedback: "Her medical training really showed. She saved my neighbour's life during the cyclone.", call_type: 'Medical Emergency', created_at: '2026-02-14' },
    { id: 'f10', volunteer_id: 'v6', rated_by: 'George Joseph', rating: 5, feedback: 'Amazing counselor and rescue expert. Deeply committed to the cause.', call_type: 'Psychological Support', created_at: '2026-01-25' },
    // Vikram Singh (v5) — low rated
    { id: 'f11', volunteer_id: 'v5', rated_by: 'Pradeep Nair', rating: 2, feedback: 'Late to arrive and seemed unprepared for the situation. Needs more training.', call_type: 'Security', created_at: '2026-02-05' },
    { id: 'f12', volunteer_id: 'v5', rated_by: 'Asha Reddy', rating: 3, feedback: 'Showed up but was not confident handling the crowd. Expected more.', call_type: 'Security', created_at: '2026-01-20' },
    { id: 'f13', volunteer_id: 'v5', rated_by: 'Mohan Lal', rating: 3, feedback: 'Average performance. Did the minimum required. Communication was poor.', call_type: 'Security', created_at: '2026-01-10' },
    // Anil Verma (v9) — very low rated
    { id: 'f14', volunteer_id: 'v9', rated_by: 'Bindu Nair', rating: 2, feedback: 'Very disappointing. Did not show up on time and gave incorrect transportation directions.', call_type: 'Logistics', created_at: '2026-02-19' },
    { id: 'f15', volunteer_id: 'v9', rated_by: 'Ramesh Kumar', rating: 2, feedback: 'Was not equipped to handle the task. Seemed confused throughout.', call_type: 'Logistics', created_at: '2026-02-06' },
    { id: 'f16', volunteer_id: 'v9', rated_by: 'Supriya Das', rating: 2, feedback: 'Poor communication and disorganised. Would not recommend.', call_type: 'Logistics', created_at: '2026-01-22' },
    // Kavitha Menon (v8)
    { id: 'f17', volunteer_id: 'v8', rated_by: 'Thomas Kurian', rating: 5, feedback: "Kavitha's first aid was impeccable. Super professional and calm under pressure.", call_type: 'Medical Emergency', created_at: '2026-02-16' },
    { id: 'f18', volunteer_id: 'v8', rated_by: 'Meera Pillai', rating: 5, feedback: 'Brilliant during the cyclone response. Organised the injured systematically.', call_type: 'Disaster Response', created_at: '2026-01-28' },
    { id: 'f19', volunteer_id: 'v8', rated_by: 'Sujit Dev', rating: 4, feedback: 'Very capable volunteer. A bit quiet but highly effective.', call_type: 'Medical Emergency', created_at: '2026-01-12' },
    // Lakshmi Rao (v10)
    { id: 'f20', volunteer_id: 'v10', rated_by: 'Kavya Bhat', rating: 5, feedback: 'Excellent rescue coordination. Lakshmi made sure everyone was safe before leaving.', call_type: 'Rescue', created_at: '2026-02-17' },
    { id: 'f21', volunteer_id: 'v10', rated_by: 'Naresh Reddy', rating: 4, feedback: 'Good first aid response. Arrived quickly and handled the situation well.', call_type: 'Medical Emergency', created_at: '2026-02-03' },
]
