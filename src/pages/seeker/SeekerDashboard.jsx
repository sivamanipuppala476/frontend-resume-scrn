import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { applicationsAPI, jobsAPI } from '../../services/api';
import { Briefcase, FileText, ClipboardList, TrendingUp, ArrowRight, MapPin, Clock } from 'lucide-react';

export default function SeekerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ applications: 0, reviewed: 0, shortlisted: 0 });
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [apps, jobs] = await Promise.all([
          applicationsAPI.getBySeeker(user.id),
          jobsAPI.getAll()
        ]);
        setStats({
          applications: apps.length,
          reviewed: apps.filter(a => a.status === 'reviewed').length,
          shortlisted: apps.filter(a => a.status === 'shortlisted').length,
        });
        setRecentApps(apps.slice(0, 3));
        setRecentJobs(jobs.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user.id]);

  const statusColors = {
    applied: 'badge-info',
    reviewed: 'badge-warning',
    shortlisted: 'badge-success',
    rejected: 'badge-danger'
  };

  if (loading) {
    return (
      <div>
        <div className="page-header"><div className="skeleton" style={{ height: 36, width: 300, marginBottom: 8 }} /><div className="skeleton" style={{ height: 20, width: 200 }} /></div>
        <div className="grid-3" style={{ marginBottom: 24 }}>{[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 120 }} />)}</div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Welcome back, <span className="gradient-text">{user.name?.split(' ')[0]}</span> 👋</h1>
        <p>Here's what's happening with your job search</p>
      </div>

      {/* Stats */}
      <div className="grid-3" style={{ marginBottom: '32px' }}>
        {[
          { icon: ClipboardList, label: 'Applications', value: stats.applications, color: 'var(--info)', bg: 'var(--info-soft)' },
          { icon: TrendingUp, label: 'Under Review', value: stats.reviewed, color: 'var(--warning)', bg: 'var(--warning-soft)' },
          { icon: Briefcase, label: 'Shortlisted', value: stats.shortlisted, color: 'var(--success)', bg: 'var(--success-soft)' },
        ].map((stat, i) => (
          <div key={stat.label} className={`glass-card stat-card animate-fade-in-up stagger-${i + 1}`}>
            <div className="stat-card-icon" style={{ background: stat.bg }}>
              <stat.icon size={24} style={{ color: stat.color }} />
            </div>
            <div className="stat-card-content">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Profile Completion */}
      <div className="glass-card animate-fade-in-up stagger-4" style={{ padding: '24px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <h3 style={{ fontSize: 'var(--font-base)', fontWeight: 700 }}>Profile Completion</h3>
            <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>Complete your profile to get better matches</p>
          </div>
          <span style={{ fontSize: 'var(--font-xl)', fontWeight: 800 }} className="gradient-text">{user.profileCompletion || 30}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${user.profileCompletion || 30}%` }} />
        </div>
      </div>

      <div className="grid-2">
        {/* Recent Applications */}
        <div className="glass-card-static animate-fade-in-up stagger-5" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: 'var(--font-base)', fontWeight: 700 }}>Recent Applications</h3>
            <Link to="/seeker/applications" className="btn btn-ghost btn-sm">View All <ArrowRight size={14} /></Link>
          </div>
          {recentApps.length === 0 ? (
            <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-sm)' }}>No applications yet</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentApps.map(app => (
                <div key={app.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)'
                }}>
                  <div>
                    <p style={{ fontSize: 'var(--font-sm)', fontWeight: 600 }}>{app.jobTitle}</p>
                    <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>{app.company}</p>
                  </div>
                  <span className={`badge ${statusColors[app.status]}`}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recommended Jobs */}
        <div className="glass-card-static animate-fade-in-up stagger-6" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: 'var(--font-base)', fontWeight: 700 }}>Recommended Jobs</h3>
            <Link to="/seeker/jobs" className="btn btn-ghost btn-sm">Browse All <ArrowRight size={14} /></Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentJobs.map(job => (
              <Link
                key={job.id}
                to={`/seeker/jobs/${job.id}`}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-glass-strong)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-glass)'}
              >
                <div>
                  <p style={{ fontSize: 'var(--font-sm)', fontWeight: 600 }}>{job.title}</p>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '2px' }}>
                    <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} /> {job.location}
                    </span>
                    <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> {job.type}
                    </span>
                  </div>
                </div>
                <span style={{ fontSize: 'var(--font-sm)', color: 'var(--success)', fontWeight: 600 }}>{job.salary?.split(' - ')[0]}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
