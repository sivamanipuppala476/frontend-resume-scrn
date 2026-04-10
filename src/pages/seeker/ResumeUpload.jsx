import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { resumesAPI } from '../../services/api';
import { Upload, FileText, Trash2, Download, File } from 'lucide-react';

export default function ResumeUpload() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      const data = await resumesAPI.getBySeeker(user.id);
      setResumes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file) => {
    if (!file) return;
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx)$/i)) {
      addToast('Please upload a PDF or Word document', 'error');
      return;
    }
    setUploading(true);
    try {
      const newResume = await resumesAPI.upload(user.id, file);
      setResumes(prev => [...prev, newResume]);
      addToast('Resume uploaded successfully!', 'success');
    } catch (err) {
      addToast('Failed to upload resume', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (resumeId) => {
    try {
      await resumesAPI.delete(resumeId);
      setResumes(prev => prev.filter(r => r.id !== resumeId));
      addToast('Resume deleted', 'info');
    } catch (err) {
      addToast('Failed to delete resume', 'error');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>My Resumes</h1>
        <p>Upload and manage your resume documents</p>
      </div>

      {/* Upload Zone */}
      <div
        className={`file-upload-zone animate-fade-in-up stagger-1 ${dragOver ? 'drag-over' : ''}`}
        onClick={() => fileRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setDragOver(false)}
        style={{ marginBottom: '32px' }}
      >
        <Upload size={48} />
        <h3>{uploading ? 'Uploading...' : 'Drop your resume here or click to browse'}</h3>
        <p>Supports PDF, DOC, DOCX — Max 5MB</p>
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={e => handleUpload(e.target.files[0])}
          style={{ display: 'none' }}
          id="resume-file-input"
        />
        {uploading && (
          <div className="progress-bar" style={{ maxWidth: 300, margin: '16px auto 0' }}>
            <div className="progress-bar-fill" style={{ width: '60%', animationName: 'shimmer', animationDuration: '1.5s', animationIterationCount: 'infinite' }} />
          </div>
        )}
      </div>

      {/* Resume List */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[1,2].map(i => <div key={i} className="skeleton" style={{ height: 72 }} />)}
        </div>
      ) : resumes.length === 0 ? (
        <div className="empty-state glass-card-static">
          <FileText size={64} />
          <h3>No Resumes Yet</h3>
          <p>Upload your first resume to start applying for jobs</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {resumes.map((resume, i) => (
            <div
              key={resume.id}
              className={`glass-card animate-fade-in-up stagger-${i + 2}`}
              style={{
                padding: '16px 20px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 'var(--radius-md)',
                  background: 'var(--accent-violet-soft)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <File size={22} style={{ color: 'var(--accent-violet)' }} />
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 'var(--font-sm)' }}>{resume.fileName}</p>
                  <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>
                    {resume.fileSize} • Uploaded {resume.uploadDate}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-ghost btn-sm" title="Download">
                  <Download size={16} />
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => handleDelete(resume.id)}
                  title="Delete"
                  style={{ color: 'var(--danger)' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
