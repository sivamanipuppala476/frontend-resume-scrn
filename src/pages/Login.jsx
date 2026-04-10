import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Briefcase, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, error, clearError } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please fill in all fields', 'error');
      return;
    }
    setLoading(true);
    try {
      const result = await login(email, password);
      addToast('Welcome back!', 'success');
      // Role-based redirect
      const role = result.user.role;
      if (role === 'ADMIN') navigate('/admin/dashboard');
      else if (role === 'RECRUITER') navigate('/recruiter/dashboard');
      else navigate('/seeker/dashboard');
    } catch (err) {
      addToast(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="landing-hero-glow violet" style={{ top: '-300px', left: '-200px' }} />
      <div className="landing-hero-glow cyan" style={{ bottom: '-300px', right: '-200px' }} />

      <div className="auth-card glass-card-static">
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

        <h1>Welcome Back</h1>
        <p className="auth-subtitle">Sign in to access your dashboard</p>

        <form className="auth-form" onSubmit={handleSubmit}>
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
                value={email}
                onChange={e => { setEmail(e.target.value); clearError(); }}
                style={{ paddingLeft: '40px' }}
                id="login-email"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{
                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--text-tertiary)'
              }} />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={e => { setPassword(e.target.value); clearError(); }}
                style={{ paddingLeft: '40px', paddingRight: '40px' }}
                id="login-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--text-tertiary)', background: 'none', border: 'none', cursor: 'pointer'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
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
            id="login-submit"
            style={{ width: '100%', marginTop: '8px' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Accounts */}
        <div style={{
          marginTop: '24px', padding: '16px',
          background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)'
        }}>
          <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginBottom: '8px', fontWeight: 600 }}>
            Demo Accounts:
          </p>
          <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div><strong>Seeker:</strong> alex@example.com / password123</div>
            <div><strong>Recruiter:</strong> mike@techcorp.com / password123</div>
            <div><strong>Admin:</strong> admin@hireflow.com / admin123</div>
          </div>
        </div>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Create one</Link>
        </div>
      </div>
    </div>
  );
}
