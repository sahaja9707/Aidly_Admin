# Aidly Admin Portal — Product Requirements & Design Document

**Last updated: February 23, 2026**

---

## 1. Overview

The **Aidly Admin Portal** is a web-based governance dashboard that sits on top of the Aidly disaster-response mobile app. It gives three distinct admin personas — **NGO Admin**, **Government Admin**, and **Super Admin** — controlled access to manage volunteers, certifications, alerts, NGO operations, and platform-level moderation.

The portal is read/write against the same Supabase backend used by the mobile app. All data surfaced here (volunteers, calls, ratings, NGOs, alerts) is live app data.

---

## 2. User Roles

| Role                 | Access Path | Responsibilities                                                                       |
| -------------------- | ----------- | -------------------------------------------------------------------------------------- |
| **NGO Admin**        | `/ngo/*`    | Manage NGO volunteers, approve/reject join requests, view NGO profile                  |
| **Government Admin** | `/gov/*`    | Manage govt-certified volunteers, broadcast alerts, publish announcements              |
| **Super Admin**      | `/super/*`  | Full platform governance: NGO registry, admin registration, user moderation, audit log |

---

## 3. Application Structure

### 3.1 URL Map

```
/                          → Landing page
/roles                     → Role selection picker

/ngo-admin-hub             → NGO entry hub (login or register)
/admin-login               → NGO admin sign-in
/admin-signup              → NGO admin registration form
/admin-password-setup      → Post-registration password step
/admin-pending-request     → Pending approval holding screen

/gov-admin-hub             → Government entry hub (login or register)
/gov-admin-login           → Gov admin sign-in
/gov-admin-signup          → Gov admin registration form
/gov-admin-password-setup  → Post-registration password step

/login/:role               → Generic login (used for super admin: /login/super)
/pending                   → Generic pending verification screen

/gov/dashboard             → Government dashboard
/gov/volunteers            → Government volunteer management
/gov/leaderboard           → Govt volunteer leaderboard
/gov/alerts                → Alert broadcasting
/gov/profile               → Government profile + announcements
/gov/settings              → Settings

/ngo/dashboard             → NGO dashboard
/ngo/volunteers            → NGO volunteer management + join applications
/ngo/leaderboard           → NGO volunteer leaderboard
/ngo/profile               → NGO public profile
/ngo/settings              → Settings

/super/dashboard           → Super admin overview
/super/ngo-management      → NGO registry + add NGO
/super/registrations       → Admin registration approvals
/super/moderation          → User moderation (admins + volunteers)
/super/audit-log           → Full governance action history
/super/settings            → Settings
```

### 3.2 Layout System

All authenticated pages use a shared `AppShell` component parameterized by `role` (`'govt' | 'ngo' | 'super'`). The shell renders:

- A **Sidebar** with role-specific navigation links
- A **TopBar** with branding, current user info, and theme toggle
- An `<Outlet />` for the page content

Pre-auth pages (hubs, signup, login flows) are standalone full-screen centered layouts with no shell.

---

## 4. Authentication & Registration Flows

### 4.1 NGO Admin Flow

1. User lands on `/ngo-admin-hub` — chooses Sign In or Register
2. **Register path**: `/admin-signup` → collects `fullName`, `email`, `orgName`, `regNo`, `phone` → submits to `admin_registrations` table with `requested_role = 'ngo_admin'` and `status = 'pending'`
3. After submit → `/admin-password-setup` (user sets password)
4. → `/admin-pending-request` (holding screen, waits for super admin approval)
5. Once approved → user can sign in at `/admin-login` → redirected to `/ngo/dashboard`

### 4.2 Government Admin Flow

Mirrors the NGO flow:

1. `/gov-admin-hub` → choose Sign In or Register
2. **Register**: `/gov-admin-signup` → collects same fields → `requested_role = 'govt_admin'`
3. → `/gov-admin-password-setup` → `/pending` (holding screen)
4. Once approved → `/gov-admin-login` → `/gov/dashboard`

### 4.3 Super Admin Flow

1. Direct navigation to `/login/super`
2. No self-registration — Super Admin accounts provisioned manually
3. On success → `/super/dashboard`

---

## 5. Government Admin Section (`/gov/*`)

### 5.1 Dashboard (`/gov/dashboard`)

**Purpose:** KPI summary for the government admin's certified volunteer pool and active alerts.

**KPI Cards (4):**

- `Govt Volunteers` — count of volunteers with `govt_certified = true`
- `Average Rating` — mean `rating_avg` across all govt-certified volunteers
- `Active Alerts` — count of `alerts` where `is_active = true`
- `Disaster Mode` — static display (OFF unless declared)

**Right panels:**

- **Recent Alerts** — top 3 active alerts, showing type badge and scope
- **Top Gov Volunteers** — top 4 by `rating_avg`, shown with initials avatar

**Data sources:** `volunteer_profiles` (joined `users`), `alerts`

---

### 5.2 Volunteer Management (`/gov/volunteers`)

**Purpose:** View, search, and manage all government-certified volunteers. Deregister underperformers.

**Table columns:** Volunteer (name + email), Rating (color-coded red if < 3), Total Calls, Skills (first 2), Badges (`Gov` / `NGO`), Availability, Deregister Risk

**Deregistration Rule:**

> `rating_avg < 3 AND total_calls >= 50`
>
> When this condition is met, the row displays a red "Eligible" badge and the Deregister action becomes available inside the profile dialog.

**Row click → `VolunteerProfileDialog`** (shared component, see §8.1)

- Admin role passed as `'govt'` → action button label reads "Revoke Gov Certification"
- On confirm → removes `govt_certified = true` flag from the volunteer
- Logged to `admin_actions_log`

**Search:** Live filter on `full_name` and `email`

**Data sources:** `users`, `volunteer_profiles`

---

### 5.3 Alert Broadcasting (`/gov/alerts`)

**Purpose:** Create, view, and toggle official government alerts broadcast via FCM push notification.

**Create Alert dialog fields:**
| Field | Type | Notes |
|---|---|---|
| Title | text | Required |
| Description | textarea | Required |
| Alert Type | select | `disaster` / `health` / `notice` |
| Target Audience | select | `all` / `volunteers` / `govt_volunteers` |
| Official URL | text | Optional; deep-links disaster alerts to NDMA or state body pages |

On submit → writes to `alerts` table with `is_active = true`, `expires_at = created_at + 7 days`

**Alert table columns:** Title + description preview, Type badge, Target scope, Official URL link, Created date, Active/Inactive status, Toggle button (Bell/BellOff)

**Toggle action:** Flips `is_active` on the alert row — stops/resumes FCM broadcasts.

**Data sources:** `alerts`

---

### 5.4 Profile & Announcements (`/gov/profile`)

**Purpose:** Displays the government body's static profile and manages public-facing announcements.

**Left card (read-only):** Org name, type badge ("Verified Organisation"), state, contact email, join date, about text.

**Right card — Announcements table:**

- Shows all announcements with Title, truncated Content, Date, Active/Archived status
- **Add Announcement dialog:** Title + Content → writes to `announcements` table with `is_active = true`

**Data sources:** `users` (for org info), `announcements`

---

## 6. NGO Admin Section (`/ngo/*`)

### 6.1 Dashboard (`/ngo/dashboard`)

**KPI Cards (4):**

- `NGO Volunteers` — count of volunteers with `ngo_certified = true` linked to this NGO
- `Pending Requests` — count of `ngo_memberships` rows with `status = 'pending'`
- `Active Campaigns` — static display (campaigns are display-only; donations handled externally)
- `Avg Volunteer Rating` — mean `rating_avg` of NGO-certified volunteers

**Right panels:**

- **Active Campaigns** — static list with volunteer counts and Active/Completed badges
- **Top NGO Volunteers** — top 4 by `rating_avg`, shows Gov Certified badge if applicable

**Data sources:** `volunteer_profiles`, `ngo_memberships`

---

### 6.2 Volunteer Management (`/ngo/volunteers`)

Two-tab layout:

#### Tab 1: NGO Members

Same table structure as Gov Volunteers (§5.2) but filtered to `ngo_certified` volunteers affiliated with this NGO.

Row click → `VolunteerProfileDialog` with `adminRole = 'ngo'`

- Action label: "Remove from NGO"
- Rule same: `rating < 3 AND total_calls >= 50`

#### Tab 2: Applications

**Info banner** explaining that volunteers apply through the main Aidly NGO website; this panel controls their Aidly platform status.

**Table columns:** Applicant (name + email), Skills, Rating, Total Calls, Applied date, Status on Aidly (pending/approved/rejected), Actions

**Pending badge** on the tab displays count of pending applications.

**Actions per row:**

- `Approve` (✓) — sets `ngo_memberships.status = 'approved'`, grants `ngo_certified = true`
- `Reject` (✕) — sets `ngo_memberships.status = 'rejected'`

Both actions require an AlertDialog confirmation step.

**Data sources:** `ngo_memberships`, `volunteer_profiles`, `users`

---

### 6.3 NGO Profile (`/ngo/profile`)

**Left card (read-only):**

- NGO name and registration number
- Verified NGO + Nonprofit Tier badges
- Contact email, phone
- Darpan verification status badge
- Subscription tier
- About text

**Right section:**

- **Active Campaigns** — display-only list
- **Disaster Participation History** — table of past disaster responses (year, event, volunteers deployed, outcome badge)

**Data sources:** `ngos`, `ngo_memberships` (volunteer count)

---

## 7. Super Admin Section (`/super/*`)

### 7.1 Dashboard (`/super/dashboard`)

**KPI Cards (4):**

- `Total Users` — count of all volunteers + admin users
- `Total NGOs` — count of all NGOs (with "X verified" sub-text)
- `Govt Admins` — count of users with `role = 'govt_admin'`
- `Active Alerts` — count of active alerts

**Pending registrations badge** in header if any `admin_registrations.status = 'pending'`

**NGO Overview table:** Name, Subscription Tier, Verified status, Active/Disabled status

**Recent Audit Actions table:** Last governance actions from `admin_actions_log`

**Data sources:** `users`, `ngos`, `alerts`, `admin_actions_log`

---

### 7.2 NGO Management (`/super/ngo-management`)

Two-tab layout:

#### Tab 1: NGO Registry

**Table columns:** NGO (name + email), Registration No., Tier, Darpan status, Verified status, Active/Disabled status, Actions

**Actions per NGO:**

- **Verify / Unverify** — toggles `ngos.verified_badge` (no confirmation dialog)
- **Disable / Enable** — toggles `ngos.is_disabled` (confirmation dialog: "This will block all access for X and its admins")

#### Tab 2: Add New NGO

**Form fields:**
| Field | Notes |
|---|---|
| NGO Name | Required |
| Registration Number | Required |
| Contact Email | Required |
| Contact Phone | Required |
| Darpan API Key | Optional — if provided, sets `darpan_api_verified = true` |
| Subscription Tier | `nonprofit` (default) or `profit` |

On submit → creates `ngos` row with `verified_badge = true`, `verified_by_admin = true`, `is_disabled = false`, `volunteer_count = 0`

**Data sources:** `ngos`

---

### 7.3 Admin Registrations (`/super/registrations`)

**Purpose:** Super Admin approval gate for all incoming `govt_admin` and `ngo_admin` registration requests.

**Two sections (not tabs):** Pending registrations (with action buttons), then all processed registrations below.

**Table columns:** Applicant (name + email), Requested Role, Organisation, NGO Link (if applicable, shows NGO's verification status), Submitted date, Status, Actions

**Actions on pending rows:**

- **Reject** → AlertDialog → `admin_registrations.status = 'rejected'`
- **Approve** → direct click → `admin_registrations.status = 'approved'` + `users.role` set accordingly + `users.is_active = true`

**NGO Link column:** For `ngo_admin` applicants, shows a badge linking to the NGO they're registering for, with its verification status (green = verified, yellow = pending).

**Data sources:** `admin_registrations`, `ngos`, `users`

---

### 7.4 User Moderation (`/super/moderation`)

Two-tab layout:

#### Tab 1: Admin Users

Lists all `govt_admin` and `ngo_admin` users.

**Table columns:** Name + email, Role badge, Organisation, Joined date, Status (Active/Suspended), Actions

**Suspend / Reinstate** button → AlertDialog confirmation → toggles `users.is_suspended`

- Suspended users cannot log in to their admin portal

#### Tab 2: Volunteer Moderation

**Ban rule:**

> `rating_avg < 2 AND total_calls > 50`

(Stricter than deregistration — Super Admin ban is platform-wide permanent removal.)

**Table columns:** Volunteer (name + email), Rating (red if < 2), Total Calls, NGO, Status, Ban eligibility, Actions

**Ban** button only enabled when rule is met → removes user from `users` table (or marks as banned) → logs to `admin_actions_log`

Search bar filters both lists.

**Data sources:** `users`, `volunteer_profiles`

---

### 7.5 Audit Log (`/super/audit-log`)

**Purpose:** Immutable chronological record of all governance actions taken by any admin on the platform.

**Table columns:** Timestamp, Admin name, Action (color-coded badge), Target, Metadata (monospace)

**Action badge colors:**
| Action | Color |
|---|---|
| `approve_registration` | Green |
| `reject_registration` | Red |
| `revoke_gov_tag` | Yellow |
| `revoke_ngo_tag` | Yellow |
| `suspend_user` | Red |
| `add_ngo` | Green |
| `disable_ngo` | Red |
| `approve_volunteer` | Green |
| `create_alert` | Default (blue) |

Read-only — no actions available. Written to by all admin operations across the platform.

**Data source:** `admin_actions_log`

---

## 8. Shared Components

### 8.1 VolunteerProfileDialog

Reusable full-profile modal opened from any volunteer table row. Behavior adapts based on `adminRole` prop.

**Sections:**

1. **Hero row** — Avatar initials, name, email, NGO affiliation, certification badges, availability + duty mode status
2. **Stats row** — `rating_avg` (star display), `total_calls`, `available_now`, `duty_mode`
3. **Skills & Crisis Tags** — badge lists
4. **Caller Feedback** — list of `ratings` entries for this volunteer, each showing: caller name, star rating (visual), feedback text, call type, date
5. **Deregister / Ban action** — shown only if `canDeregister()` returns true
   - Gov Admin: "Revoke Gov Certification"
   - NGO Admin: "Remove from NGO"
   - Super Admin: "Ban from Platform"
   - Triggers AlertDialog → on confirm calls `onDeregister(id)` callback

**`canDeregister` rule:** `rating_avg < 3 AND total_calls >= 50`

**Data sources:** `users`, `volunteer_profiles`, `ratings`

---

### 8.2 Leaderboard (`/gov/leaderboard`, `/ngo/leaderboard`)

Shared page component with `filterMode` prop (`'govt' | 'ngo' | 'all'`).

**Podium (top 3):** Gold / Silver / Bronze medal cards with avatar, name, NGO affiliation, rating, call count.

**Full rankings table:** Rank number, Volunteer, NGO, Rating (with star), Calls, Certification badges, Availability.

**Controls:** Search by name or NGO name, sort toggle between `rating_avg` and `total_calls`.

---

## 9. Data Model (Website's View)

### Tables consumed

| Table                 | Used by                                               |
| --------------------- | ----------------------------------------------------- |
| `users`               | All sections — admin accounts, volunteer lookup       |
| `volunteer_profiles`  | Gov/NGO volunteer tables, leaderboard, profile dialog |
| `ngos`                | NGO profile, super NGO management, registration links |
| `ngo_memberships`     | NGO join requests / application tab                   |
| `alerts`              | Gov alerts page, gov/super dashboards                 |
| `ratings`             | Profile dialog feedback section                       |
| `admin_actions_log`   | Super audit log, super dashboard                      |
| `admin_registrations` | Super registrations page, all signup flows            |
| `announcements`       | Gov profile announcements panel                       |

### Key business rules enforced in the UI

| Rule                                                     | Location                                                |
| -------------------------------------------------------- | ------------------------------------------------------- |
| Deregistration eligibility: `rating < 3 AND calls >= 50` | Gov volunteers, NGO members tab, VolunteerProfileDialog |
| Platform ban eligibility: `rating < 2 AND calls > 50`    | Super moderation → volunteer tab                        |
| Admin registration requires Super Admin approval         | All signup flows → `/pending` screen                    |
| NGO disable blocks all admin access for that NGO         | Super NGO management                                    |
| Alerts auto-expire 7 days after creation                 | Gov alert creation                                      |
| Darpan verified if API key provided at NGO creation      | Super add NGO form                                      |

---

## 10. Tech Stack

| Layer          | Technology                                                        |
| -------------- | ----------------------------------------------------------------- |
| Framework      | React 18 + Vite                                                   |
| Language       | TypeScript                                                        |
| Routing        | React Router v6                                                   |
| UI Components  | shadcn/ui (Radix UI primitives)                                   |
| Styling        | Tailwind CSS                                                      |
| State          | Local `useState` (no global store — Supabase integration pending) |
| Backend        | Supabase (PostgreSQL + Auth + Storage)                            |
| Data (current) | Static mock data in `src/data/mockData.ts`                        |

---

## 11. Current State vs. Production Gaps

| Feature                   | Current State               | What's needed for production                                         |
| ------------------------- | --------------------------- | -------------------------------------------------------------------- |
| Authentication            | UI only, no real auth calls | Supabase Auth integration in login/signup forms                      |
| Data                      | `mockData.ts` in-memory     | Replace all mock reads with Supabase queries                         |
| Role-based access control | Routes not protected        | Auth context + route guards checking `users.role`                    |
| Audit logging             | Mock data only              | Write to `admin_actions_log` on every action mutation                |
| FCM push for alerts       | Not connected               | Supabase Edge Function calling Firebase Admin SDK on `alerts` insert |
| Settings page             | Placeholder                 | Implement profile editing + password change                          |
| Pagination                | None                        | All tables load full datasets; add cursor/page-based pagination      |
| Error handling            | None                        | Add toast notifications for failures                                 |
