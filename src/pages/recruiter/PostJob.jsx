import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { jobsAPI } from '../../services/api';
import { Briefcase, MapPin, DollarSign, Clock, FileText, Plus, X, Eye, Send } from 'lucide-react';

export default function PostJob() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [form, setForm] = useState({
    title: '',
    location: '',
    type: 'Full-time',
    salary: '',
    description: '',
    requirements: [],
    responsibilities: [],
    benefits: []
  });
  const [newReq, setNewReq] = useState('');
  const [newResp, setNewResp] = useState('');
  const [newBenefit, setNewBenefit] = useState('');

  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const addTag = (field, value, setter) => {
    if (value.trim() && !form[field].includes(value.trim())) {
      setForm(prev => ({ ...prev, [field]: [...prev[field], value.trim()] }));
      setter('');
    }
  };

  const removeTag = (field, value) => {
    setForm(prev => ({ ...prev, [field]: prev[field].filter(v => v !== value) }));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.location || !form.description) {
      addToast('Please fill in all required fields', 'error');
      return;
    }
    if (form.requirements.length === 0) {
      addToast('Please add at least one requirement', 'error');
      return;
    }
    setLoading(true);
    try {
      await jobsAPI.create({
        ...form,
        company: user.company || 'Unknown Company',
        recruiterId: user.id
      });
      addToast('Job posted successfully!', 'success');
      navigate('/recruiter/jobs');
    } catch (err) {
      addToast(err.message || 'Failed to post job', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Post a New Job</h1>
        <p>Create a job listing to attract top candidates</p>
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: '1fr 380px', alignItems: 'start' }}>
        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-card-static animate-fade-in-up stagger-1" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 700, marginBottom: '20px' }}>Job Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Job Title *</label>
                <input className="form-input" placeholder="e.g., Senior React Developer" value={form.title} onChange={e => updateField('title', e.target.value)} id="job-title" />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Location *</label>
                  <input className="form-input" placeholder="e.g., San Francisco, CA or Remote" value={form.location} onChange={e => updateField('location', e.target.value)} id="job-location" />
                </div>
                <div className="form-group">
                  <label className="form-label">Job Type</label>
                  <select className="form-select" value={form.type} onChange={e => updateField('type', e.target.value)} id="job-type">
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Salary Range</label>
                <input className="form-input" placeholder="e.g., $100,000 - $150,000" value={form.salary} onChange={e => updateField('salary', e.target.value)} id="job-salary" />
              </div>
              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea className="form-textarea" placeholder="Describe the role, team, and what makes this opportunity unique..." value={form.description} onChange={e => updateField('description', e.target.value)} style={{ minHeight: 160 }} id="job-description" />
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="glass-card-static animate-fade-in-up stagger-2" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 700, marginBottom: '20px' }}>Required Skills *</h3>
            <div className="tag-input-wrapper" onClick={() => document.getElementById('req-input')?.focus()}>
              {form.requirements.map(req => (
                <span key={req} className="tag-item">
                  {req}
                  <button onClick={e => { e.stopPropagation(); removeTag('requirements', req); }}><X size={14} /></button>
                </span>
              ))}
              <input id="req-input" className="tag-input-field" placeholder="Type skill + Enter" value={newReq} onChange={e => setNewReq(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag('requirements', newReq, setNewReq))} />
            </div>
          </div>

          {/* Responsibilities */}
          <div className="glass-card-static animate-fade-in-up stagger-3" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 700, marginBottom: '20px' }}>Responsibilities</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
              {form.responsibilities.map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ flex: 1, fontSize: 'var(--font-sm)' }}>{r}</span>
                  <button className="btn btn-ghost btn-sm" onClick={() => removeTag('responsibilities', r)} style={{ color: 'var(--danger)', padding: 4 }}><X size={14} /></button>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input className="form-input" placeholder="Add a responsibility" value={newResp} onChange={e => setNewResp(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag('responsibilities', newResp, setNewResp))} />
              <button className="btn btn-secondary btn-sm" onClick={() => addTag('responsibilities', newResp, setNewResp)}><Plus size={16} /></button>
            </div>
          </div>

          {/* Benefits */}
          <div className="glass-card-static animate-fade-in-up stagger-4" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 700, marginBottom: '20px' }}>Benefits</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
              {form.benefits.map(b => (
                <span key={b} className="badge badge-success" style={{ cursor: 'pointer' }} onClick={() => removeTag('benefits', b)}>
                  {b} ×
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input className="form-input" placeholder="e.g., Health Insurance" value={newBenefit} onChange={e => setNewBenefit(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag('benefits', newBenefit, setNewBenefit))} />
              <button className="btn btn-secondary btn-sm" onClick={() => addTag('benefits', newBenefit, setNewBenefit)}><Plus size={16} /></button>
            </div>
          </div>
        </div>

        {/* Sidebar Preview */}
        <div className="glass-card-static animate-fade-in-up stagger-5" style={{ padding: '24px', position: 'sticky', top: 'calc(var(--navbar-height) + 24px)' }}>
          <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 700, marginBottom: '20px' }}>
            <Eye size={18} style={{ marginRight: 8, verticalAlign: 'middle' }} />
            Preview
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h4 style={{ fontSize: 'var(--font-base)', fontWeight: 700 }}>{form.title || 'Job Title'}</h4>
              <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>{user?.company || 'Company'}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {form.location && <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} /> {form.location}</span>}
              <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} /> {form.type}</span>
              {form.salary && <span style={{ fontSize: 'var(--font-sm)', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}><DollarSign size={14} /> {form.salary}</span>}
            </div>

            {form.requirements.length > 0 && (
              <div>
                <p style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: '6px' }}>SKILLS</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {form.requirements.map(r => <span key={r} className="badge badge-primary">{r}</span>)}
                </div>
              </div>
            )}

            {form.description && (
              <div>
                <p style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: '6px' }}>DESCRIPTION</p>
                <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {form.description.length > 200 ? form.description.slice(0, 200) + '...' : form.description}
                </p>
              </div>
            )}
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={loading} id="post-job-submit" style={{ width: '100%' }}>
              <Send size={16} /> {loading ? 'Posting...' : 'Publish Job'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
