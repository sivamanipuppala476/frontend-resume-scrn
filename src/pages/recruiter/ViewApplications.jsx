import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { applicationsAPI, jobsAPI } from '../../services/api';
import { Users, Search, Star, CheckCircle, XCircle, FileText, Filter } from 'lucide-react';

export default function ViewApplications() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobFilter, setJobFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [apps, recruiterJobs] = await Promise.all([
        applicationsAPI.getByRecruiter(user.id),
        jobsAPI.getByRecruiter(user.id)
      ]);
      setApplications(apps);
      setJobs(recruiterJobs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appId, newStatus) => {
    try {
      await applicationsAPI.updateStatus(appId, newStatus);
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
      addToast(`Application ${newStatus}`, 'success');
    } catch (err) {
      addToast('Failed to update status', 'error');
    }
  };

  const statusColors = {
    applied: 'badge-info',
    reviewed: 'badge-warning',
    shortlisted: 'badge-success',
    rejected: 'badge-danger'
  };

  let filtered = [...applications];
  if (jobFilter !== 'all') filtered = filtered.filter(a => a.jobId === jobFilter);
  if (statusFilter !== 'all') filtered = filtered.filter(a => a.status === statusFilter);
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(a =>
      a.seekerName?.toLowerCase().includes(s) ||
      a.jobTitle?.toLowerCase().includes(s)
    );
  }
  filtered.sort((a, b) => b.score - a.score);

  if (loading) {
    return (
      <div>
        <div className="page-header"><div className="skeleton" style={{ height: 36, width: 280 }} /></div>
        {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 80, marginBottom: 12 }} />)}
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Applications</h1>
        <p>Review and manage candidate applications</p>
      </div>

      {/* Filters */}
      <div className="search-bar-wrapper animate-fade-in-up stagger-1">
        <div className="search-input-wrapper">
          <Search size={18} />
          <input placeholder="Search candidates..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-select" value={jobFilter} onChange={e => setJobFilter(e.target.value)} style={{ maxWidth: 200 }}>
          <option value="all">All Jobs</option>
          {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
        </select>
        <select className="form-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ maxWidth: 160 }}>
          <option value="all">All Status</option>
          <option value="applied">Applied</option>
          <option value="reviewed">Reviewed</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)', marginBottom: '20px' }}>
        {filtered.length} application{filtered.length !== 1 ? 's' : ''} • Sorted by match score
      </p>

      {filtered.length === 0 ? (
        <div className="empty-state glass-card-static">
          <Users size={64} />
          <h3>No Applications</h3>
          <p>No applications match your filters</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map((app, i) => (
            <div key={app.id} className={`glass-card-static animate-fade-in-up stagger-${(i % 6) + 1}`} style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                  <div className="profile-avatar" style={{ width: 44, height: 44, fontSize: '1rem' }}>
                    {app.seekerName?.[0] || '?'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontWeight: 700, fontSize: 'var(--font-sm)' }}>{app.seekerName}</h4>
                    <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>
                      Applied for: {app.jobTitle}
                    </p>
                    {app.seeker?.skills && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                        {app.seeker.skills.slice(0, 4).map(s => (
                          <span key={s} className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: 'center', padding: '0 16px' }}>
                    <div style={{
                      fontSize: 'var(--font-xl)', fontWeight: 800,
                      color: app.score >= 70 ? 'var(--success)' : app.score >= 40 ? 'var(--warning)' : 'var(--danger)'
                    }}>{app.score}%</div>
                    <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>Match</div>
                  </div>
                  <span className={`badge ${statusColors[app.status]}`}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
                  {app.status !== 'shortlisted' && app.status !== 'rejected' && (
                    <button className="btn btn-success btn-sm" onClick={() => handleStatusUpdate(app.id, 'shortlisted')} title="Shortlist">
                      <CheckCircle size={14} /> Shortlist
                    </button>
                  )}
                  {app.status !== 'rejected' && (
                    <button className="btn btn-ghost btn-sm" onClick={() => handleStatusUpdate(app.id, 'rejected')} title="Reject" style={{ color: 'var(--danger)' }}>
                      <XCircle size={14} />
                    </button>
                  )}
                  {app.status === 'applied' && (
                    <button className="btn btn-secondary btn-sm" onClick={() => handleStatusUpdate(app.id, 'reviewed')}>
                      Mark Reviewed
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
