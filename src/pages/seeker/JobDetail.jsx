import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { jobsAPI, applicationsAPI } from '../../services/api';
import { calculateMatchScore } from '../../services/mockData';
import {
  ArrowLeft, MapPin, Clock, DollarSign, Users, Calendar,
  Star, CheckCircle2, Briefcase, Building2
} from 'lucide-react';

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadJob();
  }, [id]);

  const loadJob = async () => {
    try {
      const data = await jobsAPI.getById(id);
      setJob(data);
      // Check if already applied
      const apps = await applicationsAPI.getBySeeker(user.id);
      setApplied(apps.some(a => a.jobId === id));
    } catch (err) {
      addToast('Job not found', 'error');
      navigate('/seeker/jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    setApplying(true);
    try {
      await applicationsAPI.apply(id, user.id);
      setApplied(true);
      setShowModal(false);
      addToast('Application submitted successfully!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to apply', 'error');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="skeleton" style={{ height: 32, width: 100, marginBottom: 24 }} />
        <div className="skeleton" style={{ height: 300, marginBottom: 24 }} />
      </div>
    );
  }

  if (!job) return null;

  const matchScore = calculateMatchScore(user?.skills || [], job.requirements);
  const scoreColor = matchScore >= 70 ? 'var(--success)' : matchScore >= 40 ? 'var(--warning)' : 'var(--danger)';

  return (
    <div className="animate-fade-in">
      <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>
        <ArrowLeft size={16} /> Back to Jobs
      </button>

      <div className="grid-2" style={{ gridTemplateColumns: '1fr 340px', alignItems: 'start' }}>
        {/* Main Content */}
        <div>
          <div className="glass-card-static animate-fade-in-up stagger-1" style={{ padding: '32px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '24px' }}>
              <div className="job-company-logo" style={{ width: 64, height: 64, fontSize: 'var(--font-2xl)' }}>
                {job.company[0]}
              </div>
              <div style={{ flex: 1 }}>
                <h1 style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, marginBottom: '4px' }}>{job.title}</h1>
                <p style={{ fontSize: 'var(--font-base)', color: 'var(--text-secondary)' }}>{job.company}</p>
                <div style={{ display: 'flex', gap: '20px', marginTop: '12px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={16} /> {job.location}
                  </span>
                  <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={16} /> {job.type}
                  </span>
                  <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <DollarSign size={16} /> {job.salary}
                  </span>
                  <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={16} /> Posted {job.postedDate}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 700, marginBottom: '12px' }}>About this role</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 'var(--font-sm)' }}>{job.description}</p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 700, marginBottom: '12px' }}>Responsibilities</h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {job.responsibilities?.map((resp, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
                    <CheckCircle2 size={16} style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} />
                    {resp}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 700, marginBottom: '12px' }}>Required Skills</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {job.requirements?.map(req => {
                  const hasSkill = user?.skills?.some(s => s.toLowerCase() === req.toLowerCase());
                  return (
                    <span key={req} className={`badge ${hasSkill ? 'badge-success' : 'badge-neutral'}`}>
                      {hasSkill && <CheckCircle2 size={12} />}
                      {req}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Match Score */}
          <div className="glass-card-static animate-fade-in-up stagger-2" style={{ padding: '24px', textAlign: 'center' }}>
            <h3 style={{ fontSize: 'var(--font-base)', fontWeight: 700, marginBottom: '16px' }}>Your Match Score</h3>
            <div className="score-circle" style={{ borderColor: scoreColor }}>
              <div style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                border: `4px solid ${scoreColor}`, opacity: 0.3
              }} />
              <div style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                border: `4px solid ${scoreColor}`,
                clipPath: `polygon(0 0, 100% 0, 100% ${100 - matchScore}%, 0 ${100 - matchScore}%)`,
                opacity: 0
              }} />
              <span className="score-value" style={{ color: scoreColor }}>{matchScore}%</span>
              <span className="score-label">Match</span>
            </div>
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>
              Based on your skills vs job requirements
            </p>
          </div>

          {/* Apply Button */}
          <div className="glass-card-static animate-fade-in-up stagger-3" style={{ padding: '24px' }}>
            {applied ? (
              <div style={{ textAlign: 'center' }}>
                <CheckCircle2 size={32} style={{ color: 'var(--success)', margin: '0 auto 12px' }} />
                <p style={{ fontWeight: 600, color: 'var(--success)' }}>Already Applied</p>
                <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Track your application status in My Applications
                </p>
              </div>
            ) : (
              <>
                <button
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%' }}
                  onClick={() => setShowModal(true)}
                  id="apply-btn"
                >
                  <Briefcase size={18} /> Apply Now
                </button>
                <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', textAlign: 'center', marginTop: '8px' }}>
                  {job.applicants} applicants so far
                </p>
              </>
            )}
          </div>

          {/* Benefits */}
          {job.benefits && (
            <div className="glass-card-static animate-fade-in-up stagger-4" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: 'var(--font-base)', fontWeight: 700, marginBottom: '12px' }}>Benefits</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {job.benefits.map(benefit => (
                  <span key={benefit} style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={14} style={{ color: 'var(--accent-violet)' }} />
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Apply Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirm Application</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              You are applying for <strong>{job.title}</strong> at <strong>{job.company}</strong>.
              Your profile and resume will be shared with the recruiter.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleApply} disabled={applying} id="confirm-apply">
                {applying ? 'Applying...' : 'Confirm & Apply'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
