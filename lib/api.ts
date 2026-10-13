import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getAssetUrl = (path: string | null | undefined) => {
  if (!path) return undefined;
  if (path.startsWith('http')) return path;
  if (path.startsWith('/')) return path;
  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace('/api', '');
  return baseUrl + '/' + path;
};

export const apiService = {
  getProducts: async (params: any = {}) => {
    const res = await api.get('/products', { params });
    return res.data?.data || res.data || [];
  },
  getProductById: async (id: string | number) => {
    const res = await api.get(`/products/${id}`);
    return res.data?.data || res.data;
  },
  getProductsByCategory: async (categoryId: string | number) => {
    const res = await api.get('/products', { params: { category_id: categoryId } });
    return res.data?.data || res.data || [];
  },
  getCategories: async (params: any = {}) => {
    const res = await api.get('/categories', { params });
    return res.data?.data || res.data || [];
  },
  getCertificates: async (params: any = {}) => {
    const res = await api.get('/certificates', { params });
    return res.data?.data || res.data || [];
  },
  getTeamMembers: async (params: any = {}) => {
    const res = await api.get('/team-members', { params });
    return res.data?.data || res.data || [];
  },
  getContactInfo: async (params: any = {}) => {
    const res = await api.get('/contact', { params });
    return res.data?.data || res.data || [];
  },
  getContact: async (params: any = {}) => {
    const res = await api.get('/contact', { params });
    return res.data?.data || res.data || [];
  },
  sendMessage: async (data: { name: string; email: string; phone?: string; subject: string; message: string }) => {
    const res = await api.post('/messages', data);
    return res.data;
  },
  sendContactMessage: async (data: { name: string; email: string; phone?: string; subject: string; message: string }) => {
    const res = await api.post('/messages', data);
    return res.data;
  },
};

export default api;
