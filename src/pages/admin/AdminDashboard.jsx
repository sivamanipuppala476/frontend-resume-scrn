import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Users, Briefcase, ClipboardList, Activity, TrendingUp, ArrowUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await adminAPI.getAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !analytics) {
    return (
      <div>
        <div className="page-header"><div className="skeleton" style={{ height: 36, width: 280 }} /></div>
        <div className="grid-4">{[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 120 }} />)}</div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
          borderRadius: 8, padding: '12px 16px', boxShadow: 'var(--shadow-lg)'
        }}>
          <p style={{ fontWeight: 600, marginBottom: 4 }}>{label}</p>
          {payload.map((p, i) => (
            <p key={i} style={{ fontSize: '0.8rem', color: p.color }}>
              {p.name}: {p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Admin <span className="gradient-text">Dashboard</span></h1>
        <p>System overview and analytics</p>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: '32px' }}>
        {[
          { icon: Users, label: 'Total Users', value: analytics.totalUsers, trend: '+12%', color: 'var(--accent-violet)', bg: 'var(--accent-violet-soft)' },
          { icon: Briefcase, label: 'Active Jobs', value: analytics.totalJobs, trend: '+8%', color: 'var(--accent-cyan)', bg: 'var(--accent-cyan-soft)' },
          { icon: ClipboardList, label: 'Applications', value: analytics.totalApplications, trend: '+23%', color: 'var(--success)', bg: 'var(--success-soft)' },
          { icon: Activity, label: 'Active Sessions', value: analytics.activeSessions, trend: '+5%', color: 'var(--warning)', bg: 'var(--warning-soft)' },
        ].map((stat, i) => (
          <div key={stat.label} className={`glass-card stat-card animate-fade-in-up stagger-${i + 1}`}>
            <div className="stat-card-icon" style={{ background: stat.bg }}>
              <stat.icon size={24} style={{ color: stat.color }} />
            </div>
            <div className="stat-card-content">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
              <span className="stat-card-trend up">
                <ArrowUp size={12} /> {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ marginBottom: '32px' }}>
        {/* User Registrations Chart */}
        <div className="glass-card-static animate-fade-in-up stagger-5" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: 'var(--font-base)', fontWeight: 700, marginBottom: '24px' }}>User Registrations</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={analytics.registrationsByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="month" stroke="var(--text-tertiary)" fontSize={12} />
              <YAxis stroke="var(--text-tertiary)" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="seekers" stroke="#7c3aed" strokeWidth={2} dot={{ r: 4, fill: '#7c3aed' }} name="Job Seekers" />
              <Line type="monotone" dataKey="recruiters" stroke="#06b6d4" strokeWidth={2} dot={{ r: 4, fill: '#06b6d4' }} name="Recruiters" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Application Status Pie Chart */}
        <div className="glass-card-static animate-fade-in-up stagger-6" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: 'var(--font-base)', fontWeight: 700, marginBottom: '24px' }}>Application Status</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={analytics.applicationStatus}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
              >
                {analytics.applicationStatus.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Jobs by Category Bar Chart */}
      <div className="glass-card-static animate-fade-in-up" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: 'var(--font-base)', fontWeight: 700, marginBottom: '24px' }}>Jobs by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analytics.jobsByCategory}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="category" stroke="var(--text-tertiary)" fontSize={12} />
            <YAxis stroke="var(--text-tertiary)" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" fill="url(#barGradient)" radius={[6, 6, 0, 0]} name="Jobs" />
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
