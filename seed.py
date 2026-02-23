"""
Aidly Admin Portal — Supabase Database Seeder
==============================================
Seeds all tables with realistic Indian test data using Faker.

Requirements:
    pip install supabase faker python-dotenv

Usage:
    1. Fill in SUPABASE_SERVICE_ROLE_KEY in .env.local
       (Supabase → Project Settings → API → service_role)
    2. Run:  python seed.py
    3. To wipe and re-seed: python seed.py --reset

Tables seeded:
    ngos, users (auth + public), volunteer_profiles,
    ngo_memberships, alerts, ratings, admin_registrations,
    admin_actions_log, announcements
"""

import os
import sys
import uuid
import random

# Force UTF-8 output on Windows
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
from faker import Faker
from supabase import create_client, Client

# ── Config ────────────────────────────────────────────────────────────────────
load_dotenv(".env.local")

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SERVICE_ROLE_KEY or SERVICE_ROLE_KEY == "YOUR_SERVICE_ROLE_KEY_HERE":
    print("ERROR: Set SUPABASE_SERVICE_ROLE_KEY in .env.local first.")
    print("  Get it from: Supabase → Project Settings → API → service_role (secret)")
    sys.exit(1)

supabase: Client = create_client(SUPABASE_URL, SERVICE_ROLE_KEY)
fake = Faker("en_IN")

NOW = datetime.now(timezone.utc)

# ── Helpers ───────────────────────────────────────────────────────────────────

def ts(days_ago: int = 0) -> str:
    return (NOW - timedelta(days=days_ago)).isoformat()

def rand_date(min_days=1, max_days=180) -> str:
    return ts(random.randint(min_days, max_days))

def create_auth_user(email: str, password: str = "Aidly@2026!") -> str:
    """Creates an auth user and returns their UUID. If already exists, returns existing UUID."""
    try:
        res = supabase.auth.admin.create_user({
            "email": email,
            "password": password,
            "email_confirm": True,
        })
        return res.user.id
    except Exception:
        # User already exists — look up their ID
        page = supabase.auth.admin.list_users()
        for u in page:
            if u.email == email:
                return u.id
        raise RuntimeError(f"Could not find or create auth user: {email}")

# ── Skills & Tags ─────────────────────────────────────────────────────────────

ALL_SKILLS = [
    "Medical", "First Aid", "Rescue", "Logistics",
    "Counseling", "Security", "Communication", "Translation",
    "Water Purification", "Shelter Setup", "Food Distribution",
    "Search & Rescue", "Evacuation", "Firefighting",
]

CRISIS_TAGS = [
    "flood", "earthquake", "cyclone", "fire",
    "drought", "pandemic", "landslide", "heatwave",
]

INDIAN_STATES = [
    "Kerala", "Tamil Nadu", "Karnataka", "Andhra Pradesh",
    "Telangana", "Maharashtra", "Gujarat", "Odisha",
    "West Bengal", "Assam", "Uttarakhand", "Himachal Pradesh",
]

NGO_NAMES = [
    "HelpIndia NGO", "DisasterGuard India", "CareFirst Foundation",
    "Rapid Relief Force", "Sahara Seva Trust", "Aarogya Aid",
    "Jan Kalyan Sanstha", "Prayas Welfare Society",
]

GOVT_ORGS = [
    "Kerala SDMA", "Tamil Nadu NDRF Unit", "Odisha Disaster Management",
    "Gujarat State Emergency", "Maharashtra Civil Defence",
    "Karnataka SDRF", "Andhra Pradesh SDMA", "West Bengal DM Dept",
]

ALERT_TITLES = [
    "Cyclone Remal — High Alert", "Heavy Rainfall Warning — Coastal Zones",
    "Earthquake Advisory — Himalayas", "Flash Flood Alert — Kerala",
    "Health Advisory — Dengue Outbreak", "Drought Alert — Marathwada",
    "Heatwave Warning — Rajasthan", "Landslide Alert — Uttarakhand",
    "Flood Relief Operation — Assam", "COVID Surveillance Notice",
]

ALERT_DESCRIPTIONS = [
    "All volunteers in coastal districts are advised to report to their assigned posts.",
    "Evacuation teams to be on standby. Expect heavy rainfall for 72 hours.",
    "Structural inspection teams to be deployed to affected zones immediately.",
    "Coordinate with local civil defence for shelter setup and food distribution.",
    "Health volunteers to assist with screening and awareness camps.",
]

ANNOUNCEMENT_TITLES = [
    "Annual Volunteer Performance Review 2025 — Complete",
    "New Certification Programme Launching April 2026",
    "Emergency Contact Protocol Updated",
    "Regional Training Camp — March 2026",
    "Mandatory Revalidation for Gov-Certified Volunteers",
    "New Tier-2 Districts Added to Response Network",
    "Digital Identity Cards Issued for Certified Volunteers",
    "Partnership with NDRF — Joint Exercise Announced",
]

AUDIT_ACTIONS = [
    ("approve_registration", "Approved registration request"),
    ("reject_registration", "Rejected registration request"),
    ("suspend_user", "Suspended user account"),
    ("add_ngo", "Added new NGO to registry"),
    ("disable_ngo", "Disabled NGO access"),
    ("revoke_gov_tag", "Revoked government certification"),
    ("revoke_ngo_tag", "Revoked NGO certification"),
    ("approve_volunteer", "Approved volunteer for NGO"),
    ("create_alert", "Created new emergency alert"),
    ("toggle_alert", "Toggled alert status"),
]

FEEDBACK_TEXTS = [
    "Very professional and calm under pressure.",
    "Arrived on time and followed all protocols.",
    "Excellent coordination with local teams.",
    "Could improve communication but overall good.",
    "Outstanding performance during the evacuation.",
    "Worked tirelessly throughout the relief operation.",
    "Knowledgeable about medical procedures.",
    "Needs improvement in logistics coordination.",
    "Great team player, highly recommended.",
    "Very empathetic and supportive to affected families.",
]

# =============================================================================
# STEP 1: Create NGOs
# =============================================================================

def seed_ngos() -> list[dict]:
    print("→ Seeding NGOs...")
    ngos = []
    for i, name in enumerate(NGO_NAMES):
        ngo_id = str(uuid.uuid4())
        tier = random.choice(["nonprofit", "nonprofit", "profit"])
        ngo = {
            "id": ngo_id,
            "name": name,
            "registration_number": f"NGO-{2020 + i}-{random.randint(1000,9999)}",
            "contact_email": f"admin@{name.lower().replace(' ', '').replace('/', '')[:15]}.org",
            "contact_phone": f"+91-{random.randint(7000000000, 9999999999)}",
            "description": fake.sentence(nb_words=12),
            "area_of_work": random.choice(["Disaster Relief", "Health", "Education", "Food Security", "Climate Response"]),
            "verified_badge": random.choice([True, True, False]),
            "verified_by_admin": True,
            "verified_by_super_admin": True,
            "darpan_api_verified": random.choice([True, False]),
            "is_active": True,
            "is_disabled": i == 7,
            "subscription_tier": random.choice(["nonprofit", "nonprofit", "profit"]),
            "created_at": rand_date(60, 400),
        }
        ngos.append(ngo)

    supabase.table("ngos").upsert(ngos, on_conflict="id").execute()
    print(f"  + {len(ngos)} NGOs inserted")
    return ngos


# =============================================================================
# STEP 2: Create Super Admin
# =============================================================================

def seed_super_admin() -> dict:
    print("→ Seeding Super Admin...")
    email = "superadmin@aidly.in"
    auth_id = create_auth_user(email)
    user = {
        "id": auth_id,
        "full_name": "Aidly Super Admin",
        "email": email,
        "phone": "+91-9000000001",
        "role": "super_admin",
        "org_name": "Aidly Platform",
        "is_verified": True,
        "is_active": True,
        "is_suspended": False,
        "preferred_language": "en",
        "created_at": ts(300),
    }
    supabase.table("users").upsert(user, on_conflict="id").execute()
    print(f"  ✓ Super Admin created — email: {email} | password: Aidly@2026!")
    return user


# =============================================================================
# STEP 3: Create Govt Admins
# =============================================================================

def seed_govt_admins(count: int = 6) -> list[dict]:
    print(f"→ Seeding {count} Govt Admins...")
    users = []
    for i in range(count):
        org = GOVT_ORGS[i % len(GOVT_ORGS)]
        email = f"govadmin{i+1}@{org.lower().replace(' ', '')[:12]}.gov.in"
        auth_id = create_auth_user(email)
        user = {
            "id": auth_id,
            "full_name": fake.name(),
            "email": email,
            "phone": f"+91-{random.randint(7000000000, 9999999999)}",
            "role": "govt_admin",
            "org_name": org,
            "is_verified": True,
            "is_active": i != 5,      # last one inactive for demo
            "is_suspended": i == 4,   # second-last suspended for demo
            "preferred_language": "en",
            "created_at": rand_date(30, 200),
        }
        users.append(user)

    supabase.table("users").upsert(users, on_conflict="id").execute()
    print(f"  ✓ {count} Govt Admins inserted")
    return users


# =============================================================================
# STEP 4: Create NGO Admins
# =============================================================================

def seed_ngo_admins(ngos: list[dict], count: int = 6) -> list[dict]:
    print(f"→ Seeding {count} NGO Admins...")
    users = []
    for i in range(count):
        ngo = ngos[i % len(ngos)]
        email = f"ngoadmin{i+1}@{ngo['name'].lower().replace(' ', '')[:12]}.org"
        auth_id = create_auth_user(email)
        user = {
            "id": auth_id,
            "full_name": fake.name(),
            "email": email,
            "phone": f"+91-{random.randint(7000000000, 9999999999)}",
            "role": "ngo_admin",
            "org_name": ngo["name"],
            "is_verified": True,
            "is_active": True,
            "is_suspended": False,
            "preferred_language": "en",
            "created_at": rand_date(30, 180),
        }
        users.append(user)

    supabase.table("users").upsert(users, on_conflict="id").execute()
    print(f"  ✓ {count} NGO Admins inserted")
    return users


# =============================================================================
# STEP 5: Create Volunteers
# =============================================================================

def seed_volunteers(ngos: list[dict], count: int = 35) -> list[dict]:
    print(f"→ Seeding {count} Volunteers...")
    auth_users = []
    vol_profiles = []

    for i in range(count):
        email = f"volunteer{i+1}@example.com"
        auth_id = create_auth_user(email)

        rating = round(random.uniform(1.2, 5.0), 1)
        total_calls = random.randint(0, 120)
        ngo = random.choice(ngos)
        govt_certified = random.choice([True, True, False])
        ngo_certified = random.choice([True, True, False])
        skills = random.sample(ALL_SKILLS, random.randint(2, 5))
        tags = random.sample(CRISIS_TAGS, random.randint(1, 3))
        state = random.choice(INDIAN_STATES)

        user = {
            "id": auth_id,
            "full_name": fake.name(),
            "email": email,
            "phone": f"+91-{random.randint(7000000000, 9999999999)}",
            "role": "volunteer",
            "org_name": ngo["name"],
            "is_verified": True,
            "is_active": random.choice([True, True, True, False]),
            "is_suspended": i == 2,
            "preferred_language": "en",
            "rating_avg": rating,
            "total_calls": total_calls,
            "created_at": rand_date(10, 500),
        }
        auth_users.append(user)

        profile = {
            "user_id": auth_id,
            "skills": skills,
            "crisis_tags": tags,
            "badge": random.choice(["Bronze", "Silver", "Gold", None, None]),
            "duty_mode": random.choice([True, False]),
            "available_now": random.choice([True, True, False]),
            "govt_certified": govt_certified,
            "ngo_certified": ngo_certified,
        }
        vol_profiles.append(profile)

    supabase.table("users").upsert(auth_users, on_conflict="id").execute()
    supabase.table("volunteer_profiles").upsert(vol_profiles, on_conflict="user_id").execute()
    print(f"  ✓ {count} Volunteers + profiles inserted")
    return auth_users


# =============================================================================
# STEP 6: NGO Memberships
# =============================================================================

def seed_memberships(volunteers: list[dict], ngos: list[dict]):
    print("→ Seeding NGO Memberships...")
    memberships = []
    statuses = ["approved", "approved", "approved", "pending", "rejected"]

    for vol in volunteers:
        ngo = random.choice(ngos)
        status = random.choice(statuses)
        memberships.append({
            "id": str(uuid.uuid4()),
            "user_id": vol["id"],
            "ngo_id": ngo["id"],
            "status": status,
        })

    supabase.table("ngo_memberships").upsert(memberships, on_conflict="id").execute()
    print(f"  ✓ {len(memberships)} memberships inserted")


# =============================================================================
# STEP 7: Alerts
# =============================================================================

def seed_alerts(govt_admins: list[dict], count: int = 12) -> list[dict]:
    print(f"→ Seeding {count} Alerts...")
    alerts = []
    for i in range(count):
        issued_by = random.choice(govt_admins)["id"]
        alert_type = random.choice(["disaster", "disaster", "health", "notice"])
        is_active = i < 6   # first 6 active
        created = NOW - timedelta(days=random.randint(0, 30))
        alerts.append({
            "id": str(uuid.uuid4()),
            "title": ALERT_TITLES[i % len(ALERT_TITLES)],
            "description": random.choice(ALERT_DESCRIPTIONS),
            "alert_type": alert_type,
            "issued_by": issued_by,
            "is_active": is_active,
            "expires_at": (created + timedelta(days=7)).isoformat(),
            "created_at": created.isoformat(),
        })

    supabase.table("alerts").upsert(alerts, on_conflict="id").execute()
    print(f"  ✓ {count} Alerts inserted")
    return alerts


# =============================================================================
# STEP 8: Ratings (mock calls)
# =============================================================================

def seed_ratings(volunteers: list[dict], count: int = 60):
    print(f"→ Seeding {count} Ratings...")
    ratings = []
    call_types = ["emergency", "advisory", "followup", "request"]
    for _ in range(count):
        rater = random.choice(volunteers)
        ratee = random.choice(volunteers)
        if rater["id"] == ratee["id"]:
            continue
        ratings.append({
            "id": str(uuid.uuid4()),
            "call_id": str(uuid.uuid4()),
            "rated_by": rater["id"],
            "rated_to": ratee["id"],
            "rating": random.randint(1, 5),
            "feedback": random.choice(FEEDBACK_TEXTS),
            "call_type_label": random.choice(["Emergency", "Advisory", "Follow-up", "Request"]),
            "created_at": rand_date(1, 90),
        })

    supabase.table("ratings").upsert(ratings, on_conflict="id").execute()
    print(f"  ✓ {len(ratings)} Ratings inserted")


# =============================================================================
# STEP 9: Admin Registrations (pending + processed)
# =============================================================================

def seed_registrations(ngos: list[dict], count: int = 10):
    print(f"→ Seeding {count} Admin Registrations...")
    registrations = []
    statuses = ["pending", "pending", "pending", "approved", "approved", "rejected"]
    roles_req = ["ngo_admin", "govt_admin"]

    for i in range(count):
        role = random.choice(roles_req)
        status = random.choice(statuses)
        ngo_name = random.choice(NGO_NAMES) if role == "ngo_admin" else random.choice(GOVT_ORGS)
        registrations.append({
            "id": str(uuid.uuid4()),
            "full_name": fake.name(),
            "email": f"pending{i+1}@{fake.domain_name()}",
            "requested_role": role,
            "org_name": ngo_name,
            "status": status,
            "created_at": rand_date(1, 20),
        })

    supabase.table("admin_registrations").upsert(registrations, on_conflict="id").execute()
    print(f"  ✓ {count} Registrations inserted")


# =============================================================================
# STEP 10: Admin Action Log
# =============================================================================

def seed_audit_log(
    super_admin: dict,
    govt_admins: list[dict],
    ngo_admins: list[dict],
    count: int = 25,
):
    print(f"→ Seeding {count} Audit Log entries...")
    all_admins = [super_admin] + govt_admins + ngo_admins
    logs = []
    for i in range(count):
        actor = random.choice(all_admins)
        action_type, description = random.choice(AUDIT_ACTIONS)
        logs.append({
            "id": str(uuid.uuid4()),
            "admin_id": actor["id"],
            "action_type": action_type,
            "target_type": random.choice(["user", "ngo", "registration", "alert"]),
            "target_id": str(uuid.uuid4()),
            "metadata": {"note": description},
            "created_at": rand_date(0, 60),
        })

    supabase.table("admin_actions_log").upsert(logs, on_conflict="id").execute()
    print(f"  ✓ {count} Audit entries inserted")


# =============================================================================
# STEP 11: Announcements
# =============================================================================

def seed_announcements(govt_admins: list[dict], count: int = 8):
    print(f"→ Seeding {count} Announcements...")
    announcements = []
    for i in range(count):
        created_by = random.choice(govt_admins)["id"]
        announcements.append({
            "id": str(uuid.uuid4()),
            "title": ANNOUNCEMENT_TITLES[i % len(ANNOUNCEMENT_TITLES)],
            "content": fake.paragraph(nb_sentences=3),
            "is_active": i < 5,
            "created_at": rand_date(1, 60),
        })

    supabase.table("announcements").upsert(announcements, on_conflict="id").execute()
    print(f"  ✓ {count} Announcements inserted")


# =============================================================================
# STEP 12: Update volunteer_count on NGOs
# =============================================================================

def update_ngo_volunteer_counts(ngos: list[dict], volunteers: list[dict]):
    print("→ Updating NGO volunteer counts...")
    from collections import Counter
    counts = Counter(v.get("ngo_id") for v in volunteers if v.get("ngo_id"))
    for ngo in ngos:
        c = counts.get(ngo["id"], 0)
        supabase.table("ngos").update({"volunteer_count": c}).eq("id", ngo["id"]).execute()
    print("  ✓ Volunteer counts updated")


# =============================================================================
# OPTIONAL RESET
# =============================================================================

def reset_db():
    tables = [
        "announcements", "admin_actions_log", "admin_registrations",
        "ratings", "alerts", "ngo_memberships",
        "volunteer_profiles", "users", "ngos",
    ]
    print("WARNING: Resetting database tables...")
    for t in tables:
        # Delete all rows — RLS must be disabled or service role bypasses it
        supabase.table(t).delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
        print(f"  cleared: {t}")

    # Also delete auth users (list + delete)
    print("  clearing auth users...")
    page = supabase.auth.admin.list_users()
    for u in page:
        supabase.auth.admin.delete_user(u.id)
    print("  ✓ Reset complete")


# =============================================================================
# MAIN
# =============================================================================

if __name__ == "__main__":
    if "--reset" in sys.argv:
        reset_db()

    print("\n[Aidly Seeder] Starting...\n")

    ngos       = seed_ngos()
    super_adm  = seed_super_admin()
    govt_adms  = seed_govt_admins(count=6)
    ngo_adms   = seed_ngo_admins(ngos, count=6)
    volunteers = seed_volunteers(ngos, count=35)

    seed_memberships(volunteers, ngos)
    seed_alerts(govt_adms, count=12)
    seed_ratings(volunteers, count=60)
    seed_registrations(ngos, count=10)
    seed_audit_log(super_adm, govt_adms, ngo_adms, count=25)
    seed_announcements(govt_adms, count=8)

    print("\n[OK] Seeding complete!")
    print("\n[Credentials] Test accounts (password: Aidly@2026!)")
    print("   Super Admin : superadmin@aidly.in")
    print("   Govt Admin  : govadmin1@keralasdam.gov.in")
    print("   NGO Admin   : ngoadmin1@helpindiang.org")
    print("   Volunteer   : volunteer1@example.com")
    print("\nNote: Column names in seed.py must match your actual Supabase schema.")
    print("If you get column errors, adjust the dict keys to match your table columns.")
