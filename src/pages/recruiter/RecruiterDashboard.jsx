import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { jobsAPI, applicationsAPI } from '../../services/api';
import { Briefcase, Users, UserCheck, TrendingUp, ArrowRight, Calendar, Clock } from 'lucide-react';

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ activeJobs: 0, totalApps: 0, shortlisted: 0 });
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [jobs, apps] = await Promise.all([
          jobsAPI.getByRecruiter(user.id),
          applicationsAPI.getByRecruiter(user.id)
        ]);
        setStats({
          activeJobs: jobs.filter(j => j.status === 'active').length,
          totalApps: apps.length,
          shortlisted: apps.filter(a => a.status === 'shortlisted').length,
        });
        setRecentApps(apps.slice(0, 5));
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
        <div className="page-header"><div className="skeleton" style={{ height: 36, width: 300 }} /></div>
        <div className="grid-3">{[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 120 }} />)}</div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Welcome, <span className="gradient-text">{user.name?.split(' ')[0]}</span> 🚀</h1>
        <p>Manage your job postings and candidate pipeline</p>
      </div>

      {/* Stats */}
      <div className="grid-3" style={{ marginBottom: '32px' }}>
        {[
          { icon: Briefcase, label: 'Active Jobs', value: stats.activeJobs, color: 'var(--accent-violet)', bg: 'var(--accent-violet-soft)' },
          { icon: Users, label: 'Total Applications', value: stats.totalApps, color: 'var(--info)', bg: 'var(--info-soft)' },
          { icon: UserCheck, label: 'Shortlisted', value: stats.shortlisted, color: 'var(--success)', bg: 'var(--success-soft)' },
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

      {/* Quick Actions */}
      <div className="grid-2" style={{ marginBottom: '32px' }}>
        <Link to="/recruiter/post-job" className="glass-card animate-fade-in-up stagger-4" style={{
          padding: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: '12px', textDecoration: 'none',
          background: 'var(--gradient-card)'
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14, background: 'var(--gradient-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Briefcase size={24} color="white" />
          </div>
          <h3 style={{ fontWeight: 700 }}>Post a New Job</h3>
          <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
            Create a new job listing and start receiving applications
          </p>
        </Link>

        <Link to="/recruiter/screening" className="glass-card animate-fade-in-up stagger-5" style={{
          padding: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: '12px', textDecoration: 'none',
          background: 'var(--gradient-card)'
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14, background: 'linear-gradient(135deg, var(--success), #059669)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <UserCheck size={24} color="white" />
          </div>
          <h3 style={{ fontWeight: 700 }}>Screen Candidates</h3>
          <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
            Review and evaluate candidates with AI-powered scoring
          </p>
        </Link>
      </div>

      {/* Recent Applications */}
      <div className="glass-card-static animate-fade-in-up stagger-6" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 700 }}>Recent Applications</h3>
          <Link to="/recruiter/applications" className="btn btn-ghost btn-sm">View All <ArrowRight size={14} /></Link>
        </div>

        {recentApps.length === 0 ? (
          <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-sm)' }}>No applications yet</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Position</th>
                <th>Score</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentApps.map(app => (
                <tr key={app.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className="profile-avatar" style={{ width: 32, height: 32, fontSize: '0.75rem' }}>
                        {app.seekerName?.[0] || '?'}
                      </div>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{app.seekerName}</span>
                    </div>
                  </td>
                  <td>{app.jobTitle}</td>
                  <td>
                    <span style={{
                      fontWeight: 700,
                      color: app.score >= 70 ? 'var(--success)' : app.score >= 40 ? 'var(--warning)' : 'var(--danger)'
                    }}>{app.score}%</span>
                  </td>
                  <td><span className={`badge ${statusColors[app.status]}`}>{app.status.charAt(0).toUpperCase() + app.status.slice(1)}</span></td>
                  <td style={{ color: 'var(--text-tertiary)' }}>{app.appliedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
