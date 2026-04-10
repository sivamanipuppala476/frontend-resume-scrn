import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { authAPI } from '../../services/api';
import { User, Mail, Phone, MapPin, FileText, Save, Plus, X } from 'lucide-react';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || '',
    experience: user?.experience || '',
    skills: user?.skills || []
  });
  const [newSkill, setNewSkill] = useState('');

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !form.skills.includes(newSkill.trim())) {
      setForm(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill) => {
    setForm(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updated = await authAPI.updateProfile(user.id, form);
      updateUser(updated);
      addToast('Profile updated successfully!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>My Profile</h1>
        <p>Manage your personal information and skills</p>
      </div>

      {/* Profile Header Card */}
      <div className="glass-card-static profile-header animate-fade-in-up stagger-1">
        <div className="profile-avatar">
          {user?.name?.[0] || 'U'}
        </div>
        <div className="profile-info" style={{ flex: 1 }}>
          <h2>{user?.name || 'User'}</h2>
          <p>{user?.email}</p>
          <div className="profile-completion" style={{ maxWidth: 300 }}>
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${user?.profileCompletion || 30}%` }} />
            </div>
            <span style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: 'var(--text-secondary)' }}>
              {user?.profileCompletion || 30}%
            </span>
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Personal Info */}
        <div className="glass-card-static animate-fade-in-up stagger-2" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 700, marginBottom: '20px' }}>Personal Information</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                <input className="form-input" value={form.name} onChange={e => updateField('name', e.target.value)} style={{ paddingLeft: 40 }} id="profile-name" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                <input className="form-input" value={form.email} onChange={e => updateField('email', e.target.value)} style={{ paddingLeft: 40 }} id="profile-email" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                <input className="form-input" placeholder="+1 555-0000" value={form.phone} onChange={e => updateField('phone', e.target.value)} style={{ paddingLeft: 40 }} id="profile-phone" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                <input className="form-input" placeholder="City, State" value={form.location} onChange={e => updateField('location', e.target.value)} style={{ paddingLeft: 40 }} id="profile-location" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Experience</label>
              <input className="form-input" placeholder="e.g., 5 years" value={form.experience} onChange={e => updateField('experience', e.target.value)} id="profile-experience" />
            </div>
          </div>
        </div>

        {/* Bio & Skills */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-card-static animate-fade-in-up stagger-3" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 700, marginBottom: '20px' }}>About Me</h3>
            <textarea
              className="form-textarea"
              placeholder="Tell us about yourself, your experience, and what you're looking for..."
              value={form.bio}
              onChange={e => updateField('bio', e.target.value)}
              style={{ minHeight: 140 }}
              id="profile-bio"
            />
          </div>

          <div className="glass-card-static animate-fade-in-up stagger-4" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 700, marginBottom: '20px' }}>Skills</h3>
            <div className="tag-input-wrapper" onClick={() => document.getElementById('skill-input')?.focus()}>
              {form.skills.map(skill => (
                <span key={skill} className="tag-item">
                  {skill}
                  <button onClick={(e) => { e.stopPropagation(); removeSkill(skill); }}>
                    <X size={14} />
                  </button>
                </span>
              ))}
              <input
                id="skill-input"
                className="tag-input-field"
                placeholder="Type a skill and press Enter"
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginTop: '8px' }}>
              Press Enter to add a skill. Click × to remove.
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn btn-primary btn-lg" onClick={handleSave} disabled={loading} id="profile-save">
          <Save size={18} />
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
