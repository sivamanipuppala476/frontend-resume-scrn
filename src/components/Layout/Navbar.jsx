import { useAuth } from '../../context/AuthContext';
import { Menu, Bell, Search } from 'lucide-react';

export default function Navbar({ onMenuClick, title }) {
  const { user } = useAuth();

  return (
    <header className="dashboard-navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          className="btn-icon btn-ghost"
          onClick={onMenuClick}
          style={{ display: 'none' }}
          id="mobile-menu-btn"
        >
          <Menu size={20} />
        </button>
        <style>{`@media(max-width:768px){#mobile-menu-btn{display:flex!important;}}`}</style>
        <h1 style={{ fontSize: '1.125rem', fontWeight: 700 }}>{title || 'Dashboard'}</h1>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button className="btn btn-icon btn-ghost" style={{ position: 'relative' }}>
          <Bell size={20} />
          <span style={{
            position: 'absolute', top: 4, right: 4,
            width: 8, height: 8, borderRadius: '50%',
            background: 'var(--danger)'
          }} />
        </button>
        <div className="profile-avatar" style={{
          width: 36, height: 36, fontSize: '0.875rem', cursor: 'pointer'
        }}>
          {user?.name?.[0] || 'U'}
        </div>
      </div>
    </header>
  );
}
