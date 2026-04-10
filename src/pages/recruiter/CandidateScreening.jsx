import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { applicationsAPI } from '../../services/api';
import { Eye, CheckCircle, XCircle, Star, User, Briefcase, ChevronLeft, ChevronRight, FileText } from 'lucide-react';

export default function CandidateScreening() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const apps = await applicationsAPI.getByRecruiter(user.id);
      // Only show pending applications
      const pending = apps.filter(a => a.status === 'applied' || a.status === 'reviewed');
      pending.sort((a, b) => b.score - a.score);
      setApplications(pending);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (appId, status) => {
    try {
      await applicationsAPI.updateStatus(appId, status);
      setApplications(prev => prev.filter(a => a.id !== appId));
      if (currentIndex >= applications.length - 1) {
        setCurrentIndex(Math.max(0, currentIndex - 1));
      }
      addToast(`Candidate ${status}`, status === 'shortlisted' ? 'success' : 'info');
    } catch (err) {
      addToast('Failed to update', 'error');
    }
  };

  if (loading) {
    return (
      <div>
        <div className="page-header"><div className="skeleton" style={{ height: 36, width: 280 }} /></div>
        <div className="skeleton" style={{ height: 400 }} />
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="animate-fade-in">
        <div className="page-header">
          <h1>Candidate Screening</h1>
          <p>Review candidates one at a time</p>
        </div>
        <div className="empty-state glass-card-static">
          <Eye size={64} />
          <h3>All Caught Up!</h3>
          <p>No pending candidates to review. Check back later for new applications.</p>
        </div>
      </div>
    );
  }

  const current = applications[currentIndex];
  if (!current) return null;

  const scoreColor = current.score >= 70 ? 'var(--success)' : current.score >= 40 ? 'var(--warning)' : 'var(--danger)';

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Candidate Screening</h1>
        <p>Reviewing {currentIndex + 1} of {applications.length} candidates</p>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }} className="animate-fade-in-up stagger-1">
        <button className="btn btn-secondary btn-sm" onClick={() => setCurrentIndex(i => Math.max(0, i - 1))} disabled={currentIndex === 0}>
          <ChevronLeft size={16} /> Previous
        </button>
        <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
          Candidate {currentIndex + 1} of {applications.length}
        </span>
        <button className="btn btn-secondary btn-sm" onClick={() => setCurrentIndex(i => Math.min(applications.length - 1, i + 1))} disabled={currentIndex === applications.length - 1}>
          Next <ChevronRight size={16} />
        </button>
      </div>

      <div className="screening-layout animate-scale-in" key={current.id}>
        {/* Candidate Profile */}
        <div className="glass-card-static screening-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div className="profile-avatar" style={{ width: 64, height: 64, fontSize: '1.5rem' }}>
              {current.seekerName?.[0] || '?'}
            </div>
            <div>
              <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 700 }}>{current.seekerName}</h2>
              <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
                {current.seeker?.email || 'No email'}
              </p>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Skills</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {current.seeker?.skills?.map(skill => {
                const isMatch = current.job?.requirements?.some(r => r.toLowerCase() === skill.toLowerCase());
                return (
                  <span key={skill} className={`badge ${isMatch ? 'badge-success' : 'badge-neutral'}`}>
                    {isMatch && <CheckCircle size={10} />} {skill}
                  </span>
                );
              }) || <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-sm)' }}>No skills listed</span>}
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Applied For</h4>
            <div style={{ padding: '12px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ fontWeight: 600, fontSize: 'var(--font-sm)' }}>{current.jobTitle}</p>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>{current.company}</p>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Resume</h4>
            <button className="btn btn-secondary btn-sm">
              <FileText size={14} /> View Resume
            </button>
          </div>
        </div>

        {/* Score & Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-card-static screening-panel" style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: 'var(--font-base)', fontWeight: 700, marginBottom: '20px' }}>Match Score</h3>
            <div className="score-circle">
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `4px solid ${scoreColor}`, opacity: 0.2 }} />
              <span className="score-value" style={{ color: scoreColor }}>{current.score}</span>
              <span className="score-label">/ 100</span>
            </div>

            {/* Score Breakdown */}
            <div style={{ textAlign: 'left', marginTop: '20px' }}>
              <h4 style={{ fontSize: 'var(--font-sm)', fontWeight: 600, marginBottom: '12px' }}>Requirements Match</h4>
              {current.job?.requirements?.map(req => {
                const matched = current.seeker?.skills?.some(s => s.toLowerCase() === req.toLowerCase());
                return (
                  <div key={req} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '6px 0', fontSize: 'var(--font-sm)'
                  }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{req}</span>
                    {matched ? (
                      <CheckCircle size={16} style={{ color: 'var(--success)' }} />
                    ) : (
                      <XCircle size={16} style={{ color: 'var(--danger)', opacity: 0.5 }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="glass-card-static" style={{ padding: '20px', display: 'flex', gap: '12px' }}>
            <button
              className="btn btn-danger"
              style={{ flex: 1 }}
              onClick={() => handleAction(current.id, 'rejected')}
            >
              <XCircle size={18} /> Reject
            </button>
            <button
              className="btn btn-success"
              style={{ flex: 1 }}
              onClick={() => handleAction(current.id, 'shortlisted')}
            >
              <CheckCircle size={18} /> Shortlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
