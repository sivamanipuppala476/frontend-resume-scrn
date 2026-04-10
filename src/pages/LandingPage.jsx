import { Link } from 'react-router-dom';
import { Briefcase, Target, BarChart3, Shield, Users, Zap, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav animate-fade-in">
        <div className="landing-nav-logo">
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'var(--gradient-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Briefcase size={20} color="white" />
          </div>
          <span className="gradient-text">HireFlow</span>
        </div>
        <div className="landing-nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it Works</a>
          <Link to="/login" className="btn btn-ghost">Sign In</Link>
          <Link to="/register" className="btn btn-primary">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="landing-hero">
        <div className="landing-hero-glow violet" />
        <div className="landing-hero-glow cyan" />

        <h1 className="animate-fade-in-up">
          Find Your Dream Job with{' '}
          <span className="gradient-text">AI-Powered</span>{' '}
          Matching
        </h1>
        <p className="animate-fade-in-up stagger-2">
          HireFlow connects top talent with leading companies using intelligent
          resume matching, smart scoring, and seamless application tracking.
        </p>
        <div className="landing-hero-buttons animate-fade-in-up stagger-3">
          <Link to="/register" className="btn btn-primary btn-lg">
            Start Hiring <ArrowRight size={18} />
          </Link>
          <Link to="/register" className="btn btn-secondary btn-lg">
            Find Jobs
          </Link>
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: '48px',
          marginTop: '80px', flexWrap: 'wrap'
        }} className="animate-fade-in-up stagger-4">
          {[
            { value: '10K+', label: 'Active Jobs' },
            { value: '50K+', label: 'Job Seekers' },
            { value: '2K+', label: 'Companies' },
            { value: '95%', label: 'Match Rate' }
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--font-3xl)', fontWeight: 800 }} className="gradient-text">
                {stat.value}
              </div>
              <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="landing-features" id="features">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: 'var(--font-3xl)', fontWeight: 800, marginBottom: '8px' }}
              className="animate-fade-in-up">
            Everything You Need to <span className="gradient-text">Succeed</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-lg)' }}>
            Powerful tools for both job seekers and recruiters
          </p>
        </div>

        <div className="landing-features-grid">
          {[
            {
              icon: Target,
              title: 'Smart Matching',
              description: 'Our AI analyzes resumes and job requirements to calculate compatibility scores, ensuring the best matches.',
              gradient: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(124,58,237,0.05))'
            },
            {
              icon: BarChart3,
              title: 'Score-Based Ranking',
              description: 'Candidates are ranked by relevance score, helping recruiters quickly identify top talent from the pool.',
              gradient: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(6,182,212,0.05))'
            },
            {
              icon: Shield,
              title: 'Secure Platform',
              description: 'Enterprise-grade security with JWT authentication, role-based access, and encrypted data storage.',
              gradient: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.05))'
            },
            {
              icon: Users,
              title: 'Team Collaboration',
              description: 'Recruiters can collaborate on candidate evaluation, share notes, and manage the hiring pipeline together.',
              gradient: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.05))'
            },
            {
              icon: Zap,
              title: 'Lightning Fast',
              description: 'Optimized for speed — browse thousands of jobs, upload resumes, and apply in seconds.',
              gradient: 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.05))'
            },
            {
              icon: Briefcase,
              title: 'Application Tracking',
              description: 'Track every application in real-time with status updates from applied to hired.',
              gradient: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(59,130,246,0.05))'
            }
          ].map((feature, i) => (
            <div
              key={feature.title}
              className={`glass-card landing-feature-card animate-fade-in-up stagger-${i + 1}`}
            >
              <div className="icon-wrapper" style={{ background: feature.gradient }}>
                <feature.icon size={28} style={{ color: 'var(--text-primary)' }} />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="landing-how-it-works" id="how-it-works">
        <h2 className="animate-fade-in-up">
          How <span className="gradient-text">HireFlow</span> Works
        </h2>
        <div className="how-it-works-steps">
          {[
            { step: 1, title: 'Create Account', desc: 'Sign up as a job seeker or recruiter in under a minute' },
            { step: 2, title: 'Build Profile', desc: 'Upload your resume or post job openings with requirements' },
            { step: 3, title: 'Get Matched', desc: 'Our AI matches candidates with the most relevant positions' },
            { step: 4, title: 'Get Hired', desc: 'Apply, interview, and land your dream job seamlessly' }
          ].map((item, i) => (
            <div key={item.step} className={`how-step animate-fade-in-up stagger-${i + 1}`}>
              <div className="step-number">{item.step}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        maxWidth: 1200, margin: '0 auto', padding: '80px 48px', textAlign: 'center'
      }}>
        <div className="glass-card-static" style={{ padding: '64px', background: 'var(--gradient-card)' }}>
          <h2 style={{ fontSize: 'var(--font-3xl)', fontWeight: 800, marginBottom: '16px' }}>
            Ready to Transform Your Hiring?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-lg)', marginBottom: '32px', maxWidth: 500, margin: '0 auto 32px' }}>
            Join thousands of companies and job seekers already using HireFlow.
          </p>
          <Link to="/register" className="btn btn-primary btn-lg">
            Get Started Free <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>© 2026 HireFlow. Built with ❤️ for better hiring.</p>
      </footer>
    </div>
  );
}
