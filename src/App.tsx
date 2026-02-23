import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Auth Pages
import RoleSelection from '@/pages/RoleSelection'
import Landing from '@/pages/Landing'
import NGOAdminHub from '@/pages/NGOAdminHub'
import GOAdminHub from '@/pages/GOAdminHub'
import AdminLogin from '@/pages/AdminLogin'
import AdminSignup from '@/pages/AdminSignup'
import AdminPasswordSetup from '@/pages/AdminPasswordSetup'
import GOAdminLogin from '@/pages/GOAdminLogin'
import GOAdminSignup from '@/pages/GOAdminSignup'
import GOAdminPasswordSetup from '@/pages/GOAdminPasswordSetup'
import AdminPendingRequest from '@/pages/AdminPendingRequest'
import Login from '@/pages/Login'
import PendingVerification from '@/pages/PendingVerification'

// Layout
import { AppShell } from '@/components/layout/AppShell'

// Government Admin Pages
import GovDashboard from '@/pages/gov/GovDashboard'
import GovVolunteers from '@/pages/gov/GovVolunteers'
import GovAlerts from '@/pages/gov/GovAlerts'
import GovProfile from '@/pages/gov/GovProfile'

// NGO Admin Pages
import NgoDashboard from '@/pages/ngo/NgoDashboard'
import NgoVolunteers from '@/pages/ngo/NgoVolunteers'
import NgoProfile from '@/pages/ngo/NgoProfile'

// Shared
import Leaderboard from '@/pages/shared/Leaderboard'
import Settings from '@/pages/Settings'

// Super Admin Pages
import SuperDashboard from '@/pages/super/SuperDashboard'
import SuperNgoManagement from '@/pages/super/SuperNgoManagement'
import SuperRegistrations from '@/pages/super/SuperRegistrations'
import SuperModeration from '@/pages/super/SuperModeration'
import SuperAuditLog from '@/pages/super/SuperAuditLog'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing & Auth */}
        <Route path="/" element={<Landing />} />
        <Route path="/roles" element={<RoleSelection />} />

        {/* NGO Admin */}
        <Route path="/ngo-admin-hub" element={<NGOAdminHub />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-signup" element={<AdminSignup />} />
        <Route path="/admin-password-setup" element={<AdminPasswordSetup />} />
        <Route path="/admin-pending-request" element={<AdminPendingRequest />} />

        {/* Government Admin */}
        <Route path="/gov-admin-hub" element={<GOAdminHub />} />
        <Route path="/gov-admin-login" element={<GOAdminLogin />} />
        <Route path="/gov-admin-signup" element={<GOAdminSignup />} />
        <Route path="/gov-admin-password-setup" element={<GOAdminPasswordSetup />} />

        {/* Role-based */}
        <Route path="/login/:role" element={<Login />} />
        <Route path="/pending" element={<PendingVerification />} />

        {/* Government Admin */}
        <Route path="/gov" element={<AppShell role="govt" />}>
          <Route index element={<Navigate to="/gov/dashboard" replace />} />
          <Route path="dashboard" element={<GovDashboard />} />
          <Route path="volunteers" element={<GovVolunteers />} />
          <Route path="leaderboard" element={<Leaderboard filterMode="govt" />} />
          <Route path="alerts" element={<GovAlerts />} />
          <Route path="profile" element={<GovProfile />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* NGO Admin */}
        <Route path="/ngo" element={<AppShell role="ngo" />}>
          <Route index element={<Navigate to="/ngo/dashboard" replace />} />
          <Route path="dashboard" element={<NgoDashboard />} />
          <Route path="volunteers" element={<NgoVolunteers />} />
          <Route path="leaderboard" element={<Leaderboard filterMode="ngo" />} />
          <Route path="profile" element={<NgoProfile />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Super Admin */}
        <Route path="/super" element={<AppShell role="super" />}>
          <Route index element={<Navigate to="/super/dashboard" replace />} />
          <Route path="dashboard" element={<SuperDashboard />} />
          <Route path="ngo-management" element={<SuperNgoManagement />} />
          <Route path="registrations" element={<SuperRegistrations />} />
          <Route path="moderation" element={<SuperModeration />} />
          <Route path="audit-log" element={<SuperAuditLog />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
