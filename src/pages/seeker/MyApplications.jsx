import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { applicationsAPI } from '../../services/api';
import { ClipboardList, Building2, Calendar, Star, ExternalLink } from 'lucide-react';

export default function MyApplications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const data = await applicationsAPI.getBySeeker(user.id);
      setApplications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    applied: { label: 'Applied', class: 'badge-info', step: 1 },
    reviewed: { label: 'Reviewed', class: 'badge-warning', step: 2 },
    shortlisted: { label: 'Shortlisted', class: 'badge-success', step: 3 },
    rejected: { label: 'Rejected', class: 'badge-danger', step: 0 },
  };

  const steps = ['Applied', 'Reviewed', 'Shortlisted', 'Hired'];

  const filtered = filter === 'all' ? applications : applications.filter(a => a.status === filter);

  if (loading) {
    return (
      <div>
        <div className="page-header"><div className="skeleton" style={{ height: 36, width: 280 }} /></div>
        {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 140, marginBottom: 16 }} />)}
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>My Applications</h1>
        <p>Track the status of your job applications</p>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap'
      }} className="animate-fade-in-up stagger-1">
        {['all', 'applied', 'reviewed', 'shortlisted', 'rejected'].map(f => (
          <button
            key={f}
            className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f !== 'all' && (
              <span style={{
                background: 'rgba(255,255,255,0.2)', padding: '0 6px',
                borderRadius: 10, fontSize: '0.7rem', marginLeft: 4
              }}>
                {applications.filter(a => f === 'all' || a.status === f).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Applications List */}
      {filtered.length === 0 ? (
        <div className="empty-state glass-card-static">
          <ClipboardList size={64} />
          <h3>No Applications</h3>
          <p>{filter === 'all' ? "You haven't applied for any jobs yet" : `No ${filter} applications`}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.map((app, i) => (
            <div
              key={app.id}
              className={`glass-card-static animate-fade-in-up stagger-${(i % 6) + 1}`}
              style={{ padding: '24px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div className="job-company-logo">{app.company?.[0] || 'C'}</div>
                  <div>
                    <h3 style={{ fontSize: 'var(--font-base)', fontWeight: 700, marginBottom: '2px' }}>{app.jobTitle}</h3>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Building2 size={14} /> {app.company}
                      </span>
                      <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={14} /> Applied {app.appliedDate}
                      </span>
                      <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Star size={14} /> Score: {app.score}%
                      </span>
                    </div>
                  </div>
                </div>
                <span className={`badge ${statusConfig[app.status]?.class || 'badge-neutral'}`}>
                  {statusConfig[app.status]?.label || app.status}
                </span>
              </div>

              {/* Status Timeline */}
              {app.status !== 'rejected' && (
                <div className="status-timeline">
                  {steps.map((step, idx) => {
                    const currentStep = statusConfig[app.status]?.step || 0;
                    const isCompleted = idx < currentStep;
                    const isActive = idx === currentStep;
                    return (
                      <div key={step} className="status-step">
                        <div className={`status-dot ${isCompleted ? 'completed' : isActive ? 'active' : ''}`} />
                        <span style={{
                          fontSize: 'var(--font-xs)',
                          color: isCompleted ? 'var(--success)' : isActive ? 'var(--accent-violet)' : 'var(--text-tertiary)',
                          fontWeight: isActive ? 600 : 400
                        }}>
                          {step}
                        </span>
                        {idx < steps.length - 1 && (
                          <div className={`status-line ${isCompleted ? 'completed' : ''}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {app.status === 'rejected' && (
                <p style={{ fontSize: 'var(--font-xs)', color: 'var(--danger)', marginTop: '8px' }}>
                  Unfortunately, your application was not selected. Keep applying!
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
