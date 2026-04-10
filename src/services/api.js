import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---- Auth API ----
export const authAPI = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return { user: response.data, token: response.data.token };
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return { user: response.data, token: response.data.token };
  },

  async getProfile(userId) {
    // Current backend doesn't have a direct /profile/{id} but we can use the stored user info
    // or create a dummy helper. For now, we return stored user if needed.
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  },

  async updateProfile(userId, updates) {
    // Placeholder as backend doesn't have profile update yet
    console.warn('Profile update not implemented on backend');
    return updates;
  }
};

// ---- Jobs API ----
export const jobsAPI = {
  async getAll(filters = {}) {
    const response = await api.get('/jobs');
    let filtered = response.data;

    if (filters.search) {
      const s = filters.search.toLowerCase();
      filtered = filtered.filter(j =>
        j.title.toLowerCase().includes(s) ||
        (j.description && j.description.toLowerCase().includes(s)) ||
        (j.requiredSkills && j.requiredSkills.toLowerCase().includes(s))
      );
    }
    return filtered;
  },

  async getById(id) {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  async getByRecruiter(recruiterId) {
    const response = await api.get('/jobs/my-postings');
    return response.data;
  },

  async create(jobData) {
    const response = await api.post('/jobs', jobData);
    return response.data;
  },

  async update(id, updates) {
    const response = await api.put(`/jobs/${id}`, updates);
    return response.data;
  },

  async delete(id) {
    await api.delete(`/jobs/${id}`);
    return { success: true };
  }
};

// ---- Applications API ----
export const applicationsAPI = {
  async getBySeeker(seekerId) {
    const response = await api.get('/applications/seeker');
    return response.data;
  },

  async getByJob(jobId) {
    const response = await api.get(`/applications/job/${jobId}`);
    return response.data;
  },

  async getByRecruiter(recruiterId) {
    // Backend doesn't have a global "get all apps for recruiter" yet, 
    // it usually expects jobId. Frontend might need migration if it calls this.
    console.warn('getByRecruiter called without jobId - returning empty list');
    return [];
  },

  async apply(jobId, resumeId) {
    const response = await api.post('/applications', { jobId, resumeId });
    return response.data;
  },

  async updateStatus(applicationId, status) {
    const response = await api.put(`/applications/${applicationId}/status?status=${status}`);
    return response.data;
  }
};

// ---- Resumes API ----
export const resumesAPI = {
  async getBySeeker(seekerId) {
    const response = await api.get('/resumes');
    return response.data;
  },

  async upload(seekerId, file, skillsText = '') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('skillsText', skillsText);
    
    const response = await api.post('/resumes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async delete(resumeId) {
    await api.delete(`/resumes/${resumeId}`);
    return { success: true };
  }
};

// ---- Admin / Users API (Placeholders) ----
export const adminAPI = {
  async getAnalytics() {
    return {
      totalUsers: 0,
      totalJobs: 0,
      totalApplications: 0,
      recentActivity: []
    };
  },

  async getAllUsers() {
    return [];
  },

  async updateUserStatus(userId, status) {
    return { success: true };
  },

  async deleteUser(userId) {
    return { success: true };
  }
};

