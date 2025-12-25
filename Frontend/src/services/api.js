import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {

      localStorage.removeItem('token');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  adminLogin: () => api.post('/auth/admin/login', {
    username: 'Admin',
    password: 'KorokNET'
  }),
  getMe: () => api.get('/auth/me')
};

export const applicationsAPI = {
  create: (data) => api.post('/applications', data),
  getAll: () => api.get('/applications'),
  addFeedback: (id, data) => api.post(`/applications/${id}/feedback`, data)
};

export const adminAPI = {
  getAllApplications: (params) => api.get('/admin/applications', { params }),
  updateStatus: (id, data) => api.put(`/admin/applications/${id}/status`, data),
  getStatistics: () => api.get('/admin/statistics')
};

export default api;