-- ============================================================
-- BLOCK 1 � Shows what role values are allowed by your constraint
-- (Run this alone first to confirm allowed values)
-- ============================================================
SELECT pg_get_constraintdef(oid) AS constraint_def
FROM pg_constraint
WHERE conname = 'users_role_check';
-- ============================================================
-- BLOCK 2 � Creates the 3 test user rows
-- NOTE: Auth users (super@aidly.in etc.) must already exist in
--       Supabase Auth BEFORE running this block.
--       Auth  Users  Add User (Auto Confirm checked)
-- ============================================================
INSERT INTO public.users (
        id,
        full_name,
        email,
        role,
        org_name,
        is_verified,
        is_active,
        is_suspended,
        total_calls,
        rating_avg
    )
VALUES (
        (
            SELECT id
            FROM auth.users
            WHERE email = 'super@aidly.in'
        ),
        'Super Admin',
        'super@aidly.in',
        'super_admin',
        'Aidly Platform',
        true,
        true,
        false,
        0,
        0
    ),
    (
        (
            SELECT id
            FROM auth.users
            WHERE email = 'govt@aidly.in'
        ),
        'Raj Mohan',
        'govt@aidly.in',
        'govt_admin',
        'Kerala SDMA',
        true,
        true,
        false,
        0,
        0
    ),
    (
        (
            SELECT id
            FROM auth.users
            WHERE email = 'ngo@aidly.in'
        ),
        'Anita Roy',
        'ngo@aidly.in',
        'ngo_admin',
        'HelpIndia NGO',
        true,
        true,
        false,
        0,
        0
    ) ON CONFLICT (id) DO
UPDATE
SET role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    org_name = EXCLUDED.org_name,
    is_active = EXCLUDED.is_active,
    is_suspended = EXCLUDED.is_suspended,
    total_calls = EXCLUDED.total_calls,
    rating_avg = EXCLUDED.rating_avg;
-- ============================================================
-- BLOCK 3 � RLS: let users read/update their own row
-- Drops ALL existing policies first to prevent 42P17 infinite
-- recursion caused by any pre-existing policies that reference
-- the users table inside their own condition.
-- ============================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
-- Drop every policy on the table (safe: recreated below)
DO $$
DECLARE pol RECORD;
BEGIN FOR pol IN
SELECT policyname
FROM pg_policies
WHERE tablename = 'users'
    AND schemaname = 'public' LOOP EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(pol.policyname) || ' ON public.users';
END LOOP;
END $$;
CREATE POLICY "Users can read own row" ON public.users FOR
SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own row" ON public.users FOR
UPDATE USING (auth.uid() = id);
-- ============================================================
-- BLOCK 4 � Verify: should return 3 rows
-- ============================================================
SELECT id,
    email,
    role,
    org_name,
    is_active,
    is_suspended
FROM public.users
WHERE email IN (
        'super@aidly.in',
        'govt@aidly.in',
        'ngo@aidly.in'
    );