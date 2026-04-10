import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Briefcase, User, Building2, Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';

export default function Register() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', company: ''
  });
  const [loading, setLoading] = useState(false);
  const { register, error, clearError } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    clearError();
  };

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
  };

  const handleNext = () => {
    if (!role) {
      addToast('Please select a role', 'error');
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      addToast('Please fill in all required fields', 'error');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      addToast('Passwords do not match', 'error');
      return;
    }
    if (formData.password.length < 6) {
      addToast('Password must be at least 6 characters', 'error');
      return;
    }
    if (role === 'RECRUITER' && !formData.company) {
      addToast('Company name is required for recruiters', 'error');
      return;
    }

    setLoading(true);
    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role,
        ...(role === 'RECRUITER' ? { company: formData.company } : {})
      };
      await register(userData);
      addToast('Account created successfully!', 'success');
      if (role === 'RECRUITER') navigate('/recruiter/dashboard');
      else navigate('/seeker/dashboard');
    } catch (err) {
      addToast(err.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="landing-hero-glow violet" style={{ top: '-300px', left: '-200px' }} />
      <div className="landing-hero-glow cyan" style={{ bottom: '-300px', right: '-200px' }} />

      <div className="auth-card glass-card-static" style={{ maxWidth: step === 1 ? 500 : 440 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'var(--gradient-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Briefcase size={22} color="white" />
          </div>
          <span className="gradient-text" style={{ fontSize: 'var(--font-xl)', fontWeight: 800 }}>HireFlow</span>
        </div>

        {step === 1 ? (
          /* Step 1: Role Selection */
          <div className="animate-fade-in">
            <h1>Join HireFlow</h1>
            <p className="auth-subtitle">Choose how you want to use HireFlow</p>

            <div className="role-selection">
              <div
                className={`role-card ${role === 'SEEKER' ? 'selected' : ''}`}
                onClick={() => handleRoleSelect('SEEKER')}
                id="role-seeker"
              >
                <div className="role-icon">
                  <User size={22} color="white" />
                </div>
                <h3>Job Seeker</h3>
                <p>Find jobs, upload your resume, and track applications</p>
              </div>
              <div
                className={`role-card ${role === 'RECRUITER' ? 'selected' : ''}`}
                onClick={() => handleRoleSelect('RECRUITER')}
                id="role-recruiter"
              >
                <div className="role-icon">
                  <Building2 size={22} color="white" />
                </div>
                <h3>Recruiter</h3>
                <p>Post jobs, review candidates, and manage hiring</p>
              </div>
            </div>

            <button
              className="btn btn-primary btn-lg"
              onClick={handleNext}
              style={{ width: '100%' }}
              id="role-next"
            >
              Continue <ArrowRight size={18} />
            </button>

            <div className="auth-footer">
              Already have an account? <Link to="/login">Sign in</Link>
            </div>
          </div>
        ) : (
          /* Step 2: Details Form */
          <div className="animate-fade-in">
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setStep(1)}
              style={{ marginBottom: '16px' }}
            >
              <ArrowLeft size={16} /> Back
            </button>

            <h1>Create Account</h1>
            <p className="auth-subtitle">
              {role === 'RECRUITER' ? 'Set up your recruiter profile' : 'Set up your job seeker profile'}
            </p>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{
                    position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                    color: 'var(--text-tertiary)'
                  }} />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={e => updateField('name', e.target.value)}
                    style={{ paddingLeft: '40px' }}
                    id="register-name"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{
                    position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                    color: 'var(--text-tertiary)'
                  }} />
                  <input
                    type="email"
                    className="form-input"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={e => updateField('email', e.target.value)}
                    style={{ paddingLeft: '40px' }}
                    id="register-email"
                  />
                </div>
              </div>

              {role === 'RECRUITER' && (
                <div className="form-group">
                  <label className="form-label">Company Name</label>
                  <div style={{ position: 'relative' }}>
                    <Building2 size={18} style={{
                      position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                      color: 'var(--text-tertiary)'
                    }} />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Acme Inc."
                      value={formData.company}
                      onChange={e => updateField('company', e.target.value)}
                      style={{ paddingLeft: '40px' }}
                      id="register-company"
                    />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{
                    position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                    color: 'var(--text-tertiary)'
                  }} />
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Min 6 characters"
                    value={formData.password}
                    onChange={e => updateField('password', e.target.value)}
                    style={{ paddingLeft: '40px' }}
                    id="register-password"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{
                    position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                    color: 'var(--text-tertiary)'
                  }} />
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={e => updateField('confirmPassword', e.target.value)}
                    style={{ paddingLeft: '40px' }}
                    id="register-confirm"
                  />
                </div>
              </div>

              {error && (
                <div className="form-error" style={{ padding: '8px 12px', background: 'var(--danger-soft)', borderRadius: 8 }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={loading}
                id="register-submit"
                style={{ width: '100%', marginTop: '8px' }}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="auth-footer">
              Already have an account? <Link to="/login">Sign in</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
