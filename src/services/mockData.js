// ============================================
// HireFlow — Mock Data
// ============================================

export const mockUsers = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    password: 'password123',
    role: 'SEEKER',
    phone: '+1 555-0101',
    bio: 'Full-stack developer with 5 years of experience in React, Node.js, and cloud technologies. Passionate about building scalable web applications.',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'Python', 'PostgreSQL'],
    experience: '5 years',
    location: 'San Francisco, CA',
    avatar: null,
    profileCompletion: 85,
    createdAt: '2025-11-15',
    status: 'active'
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    password: 'password123',
    role: 'SEEKER',
    phone: '+1 555-0102',
    bio: 'UX Designer specializing in enterprise SaaS products. Expert in Figma, user research, and design systems.',
    skills: ['Figma', 'UI/UX', 'Design Systems', 'User Research', 'Prototyping'],
    experience: '4 years',
    location: 'New York, NY',
    avatar: null,
    profileCompletion: 72,
    createdAt: '2025-12-01',
    status: 'active'
  },
  {
    id: '3',
    name: 'Mike Rodriguez',
    email: 'mike@techcorp.com',
    password: 'password123',
    role: 'RECRUITER',
    company: 'TechCorp Solutions',
    phone: '+1 555-0201',
    bio: 'Senior Technical Recruiter at TechCorp Solutions. Hiring top engineering talent for our growing team.',
    createdAt: '2025-10-20',
    status: 'active'
  },
  {
    id: '4',
    name: 'Emily Parker',
    email: 'emily@innovate.io',
    password: 'password123',
    role: 'RECRUITER',
    company: 'Innovate.io',
    phone: '+1 555-0202',
    bio: 'Talent Acquisition Lead at Innovate.io. Building diverse engineering teams.',
    createdAt: '2025-11-05',
    status: 'active'
  },
  {
    id: '5',
    name: 'Admin User',
    email: 'admin@hireflow.com',
    password: 'admin123',
    role: 'ADMIN',
    createdAt: '2025-01-01',
    status: 'active'
  },
  {
    id: '6',
    name: 'James Wilson',
    email: 'james@example.com',
    password: 'password123',
    role: 'SEEKER',
    phone: '+1 555-0103',
    bio: 'Data Scientist with expertise in machine learning and NLP.',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'SQL', 'Machine Learning', 'NLP'],
    experience: '3 years',
    location: 'Austin, TX',
    avatar: null,
    profileCompletion: 90,
    createdAt: '2026-01-10',
    status: 'active'
  },
  {
    id: '7',
    name: 'Lisa Kim',
    email: 'lisa@example.com',
    password: 'password123',
    role: 'SEEKER',
    phone: '+1 555-0104',
    bio: 'DevOps engineer focused on Kubernetes, CI/CD, and infrastructure automation.',
    skills: ['Kubernetes', 'Docker', 'Terraform', 'AWS', 'CI/CD', 'Linux'],
    experience: '6 years',
    location: 'Seattle, WA',
    avatar: null,
    profileCompletion: 65,
    createdAt: '2026-02-14',
    status: 'active'
  },
  {
    id: '8',
    name: 'David Thompson',
    email: 'david@cloudnine.com',
    password: 'password123',
    role: 'RECRUITER',
    company: 'CloudNine Systems',
    phone: '+1 555-0203',
    bio: 'VP of Engineering at CloudNine Systems.',
    createdAt: '2025-09-15',
    status: 'active'
  }
];

export const mockJobs = [
  {
    id: '1',
    title: 'Senior React Developer',
    company: 'TechCorp Solutions',
    recruiterId: '3',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$130,000 - $170,000',
    description: 'We are looking for a Senior React Developer to join our frontend team. You will be responsible for building and maintaining high-performance web applications using React, TypeScript, and modern tooling. The ideal candidate has strong experience with state management, testing, and performance optimization.',
    requirements: ['React', 'TypeScript', 'Redux', 'Node.js', 'REST APIs', 'Git'],
    responsibilities: [
      'Develop and maintain web applications using React and TypeScript',
      'Collaborate with designers and backend engineers',
      'Write clean, maintainable, and well-tested code',
      'Mentor junior developers and conduct code reviews',
      'Participate in architectural decisions'
    ],
    benefits: ['Health Insurance', 'Remote Work', '401(k)', 'Stock Options', 'Learning Budget'],
    postedDate: '2026-03-28',
    status: 'active',
    applicants: 24
  },
  {
    id: '2',
    title: 'UX/UI Designer',
    company: 'Innovate.io',
    recruiterId: '4',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$110,000 - $140,000',
    description: 'Innovate.io is seeking a talented UX/UI Designer to create beautiful, intuitive interfaces for our SaaS platform. You will work closely with product managers and engineers to transform complex workflows into simple, elegant experiences.',
    requirements: ['Figma', 'UI/UX', 'Design Systems', 'Prototyping', 'User Research'],
    responsibilities: [
      'Design intuitive user interfaces for web and mobile',
      'Conduct user research and usability testing',
      'Create and maintain a comprehensive design system',
      'Collaborate with cross-functional teams',
      'Present design concepts to stakeholders'
    ],
    benefits: ['Health Insurance', 'Flexible Hours', 'PTO', 'Gym Membership'],
    postedDate: '2026-03-30',
    status: 'active',
    applicants: 18
  },
  {
    id: '3',
    title: 'Machine Learning Engineer',
    company: 'CloudNine Systems',
    recruiterId: '8',
    location: 'Remote',
    type: 'Full-time',
    salary: '$150,000 - $200,000',
    description: 'Join our AI team to build cutting-edge machine learning models for natural language processing and recommendation systems. You will work on large-scale data pipelines and deploy models to production.',
    requirements: ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning', 'NLP', 'SQL'],
    responsibilities: [
      'Design and implement ML models for NLP tasks',
      'Build and optimize data pipelines',
      'Deploy models to production at scale',
      'Collaborate with data engineers and product teams',
      'Stay current with latest ML research'
    ],
    benefits: ['Health Insurance', 'Remote Work', 'Stock Options', 'Conference Budget', 'Unlimited PTO'],
    postedDate: '2026-04-01',
    status: 'active',
    applicants: 31
  },
  {
    id: '4',
    title: 'DevOps Engineer',
    company: 'TechCorp Solutions',
    recruiterId: '3',
    location: 'Austin, TX',
    type: 'Full-time',
    salary: '$125,000 - $160,000',
    description: 'We need a skilled DevOps Engineer to manage our cloud infrastructure, CI/CD pipelines, and deployment workflows. Experience with Kubernetes and AWS is essential.',
    requirements: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'CI/CD', 'Linux'],
    responsibilities: [
      'Manage and optimize cloud infrastructure on AWS',
      'Build and maintain CI/CD pipelines',
      'Implement infrastructure as code with Terraform',
      'Monitor system performance and reliability',
      'Implement security best practices'
    ],
    benefits: ['Health Insurance', 'Remote Work', '401(k)', 'Learning Budget'],
    postedDate: '2026-04-02',
    status: 'active',
    applicants: 15
  },
  {
    id: '5',
    title: 'Full Stack Developer',
    company: 'Innovate.io',
    recruiterId: '4',
    location: 'Remote',
    type: 'Contract',
    salary: '$100,000 - $130,000',
    description: 'Looking for a Full Stack Developer to help build our next-generation platform. You will work across the stack using React, Node.js, and PostgreSQL.',
    requirements: ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'REST APIs'],
    responsibilities: [
      'Build full-stack features end-to-end',
      'Design and implement database schemas',
      'Write API endpoints and integrate with frontend',
      'Participate in code reviews and technical discussions'
    ],
    benefits: ['Flexible Hours', 'Remote Work'],
    postedDate: '2026-04-03',
    status: 'active',
    applicants: 22
  },
  {
    id: '6',
    title: 'Backend Java Developer',
    company: 'CloudNine Systems',
    recruiterId: '8',
    location: 'Seattle, WA',
    type: 'Full-time',
    salary: '$135,000 - $175,000',
    description: 'Seeking an experienced Java developer to build microservices for our cloud platform. Spring Boot expertise required.',
    requirements: ['Java', 'Spring Boot', 'Microservices', 'REST APIs', 'MySQL', 'Docker'],
    responsibilities: [
      'Design and develop microservices using Spring Boot',
      'Implement RESTful APIs',
      'Work with databases and message queues',
      'Write unit and integration tests'
    ],
    benefits: ['Health Insurance', 'Stock Options', '401(k)', 'Relocation Support'],
    postedDate: '2026-04-05',
    status: 'active',
    applicants: 19
  }
];

export const mockApplications = [
  {
    id: '1',
    jobId: '1',
    seekerId: '1',
    seekerName: 'Alex Johnson',
    jobTitle: 'Senior React Developer',
    company: 'TechCorp Solutions',
    appliedDate: '2026-04-01',
    status: 'reviewed',
    score: 92,
    resumeId: '1',
    coverLetter: 'I am excited to apply for this position. With 5 years of React experience...'
  },
  {
    id: '2',
    jobId: '3',
    seekerId: '6',
    seekerName: 'James Wilson',
    jobTitle: 'Machine Learning Engineer',
    company: 'CloudNine Systems',
    appliedDate: '2026-04-02',
    status: 'shortlisted',
    score: 88,
    resumeId: '3',
    coverLetter: 'As a data scientist with strong ML background...'
  },
  {
    id: '3',
    jobId: '2',
    seekerId: '2',
    seekerName: 'Sarah Chen',
    jobTitle: 'UX/UI Designer',
    company: 'Innovate.io',
    appliedDate: '2026-04-03',
    status: 'applied',
    score: 95,
    resumeId: '2',
    coverLetter: 'I would love to bring my design expertise to Innovate.io...'
  },
  {
    id: '4',
    jobId: '4',
    seekerId: '7',
    seekerName: 'Lisa Kim',
    jobTitle: 'DevOps Engineer',
    company: 'TechCorp Solutions',
    appliedDate: '2026-04-04',
    status: 'applied',
    score: 85,
    resumeId: '4',
    coverLetter: 'With 6 years of DevOps experience...'
  },
  {
    id: '5',
    jobId: '1',
    seekerId: '6',
    seekerName: 'James Wilson',
    jobTitle: 'Senior React Developer',
    company: 'TechCorp Solutions',
    appliedDate: '2026-04-02',
    status: 'rejected',
    score: 45,
    resumeId: '3',
    coverLetter: 'I am interested in transitioning to frontend development...'
  },
  {
    id: '6',
    jobId: '5',
    seekerId: '1',
    seekerName: 'Alex Johnson',
    jobTitle: 'Full Stack Developer',
    company: 'Innovate.io',
    appliedDate: '2026-04-05',
    status: 'applied',
    score: 78,
    resumeId: '1',
    coverLetter: 'I am a full-stack developer looking for new challenges...'
  },
  {
    id: '7',
    jobId: '3',
    seekerId: '1',
    seekerName: 'Alex Johnson',
    jobTitle: 'Machine Learning Engineer',
    company: 'CloudNine Systems',
    appliedDate: '2026-04-03',
    status: 'reviewed',
    score: 52,
    resumeId: '1',
    coverLetter: 'While my primary expertise is web development, I have Python and data skills...'
  }
];

export const mockResumes = [
  {
    id: '1',
    seekerId: '1',
    fileName: 'Alex_Johnson_Resume.pdf',
    uploadDate: '2026-03-15',
    fileSize: '245 KB',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'Python', 'PostgreSQL']
  },
  {
    id: '2',
    seekerId: '2',
    fileName: 'Sarah_Chen_Resume.pdf',
    uploadDate: '2026-03-18',
    fileSize: '198 KB',
    skills: ['Figma', 'UI/UX', 'Design Systems', 'User Research', 'Prototyping']
  },
  {
    id: '3',
    seekerId: '6',
    fileName: 'James_Wilson_Resume.pdf',
    uploadDate: '2026-03-20',
    fileSize: '312 KB',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'SQL', 'Machine Learning', 'NLP']
  },
  {
    id: '4',
    seekerId: '7',
    fileName: 'Lisa_Kim_Resume.pdf',
    uploadDate: '2026-03-22',
    fileSize: '267 KB',
    skills: ['Kubernetes', 'Docker', 'Terraform', 'AWS', 'CI/CD', 'Linux']
  }
];

// Analytics data for admin dashboard
export const mockAnalytics = {
  totalUsers: 156,
  totalJobs: 48,
  totalApplications: 312,
  activeSessions: 23,
  registrationsByMonth: [
    { month: 'Oct', seekers: 12, recruiters: 3 },
    { month: 'Nov', seekers: 18, recruiters: 5 },
    { month: 'Dec', seekers: 15, recruiters: 4 },
    { month: 'Jan', seekers: 22, recruiters: 7 },
    { month: 'Feb', seekers: 28, recruiters: 6 },
    { month: 'Mar', seekers: 35, recruiters: 9 },
    { month: 'Apr', seekers: 26, recruiters: 8 },
  ],
  jobsByCategory: [
    { category: 'Engineering', count: 18 },
    { category: 'Design', count: 8 },
    { category: 'Data Science', count: 7 },
    { category: 'DevOps', count: 6 },
    { category: 'Product', count: 5 },
    { category: 'Marketing', count: 4 },
  ],
  applicationStatus: [
    { name: 'Applied', value: 145, color: '#3b82f6' },
    { name: 'Reviewed', value: 78, color: '#f59e0b' },
    { name: 'Shortlisted', value: 52, color: '#10b981' },
    { name: 'Rejected', value: 37, color: '#ef4444' },
  ]
};

// Helper to simulate API delay
export const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Score matching function
export function calculateMatchScore(seekerSkills = [], jobRequirements = []) {
  if (!jobRequirements.length) return 0;
  const normalizedSeeker = seekerSkills.map(s => s.toLowerCase());
  const normalizedReqs = jobRequirements.map(r => r.toLowerCase());
  const matches = normalizedReqs.filter(req =>
    normalizedSeeker.some(skill => skill.includes(req) || req.includes(skill))
  );
  return Math.round((matches.length / normalizedReqs.length) * 100);
}
