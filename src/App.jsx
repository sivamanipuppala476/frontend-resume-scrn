import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Layout
import DashboardLayout from './components/Layout/DashboardLayout';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';

// Seeker Pages
import SeekerDashboard from './pages/seeker/SeekerDashboard';
import Profile from './pages/seeker/Profile';
import ResumeUpload from './pages/seeker/ResumeUpload';
import BrowseJobs from './pages/seeker/BrowseJobs';
import JobDetail from './pages/seeker/JobDetail';
import MyApplications from './pages/seeker/MyApplications';

// Recruiter Pages
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import PostJob from './pages/recruiter/PostJob';
import ManageJobs from './pages/recruiter/ManageJobs';
import ViewApplications from './pages/recruiter/ViewApplications';
import CandidateScreening from './pages/recruiter/CandidateScreening';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';

// Protected Route Component
function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg-primary)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 40, height: 40, border: '3px solid var(--border-color)',
            borderTopColor: 'var(--accent-violet)', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite', margin: '0 auto 16px'
          }} />
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-sm)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect to appropriate dashboard based on role
    if (user?.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (user?.role === 'RECRUITER') return <Navigate to="/recruiter/dashboard" replace />;
    return <Navigate to="/seeker/dashboard" replace />;
  }

  return children;
}

// Public Route (redirect if authenticated)
function PublicRoute({ children }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return null;

  if (isAuthenticated) {
    if (user?.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (user?.role === 'RECRUITER') return <Navigate to="/recruiter/dashboard" replace />;
    return <Navigate to="/seeker/dashboard" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      {/* Seeker Routes */}
      <Route path="/seeker" element={
        <ProtectedRoute allowedRoles={['SEEKER']}>
          <DashboardLayout title="Job Seeker" />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<SeekerDashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="resume" element={<ResumeUpload />} />
        <Route path="jobs" element={<BrowseJobs />} />
        <Route path="jobs/:id" element={<JobDetail />} />
        <Route path="applications" element={<MyApplications />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* Recruiter Routes */}
      <Route path="/recruiter" element={
        <ProtectedRoute allowedRoles={['RECRUITER']}>
          <DashboardLayout title="Recruiter Panel" />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<RecruiterDashboard />} />
        <Route path="post-job" element={<PostJob />} />
        <Route path="jobs" element={<ManageJobs />} />
        <Route path="applications" element={<ViewApplications />} />
        <Route path="screening" element={<CandidateScreening />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <DashboardLayout title="Admin Panel" />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* Catch All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
