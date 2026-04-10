import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, User, FileText, Search, ClipboardList,
  PlusCircle, Briefcase, Users, Eye, BarChart3,
  LogOut, ChevronLeft, Shield
} from 'lucide-react';

const seekerLinks = [
  { to: '/seeker/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/seeker/profile', icon: User, label: 'My Profile' },
  { to: '/seeker/resume', icon: FileText, label: 'My Resumes' },
  { to: '/seeker/jobs', icon: Search, label: 'Browse Jobs' },
  { to: '/seeker/applications', icon: ClipboardList, label: 'My Applications' },
];

const recruiterLinks = [
  { to: '/recruiter/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/recruiter/post-job', icon: PlusCircle, label: 'Post a Job' },
  { to: '/recruiter/jobs', icon: Briefcase, label: 'Manage Jobs' },
  { to: '/recruiter/applications', icon: Users, label: 'Applications' },
  { to: '/recruiter/screening', icon: Eye, label: 'Screening' },
];

const adminLinks = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/users', icon: Users, label: 'User Management' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links = user?.role === 'ADMIN' ? adminLinks
    : user?.role === 'RECRUITER' ? recruiterLinks
    : seekerLinks;

  const roleLabel = user?.role === 'ADMIN' ? 'Admin Panel'
    : user?.role === 'RECRUITER' ? 'Recruiter'
    : 'Job Seeker';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {isOpen && <div className="mobile-overlay" onClick={onClose} />}
      <aside className={`dashboard-sidebar ${isOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'var(--gradient-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Briefcase size={18} color="white" />
          </div>
          <h2 className="gradient-text">HireFlow</h2>
        </div>

        {/* Role Badge */}
        <div style={{ padding: '12px 20px' }}>
          <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
            <Shield size={12} />
            {roleLabel}
          </span>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <span className="sidebar-section-title">Navigation</span>
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <link.icon size={20} />
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '8px 12px', marginBottom: '8px'
          }}>
            <div className="profile-avatar" style={{
              width: 36, height: 36, fontSize: '0.875rem'
            }}>
              {user?.name?.[0] || 'U'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '0.875rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.name || 'User'}
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.email || ''}
              </p>
            </div>
          </div>
          <button className="sidebar-link" onClick={handleLogout} style={{ width: '100%', color: 'var(--danger)' }}>
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
