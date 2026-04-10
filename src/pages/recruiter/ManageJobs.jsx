import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { jobsAPI } from '../../services/api';
import { Briefcase, Edit3, Trash2, Users, MapPin, Clock, MoreVertical, Eye, EyeOff } from 'lucide-react';

export default function ManageJobs() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const data = await jobsAPI.getByRecruiter(user.id);
      setJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!confirm('Are you sure you want to delete this job posting?')) return;
    try {
      await jobsAPI.delete(jobId);
      setJobs(prev => prev.filter(j => j.id !== jobId));
      addToast('Job posting deleted', 'info');
    } catch (err) {
      addToast('Failed to delete job', 'error');
    }
  };

  const handleToggleStatus = async (jobId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'closed' : 'active';
    try {
      await jobsAPI.update(jobId, { status: newStatus });
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: newStatus } : j));
      addToast(`Job ${newStatus === 'active' ? 'activated' : 'closed'}`, 'success');
    } catch (err) {
      addToast('Failed to update job', 'error');
    }
  };

  if (loading) {
    return (
      <div>
        <div className="page-header"><div className="skeleton" style={{ height: 36, width: 250 }} /></div>
        {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 80, marginBottom: 12 }} />)}
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Manage Jobs</h1>
        <p>View and manage all your job postings</p>
      </div>

      {jobs.length === 0 ? (
        <div className="empty-state glass-card-static">
          <Briefcase size={64} />
          <h3>No Job Postings</h3>
          <p>Create your first job posting to start receiving applications</p>
        </div>
      ) : (
        <div className="glass-card-static animate-fade-in-up stagger-1" style={{ overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Location</th>
                <th>Type</th>
                <th>Applicants</th>
                <th>Status</th>
                <th>Posted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job, i) => (
                <tr key={job.id} className={`animate-fade-in stagger-${(i % 5) + 1}`}>
                  <td>
                    <div>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{job.title}</span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                        {job.requirements?.slice(0, 3).map(r => (
                          <span key={r} className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>{r}</span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={14} /> {job.location}
                    </span>
                  </td>
                  <td><span className="badge badge-primary">{job.type}</span></td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                      <Users size={14} /> {job.applicants}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${job.status === 'active' ? 'badge-success' : 'badge-neutral'}`}>
                      {job.status === 'active' ? 'Active' : 'Closed'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-tertiary)' }}>{job.postedDate}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        className="btn btn-ghost btn-icon btn-sm"
                        title={job.status === 'active' ? 'Close job' : 'Reactivate'}
                        onClick={() => handleToggleStatus(job.id, job.status)}
                      >
                        {job.status === 'active' ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button
                        className="btn btn-ghost btn-icon btn-sm"
                        title="Delete"
                        onClick={() => handleDelete(job.id)}
                        style={{ color: 'var(--danger)' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
