import { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { adminAPI } from '../../services/api';
import { Users, Search, Shield, UserCheck, UserX, Trash2, MoreVertical } from 'lucide-react';

export default function UserManagement() {
  const { addToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await adminAPI.getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await adminAPI.updateUserStatus(userId, newStatus);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
      addToast(`User ${newStatus === 'active' ? 'activated' : 'deactivated'}`, 'success');
    } catch (err) {
      addToast('Failed to update user', 'error');
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await adminAPI.deleteUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
      addToast('User deleted', 'info');
    } catch (err) {
      addToast('Failed to delete user', 'error');
    }
  };

  const roleColors = {
    SEEKER: 'badge-info',
    RECRUITER: 'badge-warning',
    ADMIN: 'badge-primary'
  };

  let filtered = [...users];
  if (roleFilter !== 'all') filtered = filtered.filter(u => u.role === roleFilter);
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(u =>
      u.name?.toLowerCase().includes(s) ||
      u.email?.toLowerCase().includes(s)
    );
  }

  if (loading) {
    return (
      <div>
        <div className="page-header"><div className="skeleton" style={{ height: 36, width: 280 }} /></div>
        {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 60, marginBottom: 8 }} />)}
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>User Management</h1>
        <p>Manage all registered users on the platform</p>
      </div>

      {/* Stats Strip */}
      <div className="grid-3" style={{ marginBottom: '24px' }}>
        {[
          { label: 'Job Seekers', count: users.filter(u => u.role === 'SEEKER').length, color: 'var(--info)' },
          { label: 'Recruiters', count: users.filter(u => u.role === 'RECRUITER').length, color: 'var(--warning)' },
          { label: 'Admins', count: users.filter(u => u.role === 'ADMIN').length, color: 'var(--accent-violet)' },
        ].map(s => (
          <div key={s.label} className="glass-card animate-fade-in-up" style={{
            padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>{s.label}</span>
            <span style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: s.color }}>{s.count}</span>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="search-bar-wrapper animate-fade-in-up stagger-1">
        <div className="search-input-wrapper">
          <Search size={18} />
          <input placeholder="Search users by name or email..." value={search} onChange={e => setSearch(e.target.value)} id="user-search" />
        </div>
        <select className="form-select" value={roleFilter} onChange={e => setRoleFilter(e.target.value)} style={{ maxWidth: 160 }} id="role-filter">
          <option value="all">All Roles</option>
          <option value="SEEKER">Job Seekers</option>
          <option value="RECRUITER">Recruiters</option>
          <option value="ADMIN">Admins</option>
        </select>
      </div>

      <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)', marginBottom: '16px' }}>
        Showing {filtered.length} of {users.length} users
      </p>

      {/* Users Table */}
      <div className="glass-card-static animate-fade-in-up stagger-2" style={{ overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr key={u.id} className={`animate-fade-in stagger-${(i % 5) + 1}`}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="profile-avatar" style={{ width: 36, height: 36, fontSize: '0.8rem' }}>
                      {u.name?.[0] || '?'}
                    </div>
                    <div>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)', display: 'block' }}>{u.name}</span>
                      <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>{u.email}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`badge ${roleColors[u.role] || 'badge-neutral'}`}>
                    <Shield size={10} /> {u.role}
                  </span>
                </td>
                <td>
                  <span className={`badge ${u.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                    {u.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ color: 'var(--text-tertiary)' }}>{u.createdAt}</td>
                <td>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleToggleStatus(u.id, u.status)}
                      title={u.status === 'active' ? 'Deactivate' : 'Activate'}
                    >
                      {u.status === 'active' ? <UserX size={16} /> : <UserCheck size={16} />}
                    </button>
                    {u.role !== 'ADMIN' && (
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleDelete(u.id)}
                        title="Delete"
                        style={{ color: 'var(--danger)' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
