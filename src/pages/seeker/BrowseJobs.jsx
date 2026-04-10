import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { jobsAPI } from '../../services/api';
import { calculateMatchScore } from '../../services/mockData';
import { Search, MapPin, Clock, DollarSign, Star, Briefcase, Filter } from 'lucide-react';

export default function BrowseJobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    loadJobs();
  }, [search, typeFilter, locationFilter]);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const data = await jobsAPI.getAll({ search, type: typeFilter, location: locationFilter });
      // Calculate match scores
      const withScores = data.map(job => ({
        ...job,
        matchScore: calculateMatchScore(user?.skills || [], job.requirements)
      }));
      // Sort by match score
      withScores.sort((a, b) => b.matchScore - a.matchScore);
      setJobs(withScores);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Browse Jobs</h1>
        <p>Discover opportunities matched to your skills</p>
      </div>

      {/* Search & Filters */}
      <div className="search-bar-wrapper animate-fade-in-up stagger-1">
        <div className="search-input-wrapper">
          <Search size={18} />
          <input
            placeholder="Search jobs by title, company, or skill..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            id="job-search"
          />
        </div>
        <select
          className="form-select"
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          style={{ maxWidth: 160 }}
          id="job-type-filter"
        >
          <option value="">All Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Remote">Remote</option>
        </select>
        <select
          className="form-select"
          value={locationFilter}
          onChange={e => setLocationFilter(e.target.value)}
          style={{ maxWidth: 180 }}
          id="job-location-filter"
        >
          <option value="">All Locations</option>
          <option value="San Francisco">San Francisco</option>
          <option value="New York">New York</option>
          <option value="Austin">Austin</option>
          <option value="Seattle">Seattle</option>
          <option value="Remote">Remote</option>
        </select>
      </div>

      {/* Results Count */}
      <p style={{
        fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)',
        marginBottom: '20px'
      }}>
        {jobs.length} job{jobs.length !== 1 ? 's' : ''} found
      </p>

      {/* Job Cards Grid */}
      {loading ? (
        <div className="grid-2">
          {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 220 }} />)}
        </div>
      ) : jobs.length === 0 ? (
        <div className="empty-state glass-card-static">
          <Briefcase size={64} />
          <h3>No Jobs Found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid-2">
          {jobs.map((job, i) => (
            <Link
              key={job.id}
              to={`/seeker/jobs/${job.id}`}
              className={`glass-card job-card animate-fade-in-up stagger-${(i % 6) + 1}`}
              style={{ textDecoration: 'none' }}
            >
              <div className="job-card-header">
                <div className="job-company-logo">
                  {job.company[0]}
                </div>
                <div className="job-card-info">
                  <h3>{job.title}</h3>
                  <p>{job.company}</p>
                </div>
                <div className={`match-score ${getScoreColor(job.matchScore)}`}>
                  <Star size={14} />
                  {job.matchScore}%
                </div>
              </div>

              <div className="job-card-tags">
                {job.requirements.slice(0, 4).map(req => (
                  <span key={req} className="badge badge-neutral">{req}</span>
                ))}
                {job.requirements.length > 4 && (
                  <span className="badge badge-neutral">+{job.requirements.length - 4}</span>
                )}
              </div>

              <div className="job-card-footer">
                <div style={{ display: 'flex', gap: '16px' }}>
                  <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} /> {job.location}
                  </span>
                  <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> {job.type}
                  </span>
                </div>
                <span className="job-salary">{job.salary?.split(' - ')[0]}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
