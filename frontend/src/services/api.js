import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('imovies_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth Services
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/profile', userData)
};

// Movie Services
export const moviesAPI = {
  getAll: (params) => api.get('/movies', { params }),
  getFeatured: () => api.get('/movies/featured'),
  getById: (id) => api.get(`/movies/${id}`),
  create: (data) => api.post('/movies', data),
  update: (id, data) => api.put(`/movies/${id}`, data),
  delete: (id) => api.delete(`/movies/${id}`)
};

// Cinema Services
export const cinemasAPI = {
  getAll: (params) => api.get('/cinemas', { params }),
  getById: (id) => api.get(`/cinemas/${id}`),
  create: (data) => api.post('/cinemas', data),
  update: (id, data) => api.put(`/cinemas/${id}`, data),
  delete: (id) => api.delete(`/cinemas/${id}`)
};

// Showtime Services
export const showtimesAPI = {
  getAll: (params) => api.get('/showtimes', { params }),
  getById: (id) => api.get(`/showtimes/${id}`),
  create: (data) => api.post('/showtimes', data),
  delete: (id) => api.delete(`/showtimes/${id}`)
};

// Booking Services
export const bookingsAPI = {
  create: (bookingData) => api.post('/bookings', bookingData),
  getMyBookings: () => api.get('/bookings/my-bookings'),
  getById: (id) => api.get(`/bookings/${id}`),
  cancel: (id) => api.put(`/bookings/${id}/cancel`),
  getAll: () => api.get('/bookings')
};

export default api;

