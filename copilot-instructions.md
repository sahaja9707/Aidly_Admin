PRODUCT REQUIREMENTS DOCUMENT (Revised Scope)
Product: Aidly Admin Portal

Type: Governance Web Platform (Internal + Government + NGO SaaS Panel)

1️⃣ Product Overview

The Aidly Admin Portal is a role-based governance web platform that enables:

Government authorities to manage certified volunteers and publish official alerts

NGOs to manage their volunteer network

Super Admins (Aidly core team) to regulate the ecosystem

It integrates with the main Aidly app backend (Supabase + WebRTC).

This portal does NOT handle:

Donations

Disaster volunteer registration

Operational disaster recruitment

Those are handled externally (NGO app / Government page).

This keeps your portal clean and focused.

2️⃣ Goals

Provide structured governance to volunteer networks

Enable official disaster communication

Maintain rating-based accountability

Enable disaster-mode structured alert system

Control partner verification & ecosystem trust

Notice:
This is now a governance + verification layer. That’s powerful.

3️⃣ User Roles & Capabilities
🔹 ROLE SELECTION PAGE

Landing:
“Register As”

Government Admin

NGO Admin

Super Admin

Each role has separate onboarding + approval flow.

🏛 GOVERNMENT ADMIN PANEL

Purpose
Used by authorized government officials.
Manages certified volunteers and official advisories.

1️⃣ Volunteer Governance

View all government-certified volunteers

Remove government tag if:

if rating_avg < 3 AND total_calls > 10
→ allow revoke_gov_tag

Badge system:

“Gov Certified”

This is a credibility layer — not volunteer deployment control.

2️⃣ Official Notification Broadcasting

Send push notification to:

All users

Only volunteers

Only govt volunteers

Notification types:

Disaster Alert

Health Advisory

Public Notice

Integrates with:

Supabase

FCM

Web notifications

Important update:
When sending disaster alert → include official government URL
Users clicking → redirected to official government disaster page

Admin portal does NOT manage volunteer enrollment.

That’s correct architecture.

3️⃣ Government Profile Page

Contains:

About content

Official announcements

Verified badge

Needs:

content table

announcements table

verification status

🤝 NGO ADMIN PANEL

Purpose
Managed by partnered NGO.
Focus: volunteer governance only.

1️⃣ Volunteer Management

View NGO volunteers

Approve volunteer join requests

Remove NGO volunteer if:

rating < 3
total_calls > 30

Assign NGO badge

This keeps NGO accountability strong.

2️⃣ NGO Profile Page

Includes:

About section

Active campaigns (display only)

Disaster participation history

Verified badge

Important:
No donation handling inside Admin Portal.
Donation system handled inside NGO app/website directly.

This avoids compliance and financial liability risks.

3️⃣ Volunteer Recruitment Flow

Flow:

Normal Volunteer → Request to join NGO
NGO Admin → Approve / Reject

That’s it.
No financial logic here.

👑 SUPER ADMIN PANEL

Purpose
Controlled by Aidly core dev team.

This is the real power layer.

1️⃣ Approve Government & NGO Registrations

Approve / Reject registration

Assign verified badge

Validate NGO via Darpan NPO API key

Verification system:

if darpan_api_verified = true
→ allow verified_badge
2️⃣ Global User Moderation

Remove user if:

rating < 2
AND total_calls > 50

Also:

Suspend account

Disable NGO

Disable Govt Admin

3️⃣ Platform Control

Manage subscription tier (profit / nonprofit)

Monitor system analytics

View active alerts

No revenue charts for NGOs anymore.

Keep it governance-focused.

💰 BUSINESS MODELS (Updated)
1️⃣ Profit Model (White-label Lease)

NGO leases white-label version
Aidly takes percentage cut from NGO system (handled outside admin portal)

Aidly owns IP

2️⃣ Non-Profit Model

Minimal $1/month per partner
Covers TURN server infrastructure

Admin portal does NOT manage donation transactions.

🎨 DESIGN DOCUMENT (Unchanged)

Design System:

shadcn/ui

Black & White theme

Clean minimal SaaS dashboard

Layout:
Sidebar layout

Sidebar:

Dashboard

Alerts

Volunteers

Content

Settings

Top Bar:

Profile

Notifications

Role Badge

📊 Updated UI Sections
Government Dashboard

Sections:

Total Govt Volunteers

Avg Rating

Active Alerts

Disaster Mode Status

Components:

KPI Cards

DataTable (volunteers)

AlertDialog (revoke tag)

Modal Form (create alert)

NGO Dashboard

Sections:

Total Volunteers

Pending Join Requests

Active Campaigns (display only)

Components:

Volunteer Table

Approval Dialog

Basic KPI Cards

(No revenue charts.)

Super Admin Dashboard

Sections:

Total Users

Total NGOs

Total Govt Admins

Active Alerts

Components:

KPI Cards

Approval Table

Ban User Dialog

🧠 Final Architecture Philosophy (Stronger Now)

Aidly Admin Portal is:

Governance Layer

Accountability Engine

Verification System

Disaster Alert Broadcaster

Trust Framework
🚀 Tech Stack Frontend: React.js shadcn/ui TailwindCSS Backend: Supabase Supabase Auth Row Level Security Realtime subscriptions FCM for push Infrastructure: WebRTC (Agora / LiveKit) TURN server monitoring
 
 TABLES (IN THE APP AND NEEDED FOR ADMIN PORTAL)
 
TABLE NAME
- column_name (type)
- relations
- used_by_admin_feature
✅ EXISTING CORE TABLES (From Your Image)
1️⃣ roles
id (uuid, PK)

name (text)

Relations:

users.role_id → roles.id

Used by:

Role-based login

Admin access control

RLS policies

2️⃣ users
id (uuid, PK → auth.users.id)

full_name (text)

email (text)

phone (text)

role_id (uuid → roles.id)

is_verified (bool)

is_active (bool)

preferred_language (text)

location_lat (float8)

location_lng (float8)

created_at (timestamptz)

updated_at (timestamptz)

Relations:

role_id → roles.id

id → volunteer_profiles.user_id

id → calls.user_id

id → calls.volunteer_id

id → ratings.rated_by

id → ratings.rated_to

id → reports.reported_by

id → reports.reported_user_id

id → alerts.issued_by

Used by Admin:

Suspend user

Disable govt admin

Disable NGO admin

Notification targeting

Rating-based removal

3️⃣ ngos
id (uuid, PK)

name (text)

registration_number (text)

contact_email (text)

contact_phone (text)

verified_by_admin (bool)

created_at (timestamptz)

Relations:

id → volunteer_profiles.ngo_id

id → alerts.ngo_id

Used by Admin:

Verify NGO

Disable NGO

NGO dashboard display

4️⃣ volunteer_profiles
user_id (uuid, PK → users.id)

ngo_id (uuid → ngos.id)

skills (text[])

crisis_tags (text[])

rating_avg (float8)

total_calls (int4)

duty_mode (bool)

available_now (bool)

Relations:

user_id → users.id

ngo_id → ngos.id

Used by Admin:

Govt tag removal logic

NGO removal logic

Super admin removal logic

Volunteer filtering

5️⃣ calls
id (uuid, PK)

user_id (uuid → users.id)

volunteer_id (uuid → users.id)

call_type (text)

status (text)

started_at (timestamptz)

ended_at (timestamptz)

duration_seconds (int4)

created_at (timestamptz)

Relations:

user_id → users.id

volunteer_id → users.id

Used by Admin:

total_calls calculation

Threshold enforcement

System analytics

6️⃣ ratings
id (uuid, PK)

call_id (uuid → calls.id)

rated_by (uuid → users.id)

rated_to (uuid → users.id)

rating (int4)

feedback (text)

created_at (timestamptz)

Relations:

call_id → calls.id

rated_by → users.id

rated_to → users.id

Used by Admin:

rating_avg validation

Volunteer removal logic

User removal logic

7️⃣ reports
id (uuid, PK)

reported_user_id (uuid → users.id)

reported_by (uuid → users.id)

call_id (uuid → calls.id)

reason (text)

status (text)

created_at (timestamptz)

Relations:

reported_user_id → users.id

reported_by → users.id

call_id → calls.id

Used by Admin:

Moderation review

Suspension decisions

8️⃣ alerts
id (uuid, PK)

title (text)

description (text)

alert_type (text)

issued_by (uuid → users.id)

ngo_id (uuid → ngos.id)

is_active (bool)

created_at (timestamptz)

expires_at (timestamptz)

Relations:

issued_by → users.id

ngo_id → ngos.id

id → info_cards.alert_id

Used by Admin:

Govt broadcast alerts

Alert history

Disaster alert system

9️⃣ info_cards
id (uuid, PK)

alert_id (uuid → alerts.id)

content (text)

language (text)

verified (bool)

created_at (timestamptz)

Relations:

alert_id → alerts.id

Used by Admin:

Verified advisory content

Govt profile info

🆕 NEW ADMIN PORTAL TABLES (Governance Scope Only)
Add these to Supabase.

🔟 admin_registrations
Purpose: Govt / NGO admin onboarding approval

id (uuid, PK)

user_id (uuid → users.id)

requested_role (text: govt_admin | ngo_admin)

organization_name (text)

ngo_id (uuid → ngos.id, nullable)

status (text: pending | approved | rejected)

reviewed_by (uuid → users.id)

created_at (timestamptz)

Used by:

Super Admin approval dashboard

1️⃣1️⃣ announcements
Purpose: Government profile announcements

id (uuid, PK)

govt_admin_id (uuid → users.id)

title (text)

content (text)

is_active (bool)

created_at (timestamptz)

Used by:

Government profile page

1️⃣2️⃣ content_pages
Purpose: Govt / NGO profile content

id (uuid, PK)

owner_type (text: govt | ngo)

owner_id (uuid → users.id OR ngos.id)

about_content (text)

verification_status (bool)

updated_at (timestamptz)

Used by:

Govt profile

NGO profile

1️⃣3️⃣ admin_actions_log
Purpose: Governance audit trail

id (uuid, PK)

admin_id (uuid → users.id)

action_type (text)

revoke_gov_tag

revoke_ngo_tag

suspend_user

disable_ngo

create_alert

target_user_id (uuid → users.id, nullable)

target_ngo_id (uuid → ngos.id, nullable)

metadata (jsonb)

created_at (timestamptz)

Used by:

Super Admin monitoring

Governance transparency

Audit logs

📦 FINAL TABLE COUNT
Existing Core Tables: 9
New Admin Tables: 4

Total: 13 Tables

🧠 STRUCTURE SUMMARY FOR YOUR WEBSITE CODE
If your frontend needs a static reference list, structure it like:

CORE_TABLES = [
  roles,
  users,
  ngos,
  volunteer_profiles,
  calls,
  ratings,
  reports,
  alerts,
  info_cards
]

ADMIN_TABLES = [
  admin_registrations,
  announcements,
  content_pages,
  admin_actions_log
]
If you want next, I can give you:

A JSON schema version of this

A TypeScript interface model

Or a direct Supabase migration SQL for the new 4 tables only


Show less
 you need a few small but important additions to the core tables so the Admin Portal and App stay aligned.

I’ll list ONLY what needs to be added/updated in your existing core tables.

✅ 1️⃣ volunteer_profiles → ADD THESE
🔹 Add Governance Flags
govt_certified boolean default false,
ngo_certified boolean default false
Why:

Govt Admin needs to revoke govt tag

NGO Admin needs to revoke ngo tag

Badge rendering in app + website

✅ 2️⃣ users → ADD THESE
🔹 Add Suspension Control
is_suspended boolean default false,
suspended_reason text
Why:

Super Admin can suspend users

Govt/NGO admins can be disabled

App must block suspended accounts

✅ 3️⃣ ngos → ADD THESE
verified_badge boolean default false,
darpan_api_verified boolean default false,
is_disabled boolean default false,
subscription_tier text -- 'profit' | 'nonprofit'
Why:

Super admin verification

Disable NGO capability

Subscription governance

✅ 4️⃣ alerts → ADD THESE
official_url text,
target_scope text -- 'all' | 'volunteers' | 'govt_volunteers'
Why:

Govt broadcast redirect to official site

Proper targeting logic

Admin broadcast filtering

⚠️ 5️⃣ ratings & calls → NO STRUCTURE CHANGE
You’re already storing:

rating_avg

total_calls

That’s enough for governance thresholds.

No change needed.

⚠️ 6️⃣ reports → Optional Improvement
If you want better moderation:

reviewed_by uuid references users(id),
reviewed_at timestamptz
Not mandatory, but recommended.

🧠 Final Summary
You need to modify:

Table	Needs Update?
users	✅ Yes
volunteer_profiles	✅ Yes
ngos	✅ Yes
alerts	✅ Yes
roles	❌ No
calls	❌ No
ratings	❌ No
info_cards	❌ No
reports	⚠️ Optional